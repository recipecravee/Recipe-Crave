import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { CUISINES, COURSES_NAV, DIETS, SITE } from '@/lib/constants';
import { getAllRecipes } from '@/lib/data/recipes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/structured-data';
import type { Recipe } from '@/types/recipe';

/**
 * Programmatic SEO landing pages of the form
 *   /quick/{cuisine}-{course}        → "Quick Italian Dinner Recipes"
 *   /quick/{diet}-{course}           → "Quick Vegan Lunch Recipes"
 *   /quick/under-30-{course}         → "Quick 30-Minute Dinners"
 *   /quick/{cuisine}-under-30        → "Quick Italian Recipes Under 30 Minutes"
 *
 * Each landing pulls recipes from the existing dataset matching the
 * combo, renders a SEO-tuned hero (h1 / description / keyword-rich
 * intro) and a filtered grid. Targets long-tail "quick X Y" queries
 * that the homepage and individual cuisine pages don't capture.
 *
 * generateStaticParams emits all valid combos at build time so each
 * landing is statically generated. No force-dynamic, fully ISR.
 */

const TIME_BUCKETS = [
  { slug: 'under-15', maxMin: 15, label: 'Under 15-Minute' },
  { slug: 'under-30', maxMin: 30, label: 'Under 30-Minute' },
  { slug: 'under-45', maxMin: 45, label: 'Under 45-Minute' },
] as const;

const DEFAULT_COURSES = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'] as const;

type Combo =
  | { kind: 'cuisine-course'; cuisine: string; cuisineName: string; course: string; courseName: string }
  | { kind: 'cuisine-time'; cuisine: string; cuisineName: string; time: string; timeLabel: string; maxMin: number }
  | { kind: 'diet-course'; diet: string; dietName: string; course: string; courseName: string }
  | { kind: 'time-course'; time: string; timeLabel: string; maxMin: number; course: string; courseName: string };

function parseCombo(slug: string): Combo | null {
  // cuisine + course (e.g. italian-dinner)
  for (const c of CUISINES) {
    for (const cs of COURSES_NAV) {
      if (slug === `${c.slug}-${cs.slug}` && (DEFAULT_COURSES as readonly string[]).includes(cs.slug)) {
        return { kind: 'cuisine-course', cuisine: c.slug, cuisineName: c.name, course: cs.slug, courseName: cs.name };
      }
    }
  }
  // cuisine + time (e.g. italian-under-30)
  for (const c of CUISINES) {
    for (const t of TIME_BUCKETS) {
      if (slug === `${c.slug}-${t.slug}`) {
        return { kind: 'cuisine-time', cuisine: c.slug, cuisineName: c.name, time: t.slug, timeLabel: t.label, maxMin: t.maxMin };
      }
    }
  }
  // diet + course (e.g. vegan-dinner)
  for (const d of DIETS) {
    for (const cs of COURSES_NAV) {
      if (slug === `${d.slug}-${cs.slug}` && (DEFAULT_COURSES as readonly string[]).includes(cs.slug)) {
        return { kind: 'diet-course', diet: d.slug, dietName: d.name, course: cs.slug, courseName: cs.name };
      }
    }
  }
  // time + course (e.g. under-30-dinner)
  for (const t of TIME_BUCKETS) {
    for (const cs of COURSES_NAV) {
      if (slug === `${t.slug}-${cs.slug}` && (DEFAULT_COURSES as readonly string[]).includes(cs.slug)) {
        return { kind: 'time-course', time: t.slug, timeLabel: t.label, maxMin: t.maxMin, course: cs.slug, courseName: cs.name };
      }
    }
  }
  return null;
}

function comboTitle(c: Combo): string {
  switch (c.kind) {
    case 'cuisine-course':
      return `Quick ${c.cuisineName} ${c.courseName} Recipes`;
    case 'cuisine-time':
      return `${c.timeLabel} ${c.cuisineName} Recipes`;
    case 'diet-course':
      return `${c.dietName} ${c.courseName} Recipes`;
    case 'time-course':
      return `${c.timeLabel} ${c.courseName} Recipes`;
  }
}

function comboDescription(c: Combo): string {
  switch (c.kind) {
    case 'cuisine-course':
      return `Tested ${c.cuisineName.toLowerCase()} ${c.courseName.toLowerCase()} recipes you can cook tonight. Every dish on this page includes per-serving cost, calories, and step-by-step instructions designed for a busy weeknight kitchen.`;
    case 'cuisine-time':
      return `${c.cuisineName} dishes that come together fast — ${c.timeLabel.toLowerCase()} cook time, full per-serving cost and calorie data, step-by-step instructions calibrated for a home stove.`;
    case 'diet-course':
      return `Hand-picked ${c.dietName.toLowerCase()} ${c.courseName.toLowerCase()} recipes with full nutrition, per-serving cost, and clear step-by-step technique. Filter the library by your eating pattern without giving up flavor.`;
    case 'time-course':
      return `${c.courseName} recipes from RecipeCrave that finish ${c.timeLabel.toLowerCase()}. Cost-per-serving and calorie data on every dish; no advanced equipment, no fluff.`;
  }
}

