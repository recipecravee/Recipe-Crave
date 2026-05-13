'use client';

import { useState } from 'react';
import { Trash2, Plus, AlertTriangle, Sparkles } from 'lucide-react';
import { useUserPantry } from '@/lib/hooks/useUserPantry';

export function PantryManager() {
  const pantry = useUserPantry();
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = input.trim();
    if (!name) return;
    setBusy(true);
    await pantry.add(name);
    setInput('');
    setBusy(false);
  }

  async function onBulkAdd() {
    const lines = input
      .split(/[\n,]/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    setBusy(true);
    await pantry.addMany(lines, 'manual');
    setInput('');
    setBusy(false);
  }

  async function onClearAll() {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Remove every item in your pantry? This can not be undone.')) return;
    setBusy(true);
    await pantry.clear();
    setBusy(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
      <section>
        <form
          onSubmit={onAdd}
          className="mb-6 rounded-2xl border border-cream-200 bg-white p-5 shadow-sm"
        >
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-subtle">
              Add to pantry
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="onion, brown rice, chicken thighs…"
              className="mt-1 block w-full rounded-xl border border-ink/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-terracotta-400 focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-ink-subtle">
              Add one item or paste a comma- or newline-separated list and hit Bulk add.
            </p>
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60 focus-ring"
            >
              <Plus className="h-4 w-4" aria-hidden /> Add
            </button>
            <button
              type="button"
              onClick={onBulkAdd}
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-60 focus-ring"
            >
              <Sparkles className="h-4 w-4" aria-hidden /> Bulk add
            </button>
          </div>
        </form>

        {pantry.error ? (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>{pantry.error}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-cream-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
            <h2 className="font-serif text-xl">
              {pantry.loading
                ? 'Loading your pantry…'
                : `${pantry.items.length} ${pantry.items.length === 1 ? 'item' : 'items'} in your pantry`}
            </h2>
            {pantry.items.length > 0 ? (
              <button
                type="button"
                onClick={onClearAll}
                disabled={busy}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Clear all
              </button>
            ) : null}
          </div>

          {!pantry.loading && pantry.items.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-serif text-lg text-ink">Your pantry is empty.</p>
              <p className="mt-1 text-sm text-ink-muted">
                Add ingredients above so RecipeCrave can match recipes against what you have.
              </p>
            </div>
          ) : null}

          <ul className="divide-y divide-cream-200">
            {pantry.items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{it.ingredient}</p>
                  <p className="text-xs text-ink-subtle">
                    Added {new Date(it.created_at).toLocaleDateString()} · {it.source.replace('-', ' ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => pantry.remove(it.id)}
                  disabled={busy}
                  aria-label={`Remove ${it.ingredient}`}
                  className="rounded-md p-2 text-ink-subtle transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-forest-200 bg-forest-50/40 p-5">
          <h3 className="font-serif text-lg font-bold text-ink">Why sync your pantry?</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>📱 Same list on phone, tablet, and laptop.</li>
            <li>🍳 Recipe matcher finds dishes you can cook right now.</li>
            <li>🛒 Smart grocery lists know what to skip.</li>
            <li>♻️ Expiry tracking flags ingredients about to spoil.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-cream-200 bg-cream-50/60 p-5">
          <h3 className="font-serif text-lg font-bold text-ink">Privacy</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Pantry items are stored against your account in Supabase with row-level
            security — nobody else can read or modify your list. Clear at any time.
          </p>
        </div>
      </aside>
    </div>
  );
}
