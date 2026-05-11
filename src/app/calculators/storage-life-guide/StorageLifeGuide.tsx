'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search, X, Refrigerator, Snowflake, Package, AlertTriangle, Flame,
  ChevronRight, ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  STORAGE_ITEMS, STORAGE_CATEGORIES, searchStorageItems, type StorageItem,
} from '@/content/storage-data';

const POPULAR_SLUGS = [
  'eggs', 'milk', 'chicken-raw', 'leftovers-cooked-meat', 'cooked-rice',
  'bread-sliced', 'avocado', 'ground-beef', 'fish-fresh', 'mayo',
];

export function StorageLifeGuide() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<StorageItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Persist last query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('rc:storage:lastQuery');
    if (raw) setQuery(raw);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('rc:storage:lastQuery', query);
  }, [query]);

  const results = useMemo(() => {
    if (query.trim().length >= 1) return searchStorageItems(query, 40);
    if (activeCategory) return STORAGE_ITEMS.filter((i) => i.category === activeCategory);
    return [];
  }, [query, activeCategory]);

  const popular = useMemo(
    () => POPULAR_SLUGS.map((s) => STORAGE_ITEMS.find((i) => i.slug === s)).filter(Boolean) as StorageItem[],
    [],
  );

  function pick(item: StorageItem) {
    setSelected(item);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: document.getElementById('storage-result')?.offsetTop ?? 0 - 80, behavior: 'smooth' });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
      {/* LEFT: Search + browse */}
      <section className="space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            Search
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-full border border-ink/15 bg-cream-50 px-4">
            <Search className="h-4 w-4 text-ink-subtle" aria-hidden />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveCategory(null);
              }}
              placeholder='How long does opened mayo last?'
              aria-label="Search for a food"
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
                Popular lookups
              </p>
              <div className="flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => pick(p)}
                    className="rounded-full border border-ink/10 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-terracotta-400 hover:text-terracotta-500"
                  >
                    {p.name.length > 28 ? `${p.name.slice(0, 28)}…` : p.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600">
            Browse by category
          </p>
          <div className="mt-3 space-y-1.5">
            {STORAGE_CATEGORIES.map((c) => {
              const isActive = activeCategory === c;
              const count = STORAGE_ITEMS.filter((i) => i.category === c).length;
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
            {STORAGE_ITEMS.length} foods indexed · USDA FoodKeeper + FDA cold-chain guidance.
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

      {/* RIGHT: Result card */}
      <section id="storage-result">
        {selected ? (
          <StorageResultCard item={selected} />
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 p-8 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-ink-subtle" aria-hidden />
            <p className="mt-3 font-serif text-xl font-bold text-ink">Pick a food on the left</p>
            <p className="mt-2 text-sm text-ink-muted">
              Type 2+ letters or tap a popular lookup. We&apos;ll show pantry / fridge / freezer
              storage life, spoilage signs, and reheating tips.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function StorageResultCard({ item }: { item: StorageItem }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 to-cream-100 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
          {item.category}
        </p>
        <h2 className="mt-1 font-serif text-3xl font-bold text-ink">{item.name}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StorageZone
          title="Pantry"
          icon={Package}
          color="from-amber-50 to-amber-100"
          textColor="text-amber-700"
          data={item.pantry}
        />
        <StorageZone
          title="Fridge"
          icon={Refrigerator}
          color="from-blue-50 to-blue-100"
          textColor="text-blue-700"
          data={item.fridge}
        />
        <StorageZone
          title="Freezer"
          icon={Snowflake}
          color="from-sky-50 to-sky-100"
          textColor="text-sky-700"
          data={item.freezer ? { unopened: item.freezer.time, note: item.freezer.note } : undefined}
          freezerStyle
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Spoilage signs — discard if you see
          </p>
        </div>
        <ul className="mt-3 space-y-1.5">
          {item.spoilageSigns.map((s, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-ink">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {item.reheating ? (
        <div className="rounded-2xl bg-forest-50 p-5 shadow-sm ring-1 ring-forest-200">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-forest-700" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">
              Reheating safety
            </p>
          </div>
          <p className="mt-2 text-sm text-ink">{item.reheating}</p>
        </div>
      ) : null}
    </div>
  );
}

type ZoneData = { unopened?: string; opened?: string; note?: string } | undefined;

function StorageZone({
  title,
  icon: Icon,
  color,
  textColor,
  data,
  freezerStyle,
}: {
  title: string;
  icon: typeof Package;
  color: string;
  textColor: string;
  data: ZoneData;
  freezerStyle?: boolean;
}) {
  if (!data || (!data.unopened && !data.opened && !data.note)) {
    return (
      <div className="rounded-2xl bg-cream-100/50 p-4 text-center shadow-sm">
        <Icon className="mx-auto h-5 w-5 text-ink-subtle" aria-hidden />
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-ink-subtle">
          {title}
        </p>
        <p className="mt-2 text-sm text-ink-subtle">Not recommended</p>
      </div>
    );
  }
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${color} p-4 shadow-sm`}>
      <div className="flex items-center gap-1.5">
        <Icon className={`h-4 w-4 ${textColor}`} aria-hidden />
        <p className={`text-xs font-bold uppercase tracking-widest ${textColor}`}>{title}</p>
      </div>
      <div className="mt-2 space-y-1.5 text-sm text-ink">
        {data.unopened ? (
          <p>
            <span className="text-[10px] font-bold uppercase text-ink-subtle">
              {freezerStyle ? 'Best quality' : 'Unopened'}
            </span>
            <br />
            <span className="font-serif text-lg font-bold">{data.unopened}</span>
          </p>
        ) : null}
        {data.opened ? (
          <p>
            <span className="text-[10px] font-bold uppercase text-ink-subtle">Opened</span>
            <br />
            <span className="font-serif text-lg font-bold">{data.opened}</span>
          </p>
        ) : null}
        {data.note ? (
          <p className="mt-2 text-xs text-ink-muted">{data.note}</p>
        ) : null}
      </div>
    </div>
  );
}
