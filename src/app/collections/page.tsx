import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCollections } from '@/lib/data/recipes';

export const metadata: Metadata = {
  title: 'Recipe Collections — Hand-Picked for Every Occasion',
  description: 'Browse curated recipe collections: 20-minute dinners, vegan weeknights, comfort food classics, and more.',
  alternates: { canonical: '/collections' },
};

export default async function CollectionsPage() {
  const collections = await getAllCollections();
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">Recipe Collections</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Hand-picked lists for every kind of week. Each collection includes calorie counts, costs, and step-by-step instructions on every recipe.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-ring"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-forest-100 via-cream-200 to-terracotta-100" aria-hidden />
            <div className="space-y-2 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-forest-500">{c.recipes.length} recipes</p>
              <h2 className="font-serif text-xl text-ink group-hover:text-terracotta-500">{c.title}</h2>
              <p className="text-sm text-ink-muted">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
