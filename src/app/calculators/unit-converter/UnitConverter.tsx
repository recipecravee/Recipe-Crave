'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Search, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Density in grams per cup (US cup = 236.588 ml)
// Sources: USDA FoodData Central, King Arthur Baking, Joy of Cooking.
type Ingredient = {
  key: string;
  name: string;
  category: 'Flour' | 'Sugar' | 'Fat' | 'Liquid' | 'Dairy' | 'Grain' | 'Spice/Other' | 'Nuts/Seeds';
  gPerCup: number;
};

const INGREDIENTS: Ingredient[] = [
  // Flours
  { key: 'ap-flour', name: 'All-purpose flour', category: 'Flour', gPerCup: 125 },
  { key: 'bread-flour', name: 'Bread flour', category: 'Flour', gPerCup: 130 },
  { key: 'cake-flour', name: 'Cake flour', category: 'Flour', gPerCup: 115 },
  { key: 'whole-wheat-flour', name: 'Whole wheat flour', category: 'Flour', gPerCup: 120 },
  { key: 'almond-flour', name: 'Almond flour', category: 'Flour', gPerCup: 96 },
  { key: 'cornmeal', name: 'Cornmeal', category: 'Flour', gPerCup: 156 },
  { key: 'cornstarch', name: 'Cornstarch', category: 'Flour', gPerCup: 128 },
  { key: 'semolina', name: 'Semolina flour', category: 'Flour', gPerCup: 167 },
  // Sugars
  { key: 'granulated-sugar', name: 'Granulated sugar', category: 'Sugar', gPerCup: 200 },
  { key: 'brown-sugar-packed', name: 'Brown sugar (packed)', category: 'Sugar', gPerCup: 220 },
  { key: 'powdered-sugar', name: 'Powdered sugar (icing/confectioners)', category: 'Sugar', gPerCup: 120 },
  { key: 'caster-sugar', name: 'Caster sugar (superfine)', category: 'Sugar', gPerCup: 225 },
  { key: 'honey', name: 'Honey', category: 'Sugar', gPerCup: 340 },
  { key: 'maple-syrup', name: 'Maple syrup', category: 'Sugar', gPerCup: 322 },
  { key: 'molasses', name: 'Molasses', category: 'Sugar', gPerCup: 337 },
  { key: 'corn-syrup', name: 'Corn syrup', category: 'Sugar', gPerCup: 328 },
  { key: 'agave', name: 'Agave nectar', category: 'Sugar', gPerCup: 332 },
  // Fats
  { key: 'butter', name: 'Butter', category: 'Fat', gPerCup: 227 },
  { key: 'margarine', name: 'Margarine', category: 'Fat', gPerCup: 227 },
  { key: 'shortening', name: 'Vegetable shortening', category: 'Fat', gPerCup: 205 },
  { key: 'coconut-oil', name: 'Coconut oil (solid)', category: 'Fat', gPerCup: 218 },
  { key: 'lard', name: 'Lard', category: 'Fat', gPerCup: 205 },
  // Liquids
  { key: 'water', name: 'Water', category: 'Liquid', gPerCup: 237 },
  { key: 'olive-oil', name: 'Olive oil', category: 'Liquid', gPerCup: 216 },
  { key: 'vegetable-oil', name: 'Vegetable oil', category: 'Liquid', gPerCup: 218 },
  { key: 'sesame-oil', name: 'Sesame oil', category: 'Liquid', gPerCup: 218 },
  { key: 'soy-sauce', name: 'Soy sauce', category: 'Liquid', gPerCup: 252 },
  { key: 'vinegar', name: 'Vinegar', category: 'Liquid', gPerCup: 239 },
  { key: 'lemon-juice', name: 'Lemon juice', category: 'Liquid', gPerCup: 243 },
  { key: 'tomato-sauce', name: 'Tomato sauce', category: 'Liquid', gPerCup: 245 },
  { key: 'tomato-paste', name: 'Tomato paste', category: 'Liquid', gPerCup: 262 },
  // Dairy
  { key: 'milk', name: 'Milk (whole)', category: 'Dairy', gPerCup: 245 },
  { key: 'cream-heavy', name: 'Heavy cream', category: 'Dairy', gPerCup: 238 },
  { key: 'cream-sour', name: 'Sour cream', category: 'Dairy', gPerCup: 230 },
  { key: 'yogurt-plain', name: 'Yogurt (plain)', category: 'Dairy', gPerCup: 245 },
  { key: 'yogurt-greek', name: 'Greek yogurt', category: 'Dairy', gPerCup: 245 },
  { key: 'buttermilk', name: 'Buttermilk', category: 'Dairy', gPerCup: 245 },
  { key: 'coconut-milk', name: 'Coconut milk (canned)', category: 'Dairy', gPerCup: 226 },
  { key: 'cheese-shredded', name: 'Shredded cheese', category: 'Dairy', gPerCup: 113 },
  { key: 'parmesan-grated', name: 'Parmesan, grated', category: 'Dairy', gPerCup: 100 },
  { key: 'cream-cheese', name: 'Cream cheese', category: 'Dairy', gPerCup: 232 },
  // Grains
  { key: 'rice-uncooked', name: 'Rice (uncooked, long grain)', category: 'Grain', gPerCup: 200 },
  { key: 'rice-cooked', name: 'Rice (cooked)', category: 'Grain', gPerCup: 158 },
  { key: 'oats-rolled', name: 'Oats (rolled)', category: 'Grain', gPerCup: 85 },
  { key: 'oats-steel-cut', name: 'Oats (steel-cut, dry)', category: 'Grain', gPerCup: 160 },
  { key: 'quinoa-uncooked', name: 'Quinoa (uncooked)', category: 'Grain', gPerCup: 170 },
  { key: 'lentils-dried', name: 'Lentils (dried)', category: 'Grain', gPerCup: 192 },
  { key: 'pasta-dry', name: 'Pasta (dry, short shapes)', category: 'Grain', gPerCup: 105 },
  // Spices / Other
  { key: 'cocoa-powder', name: 'Cocoa powder', category: 'Spice/Other', gPerCup: 85 },
  { key: 'salt-table', name: 'Table salt', category: 'Spice/Other', gPerCup: 273 },
  { key: 'salt-kosher', name: 'Kosher salt (Diamond)', category: 'Spice/Other', gPerCup: 142 },
  { key: 'baking-powder', name: 'Baking powder', category: 'Spice/Other', gPerCup: 192 },
  { key: 'baking-soda', name: 'Baking soda', category: 'Spice/Other', gPerCup: 220 },
  { key: 'yeast-active-dry', name: 'Yeast (active dry)', category: 'Spice/Other', gPerCup: 144 },
  { key: 'cinnamon-ground', name: 'Cinnamon (ground)', category: 'Spice/Other', gPerCup: 124 },
  { key: 'breadcrumbs', name: 'Breadcrumbs (dry)', category: 'Spice/Other', gPerCup: 108 },
  // Nuts / Seeds
  { key: 'peanut-butter', name: 'Peanut butter', category: 'Nuts/Seeds', gPerCup: 258 },
  { key: 'almonds-whole', name: 'Almonds (whole)', category: 'Nuts/Seeds', gPerCup: 143 },
  { key: 'almonds-chopped', name: 'Almonds (chopped)', category: 'Nuts/Seeds', gPerCup: 120 },
  { key: 'walnuts-chopped', name: 'Walnuts (chopped)', category: 'Nuts/Seeds', gPerCup: 117 },
  { key: 'cashews', name: 'Cashews', category: 'Nuts/Seeds', gPerCup: 140 },
  { key: 'chia-seeds', name: 'Chia seeds', category: 'Nuts/Seeds', gPerCup: 170 },
  { key: 'flax-ground', name: 'Flaxseed (ground)', category: 'Nuts/Seeds', gPerCup: 130 },
  { key: 'sesame-seeds', name: 'Sesame seeds', category: 'Nuts/Seeds', gPerCup: 144 },
  { key: 'chocolate-chips', name: 'Chocolate chips', category: 'Nuts/Seeds', gPerCup: 175 },
];

