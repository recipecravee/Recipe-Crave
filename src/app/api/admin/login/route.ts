import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_OPTIONS, checkCredentials, signSession } from '@/lib/admin/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid body' }, { status: 400 });
  }
  const username = typeof body.username === 'string' ? body.username : '';
  const password = typeof body.password === 'string' ? body.password : '';

  // Tiny anti-bruteforce delay. Real protection comes from the
  // 12-character random password (~80 bits entropy) + HTTPS + the
  // anti-automation already on the edge (Vercel + Cloudflare). This
  // sleep just makes scripted attempts noticeably slow.
  await new Promise((r) => setTimeout(r, 250));

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: 'invalid credentials' }, { status: 401 });
  }
  const token = signSession(username);
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'server not configured (ADMIN_COOKIE_SECRET missing)' },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS);
  return res;
}
