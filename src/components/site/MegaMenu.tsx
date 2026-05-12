'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Sparkles, Camera, Mic, ShoppingCart, Flame, User, ChefHat, Heart,
  BookOpen, LayoutGrid, Calculator, ChevronDown, Coffee, Globe, Wand2,
  Soup, Salad, Beef, Fish, Wheat, Carrot, Egg, CookingPot, Wine, Cake,
} from 'lucide-react';
import { CUISINES, DIETS } from '@/lib/constants';
import { IMG } from '@/content/image-bank';
import { SiteSearch } from './SiteSearch';

// ============================================================================
// Mega-panel data — three dropdowns: Recipes / Cuisines / Tips & Techniques
// Inspired by tasty.co + foodnetwork.com but tightened: every link points to a
// route that exists, every panel has a featured image tile + 3 themed columns +
// bottom CTA bar.
// ============================================================================

type ColumnGroup = {
  heading: string;
  items: Array<{ href: string; label: string; icon?: typeof Sparkles }>;
};

type MegaPanelKey = 'recipes' | 'cuisines' | 'tips';

type MegaPanel = {
  key: MegaPanelKey;
  trigger: string;
  featured: {
    eyebrow: string;
    title: string;
    blurb: string;
    href: string;
    image: string;
    cta: string;
  };
  columns: ColumnGroup[];
  bottomCta: { label: string; href: string }[];
};

const PANEL_RECIPES: MegaPanel = {
  key: 'recipes',
  trigger: 'Recipes',
  featured: {
    eyebrow: 'New this week',
    title: 'Hilda Baci Recipe Manual',
    blurb: '126 dishes across 14 categories. Snacks, pasta, rice, soups, stews, grills, cocktails — every one with a plating and pro-mistake guide.',
    href: '/recipes/a-z',
    image: IMG.jollofRice,
    cta: 'Browse A to Z',
  },
  columns: [
    {
      heading: 'Popular right now',
      items: [
        { href: '/recipes/nigerian-jollof-rice', label: 'Nigerian Jollof Rice' },
        { href: '/recipes/bolognese-sauce', label: 'Bolognese Sauce' },
        { href: '/recipes/mac-cheese', label: 'Mac & Cheese' },
        { href: '/recipes/butter-chicken-curry', label: 'Butter Chicken Curry' },
        { href: '/recipes/lasagne', label: 'Lasagne' },
        { href: '/recipes/banana-bread', label: 'Banana Bread' },
      ],
    },
    {
      heading: 'By course',
      items: [
        { href: '/categories', label: 'Breakfast', icon: Coffee },
        { href: '/categories', label: 'Snacks & Small Chops', icon: Sparkles },
        { href: '/categories', label: 'Soups', icon: Soup },
        { href: '/categories', label: 'Stews & Sauces', icon: CookingPot },
        { href: '/categories', label: 'Mains', icon: Beef },
        { href: '/categories', label: 'Sides', icon: Salad },
        { href: '/categories', label: 'Desserts', icon: Cake },
      ],
    },
    {
      heading: 'By ingredient',
      items: [
        { href: '/recipes?q=chicken', label: 'Chicken', icon: ChefHat },
        { href: '/recipes?q=beef', label: 'Beef', icon: Beef },
        { href: '/recipes?q=seafood', label: 'Seafood', icon: Fish },
        { href: '/recipes?q=pasta', label: 'Pasta & noodles', icon: Wheat },
        { href: '/recipes?q=rice', label: 'Rice & grains', icon: Wheat },
        { href: '/recipes?q=vegetable', label: 'Vegetables', icon: Carrot },
        { href: '/recipes?q=egg', label: 'Eggs', icon: Egg },
      ],
    },
  ],
  bottomCta: [
    { label: 'All recipes (200+)', href: '/recipes' },
    { label: 'A to Z index', href: '/recipes/a-z' },
    { label: 'Collections', href: '/collections' },
  ],
};