// Volume units -> milliliters (cup = 236.588 ml US standard)
const VOLUME_TO_ML: Record<string, number> = {
  cup: 236.588,
  'tbsp (tablespoon)': 14.787,
  'tsp (teaspoon)': 4.929,
  ml: 1,
  liter: 1000,
  'fl-oz': 29.574,
};

// Weight units -> grams
const WEIGHT_TO_G: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

type Unit = keyof typeof VOLUME_TO_ML | keyof typeof WEIGHT_TO_G;

const ALL_UNITS: Unit[] = [
  'cup',
  'tbsp (tablespoon)',
  'tsp (teaspoon)',
  'ml',
  'liter',
  'fl-oz',
  'g',
  'kg',
  'oz',
  'lb',
];

function isVolume(u: Unit): boolean {
  return u in VOLUME_TO_ML;
}

const ML_PER_CUP = 236.588;

// Convert amount from `fromUnit` to `toUnit` given ingredient density (g per cup).
function convert(amount: number, fromUnit: Unit, toUnit: Unit, gPerCup: number): number {
  const gPerMl = gPerCup / ML_PER_CUP;
  let grams: number;
  if (isVolume(fromUnit)) {
    const ml = amount * (VOLUME_TO_ML[fromUnit] ?? 0);
    grams = ml * gPerMl;
  } else {
    grams = amount * (WEIGHT_TO_G[fromUnit] ?? 0);
  }
  if (isVolume(toUnit)) {
    const ml = grams / gPerMl;
    return ml / (VOLUME_TO_ML[toUnit] ?? 1);
  }
  return grams / (WEIGHT_TO_G[toUnit] ?? 1);
}

function formatNumber(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '0';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1000) return n.toFixed(0);
  if (abs >= 100) return n.toFixed(1);
  if (abs >= 10) return n.toFixed(2);
  if (abs >= 1) return n.toFixed(2);
  if (abs >= 0.01) return n.toFixed(3);
  return n.toPrecision(2);
}

