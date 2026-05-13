'use client';

import { useEffect, useState } from 'react';

/**
 * One-shot splash loader. Shows the RecipeCrave wordmark + tagline for
 * up to ~900ms on first visit, then fades out. Re-visits within the
 * same session skip it entirely (sessionStorage flag).
 *
 * Pure CSS animation — no animation libraries, ~1KB component, zero
 * impact on LCP because the splash overlays the underlying page (which
 * paints in parallel underneath). When the splash fades, the page is
 * already there.
 */
const SESSION_KEY = 'rc:splash-seen';

export function SplashLoader() {
  const [phase, setPhase] = useState<'hidden' | 'showing' | 'fading'>('hidden');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip on intra-session navigations and on prefers-reduced-motion.
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      return;
    }
    setPhase('showing');
    const fadeAt = window.setTimeout(() => setPhase('fading'), 700);
    const hideAt = window.setTimeout(() => {
      setPhase('hidden');
      window.sessionStorage.setItem(SESSION_KEY, '1');
    }, 1100);
    return () => {
      window.clearTimeout(fadeAt);
      window.clearTimeout(hideAt);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-cream-50 transition-opacity duration-300 ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="rc-splash-mark font-serif text-5xl font-bold sm:text-6xl">
          <span className="text-ink">Recipe</span>
          <span className="text-terracotta-500">Crave</span>
        </span>
        <span className="rc-splash-tag text-xs font-bold uppercase tracking-[0.3em] text-ink-muted">
          Cook what you crave
        </span>
      </div>
      <style>{`
        @keyframes rc-splash-mark-in {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes rc-splash-tag-in {
          from { letter-spacing: 0.1em; opacity: 0; }
          to   { letter-spacing: 0.3em; opacity: 1; }
        }
        .rc-splash-mark { animation: rc-splash-mark-in 420ms cubic-bezier(.2,.7,.2,1) both; }
        .rc-splash-tag  { animation: rc-splash-tag-in 520ms 120ms cubic-bezier(.2,.7,.2,1) both; }
      `}</style>
    </div>
  );
}
