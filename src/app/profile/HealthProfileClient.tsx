'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, RotateCcw, Save, Sparkles, Heart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONDITIONS } from '@/content/herbs';

const STORAGE_KEY = 'rc:health-profile';

type Profile = {
  conditions: string[];     // from herbs.ts CONDITIONS slugs
  diets: string[];           // dietary preferences
  allergies: string[];
  goals: string[];
};

const DIETS = [
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto',
  'paleo', 'low-carb', 'low-calorie', 'low-fat', 'low-sodium',
  'high-protein', 'diabetic', 'halal', 'kosher',
];

const ALLERGIES = [
  'tree nut', 'peanut', 'dairy', 'egg', 'gluten/wheat',
  'soy', 'shellfish', 'fish', 'sesame',
];

const GOALS = [
  'lose weight', 'build muscle', 'manage stress', 'better sleep',
  'lower blood pressure', 'lower cholesterol', 'increase energy',
  'reduce inflammation', 'gut health', 'pregnancy nutrition',
];

const EMPTY: Profile = { conditions: [], diets: [], allergies: [], goals: [] };

export function HealthProfileClient() {
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }, [profile, hydrated]);

  function toggle(field: keyof Profile, value: string) {
    setProfile((prev) => {
      const arr = prev[field];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [field]: next };
    });
  }

  function reset() {
    setProfile(EMPTY);
  }

  function persist() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Compute top recommended meal plan based on conditions
  const recommendedPlan = (() => {
    if (profile.conditions.includes('inflammation') || profile.conditions.includes('joint-health'))
      return { slug: '30-day-anti-inflammation', title: '30-Day Anti-Inflammation Plan' };
    if (profile.conditions.includes('blood-sugar'))
      return { slug: '30-day-diabetes-management', title: '30-Day Diabetes Management Plan' };
    if (profile.conditions.includes('digestion') || profile.conditions.includes('gut-health'))
      return { slug: '30-day-gut-healing', title: '30-Day Gut Healing Plan' };
    if (profile.conditions.includes('sleep-stress'))
      return { slug: '30-day-sleep-optimization', title: '30-Day Sleep Optimization Plan' };
    return null;
  })();

  // Recommended diet pages
  const recommendedDietPages = profile.diets.slice(0, 3);

  if (!hydrated) return <div className="h-32 animate-pulse rounded-2xl bg-cream-100" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
      <section className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-500">
            <Activity className="h-3.5 w-3.5" aria-hidden /> Conditions you manage
          </p>
          <p className="mt-1 text-xs text-ink-subtle">Tick anything that applies — affects meal-plan + herb recommendations.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CONDITIONS.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggle('conditions', c.slug)}
                aria-pressed={profile.conditions.includes(c.slug)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  profile.conditions.includes(c.slug)
                    ? 'bg-forest-600 text-white'
                    : 'bg-cream-100 text-ink hover:bg-cream-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-500">
            <Heart className="h-3.5 w-3.5" aria-hidden /> Dietary preferences
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {DIETS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggle('diets', d)}
                aria-pressed={profile.diets.includes(d)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  profile.diets.includes(d)
                    ? 'bg-terracotta-500 text-white'
                    : 'bg-cream-100 text-ink hover:bg-cream-200'
                }`}
              >
                {d.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Allergies</p>
          <p className="mt-1 text-xs text-ink-subtle">Recipes with flagged allergens get filtered or warning-tagged.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ALLERGIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggle('allergies', a)}
                aria-pressed={profile.allergies.includes(a)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  profile.allergies.includes(a)
                    ? 'bg-amber-600 text-white'
                    : 'bg-cream-100 text-ink hover:bg-cream-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-700">Cooking goals</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggle('goals', g)}
                aria-pressed={profile.goals.includes(g)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  profile.goals.includes(g)
                    ? 'bg-forest-600 text-white'
                    : 'bg-cream-100 text-ink hover:bg-cream-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" onClick={persist} size="sm">
            {saved ? <Check className="mr-1.5 h-4 w-4" /> : <Save className="mr-1.5 h-4 w-4" />}
            {saved ? 'Saved' : 'Save profile'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
          </Button>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-forest-50 to-cream-50 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-forest-700" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">
              Personalized recommendations
            </p>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            Updates as you tick conditions, diets, goals.
          </p>

          {recommendedPlan ? (
            <Link
              href={`/meal-plans/${recommendedPlan.slug}`}
              className="mt-3 block rounded-xl bg-white p-3 shadow-sm hover:shadow-md"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-terracotta-500">Recommended 30-day plan</p>
              <p className="mt-1 font-serif text-base font-bold text-ink">{recommendedPlan.title}</p>
            </Link>
          ) : null}

          {recommendedDietPages.length > 0 ? (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">Browse by diet</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {recommendedDietPages.map((d) => (
                  <Link
                    key={d}
                    href={`/diet/${d}`}
                    className="rounded-full bg-white px-2 py-1 text-[10px] font-bold capitalize text-terracotta-600 shadow-sm hover:bg-terracotta-50"
                  >
                    {d.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {profile.conditions.length > 0 ? (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">Herbs for your conditions</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {profile.conditions.slice(0, 3).map((c) => (
                  <Link
                    key={c}
                    href={`/conditions/${c}`}
                    className="rounded-full bg-forest-100 px-2 py-1 text-[10px] font-bold capitalize text-forest-700 hover:bg-forest-200"
                  >
                    {c.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {profile.conditions.length === 0 && profile.diets.length === 0 ? (
            <p className="mt-3 text-xs text-ink-subtle italic">
              Tick conditions / diets on the left to see personalized recommendations here.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <p className="text-[11px] text-amber-900">
            <strong>Safety reminder:</strong> If you take medications, also run our{' '}
            <Link href="/safety-check" className="font-bold underline hover:no-underline">
              herb-drug safety checker
            </Link>{' '}
            to flag any contraindications with the herbs your profile suggests.
          </p>
        </div>
      </aside>
    </div>
  );
}
