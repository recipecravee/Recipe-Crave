import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, Quote } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getAllRecipes } from '@/lib/data/recipes';
import { PILLARS, getPillar } from '@/content/pillars';

export async function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) return { title: 'Not found' };
  return {
    title: pillar.title,
    description: pillar.intro.split('\n')[0]!.slice(0, 160),
    alternates: { canonical: `/pillars/${pillar.slug}` },
    keywords: [pillar.headKeyword, ...pillar.longTail],
    openGraph: {
      title: pillar.title,
      description: pillar.pinterestHook,
      type: 'website',
      images: [
        {
          url: `/api/og?eyebrow=Pillar&accent=forest&title=${encodeURIComponent(pillar.title)}&subtitle=${encodeURIComponent(pillar.pinterestHook.slice(0, 110))}`,
          width: 1200,
          height: 630,
          alt: pillar.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pillar.title,
      description: pillar.pinterestHook,
      images: [
        `/api/og?eyebrow=Pillar&accent=forest&title=${encodeURIComponent(pillar.title)}&subtitle=${encodeURIComponent(pillar.pinterestHook.slice(0, 110))}`,
      ],
    },
  };
}

export default async function PillarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  const all = await getAllRecipes();
  const cluster = all.filter(pillar.match).sort((a, b) => a.totalTimeMin - b.totalTimeMin);

  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/recipes" className="hover:text-ink">Recipes</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">{pillar.headKeyword}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-terracotta-600">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Topic cluster
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{pillar.title}</h1>
        <p className="mt-4 text-lg text-ink-muted">{pillar.intro}</p>
        <p className="mt-3 text-sm text-ink-subtle">
          {cluster.length} recipe{cluster.length === 1 ? '' : 's'} in this cluster — sorted from
          fastest to longest cook time.
        </p>
      </header>

      {/* Expert tip — voice-search-style answer block */}
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-forest-50 to-cream-50 p-6 shadow-sm ring-1 ring-forest-200">
        <div className="flex items-start gap-3">
          <Quote className="mt-1 h-5 w-5 shrink-0 text-forest-700" aria-hidden />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">
              Expert tip
            </p>
            <p className="mt-2 text-ink">{pillar.tip}</p>
          </div>
        </div>
      </section>

      {cluster.length > 0 ? (
        <section>
          <h2 className="mb-6 font-serif text-2xl">All {cluster.length} recipes in this cluster</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cluster.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-ink-muted">No recipes in this cluster yet — check back as the catalog grows.</p>
      )}

      {/* People-also-ask list of long-tail variations Google might surface */}
      <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl">People also search for</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {pillar.longTail.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-ink-muted">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400" aria-hidden />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Cross-link to sibling pillars — topic-cluster reinforcement */}
      <section className="mt-12 rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-xl text-ink">Other topic clusters</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PILLARS.filter((p) => p.slug !== slug).map((p) => (
            <Link
              key={p.slug}
              href={`/pillars/${p.slug}`}
              className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-terracotta-400 hover:text-terracotta-500"
            >
              {p.headKeyword}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
