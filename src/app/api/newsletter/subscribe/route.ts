import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).optional(),
});

/**
 * Newsletter subscribe.
 *
 * Flow:
 *   1. Validate email.
 *   2. Add the email as a contact in the Resend audience (so the daily
 *      digest cron has a real list to send to). Idempotent — Resend
 *      treats a duplicate email as a 200 with no side effect.
 *   3. Send a welcome email to the new subscriber.
 *
 * If RESEND_API_KEY or RESEND_AUDIENCE_ID is missing we still 200 the
 * subscriber so local dev / preview flows do not blow up. In production
 * both env vars are required.
 */
export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, message: 'Please enter a valid email.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@mail.recipecrave.com';

  if (!apiKey) {
    return NextResponse.json({ ok: true, message: 'Subscribed (dev mode — no email sent).' });
  }

  const resend = new Resend(apiKey);

  // Add to audience first. If this fails we still try the welcome email
  // so the subscriber sees something; we log the audience error for
  // owner visibility.
  if (audienceId) {
    try {
      await resend.contacts.create({
        email: parsed.email,
        audienceId,
        unsubscribed: false,
      });
    } catch (err) {
      console.error('[newsletter] audience.create failed', err);
      // continue — non-fatal
    }
  }

  try {
    await resend.emails.send({
      from: `RecipeCrave <${fromEmail}>`,
      to: parsed.email,
      subject: 'Welcome to RecipeCrave',
      html: `
        <h1 style="font-family: Georgia, serif; color: #1F1B16;">Welcome to RecipeCrave</h1>
        <p>Thanks for joining. Each weekday we send three free, tested recipes with calories, costs, and step-by-step instructions.</p>
        <p>Want a head start? <a href="https://recipecrave.com/meal-planner" style="color: #C75D3C;">Generate a free meal plan</a>.</p>
        <p style="font-size: 12px; color: #6B6660;">You are getting this because you signed up on recipecrave.com. Unsubscribe any time.</p>
      `,
    });
    return NextResponse.json({ ok: true, message: 'Welcome aboard.' });
  } catch (err) {
    console.error('[newsletter] send failed', err);
    return NextResponse.json({ ok: false, message: 'Could not subscribe. Try again.' }, { status: 500 });
  }
}
