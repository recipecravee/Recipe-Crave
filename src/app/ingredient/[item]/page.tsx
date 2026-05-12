import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Drumstick } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getAllRecipes } from '@/lib/data/recipes';
import type { Recipe } from '@/types/recipe';

/**
 * Ingredient-based browse pages.
 *
 * Captures the long-tail "{ingredient} recipes" search vertical that
 * Food Network handles at high competition but rarely well. Each item
 * has a predicate that scans recipe text + ingredients[] for relevant
 * keyword variants, with explicit exclusion patterns so e.g. "egg"
 * doesn't match "eggplant".
 */

type IngredientKey =
  | 'chicken' | 'beef' | 'pork' | 'fish' | 'shrimp' | 'tofu' | 'eggs' | 'beans'
  | 'rice' | 'pasta' | 'potatoes' | 'mushrooms' | 'spinach' | 'broccoli';

type Spec = {
  title: string;
  heading: string;
  subtitle: string;
  intro: string;
  include: RegExp;
  exclude?: RegExp;
};

const INGREDIENTS: Record<IngredientKey, Spec> = {
  chicken: {
    title: 'Chicken Recipes — From 15-Minute Weeknights to Sunday Roasts',
    heading: 'Chicken recipes',
    subtitle: 'The everyday protein that takes any sauce',
    intro: 'Chicken is the most-cooked protein in households worldwide for a reason: cooks fast, takes any sauce, lands somewhere on the budget spectrum from very cheap (thighs) to mid-range (breasts) without ever turning expensive. Every recipe below specifies dry-brine timing, internal temperature, and rest periods that home cooks usually skip and regret.',
    include: /\b(chicken|poultry|wings|thigh|breast)\b/i,
  },
  beef: {
    title: 'Beef Recipes — Ground, Steak, Stew & Braises',
    heading: 'Beef recipes',
    subtitle: 'Ground to ribeye to long braise',
    intro: 'Beef has a wider quality + price spectrum than any other protein — and the right cut matters more than the recipe. Ground beef wants 80/20 lean for burgers and 90/10 for pasta sauce; chuck wants 3+ hours of slow heat; sirloin wants a hot pan and 4 minutes total. The recipes below match cut to method.',
    include: /\b(beef|steak|ribeye|sirloin|chuck|brisket|ground beef|mince|burger|bourguignon)\b/i,
  },
  pork: {
    title: 'Pork Recipes — Chops, Roasts, Bacon & Beyond',
    heading: 'Pork recipes',
    subtitle: 'Underrated and forgiving',
    intro: 'Modern pork is bred lean, which means it cooks more like chicken breast than the fatty heritage cuts of old. Pull at 145°F internal and let it rest — that 5° carryover finishes it perfectly. Pork chops, tenderloin, shoulder, bacon, sausage — each takes different technique. The recipes below specify both.',
    include: /\b(pork|bacon|prosciutto|pancetta|ham|sausage|tenderloin|chop|carnitas|chorizo)\b/i,
  },
  fish: {
    title: 'Fish Recipes — Salmon, White Fish & Beyond',
    heading: 'Fish recipes',
    subtitle: 'Fast, lean, hard to mess up if you respect the temp',
    intro: 'Fish is the fastest-cooking protein at home. The biggest mistake home cooks make is overcooking — pull at 125-130°F internal for medium-rare salmon, 135°F for firm white fish. Most fish recipes that go wrong are 60 seconds too long in the pan. Below, every recipe specifies pan temp, side timing, and the exact moment to flip.',
    include: /\b(fish|salmon|cod|tilapia|tuna|halibut|sole|snapper|trout|sardine|anchovy|seafood)\b/i,
    exclude: /\bfish sauce\b/i,
  },
  shrimp: {
    title: 'Shrimp Recipes — 15-Minute Dinners, Pasta, Tacos',
    heading: 'Shrimp recipes',
    subtitle: 'Faster than takeout',
    intro: 'Shrimp cooks in 90 seconds per side. Most are sold already cleaned — defrost in cold water for 10 minutes and they are ready. The trick is pulling them off heat the moment they curl into a C; another 30 seconds and they curl into an O, which means rubbery. The recipes below all hit the C-not-O window.',
    include: /\b(shrimp|prawn)\b/i,
  },
  tofu: {
    title: 'Tofu Recipes — Crispy, Silky, Marinated',
    heading: 'Tofu recipes',
    subtitle: 'Pressed properly, tofu is great',
    intro: 'Most home cooks fail at tofu because they skip pressing. Twenty minutes between two plates with a heavy book on top drives out half the water, which is the difference between rubbery-bland and crispy-flavorful. Once pressed, tofu takes any marinade and crisps in the pan like nothing else. Below: 5 recipes that respect the press.',
    include: /\b(tofu|tempeh|silken|firm tofu)\b/i,
  },
  eggs: {
    title: 'Egg Recipes — Breakfast, Lunch, Dinner',
    heading: 'Egg recipes',
    subtitle: 'The perfect protein for any meal',
    intro: 'A dozen eggs costs less than $5. They take 60 seconds to cook. They go with everything. The recipes below cover the full breakfast-to-dinner range: soft scramble, omelette, frittata, shakshuka, pasta carbonara. Each notes the exact heat level and timing window because eggs are unforgiving when overcooked.',
    include: /\beggs?\b/i,
    exclude: /\beggplant|egg-free\b/i,
  },
  beans: {
    title: 'Bean & Legume Recipes — Cheap, Filling, Plant-Protein',
    heading: 'Bean recipes',
    subtitle: 'Cheapest protein on earth, done right',
    intro: 'A bag of dried beans is a dollar and feeds 6. Canned beans are 2 minutes from pantry to plate. Either way, beans are the highest-impact-per-dollar ingredient in a cook\'s pantry. The recipes below cover quick weeknight dinners with canned beans plus a few slow weekend batches starting from dried.',
    include: /\b(bean|beans|lentil|chickpea|garbanzo|black bean|kidney bean|cannellini|pinto|navy bean)\b/i,
  },
  rice: {
    title: 'Rice Recipes — Pilaf, Fried, Risotto, Bowls',
    heading: 'Rice recipes',
    subtitle: 'The grain that anchors half the world',
    intro: 'Rice is the most-consumed grain on Earth and the most-mistreated in Western kitchens. The secret: rinse until the water runs clear (removes excess starch that causes gumminess), use a 1:1.5 water-to-rice ratio for long-grain white rice, salt the water at 1%, and resist the urge to lift the lid. The recipes below all assume those fundamentals.',
    include: /\brice\b/i,
  },
  pasta: {
    title: 'Pasta Recipes — Weeknight to Sunday Sauce',
    heading: 'Pasta recipes',
    subtitle: 'Italian fundamentals through to one-pot weeknights',
    intro: 'Pasta done well takes care: salt the water at 1.0-1.5% of water weight ("salty as the sea"), reserve a cup of starchy water before draining, and finish the noodles in the sauce for the last minute so they soak up the flavor. The recipes below all reserve pasta water — that single step is what separates restaurant pasta from boxed.',
    include: /\b(pasta|spaghetti|penne|linguine|rigatoni|fettuccine|orzo|gnocchi|ravioli|lasagne|lasagna|tagliatelle|macaroni)\b/i,
  },
  potatoes: {
    title: 'Potato Recipes — Roast, Mash, Fried, Stewed',
    heading: 'Potato recipes',
    subtitle: 'Crispy on the outside, fluffy inside',
    intro: 'Potatoes are forgiving in ways most ingredients are not — over-cook by 5 minutes and they are still edible. But the difference between good potatoes and great potatoes is preheating the oil or pan. A cold-pan potato turns gummy; a smoking-hot pan crisps in 8 minutes. The recipes below all preheat the surface first.',
    include: /\b(potato|potatoes|mashed potato|french fries|chips)\b/i,
  },
  mushrooms: {
    title: 'Mushroom Recipes — Umami in Every Bite',
    heading: 'Mushroom recipes',
    subtitle: 'Add depth to anything without animal products',
    intro: 'Mushrooms deliver more umami per dollar than any other ingredient. They also follow one rule: never crowd the pan. Mushrooms release water as they cook; crowded mushrooms steam, then turn rubbery; spaced-out mushrooms sear, then turn crispy. Use the biggest pan you own. The recipes below all specify pan size.',
    include: /\b(mushroom|cremini|shiitake|portobello|porcini|chanterelle|oyster mushroom)\b/i,
  },
  spinach: {
    title: 'Spinach Recipes — Salad, Saute, Smoothie, Stew',
    heading: 'Spinach recipes',
    subtitle: 'High-iron, low-effort leafy green',
    intro: 'Spinach cooks down to about 10% of its raw volume — a giant bag becomes one cup of sauteed greens. Plan accordingly when sizing the pan. Acid (lemon juice, vinegar) boosts iron absorption from spinach by 50%+ in published studies, so finish every cooked-spinach dish with a squeeze. The recipes below all do this.',
    include: /\bspinach\b/i,
  },
  broccoli: {
    title: 'Broccoli Recipes — Roasted, Stir-Fried, Steamed',
    heading: 'Broccoli recipes',
    subtitle: 'High roast or quick stir-fry, never boiled',
    intro: 'Boiled broccoli is sad broccoli. Roasted at 425°F for 20 minutes the florets turn crispy and caramelized; stir-fried hot and fast they stay snappy and bright. Both methods preserve the sulforaphane (the bioactive compound) better than boiling, which leaches it into the cooking water. The recipes below avoid boiling entirely.',
    include: /\bbroccoli\b/i,
  },
};

