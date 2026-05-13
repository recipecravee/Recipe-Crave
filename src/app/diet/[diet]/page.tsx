import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { DIETS } from '@/lib/constants';
import { getRecipesByDiet } from '@/lib/data/recipes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/structured-data';

export async function generateStaticParams() {
  return DIETS.map((d) => ({ diet: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ diet: string }> }): Promise<Metadata> {
  const { diet } = await params;
  const data = DIETS.find((d) => d.slug === diet);
  if (!data) return { title: 'Not found' };
  return {
    title: `${data.name} Recipes — Free with Nutrition & Cost`,
    description: `${data.name} recipes with full nutrition data and cost per serving. Filter by cuisine, time, and ingredients. Free, no signup required.`,
    alternates: { canonical: `/diet/${diet}` },
  };
}

export default async function DietPage({ params }: { params: Promise<{ diet: string }> }) {
  const { diet } = await params;
  const data = DIETS.find((d) => d.slug === diet);
  if (!data) notFound();

  const recipes = await getRecipesByDiet(diet);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipes' },
    { name: data.name, url: `/diet/${diet}` },
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
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">{data.name} Recipes</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Every {data.name.toLowerCase()} recipe below shows full nutrition information and per-serving cost. Filter by cuisine, time, or ingredients to find what fits your kitchen tonight.
        </p>
      </header>

      {recipes.length === 0 ? (
        <div className="space-y-8">
          <div className="rounded-3xl border border-cream-200 bg-cream-50/60 p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">
              Editorial in progress
            </p>
            <h2 className="mt-2 font-serif text-2xl text-ink">
              {data.name} recipes our editors are testing right now
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-ink-muted">
              The {data.name.toLowerCase()} eating pattern has a specific nutritional
              profile that our kitchen team is honouring on every recipe we tag with it.
              First {data.name.toLowerCase()} recipes typically land within 4-8 weeks of a
              tag being added — in the meantime browse the rest of our nutrition-tagged
              recipes or send in a recipe you swear by.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/submit-recipe"
                className="rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-terracotta-600 focus-ring"
              >
                ✍️ Submit a {data.name.toLowerCase()} recipe
              </Link>
              <Link
                href="/diets"
                className="rounded-full border-2 border-forest-300 bg-white px-5 py-2.5 text-sm font-bold text-forest-700 hover:border-forest-500 focus-ring"
              >
                Browse all {DIETS.length} diets
              </Link>
              <Link
                href="/recipes"
                className="rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 text-sm font-bold text-ink hover:border-ink/30 focus-ring"
              >
                See every recipe
              </Link>
            </div>
          </div>

          <section>
            <h2 className="mb-4 font-serif text-2xl">Related dietary patterns</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {DIETS.filter((d) => d.slug !== diet).slice(0, 8).map((d) => (
                <Link
                  key={d.slug}
                  href={`/diet/${d.slug}`}
                  className="group flex flex-col items-start gap-2 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-md"
                >
                  <span className="font-serif text-sm font-bold text-ink group-hover:text-forest-700">
                    {d.name}
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
