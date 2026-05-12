'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';
import { localeSystemLabel, locationSystem } from '@/lib/i18n/measurements';
import { Info } from 'lucide-react';
import Link from 'next/link';

/**
 * Inline banner that shows the user their locale's default measurement
 * system and links to the unit converter for any custom conversions.
 * Renders only when locale != 'en' so US users don't see redundant text.
 */
export function MeasurementBanner() {
  const { locale, meta } = useI18n();
  if (locale === 'en') return null;
  const system = locationSystem(locale);
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-3 py-1.5 text-[11px] text-ink-muted print:hidden"
      dir={meta.rtl ? 'rtl' : 'ltr'}
    >
      <Info className="h-3 w-3 shrink-0" aria-hidden />
      <span>
        Showing recipe in US units. Your locale prefers <strong className="text-ink">{localeSystemLabel(locale)}</strong>.
        Use our <Link href="/calculators/unit-converter" className="font-bold text-terracotta-600 hover:underline">unit converter</Link> to convert any line —{' '}
        {system === 'metric' ? 'cups → grams, °F → °C, oz → g.' : 'grams → cups, °C → °F.'}
      </span>
    </div>
  );
}
