import type { Metadata } from 'next';
import Link from 'next/link';
import { CalorieEstimator } from './CalorieEstimator';
import { CALORIE_TABLE } from '@/content/calorie-data';

export const metadata: Metadata = {
  title: 'Calorie Estimator — Recipe Calorie & Macro Calculator',
  description:
    `Get calories and macros for any recipe. ${CALORIE_TABLE.length}-food USDA-derived database, smart unit conversion (cups, tbsp, whole eggs, slices), manual override for unmatched ingredients, per-serving + total view. Free, no signup.`,
  alternates: { canonical: '/calculators/calorie-estimator' },
  keywords: [
    'recipe calorie calculator',
    'calorie estimator',
    'macro calculator recipe',
    'how many calories in this recipe',
    'recipe nutrition calculator',
    'USDA calorie database',
    'protein carbs fat calculator',
    'meal prep calories',
    'calculate calories from ingredients',
  ],
};

export default function CalorieEstimatorPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Calorie estimator
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
          Recipe Calorie &amp; Macro Calculator
        </h1>
        <p className="mt-3 text-lg text-ink-muted">
          Type each ingredient, pick the best USDA match, enter quantity in any unit. Get calories
          plus a protein-carb-fat breakdown per serving and across the whole recipe. {CALORIE_TABLE.length}
          {' '}foods indexed; unmatched ingredients accept manual values per 100 g.
        </p>
      </div>

      <CalorieEstimator />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">How the math works</h2>
        <p className="mt-3 text-ink-muted">
          Every food in the database carries USDA-derived values for{' '}
          <strong>kcal, protein, carbohydrate, fat, and fiber per 100&nbsp;g</strong>. The
          calculator does three things per line:
        </p>
        <ol className="mt-3 space-y-2 text-ink-muted">
          <li>
            <strong className="text-ink">1.</strong> Converts your quantity into grams. Mass units
            (g, kg, oz, lb) are direct. Volume units (cup, tbsp, tsp, ml, l, fl&nbsp;oz) use the
            ingredient&apos;s density — flour packs at 125&nbsp;g/cup, honey at 339&nbsp;g/cup,
            water at 240&nbsp;g/cup, butter at 227&nbsp;g/cup. Pieces (whole, slice, each) use
            per-ingredient standard weights — a large egg is 50&nbsp;g, a medium banana is
            118&nbsp;g, a slice of white bread is 25&nbsp;g.
          </li>
          <li>
            <strong className="text-ink">2.</strong> Multiplies the per-100&nbsp;g nutrient values
            by (grams / 100). A 200&nbsp;g chicken breast contributes 2.0 × the per-100&nbsp;g
            values. Simple, exact, no rounding errors.
          </li>
          <li>
            <strong className="text-ink">3.</strong> Sums every line into a total, divides by your
            servings count for the per-serving figure. Macro percentages are computed by
            kilocalorie contribution (4&nbsp;kcal/g protein, 4&nbsp;kcal/g carb, 9&nbsp;kcal/g fat)
            so the three pie slices always add to 100%.
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">Why density matters for cup-based recipes</h2>
        <p className="mt-2 text-ink-muted">
          A &quot;cup&quot; is 240&nbsp;ml of volume, not 240&nbsp;g of mass. The mass depends
          entirely on what fills the cup. Look at the spread:
        </p>
        <div className="mt-3 overflow-hidden rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left">
              <tr>
                <th className="px-3 py-2 font-semibold text-ink">1 cup of</th>
                <th className="px-3 py-2 text-right font-semibold text-ink">Weight (g)</th>
                <th className="px-3 py-2 text-right font-semibold text-ink">Calories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              <tr><td className="px-3 py-2">All-purpose flour</td><td className="px-3 py-2 text-right">125</td><td className="px-3 py-2 text-right">455</td></tr>
              <tr><td className="px-3 py-2">Honey</td><td className="px-3 py-2 text-right">339</td><td className="px-3 py-2 text-right">1030</td></tr>
              <tr><td className="px-3 py-2">Butter</td><td className="px-3 py-2 text-right">227</td><td className="px-3 py-2 text-right">1627</td></tr>
              <tr><td className="px-3 py-2">Whole milk</td><td className="px-3 py-2 text-right">244</td><td className="px-3 py-2 text-right">149</td></tr>
              <tr><td className="px-3 py-2">Olive oil</td><td className="px-3 py-2 text-right">216</td><td className="px-3 py-2 text-right">1910</td></tr>
              <tr><td className="px-3 py-2">Cornflakes</td><td className="px-3 py-2 text-right">28</td><td className="px-3 py-2 text-right">100</td></tr>
              <tr><td className="px-3 py-2">Cooked white rice</td><td className="px-3 py-2 text-right">158</td><td className="px-3 py-2 text-right">205</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          A calorie calculator that ignores density and treats &quot;1 cup&quot; as a fixed weight
          would be off by 1500% between cornflakes and honey. The unit-aware conversion built into
          this tool gives the same answer a registered dietitian with a kitchen scale would.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-2xl">How accurate is &quot;USDA-derived&quot;?</h2>
        <p className="mt-3 text-ink-muted">
          The reference values come from the USDA FoodData Central database (Standard Reference
          Legacy plus SR-28), which is the same source nearly every commercial nutrition tracker
          uses. Lab-measured ranges for the same food can vary ±10-15% depending on cultivar,
          ripeness, fat trim, and cooking method. The values here are conservative medians.
        </p>
        <p className="mt-3 text-ink-muted">
          For medical-grade precision (managing diabetes, training for a competition), pair this
          calculator with a kitchen scale and check package labels — manufacturers&apos; printed
          values reflect their specific product and override generic database values.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">What the macro split tells you</h2>
        <p className="mt-2 text-ink-muted">
          Calories tell you energy load. Macros tell you what kind of fuel. The split is computed
          from kilocalorie contribution, not gram weight, because that&apos;s what matters
          biologically. Quick reference for common dietary targets per serving:
        </p>
        <ul className="mt-3 space-y-2 text-ink-muted">
          <li>
            <strong className="text-ink">High-protein meal:</strong> protein &gt; 30% of calories.
            Typical chicken-and-veg dinners land here. Good for muscle recovery and satiety.
          </li>
          <li>
            <strong className="text-ink">Balanced meal:</strong> protein 20-30%, carb 40-55%, fat
            20-35%. The most studied long-term sustainable pattern.
          </li>
          <li>
            <strong className="text-ink">Keto / low-carb:</strong> carb under 10%, fat above 65%.
            Most regular recipes will not reach this without substitutions — see the Substitution
            Matcher for low-carb swaps.
          </li>
          <li>
            <strong className="text-ink">Pre-workout / endurance:</strong> carb above 60%. Pasta,
            rice, oats, fruit lift this number fast.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-forest-50 p-6 ring-1 ring-forest-200">
        <h2 className="font-serif text-2xl text-forest-700">Pair with other RecipeCrave tools</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li>• <Link href="/calculators/realtime-recipe-scaler" className="font-bold text-terracotta-600 hover:underline">Real-time Recipe Scaler</Link> &mdash; scale calories proportionally when you change servings</li>
          <li>• <Link href="/calculators/unit-converter" className="font-bold text-terracotta-600 hover:underline">Cups → Grams Converter</Link> &mdash; convert legacy recipes into the weight-based form this calculator favors</li>
          <li>• <Link href="/calculators/recipe-cost" className="font-bold text-terracotta-600 hover:underline">Recipe Cost Calculator</Link> &mdash; pair calorie data with cost-per-serving for full meal-prep accounting</li>
        </ul>
      </section>
    </div>
  );
}
