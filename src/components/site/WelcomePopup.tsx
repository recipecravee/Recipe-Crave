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
// A/B test variants. Assigned per-visitor via random 50/50 split, then
// pinned in localStorage so the same user always sees the same variant
// (otherwise conversion-rate comparison is corrupted).
//
// Variant A: original value-prop ("Free forever. no paywall") — feature-led
// Variant B: health-led ("Cook your way to better health") — outcome-led
//
// The conversion event we'd measure is: did the user click either CTA
// vs. dismiss? Tracked via localStorage rc:welcome-variant + rc:welcome-outcome
// so future analytics can compare without re-instrumentation.
type Variant = 'A' | 'B';

function pickVariant(): Variant {
  if (typeof window === 'undefined') return 'A';
  const saved = window.localStorage.getItem('rc:welcome-variant');
  if (saved === 'A' || saved === 'B') return saved;
  const v: Variant = Math.random() < 0.5 ? 'A' : 'B';
  try {
    window.localStorage.setItem('rc:welcome-variant', v);
  } catch {
    /* ignore */
  }
  return v;
}

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>('A');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    setVariant(pickVariant());
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

  function dismiss(outcome: 'cta' | 'dismiss' = 'dismiss') {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      window.localStorage.setItem('rc:welcome-outcome', `${variant}:${outcome}`);
    } catch {
      /* swallow */
    }
  }

  if (!open) return null;

  // Per-variant copy. Variant A = feature-led (control). Variant B = outcome-led
  // (health-first). Keep structural parity so layout/CSS doesn't shift between
  // arms — only swap text/icon labels.
  const copy =
    variant === 'B'
      ? {
          badge: 'Free forever · food as medicine',
          title: 'Cook your way to',
          titleAccent: 'better health',
          sub: 'Use food and herbs to feel better — calmer sleep, steadier energy, easier digestion.',
          listLabel: 'What changes in 30 days',
          bullets: [
            { Icon: Leaf, text: <><strong className="text-ink">Eat to reduce inflammation</strong> — recipes tagged for joint pain, gut health, and energy</> },
            { Icon: ChefHat, text: <><strong className="text-ink">Stabilize blood sugar</strong> — diabetic-friendly meals with carbs, fiber, and glycemic load shown</> },
            { Icon: Calculator, text: <><strong className="text-ink">Sleep better with herbs</strong> — 32 evidence-cited herbs paired to the conditions they support</> },
            { Icon: Bookmark, text: <><strong className="text-ink">Free condition meal plans</strong> — 30-day anti-inflammatory, diabetic, gut-reset, sleep</> },
          ],
          primary: { href: '/herbal-cooking', label: 'Start with herbs' },
          secondary: { href: '/meal-plans', label: 'See 30-day plans' },
        }
      : {
          badge: 'Free forever · no paywall',
          title: 'Welcome to',
          titleAccent: 'RecipeCrave',
          sub: 'The AI cooking coach that turns what you have into what you crave.',
          listLabel: 'What you get — no signup required',
          bullets: [
            { Icon: ChefHat, text: <><strong className="text-ink">200+ recipes</strong> with per-serving cost, calories, and substitution notes</> },
            { Icon: Calculator, text: <><strong className="text-ink">10 free calculators</strong> — recipe scaler, cost, calories, seasoning, pantry matcher &amp; more</> },
            { Icon: Leaf, text: <><strong className="text-ink">Therapeutic herbs</strong> — 32 herbs cross-referenced with the health conditions they support</> },
            { Icon: Bookmark, text: <><strong className="text-ink">Save without login</strong> — bookmark recipes locally, sync optional later</> },
          ],
          primary: { href: '/recipes', label: 'Browse recipes' },
          secondary: { href: '/meal-planner', label: 'Try AI meal planner' },
        };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="animate-fade-in fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm print:hidden"
      data-welcome-variant={variant}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss('dismiss');
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => dismiss('dismiss')}
          aria-label="Close welcome popup"
          className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-ink-subtle hover:bg-cream-100 hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero band */}
        <div className="bg-gradient-to-br from-terracotta-400 via-terracotta-500 to-forest-600 px-6 py-8 text-center text-white sm:px-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" aria-hidden /> {copy.badge}
          </div>
          <h2 id="welcome-title" className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
            {copy.title} <span className="text-cream-100">{copy.titleAccent}</span>
          </h2>
          <p className="mt-2 text-sm text-white/90 sm:text-base">
            {copy.sub}
          </p>
        </div>

        {/* Value props */}
        <div className="px-6 py-6 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-subtle">
            {copy.listLabel}
          </p>
          <ul className="mt-3 space-y-2.5 text-sm">
            {copy.bullets.map(({ Icon, text }, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href={copy.primary.href}
              onClick={() => dismiss('cta')}
              className="flex-1 rounded-full bg-terracotta-500 px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 focus-ring"
            >
              {copy.primary.label}
            </Link>
            <Link
              href={copy.secondary.href}
              onClick={() => dismiss('cta')}
              className="flex-1 rounded-full border-2 border-forest-300 bg-white px-5 py-3 text-center text-sm font-bold text-forest-700 transition-colors hover:border-forest-500 focus-ring"
            >
              {copy.secondary.label}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => dismiss('dismiss')}
            className="mt-4 w-full text-center text-xs text-ink-subtle hover:text-ink"
          >
            No thanks — just let me look around
          </button>
        </div>
      </div>
    </div>
  );
}
