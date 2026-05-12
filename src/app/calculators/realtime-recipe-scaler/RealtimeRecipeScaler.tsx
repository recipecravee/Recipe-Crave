'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Trash2, Save, Download, Copy, Check, RotateCcw, AlertTriangle, Sliders, FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Unit =
  | 'cup' | 'tbsp' | 'tsp' | 'ml' | 'l'
  | 'oz' | 'fl-oz' | 'g' | 'kg' | 'lb'
  | 'pinch' | 'dash' | 'whole' | 'slice' | 'clove' | '';

const UNITS: { value: Unit; label: string; whole?: boolean; pass?: boolean }[] = [
  { value: '', label: '(none)' },
  { value: 'cup', label: 'cup' },
  { value: 'tbsp', label: 'tbsp' },
  { value: 'tsp', label: 'tsp' },
  { value: 'ml', label: 'ml' },
  { value: 'l', label: 'l' },
  { value: 'fl-oz', label: 'fl oz' },
  { value: 'oz', label: 'oz' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
  { value: 'whole', label: 'whole', whole: true },
  { value: 'slice', label: 'slice', whole: true },
  { value: 'clove', label: 'clove', whole: true },
  { value: 'pinch', label: 'pinch', pass: true },
  { value: 'dash', label: 'dash', pass: true },
];

type Ingredient = {
  id: string;
  qty: string;
  unit: Unit;
  name: string;
  cost: string; // optional per-line cost
};

type SavedRecipe = {
  id: string;
  title: string;
  servings: number;
  totalCost: string;
  currency: string;
  ingredients: Ingredient[];
  savedAt: number;
};

const CURRENCIES = ['$', '£', '€', '¥', '₹', '₦', '₱', 'R$', 'kr', 'CHF'];

const STORAGE_KEY = 'rc:scaler:current';
const SAVED_KEY = 'rc:scaler:saved';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function parseQty(raw: string): number {
  const s = raw.trim();
  if (!s) return NaN;
  // fraction like "1/2" or "1 1/2"
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    return parseInt(mixed[1]!) + parseInt(mixed[2]!) / parseInt(mixed[3]!);
  }
  const frac = s.match(/^(\d+)\/(\d+)$/);
  if (frac) {
    return parseInt(frac[1]!) / parseInt(frac[2]!);
  }
  const n = parseFloat(s);
  return isFinite(n) ? n : NaN;
}

function formatQty(n: number, isWhole: boolean): string {
  if (!isFinite(n)) return '—';
  if (isWhole) {
    return Math.ceil(n).toString();
  }
  // Show fractions for common values
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return rounded.toString();
  // Try to express as common fraction
  const denoms = [2, 3, 4, 8];
  for (const d of denoms) {
    const num = Math.round(rounded * d);
    if (Math.abs(num / d - rounded) < 0.01 && num !== 0) {
      const whole = Math.floor(num / d);
      const rem = num % d;
      if (whole === 0) return `${rem}/${d}`;
      if (rem === 0) return whole.toString();
      return `${whole} ${rem}/${d}`;
    }
  }
  return rounded.toString();
}

function isToTaste(name: string): boolean {
  return /to taste|as needed|optional/i.test(name);
}

const EXAMPLE: Ingredient[] = [
  { id: uid(), qty: '2', unit: 'cup', name: 'all-purpose flour', cost: '0.40' },
  { id: uid(), qty: '1', unit: 'tsp', name: 'baking powder', cost: '0.05' },
  { id: uid(), qty: '1/2', unit: 'tsp', name: 'salt', cost: '0.02' },
  { id: uid(), qty: '3/4', unit: 'cup', name: 'sugar', cost: '0.30' },
  { id: uid(), qty: '2', unit: 'whole', name: 'eggs', cost: '0.50' },
  { id: uid(), qty: '1', unit: 'cup', name: 'milk', cost: '0.40' },
  { id: uid(), qty: '1/3', unit: 'cup', name: 'butter, melted', cost: '0.60' },
  { id: uid(), qty: '', unit: '', name: 'pinch of cinnamon (to taste)', cost: '' },
];

