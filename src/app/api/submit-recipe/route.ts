import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  submitter_name: z.string().min(2).max(80),
  submitter_email: z.string().email().max(254),
  submitter_link: z.string().url().max(300).optional().or(z.literal('')),
  recipe_title: z.string().min(3).max(160),
  recipe_description: z.string().min(10).max(1000),
  cuisine: z.string().min(2).max(60),
  servings: z.string().regex(/^\d+$/),
  total_time_min: z.string().regex(/^\d+$/),
  ingredients: z.string().min(20).max(4000),
  instructions: z.string().min(20).max(8000),
  photo_url: z.string().url().max(500).optional().or(z.literal('')),
  notes: z.string().max(2000).optional().or(z.literal('')),
});

const ADMIN_INBOX = process.env.SUBMIT_RECIPE_INBOX ?? 'recipecrave@gmail.com';

/**
 * /api/submit-recipe
 *
 * Forward user-submitted recipes to the owner inbox via Resend. Sends
 * two emails: one to the editorial team (with all submission data) and
 * one confirmation to the submitter (so they know it landed).
 *
 * Sanity caps every field with zod so a malicious submitter can't post
 * megabytes of garbage. No DB write yet — Supabase migration covers
 * that in 0001 if/when owner provisions Supabase.
 */
export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Some fields are missing or invalid. Check and try again.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      message: 'Submission captured (dev mode — no email sent).',
    });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@mail.recipecrave.com';
  const resend = new Resend(apiKey);
  const submittedAt = new Date().toISOString();

  // Email 1 — editorial inbox.
  try {
    await resend.emails.send({
      from: `RecipeCrave Submissions <${fromEmail}>`,
      to: ADMIN_INBOX,
      replyTo: parsed.submitter_email,
      subject: `[Recipe submission] ${parsed.recipe_title} — by ${parsed.submitter_name}`,
      html: editorialEmailHtml(parsed, submittedAt),
    });
  } catch (err) {
    console.error('[submit-recipe] editorial send failed', err);
    return NextResponse.json(
      { ok: false, message: 'Could not send your submission right now. Try again in a minute.' },
      { status: 500 },
    );
  }

  // Email 2 — submitter confirmation. Non-fatal if it fails.
  try {
    await resend.emails.send({
      from: `RecipeCrave Editorial <${fromEmail}>`,
      to: parsed.submitter_email,
      subject: `Got it — your recipe submission for "${parsed.recipe_title}"`,
      html: submitterConfirmationHtml(parsed),
    });
  } catch (err) {
    console.error('[submit-recipe] confirmation send failed', err);
  }

  return NextResponse.json({
    ok: true,
    message: `Thanks ${parsed.submitter_name}. Submission received — our team replies within 7 days.`,
  });
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(s: string): string {
  return esc(s).replace(/\n/g, '<br />');
}

function editorialEmailHtml(
  p: z.infer<typeof RequestSchema>,
  submittedAt: string,
): string {
  const link = p.submitter_link ? `<p><strong>Link:</strong> <a href="${esc(p.submitter_link)}">${esc(p.submitter_link)}</a></p>` : '';
  const photo = p.photo_url ? `<p><strong>Photo URL:</strong> <a href="${esc(p.photo_url)}">${esc(p.photo_url)}</a></p>` : '';
  const notes = p.notes ? `<h3>Notes</h3><p>${nl2br(p.notes)}</p>` : '';
  return `
    <h1 style="font-family:Georgia,serif">${esc(p.recipe_title)}</h1>
    <p><em>${esc(p.recipe_description)}</em></p>
    <p><strong>Submitter:</strong> ${esc(p.submitter_name)} &lt;${esc(p.submitter_email)}&gt;</p>
    ${link}
    <p><strong>Cuisine:</strong> ${esc(p.cuisine)} · <strong>Servings:</strong> ${esc(p.servings)} · <strong>Total time:</strong> ${esc(p.total_time_min)} min</p>
    ${photo}
    <h3>Ingredients</h3>
    <p>${nl2br(p.ingredients)}</p>
    <h3>Instructions</h3>
    <p>${nl2br(p.instructions)}</p>
    ${notes}
    <hr />
    <p style="font-size:11px;color:#888">Submitted ${esc(submittedAt)} via recipecrave.com/submit-recipe</p>
  `;
}

function submitterConfirmationHtml(p: z.infer<typeof RequestSchema>): string {
  return `
    <h1 style="font-family:Georgia,serif;color:#1F1B16">Thanks for sending in your recipe</h1>
    <p>Hi ${esc(p.submitter_name)},</p>
    <p>We received your submission for <strong>${esc(p.recipe_title)}</strong>. Our kitchen team reads every submission within 7 days. If your recipe fits the site, we'll write back with next steps and any clarifying questions.</p>
    <p>You'll get a byline, a bio, and a link back to anywhere you want (Instagram, blog, etc).</p>
    <p>In the meantime, feel free to browse the site or check the editorial guidelines at <a href="https://recipecrave.com/submit-recipe" style="color:#C75D3C">recipecrave.com/submit-recipe</a>.</p>
    <p>— The RecipeCrave Editorial Team</p>
  `;
}
