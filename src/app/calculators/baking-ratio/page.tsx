import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calculator } from 'lucide-react';
import { BakingRatio } from './BakingRatio';

export const metadata: Metadata = {
  title: "Baker's Percentage Calculator — Free Bread, Pizza & Sourdough Ratios",
  description:
    "Scale any bread recipe by target flour weight. Hydration slider, 10 built-in presets (lean bread, pizza Napoletana, sourdough, brioche, focaccia, bagels), plus save your own. Math: flour=100%, all other ingredients as a percent of flour.",
  alternates: { canonical: '/calculators/baking-ratio' },
  keywords: [
    "baker's percentage",
    'bread ratio calculator',
    'sourdough hydration',
    'pizza dough calculator',
    'baking ratio',
    'flour to water ratio',
    'baker math',
    'how much salt in bread',
    'brioche ratio',
    'focaccia hydration',
  ],
  openGraph: {
    title: "Baker's Percentage Calculator",
    description:
      'Scale any bread or pizza dough by target flour weight. 10 presets, custom hydration, save your own.',
    type: 'website',
  },
};

export default function BakingRatioPage() {
  return (
    <div className="container py-10 lg:py-14">
      <Link
        href="/calculators"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-forest-600 hover:text-forest-700"
      >
        <ArrowLeft className="h-4 w-4" />
        All Kitchen Tools
      </Link>

      <header className="mb-10 max-w-3xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-600">
          <Calculator className="h-4 w-4" />
          Calculator
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink sm:text-5xl lg:text-6xl">
          Baker's Percentage Calculator
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">
          Pick a preset. Set your target flour weight. Get exact grams for water, salt, yeast, fat, and the rest.
          Adjust hydration with a slider. Save your own variations.
        </p>
      </header>

      <BakingRatio />

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-ink/5 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-ink">How baker's percentage works</h2>
          <p className="mt-3 text-sm text-ink-muted">
            Professional bakers express every ingredient as a percent of the total flour weight, never as a fixed
            quantity. Flour is always 100%. Water at 65% means 65g water per 100g flour. Salt at 2% means 2g salt per
            100g flour. The ratios stay constant no matter how big the batch.
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            Why it matters: doubling a recipe by feel is error-prone. Doubling by ratio is bulletproof. Same dough,
            same hydration, same crumb at 500g or 5kg of flour.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-ink/5 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-ink">Hydration cheat sheet</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li><b className="text-ink">55-60%:</b> Bagels, pretzels, pizza Napoletana. Stiff, easy to shape.</li>
            <li><b className="text-ink">62-68%:</b> Sandwich bread, dinner rolls, NY pizza. Soft but holds shape.</li>
            <li><b className="text-ink">70-75%:</b> Country boule, ciabatta. Open crumb, needs gentle handling.</li>
            <li><b className="text-ink">75-85%:</b> Focaccia, very wet sourdough. Slap-and-fold instead of kneading.</li>
            <li><b className="text-ink">85%+:</b> Master baker territory. Loose, sticky, big holes, deep flavour.</li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-ink/5 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-ink">Salt, yeast & starter percentages</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li><b className="text-ink">Salt 1.8-2.2%:</b> 2% is the sweet spot. Above 2.5% slows yeast. Below 1.5% reads bland.</li>
            <li><b className="text-ink">Instant yeast 0.5-1.5%:</b> 0.8% for a 4h same-day rise. 0.2% for a 24-72h cold ferment.</li>
            <li><b className="text-ink">Sourdough starter 15-25%:</b> 20% (at 100% hydration) is a balanced levain inoculation.</li>
            <li><b className="text-ink">Butter 6-10%:</b> Soft sandwich loaf. Brioche jumps to 40-60%.</li>
            <li><b className="text-ink">Sugar 1-8%:</b> 1% for browning only. 6-8% for sweet enriched bread.</li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-ink/5 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-ink">Sources</h2>
          <p className="mt-3 text-sm text-ink-muted">
            Default percentages cross-referenced against King Arthur Baking ratio guides, Serious Eats Food Lab pizza
            and sourdough articles, and America's Test Kitchen bread chapter. Hydration ranges reflect what each style
            stays workable within — push beyond the max for advanced wet doughs at your own risk.
          </p>
        </div>
      </section>
    </div>
  );
}
