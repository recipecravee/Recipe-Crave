import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Free Cooking Calculators & Converters',
  description:
    'Free cooking calculators: cups to grams, recipe cost estimator, calorie calculator, servings scaler, and more.',
  alternates: { canonical: '/calculators' },
};

type Tool = {
  slug: string;
  title: string;
  body: string;
  featured?: boolean;
  live?: boolean;
};

const TOOLS: Tool[] = [
  { slug: 'unit-converter', title: 'Cups → Grams Converter', body: 'Convert any cooking ingredient between US, metric, and UK measurements. 60+ ingredients with density-accurate ratios.', live: true },
  { slug: 'recipe-cost', title: 'Recipe Cost Calculator', body: 'Pack-price or per-unit pricing, automatic cost-per-serving, pantry-staple exclusion, ranked ingredient-share bar chart, multi-currency, save/load.', live: true },
  { slug: 'calorie-estimator', title: 'Calorie Estimator', body: 'USDA-derived 150+ food database. Density-aware unit conversion. Calories + macros per serving and total. Manual override for unmatched ingredients.', live: true },
  { slug: 'temperature-adjuster', title: 'Temperature Adjuster', body: 'Convert oven temps across °F, °C, gas marks, and air fryer equivalents. Adjusts for fan-forced vs conventional too.', featured: true, live: true },
  { slug: 'storage-life-guide', title: 'Storage Life Guide', body: 'Searchable database. "How long is opened mayo safe?" "Do eggs go bad?" Simple lookup, saves decisions.', live: true },
  { slug: 'ingredient-substitutions', title: 'Ingredient Substitution Matcher', body: 'Searchable swaps. Buttermilk to yogurt, Greek yogurt to sour cream. 1:1 conversions with ratios where they differ. Allergen + use-case filters.', live: true },
  { slug: 'baking-ratio', title: 'Baking Ratio Calculator', body: 'Baker\'s percentages. Input flour weight, get exact grams for water, salt, yeast. Consistency across recipes.', live: true },
  { slug: 'seasoning-by-weight', title: 'Seasoning by Weight Calculator', body: 'Replace "salt to taste" with exact gram amounts. 20 dish-type presets, intensity slider, salt-density-aware tsp conversion, two-stage dosing.', live: true },
  { slug: 'realtime-recipe-scaler', title: 'Real-time Recipe Scaler', body: 'Load any recipe, drag a servings slider. Ingredients, total cost, and cost per serving update instantly. Saves locally.', featured: true, live: true },
  { slug: 'pantry-inventory-matcher', title: 'Pantry Inventory + Recipe Matcher', body: 'Tick what you have. Get a ranked list of recipes you can make right now from 200+ in the catalog. Photo-scan integration + custom items + strict-mode 100% match.', live: true },
];

export default function CalculatorsIndex() {
  return (
    <div className="container py-10 lg:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Free Cooking Calculators', url: '/calculators' },
        ])}
      />
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">Free Cooking Calculators</h1>
        <p className="mt-3 text-ink-muted">
          Practical tools for the kitchen. No signup, no paywall — just useful math.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link
            key={t.slug}
            href={`/calculators/${t.slug}`}
            className={`block rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-ring ${
              t.featured ? 'ring-2 ring-terracotta-200' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  t.live ? 'text-forest-600' : 'text-terracotta-500'
                }`}
              >
                {t.live ? 'Live now' : 'Coming soon'}
              </p>
              {t.featured ? (
                <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700">
                  Most valuable
                </span>
              ) : null}
            </div>
            <h2 className="mt-2 font-serif text-xl">{t.title}</h2>
            <p className="mt-2 text-sm text-ink-muted">{t.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
