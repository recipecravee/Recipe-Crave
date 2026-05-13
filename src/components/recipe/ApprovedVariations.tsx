import { createClient } from '@supabase/supabase-js';
import { Users } from 'lucide-react';

type Variation = {
  id: string;
  display_name: string | null;
  body: string;
  ingredient_swaps: Array<{ from?: string; to?: string; reason?: string }> | null;
  helpful_count: number;
  created_at: string;
};

/**
 * Reads approved recipe_variations for the given slug via the public
 * REST API. Uses the anon key — Supabase RLS allows SELECT where
 * status = 'approved', so anonymous visitors see only approved entries.
 *
 * Server-rendered. Renders nothing when the table is empty so we
 * never ship an awkward "No variations yet — be the first" block on
 * recipes that simply have no community input.
 */
export async function ApprovedVariations({ recipeSlug }: { recipeSlug: string }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const supabase = createClient(url, anon, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from('recipe_variations')
    .select('id, display_name, body, ingredient_swaps, helpful_count, created_at')
    .eq('recipe_slug', recipeSlug)
    .eq('status', 'approved')
    .order('helpful_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-forest-200 bg-forest-50/40 p-6 shadow-sm sm:p-8">
      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-700">
        <Users className="h-4 w-4" aria-hidden />
        Community variations ({data.length})
      </div>
      <h2 className="font-serif text-2xl text-ink">How RecipeCrave cooks make this dish their own</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Tested variations submitted by readers, reviewed by the kitchen team before publishing.
      </p>

      <ul className="mt-6 space-y-4">
        {(data as Variation[]).map((v) => (
          <li
            key={v.id}
            className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-serif text-base font-bold text-ink">
                {v.display_name?.trim() || 'Anonymous cook'}
              </p>
              <p className="text-xs text-ink-subtle">
                {v.helpful_count} found this helpful · {new Date(v.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">{v.body}</p>

            {v.ingredient_swaps && v.ingredient_swaps.length > 0 ? (
              <ul className="mt-3 space-y-1 text-sm">
                {v.ingredient_swaps.slice(0, 5).map((s, i) => (
                  <li key={i} className="rounded-lg bg-cream-50 px-3 py-1.5">
                    <span className="text-ink-muted line-through">{s.from ?? '?'}</span>
                    <span className="mx-2 text-terracotta-500">→</span>
                    <span className="text-ink">{s.to ?? '?'}</span>
                    {s.reason ? (
                      <span className="text-xs text-ink-subtle"> · {s.reason}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
