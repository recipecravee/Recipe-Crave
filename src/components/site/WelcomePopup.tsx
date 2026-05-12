'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, Calculator, ChefHat, Leaf, Bookmark } from 'lucide-react';

const STORAGE_KEY = 'rc:welcome-seen';

/**
 * First-visit welcome popup.
 *
 * Pattern lifted from Food Network's regional welcome modal but rewritten
 * value-first instead of brand-first. Shows once per browser; localStorage
 * key persists across sessions. Suppresses automatically after dismiss.
 *
 * Auto-shows after 1500ms delay so the hero loads first — never blocks
 * the initial paint or LCP measurement.
 *
 * Print-hidden + scroll-locks the body when open.
 */
export function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Body-scroll lock + Escape close while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* swallow */
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="animate-fade-in fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close welcome popup"
          className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-ink-subtle hover:bg-cream-100 hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero band */}
        <div className="bg-gradient-to-br from-terracotta-400 via-terracotta-500 to-forest-600 px-6 py-8 text-center text-white sm:px-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" aria-hidden /> Free forever · no paywall
          </div>
          <h2 id="welcome-title" className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
            Welcome to <span className="text-cream-100">RecipeCrave</span>
          </h2>
          <p className="mt-2 text-sm text-white/90 sm:text-base">
            The AI cooking coach that turns what you have into what you crave.
          </p>
        </div>

        {/* Value props */}
        <div className="px-6 py-6 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-subtle">
            What you get — no signup required
          </p>
          <ul className="mt-3 space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <ChefHat className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
              <span><strong className="text-ink">200+ recipes</strong> with per-serving cost, calories, and substitution notes</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
              <span><strong className="text-ink">10 free calculators</strong> — recipe scaler, cost, calories, seasoning, pantry matcher &amp; more</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
              <span><strong className="text-ink">Therapeutic herbs</strong> — 32 herbs cross-referenced with the health conditions they support</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Bookmark className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
              <span><strong className="text-ink">Save without login</strong> — bookmark recipes locally, sync optional later</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/recipes"
              onClick={dismiss}
              className="flex-1 rounded-full bg-terracotta-500 px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 focus-ring"
            >
              Browse recipes
            </Link>
            <Link
              href="/meal-planner"
              onClick={dismiss}
              className="flex-1 rounded-full border-2 border-forest-300 bg-white px-5 py-3 text-center text-sm font-bold text-forest-700 transition-colors hover:border-forest-500 focus-ring"
            >
              Try AI meal planner
            </Link>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="mt-4 w-full text-center text-xs text-ink-subtle hover:text-ink"
          >
            No thanks — just let me look around
          </button>
        </div>
      </div>
    </div>
  );
}
