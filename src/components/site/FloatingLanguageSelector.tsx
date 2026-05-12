'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X, Languages } from 'lucide-react';
import { LOCALES } from '@/lib/i18n/locales';
import { useI18n } from '@/lib/i18n/I18nProvider';

/**
 * Floating side-anchored language picker.
 *
 * Layout:
 *   - Resting state: vertical pill anchored to the right edge of the viewport,
 *     mid-page. Shows current locale flag + a rotated "LANGUAGE" label.
 *     Print-hidden. Stays clear of the bottom-right ScrollToTop button.
 *   - Active state: a slide-out drawer animates in from the right edge,
 *     showing all 30 locales with flag + native name + English name +
 *     active-check.
 *
 * Implementation notes:
 *   - Drawer renders inline (not portaled) since the parent has no
 *     backdrop-filter container traps for fixed positioning at this depth.
 *   - Locks body scroll while drawer is open.
 *   - Closes on outside click, Escape, and locale pick.
 *   - Trigger button reads aria-expanded; drawer is role="dialog".
 */
export function FloatingLanguageSelector() {
  const { locale, meta, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Body scroll lock + listeners
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        // Allow clicks on the trigger itself to toggle, handled by its onClick.
        const trigger = (e.target as HTMLElement).closest('[data-lang-trigger]');
        if (!trigger) setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <>
      {/* Floating trigger pill (right edge, mid-page) */}
      <button
        type="button"
        data-lang-trigger
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="floating-lang-drawer"
        aria-label={t('lang.label', 'Language')}
        className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-1.5 rounded-l-2xl bg-gradient-to-b from-terracotta-500 to-terracotta-600 px-2 py-3 text-white shadow-lg ring-2 ring-white/40 transition-transform hover:-translate-y-1/2 hover:-translate-x-0 hover:scale-105 focus-ring print:hidden sm:gap-2 sm:px-2.5 sm:py-4"
      >
        <span className="text-lg leading-none sm:text-xl" aria-hidden>{meta.flag}</span>
        <span
          className="hidden text-[10px] font-bold uppercase tracking-widest sm:inline"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {t('lang.label', 'Language')}
        </span>
      </button>

      {/* Slide-out drawer */}
      <div
        id="floating-lang-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t('lang.label', 'Language')}
        className={`fixed inset-y-0 right-0 z-[70] flex w-[88vw] max-w-sm flex-col bg-white shadow-2xl ring-1 ring-ink/10 transition-transform duration-300 print:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={drawerRef}
      >
        <div className="flex items-center justify-between border-b border-ink/10 bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5" aria-hidden />
            <h2 className="font-serif text-lg font-bold">
              {t('lang.label', 'Language')}
            </h2>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {LOCALES.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('common.close', 'Close')}
            className="rounded-md p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Listbox structure flattened — option buttons are direct children
            of the listbox so the WAI-ARIA parent/child relationship is
            satisfied without intervening <li> wrappers. */}
        <div role="listbox" aria-label="Select site language" className="flex-1 overflow-y-auto py-1">
          {LOCALES.map((l) => {
            const active = l.code === locale;
            return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    active ? 'bg-terracotta-50' : 'hover:bg-cream-50'
                  }`}
                  dir={l.rtl ? 'rtl' : 'ltr'}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="text-2xl" aria-hidden>{l.flag}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{l.native}</span>
                      <span className="block truncate text-[11px] text-ink-subtle">
                        {l.name}{l.rtl ? ' · RTL' : ''}
                      </span>
                    </span>
                  </span>
                  {active ? (
                    <Check className="h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
                  ) : null}
                </button>
            );
          })}
        </div>

        <p className="border-t border-ink/10 bg-cream-50 px-4 py-3 text-[11px] text-ink-subtle">
          {t(
            'lang.translateBanner',
            'Recipe content currently in English. UI fully translated. Recipe auto-translation rolling out in 2026.',
          )}
        </p>
      </div>

      {/* Backdrop overlay only when drawer open */}
      {open ? (
        <div
          aria-hidden
          className="fixed inset-0 z-[65] bg-ink/30 backdrop-blur-sm transition-opacity print:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
