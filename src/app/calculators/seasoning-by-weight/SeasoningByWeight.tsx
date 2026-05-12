'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Droplet as Salt, Copy, Check, Info, AlertTriangle, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SEASONING_PROFILES, SEASONING_CATEGORIES, SALT_DENSITY, SALT_TYPE_LABELS,
  computeSeasoning, ozToG, type SaltType,
} from '@/content/seasoning-data';

type Unit = 'g' | 'oz';

const DEFAULT_SLUG = 'red-meat-steak';
const DEFAULT_INTENSITY = 50;
const DEFAULT_SALT_TYPE: SaltType = 'kosher-diamond';

export function SeasoningByWeight() {
  const [activeSlug, setActiveSlug] = useState<string>(DEFAULT_SLUG);
  const [foodWeight, setFoodWeight] = useState<string>('450');
  const [unit, setUnit] = useState<Unit>('g');
  const [intensity, setIntensity] = useState<number>(DEFAULT_INTENSITY);
  const [saltType, setSaltType] = useState<SaltType>(DEFAULT_SALT_TYPE);
  const [copied, setCopied] = useState(false);

  // Restore saved state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('rc:seasoning:state');
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.activeSlug) setActiveSlug(s.activeSlug);
      if (s.foodWeight) setFoodWeight(s.foodWeight);
      if (s.unit === 'g' || s.unit === 'oz') setUnit(s.unit);
      if (typeof s.intensity === 'number') setIntensity(s.intensity);
      if (s.saltType && s.saltType in SALT_DENSITY) setSaltType(s.saltType);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'rc:seasoning:state',
      JSON.stringify({ activeSlug, foodWeight, unit, intensity, saltType }),
    );
  }, [activeSlug, foodWeight, unit, intensity, saltType]);

  const profile = useMemo(
    () => SEASONING_PROFILES.find((p) => p.slug === activeSlug) ?? SEASONING_PROFILES[0]!,
    [activeSlug],
  );

  const foodMassG = useMemo(() => {
    const n = parseFloat(foodWeight);
    if (!isFinite(n) || n <= 0) return 0;
    return unit === 'g' ? n : ozToG(n);
  }, [foodWeight, unit]);

  const result = useMemo(
    () => computeSeasoning(profile, foodMassG, intensity, saltType),
    [profile, foodMassG, intensity, saltType],
  );

  const effectivePct = useMemo(() => {
    if (foodMassG <= 0) return 0;
    return (result.saltGrams / foodMassG) * 100;
  }, [result.saltGrams, foodMassG]);

  function copyAll() {
    if (foodMassG <= 0) return;
    const lines = [
      `${profile.name} · ${unit === 'g' ? foodWeight : foodWeight + ' oz'} ${unit === 'g' ? 'g' : `(${foodMassG.toFixed(0)} g)`}`,
      `Salt: ${formatG(result.saltGrams)} g (${formatTsp(result.saltTsp)} tsp ${SALT_TYPE_LABELS[saltType]})`,
      `First dose (80%): ${formatG(result.saltFirstDose)} g — then taste`,
      `Target salinity: ${effectivePct.toFixed(2)}% of food mass`,
    ];
    if (result.pepperGrams) lines.push(`Pepper: ${formatG(result.pepperGrams)} g`);
    if (result.garlicPowderGrams) lines.push(`Garlic powder: ${formatG(result.garlicPowderGrams)} g`);
    if (result.onionPowderGrams) lines.push(`Onion powder: ${formatG(result.onionPowderGrams)} g`);
    if (result.paprikaGrams) lines.push(`Paprika: ${formatG(result.paprikaGrams)} g`);
    if (result.driedHerbsGrams) lines.push(`Dried herbs: ${formatG(result.driedHerbsGrams)} g`);
    if (result.sugarGrams) lines.push(`Sugar: ${formatG(result.sugarGrams)} g`);
    if (profile.timing) lines.push(`When: ${profile.timing}`);
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  const intensityLabel =
    intensity < 33 ? 'Light' : intensity < 67 ? 'Balanced' : intensity < 90 ? 'Bold' : 'Aggressive';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
      {/* LEFT: inputs */}
      <section className="space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            What are you seasoning?
          </p>
          <div className="mt-4 space-y-4">
            {SEASONING_CATEGORIES.map((cat) => {
              const profilesInCat = SEASONING_PROFILES.filter((p) => p.category === cat.value);
              return (
                <div key={cat.value}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                    {cat.label}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {profilesInCat.map((p) => {
                      const on = activeSlug === p.slug;
                      return (
                        <button
                          key={p.slug}
                          type="button"
                          onClick={() => setActiveSlug(p.slug)}
                          aria-pressed={on}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            on
                              ? 'bg-terracotta-500 text-white shadow-sm'
                              : 'bg-cream-100 text-ink hover:bg-cream-200'
                          }`}
                        >
                          {shortLabel(p.name)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            How much food?
          </p>
          <div className="mt-3 grid grid-cols-[1fr,90px] gap-2">
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step={unit === 'g' ? 10 : 0.5}
              value={foodWeight}
              onChange={(e) => setFoodWeight(e.target.value)}
              placeholder="450"
              aria-label="Food weight"
              className="h-12 text-lg font-bold"
            />
            <div className="flex rounded-md border border-ink/15 bg-cream-50 p-0.5">
              <button
                type="button"
                onClick={() => setUnit('g')}
                aria-pressed={unit === 'g'}
                className={`flex-1 rounded-sm text-xs font-bold transition-colors ${
                  unit === 'g' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'
                }`}
              >
                g
              </button>
              <button
                type="button"
                onClick={() => setUnit('oz')}
                aria-pressed={unit === 'oz'}
                className={`flex-1 rounded-sm text-xs font-bold transition-colors ${
                  unit === 'oz' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'
                }`}
              >
                oz
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-subtle">
            {unit === 'oz' && foodMassG > 0
              ? `= ${foodMassG.toFixed(0)} g`
              : '1 lb = 454 g · 8 oz steak ≈ 225 g · whole chicken ≈ 1.4–1.8 kg'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Intensity
            </p>
            <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              {intensityLabel} · {effectivePct.toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            aria-label="Seasoning intensity"
            className="mt-3 w-full accent-terracotta-500"
          />
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-ink-subtle">
            <span>Light</span>
            <span>Balanced</span>
            <span>Bold</span>
            <span>Aggressive</span>
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-terracotta-500">
            Salt type
          </p>
          <select
            value={saltType}
            onChange={(e) => setSaltType(e.target.value as SaltType)}
            className="mt-2 h-10 w-full rounded-md border border-ink/15 bg-white px-3 text-sm"
            aria-label="Salt type"
          >
            {(Object.keys(SALT_TYPE_LABELS) as SaltType[]).map((t) => (
              <option key={t} value={t}>
                {SALT_TYPE_LABELS[t]} · {SALT_DENSITY[t]} g/tsp
              </option>
            ))}
          </select>
          <p className="mt-2 text-[11px] text-ink-subtle">
            Coarse salts weigh half as much per teaspoon as fine. If you measure by volume, the salt
            type matters. By weight, every salt is identical.
          </p>
        </div>
      </section>

      {/* RIGHT: result */}
      <section className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 via-cream-50 to-forest-50 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            {profile.name}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">
            {foodMassG > 0
              ? `Use ${formatG(result.saltGrams)} g of salt`
              : 'Enter a weight to start'}
          </h2>
          {foodMassG > 0 ? (
            <p className="mt-1 text-base text-ink-muted">
              That&apos;s about{' '}
              <strong className="text-ink">{formatTsp(result.saltTsp)} tsp</strong> of{' '}
              {SALT_TYPE_LABELS[saltType]}.
            </p>
          ) : null}
        </div>

        {foodMassG > 0 ? (
          <>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Salt className="h-4 w-4 text-terracotta-500" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
                  Two-stage seasoning
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-forest-50 p-3 ring-1 ring-forest-200">
                  <p className="text-[10px] uppercase tracking-wider text-forest-700">
                    First dose (now)
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-forest-700">
                    {formatG(result.saltFirstDose)} g
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">≈ 80% of target</p>
                </div>
                <div className="rounded-xl bg-cream-100 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-ink-subtle">
                    Hold back (taste & adjust)
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-ink">
                    {formatG(result.saltGrams - result.saltFirstDose)} g
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">≈ 20% reserve</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-muted">
                Salt 80% now, taste once cooked or rested, finish the rest only if needed. Salt over
                target is impossible to fix.
              </p>
            </div>

            {(result.pepperGrams ||
              result.garlicPowderGrams ||
              result.onionPowderGrams ||
              result.paprikaGrams ||
              result.driedHerbsGrams ||
              result.sugarGrams) ? (
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-forest-600">
                  Companion aromatics (proportional to salt)
                </p>
                <ul className="mt-3 divide-y divide-ink/5">
                  {result.pepperGrams ? (
                    <SeasoningRow label="Black pepper" grams={result.pepperGrams} />
                  ) : null}
                  {result.garlicPowderGrams ? (
                    <SeasoningRow label="Garlic powder" grams={result.garlicPowderGrams} />
                  ) : null}
                  {result.onionPowderGrams ? (
                    <SeasoningRow label="Onion powder" grams={result.onionPowderGrams} />
                  ) : null}
                  {result.paprikaGrams ? (
                    <SeasoningRow label="Paprika" grams={result.paprikaGrams} />
                  ) : null}
                  {result.driedHerbsGrams ? (
                    <SeasoningRow label="Dried herbs (rosemary, thyme, oregano)" grams={result.driedHerbsGrams} />
                  ) : null}
                  {result.sugarGrams ? (
                    <SeasoningRow label="Sugar (brine balance)" grams={result.sugarGrams} />
                  ) : null}
                </ul>
                <p className="mt-3 text-[11px] text-ink-subtle">
                  Aromatics are starting points. Adjust to taste — they have no chemistry deadline.
                </p>
              </div>
            ) : null}

            {profile.timing ? (
              <div className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-700" aria-hidden />
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    When to apply
                  </p>
                </div>
                <p className="mt-2 text-sm text-ink">{profile.timing}</p>
              </div>
            ) : null}

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
                <p className="text-sm text-ink-muted">{profile.notes}</p>
              </div>
            </div>

            {profile.category === 'cure' ? (
              <div className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden />
                  <div className="text-sm text-ink">
                    <p className="font-bold text-red-900">Curing safety</p>
                    <p className="mt-1 text-red-900/80">
                      Cured meats that will not be cooked to 145°F (63°C) require pink curing salt
                      (Prague Powder #1) at 0.25% of meat weight, in addition to the salt above.
                      Cure under 40°F (4°C) only.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <Button type="button" variant="outline" size="sm" onClick={copyAll} className="w-full">
              {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy all amounts'}
            </Button>
          </>
        ) : null}
      </section>
    </div>
  );
}

function SeasoningRow({ label, grams }: { label: string; grams: number }) {
  return (
    <li className="flex items-baseline justify-between py-2 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="font-serif text-base font-bold text-ink">{formatG(grams)} g</span>
    </li>
  );
}

// Produce a compact pill label from a full profile name.
// "Red meat — steaks & chops (raw)" -> "Red meat · steaks"
// "Vegetables — sautéed / stir-fried" -> "Vegetables · sautéed"
// "Pasta cooking water" -> "Pasta water"
function shortLabel(name: string): string {
  const cleaned = name
    .replace(/\(.*?\)/g, '')          // strip parenthetical
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (cleaned.includes(' — ')) {
    const [head, tail = ''] = cleaned.split(' — ');
    // take first noun phrase from the qualifier (split on comma, slash, ampersand)
    const qual = tail.split(/[,/&]/)[0]!.trim();
    return `${head!.trim()} · ${qual}`;
  }
  // long labels: shorten common patterns
  return cleaned
    .replace(/\bcooking water\b/i, 'water')
    .replace(/\(baker's percent\)/i, '')
    .trim();
}

function formatG(n: number): string {
  if (!isFinite(n) || n < 0) return '—';
  if (n < 0.5) return n.toFixed(2);
  if (n < 5) return n.toFixed(1);
  return Math.round(n).toString();
}

function formatTsp(n: number): string {
  if (!isFinite(n) || n < 0) return '—';
  // Round to nearest 1/8 tsp.
  const eighths = Math.round(n * 8);
  if (eighths === 0) return '<⅛';
  if (eighths < 8) return `${eighthsToFraction(eighths)}`;
  const whole = Math.floor(eighths / 8);
  const rem = eighths % 8;
  if (rem === 0) return whole.toString();
  return `${whole} ${eighthsToFraction(rem)}`;
}

function eighthsToFraction(e: number): string {
  switch (e) {
    case 1: return '⅛';
    case 2: return '¼';
    case 3: return '⅜';
    case 4: return '½';
    case 5: return '⅝';
    case 6: return '¾';
    case 7: return '⅞';
    default: return e.toString();
  }
}
