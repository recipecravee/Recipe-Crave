import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Users } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getAllRecipes } from '@/lib/data/recipes';

type SizeKey = 'individual' | 'couple' | 'family' | 'party';

const SIZE_CONFIG: Record<SizeKey, {
  title: string;
  heading: string;
  subtitle: string;
  intro: string;
  match: (s: number) => boolean;
}> = {
  individual: {
    title: 'Solo Recipes for One',
    heading: 'Recipes for one',
    subtitle: 'Single-serving, no leftovers',
    intro: 'Cooking for yourself does not have to mean reheated leftovers. These recipes are sized for one portion — no half-eaten cans, no math, no waste. Great for weeknight dinners when the rest of the household is eating elsewhere.',
    match: (s) => s === 1,
  },
  couple: {
    title: 'Recipes for Two — Date Night & Couple Cooking',
    heading: 'Recipes for two',
    subtitle: 'Two plates, balanced portions',
    intro: 'Two-serving recipes give you exact portions for a quiet dinner together. Many scale up cleanly for entertaining — double the proteins, keep aromatics constant, taste-adjust salt.',
    match: (s) => s === 2,
  },
  family: {
    title: 'Family Dinner Recipes for 4 to 6',
    heading: 'Family dinner recipes',
    subtitle: 'Crowd-pleasers for 4-6 people',
    intro: 'The sweet spot for a weeknight family meal — enough for everyone at the table plus one packed lunch for tomorrow. These recipes hit that 4-6 serving range without overcrowding the pan.',
    match: (s) => s >= 4 && s <= 6,
  },
  party: {
    title: 'Party Recipes for 8+ People',
    heading: 'Party recipes (8+)',
    subtitle: 'Crowd-scaled meals & make-aheads',
    intro: 'Cooking for a crowd is its own discipline — pan size, oven space, timing windows all change. These recipes are built for 8 or more people without sacrificing texture or flavor. Most can be prepped a day ahead.',
    match: (s) => s >= 8,
  },
};

export async function generateStaticParams() {
  return Object.keys(SIZE_CONFIG).map((size) => ({ size }));
}

export async function generateMetadata({ params }: { params: Promise<{ size: string }> }): Promise<Metadata> {
  const { size } = await params;
  const cfg = SIZE_CONFIG[size as SizeKey];
  if (!cfg) return { title: 'Not found' };
  return {
    title: cfg.title,
    description: cfg.intro.slice(0, 160),
    alternates: { canonical: `/servings/${size}` },
    keywords: [cfg.heading.toLowerCase(), 'serving size', 'portion size', 'recipes by serving'],
  };
}

export default async function ServingsPage({ params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const cfg = SIZE_CONFIG[size as SizeKey];
  if (!cfg) notFound();

  const all = await getAllRecipes();
  const filtered = all.filter((r) => cfg.match(r.servings));

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
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <Users className="h-3.5 w-3.5" aria-hidden /> {cfg.subtitle}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{cfg.heading}</h1>
        <p className="mt-3 text-lg text-ink-muted">{cfg.intro}</p>
        <p className="mt-2 text-sm text-ink-subtle">
          {filtered.length} recipe{filtered.length === 1 ? '' : 's'} match this serving size. Need a
          different count? <Link href="/calculators/realtime-recipe-scaler" className="font-bold text-terracotta-600 hover:underline">Scale any recipe</Link> in real time.
        </p>
      </header>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.slice(0, 48).map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      ) : (
        <p className="text-ink-muted">
          No recipes match this serving size yet. Use the{' '}
          <Link href="/calculators/realtime-recipe-scaler" className="font-bold text-terracotta-600 hover:underline">Recipe Scaler</Link>{' '}
          to resize anything in the catalog.
        </p>
      )}

      <section className="mt-12 rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-xl text-ink">Browse by serving count</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(SIZE_CONFIG) as SizeKey[]).map((k) => (
            <Link
              key={k}
              href={`/servings/${k}`}
              aria-current={k === size ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                k === size
                  ? 'bg-forest-600 text-white'
                  : 'border border-ink/10 bg-white text-ink hover:border-forest-500'
              }`}
            >
              {SIZE_CONFIG[k].heading}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
