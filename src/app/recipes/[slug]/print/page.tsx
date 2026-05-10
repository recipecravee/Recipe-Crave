import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllRecipes, getRecipeBySlug } from '@/lib/data/recipes';
import { formatMinutes, formatCurrency } from '@/lib/utils';
import { PrintControls } from './PrintControls';

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return { title: 'Recipe not found', robots: { index: false } };
  return {
    title: `${recipe.title} (printable)`,
    description: recipe.description,
    robots: { index: false, follow: false },
  };
}

export default async function PrintRecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 print:py-4">
      <PrintControls slug={slug} />

      <header className="mb-6 border-b border-ink/15 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-500">
          RecipeCrave · recipecrave.com
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink">{recipe.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{recipe.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-subtle">Total time</dt>
            <dd className="font-medium">{formatMinutes(recipe.totalTimeMin)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-subtle">Servings</dt>
            <dd className="font-medium">{recipe.servings}</dd>
          </div>
          {recipe.nutrition ? (
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-subtle">Calories/serving</dt>
              <dd className="font-medium">{recipe.nutrition.calories} kcal</dd>
            </div>
          ) : null}
          {recipe.costPerServingUsd ? (
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-subtle">Cost/serving</dt>
              <dd className="font-medium">{formatCurrency(recipe.costPerServingUsd)}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <div className="grid gap-8 print:gap-6 sm:grid-cols-[1fr,1.5fr]">
        <section>
          <h2 className="mb-3 font-serif text-xl">Ingredients</h2>
          <ul className="space-y-2 text-sm">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-2 border-b border-dashed border-ink/10 pb-2">
                <span className="font-medium">
                  {ing.qty} {ing.unit}
                </span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>
          {recipe.equipment.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Equipment</h3>
              <p className="mt-1 text-sm">{recipe.equipment.join(', ')}</p>
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step) => (
              <li key={step.step} className="flex gap-3">
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/30 font-serif text-sm"
                >
                  {step.step}
                </span>
                <p className="flex-1 text-sm leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {recipe.tips ? (
        <section className="mt-8 border-t border-ink/15 pt-4">
          <h3 className="font-serif text-lg">Tip</h3>
          <p className="mt-1 text-sm text-ink-muted">{recipe.tips}</p>
        </section>
      ) : null}

      {recipe.storageNotes ? (
        <section className="mt-4">
          <h3 className="font-serif text-lg">Storage</h3>
          <p className="mt-1 text-sm text-ink-muted">{recipe.storageNotes}</p>
          {recipe.freezerNotes ? (
            <p className="mt-1 text-sm text-ink-muted">
              <strong>Freezer:</strong> {recipe.freezerNotes}
            </p>
          ) : null}
        </section>
      ) : null}

      <footer className="mt-10 border-t border-ink/15 pt-4 text-xs text-ink-subtle">
        Printed from RecipeCrave · recipecrave.com/recipes/{recipe.slug}
      </footer>
    </div>
  );
}
