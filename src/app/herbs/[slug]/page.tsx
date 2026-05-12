import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Leaf, Activity, AlertTriangle, ChefHat, Sparkles, FlaskConical, ExternalLink } from 'lucide-react';
import { HERBS, getHerb, SYNERGIES } from '@/content/herbs';
import { getCitationsForHerb } from '@/content/herb-citations';

export async function generateStaticParams() {
  return HERBS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const herb = getHerb(slug);
  if (!herb) return { title: 'Not found' };
  return {
    title: `${herb.name} — Health Benefits, Daily Intake, Cooking Method`,
    description: `${herb.name} active compounds, recommended daily intake, best cooking methods, contraindications, and recipes. Evidence-backed from NIH and peer-reviewed sources.`,
    alternates: { canonical: `/herbs/${slug}` },
    keywords: [
      `${herb.name} benefits`,
      `${herb.name} recipes`,
      `${herb.name} daily intake`,
      `${herb.name} side effects`,
      ...herb.conditions.map((c) => `${herb.name} for ${c.replace(/-/g, ' ')}`),
    ],
  };
}

export default async function HerbPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const herb = getHerb(slug);
  if (!herb) notFound();

  const relatedSynergies = SYNERGIES.filter((s) => s.herbs.includes(slug));

  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/herbs" className="hover:text-ink">Herbs</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">{herb.name}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <Leaf className="h-3.5 w-3.5" aria-hidden /> Therapeutic herb
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{herb.name}</h1>
        <p className="mt-3 text-lg text-ink-muted">{herb.notes}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl">Active compounds</h2>
          <ul className="mt-3 space-y-1.5">
            {herb.activeCompounds.map((c) => (
              <li key={c} className="text-sm text-ink-muted">
                <span className="font-bold text-ink">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl">Recommended daily intake</h2>
          <p className="mt-3 text-sm text-ink">{herb.dailyIntake}</p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl">Best cooking method</h2>
          <p className="mt-3 text-sm text-ink">{herb.cookingMethod}</p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl">Flavor profile</h2>
          <p className="mt-3 text-sm text-ink">{herb.flavor}</p>
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-forest-700" aria-hidden />
          <h2 className="font-serif text-xl">Conditions this herb supports</h2>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {herb.conditions.map((c) => (
            <Link
              key={c}
              href={`/conditions/${c}`}
              className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1.5 text-xs font-bold capitalize text-forest-700 hover:bg-forest-100"
            >
              {c.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-terracotta-500" aria-hidden />
          <h2 className="font-serif text-xl">Pairs with these cuisines</h2>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {herb.cuisines.map((c) => (
            <Link
              key={c}
              href={`/cuisine/${c}`}
              className="rounded-full border border-ink/10 bg-cream-100 px-3 py-1.5 text-xs font-bold capitalize text-ink hover:border-terracotta-400"
            >
              {c.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      </section>

      {relatedSynergies.length > 0 ? (
        <section className="mt-6 rounded-2xl bg-gradient-to-br from-forest-50 to-cream-50 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-forest-700" aria-hidden />
            <h2 className="font-serif text-xl text-forest-700">Synergies — combine with</h2>
          </div>
          <ul className="mt-3 space-y-3">
            {relatedSynergies.map((s, i) => (
              <li key={i} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-bold text-ink">
                  {s.herbs.filter((h) => h !== slug).map((h) => h.replace(/-/g, ' ')).join(' + ')}
                  {' '}
                  <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700">
                    boosts {s.amplifies.replace(/-/g, ' ')}
                  </span>
                </p>
                <p className="mt-2 text-sm text-ink-muted">{s.effect}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          <div>
            <h2 className="font-serif text-xl text-amber-900">Safety + contraindications</h2>
            <p className="mt-2 text-sm text-amber-900/90">{herb.contraindications}</p>
            <p className="mt-3 text-xs text-amber-900/70">
              This information is educational, not medical advice. Consult a qualified clinician
              before therapeutic-dose use, especially during pregnancy, lactation, or when on
              prescription medication.
            </p>
          </div>
        </div>
      </section>

      <CitationsBlock herbSlug={slug} />

      <section className="mt-12 rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-xl">Other therapeutic herbs</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {HERBS.filter((h) => h.slug !== slug).slice(0, 16).map((h) => (
            <Link
              key={h.slug}
              href={`/herbs/${h.slug}`}
              className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-forest-400"
            >
              {h.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function CitationsBlock({ herbSlug }: { herbSlug: string }) {
  const citations = getCitationsForHerb(herbSlug);
  if (citations.length === 0) return null;
  return (
    <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-forest-700" aria-hidden />
        <h2 className="font-serif text-xl">Scientific research</h2>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        Peer-reviewed studies cited from NIH PubMed. Click any PMID to read
        the abstract.
      </p>
      <ul className="mt-4 space-y-3">
        {citations.map((c) => (
          <li key={c.pmid} className="rounded-xl border border-ink/5 p-3">
            <div className="flex items-baseline gap-2">
              <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700">
                {c.studyType}
              </span>
              <span className="text-[11px] text-ink-subtle">{c.year}</span>
            </div>
            <p className="mt-1 text-sm font-bold text-ink">{c.title}</p>
            <p className="mt-0.5 text-xs text-ink-muted">{c.authors}</p>
            <p className="mt-2 text-sm text-ink">{c.finding}</p>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-terracotta-600 hover:underline"
            >
              PubMed PMID: {c.pmid}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[10px] text-ink-subtle">
        Studies summarized for plain-English understanding. Read the full
        abstract on PubMed for methodology, sample size, and limitations.
      </p>
    </section>
  );
}
