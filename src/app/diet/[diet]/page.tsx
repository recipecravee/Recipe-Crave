import type { Metadata } from 'next';
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
        <p className="rounded-2xl bg-white p-12 text-center text-ink-muted">
          More {data.name.toLowerCase()} recipes coming soon. Check back this week.
        </p>
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
