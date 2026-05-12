import type { Metadata } from 'next';
import Link from 'next/link';
import { PantryMatcher } from './PantryMatcher';
import { getAllRecipes } from '@/lib/data/recipes';
import { PANTRY_ITEMS } from '@/content/pantry-catalog';

export const metadata: Metadata = {
  title: 'Pantry Inventory + Recipe Matcher — What Can I Cook Tonight?',
  description:
    `Log what is in your kitchen, get a ranked list of recipes you can actually make right now. Match scoring against 200+ recipes, missing-ingredient hints, photo scan support, ${PANTRY_ITEMS.length}-item checklist. Free, no signup.`,
  alternates: { canonical: '/calculators/pantry-inventory-matcher' },
  keywords: [
    'pantry recipe finder',
    'what can I cook with',
    'what to cook with ingredients I have',
    'pantry inventory tracker',
    'recipes from what I have',
    'use up ingredients',
    'reduce food waste',
    'pantry app',
    'fridge to recipe',
  ],
};

export default async function PantryMatcherPage() {
  const recipes = await getAllRecipes();
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Pantry matcher
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
          What can I cook tonight?
        </h1>
        <p className="mt-3 text-lg text-ink-muted">
          Tick what is in your fridge, freezer, and cupboards. The matcher checks
          against {recipes.length} recipes in the RecipeCrave catalog and ranks
          everything you can make. Salt, pepper, oil, sugar, and water are
          assumed present by default — toggle off if you really do not have them.
        </p>
      </div>

      <PantryMatcher recipes={recipes} />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">How the match score works</h2>
        <p className="mt-3 text-ink-muted">
          Every recipe is broken into its ingredient list. Each ingredient
          string is parsed against the {PANTRY_ITEMS.length}-item pantry catalog
          using <strong>longest-needle-first word-boundary matching</strong> —
          a recipe line that says &quot;tomato paste&quot; resolves to the
          canned-tomato pantry item, not the fresh-tomato one. Aliases like
          &quot;courgette&quot; → zucchini and &quot;passata&quot; →
          canned-tomato are baked in.
        </p>
        <p className="mt-3 text-ink-muted">
          Score = (ingredients you have) ÷ (total ingredients) × 100. A 100%
          match means you have everything you need; 80% means you are 1-2
          items short; below 60% the matcher hides the recipe entirely because
          you would essentially be shopping a fresh recipe.
        </p>
        <p className="mt-3 text-ink-muted">
          Custom items you type at the bottom of the pantry panel are bonus
          matches — if a recipe ingredient line contains the text of your
          custom item, it counts. &quot;Leftover roast chicken&quot; matches
          any recipe calling for cooked chicken.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">Pair with the Photo Scan</h2>
        <p className="mt-2 text-ink-muted">
          Hate clicking checkboxes? Use the camera button at the top of the
          pantry panel to jump to the{' '}
          <Link href="/pantry-match" className="font-bold text-terracotta-600 hover:underline">
            Pantry Photo Scan
          </Link>
          . Open your fridge, take a photo, and the Gemini Vision model lists
          everything it sees. Tick the matches into the calculator. Five seconds
          of photo, twenty checkboxes filled.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-2xl">Use cases that justify keeping the pantry live</h2>
        <ul className="mt-3 space-y-3 text-ink-muted">
          <li>
            <strong className="text-ink">Tonight&apos;s dinner.</strong> Flip on
            strict mode (100% match) and the matcher only shows recipes you can
            cook without leaving the house.
          </li>
          <li>
            <strong className="text-ink">Tomorrow&apos;s shop.</strong> The
            most-frequent missing ingredients across the recipes you want to
            cook this week become your shopping list. Cross-check with the{' '}
            <Link href="/calculators/recipe-cost" className="font-bold text-terracotta-600 hover:underline">
              Recipe Cost Calculator
            </Link>{' '}
            to budget the shop.
          </li>
          <li>
            <strong className="text-ink">Use-it-up week.</strong> Refresh the
            pantry when you actually inventory the fridge. Hidden gems
            (half-jar of harissa, frozen shrimp, three forgotten lemons) often
            unlock recipes you would never have thought of from a cookbook
            browse.
          </li>
          <li>
            <strong className="text-ink">Travel + holiday cooking.</strong>{' '}
            Renting a poorly-stocked Airbnb? Spend two minutes scanning the
            cupboard, get a shortlist of practical meals you can actually pull
            off in a stranger&apos;s kitchen.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">Food waste — the real value here</h2>
        <p className="mt-2 text-ink-muted">
          UK households throw away about £730 of edible food per year. Most of
          that loss happens because nobody plans a meal around the half-bag of
          spinach quietly wilting in the crisper. A pantry-first cooking
          discipline reverses the question: instead of &quot;what shall we
          have?&quot; you ask &quot;what do we have, and what can we make from
          it?&quot;
        </p>
        <p className="mt-3 text-ink-muted">
          The matcher is built to make that question fast to answer. Five
          seconds of toggling, twenty matched recipes, three things saved from
          the bin.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-forest-50 p-6 ring-1 ring-forest-200">
        <h2 className="font-serif text-2xl text-forest-700">Privacy</h2>
        <p className="mt-3 text-sm text-ink-muted">
          Your pantry is stored in your browser&apos;s local storage. Nothing
          is uploaded. Clear your browser data and the inventory resets.
          Optional Supabase sync for logged-in users is on the roadmap so you
          can carry your pantry across devices.
        </p>
      </section>
    </div>
  );
}
