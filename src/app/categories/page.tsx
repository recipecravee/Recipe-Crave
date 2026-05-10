import type { Metadata } from 'next';
import Link from 'next/link';
import { CUISINES, COURSES_NAV, DIETS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'All Recipe Categories — Explore by Cuisine, Course, and Diet',
  description:
    'Browse RecipeCrave by cuisine (Nigerian, Jamaican, Italian, Indian, Thai), course (dinners, soups, pastries, smoothies, drinks), or diet (vegan, gluten-free, keto, halal).',
  alternates: { canonical: '/categories' },
};

export default function CategoriesPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">All Categories</h1>
        <p className="mt-3 text-ink-muted">
          The full directory — explore RecipeCrave by cuisine, course, or dietary need. Every page has its own collection of tested recipes with nutrition and cost.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-6 font-serif text-2xl">By cuisine</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CUISINES.map((c) => (
            <Link
              key={c.slug}
              href={`/cuisine/${c.slug}`}
              className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md focus-ring"
            >
              <span className="text-2xl" aria-hidden>{c.emoji}</span>
              <span className="font-medium text-ink group-hover:text-terracotta-500">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 font-serif text-2xl">By course</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COURSES_NAV.map((c) => (
            <Link
              key={c.slug}
              href={`/recipes?course=${c.slug}`}
              className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md focus-ring"
            >
              <span className="text-2xl" aria-hidden>{c.emoji}</span>
              <span className="font-medium text-ink group-hover:text-terracotta-500">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-serif text-2xl">By diet</h2>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <Link
              key={d.slug}
              href={`/diet/${d.slug}`}
              className="rounded-full border border-ink/10 bg-white px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-terracotta-400 hover:text-terracotta-500 focus-ring"
            >
              {d.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
