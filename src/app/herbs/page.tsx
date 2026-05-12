import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Heart, Brain, Activity, Coffee } from 'lucide-react';
import { HERBS, CONDITIONS, SYNERGIES } from '@/content/herbs';
import { SeasonalHerbs } from '@/components/site/SeasonalHerbs';

export const metadata: Metadata = {
  title: 'Therapeutic Herbs & Functional Ingredients — Food as Preventive Health',
  description:
    'Evidence-backed reference on 30+ medicinal herbs and functional foods. Active compounds, daily intake, cooking methods that preserve potency, contraindications. Built for home cooks managing real health goals through diet.',
  alternates: { canonical: '/herbs' },
  keywords: [
    'medicinal herbs',
    'therapeutic herbs',
    'functional foods',
    'food as medicine',
    'herbs for inflammation',
    'herbs for blood sugar',
    'turmeric benefits',
    'ginger benefits',
    'herbs and ailments',
    'preventive health cooking',
  ],
};

export default function HerbsLanding() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-12 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <Leaf className="h-3.5 w-3.5" aria-hidden /> Food as medicine
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          Therapeutic herbs &amp; functional ingredients
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          {HERBS.length} evidence-backed herbs and functional foods cross-referenced with the
          health conditions they support, the active compounds responsible, daily intake
          windows, and cooking methods that preserve potency. Built for home cooks managing
          real health goals — inflammation, blood sugar, sleep, digestion, immune support — not
          replacing medical care.
        </p>
      </header>

      {/* Seasonal herb rotation — surfaces 4 in-season herbs per current month */}
      <div className="mb-12">
        <SeasonalHerbs />
      </div>

      <section className="mb-12">
        <h2 className="mb-4 font-serif text-2xl">By health condition</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONDITIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/conditions/${c.slug}`}
              className="group block rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-serif text-lg font-bold text-ink group-hover:text-terracotta-500">{c.name}</p>
              <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{c.intro}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-serif text-2xl">All herbs &amp; functional ingredients</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {HERBS.map((h) => (
            <Link
              key={h.slug}
              href={`/herbs/${h.slug}`}
              className="group rounded-xl border border-ink/10 bg-white p-4 transition-colors hover:border-forest-400 hover:bg-forest-50"
            >
              <p className="font-serif text-base font-bold text-ink group-hover:text-forest-700">{h.name}</p>
              <p className="mt-1 text-[11px] text-ink-subtle">{h.flavor}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {h.conditions.slice(0, 2).map((c) => (
                  <span key={c} className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-bold text-ink-muted">
                    {c.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-2xl bg-gradient-to-br from-forest-50 to-cream-50 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-forest-700" aria-hidden />
          <h2 className="font-serif text-2xl text-forest-700">Herb synergies — combinations that amplify effect</h2>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          Some herb pairings dramatically exceed the sum of their parts. Curcumin absorption
          jumps 2000% with black pepper. Garlic + ginger broaden antimicrobial coverage.
          Below are the most-studied pairings.
        </p>
        <ul className="mt-5 space-y-4">
          {SYNERGIES.map((s, i) => (
            <li key={i} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-baseline gap-2">
                <strong className="font-serif text-base text-ink">
                  {s.herbs.map((h) => h.replace(/-/g, ' ')).join(' + ')}
                </strong>
                <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700">
                  {s.amplifies.replace(/-/g, ' ')}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{s.effect}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12 rounded-2xl bg-gradient-to-br from-amber-50 to-cream-50 p-6 shadow-sm ring-1 ring-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
              New: Drug + condition interaction checker
            </p>
            <h2 className="mt-1 font-serif text-xl text-ink">
              Free herb-drug safety check
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Tick the medications and conditions that apply to you. We flag any
              interactions across the 30+ herbs in this catalog with source citations
              from NIH NCCIH, Memorial Sloan Kettering, and WHO Monographs.
            </p>
          </div>
          <Link
            href="/safety-check"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-amber-700 focus-ring"
          >
            Run safety check →
          </Link>
        </div>
      </section>

      <section className="rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
        <div className="flex items-start gap-2">
          <Heart className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          <div>
            <h2 className="font-serif text-xl text-amber-900">Safety notice</h2>
            <p className="mt-2 text-sm text-amber-900/90">
              Recipes using these herbs are <strong>food, not medicine</strong>. Therapeutic
              dosages and concentrated extracts require qualified clinical guidance, especially
              if you take prescription medication, are pregnant or breastfeeding, or manage a
              serious health condition. Every herb page lists contraindications + drug
              interactions. Read before increasing intake.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
          <Coffee className="h-4 w-4" aria-hidden />
          <span>
            Sources cited per claim: NIH NCCIH · Examine.com peer-review summaries · WHO Monographs
            on Selected Medicinal Plants · American Botanical Council clinical guidelines
          </span>
        </div>
      </section>
    </div>
  );
}
