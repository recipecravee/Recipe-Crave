'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

type Props = {
  /** Fallback href when there is no history entry. Defaults to `/`. */
  fallback?: string;
  /** Optional label override. Defaults to "Back". */
  label?: string;
  /** Show a separate Home link next to Back. Default true. */
  withHome?: boolean;
};

export function BackButton({ fallback = '/', label = 'Back', withHome = true }: Props) {
  const router = useRouter();

  function goBack() {
    // If browsing history exists, go back. Otherwise fall back.
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink-muted shadow-sm transition-colors hover:border-terracotta-400 hover:text-terracotta-500 focus-ring"
        aria-label={label}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        {label}
      </button>
      {withHome ? (
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink-muted shadow-sm transition-colors hover:border-terracotta-400 hover:text-terracotta-500 focus-ring"
          aria-label="Home"
        >
          <Home className="h-3.5 w-3.5" aria-hidden />
          Home
        </Link>
      ) : null}
    </div>
  );
}
