import type { Metadata } from 'next';
import Link from 'next/link';
import { UnitConverter } from './UnitConverter';

export const metadata: Metadata = {
  title: 'Cups → Grams Converter — Free Kitchen Calculator',
  description:
    'Convert any cooking ingredient between US cups, metric grams, ounces, milliliters, tablespoons, and teaspoons. 60+ ingredients with density-accurate ratios. Free, no signup.',
  alternates: { canonical: '/calculators/unit-converter' },
  keywords: [
    'cups to grams',
    'grams to cups',
    'flour cups to grams',
    'sugar cups to grams',
    'butter conversion',
    'cooking measurement converter',
  ],
};

export default function UnitConverterPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Kitchen converter
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Cups → Grams Converter</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Recipes from different countries use different units. Pick your ingredient, type a number,
          get the conversion. We use density-accurate ratios so a cup of flour gets a different
          gram value than a cup of sugar.
        </p>
      </div>

      <UnitConverter />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Why density matters</h2>
        <p className="mt-3 text-ink-muted">
          A cup is a volume measurement. A gram is a weight measurement. Different ingredients pack
          different amounts of weight into the same volume. A cup of all-purpose flour weighs about
          125g. A cup of granulated sugar weighs about 200g. A cup of honey weighs 340g.
        </p>
        <p className="mt-3 text-ink-muted">
          That&apos;s why &ldquo;a cup of flour&rdquo; in an American recipe doesn&apos;t map to one
          fixed gram value. Pick the actual ingredient and we use its real-world density. The
          numbers below come from USDA FoodData Central and standard pastry references.
        </p>
        <div className="mt-6 rounded-xl bg-cream-100 p-4">
          <p className="text-sm font-semibold text-ink">Tip for bakers</p>
          <p className="mt-1 text-sm text-ink-muted">
            Volume measurements are inconsistent. A &ldquo;packed&rdquo; cup of brown sugar can weigh
            30% more than a lightly scooped one. If a recipe gives both, always use the gram weight.
            Your bakes will be more consistent.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">Common conversions</h2>
        <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-ink">Ingredient</th>
                <th className="px-4 py-2 text-right font-semibold text-ink">1 cup =</th>
                <th className="px-4 py-2 text-right font-semibold text-ink">1 tbsp =</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              <tr><td className="px-4 py-2">All-purpose flour</td><td className="px-4 py-2 text-right">125 g</td><td className="px-4 py-2 text-right">8 g</td></tr>
              <tr><td className="px-4 py-2">Bread flour</td><td className="px-4 py-2 text-right">130 g</td><td className="px-4 py-2 text-right">8 g</td></tr>
              <tr><td className="px-4 py-2">Whole wheat flour</td><td className="px-4 py-2 text-right">120 g</td><td className="px-4 py-2 text-right">8 g</td></tr>
              <tr><td className="px-4 py-2">Granulated sugar</td><td className="px-4 py-2 text-right">200 g</td><td className="px-4 py-2 text-right">12 g</td></tr>
              <tr><td className="px-4 py-2">Brown sugar (packed)</td><td className="px-4 py-2 text-right">220 g</td><td className="px-4 py-2 text-right">14 g</td></tr>
              <tr><td className="px-4 py-2">Powdered sugar</td><td className="px-4 py-2 text-right">120 g</td><td className="px-4 py-2 text-right">8 g</td></tr>
              <tr><td className="px-4 py-2">Butter</td><td className="px-4 py-2 text-right">227 g</td><td className="px-4 py-2 text-right">14 g</td></tr>
              <tr><td className="px-4 py-2">Honey</td><td className="px-4 py-2 text-right">340 g</td><td className="px-4 py-2 text-right">21 g</td></tr>
              <tr><td className="px-4 py-2">Water</td><td className="px-4 py-2 text-right">237 g</td><td className="px-4 py-2 text-right">15 g</td></tr>
              <tr><td className="px-4 py-2">Milk</td><td className="px-4 py-2 text-right">245 g</td><td className="px-4 py-2 text-right">15 g</td></tr>
              <tr><td className="px-4 py-2">Olive oil</td><td className="px-4 py-2 text-right">216 g</td><td className="px-4 py-2 text-right">14 g</td></tr>
              <tr><td className="px-4 py-2">Cocoa powder</td><td className="px-4 py-2 text-right">85 g</td><td className="px-4 py-2 text-right">5 g</td></tr>
              <tr><td className="px-4 py-2">Rolled oats</td><td className="px-4 py-2 text-right">85 g</td><td className="px-4 py-2 text-right">5 g</td></tr>
              <tr><td className="px-4 py-2">Rice (uncooked)</td><td className="px-4 py-2 text-right">200 g</td><td className="px-4 py-2 text-right">13 g</td></tr>
              <tr><td className="px-4 py-2">Peanut butter</td><td className="px-4 py-2 text-right">258 g</td><td className="px-4 py-2 text-right">16 g</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-subtle">
          Sources: USDA FoodData Central, King Arthur Baking, Joy of Cooking. All values are
          rounded to nearest gram for practical use.
        </p>
      </section>
    </div>
  );
}
