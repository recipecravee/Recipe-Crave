'use client';

import { useEffect } from 'react';

type Props = {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'fluid';
  layout?: 'in-article' | 'in-feed';
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ slot, format = 'auto', layout, className }: Props) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense will retry — ignore
    }
  }, [client]);

  // Render nothing when AdSense client ID is absent. Placeholder boxes were
  // showing on a value-first launch — user has not applied for ads yet.
  // The slot becomes a real <ins> element only after NEXT_PUBLIC_ADSENSE_CLIENT
  // is provisioned.
  if (!client) {
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ad-slot ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout}
      data-full-width-responsive="true"
    />
  );
}
