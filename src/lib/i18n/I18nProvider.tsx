'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_LOCALE, LOCALES, getLocale, type Locale } from './locales';
import { getDict } from './dict';

type I18nContextValue = {
  locale: string;
  meta: Locale;
  setLocale: (code: string) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'rc:lang';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE);

  // Restore preference on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALES.some((l) => l.code === saved)) {
      setLocaleState(saved);
    }
  }, []);

  // Reflect locale + RTL into the <html> element so every page picks up dir
  // and the lang attribute updates for screen readers / search engines.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const meta = getLocale(locale);
    document.documentElement.lang = meta.code;
    document.documentElement.dir = meta.rtl ? 'rtl' : 'ltr';
  }, [locale]);

  function setLocale(code: string) {
    setLocaleState(code);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, code);
    }
  }

  const meta = getLocale(locale);
  const dict = getDict(locale);

  function t(key: string, fallback?: string): string {
    return dict[key] ?? fallback ?? key;
  }

  return (
    <I18nContext.Provider value={{ locale, meta, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Lazy default: render English when used outside the provider. Prevents
    // hard crashes on any page that hasn't yet been wired through the tree.
    return {
      locale: DEFAULT_LOCALE,
      meta: getLocale(DEFAULT_LOCALE),
      setLocale: () => {},
      t: (k, f) => f ?? k,
    };
  }
  return ctx;
}
