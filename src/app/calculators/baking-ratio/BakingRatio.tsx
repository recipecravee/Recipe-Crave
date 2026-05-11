'use client';

import { useEffect, useMemo, useState } from 'react';
import { Scale, Wheat, Droplets, Sparkles, Save, Trash2 } from 'lucide-react';
import {
  BAKING_PRESETS,
  CUSTOM_PRESETS_KEY,
  type BakingRatioPreset,
  type CustomPreset,
  scalePreset,
  roundIngredient,
} from '@/content/baking-ratios';

const FLOUR_PREF_KEY = 'recipecrave-baking-flour';
const PRESET_PREF_KEY = 'recipecrave-baking-preset';

export function BakingRatio() {
  const [flourGrams, setFlourGrams] = useState<number>(500);
  const [selectedSlug, setSelectedSlug] = useState<string>('lean-bread');
  const [hydrationOverride, setHydrationOverride] = useState<number | null>(null);
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Load persisted prefs on mount
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    const f = localStorage.getItem(FLOUR_PREF_KEY);
    if (f) {
      const n = parseInt(f, 10);
      if (!isNaN(n) && n > 0) setFlourGrams(n);
    }
    const p = localStorage.getItem(PRESET_PREF_KEY);
    if (p) setSelectedSlug(p);
    const cp = localStorage.getItem(CUSTOM_PRESETS_KEY);
    if (cp) {
      try {
        const parsed = JSON.parse(cp);
        if (Array.isArray(parsed)) setCustomPresets(parsed);
      } catch {
        // ignore corrupted store
      }
    }
  }, []);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(FLOUR_PREF_KEY, String(flourGrams));
  }, [flourGrams]);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(PRESET_PREF_KEY, selectedSlug);
    // Reset hydration override when preset changes
    setHydrationOverride(null);
  }, [selectedSlug]);

  const allPresets: BakingRatioPreset[] = useMemo(() => {
    const customAsPresets: BakingRatioPreset[] = customPresets.map((c) => ({
      ...c,
      category: 'bread',
    }));
    return [...BAKING_PRESETS, ...customAsPresets];
  }, [customPresets]);

  const preset: BakingRatioPreset =
    allPresets.find((p) => p.slug === selectedSlug) ?? (BAKING_PRESETS[0] as BakingRatioPreset);
  const scaled = scalePreset(preset, flourGrams, hydrationOverride ?? undefined);
  const effectiveHydration = hydrationOverride ?? preset.hydration;
  const hydrationMin = preset.hydrationRange?.min ?? Math.max(0, preset.hydration - 15);
  const hydrationMax = preset.hydrationRange?.max ?? Math.min(100, preset.hydration + 15);

  function saveCustomPreset() {
    if (!saveName.trim()) return;
    const slug = 'custom-' + Date.now();
    const newCustom: CustomPreset = {
      slug,
      name: saveName.trim(),
      description: `Custom preset based on ${preset.name}`,
      hydration: effectiveHydration,
      salt: preset.salt,
      yeast: preset.yeast,
      starter: preset.starter,
      fat: preset.fat,
      sugar: preset.sugar,
      eggs: preset.eggs,
      milk: preset.milk,
      custom: true,
      createdAt: new Date().toISOString(),
    };
    const next = [...customPresets, newCustom];
    setCustomPresets(next);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(next));
    }
    setSelectedSlug(slug);
    setSaveName('');
    setSaveDialogOpen(false);
  }

  function deleteCustom(slug: string) {
    const next = customPresets.filter((c) => c.slug !== slug);
    setCustomPresets(next);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(next));
    }
    if (selectedSlug === slug) setSelectedSlug('lean-bread');
  }

  const isCustom = selectedSlug.startsWith('custom-');

  // Ingredient rows: [label, grams, percentOfFlour, roundType, icon]
  const rows: Array<{ label: string; grams: number; pct: number; type: 'flour' | 'micro' | 'normal' }> = [
    { label: 'Flour', grams: scaled.flour, pct: 100, type: 'flour' },
  ];
  if (scaled.water > 0) rows.push({ label: 'Water', grams: scaled.water, pct: effectiveHydration, type: 'normal' });
  if (scaled.milk > 0) rows.push({ label: 'Milk', grams: scaled.milk, pct: preset.milk ?? 0, type: 'normal' });
  if (scaled.eggs > 0) rows.push({ label: 'Eggs', grams: scaled.eggs, pct: preset.eggs ?? 0, type: 'normal' });
  if (scaled.fat > 0) rows.push({ label: 'Fat (butter / oil)', grams: scaled.fat, pct: preset.fat ?? 0, type: 'normal' });
  if (scaled.sugar > 0) rows.push({ label: 'Sugar / honey', grams: scaled.sugar, pct: preset.sugar ?? 0, type: 'normal' });
  if (scaled.starter > 0) rows.push({ label: 'Sourdough starter', grams: scaled.starter, pct: preset.starter ?? 0, type: 'normal' });
  rows.push({ label: 'Salt', grams: scaled.salt, pct: preset.salt, type: 'micro' });
  if (scaled.yeast > 0) rows.push({ label: 'Instant yeast', grams: scaled.yeast, pct: preset.yeast ?? 0, type: 'micro' });

  const totalRounded = rows.reduce((sum, r) => sum + roundIngredient(r.grams, r.type), 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
      {/* Left: preset picker + flour input */}
      <div className="space-y-6">
        <div className="rounded-2xl border-2 border-ink/5 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-600">Flour weight</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                min={50}
                max={5000}
                step={10}
                value={flourGrams}
                onChange={(e) => {
                  const n = parseInt(e.target.value || '0', 10);
                  setFlourGrams(isNaN(n) ? 0 : n);
                }}
                className="w-full rounded-xl border-2 border-ink/10 bg-cream-50 px-4 py-3 text-2xl font-bold text-ink focus:border-forest-400 focus:outline-none"
                aria-label="Target flour weight in grams"
              />
              <span className="text-lg font-bold text-ink-muted">g</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[250, 500, 750, 1000, 1500].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFlourGrams(g)}
                  className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                    flourGrams === g
                      ? 'border-forest-500 bg-forest-500 text-white'
                      : 'border-ink/10 bg-white text-ink-muted hover:border-forest-300 hover:text-forest-600'
                  }`}
                >
                  {g}g
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="rounded-2xl border-2 border-ink/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600">Choose preset</p>
          <ul className="mt-3 space-y-2">
            {BAKING_PRESETS.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => setSelectedSlug(p.slug)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-all ${
                    selectedSlug === p.slug
                      ? 'border-forest-500 bg-forest-50 shadow-sm'
                      : 'border-ink/5 bg-white hover:border-forest-200 hover:bg-cream-50'
                  }`}
                >
                  <p className="font-serif text-base font-bold text-ink">{p.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{p.description}</p>
                  <p className="mt-1.5 flex flex-wrap gap-1 text-[10px] font-bold uppercase tracking-wider text-forest-600">
                    <span>Hydration {p.hydration}%</span>
                    <span aria-hidden>·</span>
                    <span>Salt {p.salt}%</span>
                    {p.yeast ? (
                      <>
                        <span aria-hidden>·</span>
                        <span>Yeast {p.yeast}%</span>
                      </>
                    ) : null}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {customPresets.length > 0 ? (
            <>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-terracotta-500">My saved presets</p>
              <ul className="mt-3 space-y-2">
                {customPresets.map((p) => (
                  <li key={p.slug} className="flex items-stretch gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(p.slug)}
                      className={`flex-1 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                        selectedSlug === p.slug
                          ? 'border-terracotta-500 bg-terracotta-50 shadow-sm'
                          : 'border-ink/5 bg-white hover:border-terracotta-200 hover:bg-cream-50'
                      }`}
                    >
                      <p className="font-serif text-base font-bold text-ink">{p.name}</p>
                      <p className="text-xs text-ink-muted">Hydration {p.hydration}% · Salt {p.salt}%</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCustom(p.slug)}
                      aria-label={`Delete ${p.name}`}
                      className="flex w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink/5 bg-white text-ink-muted transition-colors hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>

      {/* Right: scaled output */}
      <div className="space-y-6">
        <div className="rounded-2xl border-2 border-forest-200 bg-gradient-to-br from-forest-50 via-cream-50 to-terracotta-50 p-5 shadow-md sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-forest-600">{preset.category}</p>
              <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{preset.name}</h2>
            </div>
            <Wheat className="h-8 w-8 shrink-0 text-forest-500" aria-hidden />
          </div>

          {/* Hydration slider */}
          {preset.hydration > 0 ? (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1 uppercase tracking-widest text-forest-600">
                  <Droplets className="h-3.5 w-3.5" /> Hydration
                </span>
                <span className="rounded-full bg-white px-3 py-0.5 font-bold text-forest-700 shadow-sm">
                  {effectiveHydration}%
                </span>
              </div>
              <input
                type="range"
                min={hydrationMin}
                max={hydrationMax}
                step={1}
                value={effectiveHydration}
                onChange={(e) => setHydrationOverride(parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-forest-500"
                aria-label="Adjust hydration percentage"
              />
              <div className="flex justify-between text-[10px] font-bold text-ink-muted">
                <span>{hydrationMin}%</span>
                <span>Default {preset.hydration}%</span>
                <span>{hydrationMax}%</span>
              </div>
            </div>
          ) : null}

          {/* Ingredient grams table */}
          <div className="mt-6 overflow-hidden rounded-xl border-2 border-ink/5 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/5 bg-cream-50 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  <th className="px-4 py-2 text-left">Ingredient</th>
                  <th className="px-4 py-2 text-right">Grams</th>
                  <th className="hidden px-4 py-2 text-right sm:table-cell">% of flour</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const grams = roundIngredient(r.grams, r.type);
                  return (
                    <tr key={r.label} className="border-b border-ink/5 last:border-b-0">
                      <td className="px-4 py-2.5 font-bold text-ink">{r.label}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono text-base font-bold text-forest-700">{grams}</span>
                        <span className="ml-1 text-xs text-ink-muted">g</span>
                      </td>
                      <td className="hidden px-4 py-2.5 text-right text-xs text-ink-muted sm:table-cell">
                        {r.pct.toFixed(r.pct < 1 ? 1 : 0)}%
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-forest-50 font-bold">
                  <td className="px-4 py-3 text-ink">Total dough</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-base text-forest-700">{totalRounded}</span>
                    <span className="ml-1 text-xs text-ink-muted">g</span>
                  </td>
                  <td className="hidden px-4 py-3 text-right text-xs text-ink-muted sm:table-cell">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Portion math */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { div: 1, label: '1 large loaf' },
              { div: 2, label: '2 medium loaves' },
              { div: 4, label: '4 small / rolls' },
            ].map((p) => (
              <div key={p.label} className="rounded-xl border border-ink/5 bg-white px-2 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">{p.label}</p>
                <p className="mt-0.5 font-serif text-base font-bold text-forest-700">{Math.round(totalRounded / p.div)} g each</p>
              </div>
            ))}
          </div>

          {preset.notes ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
              <p>{preset.notes}</p>
            </div>
          ) : null}

          {/* Save current as custom preset */}
          {!isCustom ? (
            <div className="mt-5">
              {saveDialogOpen ? (
                <div className="flex flex-col gap-2 rounded-xl border-2 border-terracotta-200 bg-white p-3 sm:flex-row">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Name this preset"
                    className="flex-1 rounded-lg border border-ink/10 px-3 py-2 text-sm focus:border-terracotta-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={saveCustomPreset}
                    disabled={!saveName.trim()}
                    className="rounded-lg bg-terracotta-500 px-4 py-2 text-sm font-bold text-white shadow-sm disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSaveDialogOpen(false);
                      setSaveName('');
                    }}
                    className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-bold text-ink-muted"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSaveDialogOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-terracotta-300 px-4 py-3 text-sm font-bold text-terracotta-600 transition-colors hover:bg-terracotta-50"
                >
                  <Save className="h-4 w-4" />
                  Save current as my preset
                </button>
              )}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border-2 border-ink/5 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-600">
            <Scale className="h-3.5 w-3.5" /> Baker's percentage
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Every ingredient is weighed as a percent of the flour. Flour is always 100%. Water at 65% of 500g flour = 325g water.
            Switching flour weight rescales the whole recipe automatically, so the same ratios hit at any batch size.
          </p>
        </div>
      </div>
    </div>
  );
}
