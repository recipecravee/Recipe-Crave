'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Plus, Trash2, Copy, Check, Printer, RotateCcw, Flame, AlertTriangle, Search,
  X, Save, FolderOpen, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CALORIE_TABLE, UNIT_OPTIONS, searchFoods, computeLine, toGrams,
  type FoodNutrition, type UnitKey, type LineNutrition,
} from '@/content/calorie-data';

type Line = {
  id: string;
  query: string;
  matchedSlug: string | null;
  qty: string;
  unit: UnitKey;
  manualKcal: string;     // optional override per 100 g
  manualProtein: string;
  manualCarb: string;
  manualFat: string;
};

type SavedRecipe = {
  id: string;
  title: string;
  servings: number;
  lines: Line[];
  savedAt: number;
};

const STORAGE_KEY = 'rc:calorie:current';
const SAVED_KEY = 'rc:calorie:saved';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

const EXAMPLE: Line[] = [
  { id: uid(), query: 'Chicken breast, cooked', matchedSlug: 'chicken-breast-cooked', qty: '400', unit: 'g', manualKcal: '', manualProtein: '', manualCarb: '', manualFat: '' },
  { id: uid(), query: 'Rice, white, cooked', matchedSlug: 'rice-white-cooked', qty: '2', unit: 'cup', manualKcal: '', manualProtein: '', manualCarb: '', manualFat: '' },
  { id: uid(), query: 'Broccoli, raw', matchedSlug: 'broccoli', qty: '200', unit: 'g', manualKcal: '', manualProtein: '', manualCarb: '', manualFat: '' },
  { id: uid(), query: 'Olive oil', matchedSlug: 'olive-oil', qty: '2', unit: 'tbsp', manualKcal: '', manualProtein: '', manualCarb: '', manualFat: '' },
  { id: uid(), query: 'Garlic, raw', matchedSlug: 'garlic', qty: '3', unit: 'whole', manualKcal: '', manualProtein: '', manualCarb: '', manualFat: '' },
];

