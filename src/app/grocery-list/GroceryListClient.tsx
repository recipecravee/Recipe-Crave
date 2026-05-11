'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Printer, Share2, X, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type RecipeSlim = {
  slug: string;
  title: string;
  servings: number;
  ingredients: Array<{ name: string; qty: number; unit: string }>;
};

type AisleGroup = {
  aisle: string;
  items: Array<{ name: string; qty: number; unit: string; source: string[] }>;
};

const AISLE_KEYWORDS: Array<{ aisle: string; rx: RegExp }> = [
  { aisle: 'Produce', rx: /\b(onion|garlic|tomato|pepper|chili|lemon|lime|ginger|cilantro|parsley|basil|mint|spinach|kale|carrot|cucumber|potato|sweet potato|plantain|banana|berry|mango|pineapple|cabbage|broccoli|zucchini|eggplant|squash|mushroom|leek|scallion|green onion|shallot|avocado|herb|leaf|stalk|fresh)\b/i },
  { aisle: 'Meat & Seafood', rx: /\b(chicken|beef|pork|lamb|turkey|bacon|sausage|ham|salmon|shrimp|fish|tuna|cod|prawn|mussel|crab)\b/i },
  { aisle: 'Dairy & Eggs', rx: /\b(milk|butter|cream|cheese|yogurt|yoghurt|sour cream|mascarpone|parmesan|feta|mozzarella|cheddar|gruy|ricotta|egg|buttermilk)\b/i },
  { aisle: 'Pantry & Dry Goods', rx: /\b(flour|sugar|rice|pasta|noodle|bread|tortilla|pita|bun|oat|cereal|cornmeal|cornstarch|baking|yeast|sat|salt|pepper|spice|cumin|paprika|coriander|cinnamon|nutmeg|turmeric|curry|oregano|thyme|bay|chili powder|vanilla|cocoa|chocolate)\b/i },
  { aisle: 'Canned & Jarred', rx: /\b(canned|tomato paste|crushed tomato|coconut milk|broth|stock|bean|chickpea|lentil|olive|caper|pickle|jam|sauce|paste)\b/i },
  { aisle: 'Oils & Vinegars', rx: /\b(olive oil|vegetable oil|sesame oil|canola|coconut oil|vinegar|fish sauce|soy sauce|tamari|miso|mirin|tahini|honey|maple|syrup)\b/i },
  { aisle: 'Frozen', rx: /\b(frozen|ice cream)\b/i },
  { aisle: 'Beverages', rx: /\b(juice|coffee|tea|wine|beer|sparkling)\b/i },
];

function classifyAisle(name: string): string {
  for (const { aisle, rx } of AISLE_KEYWORDS) {
    if (rx.test(name)) return aisle;
  }
  return 'Other';
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/,.*$/, '').trim();
}

