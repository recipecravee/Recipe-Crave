'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DIETS } from '@/lib/constants';

type Plan = {
  day: string;
  recipeTitle: string;
  course: string;
  estimatedCostUsd: number;
  estimatedCalories: number;
  notes?: string;
};

type GenerateResult = {
  plan: Plan[];
  groceryList: string[];
  totalCostUsd: number;
};

export function MealPlannerClient() {
  const [householdSize, setHouseholdSize] = useState(2);
  const [weeklyBudgetUsd, setWeeklyBudgetUsd] = useState(60);
  const [diet, setDiet] = useState<string>('');
  const [pantry, setPantry] = useState('');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdSize,
          weeklyBudgetUsd,
          diet: diet || undefined,
          pantry: pantry
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      const data = (await res.json()) as { ok: boolean; plan?: GenerateResult; error?: string };
      if (data.ok && data.plan) {
        setResult(data.plan);
      } else {
        setError(data.error ?? 'Could not generate plan. Try again.');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,1.5fr]">
      <form onSubmit={handleGenerate} className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <label htmlFor="household" className="text-sm font-medium">
              Household size
            </label>
            <Input
              id="household"
              type="number"
              min={1}
              max={12}
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="budget" className="text-sm font-medium">
              Weekly grocery budget (USD)
            </label>
            <Input
              id="budget"
              type="number"
              min={10}
              max={500}
              value={weeklyBudgetUsd}
              onChange={(e) => setWeeklyBudgetUsd(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="diet" className="text-sm font-medium">
              Dietary preference (optional)
            </label>
            <select
              id="diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-ink/15 bg-white px-4 text-sm"
            >
              <option value="">Any</option>
              {DIETS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pantry" className="text-sm font-medium">
              What&apos;s already in your pantry? (comma-separated)
            </label>
            <Input
              id="pantry"
              placeholder="rice, chicken, onions, garlic, canned tomatoes"
              value={pantry}
              onChange={(e) => setPantry(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? 'Generating your week…' : 'Generate my meal plan'}
          </Button>
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
        </div>
      </form>

      <div>
        {!result ? (
          <div className="rounded-2xl border-2 border-dashed border-ink/10 p-12 text-center">
            <p className="font-serif text-2xl text-ink">Your week, plated.</p>
            <p className="mt-2 text-ink-muted">Fill out the form and we&apos;ll build your seven-day plan in about 20 seconds.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl bg-forest-500 p-6 text-white">
              <p className="text-sm uppercase tracking-wider opacity-80">Your week</p>
              <p className="mt-1 font-serif text-3xl">
                ${result.totalCostUsd.toFixed(2)} · {result.plan.length} meals
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl">7-day plan</h2>
              <ul className="mt-4 space-y-3">
                {result.plan.map((p, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-ink/5 pb-3 last:border-0">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink-muted">
                        {p.day} · {p.course}
                      </p>
                      <p className="font-medium text-ink">{p.recipeTitle}</p>
                      {p.notes ? <p className="text-xs text-ink-muted">{p.notes}</p> : null}
                    </div>
                    <div className="text-right text-xs text-ink-muted">
                      <p>${p.estimatedCostUsd.toFixed(2)}</p>
                      <p>{p.estimatedCalories} kcal</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl">Grocery list</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {result.groceryList.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-ink/20 text-terracotta-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
