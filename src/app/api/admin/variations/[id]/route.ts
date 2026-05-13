import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PatchSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'spam']),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const c = await cookies();
  if (!verifySession(c.get(ADMIN_COOKIE_NAME)?.value).ok) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let parsed;
  try {
    parsed = PatchSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'bad body' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    return NextResponse.json(
      { ok: false, error: 'supabase not configured' },
      { status: 500 },
    );
  }
  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false },
  });

  const { error } = await supabase
    .from('recipe_variations')
    .update({
      status: parsed.status,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
