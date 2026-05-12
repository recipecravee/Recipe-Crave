'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function AdminLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
