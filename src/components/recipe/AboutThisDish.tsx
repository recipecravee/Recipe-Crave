import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { generateAboutDish } from '@/lib/content/about-dish';

type Props = {
  recipe: Recipe;
};

/**
 * Auto-generated "About this dish" panel. Renders four paragraphs (intro,
 * tradition, technique, serving) sourced from recipe metadata so every
 * recipe page picks up ~250 words of additional crawlable, on-topic copy
 * without hand-writing per-recipe content.
 *
 * Internal-link strategy: surfaces cuisine landing page + course landing
 * page + the global how-to guides hub, which strengthens the site's
 * topic-cluster authority signal.
 */
export function AboutThisDish({ recipe }: Props) {
  const about = generateAboutDish(recipe);
  const cuisineSlug = recipe.cuisine.toLowerCase().replace(/\s+/g, '-');
  const courseSlug = recipe.course.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="mt-10 rounded-2xl border border-cream-200 bg-cream-50/60 p-6 shadow-sm sm:p-8">
      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-700">
        <BookOpen className="h-4 w-4" aria-hidden />
        About this dish
      </div>
      <h2 className="font-serif text-2xl">Why this recipe works</h2>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
        <p>{about.intro}</p>
        <p>{about.tradition}</p>
        <p>{about.technique}</p>
        <p>{about.serveSuggestion}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <Link
          href={`/cuisine/${cuisineSlug}`}
          className="rounded-full border border-forest-300 bg-white px-3 py-1.5 font-semibold text-forest-700 hover:border-forest-500"
        >
          More {recipe.cuisine.replace('-', ' ')} recipes →
        </Link>
        <Link
          href={`/category/${courseSlug}`}
          className="rounded-full border border-forest-300 bg-white px-3 py-1.5 font-semibold text-forest-700 hover:border-forest-500"
        >
          Browse {recipe.course} ideas →
        </Link>
        <Link
          href="/how-to"
          className="rounded-full border border-forest-300 bg-white px-3 py-1.5 font-semibold text-forest-700 hover:border-forest-500"
        >
          Cooking technique guides →
        </Link>
      </div>
    </section>
  );
}
