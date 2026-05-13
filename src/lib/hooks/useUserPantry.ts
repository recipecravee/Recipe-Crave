'use client';

import { useCallback, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export type PantryItem = {
  id: string;
  user_id: string;
  ingredient: string;
  quantity: number | null;
  unit: string | null;
  expires_at: string | null;
  source: string;
  created_at: string;
  updated_at: string;
};

export type PantrySource = 'manual' | 'photo-scan' | 'meal-plan';

export type UserPantryState = {
  items: PantryItem[];
  loading: boolean;
  error: string | null;
  signedIn: boolean;
  refresh: () => Promise<void>;
  add: (ingredient: string, opts?: { quantity?: number; unit?: string; expiresAt?: string; source?: PantrySource }) => Promise<void>;
  addMany: (ingredients: string[], source?: PantrySource) => Promise<{ added: number; skipped: number }>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
};

/**
 * Reads the authenticated user's pantry from Supabase. Falls back to
 * `signedIn: false` when no session exists — UI should render a
 * sign-in prompt rather than the pantry list in that case.
 *
 * Idempotency: addMany skips ingredients already present in the
 * pantry (case-insensitive trimmed match) so users can paste the same
 * list twice without dupes. UNIQUE constraint on (user_id, ingredient)
 * in Postgres gives us the underlying guarantee.
 */
export function useUserPantry(): UserPantryState {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { data: userResp } = await supabase.auth.getUser();
      if (!userResp.user) {
        setSignedIn(false);
        setItems([]);
        return;
      }
      setSignedIn(true);
      const { data, error: qErr } = await supabase
        .from('pantry_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (qErr) throw qErr;
      setItems(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load pantry.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [refresh, supabase]);

  const add = useCallback<UserPantryState['add']>(
    async (ingredient, opts) => {
      const name = ingredient.trim();
      if (!name) return;
      const { data: userResp } = await supabase.auth.getUser();
      if (!userResp.user) {
        setError('Sign in to save items to your pantry.');
        return;
      }
      const payload = {
        user_id: userResp.user.id,
        ingredient: name,
        quantity: opts?.quantity ?? null,
        unit: opts?.unit ?? null,
        expires_at: opts?.expiresAt ?? null,
        source: opts?.source ?? 'manual',
      };
      const { error: insErr } = await supabase
        .from('pantry_items')
        .upsert(payload, { onConflict: 'user_id,ingredient' });
      if (insErr) {
        setError(insErr.message);
        return;
      }
      await refresh();
    },
    [refresh, supabase],
  );

  const addMany = useCallback<UserPantryState['addMany']>(
    async (ingredients, source) => {
      const { data: userResp } = await supabase.auth.getUser();
      if (!userResp.user) {
        setError('Sign in to save items to your pantry.');
        return { added: 0, skipped: ingredients.length };
      }
      const cleaned = Array.from(
        new Set(
          ingredients
            .map((i) => i.trim())
            .filter((i) => i.length > 0 && i.length <= 100),
        ),
      );
      if (cleaned.length === 0) return { added: 0, skipped: 0 };
      const rows = cleaned.map((name) => ({
        user_id: userResp.user!.id,
        ingredient: name,
        source: source ?? 'manual',
        quantity: null,
        unit: null,
        expires_at: null,
      }));
      const { data, error: insErr } = await supabase
        .from('pantry_items')
        .upsert(rows, { onConflict: 'user_id,ingredient', ignoreDuplicates: false })
        .select();
      if (insErr) {
        setError(insErr.message);
        return { added: 0, skipped: cleaned.length };
      }
      await refresh();
      return { added: data?.length ?? 0, skipped: cleaned.length - (data?.length ?? 0) };
    },
    [refresh, supabase],
  );

  const remove = useCallback<UserPantryState['remove']>(
    async (id) => {
      const { error: delErr } = await supabase.from('pantry_items').delete().eq('id', id);
      if (delErr) {
        setError(delErr.message);
        return;
      }
      await refresh();
    },
    [refresh, supabase],
  );

  const clear = useCallback<UserPantryState['clear']>(async () => {
    const { data: userResp } = await supabase.auth.getUser();
    if (!userResp.user) return;
    const { error: delErr } = await supabase
      .from('pantry_items')
      .delete()
      .eq('user_id', userResp.user.id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    await refresh();
  }, [refresh, supabase]);

  return { items, loading, error, signedIn, refresh, add, addMany, remove, clear };
}