function matchesCombo(recipe: Recipe, c: Combo): boolean {
  switch (c.kind) {
    case 'cuisine-course':
      return recipe.cuisine === c.cuisine && recipe.course === c.course;
    case 'cuisine-time':
      return recipe.cuisine === c.cuisine && (recipe.totalTimeMin ?? 9999) <= c.maxMin;
    case 'diet-course':
      return (recipe.dietaryTags ?? []).includes(c.diet) && recipe.course === c.course;
    case 'time-course':
      return recipe.course === c.course && (recipe.totalTimeMin ?? 9999) <= c.maxMin;
  }
}

// Enumerate every valid combo for static generation. Caps to combos
// that have at least one matching recipe so we don't emit empty SEO
// pages — Google deprioritises thin content.
export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  const allCombos: string[] = [];

  for (const c of CUISINES) {
    for (const cs of COURSES_NAV) {
      if (!(DEFAULT_COURSES as readonly string[]).includes(cs.slug)) continue;
      allCombos.push(`${c.slug}-${cs.slug}`);
    }
    for (const t of TIME_BUCKETS) allCombos.push(`${c.slug}-${t.slug}`);
  }
  for (const d of DIETS) {
    for (const cs of COURSES_NAV) {
      if (!(DEFAULT_COURSES as readonly string[]).includes(cs.slug)) continue;
      allCombos.push(`${d.slug}-${cs.slug}`);
    }
  }
  for (const t of TIME_BUCKETS) {
    for (const cs of COURSES_NAV) {
      if (!(DEFAULT_COURSES as readonly string[]).includes(cs.slug)) continue;
      allCombos.push(`${t.slug}-${cs.slug}`);
    }
  }

  const valid: string[] = [];
  for (const slug of allCombos) {
    const c = parseCombo(slug);
    if (!c) continue;
    const count = recipes.filter((r) => matchesCombo(r, c)).length;
    if (count > 0) valid.push(slug);
  }
  return valid.map((combo) => ({ combo }));
}

export async function generateMetadata({ params }: { params: Promise<{ combo: string }> }): Promise<Metadata> {
  const { combo } = await params;
  const c = parseCombo(combo);
  if (!c) return { title: 'Not found' };
  const title = comboTitle(c);
  const description = comboDescription(c);
  return {
    title: `${title} — Free, Tested & Step-by-Step | ${SITE.name}`,
    description,
    alternates: { canonical: `${SITE.url}/quick/${combo}` },
    openGraph: { title, description, url: `${SITE.url}/quick/${combo}` },
  };
}

export const revalidate = 3600;

export default async function ProgrammaticPage({ params }: { params: Promise<{ combo: string }> }) {
  const { combo } = await params;
  const c = parseCombo(combo);
  if (!c) notFound();

  const recipes = await getAllRecipes();
  const matched = recipes.filter((r) => matchesCombo(r, c));
  if (matched.length === 0) notFound();

  const title = comboTitle(c);
  const description = comboDescription(c);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipes' },
    { name: title, url: `/quick/${combo}` },
  ];

  return (
    <article className="container py-10 lg:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          itemListJsonLd(matched.map((r) => ({ name: r.title, url: `/recipes/${r.slug}` }))),
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/recipes" className="hover:text-ink">Recipes</Link></li>
          <li aria-hidden>/</li>
          <li className="text-ink">{title}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base text-ink-muted">{description}</p>
        <p className="mt-3 text-sm text-ink-subtle">
          {matched.length} {matched.length === 1 ? 'recipe' : 'recipes'} match this filter.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {matched.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>

      <section className="mt-16 rounded-3xl border border-cream-200 bg-cream-50/60 p-6 sm:p-10">
        <h2 className="font-serif text-2xl text-ink">Why these recipes work for "{title.toLowerCase()}"</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Every dish on this page was tested in the RecipeCrave kitchen with timing,
          cost, and calorie data measured rather than guessed. The filter applied here
          combines a real query intent — for example, "I have an hour after work and
          I want something Italian for dinner" — with the structural metadata on each
          recipe so the result is a tight, actionable list rather than an open-ended
          search. Browse, save what looks good, and the per-serving cost on each card
          tells you whether it fits the week's grocery budget.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          If you'd like to suggest a different combination, the full recipe library
          is at <Link href="/recipes" className="font-semibold text-terracotta-500 hover:underline">/recipes</Link>
          {' '}and you can submit your own variation on any recipe page.
        </p>
      </section>
    </article>
  );
}
