import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Users, Flame, DollarSign, ChefHat, UtensilsCrossed } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeImage } from '@/components/recipe/RecipeImage';
import { RecipeActions } from '@/components/recipe/RecipeActions';
import { RecipeSaveButton } from '@/components/recipe/RecipeSaveButton';
import { RecipeVariationForm } from '@/components/recipe/RecipeVariationForm';
import { PinItButton } from '@/components/recipe/PinItButton';
import { TranslateRecipeButton } from '@/components/recipe/TranslateRecipeButton';
import { MeasurementBanner } from '@/components/recipe/MeasurementBanner';
import { ReviewsSection } from '@/components/recipe/ReviewsSection';
import { StarRating } from '@/components/recipe/StarRating';
import { VoiceCookMode } from '@/components/recipe/VoiceCookMode';
import { AdSlot } from '@/components/site/AdSlot';
import { getAllRecipes, getRecipeBySlug, getRelatedRecipes } from '@/lib/data/recipes';
import { recipeJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo/structured-data';
import { getFaqOrPaa } from '@/lib/seo/paa-generator';
import { generatePairings } from '@/lib/pairing';
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
    // Pinterest favors vertical 2:3 pins. Expose a per-recipe pin URL so
    // crawlers and the in-page "Pin it" button reference an optimized image.
    other: {
      'pinterest:src': absoluteUrl(`/api/pin/${recipe.slug}.png`),
    },
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

  // PAA (People Also Ask) — hand-authored FAQ if present, otherwise auto-
  // generated from recipe metadata. Always non-empty. Feeds both the visible
  // accordion + the FAQPage JSON-LD for featured-snippet eligibility.
  const paaItems = getFaqOrPaa(recipe);

  const jsonLd = [
    recipeJsonLd(recipe),
    breadcrumbJsonLd(breadcrumbs),
    faqJsonLd(paaItems),
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

        {/* Content-freshness signal — strategy doc requires visible
            last-reviewed timestamps so users + Google see the catalog is
            actively maintained. */}
        <p className="mt-3 text-[11px] uppercase tracking-widest text-ink-subtle">
          Last reviewed{' '}
          <time dateTime={recipe.updatedAt ?? recipe.publishedAt}>
            {new Date(recipe.updatedAt ?? recipe.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>{' '}
          by the RecipeCrave kitchen team
        </p>

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

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <RecipeActions slug={recipe.slug} title={recipe.title} />
          <RecipeSaveButton slug={recipe.slug} />
          <PinItButton recipeSlug={recipe.slug} title={recipe.title} description={recipe.description} />
          <TranslateRecipeButton recipe={recipe} />
          <VoiceCookMode title={recipe.title} servings={recipe.servings} instructions={recipe.instructions} />
        </div>

        <div className="mt-4">
          <MeasurementBanner />
        </div>
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
          </div>

          {/* Kitchen tools / equipment guide — surfaced as its own card so home
              cooks can verify they have what they need before starting. */}
          {recipe.equipment.length > 0 ? (
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-forest-50 to-cream-50 p-6 shadow-sm ring-1 ring-forest-200">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-forest-700" aria-hidden />
                <h2 className="font-serif text-xl text-forest-700">Kitchen tools you&apos;ll need</h2>
              </div>
              <p className="mt-1 text-xs text-ink-muted">Tick each tool as you set up.</p>
              <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
                {recipe.equipment.map((tool, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-3 py-2 shadow-sm">
                    <input
                      type="checkbox"
                      id={`tool-${i}`}
                      className="h-4 w-4 rounded border-forest-300 text-forest-600 focus:ring-forest-400"
                    />
                    <label htmlFor={`tool-${i}`} className="flex-1 font-medium text-ink">
                      {tool}
                    </label>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-ink-subtle">
                Missing one? Most recipes have a workable substitute — a heavy skillet
                stands in for a Dutch oven, a sturdy bowl for a stand mixer, a sharp paring
                knife for a chef knife.
              </p>
            </div>
          ) : null}
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

          {/* Pro cooking guide (plating, mistakes, substitutions) */}
          {(() => {
            const guide = (recipe as unknown as { cookingGuide?: { platingTips: string; mistakesToAvoid: string[]; substitutions: Array<{ from: string; to: string; note?: string }> } }).cookingGuide;
            if (!guide) return null;
            return (
              <section className="mt-10 space-y-6">
                <div className="rounded-2xl border-2 border-forest-200 bg-gradient-to-br from-forest-50 via-cream-50 to-terracotta-50 p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-forest-600">Plating &amp; presentation</p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-ink">How to plate this dish like a pro</h3>
                  <p className="mt-3 text-base text-ink">{guide.platingTips}</p>
                </div>

                {guide.mistakesToAvoid.length > 0 ? (
                  <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Common mistakes</p>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-ink">What to avoid</h3>
                    <ul className="mt-4 space-y-3">
                      {guide.mistakesToAvoid.map((m, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-ink">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-bold text-amber-900">{i + 1}</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {guide.substitutions.length > 0 ? (
                  <div className="rounded-2xl border-2 border-ink/5 bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">Ingredient swaps</p>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-ink">Substitutions for diet or availability</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {guide.substitutions.map((s, i) => (
                        <div key={i} className="rounded-xl border border-ink/5 bg-cream-50 p-4">
                          <p className="text-sm font-bold text-ink">
                            <span className="text-ink-muted line-through">{s.from}</span>
                            <span className="mx-2 text-terracotta-500">→</span>
                            <span>{s.to}</span>
                          </p>
                          {s.note ? <p className="mt-1 text-xs text-ink-muted">{s.note}</p> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            );
          })()}

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

          {/* Beverage pairing — wine, beer, non-alcoholic suggestions auto-generated
              from cuisine + protein + spice profile. Anchors the "what should I drink
              with this?" search vertical Food Network rarely covers well. */}
          <section className="mt-10 rounded-2xl bg-gradient-to-br from-forest-50 to-cream-50 p-6 shadow-sm">
            <h2 className="font-serif text-2xl">What to drink with this</h2>
            <p className="mt-1 text-xs text-ink-muted">
              Wine, beer, and non-alcoholic options matched to this recipe&apos;s cuisine + main protein + spice level.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {generatePairings(recipe).map((p, i) => (
                <li key={i} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                      {p.type === 'non-alcoholic' ? 'non-alc' : p.type}
                    </span>
                    <strong className="font-serif text-base text-ink">{p.name}</strong>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{p.description}</p>
                  <p className="mt-2 text-xs text-forest-700">
                    <strong>Why:</strong> {p.why}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* User-submitted variation form — drives UGC + internal link diversity */}
          <section className="mt-10">
            <RecipeVariationForm recipeSlug={recipe.slug} />
          </section>

          {/* People Also Ask — visible accordion, doubles as featured-snippet
              fodder via FAQPage JSON-LD. Auto-generated for recipes without
              hand-authored FAQ. */}
          <section className="mt-10">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              People also ask
            </p>
            <h2 className="mt-1 mb-4 font-serif text-2xl">
              Common questions about {recipe.title}
            </h2>
            <div className="divide-y divide-ink/10 rounded-2xl bg-white shadow-sm">
              {paaItems.map((f, i) => (
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
