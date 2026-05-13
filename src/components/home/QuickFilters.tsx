import Link from 'next/link';
import { Clock, Users, Leaf, Globe, Flame, Sparkles, ArrowRight } from 'lucide-react';

/**
 * Quick Filters widget for the homepage.
 *
 * Strategy doc requires a prominent search-and-filter widget that lets a
 * user narrow recipes by Time / Diet / Method / Cuisine without scrolling.
 * Each filter is a direct deep-link to an existing browse page so the
 * widget remains 100% SSR + crawler-friendly.
 *
 * Layout: four equal panels (Cook Time / Diet / Method / Cuisine) plus a
 * single-row Servings footer. Each panel has a header icon + label + a
 * "View all" tail link so a user who doesn't see the option they want can
 * still reach the full taxonomy in one tap. Every chip is a real Link.
 */
export function QuickFilters() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-cream-100 via-cream-50 to-terracotta-50 p-5 shadow-sm sm:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-7">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-terracotta-500" aria-hidden />
          <h2 className="font-serif text-xl font-bold text-ink sm:text-2xl">
            Find your next meal in seconds
          </h2>
        </div>
        <p className="text-xs font-medium text-ink-muted">
          Pick a filter — we deep-link straight to results.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <FilterPanel
          icon={Clock}
          tone="terracotta"
          title="By cook time"
          tail={{ href: '/recipes', label: 'Browse all' }}
          chips={[
            { href: '/cook-time/under-15-minutes', label: 'Under 15 min' },
            { href: '/cook-time/under-30-minutes', label: 'Under 30 min' },
            { href: '/cook-time/under-1-hour', label: 'Under 1 hour' },
            { href: '/cook-time/over-1-hour', label: 'Weekend project' },
          ]}
        />

        <FilterPanel
          icon={Leaf}
          tone="forest"
          title="By diet"
          tail={{ href: '/diets', label: 'All 24 diets' }}
          chips={[
            { href: '/diet/vegetarian', label: 'Vegetarian' },
            { href: '/diet/vegan', label: 'Vegan' },
            { href: '/diet/gluten-free', label: 'Gluten-free' },
            { href: '/diet/keto', label: 'Keto' },
            { href: '/diet/high-protein', label: 'High-protein' },
            { href: '/diet/dairy-free', label: 'Dairy-free' },
          ]}
        />

        <FilterPanel
          icon={Flame}
          tone="amber"
          title="By cooking method"
          tail={{ href: '/recipes', label: 'Browse all' }}
          chips={[
            { href: '/method/air-fryer', label: 'Air fryer' },
            { href: '/method/oven', label: 'Oven' },
            { href: '/method/stovetop', label: 'Stovetop' },
            { href: '/method/slow-cooker', label: 'Slow cooker' },
            { href: '/method/grilling', label: 'Grilling' },
            { href: '/method/no-cook', label: 'No cook' },
          ]}
        />

        <FilterPanel
          icon={Globe}
          tone="cream"
          title="By cuisine"
          tail={{ href: '/cuisines', label: 'All 67 cuisines' }}
          chips={[
            { href: '/cuisine/nigerian', label: '🍲 Nigerian' },
            { href: '/cuisine/italian', label: '🍝 Italian' },
            { href: '/cuisine/mexican', label: '🌮 Mexican' },
            { href: '/cuisine/indian', label: '🍛 Indian' },
            { href: '/cuisine/chinese', label: '🥡 Chinese' },
            { href: '/cuisine/japanese', label: '🍱 Japanese' },
            { href: '/cuisine/thai', label: '🍜 Thai' },
            { href: '/cuisine/mediterranean', label: '🥗 Med' },
          ]}
        />
      </div>

      {/* Servings — equal-weight horizontal panel, sits below the 4-card grid.
          Compact on mobile, comfortable on desktop. */}
      <div className="mt-3 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm sm:mt-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-subtle">
            <Users className="h-4 w-4 text-ink" aria-hidden /> Serving size
          </div>
          <Chip href="/servings/individual" label="Just me" tone="ink" />
          <Chip href="/servings/couple" label="For two" tone="ink" />
          <Chip href="/servings/family" label="Family of 4" tone="ink" />
          <Chip href="/servings/party" label="Party (8+)" tone="ink" />
        </div>
      </div>
    </section>
  );
}

type Tone = 'terracotta' | 'forest' | 'amber' | 'cream' | 'ink';

function FilterPanel({
  icon: Icon,
  title,
  tone,
  chips,
  tail,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  tone: Tone;
  chips: { href: string; label: string }[];
  tail: { href: string; label: string };
}) {
  // Tone-driven header color + tail-link color. Body remains neutral so
  // chips render consistently across panels.
  const headerToneClass: Record<Tone, string> = {
    terracotta: 'text-terracotta-600',
    forest: 'text-forest-700',
    amber: 'text-amber-700',
    cream: 'text-terracotta-500',
    ink: 'text-ink',
  };
  return (
    <div className="rounded-2xl border border-ink/5 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${headerToneClass[tone]}`}>
          <Icon className="h-4 w-4" aria-hidden />
          {title}
        </div>
        <Link
          href={tail.href}
          className="inline-flex items-center gap-0.5 text-xs font-bold text-ink-muted hover:text-ink"
        >
          {tail.label}
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {chips.map((c) => (
          <Chip key={c.href} href={c.href} label={c.label} tone={tone} />
        ))}
      </div>
    </div>
  );
}

function Chip({ href, label, tone }: { href: string; label: string; tone: Tone }) {
  const toneClass: Record<Tone, string> = {
    terracotta: 'border-terracotta-200 bg-terracotta-50 text-terracotta-700 hover:border-terracotta-500 hover:bg-terracotta-100 hover:text-terracotta-800',
    forest: 'border-forest-200 bg-forest-50 text-forest-700 hover:border-forest-500 hover:bg-forest-100 hover:text-forest-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-500 hover:bg-amber-100 hover:text-amber-900',
    cream: 'border-cream-300 bg-cream-50 text-ink hover:border-terracotta-300 hover:bg-cream-100 hover:text-terracotta-700',
    ink: 'border-ink/15 bg-cream-50 text-ink hover:border-ink hover:bg-white',
  };
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[28px] items-center rounded-full border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-ring sm:min-h-[32px] sm:px-4 sm:py-2.5 sm:text-sm ${toneClass[tone]}`}
    >
      {label}
    </Link>
  );
}
