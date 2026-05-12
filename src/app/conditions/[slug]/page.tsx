import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Activity, Leaf, AlertTriangle } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { CONDITIONS, herbsForCondition, getCondition, type ConditionSlug } from '@/content/herbs';
import { getAllRecipes } from '@/lib/data/recipes';

export async function generateStaticParams() {
  return CONDITIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const condition = getCondition(slug as ConditionSlug);
  if (!condition) return { title: 'Not found' };
  return {
    title: `Recipes & Herbs for ${condition.name} — Evidence-Backed Cooking`,
    description: `${condition.intro.slice(0, 140)}`,
    alternates: { canonical: `/conditions/${slug}` },
    keywords: [
      `recipes for ${condition.name.toLowerCase()}`,
      `${condition.name.toLowerCase()} diet`,
      `herbs for ${condition.name.toLowerCase()}`,
      'food as medicine',
      'functional food',
    ],
  };
}

export default async function ConditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const condition = getCondition(slug as ConditionSlug);
  if (!condition) notFound();

  const herbs = herbsForCondition(slug as ConditionSlug);
  const herbSlugs = herbs.map((h) => h.slug.replace(/-/g, ' '));
  const allRecipes = await getAllRecipes();
  // Surface recipes whose text references any herb relevant to this condition
  const recipes = allRecipes.filter((r) => {
    const hay = [r.title, r.description ?? '', (r.ingredients ?? []).map((i) => i.name).join(' ')]
      .join(' ')
      .toLowerCase();
    return herbSlugs.some((needle) => hay.includes(needle));
  }).slice(0, 24);

  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/herbs" className="hover:text-ink">Herbs</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">{condition.name}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <Activity className="h-3.5 w-3.5" aria-hidden /> Health condition
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          Recipes &amp; herbs for {condition.name}
        </h1>
        <p className="mt-4 text-lg text-ink-muted">{condition.intro}</p>
      </header>

      <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-forest-700" aria-hidden />
          <h2 className="font-serif text-2xl text-forest-700">
            {herbs.length} herbs that support {condition.name.toLowerCase()}
          </h2>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {herbs.map((h) => (
            <li key={h.slug}>
              <Link
                href={`/herbs/${h.slug}`}
                className="block rounded-xl border border-forest-100 bg-cream-50 p-4 transition-colors hover:border-forest-400 hover:bg-forest-50"
              >
                <p className="font-bold text-ink">{h.name}</p>
                <p className="mt-1 text-[11px] text-ink-subtle">{h.flavor}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  Active: <strong>{h.activeCompounds[0]}</strong>
                </p>
                <p className="mt-1 text-xs text-ink-muted">{h.dailyIntake}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {recipes.length > 0 ? (
        <section>
          <h2 className="mb-4 font-serif text-2xl">Recipes featuring these herbs</h2>
          <p className="mb-6 text-sm text-ink-muted">
            {recipes.length} recipe{recipes.length === 1 ? '' : 's'} in the RecipeCrave catalog
            that use one or more of the herbs above. Sorted by simplest first.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      ) : (
        <p className="rounded-2xl bg-cream-100 p-6 text-ink-muted">
          No recipes match yet — but every herb above lists its best-fit cuisines, so try our{' '}
          <Link href="/recipes" className="font-bold text-terracotta-600 hover:underline">recipe catalog</Link>{' '}
          filtered by those cuisines.
        </p>
      )}

      <section className="mt-12 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          <div>
            <h2 className="font-serif text-xl text-amber-900">Important</h2>
            <p className="mt-2 text-sm text-amber-900/90">
              Diet is supportive, not replacement therapy. {condition.name} that is severe or
              progressive requires a qualified clinician. Herbs can interact with prescription
              medication — check each herb page before adding therapeutic doses to your routine.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-serif text-xl">Other health conditions</h2>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.filter((c) => c.slug !== slug).map((c) => (
            <Link
              key={c.slug}
              href={`/conditions/${c.slug}`}
              className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-forest-400"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
