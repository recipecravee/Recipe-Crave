'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck, Pill, Activity, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MEDICATIONS, USER_CONDITIONS, scanForContraindications,
  type MedicationSlug, type UserConditionSlug,
} from '@/content/contraindications';
import { HERBS, getHerb } from '@/content/herbs';

const STORAGE_KEY = 'rc:safety-profile';

export function SafetyCheckClient() {
  const [meds, setMeds] = useState<Set<MedicationSlug>>(new Set());
  const [conds, setConds] = useState<Set<UserConditionSlug>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as { meds: MedicationSlug[]; conds: UserConditionSlug[] };
        if (Array.isArray(s.meds)) setMeds(new Set(s.meds));
        if (Array.isArray(s.conds)) setConds(new Set(s.conds));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        meds: [...meds],
        conds: [...conds],
      }));
    } catch {
      /* ignore */
    }
  }, [meds, conds, hydrated]);

  function toggleMed(slug: MedicationSlug) {
    setMeds((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }
  function toggleCond(slug: UserConditionSlug) {
    setConds((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const hits = useMemo(
    () => scanForContraindications(
      HERBS.map((h) => h.slug),
      [...meds],
      [...conds],
    ),
    [meds, conds],
  );

  // Group hits by herb for clean display
  const grouped = useMemo(() => {
    const map = new Map<string, typeof hits>();
    for (const h of hits) {
      const cur = map.get(h.herbSlug) ?? [];
      cur.push(h);
      map.set(h.herbSlug, cur);
    }
    // Sort each group by severity (severe first)
    for (const arr of map.values()) {
      arr.sort((a, b) =>
        (b.rule.severity === 'severe' ? 3 : b.rule.severity === 'caution' ? 2 : 1) -
        (a.rule.severity === 'severe' ? 3 : a.rule.severity === 'caution' ? 2 : 1),
      );
    }
    return map;
  }, [hits]);

  const medsByCategory = useMemo(() => {
    const map = new Map<string, typeof MEDICATIONS>();
    for (const m of MEDICATIONS) {
      const cur = map.get(m.category) ?? [];
      cur.push(m);
      map.set(m.category, cur);
    }
    return map;
  }, []);

  if (!hydrated) {
    return <div className="h-32 animate-pulse rounded-2xl bg-cream-100" />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
      {/* INPUT — meds + conditions */}
      <section className="space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-500">
              <Pill className="h-3.5 w-3.5" aria-hidden /> Your medications
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { setMeds(new Set()); setConds(new Set()); }}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
            </Button>
          </div>
          <p className="mt-2 text-xs text-ink-subtle">
            Tick anything you currently take. Stored only in your browser.
          </p>

          <div className="mt-4 space-y-3">
            {[...medsByCategory.entries()].map(([category, items]) => (
              <div key={category}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                  {category}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {items.map((m) => {
                    const on = meds.has(m.slug);
                    return (
                      <button
                        key={m.slug}
                        type="button"
                        onClick={() => toggleMed(m.slug)}
                        aria-pressed={on}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                          on
                            ? 'bg-terracotta-500 text-white'
                            : 'bg-cream-100 text-ink hover:bg-cream-200'
                        }`}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-700">
            <Activity className="h-3.5 w-3.5" aria-hidden /> Your conditions
          </p>
          <p className="mt-2 text-xs text-ink-subtle">
            Tick any that apply.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {USER_CONDITIONS.map((c) => {
              const on = conds.has(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => toggleCond(c.slug)}
                  aria-pressed={on}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    on
                      ? 'bg-forest-600 text-white'
                      : 'bg-cream-100 text-ink hover:bg-cream-200'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="space-y-4">
        {(meds.size === 0 && conds.size === 0) ? (
          <div className="rounded-2xl bg-cream-100 p-6 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-ink-subtle" aria-hidden />
            <p className="mt-3 font-serif text-lg font-bold text-ink">
              Pick medications + conditions on the left
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              We&apos;ll flag any herb interactions across the 30+ herbs in our therapeutic catalog.
            </p>
          </div>
        ) : hits.length === 0 ? (
          <div className="rounded-2xl bg-forest-50 p-6 ring-1 ring-forest-200">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-forest-700" aria-hidden />
              <div>
                <p className="font-serif text-lg font-bold text-forest-800">No flagged interactions</p>
                <p className="mt-2 text-sm text-ink">
                  Based on your selections, no documented contraindications appear with the herbs in our catalog. This does not mean zero risk — always tell your prescriber about every herb and supplement you take.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-cream-50 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                {hits.length} flag{hits.length === 1 ? '' : 's'} found across {grouped.size} herb{grouped.size === 1 ? '' : 's'}
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Sort order: severe first. Each flag explains why the interaction matters and cites the source.
              </p>
            </div>

            {[...grouped.entries()].map(([herbSlug, herbHits]) => {
              const herb = getHerb(herbSlug);
              if (!herb) return null;
              return (
                <article key={herbSlug} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/herbs/${herbSlug}`}
                      className="font-serif text-xl font-bold text-ink hover:text-terracotta-600"
                    >
                      {herb.name}
                    </Link>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {herbHits.length} flag{herbHits.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-3">
                    {herbHits.map((hit, i) => (
                      <li key={i} className="rounded-xl border border-ink/5 p-3">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <SeverityBadge severity={hit.rule.severity} />
                          <strong className="font-bold text-ink">
                            {hit.rule.triggerType === 'pregnancy'
                              ? 'During pregnancy'
                              : `Interacts with ${formatTrigger(hit.rule.trigger)}`}
                          </strong>
                        </div>
                        <p className="mt-2 text-sm text-ink-muted">{hit.rule.explanation}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-subtle">
                          Source: {hit.rule.source}
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: 'severe' | 'caution' | 'mild' }) {
  const styles =
    severity === 'severe'
      ? 'bg-red-100 text-red-700'
      : severity === 'caution'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-cream-200 text-ink';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles}`}>
      {severity === 'severe' || severity === 'caution' ? (
        <AlertTriangle className="h-3 w-3" aria-hidden />
      ) : null}
      {severity}
    </span>
  );
}

function formatTrigger(slug: string): string {
  const med = MEDICATIONS.find((m) => m.slug === slug);
  if (med) return med.name;
  const cond = USER_CONDITIONS.find((c) => c.slug === slug);
  if (cond) return cond.name;
  return slug.replace(/-/g, ' ');
}
