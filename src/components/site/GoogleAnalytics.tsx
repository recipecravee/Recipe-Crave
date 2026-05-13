'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

/**
 * GA4 boot script — gated by cookie consent.
 *
 * Only initializes Google Analytics if the user has clicked "Accept all"
 * in the cookie banner. If the user clicked "Essentials only" or
 * "Do Not Sell or Share My Information", GA4 never loads and no tracking
 * occurs. Re-checks consent every time the visible state of the page
 * changes so a user who accepts later in the session begins tracking
 * immediately on the next route.
 *
 * Measurement ID supplied via NEXT_PUBLIC_GA_MEASUREMENT_ID. If unset,
 * this component renders nothing — safe for local dev or staging.
 */
const CONSENT_KEY = 'rc:cookie-consent';

type Props = { measurementId: string };

export function GoogleAnalytics({ measurementId }: Props) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => {
      const c = window.localStorage.getItem(CONSENT_KEY) ?? '';
      // Only "accepted-*" values opt in. "essentials-*" / "ccpa-opt-out-*"
      // both keep GA4 disabled.
      setAllowed(c.startsWith('accepted-'));
    };
    check();
    // Refresh on each tab focus so a banner accepted after the page is
    // already loaded begins tracking next focus.
    window.addEventListener('focus', check);
    window.addEventListener('storage', check);
    return () => {
      window.removeEventListener('focus', check);
      window.removeEventListener('storage', check);
    };
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
