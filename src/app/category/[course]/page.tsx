import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { COURSES_NAV, SITE } from '@/lib/constants';
import { getRecipesByCourse } from '@/lib/data/recipes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/structured-data';

export async function generateStaticParams() {
  return COURSES_NAV.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course } = await params;
  const data = COURSES_NAV.find((c) => c.slug === course);
  if (!data) return { title: 'Not found' };
  return {
    title: `${data.name} Recipes — Free, Tested & Step-by-Step | RecipeCrave`,
    description: `Browse our ${data.name.toLowerCase()} recipe collection — every dish tested in our kitchen with per-serving calories, cost, and step-by-step instructions.`,
    alternates: { canonical: `${SITE.url}/category/${course}` },
  };
}

export const revalidate = 3600;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const data = COURSES_NAV.find((c) => c.slug === course);
  if (!data) notFound();

  const recipes = await getRecipesByCourse(course);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipes' },
    { name: data.name, url: `/category/${course}` },
  ];

  return (
    <div className="container py-10 lg:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          itemListJsonLd(recipes.map((r) => ({ name: r.title, url: `/recipes/${r.slug}` }))),
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/recipes" className="hover:text-ink">Recipes</Link></li>
          <li aria-hidden>/</li>
          <li className="text-ink">{data.name}</li>
        </ol>
      </nav>

      <header className="mb-10">
        <p className="text-5xl" aria-hidden>{data.emoji}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">{data.name}</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          {recipes.length > 0
            ? `${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'} in the ${data.name.toLowerCase()} category — each tested in our kitchen with per-serving calories, cost, and step-by-step instructions you can actually follow.`
            : `We are building out our ${data.name.toLowerCase()} collection. In the meantime, browse the rest of the kitchen or send in a recipe you love.`}
        </p>
      </header>

      {recipes.length === 0 ? (
        <div className="rounded-3xl border border-cream-200 bg-cream-50/60 p-10 text-center">
          <p className="font-serif text-2xl text-ink">More {data.name.toLowerCase()} coming soon</p>
          <p className="mt-3 text-sm text-ink-muted">
            We are mid-shoot on this category. Browse the full library or share your own
            {' '}
            {data.name.toLowerCase()} recipe — submissions usually publish within 7 days.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/recipes"
              className="rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-terracotta-600 focus-ring"
            >
              Browse all recipes
            </Link>
            <Link
              href="/submit-recipe"
              className="rounded-full border-2 border-forest-300 bg-white px-5 py-2.5 text-sm font-bold text-forest-700 hover:border-forest-500 focus-ring"
            >
              ✍️ Submit your {data.name.toLowerCase()} recipe
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      )}

      {/* Cross-category nav */}
      <section className="mt-16">
        <h2 className="mb-4 font-serif text-2xl">Browse other categories</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COURSES_NAV.filter((c) => c.slug !== course).map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-300 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>{c.emoji}</span>
              <span className="font-serif text-sm font-bold text-ink group-hover:text-terracotta-500">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
