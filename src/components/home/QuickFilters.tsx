import Link from 'next/link';
import { Clock, Users, Leaf, Globe, Flame, Sparkles } from 'lucide-react';

/**
 * Quick Filters widget for the homepage.
 *
 * Strategy doc requires a prominent search-and-filter widget that lets a
 * user narrow recipes by Time / Servings / Dietary / Cuisine without
 * scrolling. Each filter is a direct deep-link to an existing browse page.
 *
 * Layout: 4 stacked sections (Time, Diet, Servings, Cuisine). Mobile-first
 * with flex-wrap. Each pill is a hard Link so SSR + crawler-friendly.
 */
export function QuickFilters() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-cream-100 via-cream-50 to-terracotta-50 p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-terracotta-500" aria-hidden />
        <h2 className="font-serif text-xl font-bold text-ink sm:text-2xl">
          Find your next meal in seconds
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* By time */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-subtle">
            <Clock className="h-3.5 w-3.5" aria-hidden /> By cook time
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill href="/cook-time/under-15-minutes" label="Under 15 min" tone="terracotta" />
            <FilterPill href="/cook-time/under-30-minutes" label="Under 30 min" tone="terracotta" />
            <FilterPill href="/cook-time/under-1-hour" label="Under 1 hour" tone="terracotta" />
            <FilterPill href="/cook-time/over-1-hour" label="Weekend project" tone="terracotta" />
          </div>
        </div>

        {/* By diet */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-subtle">
            <Leaf className="h-3.5 w-3.5" aria-hidden /> By diet
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill href="/diet/vegetarian" label="Vegetarian" tone="forest" />
            <FilterPill href="/diet/vegan" label="Vegan" tone="forest" />
            <FilterPill href="/diet/gluten-free" label="Gluten-free" tone="forest" />
            <FilterPill href="/diet/keto" label="Keto" tone="forest" />
            <FilterPill href="/diet/high-protein" label="High-protein" tone="forest" />
            <FilterPill href="/diet/dairy-free" label="Dairy-free" tone="forest" />
          </div>
        </div>

        {/* By cooking method */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-subtle">
            <Flame className="h-3.5 w-3.5" aria-hidden /> By cooking method
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill href="/method/air-fryer" label="Air fryer" tone="amber" />
            <FilterPill href="/method/oven" label="Oven" tone="amber" />
            <FilterPill href="/method/stovetop" label="Stovetop" tone="amber" />
            <FilterPill href="/method/slow-cooker" label="Slow cooker" tone="amber" />
            <FilterPill href="/method/grilling" label="Grilling" tone="amber" />
            <FilterPill href="/method/no-cook" label="No cook" tone="amber" />
          </div>
        </div>

        {/* By cuisine */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-subtle">
            <Globe className="h-3.5 w-3.5" aria-hidden /> By cuisine
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill href="/cuisine/nigerian" label="🍲 Nigerian" tone="cream" />
            <FilterPill href="/cuisine/italian" label="🍝 Italian" tone="cream" />
            <FilterPill href="/cuisine/mexican" label="🌮 Mexican" tone="cream" />
            <FilterPill href="/cuisine/indian" label="🍛 Indian" tone="cream" />
            <FilterPill href="/cuisine/chinese" label="🥡 Chinese" tone="cream" />
            <FilterPill href="/cuisine/japanese" label="🍱 Japanese" tone="cream" />
            <FilterPill href="/cuisine/thai" label="🍜 Thai" tone="cream" />
            <FilterPill href="/cuisine/mediterranean" label="🥗 Mediterranean" tone="cream" />
          </div>
        </div>
      </div>

      {/* By servings — single row footer */}
      <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-ink/10 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-subtle">
          <Users className="h-3.5 w-3.5" aria-hidden /> Serving size:
        </div>
        <FilterPill href="/servings/individual" label="Just me" tone="ink" />
        <FilterPill href="/servings/couple" label="For two" tone="ink" />
        <FilterPill href="/servings/family" label="Family of 4" tone="ink" />
        <FilterPill href="/servings/party" label="Party (8+)" tone="ink" />
      </div>
    </section>
  );
}

function FilterPill({
  href, label, tone,
}: { href: string; label: string; tone: 'terracotta' | 'forest' | 'amber' | 'cream' | 'ink' }) {
  const tones: Record<typeof tone, string> = {
    terracotta: 'bg-white text-ink hover:border-terracotta-400 hover:text-terracotta-600',
    forest: 'bg-white text-ink hover:border-forest-500 hover:text-forest-700',
    amber: 'bg-white text-ink hover:border-amber-500 hover:text-amber-700',
    cream: 'bg-white text-ink hover:border-terracotta-300 hover:text-terracotta-500',
    ink: 'bg-white text-ink hover:border-ink hover:text-ink',
  } as const;
  return (
    <Link
      href={href}
      className={`inline-block rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${tones[tone]}`}
    >
      {label}
    </Link>
  );
}
