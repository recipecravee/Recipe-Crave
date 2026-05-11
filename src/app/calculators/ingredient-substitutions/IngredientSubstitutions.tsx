'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search, X, ChevronRight, ChevronDown, ArrowLeftRight, Sparkles, AlertTriangle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  SUBSTITUTION_ITEMS, SUBSTITUTION_CATEGORIES, searchSubstitutions, rankSubsByContext,
  type IngredientSub, type Substitute, type AllergenFlag, type BestFor,
} from '@/content/substitution-data';

const POPULAR_SLUGS = [
  'buttermilk', 'egg', 'butter', 'heavy-cream', 'sour-cream',
  'all-purpose-flour', 'cornstarch', 'sugar-white', 'soy-sauce', 'vegetable-oil',
];

const ALLERGEN_OPTIONS: { value: AllergenFlag; label: string }[] = [
  { value: 'dairy', label: 'Dairy-free' },
  { value: 'gluten', label: 'Gluten-free' },
  { value: 'egg', label: 'Egg-free' },
  { value: 'nut', label: 'Nut-free' },
  { value: 'soy', label: 'Soy-free' },
  { value: 'animal', label: 'Vegan' },
];

const USE_OPTIONS: { value: BestFor; label: string }[] = [
  { value: 'baking', label: 'Baking' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'sauces', label: 'Sauces' },
  { value: 'frying', label: 'Frying' },
  { value: 'raw', label: 'Raw / cold' },
];

const QUALITY_STYLE: Record<Substitute['quality'], { label: string; cls: string }> = {
  best: { label: 'Best match', cls: 'bg-forest-100 text-forest-700' },
  good: { label: 'Good', cls: 'bg-amber-100 text-amber-700' },
  acceptable: { label: 'Acceptable', cls: 'bg-ink/10 text-ink-muted' },
};

