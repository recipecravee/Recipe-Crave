import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, message: 'Please enter a valid email.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@recipecrave.com';

  if (!apiKey) {
    return NextResponse.json({ ok: true, message: 'Subscribed (dev mode — no email sent).' });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `RecipeCrave <${fromEmail}>`,
      to: parsed.email,
      subject: 'Welcome to RecipeCrave',
      html: `
        <h1 style="font-family: Georgia, serif; color: #1F1B16;">Welcome to RecipeCrave</h1>
        <p>Thanks for joining. Each week we'll send a handful of free, tested recipes with calories, costs, and step-by-step instructions.</p>
        <p>Want a head start? <a href="https://recipecrave.com/meal-planner" style="color: #C75D3C;">Generate a free meal plan</a>.</p>
        <p style="font-size: 12px; color: #6B6660;">You're getting this because you signed up on recipecrave.com. Unsubscribe any time.</p>
      `,
    });
    return NextResponse.json({ ok: true, message: 'Welcome aboard.' });
  } catch (err) {
    console.error('[newsletter] send failed', err);
    return NextResponse.json({ ok: false, message: 'Could not subscribe. Try again.' }, { status: 500 });
  }
}
