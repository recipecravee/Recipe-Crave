import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getAllRecipes } from '@/lib/data/recipes';

export const metadata: Metadata = {
  title: 'All Recipes A to Z — Recipe Index',
  description:
    'Every recipe on RecipeCrave, sorted alphabetically. Browse 200+ dishes by first letter — snacks, pasta, rice, soups, stews, desserts, drinks, cocktails, and more.',
  alternates: { canonical: '/recipes/a-z' },
  keywords: [
    'all recipes',
    'recipe index',
    'recipe list',
    'alphabetical recipes',
    'recipes a to z',
    'cooking index',
    'food network style index',
    'recipecrave master index',
  ],
  openGraph: {
    title: 'All Recipes A to Z',
    description: 'Every dish on RecipeCrave indexed alphabetically.',
    type: 'website',
    images: [
      {
        url: `/api/og?eyebrow=Recipe%20Index&accent=terracotta&title=${encodeURIComponent('All Recipes A to Z')}&subtitle=${encodeURIComponent('Every dish on RecipeCrave indexed alphabetically.')}`,
        width: 1200,
        height: 630,
        alt: 'All Recipes A to Z',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Recipes A to Z',
    description: 'Every dish on RecipeCrave indexed alphabetically.',
    images: [
      `/api/og?eyebrow=Recipe%20Index&accent=terracotta&title=${encodeURIComponent('All Recipes A to Z')}&subtitle=${encodeURIComponent('Every dish on RecipeCrave indexed alphabetically.')}`,
    ],
  },
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default async function RecipesAtoZPage() {
  const recipes = await getAllRecipes();
  // Group by first letter (uppercase). Items with non-letter start go under '#'.
  const groups = new Map<string, typeof recipes>();
  for (const r of recipes) {
    const first = r.title.trim().charAt(0).toUpperCase();
    const key = /[A-Z]/.test(first) ? first : '#';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }
  for (const arr of groups.values()) {
    arr.sort((a, b) => a.title.localeCompare(b.title));
  }
  const totalCount = recipes.length;
  const presentLetters = LETTERS.filter((l) => groups.has(l));
  const hasHash = groups.has('#');

  return (
    <div className="container py-10 lg:py-14">
      <Link
        href="/recipes"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-terracotta-500 hover:text-terracotta-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Recipes
      </Link>

      <header className="mb-10 max-w-3xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-500">
          <BookOpen className="h-4 w-4" /> Recipe Index
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink sm:text-5xl lg:text-6xl">
          All Recipes <span className="text-terracotta-400">A to Z</span>
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          Every dish on RecipeCrave, sorted alphabetically. {totalCount.toLocaleString()} recipes across snacks, pasta, rice, soups, stews, breakfasts, desserts, drinks, cocktails, and beyond.
        </p>
      </header>

      {/* Sticky letter nav */}
      <nav
        aria-label="Jump to letter"
        className="sticky top-20 z-30 -mx-4 mb-8 overflow-x-auto bg-cream-100/95 px-4 py-3 shadow-sm backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border-2 sm:border-ink/5 sm:px-4"
      >
        <div className="flex flex-wrap gap-1.5">
          {LETTERS.map((l) => {
            const has = groups.has(l);
            return (
              <a
                key={l}
                href={has ? `#letter-${l}` : undefined}
                aria-disabled={!has}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  has
                    ? 'bg-terracotta-400 text-white shadow-sm hover:bg-terracotta-500'
                    : 'cursor-not-allowed bg-cream-200 text-ink-subtle/50'
                }`}
              >
                {l}
              </a>
            );
          })}
          {hasHash ? (
            <a
              href="#letter-hash"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-500 text-sm font-bold text-white shadow-sm hover:bg-forest-600"
              aria-label="Recipes starting with a number or symbol"
            >
              #
            </a>
          ) : null}
        </div>
      </nav>

      {/* Letter sections */}
      <div className="space-y-12">
        {[...presentLetters, ...(hasHash ? ['#'] : [])].map((letter) => {
          const list = groups.get(letter)!;
          const anchor = letter === '#' ? 'letter-hash' : `letter-${letter}`;
          return (
            <section key={letter} id={anchor} className="scroll-mt-32">
              <div className="mb-5 flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-400 to-terracotta-500 font-serif text-3xl font-bold text-white shadow-md">
                  {letter}
                </span>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
                    Letter {letter}
                  </h2>
                  <p className="text-sm text-ink-muted">
                    {list.length} recipe{list.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/recipes/${r.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border-2 border-ink/5 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-300 hover:shadow-md"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                        {r.heroImage ? (
                          <Image
                            src={r.heroImage}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-base font-bold text-ink group-hover:text-terracotta-500">
                          {r.title}
                        </p>
                        <p className="truncate text-xs text-ink-muted">
                          {r.cuisine} · {r.course}
                          {r.totalTimeMin ? ` · ${r.totalTimeMin} min` : ''}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
