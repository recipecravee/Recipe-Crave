import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getAllRecipes } from '@/lib/data/recipes';

type RangeKey = 'under-15-minutes' | 'under-30-minutes' | 'under-1-hour' | 'over-1-hour';

const RANGE_CONFIG: Record<RangeKey, {
  title: string;
  heading: string;
  subtitle: string;
  predicate: (m: number) => boolean;
  intro: string;
}> = {
  'under-15-minutes': {
    title: 'Recipes Under 15 Minutes — Quick Meals',
    heading: 'Recipes under 15 minutes',
    subtitle: 'Fast wins for busy weeknights',
    predicate: (m) => m <= 15,
    intro: 'When the day got away from you and dinner has to happen in the time it takes to set the table — these recipes deliver. Most rely on minimal prep, a single hot surface, and ingredients you can keep on hand. Pasta water, a quick stir-fry, a sheet-pan sandwich. Real food, fast.',
  },
  'under-30-minutes': {
    title: 'Recipes Under 30 Minutes — Quick Dinners',
    heading: 'Recipes under 30 minutes',
    subtitle: 'Weeknight dinners that beat takeout',
    predicate: (m) => m <= 30,
    intro: 'The 30-minute window is the sweet spot for a real dinner. Long enough to brown a protein, build a sauce, and finish a starch. Short enough that you eat by 7 even on a Tuesday.',
  },
  'under-1-hour': {
    title: 'Recipes Under 1 Hour — Easy Dinners',
    heading: 'Recipes under 1 hour',
    subtitle: 'Stretch dinners worth the extra time',
    predicate: (m) => m <= 60,
    intro: 'An extra 15-20 minutes opens the door to braises, roasts, and any dish that needs a longer simmer to develop flavor. Most weeknights you have this — the result is worth it.',
  },
  'over-1-hour': {
    title: 'Weekend Project Recipes — Over 1 Hour',
    heading: 'Weekend project recipes',
    subtitle: 'When you have the kitchen all day',
    predicate: (m) => m > 60,
    intro: 'Bread that proves overnight. Slow braises. Stocks. Confit. These are the recipes that ask for time and pay you back in flavor depth no shortcut can match. Block out the morning, put on music, and let the house smell good.',
  },
};

export async function generateStaticParams() {
  return Object.keys(RANGE_CONFIG).map((range) => ({ range }));
}

export async function generateMetadata({ params }: { params: Promise<{ range: string }> }): Promise<Metadata> {
  const { range } = await params;
  const cfg = RANGE_CONFIG[range as RangeKey];
  if (!cfg) return { title: 'Not found' };
  return {
    title: cfg.title,
    description: cfg.intro.slice(0, 160),
    alternates: { canonical: `/cook-time/${range}` },
    keywords: [
      cfg.heading.toLowerCase(),
      'quick recipes',
      'fast dinner',
      'busy weeknight meals',
      'recipes by time',
      'meal prep',
    ],
  };
}

export default async function CookTimePage({ params }: { params: Promise<{ range: string }> }) {
  const { range } = await params;
  const cfg = RANGE_CONFIG[range as RangeKey];
  if (!cfg) notFound();

  const all = await getAllRecipes();
  const filtered = all.filter((r) => cfg.predicate(r.totalTimeMin)).sort((a, b) => a.totalTimeMin - b.totalTimeMin);

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
        <p className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-terracotta-600">
          <Clock className="h-3.5 w-3.5" aria-hidden /> {cfg.subtitle}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{cfg.heading}</h1>
        <p className="mt-3 text-lg text-ink-muted">{cfg.intro}</p>
        <p className="mt-2 text-sm text-ink-subtle">
          {filtered.length} recipe{filtered.length === 1 ? '' : 's'} match this time window.
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
        <h2 className="font-serif text-xl text-ink">Browse other time windows</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(RANGE_CONFIG) as RangeKey[]).map((k) => (
            <Link
              key={k}
              href={`/cook-time/${k}`}
              aria-current={k === range ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                k === range
                  ? 'bg-terracotta-500 text-white'
                  : 'border border-ink/10 bg-white text-ink hover:border-terracotta-400'
              }`}
            >
              {RANGE_CONFIG[k].heading.replace('Recipes ', '').replace('Weekend project recipes', 'Over 1 hour')}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
