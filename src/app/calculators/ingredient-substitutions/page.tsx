import type { Metadata } from 'next';
import Link from 'next/link';
import { IngredientSubstitutions } from './IngredientSubstitutions';

export const metadata: Metadata = {
  title: 'Ingredient Substitution Matcher — Free Cooking Swap Database',
  description:
    'Out of buttermilk, eggs, soy sauce, or butter? Free searchable database of ingredient substitutions with exact ratios, allergen flags, and use-case filters. 60+ ingredients with multiple ranked swaps each.',
  alternates: { canonical: '/calculators/ingredient-substitutions' },
  keywords: [
    'ingredient substitutions',
    'cooking substitutions',
    'buttermilk substitute',
    'egg substitute baking',
    'butter substitute',
    'soy sauce substitute',
    'flour substitute',
    'dairy free substitute',
    'gluten free substitute',
    'vegan substitute',
  ],
};

export default function IngredientSubstitutionsPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Substitution matcher
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
          Ingredient Substitution Matcher
        </h1>
        <p className="mt-3 text-lg text-ink-muted">
          You&apos;re mid-recipe and missing one thing. Search the ingredient. Get ranked
          swaps with exact ratios, flavor-impact notes, and allergen flags. Toggle dairy-free,
          gluten-free, vegan, or use-case filters (baking, frying, sauces) to narrow results.
        </p>
      </div>

      <IngredientSubstitutions />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">How substitution quality works</h2>
        <p className="mt-3 text-ink-muted">
          Each swap is tagged <strong className="text-forest-700">Best match</strong>,{' '}
          <strong className="text-amber-700">Good</strong>, or{' '}
          <strong className="text-ink">Acceptable</strong>.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li>
            <strong className="text-forest-700">Best match</strong> — works in nearly any recipe
            without changing the outcome. Same chemistry, same texture, same flavor.
          </li>
          <li>
            <strong className="text-amber-700">Good</strong> — works in most recipes with minor
            adjustments. Slight texture or flavor shift, but the dish still succeeds.
          </li>
          <li>
            <strong className="text-ink">Acceptable</strong> — only when you have no better
            option. Expect a noticeable change. Read the notes before committing.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">Tips for swapping ingredients</h2>
        <ul className="space-y-3 text-ink-muted">
          <li>
            <strong className="text-ink">Baking is least forgiving.</strong> Ratios matter — flour,
            fat, sugar, and leavening interact chemically. Use a Best-match swap when baking.
          </li>
          <li>
            <strong className="text-ink">Cooking forgives more.</strong> Stir-fries, stews, and
            sauces accept Good swaps with no real penalty.
          </li>
          <li>
            <strong className="text-ink">Read the ratio carefully.</strong> 1:1 is rare — many subs
            change quantity (3 tbsp aquafaba per egg white, 3/4 cup honey per cup of sugar, etc.).
          </li>
          <li>
            <strong className="text-ink">Watch the flavor-impact pill.</strong> A subtle change is
            invisible. A noticeable change you&apos;ll taste. A major change shifts the dish
            character — sometimes for the better.
          </li>
          <li>
            <strong className="text-ink">Allergen flags mean &quot;contains.&quot;</strong> If you
            need dairy-free, toggle that filter and hidden subs disappear. If a remaining sub
            still shows a dairy flag (rare — likely a parmesan alt that uses cheese), skip it.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-forest-50 p-6 ring-1 ring-forest-200">
        <h2 className="font-serif text-2xl text-forest-700">Sources</h2>
        <p className="mt-3 text-sm text-ink-muted">
          Ratios cross-referenced from King Arthur Baking, Serious Eats, America&apos;s Test
          Kitchen, and USDA technical references. Vegan/allergen swaps reviewed against current
          plant-based baking literature. When package directions on your specific brand differ,
          follow the package.
        </p>
      </section>
    </div>
  );
}
