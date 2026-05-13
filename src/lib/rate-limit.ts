/**
 * In-memory IP-keyed rate limiter for public POST endpoints.
 *
 * Trade-offs: in-memory means each Vercel serverless instance has its
 * own counter, so a determined attacker hitting many cold instances
 * can exceed the cap. Acceptable for our scale (low traffic, low
 * value); upgrade to Vercel KV or Upstash if abuse becomes real.
 *
 * Window is sliding: each call records a timestamp, expired ones get
 * pruned on read.
 */

type Entry = { timestamps: number[] };

const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  opts: { windowMs: number; max: number },
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const e = buckets.get(key) ?? { timestamps: [] };
  // Drop expired stamps
  e.timestamps = e.timestamps.filter((t) => now - t < opts.windowMs);
  if (e.timestamps.length >= opts.max) {
    buckets.set(key, e);
    const oldest = e.timestamps[0] ?? now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: opts.windowMs - (now - oldest),
    };
  }
  e.timestamps.push(now);
  buckets.set(key, e);
  return {
    allowed: true,
    remaining: opts.max - e.timestamps.length,
    resetMs: opts.windowMs,
  };
}

/**
 * Extract a stable client IP from request headers. Vercel's
 * x-forwarded-for is comma-separated client,proxy,... — first entry is
 * the client. Falls back to a fixed key so localhost dev still works.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
