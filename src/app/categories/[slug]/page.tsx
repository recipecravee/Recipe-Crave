import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getAllRecipes } from '@/lib/data/recipes';
import { MENU_CATEGORIES, filterByCategory, findCategory } from '@/content/menu-categories';

export async function generateStaticParams() {
  return MENU_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) return { title: 'Category not found' };
  return {
    title: `${cat.name} Recipes — Free, Tested, with Cost + Calories`,
    description: cat.blurb,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: `${cat.name} Recipes`,
      description: cat.blurb,
      type: 'website',
      images: cat.image ? [{ url: cat.image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.name} Recipes`,
      description: cat.blurb,
      images: cat.image ? [cat.image] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) notFound();

  const all = await getAllRecipes();
  const recipes = filterByCategory(all, cat).sort((a, b) => a.title.localeCompare(b.title));

  // Related categories: same course, different slug
  const related = MENU_CATEGORIES.filter((c) => c.slug !== cat.slug && c.course === cat.course).slice(0, 4);

  return (
    <div className="container py-10 lg:py-14">
      <Link
        href="/categories"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-terracotta-500 hover:text-terracotta-600"
      >
        <ArrowLeft className="h-4 w-4" />
        All categories
      </Link>

      <header className="mb-10 grid gap-8 lg:grid-cols-[2fr,1fr] lg:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-terracotta-500">
            <span aria-hidden className="text-2xl">{cat.emoji}</span>
            Category
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-ink sm:text-5xl lg:text-6xl">
            {cat.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">{cat.blurb}</p>
          <p className="mt-3 text-sm text-ink-muted">
            {recipes.length} recipe{recipes.length === 1 ? '' : 's'} in this category.
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cream-200 shadow-md">
          {cat.image ? (
            <Image
              src={cat.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover"
              priority
            />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
            <p className="font-serif text-xl font-bold text-white">{cat.name}</p>
          </div>
        </div>
      </header>

      {recipes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r, i) => (
            <RecipeCard key={r.slug} recipe={r} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="font-serif text-2xl text-ink">No recipes yet in {cat.name}.</p>
          <p className="mt-2 text-ink-muted">Check back soon, or browse another category.</p>
          <Link
            href="/categories"
            className="mt-6 inline-block rounded-full bg-terracotta-400 px-5 py-2 text-sm font-bold text-white hover:bg-terracotta-500"
          >
            Browse all categories
          </Link>
        </div>
      )}

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-5 font-serif text-2xl font-bold text-ink">More {cat.course === 'drink' ? 'drinks' : cat.course === 'dessert' ? 'desserts' : 'similar'} categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group flex items-center gap-3 rounded-2xl border-2 border-ink/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-300 hover:shadow-md"
              >
                <span className="text-2xl" aria-hidden>{c.emoji}</span>
                <span className="font-serif text-base font-bold text-ink group-hover:text-terracotta-500">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
