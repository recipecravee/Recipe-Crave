import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const SubscriptionSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url().max(2000),
    expirationTime: z.number().nullable().optional(),
    keys: z.object({
      p256dh: z.string().max(200),
      auth: z.string().max(200),
    }),
  }),
});

/**
 * POST /api/push/subscribe
 *
 * Stores a Web Push subscription so the daily-digest cron can
 * push-notify it. The endpoint URL is the unique key — repeated calls
 * from the same browser upsert the same row.
 *
 * Owner prerequisites (one-time):
 *   - Generate VAPID keys: `npx web-push generate-vapid-keys`
 *   - Set in Vercel: NEXT_PUBLIC_VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY
 *   - Run the push_subscriptions migration in Supabase SQL editor:
 *
 *     CREATE TABLE IF NOT EXISTS push_subscriptions (
 *       id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *       endpoint     TEXT UNIQUE NOT NULL,
 *       p256dh       TEXT NOT NULL,
 *       auth         TEXT NOT NULL,
 *       user_agent   TEXT,
 *       created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
 *       last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
 *     );
 *     CREATE INDEX IF NOT EXISTS push_subscriptions_last_seen_idx
 *       ON push_subscriptions (last_seen_at);
 *     ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
 *     -- Service role only; no public read/write. Daily cron writes
 *     -- via service role too.
 *
 * Until the migration is applied this route 503s gracefully so the
 * client just shows "Could not enable" and dismisses.
 */
export async function POST(req: Request) {
  // 10 subs per IP per day. Stops casual abuse (someone POSTing fake
  // subscriptions in a loop).
  const ip = clientIp(req);
  const rl = rateLimit(`push-sub:${ip}`, { windowMs: 24 * 60 * 60 * 1000, max: 10 });
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'rate limit' }, { status: 429 });
  }

  let parsed;
  try {
    parsed = SubscriptionSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid subscription' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { ok: false, error: 'push not configured' },
      { status: 503 },
    );
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const ua = req.headers.get('user-agent')?.slice(0, 500) ?? null;
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        endpoint: parsed.subscription.endpoint,
        p256dh: parsed.subscription.keys.p256dh,
        auth: parsed.subscription.keys.auth,
        user_agent: ua,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' },
    );

  if (error) {
    // Likely "table doesn't exist yet" until owner runs the migration.
    // Don't surface DB internals to the client.
    console.error('[push/subscribe] upsert failed', error);
    return NextResponse.json({ ok: false, error: 'storage error' }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
