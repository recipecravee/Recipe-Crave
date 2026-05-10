import type { Metadata } from 'next';
import { MealPlannerClient } from './MealPlannerClient';

export const metadata: Metadata = {
  title: 'Free AI Meal Planner — Plan Your Week in 30 Seconds',
  description:
    'Generate a personalized 7-day meal plan from your budget, diet, and household size. Includes grocery list and full nutrition. 100% free.',
  alternates: { canonical: '/meal-planner' },
};

export default function MealPlannerPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">AI Meal Planner</h1>
        <p className="mt-3 text-ink-muted">
          Tell us your budget, diet, household size, and how busy your week is. We&apos;ll generate a 7-day plan with recipes, prep schedule, and a consolidated grocery list — all free.
        </p>
      </header>
      <MealPlannerClient />
    </div>
  );
}
