'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, Ban, Loader2, RefreshCw } from 'lucide-react';

type Variation = {
  id: string;
  recipe_slug: string;
  display_name: string | null;
  body: string;
  ingredient_swaps: Array<{ from?: string; to?: string; reason?: string }>;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  helpful_count: number;
  created_at: string;
};

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'spam';

export function ModerationQueue() {
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [items, setItems] = useState<Variation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/variations?status=${filter}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = (await res.json()) as { items: Variation[] };
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function setStatus(id: string, next: StatusFilter) {
    setBusyIds((s) => new Set(s).add(id));
    try {
      const res = await fetch(`/api/admin/variations/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update.');
    } finally {
      setBusyIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }

  const filterCounts = (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {(['pending', 'approved', 'rejected', 'spam'] as StatusFilter[]).map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setFilter(f)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            filter === f
              ? 'bg-terracotta-500 text-white'
              : 'border border-ink/15 bg-white text-ink-muted hover:border-ink/30'
          }`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
      <button
        type="button"
        onClick={() => refresh()}
        aria-label="Refresh"
        className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs text-ink-muted hover:border-ink/30"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Refresh
      </button>
    </div>
  );

  return (
    <section>
      {filterCounts}

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading…
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-cream-200 bg-cream-50/60 p-10 text-center text-ink-muted">
          No {filter} submissions right now.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((v) => {
            const isBusy = busyIds.has(v.id);
            return (
              <li
                key={v.id}
                className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
                      <Link href={`/recipes/${v.recipe_slug}`} className="hover:underline">
                        {v.recipe_slug}
                      </Link>
                    </p>
                    <p className="font-serif text-lg font-bold text-ink">
                      {v.display_name?.trim() || 'Anonymous variation'}
                    </p>
                  </div>
                  <p className="text-xs text-ink-subtle">
                    Submitted {new Date(v.created_at).toLocaleString()} · {v.helpful_count} helpful
                  </p>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm text-ink-muted">{v.body}</p>

                {v.ingredient_swaps && v.ingredient_swaps.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-sm">
                    {v.ingredient_swaps.map((s, i) => (
                      <li key={i} className="rounded-lg bg-cream-50 px-3 py-1.5">
                        <span className="text-ink-muted line-through">{s.from ?? '?'}</span>
                        <span className="mx-2 text-terracotta-500">→</span>
                        <span className="text-ink">{s.to ?? '?'}</span>
                        {s.reason ? <span className="text-xs text-ink-subtle"> · {s.reason}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  {filter === 'pending' ? (
                    <>
                      <ActionButton onClick={() => setStatus(v.id, 'approved')} busy={isBusy} variant="approve">
                        <CheckCircle2 className="h-4 w-4" aria-hidden /> Approve
                      </ActionButton>
                      <ActionButton onClick={() => setStatus(v.id, 'rejected')} busy={isBusy} variant="reject">
                        <XCircle className="h-4 w-4" aria-hidden /> Reject
                      </ActionButton>
                      <ActionButton onClick={() => setStatus(v.id, 'spam')} busy={isBusy} variant="spam">
                        <Ban className="h-4 w-4" aria-hidden /> Spam
                      </ActionButton>
                    </>
                  ) : (
                    <ActionButton onClick={() => setStatus(v.id, 'pending')} busy={isBusy} variant="approve">
                      <RefreshCw className="h-4 w-4" aria-hidden /> Move back to pending
                    </ActionButton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ActionButton({
  onClick,
  busy,
  variant,
  children,
}: {
  onClick: () => void;
  busy: boolean;
  variant: 'approve' | 'reject' | 'spam';
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    approve: 'bg-forest-500 text-white hover:bg-forest-600',
    reject: 'border-2 border-ink/15 bg-white text-ink hover:border-ink/30',
    spam: 'bg-red-100 text-red-800 hover:bg-red-200',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
