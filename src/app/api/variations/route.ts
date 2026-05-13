import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  recipe_slug: z.string().min(1).max(200),
  display_name: z.string().max(80).optional().or(z.literal('')),
  body: z.string().min(20).max(4000),
});

/**
 * POST /api/variations
 *
 * Public endpoint — anyone can submit a recipe variation. Rows land
 * with status = 'pending' and only appear on the public recipe page
 * after an admin approves them in /admin/variations.
 *
 * Uses the anon key (RLS policy `recipe_variations_anyone_insert`
 * permits insert when status='pending'). Adds rudimentary content
 * checks so we don't accept very short / very long bodies.
 */
export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Variation must be 20-4000 characters.' },
      { status: 400 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json(
      { ok: false, message: 'Server is not configured to accept submissions yet.' },
      { status: 500 },
    );
  }
  const supabase = createClient(url, anon, { auth: { persistSession: false } });

  const { error } = await supabase.from('recipe_variations').insert({
    recipe_slug: parsed.recipe_slug,
    display_name: parsed.display_name?.trim() || null,
    body: parsed.body.trim(),
    status: 'pending',
  });

  if (error) {
    console.error('[variations] insert failed', error);
    return NextResponse.json(
      { ok: false, message: 'Could not submit. Try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: 'Thanks — your variation is queued for review. Approved ones publish within 7 days.',
  });
}
