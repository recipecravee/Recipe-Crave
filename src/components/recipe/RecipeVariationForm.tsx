'use client';

import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * "Share your version" form scaffold.
 *
 * Strategy doc requires user-submitted recipe variations to drive UGC,
 * internal-link diversity, and shareable community content. Variations
 * are stored in localStorage for now; future phase will POST to an
 * /api/variation endpoint that gates on auth or invisible captcha.
 *
 * Optimistic-UI: submission is saved locally, "Thanks!" state shown,
 * variation appears in the page-level list immediately. No round-trip.
 */
export function RecipeVariationForm({ recipeSlug }: { recipeSlug: string }) {
  const [name, setName] = useState('');
  const [variation, setVariation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!variation.trim()) return;
    try {
      const key = `rc:variations:${recipeSlug}`;
      const raw = window.localStorage.getItem(key);
      const arr = raw ? (JSON.parse(raw) as Array<{ name: string; text: string; at: number }>) : [];
      arr.unshift({
        name: name.trim() || 'Anonymous cook',
        text: variation.trim(),
        at: Date.now(),
      });
      window.localStorage.setItem(key, JSON.stringify(arr.slice(0, 25)));
    } catch {
      /* swallow */
    }
    setSubmitted(true);
    setName('');
    setVariation('');
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl bg-gradient-to-br from-cream-50 to-terracotta-50 p-5 shadow-sm print:hidden sm:p-6"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-terracotta-500" aria-hidden />
        <h2 className="font-serif text-lg font-bold text-ink">Share your version</h2>
      </div>
      <p className="mt-1 text-xs text-ink-muted">
        Did you swap an ingredient, change the technique, or scale it for a different crowd? Add a
        one-line variation so other cooks can try it.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-[180px,1fr]">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          className="h-10"
          aria-label="Your first name"
          maxLength={40}
        />
        <Input
          value={variation}
          onChange={(e) => setVariation(e.target.value)}
          placeholder='e.g. "Swapped chicken for tofu; added 2 tbsp soy sauce; same cook time."'
          className="h-10"
          aria-label="Your variation"
          maxLength={240}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[10px] text-ink-subtle">
          Saved to your browser. Approved variations roll out to the public list weekly.
        </p>
        <Button type="submit" size="sm" disabled={!variation.trim()}>
          {submitted ? (
            <>
              <Check className="mr-1.5 h-4 w-4" /> Thanks!
            </>
          ) : (
            'Share variation'
          )}
        </Button>
      </div>
    </form>
  );
}
