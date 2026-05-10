import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Cooking Calculators & Converters',
  description:
    'Free cooking calculators: cups to grams, recipe cost estimator, calorie calculator, servings scaler, and more.',
  alternates: { canonical: '/calculators' },
};

const TOOLS = [
  { slug: 'unit-converter', title: 'Cups → Grams Converter', body: 'Convert between US, metric, and UK measurements instantly.' },
  { slug: 'recipe-cost', title: 'Recipe Cost Calculator', body: 'Estimate the cost per serving for any recipe.' },
  { slug: 'calorie-estimator', title: 'Calorie Estimator', body: 'Get approximate calorie counts from your ingredient list.' },
  { slug: 'servings-scaler', title: 'Servings Scaler', body: 'Scale any recipe up or down with adjusted cook times.' },
];

export default function CalculatorsIndex() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">Free Cooking Calculators</h1>
        <p className="mt-3 text-ink-muted">
          Practical tools for the kitchen. No signup, no paywall — just useful math.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.slug}
            href={`/calculators/${t.slug}`}
            className="block rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-ring"
          >
            <p className="text-xs uppercase tracking-wider text-terracotta-500">Coming soon</p>
            <h2 className="mt-1 font-serif text-xl">{t.title}</h2>
            <p className="mt-2 text-sm text-ink-muted">{t.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
