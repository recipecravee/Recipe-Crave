import type { Metadata } from 'next';
import { PantryMatchClient } from './PantryMatchClient';

export const metadata: Metadata = {
  title: "What's In My Fridge? — Free Recipe Finder by Ingredient",
  description:
    'Type what you have in your fridge or pantry and get recipes you can cook tonight. Free AI ingredient match with full nutrition data and cost per serving.',
  alternates: { canonical: '/pantry-match' },
};

export default function PantryMatchPage() {
  return (
    <div className="container py-10 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 max-w-2xl">
          <h1 className="font-serif text-4xl text-ink sm:text-5xl">What&apos;s in my fridge?</h1>
          <p className="mt-3 text-ink-muted">
            Snap a photo or type what you have. We match it to recipes you can cook tonight. Free, no signup.
          </p>
        </header>
        <PantryMatchClient />
      </div>
    </div>
  );
}
