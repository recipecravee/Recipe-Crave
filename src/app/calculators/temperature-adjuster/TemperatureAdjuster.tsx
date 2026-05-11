'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Copy, Check, Thermometer, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Unit = 'F' | 'C' | 'gas';

const GAS_MARK_TABLE: Array<{ gas: string; c: number }> = [
  { gas: '¼', c: 110 },
  { gas: '½', c: 120 },
  { gas: '1', c: 140 },
  { gas: '2', c: 150 },
  { gas: '3', c: 165 },
  { gas: '4', c: 180 },
  { gas: '5', c: 190 },
  { gas: '6', c: 200 },
  { gas: '7', c: 220 },
  { gas: '8', c: 230 },
  { gas: '9', c: 245 },
];

function fToC(f: number): number {
  return (f - 32) * (5 / 9);
}

function cToF(c: number): number {
  return c * (9 / 5) + 32;
}

function cToGas(c: number): string {
  if (c < GAS_MARK_TABLE[0]!.c) return '< ¼';
  if (c > GAS_MARK_TABLE[GAS_MARK_TABLE.length - 1]!.c) return '> 9';
  let best = GAS_MARK_TABLE[0]!;
  let bestDiff = Math.abs(c - best.c);
  for (const row of GAS_MARK_TABLE) {
    const diff = Math.abs(c - row.c);
    if (diff < bestDiff) {
      best = row;
      bestDiff = diff;
    }
  }
  return best.gas;
}

function gasToC(g: string): number | null {
  const row = GAS_MARK_TABLE.find((r) => r.gas === g.trim());
  return row?.c ?? null;
}

function formatNumber(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '—';
  return Math.round(n).toString();
}

