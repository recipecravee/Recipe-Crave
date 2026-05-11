'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, BookOpen, Calculator, FileText, Globe, Leaf, CornerDownLeft,
} from 'lucide-react';
import { searchItems, type SearchItem } from '@/lib/search-index';

type Props = {
  variant?: 'icon' | 'inline';
  placeholder?: string;
};

const KIND_META: Record<SearchItem['kind'], { label: string; icon: typeof Search; color: string }> = {
  page: { label: 'Page', icon: FileText, color: 'text-ink' },
  calculator: { label: 'Tool', icon: Calculator, color: 'text-forest-600' },
  recipe: { label: 'Recipe', icon: BookOpen, color: 'text-terracotta-500' },
  cuisine: { label: 'Cuisine', icon: Globe, color: 'text-terracotta-400' },
  diet: { label: 'Diet', icon: Leaf, color: 'text-forest-600' },
};

export function SiteSearch({ variant = 'icon', placeholder = 'Search recipes, tools, pages…' }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchItems(q, 14), [q]);

  // Focus when opened
  useEffect(() => {
    if (open) {
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // Esc closes; outside click closes
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  // Global Cmd/Ctrl+K to open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function go(item: SearchItem) {
    setOpen(false);
    setQ('');
    router.push(item.href);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) {
        go(results[active]);
      } else if (q.trim().length >= 2) {
        router.push(`/recipes?q=${encodeURIComponent(q.trim())}`);
        setOpen(false);
        setQ('');
      }
    }
  }

  const trigger =
    variant === 'icon' ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="flex h-12 w-12 touch-manipulation items-center justify-center rounded-full bg-white text-ink-muted shadow-sm hover:text-ink focus-ring"
      >
        <Search className="h-5 w-5" aria-hidden />
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink-subtle shadow-sm transition-colors hover:border-terracotta-400 focus-ring"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="flex-1 text-left">{placeholder}</span>
        <kbd className="hidden rounded border border-ink/10 bg-cream-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-subtle sm:inline">
          ⌘K
        </kbd>
      </button>
    );

  return (
    <>
      {trigger}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
          className="animate-fade-in fixed inset-0 z-[80] flex items-start justify-center bg-ink/40 backdrop-blur-sm p-4 pt-[12vh]"
        >
          <div
            ref={panelRef}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-ink/10"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-4">
              <Search className="h-5 w-5 text-ink-subtle" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder={placeholder}
                aria-label="Search the site"
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink-subtle"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="rounded-md p-1.5 text-ink-subtle hover:bg-cream-100 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {q.trim().length < 2 ? (
                <div className="px-4 py-6 text-sm text-ink-muted">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-subtle">
                    Try
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['jollof', 'pasta', 'pancakes', 'scaler', 'temperature', 'vegan', 'breakfast'].map(
                      (s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setQ(s);
                            setActive(0);
                            inputRef.current?.focus();
                          }}
                          className="rounded-full border border-ink/10 bg-cream-100 px-3 py-1 text-xs font-semibold text-ink hover:border-terracotta-400 hover:text-terracotta-500"
                        >
                          {s}
                        </button>
                      ),
                    )}
                  </div>
                  <p className="mt-4 text-xs text-ink-subtle">
                    Type 2+ letters. Use ↑ ↓ to navigate, Enter to open, Esc to close.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-ink-muted">
                  No matches for <strong className="text-ink">{q}</strong>. Press Enter to search
                  all recipes.
                </div>
              ) : (
                <ul role="listbox" className="py-2">
                  {results.map((item, i) => {
                    const meta = KIND_META[item.kind];
                    const Icon = meta.icon;
                    const isActive = i === active;
                    return (
                      <li key={`${item.kind}:${item.href}`}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActive(i)}
                          onClick={() => go(item)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isActive ? 'bg-terracotta-50' : 'hover:bg-cream-50'
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream-100 ${meta.color}`}
                          >
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">
                              {item.title}
                            </span>
                            {item.hint ? (
                              <span className="block truncate text-xs text-ink-subtle">
                                {item.hint}
                              </span>
                            ) : null}
                          </span>
                          <span className="hidden text-[10px] font-bold uppercase tracking-wider text-ink-subtle sm:inline">
                            {meta.label}
                          </span>
                          {isActive ? (
                            <CornerDownLeft className="h-4 w-4 text-terracotta-500" aria-hidden />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-ink/10 bg-cream-50 px-4 py-2 text-[11px] text-ink-subtle">
              <span>
                <kbd className="rounded bg-white px-1 py-0.5 font-bold">↑</kbd>{' '}
                <kbd className="rounded bg-white px-1 py-0.5 font-bold">↓</kbd> navigate
              </span>
              <span>
                <kbd className="rounded bg-white px-1 py-0.5 font-bold">Enter</kbd> open
              </span>
              <span>
                <kbd className="rounded bg-white px-1 py-0.5 font-bold">Esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
