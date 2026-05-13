import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/variations?status=pending
 *
 * Lists recipe_variations rows filtered by status. Auth via the
 * shared admin cookie. Uses the Supabase service role key so RLS is
 * bypassed — this is the moderation queue.
 */
export async function GET(req: Request) {
  const c = await cookies();
  if (!verifySession(c.get(ADMIN_COOKIE_NAME)?.value).ok) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get('status') ?? 'pending';
  if (!['pending', 'approved', 'rejected', 'spam'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'bad status' }, { status: 400 });
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

  const { data, error } = await supabase
    .from('recipe_variations')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, items: data ?? [] });
}
