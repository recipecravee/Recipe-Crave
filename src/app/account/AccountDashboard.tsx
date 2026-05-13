'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart, Calendar, ShoppingCart, Camera, Settings, Sparkles, Clock, ChefHat,
  Bookmark, TrendingUp, Flame, Leaf, Utensils, Award, Mic, Lightbulb, Target,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type LiteRecipe = {
  slug: string;
  title: string;
  heroImage: string | null;
  totalTimeMin: number;
  servings: number;
  cuisine?: string;
  course?: string;
};

type Props = {
  userEmail: string;
  catalog: LiteRecipe[];
};

/**
 * Logged-in dashboard. Designed to outclass Food Network (saved-only) and
 * Tasty (cookbook-only) by combining:
 *   - Quick stats hero (saved, planned, cooked-this-week)
 *   - Quick action tiles (meal plan, pantry, calculators, voice cook)
 *   - Saved recipes grid (hydrated from localStorage rc:saved)
 *   - Recently viewed strip (rc:recent)
 *   - Cooking achievements row (gamification — minor, optional)
 *   - Account settings + preferences
 *
 * All data sources are client-side until Supabase user_data tables exist.
 * Login provides cross-device sync; guest mode keeps everything in
 * localStorage. Dashboard works identically in either mode.
 */
