import Link from 'next/link';
import Image from 'next/image';
import { Search, User } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function Header() {
  let user: { email: string | undefined } | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    user = data.user ? { email: data.user.email ?? undefined } : null;
  } catch {
    user = null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream-100/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label={`${SITE.name} home`} className="flex items-center gap-2 focus-ring rounded-md">
          <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9" priority unoptimized />
          <span className="font-serif text-xl">
            <span className="text-ink">Recipe</span>
            <span className="text-terracotta-400">Crave</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <form
            action="/recipes"
            method="get"
            className="hidden sm:flex w-full max-w-xs items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 shadow-sm focus-within:border-terracotta-400"
          >
            <Search className="h-4 w-4 text-ink-subtle" aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="Search recipes…"
              aria-label="Search recipes"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-subtle"
            />
          </form>
          {user ? (
            <Link
              href="/account"
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600 transition-colors hover:bg-terracotta-200 focus-ring"
              aria-label="My account"
              title={user.email}
            >
              <User className="h-4 w-4" aria-hidden />
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden lg:inline-block whitespace-nowrap text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-ring"
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      <nav aria-label="Mobile" className="container flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hide lg:hidden">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-xs font-medium text-ink-muted transition-colors hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
