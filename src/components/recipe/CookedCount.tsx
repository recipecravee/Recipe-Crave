'use client';

import { useEffect, useState } from 'react';
import { ChefHat, Check } from 'lucide-react';

/**
 * "I cooked this" check-in button + local counter.
 *
 * Strategy doc: "Recipe ratings and reviews with verified purchase badges.
 * Users who made the recipe leave reviews. This builds trust signals."
 *
 * Phase 1 (this component): localStorage per-user check-in. Each user who
 * clicks "I cooked this" increments their personal cooked counter for the
 * recipe AND a global "you've cooked X recipes" total on dashboard.
 *
 * Phase 2 (future): Supabase row per check-in feeds a cross-user
 * verified-cook count displayed on the recipe header.
 */
export function CookedCount({ slug }: { slug: string }) {
  const [cooked, setCooked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = window.localStorage.getItem(`rc:cooked:${slug}`);
      setCooked(raw === '1');
    } catch {
      /* ignore */
    }
  }, [slug]);

  function markCooked() {
    try {
      window.localStorage.setItem(`rc:cooked:${slug}`, '1');
      // Update the user's total-cooked counter for dashboard
      const totalRaw = window.localStorage.getItem('rc:cooked-total');
      const total = totalRaw ? parseInt(totalRaw, 10) : 0;
      if (!cooked) {
        window.localStorage.setItem('rc:cooked-total', String(total + 1));
      }
      // Also record today's date for streak
      const today = new Date().toISOString().slice(0, 10);
      const datesRaw = window.localStorage.getItem('rc:recent-dates');
      const arr = datesRaw ? (JSON.parse(datesRaw) as string[]) : [];
      if (!arr.includes(today)) {
        const next = [today, ...arr].slice(0, 30);
        window.localStorage.setItem('rc:recent-dates', JSON.stringify(next));
      }
    } catch {
      /* ignore */
    }
    setCooked(true);
  }

  if (!hydrated) return null;

  return (
    <button
      type="button"
      onClick={markCooked}
      disabled={cooked}
      aria-pressed={cooked}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm transition-colors focus-ring print:hidden ${
        cooked
          ? 'cursor-default bg-forest-100 text-forest-700'
          : 'border border-ink/10 bg-white text-ink-muted hover:border-forest-400 hover:text-forest-700'
      }`}
    >
      {cooked ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden /> Cooked
        </>
      ) : (
        <>
          <ChefHat className="h-3.5 w-3.5" aria-hidden /> I cooked this
        </>
      )}
    </button>
  );
}