export function IngredientSubstitutions() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<IngredientSub | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [allergenFilters, setAllergenFilters] = useState<AllergenFlag[]>([]);
  const [useFilter, setUseFilter] = useState<BestFor | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('rc:subs:state');
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (Array.isArray(s.allergenFilters)) setAllergenFilters(s.allergenFilters);
        if (s.useFilter) setUseFilter(s.useFilter);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('rc:subs:state', JSON.stringify({ allergenFilters, useFilter }));
  }, [allergenFilters, useFilter]);

  const results = useMemo(() => {
    if (query.trim().length >= 1) return searchSubstitutions(query, 40);
    if (activeCategory) return SUBSTITUTION_ITEMS.filter((i) => i.category === activeCategory);
    return [];
  }, [query, activeCategory]);

  const popular = useMemo(
    () => POPULAR_SLUGS.map((s) => SUBSTITUTION_ITEMS.find((i) => i.slug === s)).filter(Boolean) as IngredientSub[],
    [],
  );

  function pick(item: IngredientSub) {
    setSelected(item);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('sub-result');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  }

  function toggleAllergen(a: AllergenFlag) {
    setAllergenFilters((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  const rankedSubs = useMemo(() => {
    if (!selected) return [];
    return rankSubsByContext(selected.subs, allergenFilters, useFilter);
  }, [selected, allergenFilters, useFilter]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
      {/* LEFT: Search + browse */}
      <section className="space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            What are you out of?
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-full border border-ink/15 bg-cream-50 px-4">
            <Search className="h-4 w-4 text-ink-subtle" aria-hidden />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveCategory(null);
              }}
              placeholder="Buttermilk, egg, soy sauce…"
              aria-label="Search ingredient to substitute"
              className="h-12 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="rounded-md p-1 text-ink-subtle hover:bg-cream-100 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {!query && !activeCategory ? (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-subtle">
                Popular subs
              </p>
              <div className="flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => pick(p)}
                    className="rounded-full border border-ink/10 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-terracotta-400 hover:text-terracotta-500"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600">
            Filter results
          </p>
          <p className="mt-2 text-xs text-ink-subtle">
            Hides subs that contain allergens or do not suit your use case.
          </p>
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
              Allergens to avoid
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALLERGEN_OPTIONS.map((a) => {
                const on = allergenFilters.includes(a.value);
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => toggleAllergen(a.value)}
                    aria-pressed={on}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      on
                        ? 'bg-forest-600 text-white'
                        : 'bg-cream-100 text-ink hover:bg-cream-200'
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
              Use case
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setUseFilter(undefined)}
                aria-pressed={!useFilter}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  !useFilter
                    ? 'bg-terracotta-500 text-white'
                    : 'bg-cream-100 text-ink hover:bg-cream-200'
                }`}
              >
                Any
              </button>
              {USE_OPTIONS.map((u) => {
                const on = useFilter === u.value;
                return (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => setUseFilter(u.value)}
                    aria-pressed={on}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      on
                        ? 'bg-terracotta-500 text-white'
                        : 'bg-cream-100 text-ink hover:bg-cream-200'
                    }`}
                  >
                    {u.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600">
            Browse by category
          </p>
          <div className="mt-3 space-y-1.5">
            {SUBSTITUTION_CATEGORIES.map((c) => {
              const isActive = activeCategory === c;
              const count = SUBSTITUTION_ITEMS.filter((i) => i.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setActiveCategory(isActive ? null : c);
                    setQuery('');
                  }}
                  aria-pressed={isActive}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    isActive ? 'bg-terracotta-100 text-terracotta-700' : 'hover:bg-cream-100 text-ink'
                  }`}
                >
                  <span>{c}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-ink-subtle">{count}</span>
                    {isActive ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-ink-subtle">
            {SUBSTITUTION_ITEMS.length} ingredients indexed.
          </p>
        </div>

        {results.length > 0 ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-600">
              {query ? `${results.length} match${results.length === 1 ? '' : 'es'}` : activeCategory}
            </p>
            <ul className="space-y-1">
              {results.map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => pick(item)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selected?.slug === item.slug
                        ? 'bg-terracotta-50 text-terracotta-700'
                        : 'hover:bg-cream-50 text-ink'
                    }`}
                  >
                    <span className="font-semibold">{item.name}</span>
                    <ChevronRight className="h-4 w-4 text-ink-subtle" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* RIGHT: Substitutions card */}
      <section id="sub-result">
        {selected ? (
          <SubstitutionResultCard item={selected} subs={rankedSubs} activeFilters={{
            allergens: allergenFilters,
            use: useFilter,
          }} />
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 p-8 text-center shadow-sm">
            <ArrowLeftRight className="mx-auto h-12 w-12 text-ink-subtle" aria-hidden />
            <p className="mt-3 font-serif text-xl font-bold text-ink">Pick an ingredient on the left</p>
            <p className="mt-2 text-sm text-ink-muted">
              Type 2+ letters or tap a popular sub. We&apos;ll show ranked replacements with exact
              ratios, allergen flags, and notes.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function SubstitutionResultCard({
  item, subs, activeFilters,
}: {
  item: IngredientSub;
  subs: Substitute[];
  activeFilters: { allergens: AllergenFlag[]; use?: BestFor };
}) {
  const totalSubs = item.subs.length;
  const filteredOut = totalSubs - subs.length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 to-cream-100 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
          {item.category}
        </p>
        <h2 className="mt-1 font-serif text-3xl font-bold text-ink">
          Out of {item.name.toLowerCase()}?
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          {subs.length} option{subs.length === 1 ? '' : 's'} ranked by quality
          {filteredOut > 0 ? ` · ${filteredOut} hidden by filters` : ''}.
        </p>
      </div>

      {subs.length === 0 ? (
        <div className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div>
              <p className="font-semibold text-amber-900">No subs match your filters</p>
              <p className="mt-1 text-sm text-amber-900/80">
                Try removing an allergen filter or use-case selection.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <ul className="space-y-3">
        {subs.map((s, i) => {
          const qStyle = QUALITY_STYLE[s.quality];
          return (
            <li key={`${s.name}-${i}`} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {i === 0 && s.quality === 'best' ? (
                      <Sparkles className="h-4 w-4 text-forest-600" aria-hidden />
                    ) : null}
                    <h3 className="font-serif text-lg font-bold text-ink">{s.name}</h3>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-terracotta-600">{s.ratio}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${qStyle.cls}`}>
                  {qStyle.label}
                </span>
              </div>

              {s.notes ? (
                <p className="mt-2 text-sm text-ink-muted">{s.notes}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.bestFor?.map((b) => (
                  <span key={b} className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
                    {b}
                  </span>
                ))}
                {s.flavorImpact ? (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    s.flavorImpact === 'major' ? 'bg-amber-100 text-amber-700'
                      : s.flavorImpact === 'noticeable' ? 'bg-amber-50 text-amber-600'
                      : 'bg-forest-50 text-forest-600'
                  }`}>
                    flavor: {s.flavorImpact}
                  </span>
                ) : null}
                {s.allergenFlags?.map((a) => (
                  <span key={a} className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700">
                    contains {a}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {activeFilters.allergens.length > 0 || activeFilters.use ? (
        <p className="text-center text-[11px] text-ink-subtle">
          Filters active:{' '}
          {[
            ...activeFilters.allergens.map((a) => `no ${a}`),
            activeFilters.use ? `for ${activeFilters.use}` : '',
          ].filter(Boolean).join(' · ')}
        </p>
      ) : null}
    </div>
  );
}
