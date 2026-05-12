'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

/**
 * Cookie consent banner — US-first wording, GDPR + CCPA compliant.
 *
 * Audience: primary US, secondary global. Copy reads conversationally
 * (American English, second-person, no legalese in the headline) while
 * still satisfying:
 *   - EU GDPR: explicit opt-in for non-essential cookies, "Reject" path
 *     never harder than "Accept", no pre-checked boxes.
 *   - California CCPA / CPRA: clear "Do Not Sell or Share My Information"
 *     link surfaced alongside the choice buttons.
 *   - Virginia VCDPA / Colorado CPA / Connecticut CTDPA: same opt-out
 *     mechanism covers these.
 *
 * Behavior:
 *   - Hidden until 800ms after first paint (no SSR flash; doesn't compete
 *     with hero / welcome popup).
 *   - First visit only; persists in localStorage `rc:cookie-consent`.
 *   - "Accept all" → analytics + future AdSense can initialize.
 *   - "Essentials only" → only strictly-necessary cookies stored.
 *   - "Do Not Sell or Share" → same as Essentials, plus sets the CCPA
 *     opt-out flag downstream code reads before sharing data with any
 *     third party.
 */
const STORAGE_KEY = 'rc:cookie-consent';
const CCPA_KEY = 'rc:ccpa-opt-out';

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);

  function record(decision: 'accepted' | 'essentials' | 'ccpa-opt-out') {
    try {
      window.localStorage.setItem(STORAGE_KEY, `${decision}-${Date.now()}`);
      if (decision === 'ccpa-opt-out') {
        window.localStorage.setItem(CCPA_KEY, '1');
      }
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
              Your privacy, your choice
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              We use cookies to keep RecipeCrave working — your saved recipes, cooking streak,
              and language preference live in your browser. If you opt in, we also use cookies
              to count visits so we can improve the site. We do not sell your personal information.
              {' '}
              <Link href="/privacy" className="font-semibold text-terracotta-500 hover:underline">
                Privacy Policy
              </Link>
              {' · '}
              <Link href="/privacy#ccpa" className="font-semibold text-terracotta-500 hover:underline">
                Your California Rights
              </Link>
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
                onClick={() => record('essentials')}
                className="rounded-full border-2 border-ink/15 bg-white px-5 py-2 text-sm font-bold text-ink transition-colors hover:border-ink/30 focus-ring"
              >
                Essentials only
              </button>
              <button
                type="button"
                onClick={() => record('ccpa-opt-out')}
                className="rounded-full px-3 py-2 text-xs font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-ring"
              >
                Do Not Sell or Share My Information
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => record('essentials')}
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
