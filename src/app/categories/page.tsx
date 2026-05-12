import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CUISINES, DIETS } from '@/lib/constants';
import { MENU_CATEGORIES, filterByCategory } from '@/content/menu-categories';
import { getAllRecipes } from '@/lib/data/recipes';

export const metadata: Metadata = {
  title: 'All Recipe Categories — Snacks, Pasta, Rice, Soups, Drinks & More',
  description:
    'Browse RecipeCrave by category — 14 menu sections: snacks, small chops, pasta, rice, breakfast, soups, stews, desserts, grills, sides, porridges, drinks, iced treats, cocktails & mocktails. Plus by cuisine and diet.',
  alternates: { canonical: '/categories' },
};

export default async function CategoriesPage() {
  const all = await getAllRecipes();
  // Pre-compute counts per category so tiles show how many recipes you'll find.
  const counts = MENU_CATEGORIES.map((c) => ({
    cat: c,
    count: filterByCategory(all, c).length,
  }));

  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-12 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">Browse</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink sm:text-5xl lg:text-6xl">
          All Categories
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          14 menu sections covering everything from snacks and small chops to cocktails and mocktails. Plus cuisine and diet filters below. Every recipe ships with calories, costs, plating tips, common mistakes to avoid, and ingredient substitutions.
        </p>
      </header>

      {/* 14 menu category tiles — primary nav */}
      <section className="mb-16">
        <h2 className="mb-6 font-serif text-2xl font-bold text-ink sm:text-3xl">By menu section</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {counts.map(({ cat, count }) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group block overflow-hidden rounded-2xl border-2 border-ink/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-terracotta-300 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 280px, (min-width: 768px) 340px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-xl shadow-sm backdrop-blur">
                  {cat.emoji}
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-terracotta-600 shadow-sm backdrop-blur">
                  {count} {count === 1 ? 'recipe' : 'recipes'}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-serif text-2xl font-bold text-white">{cat.name}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">
                  {cat.blurb}
                </p>
                <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-terracotta-600 group-hover:gap-2">
                  Browse {cat.name} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cuisine + diet rows (kept from original landing) */}
      <section className="mb-12">
        <h2 className="mb-5 font-serif text-2xl font-bold text-ink">By cuisine</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CUISINES.map((c) => (
            <Link
              key={c.slug}
              href={`/cuisine/${c.slug}`}
              className="group flex items-center gap-3 rounded-xl border-2 border-ink/5 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-300 hover:shadow-md focus-ring"
            >
              <span className="text-2xl" aria-hidden>{c.emoji}</span>
              <span className="font-bold text-ink group-hover:text-terracotta-500">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 font-serif text-2xl font-bold text-ink">By diet</h2>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <Link
              key={d.slug}
              href={`/diet/${d.slug}`}
              className="rounded-full border-2 border-forest-200 bg-white px-5 py-2 text-sm font-bold text-forest-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-forest-400 hover:bg-forest-50"
            >
              {d.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
