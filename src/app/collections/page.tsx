import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">Browse</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink sm:text-5xl lg:text-6xl">Recipe Collections</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">
          Hand-picked lists for every kind of week. Each collection includes calorie counts, costs, and step-by-step instructions on every recipe.
        </p>
      </header>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => {
          const thumbs = c.recipes.slice(0, 4);
          return (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group block overflow-hidden rounded-2xl border-2 border-ink/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-terracotta-300 hover:shadow-lg focus-ring"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
                {thumbs.length >= 4 ? (
                  <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
                    {thumbs.map((r) =>
                      r.heroImage ? (
                        <div key={r.slug} className="relative h-full w-full overflow-hidden">
                          <Image
                            src={r.heroImage}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 200px, (min-width: 768px) 250px, 400px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div key={r.slug} className="h-full w-full bg-cream-200" aria-hidden />
                      )
                    )}
                  </div>
                ) : thumbs[0]?.heroImage ? (
                  <Image
                    src={thumbs[0].heroImage}
                    alt={thumbs[0].title}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 500px, 800px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-forest-100 via-cream-200 to-terracotta-100" aria-hidden />
                )}
                <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest-600 shadow-sm backdrop-blur">
                  {c.recipes.length} recipes
                </div>
              </div>
              <div className="space-y-2 p-5">
                <h2 className="font-serif text-2xl font-bold text-ink group-hover:text-terracotta-500">{c.title}</h2>
                <p className="text-sm leading-relaxed text-ink-muted">{c.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