const PANEL_CUISINES: MegaPanel = {
  key: 'cuisines',
  trigger: 'Cuisines',
  featured: {
    eyebrow: 'Cuisine spotlight',
    title: 'West African — Nigeria, Ghana, Senegal',
    blurb: 'Jollof rice, egusi soup, suya, kelewele, ofada, akara, banga, edikang ikong. The recipes Hilda Baci built her record around.',
    href: '/cuisine/nigerian',
    image: IMG.efoRiro,
    cta: 'Open Nigerian cuisine',
  },
  columns: [
    {
      heading: 'African',
      items: [
        { href: '/cuisine/nigerian', label: 'Nigerian' },
        { href: '/cuisine/ghanaian', label: 'Ghanaian' },
        { href: '/cuisine/west-african', label: 'West African' },
        { href: '/cuisine/ethiopian', label: 'Ethiopian' },
        { href: '/cuisine/south-african', label: 'South African' },
        { href: '/cuisine/jamaican', label: 'Jamaican (diaspora)' },
      ],
    },
    {
      heading: 'Asian',
      items: [
        { href: '/cuisine/chinese', label: 'Chinese' },
        { href: '/cuisine/japanese', label: 'Japanese' },
        { href: '/cuisine/korean', label: 'Korean' },
        { href: '/cuisine/thai', label: 'Thai' },
        { href: '/cuisine/indian', label: 'Indian' },
        { href: '/cuisine/vietnamese', label: 'Vietnamese' },
      ],
    },
    {
      heading: 'European & Americas',
      items: [
        { href: '/cuisine/italian', label: 'Italian' },
        { href: '/cuisine/french', label: 'French' },
        { href: '/cuisine/spanish', label: 'Spanish' },
        { href: '/cuisine/mediterranean', label: 'Mediterranean' },
        { href: '/cuisine/american', label: 'American' },
        { href: '/cuisine/mexican', label: 'Mexican' },
        { href: '/cuisine/brazilian', label: 'Brazilian' },
      ],
    },
  ],
  bottomCta: [
    { label: `All ${CUISINES.length} cuisines`, href: '/categories' },
    { label: 'Around the world (collection)', href: '/collections/around-the-world-in-10-dinners' },
  ],
};

const PANEL_TIPS: MegaPanel = {
  key: 'tips',
  trigger: 'Tips & Techniques',
  featured: {
    eyebrow: 'Free kitchen tools',
    title: '6 free calculators that replace 6 apps',
    blurb: 'Cups → grams. Baking ratios. Storage shelf-life. Ingredient swaps. Real-time recipe scaler with cost. Oven temperature converter. No signup.',
    href: '/calculators',
    image: IMG.macAndCheese,
    cta: 'Open Kitchen Tools',
  },
  columns: [
    {
      heading: 'Calculators',
      items: [
        { href: '/calculators/unit-converter', label: 'Cups → grams', icon: Calculator },
        { href: '/calculators/baking-ratio', label: "Baker's percentage", icon: Calculator },
        { href: '/calculators/storage-life-guide', label: 'Storage life', icon: Calculator },
        { href: '/calculators/ingredient-substitutions', label: 'Ingredient swaps', icon: Calculator },
        { href: '/calculators/realtime-recipe-scaler', label: 'Recipe scaler', icon: Calculator },
        { href: '/calculators/temperature-adjuster', label: 'Oven temp adjuster', icon: Calculator },
      ],
    },
    {
      heading: 'How-to & techniques',
      items: [
        { href: '/how-to', label: 'All how-to guides', icon: ChefHat },
        { href: '/cook', label: 'Voice cook mode', icon: Mic },
        { href: '/pantry-match', label: 'Pantry photo scan', icon: Camera },
        { href: '/meal-planner', label: 'AI meal planner', icon: Sparkles },
      ],
    },
    {
      heading: 'Smart features',
      items: [
        { href: '/grocery-list', label: 'Smart grocery list', icon: ShoppingCart },
        { href: '/recipes', label: 'Cost + calories on every recipe', icon: Flame },
        { href: '/categories', label: 'Categories index', icon: LayoutGrid },
        { href: '/collections', label: 'Hand-picked collections', icon: Heart },
      ],
    },
  ],
  bottomCta: [
    { label: 'All kitchen tools', href: '/calculators' },
    { label: 'How-to guides', href: '/how-to' },
  ],
};

const PANELS: Record<MegaPanelKey, MegaPanel> = {
  recipes: PANEL_RECIPES,
  cuisines: PANEL_CUISINES,
  tips: PANEL_TIPS,
};

const FEATURED_MOBILE = [
  { href: '/meal-planner', title: 'AI Meal Planner', desc: 'Build a week from your budget and pantry.', icon: Sparkles },
  { href: '/pantry-match', title: 'Pantry Photo Scan', desc: 'Snap your fridge. Cook from it tonight.', icon: Camera },
  { href: '/cook', title: 'Voice Cook Mode', desc: 'Hands-free, step-by-step.', icon: Mic },
  { href: '/grocery-list', title: 'Smart Grocery Lists', desc: 'Multiple recipes, one list.', icon: ShoppingCart },
];

// ============================================================================
// Component
// ============================================================================

