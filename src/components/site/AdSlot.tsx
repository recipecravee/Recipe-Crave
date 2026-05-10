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

  if (!client) {
    return (
      <div className={`ad-slot text-xs text-ink-subtle ${className ?? ''}`} aria-hidden>
        Ad placement (AdSense not configured)
      </div>
    );
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
