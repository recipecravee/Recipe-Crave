'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (attempts >= 3) {
      setError('Too many failed attempts. Refresh the page to try again.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        router.replace('/admin/dashboard');
        router.refresh();
        return;
      }
      setAttempts((n) => n + 1);
      setError(data.error ?? 'Invalid credentials');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-widest text-ink-subtle">
          Username
        </span>
        <input
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-xl border border-ink/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-terracotta-400 focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-widest text-ink-subtle">
          Password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-xl border border-ink/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-terracotta-400 focus:outline-none"
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy || attempts >= 3}
        className="w-full rounded-full bg-terracotta-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60 focus-ring"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
