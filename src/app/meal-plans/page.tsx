import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Sparkles } from 'lucide-react';
import { MEAL_PLANS } from '@/content/meal-plans';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: '30-Day Condition-Specific Meal Plans — Anti-Inflammation, Diabetes, Gut Health, Sleep',
  description:
    'Four structured 30-day eating protocols designed around specific health conditions. Each plan is week-by-week, recipe-anchored, and grounded in published research. Free, no signup.',
  alternates: { canonical: '/meal-plans' },
  keywords: [
    '30 day meal plan',
    'anti-inflammation meal plan',
    'diabetes meal plan',
    'gut healing meal plan',
    'sleep optimization meal plan',
    'condition specific eating protocols',
  ],
};

export default function MealPlansLanding() {
  return (
    <div className="container py-10 lg:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: '30-Day Meal Plans', url: '/meal-plans' },
        ])}
      />
      <header className="mb-12 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <Calendar className="h-3.5 w-3.5" aria-hidden /> 30-Day Protocols
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          Condition-specific 30-day meal plans
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          Each plan is structured week-by-week with daily meals, shopping lists,
          supplementation guidance, and measurable milestones. Built on
          published research, not wellness folklore. Designed to be sustainable
          past day 30 — the 3-4 meals you cook most often become your new
          baseline.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {MEAL_PLANS.map((p) => (
          <Link
            key={p.slug}
            href={`/meal-plans/${p.slug}`}
            className="group block rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-ring sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              For {p.condition}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink group-hover:text-terracotta-600">
              {p.title}
            </h2>
            <p className="mt-3 text-sm text-ink-muted">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-ink-subtle">
              <span className="rounded-full bg-cream-100 px-2 py-0.5 font-bold">30 days</span>
              <span className="rounded-full bg-cream-100 px-2 py-0.5 font-bold">4 week structure</span>
              <span className="rounded-full bg-cream-100 px-2 py-0.5 font-bold">Recipes included</span>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-2xl bg-cream-100 p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <Sparkles className="h-4 w-4 text-terracotta-500" aria-hidden /> Want a custom plan?
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Use our <Link href="/meal-planner" className="font-bold text-terracotta-600 hover:underline">AI Meal Planner</Link> for a single-week plan tuned to your specific budget, dietary preferences, and pantry contents.
        </p>
      </section>
    </div>
  );
}