export async function generateStaticParams() {
  return (Object.keys(INGREDIENTS) as IngredientKey[]).map((item) => ({ item }));
}

export async function generateMetadata({ params }: { params: Promise<{ item: string }> }): Promise<Metadata> {
  const { item } = await params;
  const spec = INGREDIENTS[item as IngredientKey];
  if (!spec) return { title: 'Not found' };
  return {
    title: spec.title,
    description: spec.intro.slice(0, 160),
    alternates: { canonical: `/ingredient/${item}` },
    keywords: [
      `${item} recipes`,
      `${item} dinner`,
      `easy ${item} recipes`,
      `quick ${item} recipes`,
      `${item} weeknight meals`,
    ],
  };
}

function matchesIngredient(r: Recipe, spec: Spec): boolean {
  const text = [
    r.title,
    r.description,
    (r.ingredients ?? []).map((i) => i.name).join(' '),
    (r.keywords ?? []).join(' '),
  ].join(' ');
  if (spec.exclude && spec.exclude.test(text)) {
    // Exclusion only blocks if the include keyword is purely matched by the exclusion
    const withoutExcluded = text.replace(spec.exclude, '');
    if (!spec.include.test(withoutExcluded)) return false;
  }
  return spec.include.test(text);
}

export default async function IngredientPage({ params }: { params: Promise<{ item: string }> }) {
  const { item } = await params;
  const spec = INGREDIENTS[item as IngredientKey];
  if (!spec) notFound();

  const all = await getAllRecipes();
  const filtered = all.filter((r) => matchesIngredient(r, spec)).sort((a, b) => a.totalTimeMin - b.totalTimeMin);

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
        <p className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-terracotta-600">
          <Drumstick className="h-3.5 w-3.5" aria-hidden /> {spec.subtitle}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{spec.heading}</h1>
        <p className="mt-3 text-lg text-ink-muted">{spec.intro}</p>
        <p className="mt-2 text-sm text-ink-subtle">
          {filtered.length} recipe{filtered.length === 1 ? '' : 's'} — fastest first.
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
        <h2 className="font-serif text-xl text-ink">Browse other ingredients</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(INGREDIENTS) as IngredientKey[]).map((k) => (
            <Link
              key={k}
              href={`/ingredient/${k}`}
              aria-current={k === item ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                k === item
                  ? 'bg-terracotta-500 text-white'
                  : 'border border-ink/10 bg-white text-ink hover:border-terracotta-400'
              }`}
            >
              {k}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
