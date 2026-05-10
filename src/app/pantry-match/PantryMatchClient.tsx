'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import type { RecipeSummary } from '@/types/recipe';

export function PantryMatchClient() {
  const [ingredients, setIngredients] = useState('');
  const [matches, setMatches] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pantry-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean),
        }),
      });
      const data = (await res.json()) as { ok: boolean; recipes?: RecipeSummary[]; error?: string };
      if (data.ok && data.recipes) {
        setMatches(data.recipes);
      } else {
        setError(data.error ?? 'Could not match. Try again.');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSearch} className="rounded-2xl bg-white p-6 shadow-sm">
        <label htmlFor="pantry-input" className="text-sm font-medium">
          List ingredients you have (comma-separated)
        </label>
        <Input
          id="pantry-input"
          placeholder="chicken, rice, garlic, soy sauce, broccoli"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="mt-1"
        />
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? 'Finding matches…' : 'Find recipes'}
        </Button>
        {error ? <p role="alert" className="mt-3 text-sm text-danger">{error}</p> : null}
      </form>

      {matches.length > 0 ? (
        <section>
          <h2 className="mb-6 font-serif text-2xl">
            {matches.length} match{matches.length === 1 ? '' : 'es'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {matches.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
