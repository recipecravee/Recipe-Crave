'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { dismissPrompt, isPromptDismissed, pushSupported, subscribeToPush } from '@/lib/push';

/**
 * Soft permission prompt for push notifications.
 *
 * UX flow:
 *   1. Hidden unless pushSupported() (browser capable + VAPID configured).
 *   2. Shows ONLY after the user demonstrates engagement — page-view
 *      count >= 3 stored in sessionStorage. New visitors don't get
 *      hit with a permission ask on first paint.
 *   3. Banner appears bottom-center. "Enable" triggers the real
 *      Notification.requestPermission(); "Not now" dismisses for 30
 *      days via localStorage flag.
 *   4. Browsers only show the underlying permission UI once. If the
 *      user denies, isPromptDismissed() flips true so the banner
 *      never re-shows.
 *
 * Stays inactive until owner provisions VAPID keys; pushSupported()
 * returns false and the component never renders.
 */
const ENGAGEMENT_THRESHOLD = 3;
const VIEW_COUNT_KEY = 'rc:push-view-count';

export function PushNotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pushSupported()) return undefined;
    if (isPromptDismissed()) return undefined;
    if (typeof Notification !== 'undefined' && Notification.permission !== 'default') return undefined;

    // Bump engagement counter per page view. Show banner once threshold hit.
    let n = 0;
    try {
      const raw = window.sessionStorage.getItem(VIEW_COUNT_KEY);
      n = raw ? parseInt(raw, 10) || 0 : 0;
      window.sessionStorage.setItem(VIEW_COUNT_KEY, String(n + 1));
    } catch {
      /* swallow */
    }
    if (n + 1 >= ENGAGEMENT_THRESHOLD) {
      // Delay so it doesn't fight LCP.
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  async function onEnable() {
    setBusy(true);
    setMessage(null);
    const res = await subscribeToPush();
    setBusy(false);
    if (res.ok) {
      setMessage('Done — three free recipes hit your phone every day at 9am.');
      setTimeout(() => setVisible(false), 2500);
      dismissPrompt();
    } else {
      setMessage(res.error ?? 'Could not enable.');
      if (res.error === 'Notifications blocked') {
        dismissPrompt();
        setTimeout(() => setVisible(false), 2500);
      }
    }
  }

  function onDismiss() {
    dismissPrompt();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="push-prompt-title"
      className="fixed inset-x-0 bottom-3 z-[55] mx-auto max-w-md px-3 print:hidden sm:bottom-6 sm:px-0"
    >
      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-xl sm:p-5">
        <div className="flex items-start gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 sm:flex">
            <Bell className="h-5 w-5 text-terracotta-500" aria-hidden />
          </div>
          <div className="flex-1">
            <p id="push-prompt-title" className="font-serif text-base font-bold text-ink sm:text-lg">
              Three free recipes, every day at 9am
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Enable notifications to get the daily digest direct on this device. Cancel any time
              from your browser settings — we never spam.
            </p>
            {message ? (
              <p className="mt-2 rounded-lg bg-cream-50 px-2 py-1.5 text-xs text-ink">{message}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onEnable}
                disabled={busy}
                className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 disabled:opacity-60 focus-ring"
              >
                {busy ? 'Enabling…' : 'Enable'}
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-bold text-ink hover:border-ink/30 focus-ring"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="rounded-md p-1.5 text-ink-subtle hover:bg-cream-100 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
