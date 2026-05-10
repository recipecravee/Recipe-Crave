import type { Metadata } from 'next';
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
        <p className="rounded-2xl bg-white p-12 text-center text-ink-muted">
          More {data.name} recipes coming soon. Check back this week.
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