export function GroceryListClient() {
  const [recipes, setRecipes] = useState<RecipeSlim[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecipeSlim[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [shared, setShared] = useState(false);

  // Load saved selections from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('rc:grocery-recipes');
    if (saved) {
      try { setRecipes(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('rc:grocery-recipes', JSON.stringify(recipes));
  }, [recipes]);

  async function search(q: string) {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/recipes-search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        setResults([]);
        return;
      }
      const data = (await res.json()) as { recipes: RecipeSlim[] };
      setResults(data.recipes ?? []);
    } catch {
      setResults([]);
    }
  }

  function add(r: RecipeSlim) {
    if (recipes.some((x) => x.slug === r.slug)) return;
    setRecipes([...recipes, r]);
    setQuery('');
    setResults([]);
  }

  function remove(slug: string) {
    setRecipes(recipes.filter((r) => r.slug !== slug));
  }

  const aisleGroups: AisleGroup[] = useMemo(() => {
    const map = new Map<string, AisleGroup>();
    for (const recipe of recipes) {
      for (const ing of recipe.ingredients) {
        const key = `${normalize(ing.name)}|${ing.unit.toLowerCase()}`;
        const aisle = classifyAisle(ing.name);
        if (!map.has(aisle)) map.set(aisle, { aisle, items: [] });
        const group = map.get(aisle)!;
        const existing = group.items.find((it) => `${normalize(it.name)}|${it.unit.toLowerCase()}` === key);
        if (existing) {
          existing.qty += ing.qty;
          if (!existing.source.includes(recipe.title)) existing.source.push(recipe.title);
        } else {
          group.items.push({ name: ing.name, qty: ing.qty, unit: ing.unit, source: [recipe.title] });
        }
      }
    }
    const ordered = ['Produce', 'Meat & Seafood', 'Dairy & Eggs', 'Pantry & Dry Goods', 'Canned & Jarred', 'Oils & Vinegars', 'Frozen', 'Beverages', 'Other'];
    return ordered
      .map((a) => map.get(a))
      .filter((g): g is AisleGroup => Boolean(g))
      .map((g) => ({ ...g, items: g.items.sort((a, b) => a.name.localeCompare(b.name)) }));
  }, [recipes]);

  function toggleItem(key: string) {
    const next = new Set(checked);
    if (next.has(key)) next.delete(key); else next.add(key);
    setChecked(next);
  }

  async function shareList() {
    const text = aisleGroups
      .map((g) => `${g.aisle}\n` + g.items.map((it) => `  - ${it.qty} ${it.unit} ${it.name}`).join('\n'))
      .join('\n\n');
    const full = `My RecipeCrave grocery list\n\n${text}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Grocery list', text: full });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(full);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {}
  }

  function printList() {
    window.print();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,1.5fr]">
      <section className="space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg">Add recipes</h2>
          <div className="mt-3">
            <Input
              type="search"
              placeholder="Search recipes by name…"
              value={query}
              onChange={(e) => search(e.target.value)}
            />
          </div>
          {results.length > 0 ? (
            <ul className="mt-3 max-h-72 overflow-y-auto rounded-md border border-ink/10 bg-white">
              {results.slice(0, 8).map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => add(r)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-cream-100"
                  >
                    <span className="truncate">{r.title}</span>
                    <Plus className="h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {recipes.length > 0 ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-serif text-lg">In this week</h2>
            <ul className="mt-3 space-y-2">
              {recipes.map((r) => (
                <li key={r.slug} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate">{r.title}</span>
                  <button
                    type="button"
                    onClick={() => remove(r.slug)}
                    className="rounded-full p-1 text-ink-subtle hover:bg-cream-200 hover:text-danger"
                    aria-label={`Remove ${r.title}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">Your list</h2>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={printList}>
              <Printer className="mr-1.5 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={shareList}>
              {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
              {shared ? 'Copied' : 'Share'}
            </Button>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink/10 p-10 text-center">
            <ShoppingCart className="mb-3 h-10 w-10 text-ink-subtle" aria-hidden />
            <p className="font-serif text-lg">No recipes yet</p>
            <p className="mt-1 text-sm text-ink-muted">Add a recipe on the left to start building your list.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {aisleGroups.map((g) => (
              <div key={g.aisle}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-terracotta-500">
                  {g.aisle}
                </h3>
                <ul className="space-y-1.5">
                  {g.items.map((it) => {
                    const key = `${g.aisle}|${it.name}|${it.unit}`;
                    const isChecked = checked.has(key);
                    return (
                      <li
                        key={key}
                        className={`flex items-start gap-2 text-sm ${isChecked ? 'text-ink-subtle line-through' : 'text-ink'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(key)}
                          className="mt-1 h-4 w-4 rounded border-ink/30 text-terracotta-400"
                          aria-label={it.name}
                        />
                        <div className="flex-1">
                          <span className="font-medium">{it.qty} {it.unit}</span> {it.name}
                          {it.source.length > 1 ? (
                            <span className="ml-2 text-xs text-ink-subtle">
                              · for {it.source.length} recipes
                            </span>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
