import type { Metadata } from 'next';
import Link from 'next/link';
import { SeasoningByWeight } from './SeasoningByWeight';

export const metadata: Metadata = {
  title: 'Seasoning by Weight Calculator — How Much Salt to Use',
  description:
    'Stop guessing "salt to taste." Enter your dish weight and food type to get exact gram amounts for salt, pepper, and aromatics. Built on Modernist Cuisine and Salt Fat Acid Heat seasoning ratios. Free, no signup.',
  alternates: { canonical: '/calculators/seasoning-by-weight' },
  keywords: [
    'how much salt',
    'salt to taste calculator',
    'seasoning calculator',
    'dry brine calculator',
    'wet brine ratio',
    'salt percentage cooking',
    'pasta water salt',
    'bread dough salt percentage',
    'how to salt steak',
    'how much salt for chicken',
  ],
};

export default function SeasoningByWeightPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Seasoning calculator
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
          Seasoning by Weight Calculator
        </h1>
        <p className="mt-3 text-lg text-ink-muted">
          The most common cause of bland food is under-salting. The most common cause of
          inedible food is over-salting. The fix is the same: stop measuring salt by
          intuition. Weigh your food, multiply by a known percentage, and you will be right
          every single time.
        </p>
      </div>

      <SeasoningByWeight />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Why this calculator beats a recipe</h2>
        <p className="mt-3 text-ink-muted">
          A recipe says &quot;1 teaspoon of salt&quot; for a 4-pound chicken. That tells you
          nothing about whether your chicken is actually 4 pounds, whether your teaspoon is the
          same as the recipe writer&apos;s (Diamond Crystal kosher and Morton kosher pack at
          ratios <strong>2:1</strong> by volume), or whether the chicken was already brined at
          the store. Weight-based seasoning removes every variable except the food itself.
        </p>
        <p className="mt-3 text-ink-muted">
          Professional kitchens season by percentage. A chef seasoning a 2-kilo brisket uses
          the same rate as a 200-gram steak — they multiply the mass by the same percentage and
          the result tastes identical. That same precision is now in your kitchen.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">The seasoning percentages, explained</h2>
        <div className="space-y-4">
          <article className="rounded-xl bg-cream-100 p-5">
            <h3 className="font-serif text-lg font-bold text-ink">Why 1.0% for poultry</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Chicken muscle holds approximately 75% water. Salt at 1.0% of total weight
              translates to roughly 4% salinity in the meat itself once water draws out and
              re-absorbs. That is exactly the salinity of well-seasoned commercially raised
              chicken — measurable, not guessed.
            </p>
          </article>
          <article className="rounded-xl bg-cream-100 p-5">
            <h3 className="font-serif text-lg font-bold text-ink">Why 0.6% for delicate fish</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Cod, sole, and tilapia have a soft cell structure. Above 0.85% the salt extracts
              too much liquid and the fish turns gummy. Under 0.4% and the fish tastes flat
              because there&apos;s no salt to balance the natural sweetness. The 0.6%
              window is narrow but it&apos;s the difference between &quot;perfect&quot; and
              &quot;why does this taste like nothing.&quot;
            </p>
          </article>
          <article className="rounded-xl bg-cream-100 p-5">
            <h3 className="font-serif text-lg font-bold text-ink">Why 2% in bread (against flour only)</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Bread dough salt is calculated against flour weight, not total dough weight,
              because the salt only interacts with the gluten network. 1.8–2.2% is the global
              baking standard for one reason: under 1.5% the loaf tastes &quot;wet&quot; and
              flat; over 2.2% the salt suppresses yeast activity enough to wreck the rise.
              Bakeries in Tokyo, Paris, and New York all converge at 2%.
            </p>
          </article>
          <article className="rounded-xl bg-cream-100 p-5">
            <h3 className="font-serif text-lg font-bold text-ink">Why salt water for pasta tastes &quot;like the sea&quot;</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Seawater is roughly 3.5% salt. Pasta water at the recommended 1.0–1.5% is only
              one-third as salty, but it tastes much saltier than it is because you are
              tasting the dissolved salt directly. The pasta itself absorbs about 1–2% of the
              salt in the water during cooking — that&apos;s where the &quot;seasoned through&quot;
              flavor comes from that you cannot replicate by salting after cooking.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-forest-50 p-6 ring-1 ring-forest-200">
        <h2 className="font-serif text-2xl text-forest-700">The salt-type density problem</h2>
        <p className="mt-3 text-sm text-ink-muted">
          Recipes written in cups and teaspoons betray you the moment you switch salt brands.
          One teaspoon of Diamond Crystal kosher weighs 2.8 grams. One teaspoon of Morton kosher
          weighs 4.8 grams. One teaspoon of fine sea salt weighs 5.7 grams. That is a 2× swing
          for the same volume. Recipes rarely specify which salt — your dish will be either
          flat or inedible depending on what is in your shaker.
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          By weighing salt in grams, you remove the entire problem. Buy a $15 kitchen scale.
          Switch to grams. Cook better food than 90% of home cooks who refuse to.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">When the calculator can&apos;t help</h2>
        <ul className="space-y-3 text-ink-muted">
          <li>
            <strong className="text-ink">Pre-seasoned ingredients.</strong> Bacon, anchovies, soy
            sauce, parmesan, miso, olives, and capers are already salt-heavy. Start at 50% of the
            calculated amount and adjust up.
          </li>
          <li>
            <strong className="text-ink">Dishes finished with salty cheese or sauce.</strong> A
            pasta dressed in pecorino and pasta water will pick up salt from both. Under-season
            the pasta itself by 20–30%.
          </li>
          <li>
            <strong className="text-ink">Long-braised stews.</strong> Salt added at the start
            concentrates as liquid reduces. Salt at the start at 70% of target, finish only at
            the end.
          </li>
          <li>
            <strong className="text-ink">Children and people on low-sodium diets.</strong> All the
            numbers here target average adult preference. Cut by 30–40% for kids; consult medical
            guidance for restricted diets.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Sources &amp; further reading</h2>
        <p className="mt-3 text-sm text-ink-muted">
          The percentages here are cross-referenced from Samin Nosrat&apos;s <em>Salt, Fat, Acid,
          Heat</em>; Nathan Myhrvold&apos;s <em>Modernist Cuisine</em>, Volume 1, pages 230–247;
          J. Kenji López-Alt&apos;s <em>The Food Lab</em> + Serious Eats brine articles;
          America&apos;s Test Kitchen <em>Cook&apos;s Illustrated</em> salting guides; and USDA
          Food Safety &amp; Inspection Service curing guidance for the cure category. When
          professional cookbook recommendations differ, we use the median value.
        </p>
      </section>
    </div>
  );
}
