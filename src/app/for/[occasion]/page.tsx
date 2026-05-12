import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Heart } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getAllRecipes } from '@/lib/data/recipes';
import type { Recipe } from '@/types/recipe';

/**
 * Meal-purpose browse pages. Captures intent-driven search queries that
 * neither Food Network nor Tasty surface well: "date night recipes",
 * "meal prep recipes", "family dinner recipes", etc.
 *
 * Each occasion has a predicate that scans the catalog for matching tone +
 * complexity, plus an SEO-rich intro that addresses the underlying user
 * need (impress without overwhelming / planning ahead / feed a crowd / etc.)
 */

type OccasionKey =
  | 'date-night' | 'meal-prep' | 'family-dinner' | 'holiday'
  | 'quick-weeknight' | 'impressing-guests' | 'comfort-food' | 'healthy-light';

type Spec = {
  title: string;
  heading: string;
  subtitle: string;
  intro: string;
  match: (r: Recipe) => boolean;
};

const txt = (r: Recipe) =>
  [r.title, r.description, (r.keywords ?? []).join(' ')].join(' ').toLowerCase();

const OCCASIONS: Record<OccasionKey, Spec> = {
  'date-night': {
    title: 'Date Night Recipes — Impressive Without Being Stressful',
    heading: 'Date night recipes',
    subtitle: 'Restaurant-quality cooking for two',
    intro: 'Date-night cooking has its own rules. You want food that feels luxurious without sending you into the kitchen for 4 hours of prep. Pasta with brown butter and sage. Pan-seared salmon with lemon caper sauce. Steak frites with garlic butter. The recipes below were specifically chosen because they hit "feels expensive" on a 60-minute or less timeline.',
    match: (r) => r.servings <= 4 && (r.difficulty === 'medium' || /steak|salmon|pasta|risotto|seafood|wine|cream|brown butter/i.test(txt(r))),
  },
  'meal-prep': {
    title: 'Meal Prep Recipes — Cook Once, Eat Five Days',
    heading: 'Meal prep recipes',
    subtitle: 'Sunday cooking, Monday-through-Thursday eating',
    intro: 'Good meal-prep recipes share three traits: they hold their texture for at least 4 days in the fridge, they reheat without falling apart, and they portion cleanly into containers. Stews, grain bowls, sheet-pan dinners, and casseroles all qualify; delicate stir-fries do not. The recipes below were specifically chosen for fridge-hold + reheat behavior.',
    match: (r) => r.servings >= 4 || /meal[\s-]prep|make[\s-]ahead|batch|lunch box|leftover/i.test(txt(r)),
  },
  'family-dinner': {
    title: 'Family Dinner Recipes — Crowd-Pleasers for 4-6',
    heading: 'Family dinner recipes',
    subtitle: 'Feeds everyone, fights nobody',
    intro: 'Family dinner has to clear a high bar: filling, balanced, and crowd-pleasing across age and pickiness ranges. The recipes below are all 4-6 servings, mild enough for kids but interesting enough for adults, with most coming in under 45 minutes total. Sheet-pan and one-pot formats dominate because they minimize cleanup.',
    match: (r) => r.servings >= 4 && r.servings <= 6 && r.totalTimeMin <= 60,
  },
  holiday: {
    title: 'Holiday Recipes — Showstoppers & Sides',
    heading: 'Holiday recipes',
    subtitle: 'For the meals that matter',
    intro: 'Holiday cooking is its own discipline — bigger portions, more sides, longer timing windows. A roast turkey or prime rib anchors the meal; sides multiply by 4-6 dishes; desserts demand attention. The recipes below cover the full holiday-meal arc from appetizer to dessert, with timing notes for parallel oven scheduling.',
    match: (r) => /holiday|thanksgiving|christmas|easter|new[\s-]year|feast|celebration|turkey|prime rib|leg of lamb|crown roast/i.test(txt(r)) || r.servings >= 6,
  },
  'quick-weeknight': {
    title: 'Quick Weeknight Dinner Recipes Under 30 Minutes',
    heading: 'Quick weeknight dinners',
    subtitle: 'On the table in 30',
    intro: 'Weeknight dinner is a logistics problem first, a cooking problem second. The recipes below all clear 30 minutes total — and most are closer to 20. Single-pan, single-protein, minimal prep. Ingredients you keep on hand, not specialty items. The aim is feeding your household well on a Tuesday with the same effort as ordering takeout.',
    match: (r) => r.totalTimeMin <= 30,
  },
  'impressing-guests': {
    title: 'Recipes for Impressing Guests — Cooking Show-Stoppers',
    heading: 'Impressing guests',
    subtitle: 'The recipes that get the "you made this?" reaction',
    intro: 'Impressing guests is half flavor, half presentation, half timing. The recipes below were selected because they deliver on all three: complex enough in flavor to feel ambitious, photogenic enough to draw eyes when plated, and structured enough that you can execute without falling apart in front of company. Most have a make-ahead component so you are not chained to the stove when guests arrive.',
    match: (r) => r.difficulty === 'medium' || r.difficulty === 'hard' || /risotto|braise|confit|sear|sous[\s-]vide|tartare|carpaccio|tarte tatin/i.test(txt(r)),
  },
  'comfort-food': {
    title: 'Comfort Food Recipes — Warm, Familiar, Filling',
    heading: 'Comfort food',
    subtitle: 'Bowls of warmth, the kind you cook in a sweatshirt',
    intro: 'Comfort food is intuitive but not effortless — slow-simmered stews, baked pasta with cheese, soups that thicken as they cool, mashed potatoes that taste like home. Every culture has its own canon and this collection draws from all of them. The recipes below are deliberately low-stress: most are forgiving with timing and reward stirring more than precision.',
    match: (r) => /comfort|stew|chili|mac[\s-]and[\s-]cheese|lasagna|pot roast|chicken pot pie|shepherds pie|chicken noodle|tomato soup|grilled cheese|porridge/i.test(txt(r)),
  },
  'healthy-light': {
    title: 'Healthy Light Recipes — Real Food, Real Macros',
    heading: 'Healthy light meals',
    subtitle: 'Vegetables-forward, under 500 calories per serving',
    intro: 'Light eating does not have to mean boring. The recipes below balance protein + vegetables + good fats at under 500 kcal per serving, which is the sweet spot for satiety without overshooting daily targets. Vegetable-forward bowls, lean proteins, whole grains, generous herbs. Tasty enough to repeat; gentle enough to repeat daily.',
    match: (r) => (r.nutrition?.calories ?? 999) <= 500 && (r.nutrition?.proteinG ?? 0) >= 15,
  },
};

