'use client';

import { useEffect } from 'react';

/**
 * Registers /sw.js on the client after the page is idle.
 *
 * Service worker enables:
 *   - Lighthouse PWA "Installable" criterion ✓
 *   - Google Play Store TWA submission requirement ✓
 *   - Apple App Store offline-functionality requirement ✓
 *   - Real offline support (cached recipes work without network)
 *   - Push notification scaffold (when owner provisions VAPID keys)
 *
 * Registration is gated to production so dev refreshes don't fight
 * cached HTML. requestIdleCallback defers the work until after first
 * meaningful paint.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (window.location.hostname === 'localhost') return;

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch(() => {
          /* swallow — registration is best-effort */
        });
    };

    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(register);
    } else {
      setTimeout(register, 2000);
    }
  }, []);

  return null;
}
