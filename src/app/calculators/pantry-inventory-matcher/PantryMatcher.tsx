'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Camera, Check, RotateCcw, Search, X, Plus, Clock, Users, ChefHat, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PANTRY_ITEMS, PANTRY_CATEGORIES, defaultOwnedSet, scoreRecipe,
  type RecipeMatch,
} from '@/content/pantry-catalog';
import type { Recipe } from '@/types/recipe';

type Props = {
  recipes: Recipe[];
};

const STORAGE_KEY = 'rc:pantry:owned';
const CUSTOM_KEY = 'rc:pantry:custom';
const MIN_MATCH_PCT = 60;

export function PantryMatcher({ recipes }: Props) {
  const [owned, setOwned] = useState<Set<string>>(() => defaultOwnedSet());
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(['Protein', 'Vegetables', 'Dairy & Eggs']));
  const [strictMode, setStrictMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setOwned(new Set(arr));
      }
      const c = localStorage.getItem(CUSTOM_KEY);
      if (c) {
        const arr = JSON.parse(c);
        if (Array.isArray(arr)) setCustomItems(arr);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...owned]));
  }, [owned]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customItems));
  }, [customItems]);

  function toggle(slug: string) {
    setOwned((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleCat(cat: string) {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function selectCategory(cat: string, on: boolean) {
    setOwned((prev) => {
      const next = new Set(prev);
      const items = PANTRY_ITEMS.filter((i) => i.category === cat);
      for (const item of items) {
        if (on) next.add(item.slug);
        else if (!item.defaultOn) next.delete(item.slug);
      }
      return next;
    });
  }

  function clearAll() {
    setOwned(defaultOwnedSet());
    setCustomItems([]);
  }

  function addCustom() {
    const t = customInput.trim();
    if (!t) return;
    if (customItems.includes(t.toLowerCase())) return;
    setCustomItems((p) => [...p, t.toLowerCase()]);
    setCustomInput('');
  }

  function removeCustom(s: string) {
    setCustomItems((p) => p.filter((x) => x !== s));
  }

  // Custom items don't have slugs, but they hint at ingredient matches.
  // Inject them as pseudo-slugs prefixed with "custom:" and inspect recipe
  // ingredients to look for these strings directly.
  const customSet = useMemo(() => new Set(customItems.map((c) => c.toLowerCase())), [customItems]);

  const matches = useMemo((): Array<RecipeMatch & { recipe: Recipe }> => {
    const results: Array<RecipeMatch & { recipe: Recipe }> = [];
    for (const r of recipes) {
      const base = scoreRecipe(r, owned);
      // Bonus: any recipe ingredient text containing a custom item counts
      let extraMatched = 0;
      if (customSet.size > 0) {
        for (const missingText of base.missing.slice()) {
          for (const c of customSet) {
            if (missingText.toLowerCase().includes(c)) {
              extraMatched++;
              break;
            }
          }
        }
      }
      const totalMatched = base.matched.length + extraMatched;
      const matchPct = base.totalIngredients > 0 ? (totalMatched / base.totalIngredients) * 100 : 0;
      results.push({ ...base, matchPct, recipe: r });
    }
    const threshold = strictMode ? 100 : MIN_MATCH_PCT;
    return results
      .filter((m) => m.matchPct >= threshold)
      .sort((a, b) => b.matchPct - a.matchPct || a.missing.length - b.missing.length);
  }, [recipes, owned, customSet, strictMode]);

  const visibleItems = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return PANTRY_ITEMS;
    return PANTRY_ITEMS.filter((i) =>
      i.name.toLowerCase().includes(q) ||
      i.slug.includes(q) ||
      (i.aliases ?? []).some((a) => a.toLowerCase().includes(q)),
    );
  }, [searchFilter]);

  const ownedCount = owned.size + customItems.length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
      {/* LEFT — pantry */}
      <section className="space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
                Your pantry
              </p>
              <p className="mt-1 text-2xl font-bold text-ink">
                {ownedCount} <span className="text-sm font-medium text-ink-muted">items</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/pantry-match"
                className="inline-flex items-center gap-1 rounded-md border border-ink/15 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-terracotta-400 hover:text-terracotta-500"
              >
                <Camera className="h-3.5 w-3.5" />
                Photo scan
              </Link>
              <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                <RotateCcw className="mr-1.5 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-ink/15 bg-cream-50 px-4">
            <Search className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
            <Input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter pantry list (e.g. tomato)"
              aria-label="Filter pantry items"
              className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
            {searchFilter ? (
              <button type="button" onClick={() => setSearchFilter('')} aria-label="Clear filter">
                <X className="h-3.5 w-3.5 text-ink-subtle hover:text-ink" />
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            {PANTRY_CATEGORIES.map((cat) => {
              const items = visibleItems.filter((i) => i.category === cat);
              if (items.length === 0) return null;
              const isOpen = openCats.has(cat) || !!searchFilter;
              const inCatOwned = items.filter((i) => owned.has(i.slug)).length;
              return (
                <div key={cat} className="rounded-xl border border-ink/10">
                  <button
                    type="button"
                    onClick={() => toggleCat(cat)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-bold text-ink">{cat}</span>
                    <span className="text-xs text-ink-subtle">
                      {inCatOwned} / {items.length}{' '}
                      <span className={`ml-1 inline-block transition-transform ${isOpen ? 'rotate-90' : ''}`} aria-hidden>
                        ›
                      </span>
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-ink/5 p-3">
                      <div className="mb-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => selectCategory(cat, true)}
                          className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700"
                        >
                          Select all
                        </button>
                        <span className="text-ink-subtle">·</span>
                        <button
                          type="button"
                          onClick={() => selectCategory(cat, false)}
                          className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle hover:text-ink"
                        >
                          Clear category
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((item) => {
                          const on = owned.has(item.slug);
                          return (
                            <button
                              key={item.slug}
                              type="button"
                              onClick={() => toggle(item.slug)}
                              aria-pressed={on}
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                                on
                                  ? 'bg-forest-600 text-white'
                                  : item.defaultOn
                                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                                  : 'bg-cream-100 text-ink hover:bg-cream-200'
                              }`}
                              title={item.defaultOn ? 'Pantry staple (assumed available by default)' : undefined}
                            >
                              {on ? <Check className="-mt-0.5 mr-1 inline h-3 w-3" /> : null}
                              {item.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            Add custom items
          </p>
          <p className="mt-1 text-xs text-ink-subtle">
            Anything not in the list above. Plain English — &quot;leftover roast chicken&quot;,
            &quot;sourdough starter&quot;, etc.
          </p>
          <div className="mt-3 flex gap-2">
            <Input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
              placeholder="Add item"
              aria-label="Add custom pantry item"
              className="h-10"
            />
            <Button type="button" size="sm" onClick={addCustom}>
              <Plus className="mr-1.5 h-4 w-4" /> Add
            </Button>
          </div>
          {customItems.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {customItems.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => removeCustom(c)}
                  className="group inline-flex items-center gap-1 rounded-full bg-forest-100 px-2.5 py-1 text-xs font-semibold text-forest-700 hover:bg-red-50 hover:text-red-700"
                >
                  {c}
                  <X className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* RIGHT — matches */}
      <section className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 via-cream-50 to-forest-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
                You can make
              </p>
              <p className="mt-1 font-serif text-3xl font-bold text-ink">
                {matches.length} recipe{matches.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-ink-muted">
                {strictMode
                  ? '100% match — every ingredient covered'
                  : `${MIN_MATCH_PCT}% match or better — at most a few items short`}
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={strictMode}
                onChange={(e) => setStrictMode(e.target.checked)}
                className="h-4 w-4 rounded border-ink/30 text-terracotta-500"
              />
              <span className="font-semibold text-ink">Cook tonight only (100%)</span>
            </label>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <ChefHat className="mx-auto h-10 w-10 text-ink-subtle" aria-hidden />
            <p className="mt-3 font-serif text-lg font-bold text-ink">
              {ownedCount <= 4
                ? 'Pick a few pantry items to see what you can cook'
                : strictMode
                ? 'No 100% matches yet — toggle off strict mode'
                : 'Add a few more ingredients to surface recipes'}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              The matcher checks {recipes.length} recipes in the RecipeCrave catalog against what
              you have at home.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {matches.slice(0, 24).map((m) => {
              const r = m.recipe;
              const pct = Math.round(m.matchPct);
              const need = m.missing.length;
              return (
                <li key={r.slug} className="rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <Link href={`/recipes/${r.slug}`} className="block">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-forest-100 to-forest-200 text-forest-700">
                        <span className="font-serif text-base font-bold">{pct}%</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-base font-bold text-ink hover:text-terracotta-500">
                          {r.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-ink-muted">
                          {r.cuisine ? <span>{r.cuisine}</span> : null}
                          {r.totalTimeMin ? (
                            <span className="inline-flex items-center gap-0.5">
                              <Clock className="h-3 w-3" /> {r.totalTimeMin}m
                            </span>
                          ) : null}
                          {r.servings ? (
                            <span className="inline-flex items-center gap-0.5">
                              <Users className="h-3 w-3" /> {r.servings}
                            </span>
                          ) : null}
                          {pct === 100 ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-forest-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700">
                              <Sparkles className="h-2.5 w-2.5" /> Ready to cook
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {need > 0 && need <= 3 ? (
                      <p className="mt-2 text-xs text-ink-muted">
                        <span className="font-bold text-amber-700">Need:</span>{' '}
                        {m.missing.slice(0, 3).join(' · ')}
                      </p>
                    ) : need > 3 ? (
                      <p className="mt-2 text-xs text-ink-muted">
                        <span className="font-bold text-amber-700">Need {need} items:</span>{' '}
                        {m.missing.slice(0, 2).join(' · ')}
                        {' + '}
                        {need - 2} more
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
            {matches.length > 24 ? (
              <li className="rounded-2xl bg-cream-100 p-4 text-center text-sm text-ink-muted">
                + {matches.length - 24} more matches — narrow your pantry to focus the list
              </li>
            ) : null}
          </ul>
        )}
      </section>
    </div>
  );
}
