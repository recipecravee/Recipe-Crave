import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/push-test
 *
 * Owner-only utility to fan out a test push to every active
 * subscription. Returns counts so the admin dashboard can confirm
 * VAPID is correctly wired without waiting for the 09:00 cron.
 *
 * Body (optional):
 *   { title?: string, body?: string, url?: string }
 *
 * Gated behind the admin cookie. Returns 503 cleanly when VAPID keys
 * aren't set or the push_subscriptions table doesn't exist yet.
 */
export async function POST(req: Request) {
  // Auth gate
  const c = await cookies();
  const session = verifySession(c.get(ADMIN_COOKIE_NAME)?.value);
  if (!session.ok) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // Optional body
  let payload: { title?: string; body?: string; url?: string } = {};
  try {
    payload = await req.json();
  } catch {
    /* empty body OK */
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:hello@recipecrave.com';
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json(
      { ok: false, error: 'VAPID keys not configured. See drizzle/0002_push_subscriptions.sql.' },
      { status: 503 },
    );
  }
  if (!supaUrl || !serviceKey) {
    return NextResponse.json({ ok: false, error: 'supabase not configured' }, { status: 503 });
  }

  let webpush: typeof import('web-push');
  try {
    webpush = await import('web-push');
  } catch {
    return NextResponse.json({ ok: false, error: 'web-push not installed' }, { status: 503 });
  }
  webpush.setVapidDetails(subject, vapidPublic, vapidPrivate);

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supaUrl, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .is('unsubscribed_at', null);
  if (error) {
    return NextResponse.json(
      { ok: false, error: 'push_subscriptions table missing — run drizzle/0002 first' },
      { status: 503 },
    );
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, total: 0, message: 'No active subscriptions' });
  }

  const json = JSON.stringify({
    title: payload.title ?? 'Test push from RecipeCrave',
    body: payload.body ?? 'If you see this, VAPID is wired correctly.',
    url: payload.url ?? 'https://www.recipecrave.com',
  });

  let sent = 0;
  let failed = 0;
  for (const sub of data as Array<{ endpoint: string; p256dh: string; auth: string }>) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        json,
        { TTL: 60 * 60 },
      );
      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed, total: data.length });
}
