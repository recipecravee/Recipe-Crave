import type { Metadata } from 'next';
import Link from 'next/link';
import { CUISINES, SITE } from '@/lib/constants';
import { getAllRecipes } from '@/lib/data/recipes';

export const metadata: Metadata = {
  title: `All ${CUISINES.length} World Cuisines`,
  description: `Browse recipes from ${CUISINES.length} regional cuisines, from West African jollof to Persian saffron pilaf to Soul Food classics. Filter by region and dive into authentic technique.`,
  alternates: { canonical: `${SITE.url}/cuisines` },
  openGraph: {
    title: `All ${CUISINES.length} world cuisines on RecipeCrave`,
    description: 'Browse every cuisine RecipeCrave covers — regional landing pages with recipes, technique notes, and pairing guidance.',
    url: `${SITE.url}/cuisines`,
    images: [
      {
        url: `${SITE.url}/api/og?eyebrow=Cuisines&accent=terracotta&title=${encodeURIComponent('Every world cuisine on RecipeCrave')}&subtitle=${encodeURIComponent('Regional landing pages with recipes, technique, and pairing guidance.')}`,
        width: 1200,
        height: 630,
        alt: 'RecipeCrave world cuisines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `All ${CUISINES.length} world cuisines on RecipeCrave`,
    description: 'Browse every cuisine RecipeCrave covers — regional landing pages with recipes, technique notes, and pairing guidance.',
    images: [
      `${SITE.url}/api/og?eyebrow=Cuisines&accent=terracotta&title=${encodeURIComponent('Every world cuisine on RecipeCrave')}&subtitle=${encodeURIComponent('Regional landing pages with recipes, technique, and pairing guidance.')}`,
    ],
  },
};

export const revalidate = 3600;

export default async function CuisinesIndexPage() {
  const all = await getAllRecipes();
  const counts = new Map<string, number>();
  for (const r of all) {
    if (r.cuisine) counts.set(r.cuisine, (counts.get(r.cuisine) ?? 0) + 1);
  }

  // Sort by recipe count descending so the most-developed cuisines surface
  // first, then alphabetically for the long tail. Cuisines with zero recipes
  // still render — they signal coverage breadth and act as content roadmap.
  const sorted = [...CUISINES].sort((a, b) => {
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
          <li className="text-ink">All cuisines</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-terracotta-500">By cuisine</p>
        <h1 className="mt-1 font-serif text-4xl text-ink sm:text-5xl">
          All {CUISINES.length} world cuisines
        </h1>
        <p className="mt-4 text-base text-ink-muted">
          Every regional tradition on RecipeCrave gets its own landing page —
          recipes grouped by course, technique notes, ingredient sourcing tips,
          and drink pairings that make sense for the cuisine. Click any tile
          below to dive in.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {sorted.map((c) => {
          const n = counts.get(c.slug) ?? 0;
          return (
            <Link
              key={c.slug}
              href={`/cuisine/${c.slug}`}
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-ring sm:p-6"
            >
              <span className="text-3xl sm:text-4xl" aria-hidden>{c.emoji}</span>
              <span className="font-serif text-base font-semibold text-ink group-hover:text-terracotta-500 sm:text-lg">
                {c.name}
              </span>
              <span className="text-xs font-medium text-ink-muted">
                {n > 0 ? `${n} ${n === 1 ? 'recipe' : 'recipes'}` : 'Coming soon'}
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
