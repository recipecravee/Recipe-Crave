'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/**
 * Auth island for the header. Reads the user from the Supabase browser
 * client on the client only — that way the surrounding server-rendered
 * layout doesn't have to read cookies, which previously marked every
 * page dynamic and broke ISR caching of the homepage.
 *
 * While `loading` we render a neutral placeholder pill so layout
 * doesn't shift. Once Supabase resolves, swap to either the avatar
 * link (signed in) or the Log in button (signed out).
 */
export function AccountButton({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setEmail(data.user?.email ?? null);
      setLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Pre-load placeholder. Same size as the resolved buttons so there is
  // zero layout shift when auth state settles.
  if (!loaded) {
    return (
      <span
        aria-hidden
        className={
          variant === 'mobile'
            ? 'inline-block h-11 w-24 rounded-full bg-cream-100'
            : 'inline-block h-11 w-24 rounded-full bg-cream-100'
        }
      />
    );
  }

  if (variant === 'mobile') {
    // Big block pill for the mobile overlay.
    if (email) {
      return (
        <Link
          href="/account"
          className="block rounded-2xl bg-gradient-to-r from-terracotta-400 to-terracotta-500 px-5 py-4 text-center text-lg font-bold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          My account
        </Link>
      );
    }
    return (
      <Link
        href="/login"
        className="block rounded-2xl bg-gradient-to-r from-terracotta-400 to-terracotta-500 px-5 py-4 text-center text-lg font-bold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        Log in / Sign up
      </Link>
    );
  }

  if (email) {
    return (
      <Link
        href="/account"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600 hover:bg-terracotta-200 focus-ring"
        aria-label="My account"
        title={email}
      >
        <User className="h-5 w-5" aria-hidden />
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="whitespace-nowrap rounded-full bg-terracotta-500 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 focus-ring"
    >
      Log in
    </Link>
  );
}
