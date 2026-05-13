import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { CUISINES } from '@/lib/constants';
import { getRecipesByCuisine } from '@/lib/data/recipes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/structured-data';

export async function generateStaticParams() {
  return CUISINES.map((c) => ({ cuisine: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ cuisine: string }> }): Promise<Metadata> {
  const { cuisine } = await params;
  const data = CUISINES.find((c) => c.slug === cuisine);
  if (!data) return { title: 'Not found' };
  return {
    title: `${data.name} Recipes — Free, Tested & Step-by-Step`,
    description: `Discover authentic ${data.name} recipes with calories, costs, and step-by-step instructions on every dish. Filter by diet, time, and difficulty.`,
    alternates: { canonical: `/cuisine/${cuisine}` },
  };
}

export default async function CuisinePage({ params }: { params: Promise<{ cuisine: string }> }) {
  const { cuisine } = await params;
  const data = CUISINES.find((c) => c.slug === cuisine);
  if (!data) notFound();

  const recipes = await getRecipesByCuisine(cuisine);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipes' },
    { name: data.name, url: `/cuisine/${cuisine}` },
  ];

  return (
    <div className="container py-10 lg:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          itemListJsonLd(recipes.map((r) => ({ name: r.title, url: `/recipes/${r.slug}` }))),
        ]}
      />

      <header className="mb-10">
        <p className="text-5xl" aria-hidden>{data.emoji}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">{data.name} Recipes</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          {data.name} cooking spans centuries of regional tradition, vibrant spice blends, and weeknight-friendly techniques.
          Below are our tested {data.name} recipes — each with calories, per-serving cost, and step-by-step instructions designed to actually fit a busy kitchen.
        </p>
      </header>

      {recipes.length === 0 ? (
        <div className="space-y-8">
          {/* Rich empty-state — never shows blank to a crawler or visitor. */}
          <div className="rounded-3xl border border-cream-200 bg-cream-50/60 p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              We are mid-shoot on this cuisine
            </p>
            <h2 className="mt-2 font-serif text-2xl text-ink">
              {data.name} dishes our editors are testing right now
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-ink-muted">
              Our kitchen team rotates through {CUISINES.length} world cuisines each season.
              {' '}
              {data.name} is on the current rotation — first recipes typically land within
              {' '}
              4-8 weeks of a cuisine being added. In the meantime, you can browse the rest
              of the world cuisines below, send in a {data.name} recipe of your own, or
              jump to a nearby tradition while you wait.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/submit-recipe"
                className="rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-terracotta-600 focus-ring"
              >
                ✍️ Submit a {data.name} recipe
              </Link>
              <Link
                href="/cuisines"
                className="rounded-full border-2 border-forest-300 bg-white px-5 py-2.5 text-sm font-bold text-forest-700 hover:border-forest-500 focus-ring"
              >
                Browse all {CUISINES.length} cuisines
              </Link>
              <Link
                href="/recipes"
                className="rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 text-sm font-bold text-ink hover:border-ink/30 focus-ring"
              >
                See every recipe
              </Link>
            </div>
          </div>

          {/* Nearby cuisines — picks 6 random other cuisines so the page links
              out rather than dead-ending. */}
          <section>
            <h2 className="mb-4 font-serif text-2xl">Nearby cuisines to explore</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CUISINES.filter((c) => c.slug !== cuisine).slice(0, 6).map((c) => (
                <Link
                  key={c.slug}
                  href={`/cuisine/${c.slug}`}
                  className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="text-3xl" aria-hidden>{c.emoji}</span>
                  <span className="font-serif text-sm font-bold text-ink group-hover:text-terracotta-500">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
