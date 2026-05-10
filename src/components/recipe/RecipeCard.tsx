import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, DollarSign, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatMinutes, formatCurrency } from '@/lib/utils';
import type { Recipe, RecipeSummary } from '@/types/recipe';

type Props = {
  recipe: Recipe | RecipeSummary;
  priority?: boolean;
};

export function RecipeCard({ recipe, priority = false }: Props) {
  const calories =
    'nutrition' in recipe && recipe.nutrition ? recipe.nutrition.calories : 'calories' in recipe ? recipe.calories : undefined;

  return (
    <Link href={`/recipes/${recipe.slug}`} className="group card-recipe focus-ring">
      <div className="relative aspect-[4/3] bg-cream-200">
        {recipe.heroImage ? (
          <Image
            src={recipe.heroImage}
            alt={recipe.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cream-200 to-terracotta-100">
            <span className="font-serif text-5xl text-terracotta-300">RC</span>
          </div>
        )}
        {recipe.dietaryTags.length > 0 ? (
          <Badge variant="secondary" className="absolute left-3 top-3 capitalize">
            {recipe.dietaryTags[0]?.replace('-', ' ')}
          </Badge>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-serif text-lg leading-snug text-ink group-hover:text-terracotta-500">
          {recipe.title}
        </h3>
        <p className="line-clamp-2 text-sm text-ink-muted">{recipe.description}</p>
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-ink-muted">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <dt className="sr-only">Time</dt>
            <dd>{formatMinutes(recipe.totalTimeMin)}</dd>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden />
            <dt className="sr-only">Servings</dt>
            <dd>{recipe.servings} servings</dd>
          </div>
          {calories ? (
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" aria-hidden />
              <dt className="sr-only">Calories</dt>
              <dd>{calories} kcal</dd>
            </div>
          ) : null}
          {recipe.costPerServingUsd ? (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" aria-hidden />
              <dt className="sr-only">Cost per serving</dt>
              <dd>{formatCurrency(recipe.costPerServingUsd)}/serving</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Link>
  );
}
