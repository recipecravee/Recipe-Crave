'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Sparkles, Camera, Mic, ShoppingCart, Flame, Search, User,
  ChefHat, Heart, BookOpen, LayoutGrid, Calculator, ChevronDown,
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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const featuresWrapRef = useRef<HTMLDivElement>(null);

  // Avoid SSR mismatch when portaling
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Close features dropdown on outside click + Escape
  useEffect(() => {
    if (!featuresOpen) return;
    function onClick(e: MouseEvent) {
      if (featuresWrapRef.current && !featuresWrapRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFeaturesOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [featuresOpen]);

  return (
    <>
      {/* Desktop nav */}
      <nav aria-label="Main" className="hidden lg:flex items-center gap-7">
        <div ref={featuresWrapRef} className="relative">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-base font-bold text-ink transition-colors hover:bg-cream-200 focus-ring"
            aria-expanded={featuresOpen}
            aria-haspopup="true"
            onClick={() => setFeaturesOpen((v) => !v)}
          >
            Features <ChevronDown className={`h-4 w-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          {featuresOpen ? (
            <div
              role="menu"
              className="absolute left-1/2 top-full z-50 mt-3 w-[640px] -translate-x-1/2 animate-fade-in rounded-2xl border border-ink/10 bg-white p-6 shadow-xl"
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

        <Link
          href="/recipes"
          className="group relative rounded-md px-2 py-1.5 text-base font-bold text-ink transition-colors hover:text-terracotta-500 focus-ring"
        >
          Recipes
          <span className="absolute inset-x-2 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-terracotta-400 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
        <Link
          href="/categories"
          className="group relative rounded-md px-2 py-1.5 text-base font-bold text-ink transition-colors hover:text-terracotta-500 focus-ring"
        >
          Categories
          <span className="absolute inset-x-2 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-terracotta-400 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
        <Link
          href="/collections"
          className="group relative rounded-md px-2 py-1.5 text-base font-bold text-ink transition-colors hover:text-terracotta-500 focus-ring"
        >
          Collections
          <span className="absolute inset-x-2 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-terracotta-400 transition-transform duration-300 group-hover:scale-x-100" />
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
            className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600 hover:bg-terracotta-200 focus-ring"
            aria-label="My account"
            title={userEmail}
          >
            <User className="h-5 w-5" aria-hidden />
          </Link>
        ) : (
          <Link
            href="/login"
            className="whitespace-nowrap rounded-full bg-terracotta-400 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-500 focus-ring"
          >
            Log in
          </Link>
        )}
      </nav>

      {/* Search + hamburger (desktop + mobile) */}
      <div className="flex items-center gap-2">
        <Link
          href="/recipes"
          className="flex h-12 w-12 touch-manipulation items-center justify-center rounded-full bg-white text-ink-muted shadow-sm hover:text-ink focus-ring"
          aria-label="Search recipes"
        >
          <Search className="h-5 w-5" aria-hidden />
        </Link>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-menu-overlay"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          style={{ WebkitTapHighlightColor: 'transparent' }}
          className="relative z-50 flex h-12 w-12 touch-manipulation items-center justify-center rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-500 text-white shadow-md ring-2 ring-white/40 transition-transform focus-ring hover:scale-105 active:scale-90"
        >
          <span className="relative flex h-6 w-6 items-center justify-center">
            <Menu
              className={`absolute h-6 w-6 transition-all duration-200 ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
              aria-hidden
            />
            <X
              className={`absolute h-6 w-6 transition-all duration-200 ${open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
              aria-hidden
            />
          </span>
        </button>
      </div>

      {/* Fullscreen overlay menu (desktop + mobile) — portaled to body to escape header's backdrop-filter containing block */}
      {open && mounted
        ? createPortal(
        <div id="primary-menu-overlay" role="dialog" aria-modal="true" aria-label="Main navigation" className="animate-fade-in fixed inset-x-0 top-20 bottom-0 z-[60] overflow-y-auto overscroll-contain bg-gradient-to-b from-cream-100 via-cream-50 to-cream-200 pb-safe backdrop-blur-sm">
          <div className="container py-8">
            <p className="mb-4 font-serif text-2xl font-bold text-ink">
              What <span className="text-terracotta-400">RecipeCrave</span> does
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group flex items-start gap-4 rounded-2xl border-2 border-ink/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-300 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-100 to-terracotta-200 text-terracotta-600 transition-colors group-hover:from-terracotta-300 group-hover:to-terracotta-400 group-hover:text-white">
                    <f.icon className="h-7 w-7" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg font-bold text-ink">{f.title}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">{f.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <p className="mb-4 mt-10 font-serif text-2xl font-bold text-ink">Browse</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {BROWSE_LINKS.map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  className="flex items-center gap-2 rounded-xl border-2 border-ink/5 bg-white px-4 py-3 shadow-sm transition-all hover:border-terracotta-300 hover:shadow-md active:scale-[0.98]"
                >
                  <b.icon className="h-5 w-5 text-terracotta-500" aria-hidden />
                  <span className="text-sm font-bold text-ink">{b.title}</span>
                </Link>
              ))}
            </div>

            <p className="mb-4 mt-10 font-serif text-2xl font-bold text-ink">By cuisine</p>
            <div className="flex flex-wrap gap-2">
              {CUISINES.slice(0, 14).map((c) => (
                <Link
                  key={c.slug}
                  href={`/cuisine/${c.slug}`}
                  className="flex items-center gap-1.5 rounded-full border-2 border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-400 hover:text-terracotta-500"
                >
                  <span className="text-base" aria-hidden>{c.emoji}</span>
                  {c.name}
                </Link>
              ))}
            </div>

            <p className="mb-4 mt-10 font-serif text-2xl font-bold text-ink">By diet</p>
            <div className="flex flex-wrap gap-2">
              {DIETS.slice(0, 10).map((d) => (
                <Link
                  key={d.slug}
                  href={`/diet/${d.slug}`}
                  className="rounded-full border-2 border-forest-200 bg-white px-4 py-2 text-sm font-bold text-forest-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-forest-400 hover:bg-forest-50"
                >
                  {d.name}
                </Link>
              ))}
            </div>

            <div className="mt-10 border-t-2 border-ink/10 pt-6">
              {userEmail ? (
                <Link
                  href="/account"
                  className="block rounded-2xl bg-gradient-to-r from-terracotta-400 to-terracotta-500 px-5 py-4 text-center text-lg font-bold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  My account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-2xl bg-gradient-to-r from-terracotta-400 to-terracotta-500 px-5 py-4 text-center text-lg font-bold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Log in / Sign up
                </Link>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )
        : null}
    </>
  );
}
