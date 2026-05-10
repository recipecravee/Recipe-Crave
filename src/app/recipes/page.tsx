import type { Metadata } from 'next';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getAllRecipes, searchRecipes } from '@/lib/data/recipes';
import { CUISINES, DIETS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'All Recipes — Free, Tested, Step-by-Step',
  description:
    'Browse free recipes with calories, costs, and step-by-step instructions on every dish. Filter by cuisine, diet, time, and ingredients to find what you can cook tonight.',
  alternates: { canonical: '/recipes' },
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cuisine?: string; diet?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim();
  let recipes = query ? await searchRecipes(query) : await getAllRecipes();

  if (params.cuisine) recipes = recipes.filter((r) => r.cuisine === params.cuisine);
  if (params.diet) recipes = recipes.filter((r) => r.dietaryTags.includes(params.diet!));

  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">
          {query ? `Recipes for "${query}"` : 'All Recipes'}
        </h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Every recipe is tested, photographed when possible, and includes per-serving nutrition and cost. Use filters to narrow by cuisine, diet, time, or ingredient.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Cuisine</p>
          <div className="flex flex-wrap gap-2">
            <FilterPill href="/recipes" label="All" active={!params.cuisine} />
            {CUISINES.slice(0, 8).map((c) => (
              <FilterPill
                key={c.slug}
                href={`/recipes?cuisine=${c.slug}`}
                label={c.name}
                active={params.cuisine === c.slug}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Diet</p>
          <div className="flex flex-wrap gap-2">
            <FilterPill href="/recipes" label="All" active={!params.diet} />
            {DIETS.slice(0, 8).map((d) => (
              <FilterPill
                key={d.slug}
                href={`/recipes?diet=${d.slug}`}
                label={d.name}
                active={params.diet === d.slug}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <p className="mb-6 text-sm text-ink-muted">
        {recipes.length} recipe{recipes.length === 1 ? '' : 's'}
      </p>

      {recipes.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="font-serif text-2xl">No recipes match those filters.</p>
          <p className="mt-2 text-ink-muted">Try a different cuisine or diet.</p>
          <Link href="/recipes" className="mt-4 inline-block text-terracotta-500 underline">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r, i) => (
            <RecipeCard key={r.slug} recipe={r} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active
          ? 'border-terracotta-400 bg-terracotta-400 text-white'
          : 'border-ink/10 bg-white text-ink hover:border-terracotta-400 hover:text-terracotta-500'
      }`}
    >
      {label}
    </Link>
  );
}
