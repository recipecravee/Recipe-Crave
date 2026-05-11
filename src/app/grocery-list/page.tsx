import type { Metadata } from 'next';
import { GroceryListClient } from './GroceryListClient';

export const metadata: Metadata = {
  title: 'Smart Grocery List Builder',
  description:
    'Pick recipes. We combine the ingredients, dedupe duplicates, group by aisle, and give you one clean list to take to the store.',
  alternates: { canonical: '/grocery-list' },
};

export default function GroceryListPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">Smart Grocery List</h1>
        <p className="mt-3 text-ink-muted">
          Pick three recipes for the week. We combine the ingredients, dedupe the duplicates, group
          everything by aisle, and give you one list to take to the store. Print it, share it, or
          check items off on your phone.
        </p>
      </header>
      <GroceryListClient />
    </div>
  );
}
