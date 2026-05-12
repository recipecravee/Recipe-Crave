import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Flame, Calendar } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

/**
 * Recipe of the Day hero card. Strategy doc calls for a daily anchor that
 * gives returning visitors something new to look at, plus an email-signup
 * incentive. We pick deterministically on the server based on UTC day-of-
 * year so every visitor on the same day sees the same recipe — important
 * for caching and for the daily "recipe digest" email later.
 */
export function RecipeOfTheDay({ recipe }: { recipe: Recipe }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <Link href={`/recipes/${recipe.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
          {recipe.heroImage ? (
            <Image
              src={recipe.heroImage}
              alt={recipe.title}
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              loading="eager"
            />
          ) : null}
          <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 bg-gradient-to-b from-ink/70 to-transparent p-4 text-white">
            <Calendar className="h-4 w-4" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-widest">
              Recipe of the day
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-serif text-xl font-bold text-ink hover:text-terracotta-500">
            {recipe.title}
          </h3>
          {recipe.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{recipe.description}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-muted">
            {recipe.totalTimeMin ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden /> {recipe.totalTimeMin} min
              </span>
            ) : null}
            {recipe.servings ? (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" aria-hidden /> {recipe.servings} servings
              </span>
            ) : null}
            {recipe.cuisine ? (
              <span className="inline-flex items-center gap-1">
                <Flame className="h-3.5 w-3.5" aria-hidden /> {recipe.cuisine}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