export function MegaMenu({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<MegaPanelKey | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const navWrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setOpen(false);
    setOpenPanel(null);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close active panel on outside click + Escape
  useEffect(() => {
    if (!openPanel) return;
    function onClick(e: MouseEvent) {
      if (navWrapRef.current && !navWrapRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenPanel(null);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [openPanel]);

  function togglePanel(key: MegaPanelKey) {
    setOpenPanel((prev) => (prev === key ? null : key));
  }

  return (
    <>
      {/* Desktop nav */}
      <nav ref={navWrapRef} aria-label="Main" className="hidden lg:flex flex-1 items-center gap-5">
        {(Object.keys(PANELS) as MegaPanelKey[]).map((key) => {
          const panel = PANELS[key];
          const isOpen = openPanel === key;
          return (
            <div key={key} className="relative">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => togglePanel(key)}
                onMouseEnter={() => setOpenPanel(key)}
                className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-base font-bold transition-colors focus-ring ${
                  isOpen ? 'bg-cream-200 text-terracotta-600' : 'text-ink hover:bg-cream-200'
                }`}
              >
                {panel.trigger}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>
            </div>
          );
        })}

        <Link
          href="/collections"
          className="group relative rounded-md px-2 py-1.5 text-base font-bold text-ink transition-colors hover:text-terracotta-500 focus-ring"
        >
          Collections
          <span className="absolute inset-x-2 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-terracotta-400 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-3">
          <div className="w-44 xl:w-56">
            <SiteSearch variant="inline" placeholder="Search…" />
          </div>
          <Link
            href="/calculators"
            className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-forest-500 to-forest-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:from-forest-600 hover:to-forest-700 hover:shadow-md focus-ring"
          >
            <Calculator className="h-4 w-4 transition-transform group-hover:rotate-6" aria-hidden />
            Kitchen Tools
          </Link>
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
        </div>

        {/* Mega panel — anchored to nav wrapper, full-width centered */}
        {openPanel ? (
          <div
            role="menu"
            aria-label={`${PANELS[openPanel].trigger} menu`}
            onMouseLeave={() => setOpenPanel(null)}
            className="animate-fade-in absolute left-0 right-0 top-full z-50 mt-3 rounded-2xl border border-ink/10 bg-white p-6 shadow-2xl"
          >
            <MegaPanelContent panel={PANELS[openPanel]} />
          </div>
        ) : null}
      </nav>

      {/* Mobile: search icon + hamburger */}
      <div className="flex items-center gap-2 lg:hidden">
        <SiteSearch variant="icon" />
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

      {/* Mobile fullscreen overlay */}
      {open && mounted
        ? createPortal(
            <MobileOverlay panels={Object.values(PANELS)} featured={FEATURED_MOBILE} userEmail={userEmail} />,
            document.body,
          )
        : null}
    </>
  );
}

// ============================================================================
// Desktop mega-panel content
// ============================================================================

function MegaPanelContent({ panel }: { panel: MegaPanel }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,2.6fr]">
      {/* Featured image card */}
      <Link
        href={panel.featured.href}
        className="group relative overflow-hidden rounded-xl bg-cream-100"
      >
        <div className="relative aspect-[4/3] w-full">
          {panel.featured.image ? (
            <Image
              src={panel.featured.image}
              alt=""
              fill
              sizes="(max-width: 1280px) 30vw, 380px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta-200">
            {panel.featured.eyebrow}
          </p>
          <p className="mt-1 font-serif text-xl font-bold leading-tight">
            {panel.featured.title}
          </p>
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-white/90">
            {panel.featured.blurb}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-terracotta-400 px-3 py-1 text-xs font-bold transition-colors group-hover:bg-terracotta-500">
            {panel.featured.cta} →
          </span>
        </div>
      </Link>

      {/* Column groups */}
      <div className="flex flex-col">
        <div className="grid flex-1 grid-cols-3 gap-6">
          {panel.columns.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-subtle">
                {col.heading}
              </p>
              <ul className="space-y-1.5">
                {col.items.map((it) => (
                  <li key={it.href + it.label}>
                    <Link
                      href={it.href}
                      className="group/li flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-cream-100 hover:text-terracotta-500"
                    >
                      {it.icon ? <it.icon className="h-3.5 w-3.5 text-terracotta-400" aria-hidden /> : null}
                      <span>{it.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        {panel.bottomCta.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/5 pt-4">
            {panel.bottomCta.map((c) => (
              <Link
                key={c.href + c.label}
                href={c.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3.5 py-1.5 text-xs font-bold text-terracotta-600 transition-colors hover:bg-terracotta-100"
              >
                {c.label} →
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ============================================================================
// Mobile overlay
// ============================================================================

function MobileOverlay({
  panels,
  featured,
  userEmail,
}: {
  panels: MegaPanel[];
  featured: typeof FEATURED_MOBILE;
  userEmail?: string;
}) {
  const [accordionOpen, setAccordionOpen] = useState<MegaPanelKey | null>('recipes');

  return (
    <div
      id="primary-menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      className="animate-fade-in fixed inset-x-0 top-20 bottom-0 z-[60] overflow-y-auto overscroll-contain bg-gradient-to-b from-cream-100 via-cream-50 to-cream-200 pb-safe backdrop-blur-sm"
    >
      <div className="container py-6">
        {/* Featured smart-feature cards */}
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-subtle">
          Smart features
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {featured.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group flex items-start gap-3 rounded-2xl border-2 border-ink/5 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-300 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-100 to-terracotta-200 text-terracotta-600 group-hover:from-terracotta-300 group-hover:to-terracotta-400 group-hover:text-white">
                <f.icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-sm font-bold text-ink">{f.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Kitchen Tools hero CTA */}
        <Link
          href="/calculators"
          className="group mt-6 flex items-center gap-4 rounded-2xl border-2 border-forest-300 bg-gradient-to-r from-forest-50 via-forest-100 to-cream-100 p-4 shadow-md transition-all hover:-translate-y-0.5 hover:border-forest-500 hover:shadow-lg active:scale-[0.99]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-white shadow-sm transition-transform group-hover:scale-110">
            <Calculator className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-forest-600">Free · No signup · 6 live tools</p>
            <p className="font-serif text-base font-bold text-ink">Kitchen Tools &amp; Calculators</p>
          </div>
          <span className="hidden sm:inline-flex shrink-0 rounded-full bg-forest-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Open
          </span>
        </Link>

        {/* Accordion sections — one per desktop mega-panel */}
        <div className="mt-7 space-y-3">
          {panels.map((panel) => {
            const isOpen = accordionOpen === panel.key;
            return (
              <div key={panel.key} className="overflow-hidden rounded-2xl border-2 border-ink/5 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setAccordionOpen(isOpen ? null : panel.key)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-4 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-100 text-terracotta-600">
                      {panel.key === 'recipes' ? <BookOpen className="h-5 w-5" /> : null}
                      {panel.key === 'cuisines' ? <Globe className="h-5 w-5" /> : null}
                      {panel.key === 'tips' ? <Wand2 className="h-5 w-5" /> : null}
                    </span>
                    <span className="font-serif text-lg font-bold text-ink">{panel.trigger}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-ink-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-ink/5 bg-cream-50 px-4 py-4">
                    {/* Featured tile compact */}
                    <Link
                      href={panel.featured.href}
                      className="mb-4 flex items-center gap-3 overflow-hidden rounded-xl bg-white p-2 shadow-sm"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                        {panel.featured.image ? (
                          <Image src={panel.featured.image} alt="" fill sizes="64px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-terracotta-500">
                          {panel.featured.eyebrow}
                        </p>
                        <p className="font-serif text-sm font-bold leading-tight text-ink">
                          {panel.featured.title}
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold text-terracotta-600">{panel.featured.cta} →</p>
                      </div>
                    </Link>

                    {/* Column groups stacked */}
                    <div className="space-y-4">
                      {panel.columns.map((col) => (
                        <div key={col.heading}>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-subtle">
                            {col.heading}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {col.items.map((it) => (
                              <Link
                                key={it.href + it.label}
                                href={it.href}
                                className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition-colors hover:border-terracotta-400 hover:text-terracotta-500"
                              >
                                {it.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTAs */}
                    {panel.bottomCta.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/5 pt-3">
                        {panel.bottomCta.map((c) => (
                          <Link
                            key={c.href + c.label}
                            href={c.href}
                            className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-100 px-3 py-1.5 text-[11px] font-bold text-terracotta-600 transition-colors hover:bg-terracotta-200"
                          >
                            {c.label} →
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Collections quick-link */}
        <Link
          href="/collections"
          className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-ink/5 bg-white p-4 shadow-sm transition-all hover:border-terracotta-300 hover:shadow-md"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-100 text-terracotta-600">
            <Heart className="h-5 w-5" />
          </span>
          <span className="font-serif text-lg font-bold text-ink">Collections</span>
        </Link>

        {/* Cuisine + diet pill rows (kept from previous overlay) */}
        <p className="mb-3 mt-8 font-serif text-base font-bold text-ink">By cuisine</p>
        <div className="flex flex-wrap gap-2">
          {CUISINES.slice(0, 12).map((c) => (
            <Link
              key={c.slug}
              href={`/cuisine/${c.slug}`}
              className="flex items-center gap-1.5 rounded-full border-2 border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-400 hover:text-terracotta-500"
            >
              <span aria-hidden>{c.emoji}</span>
              {c.name}
            </Link>
          ))}
        </div>

        <p className="mb-3 mt-7 font-serif text-base font-bold text-ink">By diet</p>
        <div className="flex flex-wrap gap-2">
          {DIETS.slice(0, 10).map((d) => (
            <Link
              key={d.slug}
              href={`/diet/${d.slug}`}
              className="rounded-full border-2 border-forest-200 bg-white px-3 py-1.5 text-xs font-bold text-forest-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-forest-400 hover:bg-forest-50"
            >
              {d.name}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="mt-8 border-t-2 border-ink/10 pt-5">
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
    </div>
  );
}
