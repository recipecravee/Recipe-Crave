import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAllRecipes } from '@/lib/data/recipes';
import { SITE } from '@/lib/constants';

export const runtime = 'nodejs';
// Re-evaluate on every request so the cron picks fresh recipes each day.
export const dynamic = 'force-dynamic';

/**
 * TODO #13 — Daily digest cron.
 *
 * Scheduled by vercel.json to fire 09:00 UTC every day. Picks 3 recipes
 * deterministically for today's date and sends a digest email to every
 * subscribed contact in the Resend audience.
 *
 * Auth: Vercel Cron requests carry a `Authorization: Bearer <CRON_SECRET>`
 * header (set via env). Any non-cron caller hitting this URL will be
 * rejected unless they present the secret.
 *
 * Recipient list: Resend Audience identified by RESEND_AUDIENCE_ID.
 * Contacts are added by the /api/newsletter/subscribe route when a
 * visitor opts in. The cron fetches `contacts.list({ audienceId })`,
 * filters out unsubscribed, and sends one email per remaining contact.
 *
 * If the audience is empty OR RESEND_AUDIENCE_ID is unset, the cron
 * falls back to `DIGEST_TEST_TO` (defaults to the owner email) so the
 * daily preview still arrives. This lets the cron be useful from day 1.
 *
 * Rate limiting: Resend free tier caps at 100 emails/day. The cron sends
 * sequentially and bails (HTTP 429) once that limit is reached, so an
 * audience over 100 silently rotates across multiple days. Upgrade tier
 * + remove the guard to ship to everyone every day.
 */

const ADMIN_FALLBACK_TO = 'recipecrave@gmail.com';
const FREE_TIER_DAILY_CAP = 100;

export async function GET(req: Request) {
  // Auth — Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
  const auth = req.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'CRON_SECRET not configured' },
      { status: 500 },
    );
  }
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'RESEND_API_KEY not configured' },
      { status: 500 },
    );
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@mail.recipecrave.com';
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fallbackTo = process.env.DIGEST_TEST_TO ?? ADMIN_FALLBACK_TO;

  // Pick today's 3 recipes deterministically — same triplet for everyone
  // who runs the cron on the same calendar day. Day-of-year drives the
  // offset, so the digest rotates through the library across the year.
  const recipes = await getAllRecipes();
  if (recipes.length === 0) {
    return NextResponse.json({ ok: false, error: 'no recipes' }, { status: 500 });
  }
  const today = new Date();
  const startOfYear = Date.UTC(today.getUTCFullYear(), 0, 0);
  const dayIdx = Math.floor((today.getTime() - startOfYear) / 86400000);
  const offset = (dayIdx * 3) % Math.max(1, recipes.length);
  const picks = [
    recipes[offset % recipes.length]!,
    recipes[(offset + 1) % recipes.length]!,
    recipes[(offset + 2) % recipes.length]!,
  ];

  const [a, b, c] = picks;
  if (!a || !b || !c) {
    return NextResponse.json({ ok: false, error: 'pick assembly failed' }, { status: 500 });
  }
  const subject = `Today on RecipeCrave: ${a.title}, ${b.title}, ${c.title}`;
  const html = renderDigestHtml(picks);

  const resend = new Resend(apiKey);

  // Build the recipient list. Resend Audience first; fallback to the
  // owner email when audience is empty or unconfigured.
  let recipients: string[] = [];
  if (audienceId) {
    try {
      const list = await resend.contacts.list({ audienceId });
      const data = list.data?.data ?? [];
      recipients = data
        .filter((c) => !c.unsubscribed)
        .map((c) => c.email)
        .filter((e): e is string => typeof e === 'string' && e.length > 0);
    } catch (err) {
      console.error('[digest] audience.list failed', err);
    }
  }
  if (recipients.length === 0) recipients = [fallbackTo];
  if (recipients.length > FREE_TIER_DAILY_CAP) {
    // Trim to free-tier cap. We rotate which slice of the audience gets
    // the digest based on day-of-year so over time every subscriber
    // receives an email.
    const offsetWithinDay = dayIdx % Math.ceil(recipients.length / FREE_TIER_DAILY_CAP);
    const start = offsetWithinDay * FREE_TIER_DAILY_CAP;
    recipients = recipients.slice(start, start + FREE_TIER_DAILY_CAP);
  }

  const sent: string[] = [];
  const failed: { email: string; error: string }[] = [];
  for (const email of recipients) {
    try {
      await resend.emails.send({
        from: `RecipeCrave Daily <${fromEmail}>`,
        to: email,
        subject,
        html,
        headers: {
          'X-Entity-Ref-ID': `digest-${today.toISOString().slice(0, 10)}`,
        },
      });
      sent.push(email);
    } catch (err) {
      failed.push({ email, error: err instanceof Error ? err.message : 'send failed' });
    }
  }

  // ============================================================
  // Push notifications side — fire alongside email when VAPID
  // configured + push_subscriptions table populated. Failure here is
  // never fatal; emails already went out.
  // ============================================================
  const pushResult = await sendDigestPushes(a, b, c);

  return NextResponse.json({
    ok: failed.length === 0,
    sentCount: sent.length,
    failedCount: failed.length,
    pushSent: pushResult.sent,
    pushFailed: pushResult.failed,
    picks: picks.map((p) => p.slug),
    failures: failed.slice(0, 5),
  });
}