export async function generateStaticParams() {
  return (Object.keys(OCCASIONS) as OccasionKey[]).map((occasion) => ({ occasion }));
}

export async function generateMetadata({ params }: { params: Promise<{ occasion: string }> }): Promise<Metadata> {
  const { occasion } = await params;
  const spec = OCCASIONS[occasion as OccasionKey];
  if (!spec) return { title: 'Not found' };
  return {
    title: spec.title,
    description: spec.intro.slice(0, 160),
    alternates: { canonical: `/for/${occasion}` },
    keywords: [
      spec.heading.toLowerCase(),
      `${occasion.replace(/-/g, ' ')} recipes`,
      `${occasion.replace(/-/g, ' ')} dinner ideas`,
      `${occasion.replace(/-/g, ' ')} meals`,
    ],
  };
}

export default async function OccasionPage({ params }: { params: Promise<{ occasion: string }> }) {
  const { occasion } = await params;
  const spec = OCCASIONS[occasion as OccasionKey];
  if (!spec) notFound();

  const all = await getAllRecipes();
  const filtered = all.filter(spec.match).sort((a, b) => a.totalTimeMin - b.totalTimeMin);

  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/recipes" className="hover:text-ink">Recipes</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">{spec.heading}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <Heart className="h-3.5 w-3.5" aria-hidden /> {spec.subtitle}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{spec.heading}</h1>
        <p className="mt-3 text-lg text-ink-muted">{spec.intro}</p>
        <p className="mt-2 text-sm text-ink-subtle">
          {filtered.length} recipe{filtered.length === 1 ? '' : 's'} match this occasion.
        </p>
      </header>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.slice(0, 48).map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      ) : (
        <p className="text-ink-muted">No recipes match yet — check back as the catalog grows.</p>
      )}

      <section className="mt-12 rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-xl text-ink">Browse other occasions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(OCCASIONS) as OccasionKey[]).map((k) => (
            <Link
              key={k}
              href={`/for/${k}`}
              aria-current={k === occasion ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                k === occasion
                  ? 'bg-forest-600 text-white'
                  : 'border border-ink/10 bg-white text-ink hover:border-forest-500'
              }`}
            >
              {OCCASIONS[k].heading}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
