import type { Metadata } from 'next';
import { SavedRecipes } from './SavedRecipes';
import { getAllRecipes } from '@/lib/data/recipes';

export const metadata: Metadata = {
  title: 'Your Saved Recipes',
  description:
    'Recipes you have bookmarked on RecipeCrave. Saved locally to your device — no account needed. Print, share, or jump straight to cooking.',
  alternates: { canonical: '/saved' },
  // No-index for personal/private listing pages
  robots: { index: false, follow: false },
};

export default async function SavedPage() {
  // Pass the full catalog client-side so we can hydrate the saved list
  // entirely from localStorage on the client without an extra fetch.
  const recipes = await getAllRecipes();
  // Project to lightweight shape so we don't ship instruction text to the
  // browser bundle just to render a card.
  const lite = recipes.map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    heroImage: r.heroImage,
    totalTimeMin: r.totalTimeMin,
    servings: r.servings,
    cuisine: r.cuisine,
    course: r.course,
  }));

  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">Your saved recipes</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Recipes you bookmark on RecipeCrave live here — saved locally to this
          browser. No account needed. Clear your browser data and the list resets.
        </p>
      </header>
      <SavedRecipes catalog={lite} />
    </div>
  );
}