export function TemperatureAdjuster() {
  const [value, setValue] = useState('180');
  const [unit, setUnit] = useState<Unit>('C');
  const [fanForced, setFanForced] = useState(false);
  const [copied, setCopied] = useState(false);

  // Persist last picks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('rc:temp');
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s.value) setValue(s.value);
        if (s.unit) setUnit(s.unit);
        if (typeof s.fanForced === 'boolean') setFanForced(s.fanForced);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('rc:temp', JSON.stringify({ value, unit, fanForced }));
  }, [value, unit, fanForced]);

  // Compute base °C from input (the universal pivot)
  const baseC = useMemo(() => {
    const n = parseFloat(value);
    if (!isFinite(n)) return NaN;
    if (unit === 'C') return n;
    if (unit === 'F') return fToC(n);
    const c = gasToC(value);
    return c ?? NaN;
  }, [value, unit]);

  // If fan-forced was set: input represents conventional, fan column shows -20°C.
  const fanC = useMemo(() => baseC - 20, [baseC]);

  const result = useMemo(() => {
    if (!isFinite(baseC)) {
      return { c: '—', f: '—', gas: '—', fanC: '—', fanF: '—', airF: '—' };
    }
    return {
      c: formatNumber(baseC),
      f: formatNumber(cToF(baseC)),
      gas: cToGas(baseC),
      fanC: formatNumber(fanC),
      fanF: formatNumber(cToF(fanC)),
      // Air fryer rule: -25°F from conventional, time -20%
      airF: formatNumber(cToF(baseC) - 25),
    };
  }, [baseC, fanC]);

  function swapToF() {
    const n = parseFloat(value);
    if (!isFinite(n)) return;
    if (unit === 'C') {
      setValue(formatNumber(cToF(n)));
      setUnit('F');
    } else if (unit === 'F') {
      setValue(formatNumber(fToC(n)));
      setUnit('C');
    }
  }

  async function copyAll() {
    const text = fanForced
      ? `Conventional ${result.c}°C / ${result.f}°F / Gas ${result.gas}\nFan-forced: ${result.fanC}°C / ${result.fanF}°F\nAir fryer: ${result.airF}°F`
      : `${result.c}°C / ${result.f}°F / Gas ${result.gas}\nAir fryer: ${result.airF}°F`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  // Quick presets
  const PRESETS = [
    { label: 'Slow roast', c: 150 },
    { label: 'Bread', c: 200 },
    { label: 'Roast meat', c: 180 },
    { label: 'Bake cake', c: 175 },
    { label: 'Pizza', c: 230 },
    { label: 'Crispy chips', c: 220 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-terracotta-500" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            Set the temperature
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.6fr,1fr]">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Value
            </span>
            {unit === 'gas' ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1 h-12 w-full rounded-md border border-ink/15 bg-white px-3 text-lg font-bold"
                aria-label="Gas mark"
              >
                {GAS_MARK_TABLE.map((r) => (
                  <option key={r.gas} value={r.gas}>
                    Gas Mark {r.gas}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type="number"
                inputMode="numeric"
                step="5"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1 h-12 text-lg font-bold"
                aria-label="Temperature value"
              />
            )}
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Unit
            </span>
            <select
              value={unit}
              onChange={(e) => {
                const u = e.target.value as Unit;
                if (u === 'gas' && !gasToC(value)) setValue('4');
                setUnit(u);
              }}
              className="mt-1 h-12 w-full rounded-md border border-ink/15 bg-white px-3 text-base"
              aria-label="Unit"
            >
              <option value="C">°C (Celsius)</option>
              <option value="F">°F (Fahrenheit)</option>
              <option value="gas">Gas Mark (UK)</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={fanForced}
              onChange={(e) => setFanForced(e.target.checked)}
              className="h-4 w-4 rounded border-ink/30 text-terracotta-400"
            />
            <span className="font-medium">Recipe says fan-forced (convection)</span>
          </label>
          {unit !== 'gas' ? (
            <Button type="button" variant="outline" size="sm" onClick={swapToF}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              {unit === 'C' ? 'Switch to °F' : 'Switch to °C'}
            </Button>
          ) : null}
        </div>

        <div className="mt-6 border-t border-ink/10 pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-600">
            Quick presets
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setValue(String(p.c));
                  setUnit('C');
                }}
                className="rounded-full border border-ink/10 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-terracotta-400 hover:text-terracotta-500"
              >
                {p.label} · {p.c}°C
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 to-cream-100 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              {fanForced ? 'Conventional equivalent' : 'Equivalents'}
            </p>
            <Flame className="h-5 w-5 text-terracotta-500" aria-hidden />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-ink-subtle">Celsius</p>
              <p className="mt-1 font-serif text-3xl font-bold text-ink">{result.c}°</p>
              <p className="text-[10px] uppercase text-ink-subtle">°C</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-ink-subtle">Fahrenheit</p>
              <p className="mt-1 font-serif text-3xl font-bold text-ink">{result.f}°</p>
              <p className="text-[10px] uppercase text-ink-subtle">°F</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-ink-subtle">Gas Mark</p>
              <p className="mt-1 font-serif text-3xl font-bold text-ink">{result.gas}</p>
              <p className="text-[10px] uppercase text-ink-subtle">UK</p>
            </div>
          </div>
        </div>

        {fanForced ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-600">
              Fan-forced setting (−20°C / −25°F from conventional)
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-cream-100 p-3">
                <p className="font-serif text-2xl font-bold text-ink">{result.fanC}°C</p>
              </div>
              <div className="rounded-xl bg-cream-100 p-3">
                <p className="font-serif text-2xl font-bold text-ink">{result.fanF}°F</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600">Air fryer equivalent</p>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">{result.airF}°F</p>
          <p className="mt-1 text-xs text-ink-muted">
            Drop temp by 25°F from conventional. Also reduce cook time by 20–25% and check 5 min early.
          </p>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={copyAll} className="w-full">
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied to clipboard' : 'Copy all equivalents'}
        </Button>
      </section>
    </div>
  );
}