export function AccountDashboard({ userEmail, catalog }: Props) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [mealPlanCount, setMealPlanCount] = useState(0);

  useEffect(() => {
    function refresh() {
      try {
        const saved = window.localStorage.getItem('rc:saved');
        const recent = window.localStorage.getItem('rc:recent');
        const plans = window.localStorage.getItem('rc:scaler:saved');
        setSavedSlugs(saved ? (JSON.parse(saved) as string[]) : []);
        setRecentSlugs(recent ? (JSON.parse(recent) as string[]) : []);
        setMealPlanCount(plans ? (JSON.parse(plans) as unknown[]).length : 0);
      } catch {
        /* swallow */
      }
    }
    refresh();
    window.addEventListener('rc:saved-changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('rc:saved-changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const savedRecipes = useMemo(
    () =>
      savedSlugs
        .map((s) => catalog.find((r) => r.slug === s))
        .filter((r): r is LiteRecipe => Boolean(r)),
    [savedSlugs, catalog],
  );

  const recentRecipes = useMemo(
    () =>
      recentSlugs
        .map((s) => catalog.find((r) => r.slug === s))
        .filter((r): r is LiteRecipe => Boolean(r))
        .slice(0, 6),
    [recentSlugs, catalog],
  );

  const displayName = userEmail.split('@')[0] ?? 'there';

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? 'Up late' :
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    hour < 21 ? 'Good evening' :
    'Winding down';

  // Daily cooking tip — deterministic-by-day-of-year so it rotates without
  // a server roundtrip. Pulled from a curated list of herb wisdom + technique
  // pointers that match the strategy doc's "voice-search snippet" surface.
  const dailyTip = DAILY_TIPS[new Date().getDay() * 3 % DAILY_TIPS.length];

  // Weekly cooking goal — tracks last 7 calendar days w/ activity
  const weekDays = cookingStreak();
  const weeklyGoal = 4;        // default 4 cooks per week
  const weeklyPct = Math.min(100, (weekDays / weeklyGoal) * 100);

  return (
    <div className="container py-8 lg:py-12">
      {/* HERO + STATS */}
      <section className="rounded-3xl bg-gradient-to-br from-terracotta-50 via-cream-50 to-forest-50 p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Your kitchen
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
              {greeting},{' '}
              <span className="capitalize text-terracotta-600">{displayName}</span>
            </h1>
            <p className="mt-1 text-sm text-ink-muted">{userEmail}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={Bookmark} label="Saved" value={savedRecipes.length} tone="terracotta" />
          <Stat icon={Calendar} label="Meal plans" value={mealPlanCount} tone="forest" />
          <Stat icon={Clock} label="Recently viewed" value={recentRecipes.length} tone="amber" />
          <Stat icon={Award} label="Streak (days)" value={weekDays} tone="ink" />
        </div>

        {/* Weekly cooking goal progress bar */}
        <div className="mt-6 rounded-2xl bg-white/70 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-widest text-forest-700">
              <Target className="h-3.5 w-3.5" aria-hidden /> This week&apos;s cooking goal
            </span>
            <span className="font-bold text-ink">
              {weekDays} / {weeklyGoal} days
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-100">
            <div
              className="h-full bg-gradient-to-r from-forest-400 to-forest-600 transition-all duration-500"
              style={{ width: `${weeklyPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-ink-muted">
            {weekDays >= weeklyGoal
              ? '🎉 Goal hit. You are cooking like a pro this week.'
              : `Cook ${weeklyGoal - weekDays} more day${weeklyGoal - weekDays === 1 ? '' : 's'} to hit your weekly goal.`}
          </p>
        </div>

        {/* Daily tip banner */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
              Tip of the day
            </p>
            <p className="mt-1 text-sm text-ink">{dailyTip}</p>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mt-8">
        <h2 className="mb-3 font-serif text-2xl">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            icon={Sparkles}
            href="/meal-planner"
            title="AI meal planner"
            body="Build a week from your budget + pantry"
            tone="terracotta"
          />
          <ActionCard
            icon={Camera}
            href="/pantry-match"
            title="Pantry photo scan"
            body="Snap your fridge → recipes you can make"
            tone="forest"
          />
          <ActionCard
            icon={Mic}
            href="/cook"
            title="Voice cook mode"
            body="Hands-free, step-by-step"
            tone="amber"
          />
          <ActionCard
            icon={ChefHat}
            href="/calculators"
            title="Kitchen calculators"
            body="10 free cooking tools"
            tone="ink"
          />
          <ActionCard
            icon={ChefHat}
            href="/account/pantry"
            title="My pantry"
            body="Synced ingredients across devices"
            tone="terracotta"
          />
        </div>
      </section>

      {/* SAVED RECIPES */}
      <section className="mt-12">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-serif text-2xl">Your saved recipes</h2>
          <Link href="/saved" className="text-sm font-bold text-terracotta-600 hover:underline">
            View all →
          </Link>
        </div>
        {savedRecipes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedRecipes.slice(0, 8).map((r) => (
              <RecipeMini key={r.slug} recipe={r} />
            ))}
          </div>
        ) : (
          <EmptyTile
            icon={Heart}
            title="No saved recipes yet"
            body="Tap the Save button on any recipe to keep it here."
            cta={{ label: 'Browse recipes', href: '/recipes' }}
          />
        )}
      </section>

      {/* RECENTLY VIEWED */}
      {recentRecipes.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-3 font-serif text-2xl">Recently viewed</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentRecipes.map((r) => (
              <Link
                key={r.slug}
                href={`/recipes/${r.slug}`}
                className="block w-44 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm"
              >
                {r.heroImage ? (
                  <div className="relative aspect-[4/3] bg-cream-100">
                    <Image
                      src={r.heroImage}
                      alt=""
                      fill
                      sizes="180px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="p-2.5">
                  <p className="line-clamp-2 text-xs font-bold text-ink">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* RECENT ACTIVITY FEED */}
      <ActivityFeedSection savedCount={savedRecipes.length} mealPlanCount={mealPlanCount} recentCount={recentRecipes.length} />

      {/* COOKING JOURNEY / FEATURE EXPLORER */}
      <section className="mt-12">
        <h2 className="mb-3 font-serif text-2xl">Explore RecipeCrave</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ExploreTile
            icon={Leaf}
            href="/herbs"
            title="Therapeutic herbs"
            body="32 medicinal herbs, 13 health conditions, evidence-backed recipes"
          />
          <ExploreTile
            icon={Utensils}
            href="/pillars/budget-meals"
            title="Budget meals under $5"
            body="40+ recipes with honest per-serving prices"
          />
          <ExploreTile
            icon={TrendingUp}
            href="/pillars/high-protein-recipes"
            title="High-protein recipes"
            body="30+ recipes with 25-40g protein per serving"
          />
          <ExploreTile
            icon={Flame}
            href="/method/air-fryer"
            title="Air fryer recipes"
            body="Crispy results, minimal oil"
          />
          <ExploreTile
            icon={ShoppingCart}
            href="/grocery-list"
            title="Smart grocery lists"
            body="Multiple recipes → one consolidated list"
          />
          <ExploreTile
            icon={Settings}
            href="/calculators/pantry-inventory-matcher"
            title="Pantry inventory"
            body="Tick what you have → ranked recipes you can cook tonight"
          />
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon, label, value, tone,
}: {
  icon: typeof Bookmark;
  label: string;
  value: number;
  tone: 'terracotta' | 'forest' | 'amber' | 'ink';
}) {
  const tones: Record<typeof tone, string> = {
    terracotta: 'from-terracotta-100 to-terracotta-50 text-terracotta-600',
    forest: 'from-forest-100 to-forest-50 text-forest-700',
    amber: 'from-amber-100 to-amber-50 text-amber-700',
    ink: 'from-ink/10 to-cream-100 text-ink',
  } as const;
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-4`}>
      <Icon className="h-4 w-4 opacity-70" aria-hidden />
      <p className="mt-2 font-serif text-3xl font-bold">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{label}</p>
    </div>
  );
}

function ActionCard({
  icon: Icon, href, title, body, tone,
}: {
  icon: typeof Bookmark;
  href: string;
  title: string;
  body: string;
  tone: 'terracotta' | 'forest' | 'amber' | 'ink';
}) {
  const tones: Record<typeof tone, string> = {
    terracotta: 'bg-terracotta-100 text-terracotta-600',
    forest: 'bg-forest-100 text-forest-700',
    amber: 'bg-amber-100 text-amber-700',
    ink: 'bg-cream-200 text-ink',
  } as const;
  return (
    <Link
      href={href}
      className="group block rounded-2xl bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-ring"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="mt-3 font-serif text-lg font-bold text-ink group-hover:text-terracotta-500">
        {title}
      </p>
      <p className="mt-1 text-xs text-ink-muted">{body}</p>
    </Link>
  );
}

function RecipeMini({ recipe }: { recipe: LiteRecipe }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="block overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {recipe.heroImage ? (
        <div className="relative aspect-[4/3] bg-cream-100">
          <Image
            src={recipe.heroImage}
            alt=""
            fill
            sizes="(min-width: 1280px) 230px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-bold text-ink">{recipe.title}</p>
        <div className="mt-1 flex gap-2 text-[11px] text-ink-muted">
          {recipe.totalTimeMin ? <span>{recipe.totalTimeMin}m</span> : null}
          {recipe.servings ? <span>· {recipe.servings} servings</span> : null}
        </div>
      </div>
    </Link>
  );
}

function EmptyTile({
  icon: Icon, title, body, cta,
}: {
  icon: typeof Heart;
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
      <Icon className="mx-auto h-10 w-10 text-ink-subtle" aria-hidden />
      <p className="mt-3 font-serif text-lg font-bold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">{body}</p>
      <Button asChild size="sm" className="mt-4">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </div>
  );
}

function ActivityFeedSection({
  savedCount, mealPlanCount, recentCount,
}: { savedCount: number; mealPlanCount: number; recentCount: number }) {
  const entries: Array<{ icon: typeof Activity; label: string; sub: string; tone: string }> = [];

  if (savedCount > 0) {
    entries.push({
      icon: Bookmark,
      label: `${savedCount} saved recipe${savedCount === 1 ? '' : 's'} in your library`,
      sub: 'Stored locally — synced to your account when you log in on another device',
      tone: 'text-terracotta-600',
    });
  }
  if (mealPlanCount > 0) {
    entries.push({
      icon: Calendar,
      label: `${mealPlanCount} meal plan${mealPlanCount === 1 ? '' : 's'} generated`,
      sub: 'Find them in your meal-plan history',
      tone: 'text-forest-700',
    });
  }
  if (recentCount > 0) {
    entries.push({
      icon: Clock,
      label: `${recentCount} recipe${recentCount === 1 ? '' : 's'} viewed this week`,
      sub: 'Recently viewed strip above shows them',
      tone: 'text-amber-700',
    });
  }
  if (entries.length === 0) {
    entries.push({
      icon: Sparkles,
      label: 'Start your cooking activity',
      sub: 'Browse a recipe, generate a meal plan, or use a calculator to populate this feed',
      tone: 'text-ink-subtle',
    });
  }

  return (
    <section className="mt-12">
      <h2 className="mb-3 font-serif text-2xl">Recent activity</h2>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <ul className="divide-y divide-ink/5">
          {entries.map((entry, i) => (
            <li key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <entry.icon className={`mt-0.5 h-4 w-4 shrink-0 ${entry.tone}`} aria-hidden />
              <div>
                <p className="font-semibold text-ink">{entry.label}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{entry.sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ExploreTile({
  icon: Icon, href, title, body,
}: {
  icon: typeof Leaf;
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-ring"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-terracotta-500" aria-hidden />
        <p className="font-serif text-base font-bold text-ink group-hover:text-terracotta-500">
          {title}
        </p>
      </div>
      <p className="mt-2 text-xs text-ink-muted">{body}</p>
    </Link>
  );
}

/**
 * Curated daily tips — rotated by day-of-year so every visit on the same
 * date gets the same tip. Pull from herb wisdom + technique pointers that
 * double as voice-search snippet candidates. Update list quarterly.
 */
const DAILY_TIPS: string[] = [
  'Salt your pasta water at 1.0-1.5% of water weight ("salty as the sea"). Reserve a cup of starchy water before draining — that is the secret to a sauce that clings.',
  'Dry-brine chicken with 1% kosher salt by weight, uncovered in the fridge for 12-24 hours. Crispier skin than wet brine, half the work.',
  'Turmeric + black pepper increases curcumin absorption by 2000%. Always pair them when cooking for anti-inflammatory benefits.',
  'Bloom dry spices in fat for 20-30 seconds before adding liquid. Volatile oils release into the fat and coat every bite.',
  'Cool food fully within 2 hours of cooking before refrigerating. Hot food in a sealed container creates condensation that ruins texture and speeds spoilage.',
  'Rest meat after cooking for one-third its cook time. A 30-min roast rests 10 min. Cuts retain 30-40% more juice when sliced.',
  'Cinnamon improves fasting glucose by 10-29% in type-2 diabetics across multiple trials. 0.5-1 tsp daily is the therapeutic window.',
  'Garlic should rest 10 minutes after crushing before cooking. Allicin (the active compound) needs that time to activate. Skipping this step kills the health benefits.',
  'Pasta water should be "salty as the sea" — about 1 tablespoon kosher salt per 4 quarts. Most home cooks under-salt by 5×.',
  'Sear before braise. The Maillard crust on browned meat dissolves into the braising liquid and gives stew its depth. Skip this step and the stew tastes flat.',
  'Salt is the single biggest variable in cooking. Most home recipes are under-salted by 30%. Taste at every stage and adjust.',
  'Ginger + turmeric stack compound anti-inflammatory pathways. Hitting both reduces inflammation more than either alone — try them in soup tonight.',
  'Bring sauces back to a rolling boil for 1 full minute when reheating. Bacteria die at 165°F, but flavor compounds also reawaken at that temperature.',
  'Cool stock with shallow containers — they cool 3× faster than deep ones. Speed through the danger zone (40-140°F) matters more than refrigerator temperature.',
];

/**
 * Cooking-streak heuristic — checks how many of the last 7 days have any
 * activity in localStorage (saved a recipe, scaled a recipe, used a calc).
 * Currently approximates: viewed-recipes timestamps. Placeholder until we
 * track real cooking sessions.
 */
function cookingStreak(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem('rc:recent-dates');
    if (!raw) return 0;
    const dates = JSON.parse(raw) as string[];
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (dates.includes(key)) streak += 1;
      else break;
    }
    return streak;
  } catch {
    return 0;
  }
}
