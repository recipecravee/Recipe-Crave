'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

/**
 * Bookmark a recipe without requiring login.
 *
 * Strategy doc requires bookmark functionality without login wall — this
 * lifts session duration + repeat-visit signals to Google. State persists
 * in localStorage under `rc:saved` as a Set<slug>.
 *
 * The /saved page reads the same key and renders saved recipe cards.
 *
 * Strict no-flash render: button shows a neutral placeholder during the
 * brief mount window before localStorage is read.
 */
export function RecipeSaveButton({
  slug,
  variant = 'pill',
  className = '',
}: {
  slug: string;
  variant?: 'pill' | 'icon';
  className?: string;
}) {
  const [saved, setSaved] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem('rc:saved');
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        if (Array.isArray(arr) && arr.includes(slug)) setSaved(true);
      }
    } catch {
      /* ignore */
    }
  }, [slug]);

  function toggle() {
    setSaved((current) => {
      const next = !current;
      try {
        const raw = window.localStorage.getItem('rc:saved');
        const arr = raw ? (JSON.parse(raw) as string[]) : [];
        const set = new Set(Array.isArray(arr) ? arr : []);
        if (next) set.add(slug);
        else set.delete(slug);
        window.localStorage.setItem('rc:saved', JSON.stringify([...set]));
        // Notify any other RecipeSaveButton on the same page + the /saved page
        window.dispatchEvent(new CustomEvent('rc:saved-changed'));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  // Cross-component sync — listen for changes elsewhere on the page
  useEffect(() => {
    function refresh() {
      try {
        const raw = window.localStorage.getItem('rc:saved');
        const arr = raw ? (JSON.parse(raw) as string[]) : [];
        setSaved(Array.isArray(arr) && arr.includes(slug));
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('rc:saved-changed', refresh);
    return () => window.removeEventListener('rc:saved-changed', refresh);
  }, [slug]);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved' : 'Save recipe'}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink-muted shadow-sm transition-colors hover:border-terracotta-400 hover:text-terracotta-500 print:hidden ${className}`}
      >
        {mounted && saved ? (
          <BookmarkCheck className="h-4 w-4 text-terracotta-500" aria-hidden />
        ) : (
          <Bookmark className="h-4 w-4" aria-hidden />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold shadow-sm transition-colors focus-ring print:hidden ${
        mounted && saved
          ? 'border-terracotta-300 text-terracotta-600'
          : 'text-ink-muted hover:border-terracotta-400 hover:text-terracotta-500'
      } ${className}`}
    >
      {mounted && saved ? (
        <>
          <BookmarkCheck className="h-3.5 w-3.5" aria-hidden /> Saved
        </>
      ) : (
        <>
          <Bookmark className="h-3.5 w-3.5" aria-hidden /> Save recipe
        </>
      )}
    </button>
  );
}