export function CalorieEstimator() {
  const [title, setTitle] = useState('Chicken & rice dinner');
  const [servings, setServings] = useState('4');
  const [lines, setLines] = useState<Line[]>(EXAMPLE);
  const [copied, setCopied] = useState(false);
  const [savedList, setSavedList] = useState<SavedRecipe[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.title) setTitle(s.title);
        if (s.servings) setServings(s.servings);
        if (Array.isArray(s.lines) && s.lines.length) setLines(s.lines);
      }
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) setSavedList(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, servings, lines }));
  }, [title, servings, lines]);

  const servingsN = useMemo(() => {
    const n = parseFloat(servings);
    return isFinite(n) && n > 0 ? n : 1;
  }, [servings]);

  const computed = useMemo(() => {
    const rows = lines.map((l) => {
      const food = l.matchedSlug
        ? CALORIE_TABLE.find((f) => f.slug === l.matchedSlug) ?? null
        : null;
      const qty = parseFloat(l.qty);
      const override = !food && (parseFloat(l.manualKcal) > 0);
      const eff = computeLine(
        food,
        isFinite(qty) ? qty : 0,
        l.unit,
        parseFloat(l.manualKcal),
        parseFloat(l.manualProtein),
        parseFloat(l.manualCarb),
        parseFloat(l.manualFat),
      );
      return { id: l.id, query: l.query, food, override, ...eff, unmatched: !food && !override };
    });
    const total: LineNutrition = rows.reduce(
      (acc, r) => ({
        grams: acc.grams + r.grams,
        kcal: acc.kcal + r.kcal,
        protein: acc.protein + r.protein,
        carb: acc.carb + r.carb,
        fat: acc.fat + r.fat,
        fiber: acc.fiber + r.fiber,
      }),
      { grams: 0, kcal: 0, protein: 0, carb: 0, fat: 0, fiber: 0 },
    );
    return { rows, total };
  }, [lines]);

  const perServing: LineNutrition = useMemo(() => ({
    grams: computed.total.grams / servingsN,
    kcal: computed.total.kcal / servingsN,
    protein: computed.total.protein / servingsN,
    carb: computed.total.carb / servingsN,
    fat: computed.total.fat / servingsN,
    fiber: computed.total.fiber / servingsN,
  }), [computed.total, servingsN]);

  // Macro split percentages by calories (4 kcal/g protein, 4 kcal/g carb, 9 kcal/g fat)
  const macroSplit = useMemo(() => {
    const pKcal = perServing.protein * 4;
    const cKcal = perServing.carb * 4;
    const fKcal = perServing.fat * 9;
    const total = pKcal + cKcal + fKcal;
    if (total <= 0) return { pPct: 0, cPct: 0, fPct: 0 };
    return {
      pPct: (pKcal / total) * 100,
      cPct: (cKcal / total) * 100,
      fPct: (fKcal / total) * 100,
    };
  }, [perServing]);

  function updateLine(id: string, patch: Partial<Line>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function addRow() {
    setLines((prev) => [
      ...prev,
      { id: uid(), query: '', matchedSlug: null, qty: '', unit: 'g', manualKcal: '', manualProtein: '', manualCarb: '', manualFat: '' },
    ]);
  }

  function removeRow(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function resetAll() {
    setTitle('Chicken & rice dinner');
    setServings('4');
    setLines(EXAMPLE);
  }

  function saveRecipe() {
    const rec: SavedRecipe = {
      id: uid(),
      title: title || 'Untitled recipe',
      servings: servingsN,
      lines,
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
    setLines(r.lines);
    setShowSaved(false);
  }

  function deleteSaved(id: string) {
    const next = savedList.filter((r) => r.id !== id);
    setSavedList(next);
    if (typeof window !== 'undefined') localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }

  function copyAll() {
    const lns = computed.rows.map((r) => {
      const name = r.food?.name ?? r.query ?? '(unmatched)';
      return `${name} — ${Math.round(r.kcal)} kcal · ${r.protein.toFixed(1)}P / ${r.carb.toFixed(1)}C / ${r.fat.toFixed(1)}F g`;
    });
    const txt = [
      `${title} — ${servingsN} servings`,
      '',
      ...lns,
      '',
      `Total: ${Math.round(computed.total.kcal)} kcal (${computed.total.protein.toFixed(0)}P / ${computed.total.carb.toFixed(0)}C / ${computed.total.fat.toFixed(0)}F g)`,
      `Per serving: ${Math.round(perServing.kcal)} kcal (${perServing.protein.toFixed(0)}P / ${perServing.carb.toFixed(0)}C / ${perServing.fat.toFixed(0)}F g)`,
    ].join('\n');
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  function printPage() {
    if (typeof window !== 'undefined') window.print();
  }

  const unmatchedCount = computed.rows.filter((r) => r.unmatched).length;

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
                      <button type="button" onClick={() => loadRecipe(r)} className="flex-1 truncate text-left text-sm font-medium text-ink hover:text-terracotta-500">
                        {r.title} <span className="text-xs text-ink-subtle">· {r.servings} srv</span>
                      </button>
                      <button type="button" onClick={() => deleteSaved(r.id)} className="rounded-md p-1 text-ink-subtle hover:bg-red-50 hover:text-red-600" aria-label="Delete saved">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,140px]">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Recipe title</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 h-11" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Servings</span>
              <Input type="number" inputMode="numeric" min={1} value={servings} onChange={(e) => setServings(e.target.value)} className="mt-1 h-11" />
            </label>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Ingredients ({lines.length})
            </p>
            <Button type="button" size="sm" onClick={addRow}>
              <Plus className="mr-1.5 h-4 w-4" /> Add
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {lines.map((l) => (
              <IngredientRow
                key={l.id}
                line={l}
                onChange={(patch) => updateLine(l.id, patch)}
                onRemove={() => removeRow(l.id)}
              />
            ))}
          </div>

          <p className="mt-3 text-[11px] text-ink-subtle">
            Type 2+ letters to search the database of {CALORIE_TABLE.length} foods. Pick from the
            dropdown. If your ingredient isn&apos;t listed, fill in <strong>kcal per 100 g</strong>{' '}
            (and optional macros) manually — find values on the food package or USDA FoodData
            Central.
          </p>
        </div>
      </section>

      {/* OUTPUT */}
      <section className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 via-cream-50 to-forest-50 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-terracotta-500" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Nutrition per serving
            </p>
          </div>
          <div className="mt-3 text-center">
            <p className="font-serif text-5xl font-bold text-ink">{Math.round(perServing.kcal)}</p>
            <p className="text-sm font-bold uppercase tracking-wider text-ink-subtle">kcal</p>
          </div>

          <div className="mt-4 space-y-1.5">
            <MacroBar label="Protein" grams={perServing.protein} kcal={perServing.protein * 4} pct={macroSplit.pPct} color="bg-forest-500" />
            <MacroBar label="Carbs" grams={perServing.carb} kcal={perServing.carb * 4} pct={macroSplit.cPct} color="bg-amber-500" />
            <MacroBar label="Fat" grams={perServing.fat} kcal={perServing.fat * 9} pct={macroSplit.fPct} color="bg-terracotta-500" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-lg bg-white px-3 py-1.5">
              <span className="font-bold text-ink">{perServing.fiber.toFixed(1)} g</span>{' '}
              <span className="text-ink-subtle">fiber</span>
            </div>
            <div className="rounded-lg bg-white px-3 py-1.5">
              <span className="font-bold text-ink">{Math.round(perServing.grams)} g</span>{' '}
              <span className="text-ink-subtle">total weight</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600">
            Total ({servingsN} servings combined)
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <NutTile label="kcal" value={Math.round(computed.total.kcal).toString()} />
            <NutTile label="P g" value={computed.total.protein.toFixed(0)} />
            <NutTile label="C g" value={computed.total.carb.toFixed(0)} />
            <NutTile label="F g" value={computed.total.fat.toFixed(0)} />
          </div>
        </div>

        {unmatchedCount > 0 ? (
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
              <p className="text-sm text-amber-900">
                {unmatchedCount} ingredient{unmatchedCount === 1 ? '' : 's'} unmatched — enter a kcal
                value to include in the total.
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

function IngredientRow({
  line, onChange, onRemove,
}: {
  line: Line;
  onChange: (patch: Partial<Line>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const matched = line.matchedSlug
    ? CALORIE_TABLE.find((f) => f.slug === line.matchedSlug) ?? null
    : null;

  const results = useMemo(() => {
    if (matched && matched.name === line.query) return [];
    return searchFoods(line.query, 8);
  }, [line.query, matched]);

  function pick(food: FoodNutrition) {
    onChange({ query: food.name, matchedSlug: food.slug });
    setOpen(false);
  }

  function clearMatch() {
    onChange({ matchedSlug: null });
  }

  // Computed grams for live readout
  const qtyN = parseFloat(line.qty);
  const grams = matched && isFinite(qtyN) ? toGrams(qtyN, line.unit, matched) : 0;
  const lineKcal = matched && grams > 0 ? (matched.kcalPer100g * grams) / 100 : 0;

  const showManual = !matched && line.query.trim().length > 0;

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-3">
      <div className="grid gap-2 sm:grid-cols-[1fr,90px,90px,32px]">
        <div ref={ref} className="relative">
          <div className="flex items-center rounded-md border border-ink/15 bg-cream-50 px-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
            <input
              value={line.query}
              onChange={(e) => {
                onChange({ query: e.target.value, matchedSlug: null });
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search food..."
              className="h-10 w-full bg-transparent px-2 text-sm outline-none placeholder:text-ink-subtle"
              aria-label="Search ingredient"
            />
            {line.matchedSlug ? (
              <span className="shrink-0 rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold text-forest-700">
                Matched
              </span>
            ) : null}
            {line.query ? (
              <button
                type="button"
                onClick={() => { onChange({ query: '', matchedSlug: null }); setOpen(false); }}
                className="ml-1 rounded-md p-0.5 text-ink-subtle hover:bg-cream-100 hover:text-ink"
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          {open && results.length > 0 ? (
            <ul role="listbox" className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-md border border-ink/10 bg-white shadow-lg">
              {results.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => pick(r)}
                    className="flex w-full items-baseline justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-cream-50"
                  >
                    <span className="truncate text-ink">{r.name}</span>
                    <span className="shrink-0 text-[11px] text-ink-subtle">{r.kcalPer100g} kcal/100g</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <Input
          type="number"
          inputMode="decimal"
          step="0.1"
          value={line.qty}
          onChange={(e) => onChange({ qty: e.target.value })}
          placeholder="Qty"
          aria-label="Quantity"
          className="h-10"
        />
        <select
          value={line.unit}
          onChange={(e) => onChange({ unit: e.target.value as UnitKey })}
          className="h-10 rounded-md border border-ink/15 bg-white px-2 text-sm"
          aria-label="Unit"
        >
          {UNIT_OPTIONS.map((u) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-10 w-8 items-center justify-center self-end rounded-md text-ink-subtle hover:bg-red-50 hover:text-red-600"
          aria-label="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showManual ? (
        <div className="mt-2 rounded-lg bg-amber-50 p-2.5 ring-1 ring-amber-200">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
            No match — enter values per 100 g
          </p>
          <div className="mt-1 grid grid-cols-4 gap-1.5">
            <Input
              type="number"
              inputMode="decimal"
              value={line.manualKcal}
              onChange={(e) => onChange({ manualKcal: e.target.value })}
              placeholder="kcal"
              aria-label="kcal per 100g"
              className="h-8 text-xs"
            />
            <Input
              type="number"
              inputMode="decimal"
              value={line.manualProtein}
              onChange={(e) => onChange({ manualProtein: e.target.value })}
              placeholder="P g"
              aria-label="Protein g per 100g"
              className="h-8 text-xs"
            />
            <Input
              type="number"
              inputMode="decimal"
              value={line.manualCarb}
              onChange={(e) => onChange({ manualCarb: e.target.value })}
              placeholder="C g"
              aria-label="Carbs g per 100g"
              className="h-8 text-xs"
            />
            <Input
              type="number"
              inputMode="decimal"
              value={line.manualFat}
              onChange={(e) => onChange({ manualFat: e.target.value })}
              placeholder="F g"
              aria-label="Fat g per 100g"
              className="h-8 text-xs"
            />
          </div>
        </div>
      ) : null}

      {matched && grams > 0 ? (
        <p className="mt-2 flex items-center gap-2 text-[11px] text-ink-subtle">
          <Sparkles className="h-3 w-3 text-forest-600" aria-hidden />
          <span>
            ≈ {Math.round(grams)} g · <strong className="text-ink">{Math.round(lineKcal)} kcal</strong>
          </span>
          <button
            type="button"
            onClick={clearMatch}
            className="ml-auto text-[10px] uppercase tracking-wider text-ink-subtle hover:text-terracotta-500"
          >
            Change match
          </button>
        </p>
      ) : null}
    </div>
  );
}

function MacroBar({ label, grams, kcal, pct, color }: { label: string; grams: number; kcal: number; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-ink-muted">
          <strong className="text-ink">{grams.toFixed(1)} g</strong> · {Math.round(kcal)} kcal · {Math.round(pct)}%
        </span>
      </div>
      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-100">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}

function NutTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-cream-100 p-2.5">
      <p className="font-serif text-xl font-bold text-ink">{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-ink-subtle">{label}</p>
    </div>
  );
}
