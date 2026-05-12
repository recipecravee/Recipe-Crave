import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, AlertTriangle, ShoppingCart, Target, Pill, Leaf, Ban } from 'lucide-react';
import { MEAL_PLANS, getMealPlan } from '@/content/meal-plans';
import { getAllRecipes } from '@/lib/data/recipes';
import type { Recipe } from '@/types/recipe';

export async function generateStaticParams() {
  return MEAL_PLANS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = getMealPlan(slug);
  if (!plan) return { title: 'Not found' };
  return {
    title: plan.title,
    description: plan.description,
    alternates: { canonical: `/meal-plans/${slug}` },
    keywords: plan.keywords,
  };
}

/**
 * Renders a meal entry. If the string matches a recipe slug, render as a
 * link; otherwise render the text descriptively.
 */
function renderMeal(text: string, recipeMap: Map<string, Recipe>): React.ReactNode {
  const recipe = recipeMap.get(text);
  if (recipe) {
    return (
      <Link
        href={`/recipes/${recipe.slug}`}
        className="font-medium text-terracotta-600 hover:underline"
      >
        {recipe.title}
      </Link>
    );
  }
  return <span className="text-ink-muted">{text}</span>;
}

export default async function MealPlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getMealPlan(slug);
  if (!plan) notFound();

  const all = await getAllRecipes();
  const recipeMap = new Map(all.map((r) => [r.slug, r]));

  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/meal-plans" className="hover:text-ink">Meal Plans</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">{plan.title}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <Calendar className="h-3.5 w-3.5" aria-hidden /> 30-day plan · For {plan.condition}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{plan.title}</h1>
        <p className="mt-4 text-lg text-ink-muted">{plan.intro}</p>
      </header>

      <section className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-700">
            <Leaf className="h-3.5 w-3.5" aria-hidden /> Foods to emphasize
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {plan.foodsEmphasize.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" aria-hidden />
                <span className="text-ink">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700">
            <Ban className="h-3.5 w-3.5" aria-hidden /> Foods to avoid
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {plan.foodsAvoid.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                <span className="text-ink">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-10 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-900">Safety</p>
            <p className="mt-2 text-sm text-ink">{plan.safety}</p>
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-500">
          <Pill className="h-3.5 w-3.5" aria-hidden /> Supplementation
        </p>
        <p className="mt-2 text-sm text-ink">{plan.supplementation}</p>
      </section>

      {plan.weeks.map((week) => (
        <section key={week.number} className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <p className="font-serif text-2xl font-bold text-ink">
              Week {week.number}: {week.theme}
            </p>
            <span className="rounded-full bg-cream-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Days {(week.number - 1) * 7 + 1}–{week.number * 7}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-muted">{week.focus}</p>
          <p className="mt-3 inline-flex items-start gap-2 rounded-xl bg-forest-50 px-3 py-2 text-xs text-ink">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-700" aria-hidden />
            <span><strong className="text-forest-700">Milestone:</strong> {week.milestone}</span>
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="py-2 text-xs font-bold uppercase tracking-wider text-ink-subtle">Day</th>
                  <th className="py-2 text-xs font-bold uppercase tracking-wider text-ink-subtle">Breakfast</th>
                  <th className="py-2 text-xs font-bold uppercase tracking-wider text-ink-subtle">Lunch</th>
                  <th className="py-2 text-xs font-bold uppercase tracking-wider text-ink-subtle">Dinner</th>
                  <th className="py-2 text-xs font-bold uppercase tracking-wider text-ink-subtle">Snack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {week.days.map((d, i) => (
                  <tr key={i} className="align-top">
                    <td className="py-3 pr-2 font-bold text-ink">{(week.number - 1) * 7 + i + 1}</td>
                    <td className="py-3 pr-2">{renderMeal(d.breakfast, recipeMap)}</td>
                    <td className="py-3 pr-2">{renderMeal(d.lunch, recipeMap)}</td>
                    <td className="py-3 pr-2">{renderMeal(d.dinner, recipeMap)}</td>
                    <td className="py-3">{d.snack ? renderMeal(d.snack, recipeMap) : <span className="text-ink-subtle">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-xl bg-cream-50 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-subtle">
              <ShoppingCart className="h-3 w-3" aria-hidden /> Week {week.number} shopping list
            </p>
            <ul className="mt-2 space-y-1 text-xs text-ink">
              {week.shoppingList.map((line, i) => (
                <li key={i}>• {line}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-xl">Try other 30-day plans</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {MEAL_PLANS.filter((p) => p.slug !== slug).map((p) => (
            <Link
              key={p.slug}
              href={`/meal-plans/${p.slug}`}
              className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-terracotta-400 hover:text-terracotta-500"
            >
              {p.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
