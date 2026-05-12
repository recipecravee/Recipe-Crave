import type { Metadata } from 'next';
import Link from 'next/link';
import { DIETS, SITE } from '@/lib/constants';
import { getAllRecipes } from '@/lib/data/recipes';

export const metadata: Metadata = {
  title: `All ${DIETS.length} Dietary Patterns — RecipeCrave`,
  description: `Browse recipes filtered by dietary pattern — vegan, keto, gluten-free, Mediterranean, low-FODMAP, Whole30, and ${DIETS.length - 6} more. Each diet has a dedicated landing page with rules and recipes.`,
  alternates: { canonical: `${SITE.url}/diets` },
  openGraph: {
    title: `All ${DIETS.length} dietary patterns on RecipeCrave`,
    description: 'Browse every dietary pattern RecipeCrave supports. Each diet page explains the rules and shows nutrition-matched recipes.',
    url: `${SITE.url}/diets`,
  },
};

export const revalidate = 3600;

export default async function DietsIndexPage() {
  const all = await getAllRecipes();
  const counts = new Map<string, number>();
  for (const r of all) {
    for (const d of r.dietaryTags ?? []) {
      counts.set(d, (counts.get(d) ?? 0) + 1);
    }
  }

  const sorted = [...DIETS].sort((a, b) => {
    const ca = counts.get(a.slug) ?? 0;
    const cb = counts.get(b.slug) ?? 0;
    if (cb !== ca) return cb - ca;
    return a.name.localeCompare(b.name);
  });

  return (
    <article className="container py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-ink">All diets</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-forest-700">By dietary pattern</p>
        <h1 className="mt-1 font-serif text-4xl text-ink sm:text-5xl">
          All {DIETS.length} dietary patterns
        </h1>
        <p className="mt-4 text-base text-ink-muted">
          Pick a pattern and the recipe library narrows automatically.
          Each diet page explains the rules in plain English, flags
          contraindications, and lists nutrition-matched recipes with
          per-serving macros.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {sorted.map((d) => {
          const n = counts.get(d.slug) ?? 0;
          return (
            <Link
              key={d.slug}
              href={`/diet/${d.slug}`}
              className="group flex flex-col items-start justify-between gap-2 rounded-2xl border border-ink/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-forest-400 hover:shadow-md focus-ring sm:p-6"
            >
              <span className="font-serif text-base font-semibold text-ink group-hover:text-forest-700 sm:text-lg">
                {d.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-forest-500" aria-hidden />
                {n > 0 ? `${n} ${n === 1 ? 'recipe' : 'recipes'}` : 'Coming soon'}
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
