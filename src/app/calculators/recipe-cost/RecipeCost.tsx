'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Trash2, Save, Copy, Check, RotateCcw, AlertTriangle, FolderOpen,
  Printer, DollarSign, PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PriceMode = 'per-unit' | 'per-pack';

type Ingredient = {
  id: string;
  name: string;
  qty: string;
  unit: string;
  priceMode: PriceMode;
  unitPrice: string;   // used when priceMode = per-unit
  packPrice: string;   // used when priceMode = per-pack
  packSize: string;    // pack qty in same unit as qty (e.g. 1000 g flour bag)
  staple: boolean;
};

type SavedRecipe = {
  id: string;
  title: string;
  servings: number;
  currency: string;
  ingredients: Ingredient[];
  savedAt: number;
};

const CURRENCIES = ['$', '£', '€', '¥', '₹', '₦', '₱', 'R$', 'kr', 'CHF'];

const STORAGE_KEY = 'rc:recipe-cost:current';
const SAVED_KEY = 'rc:recipe-cost:saved';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function parseN(raw: string): number {
  const n = parseFloat(raw);
  return isFinite(n) ? n : NaN;
}

function fmtMoney(n: number): string {
  if (!isFinite(n) || n < 0) return '0.00';
  if (n < 10) return n.toFixed(2);
  if (n < 1000) return n.toFixed(2);
  return n.toFixed(2);
}

const EXAMPLE: Ingredient[] = [
  { id: uid(), name: 'Bone-in chicken thighs', qty: '900', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '7.50', packSize: '900', staple: false },
  { id: uid(), name: 'Yellow onion, diced', qty: '300', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '1.80', packSize: '1000', staple: false },
  { id: uid(), name: 'Garlic, minced', qty: '15', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '2.40', packSize: '150', staple: false },
  { id: uid(), name: 'Canned plum tomatoes', qty: '800', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '1.95', packSize: '800', staple: false },
  { id: uid(), name: 'Long-grain rice', qty: '400', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '3.20', packSize: '1000', staple: false },
  { id: uid(), name: 'Olive oil', qty: '30', unit: 'ml', priceMode: 'per-pack', unitPrice: '', packPrice: '8.50', packSize: '750', staple: false },
  { id: uid(), name: 'Kosher salt', qty: '8', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '3.20', packSize: '737', staple: true },
  { id: uid(), name: 'Black pepper', qty: '2', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '5.50', packSize: '50', staple: true },
  { id: uid(), name: 'Paprika', qty: '3', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '4.20', packSize: '45', staple: true },
];

const UNITS = ['g', 'kg', 'ml', 'l', 'oz', 'lb', 'cup', 'tbsp', 'tsp', 'whole', 'slice', 'each'];

function lineCost(ing: Ingredient): number {
  const qty = parseN(ing.qty);
  if (!isFinite(qty) || qty <= 0) return 0;
  if (ing.priceMode === 'per-unit') {
    const p = parseN(ing.unitPrice);
    return isFinite(p) ? qty * p : 0;
  }
  const packPrice = parseN(ing.packPrice);
  const packSize = parseN(ing.packSize);
  if (!isFinite(packPrice) || !isFinite(packSize) || packSize <= 0) return 0;
  return (qty / packSize) * packPrice;
}

