import type { Metadata } from 'next';
import Link from 'next/link';
import { RealtimeRecipeScaler } from './RealtimeRecipeScaler';

export const metadata: Metadata = {
  title: 'Real-time Recipe Scaler with Cost Calculator',
  description:
    'Scale any recipe up or down with a live slider. Ingredients, total cost, and cost-per-serving update instantly. Handles cups, grams, ounces, tablespoons, and whole units. Free, no signup.',
  alternates: { canonical: '/calculators/realtime-recipe-scaler' },
  keywords: [
    'recipe scaler',
    'recipe calculator',
    'serving size calculator',
    'scale recipe up',
    'scale recipe down',
    'cost per serving calculator',
    'recipe cost calculator',
  ],
};

export default function RealtimeRecipeScalerPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Recipe scaler
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
          Real-time Recipe Scaler
        </h1>
        <p className="mt-3 text-lg text-ink-muted">
          Paste any recipe. Drag the servings slider. Ingredient quantities, total cost, and
          cost-per-serving update instantly. Handles cups, grams, ounces, tablespoons, whole eggs,
          and &quot;to taste&quot; items. Save recipes locally and reload anytime.
        </p>
      </div>

      <RealtimeRecipeScaler />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">How scaling works</h2>
        <p className="mt-3 text-ink-muted">
          The scaler computes a ratio: <strong>desired servings ÷ original servings</strong>. Every
          ingredient quantity is multiplied by that ratio. Cost per serving stays constant; total
          cost scales with the ratio.
        </p>
        <p className="mt-3 text-ink-muted">
          Whole-count ingredients like eggs are rounded up (you cannot use 1.7 eggs). Items marked
          &quot;to taste&quot; are passed through unchanged because seasoning does not scale
          linearly. A warning appears if you scale below 50% or above 300% of the original — at
          those extremes cook times, pan size, and seasoning need manual adjustment.
        </p>
        <div className="mt-6 rounded-xl bg-cream-100 p-4">
          <p className="text-sm font-semibold text-ink">Supported units</p>
          <p className="mt-1 text-sm text-ink-muted">
            cup, tbsp, tsp, ml, l, oz, fl-oz, g, kg, lb, pinch, dash, whole, slice, clove. The
            unit stays the same after scaling — quantities only get multiplied. Use the cups→grams
            converter first if you want to standardize to weight.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">Tips for scaling recipes</h2>
        <ul className="space-y-3 text-ink-muted">
          <li>
            <strong className="text-ink">Baking is sensitive.</strong> Cakes, breads, and pastry
            depend on ratios between flour, fat, and leavener. Scaling more than 2× changes the
            pan area and bake time. Use the baker&apos;s percentage calculator for precision.
          </li>
          <li>
            <strong className="text-ink">Salt and spice scale less than linearly.</strong> Doubling
            a recipe rarely needs double the salt. Add 70-80% first, then adjust.
          </li>
          <li>
            <strong className="text-ink">Liquid evaporation does not scale.</strong> A doubled stew
            will not double the cook-down time. Reduce uncovered for shorter than you might think.
          </li>
          <li>
            <strong className="text-ink">Pan size matters.</strong> Doubling a 9-inch cake recipe
            does not fit in one 9-inch pan. Use two pans or step up to a 12-inch.
          </li>
        </ul>
      </section>
    </div>
  );
}
