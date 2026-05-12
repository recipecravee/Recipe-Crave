'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

/**
 * GDPR-baseline cookie consent banner.
 *
 * RecipeCrave's choice: keep it lightweight. We collect minimal cookies
 * (next-auth session if logged in; localStorage for save/streak/profile).
 * No third-party analytics by default. If AdSense ever activates, this
 * banner will also gate ad personalization.
 *
 * Behavior:
 *   - Hidden by default until first paint (avoid SSR flash).
 *   - Shows on first visit; persists choice in localStorage.
 *   - "Accept" stores `rc:cookie-consent = accepted-{timestamp}`.
 *   - "Reject" stores `rc:cookie-consent = rejected-{timestamp}` and
 *     downstream code (AdSense bootstrap, GA4 init) should respect this
 *     by checking the consent value before initializing.
 *   - Dismissed cleanly with Escape or the close button.
 */
const STORAGE_KEY = 'rc:cookie-consent';

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return;
    // Delay 800ms so the banner doesn't compete with the hero/popup.
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);

  function record(decision: 'accepted' | 'rejected') {
    try {
      window.localStorage.setItem(STORAGE_KEY, `${decision}-${Date.now()}`);
    } catch {
      /* swallow */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-[70] px-3 pb-3 print:hidden sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-ink/10 bg-white p-4 shadow-2xl sm:p-5">
        <div className="flex items-start gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 sm:flex">
            <Cookie className="h-5 w-5 text-terracotta-500" aria-hidden />
          </div>
          <div className="flex-1">
            <p id="cookie-banner-title" className="font-serif text-base font-bold text-ink sm:text-lg">
              We use a small number of cookies
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Strictly-necessary cookies keep RecipeCrave working (saved recipes, your cooking streak, your language).
              Optional cookies — if you opt in — let us measure traffic. No personal data is sold.
              {' '}
              <Link href="/privacy" className="font-semibold text-terracotta-500 hover:underline">
                Read the policy
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => record('accepted')}
                className="rounded-full bg-terracotta-500 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 focus-ring"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => record('rejected')}
                className="rounded-full border-2 border-ink/15 bg-white px-5 py-2 text-sm font-bold text-ink transition-colors hover:border-ink/30 focus-ring"
              >
                Strictly necessary only
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => record('rejected')}
            aria-label="Dismiss banner"
            className="rounded-md p-1.5 text-ink-subtle hover:bg-cream-100 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
