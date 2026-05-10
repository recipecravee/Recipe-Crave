import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Users, Flame, DollarSign, ChefHat } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeImage } from '@/components/recipe/RecipeImage';
import { RecipeActions } from '@/components/recipe/RecipeActions';
import { ReviewsSection } from '@/components/recipe/ReviewsSection';
import { StarRating } from '@/components/recipe/StarRating';
import { AdSlot } from '@/components/site/AdSlot';
import { getAllRecipes, getRecipeBySlug, getRelatedRecipes } from '@/lib/data/recipes';
import { recipeJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo/structured-data';
import { formatMinutes, formatCurrency, absoluteUrl } from '@/lib/utils';

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((r) => ({ slug: r.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return { title: 'Recipe not found' };

  return {
    title: `${recipe.title} Recipe`,
    description: recipe.description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: 'article',
      url: absoluteUrl(`/recipes/${recipe.slug}`),
      images: recipe.heroImage ? [{ url: recipe.heroImage, width: 1200, height: 630 }] : undefined,
      publishedTime: recipe.publishedAt,
      modifiedTime: recipe.updatedAt,
    },
    twitter: { card: 'summary_large_image', title: recipe.title, description: recipe.description },
    keywords: recipe.keywords,
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const related = await getRelatedRecipes(recipe);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipes' },
    { name: recipe.title, url: `/recipes/${recipe.slug}` },
  ];

  const jsonLd = [
    recipeJsonLd(recipe),
    breadcrumbJsonLd(breadcrumbs),
    ...(recipe.faq.length > 0 ? [faqJsonLd(recipe.faq)] : []),
  ];

  return (
    <article className="container py-8 lg:py-12">
      <JsonLd data={jsonLd} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((b, i) => (
            <li key={b.url} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>›</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link href={b.url} className="hover:text-ink">{b.name}</Link>
              ) : (
                <span className="text-ink">{b.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <header className="mb-8 lg:mb-12">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="default" className="capitalize">{recipe.cuisine.replace('-', ' ')}</Badge>
          <Badge variant="secondary" className="capitalize">{recipe.course}</Badge>
          {recipe.dietaryTags.slice(0, 3).map((d) => (
            <Badge key={d} variant="warm" className="capitalize">{d.replace('-', ' ')}</Badge>
          ))}
        </div>
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl text-balance">{recipe.title}</h1>
        {recipe.ratingCount > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <StarRating value={recipe.avgRating} size="md" />
            <span className="font-medium">{recipe.avgRating.toFixed(1)}</span>
            <span className="text-ink-muted">
              ({recipe.ratingCount} review{recipe.ratingCount === 1 ? '' : 's'})
            </span>
          </div>
        ) : null}
        <p className="mt-4 max-w-2xl text-lg text-ink-muted text-pretty">{recipe.description}</p>

        <dl className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-terracotta-500" aria-hidden />
            <dt className="font-medium">Total time:</dt>
            <dd>{formatMinutes(recipe.totalTimeMin)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-terracotta-500" aria-hidden />
            <dt className="font-medium">Servings:</dt>
            <dd>{recipe.servings}</dd>
          </div>
          {recipe.nutrition ? (
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-terracotta-500" aria-hidden />
              <dt className="font-medium">Per serving:</dt>
              <dd>{recipe.nutrition.calories} kcal</dd>
            </div>
          ) : null}
          {recipe.costPerServingUsd ? (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-terracotta-500" aria-hidden />
              <dt className="font-medium">Cost per serving:</dt>
              <dd>{formatCurrency(recipe.costPerServingUsd)}</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-terracotta-500" aria-hidden />
            <dt className="font-medium">Difficulty:</dt>
            <dd className="capitalize">{recipe.difficulty}</dd>
          </div>
        </dl>

        <RecipeActions slug={recipe.slug} title={recipe.title} />
      </header>

      <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-cream-200">
        <RecipeImage
          src={recipe.heroImage}
          alt={recipe.title}
          priority
          sizes="(min-width: 1024px) 800px, 100vw"
          fillTitle={recipe.title}
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr,2fr]">
        {/* Ingredients */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl">Ingredients</h2>
            <p className="mt-1 text-xs text-ink-muted">For {recipe.servings} servings</p>
            <ul className="mt-4 space-y-3 text-sm">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex gap-2">
                  <input type="checkbox" id={`ing-${i}`} className="mt-1 h-4 w-4 rounded border-ink/20 text-terracotta-400 focus:ring-terracotta-400" />
                  <label htmlFor={`ing-${i}`} className="flex-1">
                    <span className="font-medium">{ing.qty} {ing.unit}</span> {ing.name}
                    {ing.notes ? <span className="block text-xs text-ink-muted">{ing.notes}</span> : null}
                  </label>
                </li>
              ))}
            </ul>
            {recipe.equipment.length > 0 ? (
              <div className="mt-6 border-t border-ink/10 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Equipment</h3>
                <p className="mt-2 text-sm">{recipe.equipment.join(', ')}</p>
              </div>
            ) : null}
          </div>
        </aside>

        {/* Instructions */}
        <div>
          <AdSlot slot="recipe-after-ingredients" className="mb-8" />

          <section>
            <h2 className="mb-6 font-serif text-2xl">Step-by-step</h2>
            <ol className="space-y-6">
              {recipe.instructions.map((step) => (
                <li key={step.step} className="flex gap-4">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta-400 font-serif text-white"
                  >
                    {step.step}
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-pretty leading-relaxed">{step.text}</p>
                    {step.timerMin ? (
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-0.5 text-xs text-ink-muted">
                        <Clock className="h-3 w-3" aria-hidden /> {step.timerMin} min timer
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <AdSlot slot="recipe-after-instructions" className="my-10" />

          {/* Tips + Storage */}
          <div className="grid gap-6 sm:grid-cols-2">
            {recipe.tips ? (
              <div className="rounded-2xl bg-cream-200/40 p-5">
                <h3 className="font-serif text-lg">Cook&apos;s tip</h3>
                <p className="mt-2 text-sm text-ink-muted">{recipe.tips}</p>
              </div>
            ) : null}
            {recipe.storageNotes ? (
              <div className="rounded-2xl bg-cream-200/40 p-5">
                <h3 className="font-serif text-lg">Storage</h3>
                <p className="mt-2 text-sm text-ink-muted">{recipe.storageNotes}</p>
                {recipe.freezerNotes ? <p className="mt-2 text-sm text-ink-muted"><strong>Freezer:</strong> {recipe.freezerNotes}</p> : null}
              </div>
            ) : null}
          </div>

          {/* Nutrition */}
          {recipe.nutrition ? (
            <section className="mt-10">
              <h2 className="mb-4 font-serif text-2xl">Nutrition per serving</h2>
              <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-4">
                <div><dt className="text-xs uppercase text-ink-muted">Calories</dt><dd className="font-serif text-2xl">{recipe.nutrition.calories}</dd></div>
                <div><dt className="text-xs uppercase text-ink-muted">Protein</dt><dd className="font-serif text-2xl">{recipe.nutrition.proteinG}g</dd></div>
                <div><dt className="text-xs uppercase text-ink-muted">Carbs</dt><dd className="font-serif text-2xl">{recipe.nutrition.carbsG}g</dd></div>
                <div><dt className="text-xs uppercase text-ink-muted">Fat</dt><dd className="font-serif text-2xl">{recipe.nutrition.fatG}g</dd></div>
                <div><dt className="text-xs uppercase text-ink-muted">Fiber</dt><dd className="font-serif text-xl">{recipe.nutrition.fiberG}g</dd></div>
                <div><dt className="text-xs uppercase text-ink-muted">Sugar</dt><dd className="font-serif text-xl">{recipe.nutrition.sugarG}g</dd></div>
                <div><dt className="text-xs uppercase text-ink-muted">Sat Fat</dt><dd className="font-serif text-xl">{recipe.nutrition.satFatG}g</dd></div>
                <div><dt className="text-xs uppercase text-ink-muted">Sodium</dt><dd className="font-serif text-xl">{recipe.nutrition.sodiumMg}mg</dd></div>
              </dl>
              <p className="mt-3 text-xs text-ink-muted">
                Estimates based on USDA FoodData Central. See our <Link href="/nutrition-disclaimer" className="underline">nutrition disclaimer</Link>.
              </p>
            </section>
          ) : null}

          {/* FAQ */}
          {recipe.faq.length > 0 ? (
            <section className="mt-10">
              <h2 className="mb-4 font-serif text-2xl">Frequently asked questions</h2>
              <div className="divide-y divide-ink/10 rounded-2xl bg-white shadow-sm">
                {recipe.faq.map((f, i) => (
                  <details key={i} className="group p-5">
                    <summary className="cursor-pointer list-none font-medium">
                      {f.q}
                      <span aria-hidden className="float-right transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-ink-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <ReviewsSection
        avgRating={recipe.avgRating}
        ratingCount={recipe.ratingCount}
        recipeTitle={recipe.title}
      />

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-16 border-t border-ink/10 pt-12">
          <h2 className="mb-8 font-serif text-3xl">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 6).map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