export function RecipeCost() {
  const [title, setTitle] = useState('Family-style chicken & rice');
  const [servings, setServings] = useState('4');
  const [currency, setCurrency] = useState('$');
  const [ingredients, setIngredients] = useState<Ingredient[]>(EXAMPLE);
  const [copied, setCopied] = useState(false);
  const [savedList, setSavedList] = useState<SavedRecipe[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Restore
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.title) setTitle(s.title);
        if (s.servings) setServings(s.servings);
        if (s.currency) setCurrency(s.currency);
        if (Array.isArray(s.ingredients) && s.ingredients.length) setIngredients(s.ingredients);
      }
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) setSavedList(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, servings, currency, ingredients }));
  }, [title, servings, currency, ingredients]);

  const servingsN = useMemo(() => {
    const n = parseFloat(servings);
    return isFinite(n) && n > 0 ? n : 1;
  }, [servings]);

  const computed = useMemo(() => {
    const rows = ingredients.map((i) => {
      const c = lineCost(i);
      return { id: i.id, name: i.name, cost: c, staple: i.staple };
    });
    const billable = rows.filter((r) => !r.staple);
    const stapleCost = rows.filter((r) => r.staple).reduce((s, r) => s + r.cost, 0);
    const billableTotal = billable.reduce((s, r) => s + r.cost, 0);
    const total = billableTotal + stapleCost;
    return { rows, billableTotal, stapleCost, total };
  }, [ingredients]);

  const perServing = computed.billableTotal / servingsN;

  function updateIng(id: string, patch: Partial<Ingredient>) {
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function addRow() {
    setIngredients((prev) => [
      ...prev,
      { id: uid(), name: '', qty: '', unit: 'g', priceMode: 'per-pack', unitPrice: '', packPrice: '', packSize: '', staple: false },
    ]);
  }

  function removeRow(id: string) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  function resetAll() {
    setTitle('Family-style chicken & rice');
    setServings('4');
    setCurrency('$');
    setIngredients(EXAMPLE);
  }

  function saveRecipe() {
    const rec: SavedRecipe = {
      id: uid(),
      title: title || 'Untitled recipe',
      servings: servingsN,
      currency,
      ingredients,
      savedAt: Date.now(),
    };
    const next = [rec, ...savedList].slice(0, 30);
    setSavedList(next);
    if (typeof window !== 'undefined') localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  }

  function loadRecipe(r: SavedRecipe) {
    setTitle(r.title);
    setServings(String(r.servings));
    setCurrency(r.currency);
    setIngredients(r.ingredients);
    setShowSaved(false);
  }

  function deleteSaved(id: string) {
    const next = savedList.filter((r) => r.id !== id);
    setSavedList(next);
    if (typeof window !== 'undefined') localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }

  function copyAll() {
    const lines = [
      `${title} — ${servingsN} servings`,
      '',
      ...ingredients.map((i) => {
        const c = lineCost(i);
        const flag = i.staple ? ' [pantry staple]' : '';
        return `${i.qty} ${i.unit} ${i.name}${flag} — ${currency}${fmtMoney(c)}`;
      }),
      '',
      `Total cost: ${currency}${fmtMoney(computed.total)}`,
      `Per serving: ${currency}${fmtMoney(perServing)}`,
      `(Pantry staples ${currency}${fmtMoney(computed.stapleCost)} included in total but excluded from per-serving figure.)`,
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  function printPage() {
    if (typeof window !== 'undefined') window.print();
  }

  // Cost breakdown bars
  const breakdown = useMemo(() => {
    const filtered = computed.rows.filter((r) => r.cost > 0);
    return filtered
      .map((r) => ({
        ...r,
        pct: computed.total > 0 ? (r.cost / computed.total) * 100 : 0,
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [computed]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      {/* INPUT */}
      <section className="space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Recipe details
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowSaved((v) => !v)} aria-pressed={showSaved}>
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
                        {r.title} <span className="text-xs text-ink-subtle">· {r.servings} srv · {r.currency}</span>
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

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,110px,110px]">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                Recipe title
              </span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sunday chicken" className="mt-1 h-11" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                Servings
              </span>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                value={servings}
                onChange={(e) => setServings(e.target.value)}
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
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Ingredients ({ingredients.length})
            </p>
            <Button type="button" size="sm" onClick={addRow}>
              <Plus className="mr-1.5 h-4 w-4" /> Add
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {ingredients.map((ing) => {
              const c = lineCost(ing);
              return (
                <div
                  key={ing.id}
                  className={`rounded-xl border border-ink/10 p-3 ${
                    ing.staple ? 'bg-cream-50' : 'bg-white'
                  }`}
                >
                  <div className="grid gap-2 sm:grid-cols-[1fr,90px,80px]">
                    <Input
                      value={ing.name}
                      onChange={(e) => updateIng(ing.id, { name: e.target.value })}
                      placeholder="Ingredient name"
                      aria-label="Ingredient name"
                      className="h-10"
                    />
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={ing.qty}
                      onChange={(e) => updateIng(ing.id, { qty: e.target.value })}
                      placeholder="Qty"
                      aria-label="Quantity"
                      className="h-10"
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) => updateIng(ing.id, { unit: e.target.value })}
                      className="h-10 rounded-md border border-ink/15 bg-white px-2 text-sm"
                      aria-label="Unit"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-2 grid gap-2 sm:grid-cols-[110px,1fr,auto]">
                    <div className="flex rounded-md border border-ink/15 bg-cream-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateIng(ing.id, { priceMode: 'per-pack' })}
                        aria-pressed={ing.priceMode === 'per-pack'}
                        className={`flex-1 rounded-sm text-[11px] font-bold transition-colors ${
                          ing.priceMode === 'per-pack' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'
                        }`}
                      >
                        Per pack
                      </button>
                      <button
                        type="button"
                        onClick={() => updateIng(ing.id, { priceMode: 'per-unit' })}
                        aria-pressed={ing.priceMode === 'per-unit'}
                        className={`flex-1 rounded-sm text-[11px] font-bold transition-colors ${
                          ing.priceMode === 'per-unit' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'
                        }`}
                      >
                        Per unit
                      </button>
                    </div>

                    {ing.priceMode === 'per-pack' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                            Pack price ({currency})
                          </span>
                          <Input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            value={ing.packPrice}
                            onChange={(e) => updateIng(ing.id, { packPrice: e.target.value })}
                            placeholder="3.50"
                            aria-label="Pack price"
                            className="h-9 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                            Pack size ({ing.unit})
                          </span>
                          <Input
                            type="number"
                            inputMode="decimal"
                            step="1"
                            value={ing.packSize}
                            onChange={(e) => updateIng(ing.id, { packSize: e.target.value })}
                            placeholder="1000"
                            aria-label="Pack size"
                            className="h-9 text-sm"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                          Price per {ing.unit} ({currency})
                        </span>
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="0.001"
                          value={ing.unitPrice}
                          onChange={(e) => updateIng(ing.id, { unitPrice: e.target.value })}
                          placeholder="0.015"
                          aria-label="Price per unit"
                          className="h-9 text-sm"
                        />
                      </label>
                    )}

                    <button
                      type="button"
                      onClick={() => removeRow(ing.id)}
                      className="flex h-9 w-9 items-center justify-center self-end rounded-md text-ink-subtle hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <label className="flex cursor-pointer items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={ing.staple}
                        onChange={(e) => updateIng(ing.id, { staple: e.target.checked })}
                        className="h-3.5 w-3.5 rounded border-ink/30 text-terracotta-500"
                      />
                      <span className="text-ink-muted">Pantry staple (excluded from per-serving cost)</span>
                    </label>
                    <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-[11px] font-bold text-ink">
                      Line cost: {currency}{fmtMoney(c)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-[11px] text-ink-subtle">
            <strong>Per pack</strong>: enter what you paid for the whole pack and the pack size. The
            calculator works out the unit cost for you.{' '}
            <strong>Per unit</strong>: enter the price for one unit directly (e.g. ${'{currency}'}0.015 per gram).
          </p>
        </div>
      </section>

      {/* OUTPUT */}
      <section className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-forest-50 via-cream-50 to-terracotta-50 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-forest-700" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">
              Cost summary
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-ink-subtle">Total cost</p>
              <p className="mt-1 font-serif text-2xl font-bold text-ink">
                {currency}{fmtMoney(computed.total)}
              </p>
            </div>
            <div className="rounded-xl bg-forest-100 p-3 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-forest-700">Per serving</p>
              <p className="mt-1 font-serif text-2xl font-bold text-forest-700">
                {currency}{fmtMoney(perServing)}
              </p>
              <p className="text-[10px] text-forest-700/70">{servingsN} servings</p>
            </div>
          </div>
          {computed.stapleCost > 0 ? (
            <p className="mt-3 text-[11px] text-ink-subtle">
              Pantry staples contribute {currency}{fmtMoney(computed.stapleCost)} to the total but
              are excluded from per-serving cost — staples come from your existing pantry, not a
              fresh shop.
            </p>
          ) : null}
        </div>

        {breakdown.length > 0 ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-terracotta-500" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
                Where the money goes
              </p>
            </div>
            <ul className="mt-3 space-y-2.5">
              {breakdown.slice(0, 10).map((b) => (
                <li key={b.id}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className={`truncate ${b.staple ? 'text-ink-muted italic' : 'text-ink'}`}>
                      {b.name || '(unnamed)'}
                    </span>
                    <span className="shrink-0 font-bold">
                      {currency}{fmtMoney(b.cost)}{' '}
                      <span className="text-xs font-normal text-ink-subtle">
                        · {b.pct.toFixed(0)}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream-100">
                    <div
                      className={`h-full rounded-full ${
                        b.staple ? 'bg-ink/30' : 'bg-terracotta-400'
                      }`}
                      style={{ width: `${Math.min(100, b.pct)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            {breakdown.length > 10 ? (
              <p className="mt-2 text-[11px] text-ink-subtle">
                + {breakdown.length - 10} more rows
              </p>
            ) : null}
          </div>
        ) : null}

        {computed.total === 0 ? (
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
              <p className="text-sm text-amber-900">
                Add quantity and price information to see cost breakdown.
              </p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={copyAll}>
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={printPage}>
            <Printer className="mr-1.5 h-4 w-4" /> Print
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
