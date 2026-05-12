import type { Metadata } from 'next';
import Link from 'next/link';
import { RecipeCost } from './RecipeCost';

export const metadata: Metadata = {
  title: 'Recipe Cost Calculator — Cost Per Serving & Food Cost Percentage',
  description:
    'Calculate exactly what every recipe costs to make. Per-pack or per-unit pricing, automatic cost-per-serving, pantry-staple exclusion, ingredient-share breakdown. Used by home cooks, meal-preppers, and restaurant pop-ups. Free, no signup.',
  alternates: { canonical: '/calculators/recipe-cost' },
  keywords: [
    'recipe cost calculator',
    'cost per serving calculator',
    'food cost calculator',
    'meal cost calculator',
    'how much does this recipe cost',
    'restaurant food cost percentage',
    'meal prep budget',
    'budget cooking',
    'price per serving',
  ],
};

export default function RecipeCostPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Recipe cost calculator
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Recipe Cost Calculator</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Most recipes show you what to buy. Almost none show you what it costs. Enter your
          ingredients with either pack pricing (what you paid at the store) or per-unit pricing
          (what one gram or one ounce costs). Get exact cost per serving, total recipe cost, and a
          ranked breakdown of which ingredients drive the bill.
        </p>
      </div>

      <RecipeCost />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">How to enter prices accurately</h2>
        <p className="mt-3 text-ink-muted">
          The fastest, most accurate way is <strong>per pack</strong>. Look at the receipt or the
          shelf tag. You paid <strong>£7.50 for a 900&nbsp;g pack of chicken thighs</strong>; you
          used <strong>900&nbsp;g</strong> in the recipe; the line cost is exactly £7.50. The
          calculator does this division automatically. You never need to compute &quot;cost per
          gram&quot; in your head.
        </p>
        <p className="mt-3 text-ink-muted">
          Use <strong>per unit</strong> only when you already know the unit cost. Restaurants and
          ghost kitchens that build cost sheets in spreadsheets usually have a unit-price database
          and prefer this entry method. Home cooks rarely need it.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">The &quot;pantry staple&quot; rule</h2>
        <p className="mt-2 text-ink-muted">
          Salt, pepper, olive oil, and most baking-cabinet staples come from an existing pot in
          your kitchen, not a fresh shop. They cost real money, but the cost was paid weeks or
          months ago and the per-recipe amount is so small it would skew the cost-per-serving
          number into uselessness.
        </p>
        <p className="mt-3 text-ink-muted">
          When you mark an ingredient as a pantry staple, the calculator does two things:
        </p>
        <ul className="mt-3 space-y-2 text-ink-muted">
          <li>• Includes its cost in the <strong>total recipe cost</strong> figure (because that&apos;s the honest number)</li>
          <li>• Excludes it from <strong>cost per serving</strong> (because per-serving is what you actually feel when planning the week&apos;s shop)</li>
        </ul>
        <p className="mt-3 text-ink-muted">
          The bar-chart breakdown below shows staple rows in muted gray so you can see which
          assumed staples actually add up. Most kitchens have 3-5 hidden staple rows that quietly
          dominate the total.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-2xl">For restaurants and pop-ups: food cost percentage</h2>
        <p className="mt-3 text-ink-muted">
          Industry-standard target food cost is <strong>28-32% of menu price</strong>. If a dish
          costs you £3.50 to make and you want a 30% food cost, you sell it for £3.50 ÷ 0.30 =
          <strong> £11.67</strong>. Round up to £12 for menu legibility. Anything lower than 28%
          and you&apos;re probably under-portioning; higher than 35% and the dish bleeds margin.
        </p>
        <p className="mt-3 text-ink-muted">
          For small-batch and pop-up settings, ignore the staple-exclusion rule. Restaurants have
          to account for every cent of salt and oil because they buy industrial quantities at
          tight margins. Untoggle the staple flag and let everything roll into the total.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">How to drive recipe cost down</h2>
        <ul className="space-y-3 text-ink-muted">
          <li>
            <strong className="text-ink">Look at the bar chart first.</strong> The top 2-3 rows
            usually account for 60-80% of total cost. Optimising those is where the savings are.
            Optimising your salt budget is theatre.
          </li>
          <li>
            <strong className="text-ink">Swap protein cut, not protein type.</strong> Chicken
            thighs cost roughly half of chicken breast for more flavour. Beef chuck makes a better
            stew than chuck ribeye at one-quarter the price.
          </li>
          <li>
            <strong className="text-ink">Buy whole, butcher down.</strong> A whole chicken at
            the deli counter is 30-40% cheaper than the equivalent weight of pre-cut pieces.
            Carcass for stock is free.
          </li>
          <li>
            <strong className="text-ink">Pulse seasonal produce in.</strong> The Ingredient
            Substitution Matcher will tell you what to swap when a recipe calls for off-season
            ingredients at peak price.
          </li>
          <li>
            <strong className="text-ink">Pack sizes matter.</strong> The 1&nbsp;kg flour bag is
            often 35% cheaper per gram than the 500&nbsp;g bag. If you bake regularly, buy bigger.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-forest-50 p-6 ring-1 ring-forest-200">
        <h2 className="font-serif text-2xl text-forest-700">Pair this with other RecipeCrave tools</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li>
            • <Link href="/calculators/realtime-recipe-scaler" className="font-bold text-terracotta-600 hover:underline">Real-time Recipe Scaler</Link> &mdash; scale a costed recipe up to feed 12 or down to feed 2; per-serving cost stays constant.
          </li>
          <li>
            • <Link href="/calculators/unit-converter" className="font-bold text-terracotta-600 hover:underline">Cups → Grams Converter</Link> &mdash; convert cup-and-spoon recipes into the gram weights this calculator wants.
          </li>
          <li>
            • <Link href="/calculators/ingredient-substitutions" className="font-bold text-terracotta-600 hover:underline">Ingredient Substitution Matcher</Link> &mdash; if the top cost row is a luxury ingredient, find a budget swap.
          </li>
        </ul>
      </section>
    </div>
  );
}
