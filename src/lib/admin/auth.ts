import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Lightweight admin-only auth.
 *
 * One owner, one password — no user table, no Supabase, no third-party
 * auth provider needed. The credentials live in env vars and the session
 * is an HMAC-signed cookie that Next.js Route Handlers issue and the
 * dashboard page verifies on each request.
 *
 * Security choices:
 *   - timingSafeEqual everywhere (no string == on credentials or MACs)
 *   - HttpOnly + Secure + SameSite=Strict cookie (no client JS access,
 *     no CSRF via cross-site form posts)
 *   - 24-hour session lifetime baked into the signed payload, server
 *     re-verifies expiry on every protected request
 *   - Cookie secret rotation = bump ADMIN_COOKIE_SECRET env var; all
 *     existing sessions invalidate
 */

export const ADMIN_COOKIE_NAME = 'rc-admin';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function constantTimeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? '';
  const p = process.env.ADMIN_PASSWORD ?? '';
  if (!u || !p) return false;
  return constantTimeStringEqual(username, u) && constantTimeStringEqual(password, p);
}

function getSecret(): string | null {
  return process.env.ADMIN_COOKIE_SECRET ?? null;
}

function hmac(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Build a signed session token. Payload encodes the username and the
 * expiry timestamp so the server can reject sessions older than the TTL
 * without keeping per-user state.
 */
export function signSession(username: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ u: username, exp })).toString('base64url');
  const mac = hmac(payload, secret);
  return `${payload}.${mac}`;
}

export function verifySession(token: string | undefined | null): { ok: boolean; username?: string } {
  if (!token) return { ok: false };
  const secret = getSecret();
  if (!secret) return { ok: false };
  const idx = token.lastIndexOf('.');
  if (idx < 0) return { ok: false };
  const payload = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expected = hmac(payload, secret);
  if (!constantTimeStringEqual(mac, expected)) return { ok: false };
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      u?: unknown;
      exp?: unknown;
    };
    if (typeof parsed.u !== 'string' || typeof parsed.exp !== 'number') return { ok: false };
    if (parsed.exp < Date.now()) return { ok: false };
    return { ok: true, username: parsed.u };
  } catch {
    return { ok: false };
  }
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24,
};