export function UnitConverter() {
  const [search, setSearch] = useState('');
  const [ingredientKey, setIngredientKey] = useState<string>('ap-flour');
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit>('cup');
  const [toUnit, setToUnit] = useState<Unit>('g');
  const [copied, setCopied] = useState(false);

  const ingredient = useMemo(
    () => INGREDIENTS.find((i) => i.key === ingredientKey) ?? INGREDIENTS[0]!,
    [ingredientKey],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INGREDIENTS;
    return INGREDIENTS.filter(
      (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
    );
  }, [search]);

  const result = useMemo(() => {
    const n = parseFloat(fromAmount);
    if (!isFinite(n)) return 0;
    return convert(n, fromUnit, toUnit, ingredient.gPerCup);
  }, [fromAmount, fromUnit, toUnit, ingredient]);

  function swap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromAmount(formatNumber(result));
  }

  async function copyResult() {
    const text = `${fromAmount} ${fromUnit} ${ingredient.name} = ${formatNumber(result)} ${toUnit}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  // Persist last picks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('rc:converter');
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s.ingredientKey) setIngredientKey(s.ingredientKey);
        if (s.fromUnit) setFromUnit(s.fromUnit);
        if (s.toUnit) setToUnit(s.toUnit);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'rc:converter',
      JSON.stringify({ ingredientKey, fromUnit, toUnit }),
    );
  }, [ingredientKey, fromUnit, toUnit]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
      {/* Ingredient picker */}
      <aside className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-serif text-lg">Pick an ingredient</h2>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
          <Input
            type="search"
            placeholder="Search 60+ ingredients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            aria-label="Search ingredients"
          />
        </div>
        <ul className="mt-3 max-h-[420px] divide-y divide-ink/5 overflow-y-auto rounded-md border border-ink/10 bg-cream-50">
          {filtered.length === 0 ? (
            <li className="px-3 py-3 text-sm text-ink-muted">No matches. Try a broader term.</li>
          ) : (
            filtered.map((i) => (
              <li key={i.key}>
                <button
                  type="button"
                  onClick={() => setIngredientKey(i.key)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-cream-100 ${
                    i.key === ingredientKey ? 'bg-terracotta-50 font-semibold text-terracotta-700' : 'text-ink'
                  }`}
                >
                  <span className="truncate">{i.name}</span>
                  <span className="shrink-0 text-xs text-ink-subtle">{i.gPerCup} g/cup</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <p className="mt-3 text-xs text-ink-subtle">
          {filtered.length} of {INGREDIENTS.length} ingredients
        </p>
      </aside>

      {/* Converter */}
      <section className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Converting
            </p>
            <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink">
              {ingredient.gPerCup} g per cup
            </span>
          </div>
          <h3 className="mt-2 font-serif text-2xl text-ink">{ingredient.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-wider text-ink-subtle">{ingredient.category}</p>

          {/* From row */}
          <div className="mt-6 grid gap-3 sm:grid-cols-[2fr,1.5fr]">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">From</span>
              <Input
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="mt-1 text-lg font-bold"
                aria-label="Amount to convert"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Unit</span>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as Unit)}
                className="mt-1 h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-sm"
                aria-label="Source unit"
              >
                {ALL_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="my-4 flex justify-center">
            <Button type="button" variant="outline" size="sm" onClick={swap} aria-label="Swap units">
              <ArrowLeftRight className="mr-2 h-4 w-4" /> Swap
            </Button>
          </div>

          {/* To row */}
          <div className="grid gap-3 sm:grid-cols-[2fr,1.5fr]">
            <div className="flex h-[68px] items-end">
              <div className="w-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Result</span>
                <p className="mt-1 break-words font-serif text-3xl font-bold text-terracotta-500">
                  {formatNumber(result)}
                </p>
              </div>
            </div>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Unit</span>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as Unit)}
                className="mt-1 h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-sm"
                aria-label="Target unit"
              >
                {ALL_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={copyResult}>
              {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy result'}
            </Button>
            <p className="text-xs text-ink-subtle">
              {fromAmount} {fromUnit} = {formatNumber(result)} {toUnit}
            </p>
          </div>
        </div>

        {/* Quick conversions for selected ingredient */}
        <div className="rounded-2xl bg-cream-100 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-600">
            Quick reference for {ingredient.name.toLowerCase()}
          </p>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            {[
              { from: 0.25, fromU: 'cup' as Unit, label: '¼ cup' },
              { from: 0.5, fromU: 'cup' as Unit, label: '½ cup' },
              { from: 1, fromU: 'cup' as Unit, label: '1 cup' },
              { from: 2, fromU: 'cup' as Unit, label: '2 cups' },
              { from: 1, fromU: 'tbsp (tablespoon)' as Unit, label: '1 tbsp' },
              { from: 1, fromU: 'tsp (teaspoon)' as Unit, label: '1 tsp' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 shadow-sm">
                <span className="text-ink-muted">{row.label}</span>
                <span className="font-mono text-sm font-bold text-ink">
                  {formatNumber(convert(row.from, row.fromU, 'g', ingredient.gPerCup))} g
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
