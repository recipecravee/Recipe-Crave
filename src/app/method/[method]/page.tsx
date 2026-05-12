import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Flame } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getAllRecipes } from '@/lib/data/recipes';
import type { Recipe } from '@/types/recipe';

type MethodKey =
  | 'air-fryer' | 'oven' | 'stovetop' | 'slow-cooker' | 'grilling' | 'no-cook';

/**
 * Cooking-method browse pages.
 *
 * The catalog doesn't currently carry a `method` field on every recipe, so
 * we infer membership from equipment list + instruction text via keyword
 * patterns. Each method's predicate checks for words/phrases that strongly
 * indicate that cooking method was used.
 */
const METHOD_CONFIG: Record<MethodKey, {
  title: string;
  heading: string;
  subtitle: string;
  intro: string;
  test: (r: Recipe) => boolean;
}> = {
  'air-fryer': {
    title: 'Air Fryer Recipes — Crispy, Fast, No Deep Fryer',
    heading: 'Air fryer recipes',
    subtitle: 'Crispy results, minimal oil',
    intro: 'The air fryer is essentially a tabletop convection oven. Drop temp 25°F from a conventional oven recipe and cut cook time by 20-25%. Best for breaded proteins, root vegetables, frozen apps, and any cut you want crisp on the outside, tender inside.',
    test: (r) => /air[\s-]?fry/i.test(allText(r)),
  },
  oven: {
    title: 'Oven-Baked Recipes — Roasts, Casseroles, Bakes',
    heading: 'Oven recipes',
    subtitle: 'Set the timer, walk away',
    intro: 'Oven cooking trades hands-on time for hands-off time. Preheat, slide it in, set a timer. Sheet-pan dinners, roasts, casseroles, baked pasta — the workhorse method of any well-fed household.',
    test: (r) => /\b(oven|bake|roast|sheet[\s-]pan|casserole)\b/i.test(allText(r)),
  },
  stovetop: {
    title: 'Stovetop Recipes — Skillet, Saucepan, Wok',
    heading: 'Stovetop recipes',
    subtitle: 'Skillet, saucepan, fast control',
    intro: 'Stovetop cooking gives you the fastest temperature response — flame on, flame off, instant feedback. Best for sautés, stir-fries, pan sauces, and any dish where you want full control over crust development.',
    test: (r) => /\b(skillet|saute|saut[ée]|stir[\s-]fry|wok|pan[\s-]fry|saucepan|stove|fry)\b/i.test(allText(r)),
  },
  'slow-cooker': {
    title: 'Slow Cooker Recipes — Set It and Forget It',
    heading: 'Slow cooker recipes',
    subtitle: 'Long, low, hands-off',
    intro: 'Slow cookers turn tough cuts into tender meals while you are at work. 6-8 hours on low, 4 hours on high. Best for braises, stews, pulled meats, and anything that benefits from a long simmer.',
    test: (r) => /\b(slow[\s-]cook|crock[\s-]?pot|braise|braised|low[\s-]and[\s-]slow)\b/i.test(allText(r)),
  },
  grilling: {
    title: 'Grilling Recipes — Outdoor BBQ & Indoor Grill',
    heading: 'Grilling recipes',
    subtitle: 'Char, smoke, summer flavor',
    intro: 'Whether it\'s a Weber kettle in the backyard or a cast-iron grill pan on the stove, grilling adds char and smoke flavor no other method matches. Preheat hot, pat the protein dry, and don\'t flip too early.',
    test: (r) => /\b(grill|barbecue|bbq|charcoal|smoked|jerk|suya|kebab|kebob|skewer)\b/i.test(allText(r)),
  },
  'no-cook': {
    title: 'No-Cook Recipes — Salads, Wraps, Cold Dishes',
    heading: 'No-cook recipes',
    subtitle: 'Knife and a board, that is it',
    intro: 'Sometimes the oven stays off. Salads, raw preparations, layered wraps, gazpachos, dressed grains. Perfect for hot summer evenings or any time you want fresh, bright, and fast.',
    test: (r) => /\b(no[\s-]cook|salad|wrap|ceviche|tartare|raw|sandwich|gazpacho|cold[\s-]press)\b/i.test(allText(r)) && !/oven|stove|grill|fry|simmer|boil/i.test(allText(r)),
  },
};

function allText(r: Recipe): string {
  return [
    r.title,
    r.description ?? '',
    (r.equipment ?? []).join(' '),
    (r.keywords ?? []).join(' '),
    (r.instructions ?? []).map((s) => s.text).join(' '),
  ].join(' ');
}

export async function generateStaticParams() {
  return Object.keys(METHOD_CONFIG).map((method) => ({ method }));
}

export async function generateMetadata({ params }: { params: Promise<{ method: string }> }): Promise<Metadata> {
  const { method } = await params;
  const cfg = METHOD_CONFIG[method as MethodKey];
  if (!cfg) return { title: 'Not found' };
  return {
    title: cfg.title,
    description: cfg.intro.slice(0, 160),
    alternates: { canonical: `/method/${method}` },
    keywords: [
      cfg.heading.toLowerCase(),
      'cooking method',
      'kitchen technique',
      `${method.replace('-', ' ')} recipes`,
    ],
  };
}

export default async function MethodPage({ params }: { params: Promise<{ method: string }> }) {
  const { method } = await params;
  const cfg = METHOD_CONFIG[method as MethodKey];
  if (!cfg) notFound();

  const all = await getAllRecipes();
  const filtered = all.filter(cfg.test).sort((a, b) => a.totalTimeMin - b.totalTimeMin);

  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/recipes" className="hover:text-ink">Recipes</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">{cfg.heading}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700">
          <Flame className="h-3.5 w-3.5" aria-hidden /> {cfg.subtitle}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{cfg.heading}</h1>
        <p className="mt-3 text-lg text-ink-muted">{cfg.intro}</p>
        <p className="mt-2 text-sm text-ink-subtle">
          {filtered.length} recipe{filtered.length === 1 ? '' : 's'} match this method.
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
        <h2 className="font-serif text-xl text-ink">Browse other cooking methods</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(METHOD_CONFIG) as MethodKey[]).map((k) => (
            <Link
              key={k}
              href={`/method/${k}`}
              aria-current={k === method ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                k === method
                  ? 'bg-amber-500 text-white'
                  : 'border border-ink/10 bg-white text-ink hover:border-amber-400'
              }`}
            >
              {METHOD_CONFIG[k].heading.replace(' recipes', '')}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
