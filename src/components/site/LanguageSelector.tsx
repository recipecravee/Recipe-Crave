'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { LOCALES } from '@/lib/i18n/locales';
import { useI18n } from '@/lib/i18n/I18nProvider';

type Variant = 'header' | 'compact';

export function LanguageSelector({ variant = 'header' }: { variant?: Variant }) {
  const { locale, meta, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('lang.label', 'Language')}
        className={
          variant === 'header'
            ? 'inline-flex h-10 items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 text-xs font-bold text-ink shadow-sm hover:border-terracotta-400 hover:text-terracotta-500 focus-ring'
            : 'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-ink-muted hover:text-ink focus-ring'
        }
      >
        <Languages className="h-3.5 w-3.5" aria-hidden />
        <span className="text-sm" aria-hidden>{meta.flag}</span>
        <span className="hidden sm:inline">{meta.native}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute right-0 top-full z-[70] mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-xl border border-ink/10 bg-white shadow-xl"
        >
          <p className="border-b border-ink/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-ink-subtle">
            {t('lang.label', 'Language')} · {LOCALES.length} available
          </p>
          <ul className="py-1">
            {LOCALES.map((l) => {
              const active = l.code === locale;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLocale(l.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm transition-colors ${
                      active ? 'bg-terracotta-50' : 'hover:bg-cream-50'
                    }`}
                    dir={l.rtl ? 'rtl' : 'ltr'}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-lg" aria-hidden>{l.flag}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-ink">{l.native}</span>
                        <span className="block truncate text-[11px] text-ink-subtle">{l.name}</span>
                      </span>
                    </span>
                    {active ? (
                      <Check className="h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-ink/10 bg-cream-50 px-4 py-2 text-[11px] text-ink-subtle">
            {t('lang.translateBanner', 'Recipe content currently in English. UI fully translated.')}
          </div>
        </div>
      ) : null}
    </div>
  );
}