/**
 * Send a Web Push notification per subscription. No-ops when VAPID
 * keys missing or the push_subscriptions table doesn't exist yet —
 * lets the cron route ship before owner has wired the push side.
 */
async function sendDigestPushes(
  a: RecipePick,
  b: RecipePick,
  c: RecipePick,
): Promise<{ sent: number; failed: number }> {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:hello@recipecrave.com';
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!vapidPublic || !vapidPrivate || !supaUrl || !serviceKey) {
    return { sent: 0, failed: 0 };
  }

  let webpush: typeof import('web-push');
  try {
    webpush = await import('web-push');
  } catch {
    // web-push not installed yet — silently skip.
    return { sent: 0, failed: 0 };
  }
  webpush.setVapidDetails(subject, vapidPublic, vapidPrivate);

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supaUrl, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .is('unsubscribed_at', null);
  if (error || !data || data.length === 0) return { sent: 0, failed: 0 };

  const payload = JSON.stringify({
    title: 'Three recipes for today',
    body: `${a.title} · ${b.title} · ${c.title}`,
    url: `https://recipecrave.com/recipes/${a.slug}`,
  });

  let sent = 0;
  let failed = 0;
  const expired: string[] = [];
  for (const sub of data as Array<{ id: string; endpoint: string; p256dh: string; auth: string }>) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
        { TTL: 60 * 60 * 12 },
      );
      sent++;
    } catch (err) {
      failed++;
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        // Subscription gone — mark for cleanup.
        expired.push(sub.id);
      }
    }
  }

  // Mark dead subs unsubscribed so the next cron skips them.
  if (expired.length > 0) {
    await supabase
      .from('push_subscriptions')
      .update({ unsubscribed_at: new Date().toISOString() })
      .in('id', expired);
  }

  return { sent, failed };
}

type RecipePick = {
  slug: string;
  title: string;
  description: string;
  heroImage: string | null;
  totalTimeMin: number;
  servings: number;
  costPerServingUsd: number | null;
};

function renderDigestHtml(recipes: RecipePick[]): string {
  const cards = recipes
    .map((r) => {
      const cost =
        typeof r.costPerServingUsd === 'number'
          ? `$${r.costPerServingUsd.toFixed(2)}/serving · `
          : '';
      const img = r.heroImage
        ? `<img src="${escapeHtml(r.heroImage)}" alt="${escapeHtml(r.title)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:12px;margin-bottom:12px;" />`
        : '';
      return `
        <tr><td style="padding:0 0 28px 0;">
          <a href="${SITE.url}/recipes/${r.slug}" style="text-decoration:none;color:inherit;">
            ${img}
            <h2 style="margin:8px 0 4px 0;font-family:Georgia,serif;color:#1F1B16;font-size:22px;line-height:1.25;">${escapeHtml(r.title)}</h2>
            <p style="margin:0 0 8px 0;font-size:14px;color:#6B6660;line-height:1.5;">${escapeHtml(r.description)}</p>
            <p style="margin:0;font-size:13px;color:#8B8079;">${cost}${r.totalTimeMin} min · serves ${r.servings}</p>
          </a>
        </td></tr>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#FDF8F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1F1B16;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FDF8F1;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.04);">
        <tr><td>
          <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C75D3C;">Today on RecipeCrave</p>
          <h1 style="margin:0 0 22px 0;font-family:Georgia,serif;color:#1F1B16;font-size:28px;line-height:1.2;">Three recipes worth your kitchen today</h1>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            ${cards}
          </table>
          <p style="margin:12px 0 0 0;font-size:13px;color:#6B6660;line-height:1.6;">
            All free. Calories + per-serving cost on every recipe.
            <a href="${SITE.url}/recipes" style="color:#C75D3C;font-weight:600;">Browse the full library →</a>
          </p>
          <hr style="border:none;border-top:1px solid #EFE6D7;margin:24px 0;" />
          <p style="margin:0;font-size:11px;color:#8B8079;line-height:1.5;">
            You are getting this because you subscribed at <a href="${SITE.url}" style="color:#8B8079;">recipecrave.com</a>.
            Reply STOP to opt out of future digests.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