export function RealtimeRecipeScaler() {
  const [title, setTitle] = useState('Fluffy Pancakes');
  const [origServings, setOrigServings] = useState('4');
  const [desiredServings, setDesiredServings] = useState(4);
  const [totalCost, setTotalCost] = useState('');
  const [currency, setCurrency] = useState('$');
  const [ingredients, setIngredients] = useState<Ingredient[]>(EXAMPLE);
  const [copied, setCopied] = useState(false);
  const [savedList, setSavedList] = useState<SavedRecipe[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [therapeuticMode, setTherapeuticMode] = useState(false);

  // Load current state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.title) setTitle(s.title);
        if (s.origServings) setOrigServings(s.origServings);
        if (typeof s.desiredServings === 'number') setDesiredServings(s.desiredServings);
        if (s.totalCost) setTotalCost(s.totalCost);
        if (s.currency) setCurrency(s.currency);
        if (Array.isArray(s.ingredients) && s.ingredients.length) setIngredients(s.ingredients);
      }
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) setSavedList(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist current state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ title, origServings, desiredServings, totalCost, currency, ingredients }),
    );
  }, [title, origServings, desiredServings, totalCost, currency, ingredients]);

  const origN = useMemo(() => {
    const n = parseFloat(origServings);
    return isFinite(n) && n > 0 ? n : 1;
  }, [origServings]);

  const ratio = useMemo(() => desiredServings / origN, [desiredServings, origN]);

  const ingredientLineCost = useMemo(() => {
    return ingredients.reduce((sum, ing) => {
      const c = parseFloat(ing.cost);
      return isFinite(c) ? sum + c : sum;
    }, 0);
  }, [ingredients]);

  const baseTotal = useMemo(() => {
    const tc = parseFloat(totalCost);
    if (isFinite(tc) && tc > 0) return tc;
    return ingredientLineCost;
  }, [totalCost, ingredientLineCost]);

  const scaledTotal = useMemo(() => baseTotal * ratio, [baseTotal, ratio]);
  const costPerServing = useMemo(
    () => (desiredServings > 0 ? scaledTotal / desiredServings : 0),
    [scaledTotal, desiredServings],
  );

  const ratioPct = Math.round(ratio * 100);
  const extreme = ratio > 3 || ratio < 0.5;

  function updateIng(id: string, patch: Partial<Ingredient>) {
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function addRow() {
    setIngredients((prev) => [...prev, { id: uid(), qty: '', unit: '', name: '', cost: '' }]);
  }

  function removeRow(id: string) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  function resetAll() {
    setTitle('Fluffy Pancakes');
    setOrigServings('4');
    setDesiredServings(4);
    setTotalCost('');
    setCurrency('$');
    setIngredients(EXAMPLE);
  }

  function saveRecipe() {
    const rec: SavedRecipe = {
      id: uid(),
      title: title || 'Untitled recipe',
      servings: origN,
      totalCost,
      currency,
      ingredients,
      savedAt: Date.now(),
    };
    const next = [rec, ...savedList].slice(0, 30);
    setSavedList(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  }

  function loadRecipe(r: SavedRecipe) {
    setTitle(r.title);
    setOrigServings(String(r.servings));
    setDesiredServings(r.servings);
    setTotalCost(r.totalCost);
    setCurrency(r.currency);
    setIngredients(r.ingredients);
    setShowSaved(false);
  }

  function deleteSaved(id: string) {
    const next = savedList.filter((r) => r.id !== id);
    setSavedList(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    }
  }

  // Detect therapeutic herbs (turmeric, ginger, cinnamon, etc.) so the
  // "therapeutic mode" toggle can boost their dose 2x and surface a flavor-
  // balance hint. Match against herb name and common cooking-name variants.
  function detectTherapeuticHerb(name: string): string | null {
    const text = name.toLowerCase();
    const map: Array<[string, RegExp]> = [
      ['turmeric', /\bturmeric\b/i],
      ['ginger', /\bginger\b/i],
      ['cinnamon', /\bcinnamon\b/i],
      ['garlic', /\bgarlic\b/i],
      ['black pepper', /\bblack pepper\b|\bpeppercorn\b/i],
      ['cayenne', /\bcayenne\b/i],
      ['fenugreek', /\bfenugreek\b/i],
      ['ashwagandha', /\bashwagandha\b/i],
      ['cumin', /\bcumin\b/i],
      ['cardamom', /\bcardamom\b/i],
      ['clove', /\bcloves?\b/i],
      ['rosemary', /\brosemary\b/i],
      ['thyme', /\bthyme\b/i],
      ['sage', /\bsage\b/i],
      ['oregano', /\boregano\b/i],
      ['basil', /\bbasil\b/i],
      ['fennel', /\bfennel\b/i],
      ['hibiscus', /\bhibiscus\b/i],
    ];
    for (const [herbName, rx] of map) {
      if (rx.test(text)) return herbName;
    }
    return null;
  }

  function scaledLine(ing: Ingredient): { qty: string; unitLabel: string; name: string; passthrough: boolean; therapeutic?: boolean } {
    const meta = UNITS.find((u) => u.value === ing.unit);
    const unitLabel = meta?.label ?? '';
    const passthrough = isToTaste(ing.name) || meta?.pass === true || !ing.qty;
    if (passthrough) return { qty: ing.qty || '', unitLabel, name: ing.name, passthrough: true };
    const q = parseQty(ing.qty);
    if (!isFinite(q)) return { qty: ing.qty, unitLabel, name: ing.name, passthrough: true };
    // Therapeutic mode: matched herbs get 2× multiplier on top of the
    // servings ratio. This pushes culinary doses (e.g. 1/2 tsp turmeric)
    // into the therapeutic window (1-2 tsp).
    const isTherapeuticHerb = therapeuticMode && detectTherapeuticHerb(ing.name) !== null;
    const dose = isTherapeuticHerb ? q * 2 : q;
    const scaled = dose * ratio;
    return {
      qty: formatQty(scaled, meta?.whole === true),
      unitLabel,
      name: ing.name,
      passthrough: false,
      therapeutic: isTherapeuticHerb,
    };
  }

  // Detect any therapeutic herbs in the current ingredient list so the
  // flavor-balance hint at the bottom of the output knows what was scaled up.
  const scaledHerbs = useMemo(
    () =>
      therapeuticMode
        ? ingredients
            .map((i) => detectTherapeuticHerb(i.name))
            .filter((s): s is string => Boolean(s))
        : [],
    [ingredients, therapeuticMode],
  );

  async function copyAll() {
    const lines = ingredients
      .filter((i) => i.name.trim())
      .map((i) => {
        const s = scaledLine(i);
        return [s.qty, s.unitLabel, s.name].filter(Boolean).join(' ');
      });
    const txt = [
      `${title} — ${desiredServings} servings`,
      '',
      ...lines,
      '',
      `Total: ${currency}${scaledTotal.toFixed(2)} (${currency}${costPerServing.toFixed(2)} per serving)`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function printRecipe() {
    if (typeof window !== 'undefined') window.print();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
      {/* INPUT panel */}
      <section className="space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Recipe details
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSaved((v) => !v)}
                aria-pressed={showSaved}
              >
                <FolderOpen className="mr-1.5 h-4 w-4" /> Saved ({savedList.length})
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={resetAll}>
                <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          {showSaved ? (
            <div className="mt-4 rounded-xl border border-ink/10 bg-cream-50 p-3">
              {savedList.length === 0 ? (
                <p className="text-sm text-ink-muted">No saved recipes yet.</p>
              ) : (
                <ul className="space-y-2">
                  {savedList.map((r) => (
                    <li key={r.id} className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                      <button
                        type="button"
                        onClick={() => loadRecipe(r)}
                        className="flex-1 truncate text-left text-sm font-medium text-ink hover:text-terracotta-500"
                      >
                        {r.title} <span className="text-xs text-ink-subtle">· {r.servings} srv</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSaved(r.id)}
                        className="rounded-md p-1 text-ink-subtle hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete saved"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,140px,140px]">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                Recipe title
              </span>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Fluffy pancakes"
                className="mt-1 h-11"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                Original servings
              </span>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                value={origServings}
                onChange={(e) => setOrigServings(e.target.value)}
                className="mt-1 h-11"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                Currency
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-base"
                aria-label="Currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-3 block">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Total recipe cost (optional — overrides sum of line costs)
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-bold text-ink-muted">{currency}</span>
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="e.g. 2.27"
                className="h-11 flex-1"
              />
            </div>
            <p className="mt-1 text-xs text-ink-subtle">
              Leave blank to auto-sum the per-ingredient costs below.
            </p>
          </label>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Ingredients ({ingredients.length})
            </p>
            <Button type="button" size="sm" onClick={addRow}>
              <Plus className="mr-1.5 h-4 w-4" /> Add ingredient
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            <div className="hidden gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-ink-subtle sm:grid sm:grid-cols-[80px,90px,1fr,90px,32px]">
              <span>Qty</span>
              <span>Unit</span>
              <span>Ingredient</span>
              <span>Cost ({currency})</span>
              <span />
            </div>
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="grid gap-2 rounded-lg border border-ink/10 bg-cream-50 p-2 sm:grid-cols-[80px,90px,1fr,90px,32px] sm:items-center sm:border-transparent sm:bg-transparent sm:p-0"
              >
                <Input
                  value={ing.qty}
                  onChange={(e) => updateIng(ing.id, { qty: e.target.value })}
                  placeholder="2"
                  aria-label="Quantity"
                  className="h-10"
                />
                <select
                  value={ing.unit}
                  onChange={(e) => updateIng(ing.id, { unit: e.target.value as Unit })}
                  className="h-10 rounded-md border border-ink/15 bg-white px-2 text-sm"
                  aria-label="Unit"
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
                <Input
                  value={ing.name}
                  onChange={(e) => updateIng(ing.id, { name: e.target.value })}
                  placeholder="flour"
                  aria-label="Ingredient name"
                  className="h-10"
                />
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={ing.cost}
                  onChange={(e) => updateIng(ing.id, { cost: e.target.value })}
                  placeholder="0.00"
                  aria-label="Cost"
                  className="h-10"
                />
                <button
                  type="button"
                  onClick={() => removeRow(ing.id)}
                  className="flex h-10 w-8 items-center justify-center rounded-md text-ink-subtle hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove ingredient"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-ink-subtle">
            Tip: type fractions like <code className="rounded bg-cream-100 px-1">1/2</code> or{' '}
            <code className="rounded bg-cream-100 px-1">1 1/4</code>. Use unit{' '}
            <strong>whole</strong> for eggs (rounds up). Write &quot;to taste&quot; in the name and
            it passes through unscaled.
          </p>
        </div>
      </section>

      {/* OUTPUT panel */}
      <section className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 to-cream-100 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-terracotta-500" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Scale to servings
            </p>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <p className="font-serif text-5xl font-bold text-ink">{desiredServings}</p>
            <p className="text-sm text-ink-muted">
              from {origN} ({ratioPct}%)
            </p>
          </div>

          <input
            type="range"
            min={1}
            max={48}
            step={1}
            value={desiredServings}
            onChange={(e) => setDesiredServings(parseInt(e.target.value))}
            className="mt-4 w-full accent-terracotta-500"
            aria-label="Desired servings"
          />
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-ink-subtle">
            <span>1</span><span>12</span><span>24</span><span>36</span><span>48</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[1, 2, 4, 6, 8, 12, 24].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setDesiredServings(n)}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                  desiredServings === n
                    ? 'border-terracotta-500 bg-terracotta-500 text-white'
                    : 'border-ink/10 bg-white text-ink hover:border-terracotta-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {extreme ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
              <p>
                Scaling to {ratioPct}% is extreme. Cook times, pan size, and seasoning will need
                manual adjustment. Baking recipes especially.
              </p>
            </div>
          ) : null}

          {/* Therapeutic-dose mode toggle */}
          <div className="mt-4 rounded-xl bg-forest-50 p-3 ring-1 ring-forest-200">
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={therapeuticMode}
                onChange={(e) => setTherapeuticMode(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-forest-300 text-forest-600 focus:ring-forest-400"
              />
              <span>
                <span className="block font-bold text-forest-800">Therapeutic-dose mode</span>
                <span className="block text-xs text-ink-muted">
                  Doubles the quantity of any therapeutic herb in this recipe
                  (turmeric, ginger, cinnamon, etc.) to push culinary dose into
                  the therapeutic window. Flag any scaled herbs in the result.
                </span>
              </span>
            </label>
            {therapeuticMode && scaledHerbs.length > 0 ? (
              <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-ink">
                Doubled herbs detected: <strong>{[...new Set(scaledHerbs)].join(', ')}</strong>.
                <br />
                <span className="text-ink-muted">
                  Flavor balance: add an extra squeeze of lemon or 1/2 tsp honey
                  to balance the more-earthy herb profile. See our{' '}
                  <a href="/safety-check" className="font-bold text-amber-700 hover:underline">
                    safety checker
                  </a>{' '}
                  before going therapeutic if you take medications.
                </span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600">
            Cost breakdown
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-cream-100 p-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-subtle">Total scaled</p>
              <p className="mt-1 font-serif text-2xl font-bold text-ink">
                {currency}{scaledTotal.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-forest-50 p-3">
              <p className="text-[10px] uppercase tracking-wider text-forest-700">Per serving</p>
              <p className="mt-1 font-serif text-2xl font-bold text-forest-700">
                {currency}{costPerServing.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-ink-subtle">
            Base recipe: {currency}{baseTotal.toFixed(2)}{' '}
            {parseFloat(totalCost) > 0 ? '(manual total)' : '(sum of line costs)'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600">
            Scaled ingredients
          </p>
          <ul className="mt-3 space-y-1.5">
            {ingredients
              .filter((i) => i.name.trim())
              .map((i) => {
                const s = scaledLine(i);
                return (
                  <li key={i.id} className="flex items-baseline gap-2 text-sm">
                    <span className="min-w-[3.5rem] font-bold text-ink">
                      {s.qty}
                      {s.unitLabel ? <span className="font-normal text-ink-muted"> {s.unitLabel}</span> : null}
                    </span>
                    <span className="text-ink-muted">{s.name}</span>
                    {s.passthrough && i.name.trim() ? (
                      <span className="text-[10px] uppercase text-ink-subtle">· as written</span>
                    ) : null}
                    {s.therapeutic ? (
                      <span className="rounded-full bg-forest-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-forest-700">
                        2× therapeutic
                      </span>
                    ) : null}
                  </li>
                );
              })}
            {ingredients.filter((i) => i.name.trim()).length === 0 ? (
              <li className="text-sm text-ink-subtle">Add ingredients on the left.</li>
            ) : null}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={copyAll}>
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={printRecipe}>
            <Download className="mr-1.5 h-4 w-4" /> Print / PDF
          </Button>
        </div>
        <Button type="button" size="sm" onClick={saveRecipe} className="w-full">
          <Save className="mr-1.5 h-4 w-4" />
          {savedToast ? 'Saved!' : 'Save recipe'}
        </Button>
      </section>
    </div>
  );
}
