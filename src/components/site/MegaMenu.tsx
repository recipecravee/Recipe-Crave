'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Sparkles, Camera, Mic, ShoppingCart, Flame, Search, User,
  ChefHat, Calendar, Heart, BookOpen, LayoutGrid, Calculator,
} from 'lucide-react';
import { CUISINES, DIETS } from '@/lib/constants';

type Feature = {
  href: string;
  title: string;
  desc: string;
  icon: typeof Sparkles;
  highlight?: boolean;
};

const FEATURES: Feature[] = [
  {
    href: '/meal-planner',
    title: 'AI Meal Planner',
    desc: 'Tell us your budget. Get a full week.',
    icon: Sparkles,
    highlight: true,
  },
  {
    href: '/pantry-match',
    title: 'Pantry Photo Scan',
    desc: 'Snap your fridge. Cook from it tonight.',
    icon: Camera,
    highlight: true,
  },
  {
    href: '/cook',
    title: 'Voice Cook Mode',
    desc: 'Hands-free, step-by-step.',
    icon: Mic,
    highlight: true,
  },
  {
    href: '/grocery-list',
    title: 'Smart Grocery Lists',
    desc: 'Multiple recipes, one list.',
    icon: ShoppingCart,
    highlight: true,
  },
  {
    href: '/recipes',
    title: 'Cost + Calories on every recipe',
    desc: 'Per-serving cost. Full macros.',
    icon: Flame,
  },
];

const BROWSE_LINKS = [
  { href: '/recipes', title: 'All Recipes', icon: BookOpen },
  { href: '/categories', title: 'Categories', icon: LayoutGrid },
  { href: '/collections', title: 'Collections', icon: Heart },
  { href: '/how-to', title: 'How-To Guides', icon: ChefHat },
  { href: '/calculators', title: 'Free Tools', icon: Calculator },
];

export function MegaMenu({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setFeaturesOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Desktop nav */}
      <nav aria-label="Main" className="hidden lg:flex items-center gap-6">
        <div
          className="relative"
          onMouseEnter={() => setFeaturesOpen(true)}
          onMouseLeave={() => setFeaturesOpen(false)}
        >
          <button
            type="button"
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-ring rounded px-1"
            aria-expanded={featuresOpen}
            aria-haspopup="true"
            onFocus={() => setFeaturesOpen(true)}
          >
            Features ▾
          </button>
          {featuresOpen ? (
            <div
              role="menu"
              className="absolute left-1/2 top-full z-50 mt-2 w-[640px] -translate-x-1/2 animate-fade-in rounded-2xl border border-ink/10 bg-white p-6 shadow-xl"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                What RecipeCrave does
              </p>
              <div className="grid grid-cols-2 gap-3">
                {FEATURES.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    role="menuitem"
                    className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-terracotta-200 hover:bg-cream-100"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-terracotta-100 text-terracotta-500 group-hover:bg-terracotta-200">
                      <f.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="font-serif text-sm font-semibold text-ink">{f.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{f.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-5 border-t border-ink/10 pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                  Popular cuisines
                </p>
                <div className="flex flex-wrap gap-2">
                  {CUISINES.slice(0, 8).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/cuisine/${c.slug}`}
                      role="menuitem"
                      className="rounded-full border border-ink/10 bg-cream-100 px-3 py-1 text-xs font-medium text-ink hover:border-terracotta-400 hover:text-terracotta-500"
                    >
                      <span aria-hidden className="mr-1">{c.emoji}</span>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <Link href="/recipes" className="text-sm font-medium text-ink-muted hover:text-ink focus-ring rounded px-1">
          Recipes
        </Link>
        <Link href="/categories" className="text-sm font-medium text-ink-muted hover:text-ink focus-ring rounded px-1">
          Categories
        </Link>
        <Link href="/collections" className="text-sm font-medium text-ink-muted hover:text-ink focus-ring rounded px-1">
          Collections
        </Link>

        <form
          action="/recipes"
          method="get"
          className="flex w-56 items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 shadow-sm focus-within:border-terracotta-400"
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

        {userEmail ? (
          <Link
            href="/account"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600 hover:bg-terracotta-200 focus-ring"
            aria-label="My account"
            title={userEmail}
          >
            <User className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <Link href="/login" className="whitespace-nowrap text-sm font-medium text-ink-muted hover:text-ink focus-ring rounded px-1">
            Log in
          </Link>
        )}
      </nav>

      {/* Mobile: search + hamburger */}
      <div className="flex items-center gap-2 lg:hidden">
        <Link
          href="/recipes"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-muted shadow-sm hover:text-ink focus-ring"
          aria-label="Search recipes"
        >
          <Search className="h-4 w-4" aria-hidden />
        </Link>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-400 text-white shadow-sm focus-ring"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu fullscreen overlay */}
      {open ? (
        <div className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto bg-cream-100 lg:hidden">
          <div className="container py-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              What RecipeCrave does
            </p>
            <div className="space-y-2">
              {FEATURES.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="flex items-center gap-3 rounded-xl border border-ink/5 bg-white p-3 transition-colors active:bg-cream-200"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-terracotta-100 text-terracotta-500">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-base font-semibold text-ink">{f.title}</p>
                    <p className="text-xs text-ink-muted">{f.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Browse
            </p>
            <div className="grid grid-cols-2 gap-2">
              {BROWSE_LINKS.map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm"
                >
                  <b.icon className="h-4 w-4 text-terracotta-500" aria-hidden />
                  <span className="text-sm font-medium text-ink">{b.title}</span>
                </Link>
              ))}
            </div>

            <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              By cuisine
            </p>
            <div className="flex flex-wrap gap-2">
              {CUISINES.slice(0, 12).map((c) => (
                <Link
                  key={c.slug}
                  href={`/cuisine/${c.slug}`}
                  className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink"
                >
                  <span aria-hidden>{c.emoji}</span>
                  {c.name}
                </Link>
              ))}
            </div>

            <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              By diet
            </p>
            <div className="flex flex-wrap gap-2">
              {DIETS.slice(0, 8).map((d) => (
                <Link
                  key={d.slug}
                  href={`/diet/${d.slug}`}
                  className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink"
                >
                  {d.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 border-t border-ink/10 pt-6">
              {userEmail ? (
                <Link href="/account" className="block rounded-xl bg-terracotta-400 px-4 py-3 text-center font-medium text-white">
                  My account
                </Link>
              ) : (
                <Link href="/login" className="block rounded-xl bg-terracotta-400 px-4 py-3 text-center font-medium text-white">
                  Log in / Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
