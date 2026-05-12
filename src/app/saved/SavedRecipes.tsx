'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Trash2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LiteRecipe = {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string | null;
  totalTimeMin: number;
  servings: number;
  cuisine?: string;
  course?: string;
};

export function SavedRecipes({ catalog }: { catalog: LiteRecipe[] }) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function refresh() {
      try {
        const raw = window.localStorage.getItem('rc:saved');
        const arr = raw ? (JSON.parse(raw) as string[]) : [];
        setSavedSlugs(Array.isArray(arr) ? arr : []);
      } catch {
        setSavedSlugs([]);
      }
    }
    refresh();
    setHydrated(true);
    window.addEventListener('rc:saved-changed', refresh);
    return () => window.removeEventListener('rc:saved-changed', refresh);
  }, []);

  function unsave(slug: string) {
    setSavedSlugs((prev) => {
      const next = prev.filter((s) => s !== slug);
      window.localStorage.setItem('rc:saved', JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('rc:saved-changed'));
      return next;
    });
  }

  function clearAll() {
    setSavedSlugs([]);
    window.localStorage.setItem('rc:saved', JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('rc:saved-changed'));
  }

  const saved = savedSlugs
    .map((slug) => catalog.find((r) => r.slug === slug))
    .filter((r): r is LiteRecipe => Boolean(r));

  if (!hydrated) {
    return <div className="h-32 animate-pulse rounded-2xl bg-cream-100" />;
  }

  if (saved.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <Bookmark className="mx-auto h-12 w-12 text-ink-subtle" aria-hidden />
        <p className="mt-3 font-serif text-xl font-bold text-ink">No saved recipes yet</p>
        <p className="mt-2 text-sm text-ink-muted">
          Browse recipes and tap the Save button to keep them here for later.
        </p>
        <Link
          href="/recipes"
          className="mt-4 inline-block rounded-full bg-terracotta-500 px-5 py-2 text-sm font-bold text-white hover:bg-terracotta-600"
        >
          Browse recipes
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {saved.length} saved recipe{saved.length === 1 ? '' : 's'}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={clearAll}>
          <Trash2 className="mr-1.5 h-4 w-4" /> Clear all
        </Button>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((r) => (
          <li key={r.slug} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Link href={`/recipes/${r.slug}`} className="block">
              {r.heroImage ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
                  <Image
                    src={r.heroImage}
                    alt={r.title}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="p-4">
                <h2 className="font-serif text-lg font-bold text-ink">{r.title}</h2>
                {r.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{r.description}</p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-ink-muted">
                  {r.totalTimeMin ? (
                    <span className="inline-flex items-center gap-0.5">
                      <Clock className="h-3 w-3" aria-hidden /> {r.totalTimeMin}m
                    </span>
                  ) : null}
                  {r.servings ? (
                    <span className="inline-flex items-center gap-0.5">
                      <Users className="h-3 w-3" aria-hidden /> {r.servings}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
            <div className="border-t border-ink/5 p-3">
              <button
                type="button"
                onClick={() => unsave(r.slug)}
                className="text-xs font-semibold text-ink-subtle hover:text-red-600"
              >
                Remove from saved
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
