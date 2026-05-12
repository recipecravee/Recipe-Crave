import 'server-only';
import { SEED_RECIPES, SEED_COLLECTIONS } from '@/content/seed-recipes';
import { RECIPECRAVE_RECIPES } from '@/content/recipecrave-recipes';
import type { Recipe } from '@/types/recipe';

// Data access layer.
// Reads from seed data at launch. Swap to Drizzle/Supabase queries once
// the migration is applied and the seed is loaded into the database.

// Combine seed-recipes (79) + RecipeCrave master set (126), deduped by slug.
const COMBINED_RECIPES: Recipe[] = (() => {
  const seen = new Set<string>();
  const out: Recipe[] = [];
  for (const r of SEED_RECIPES) {
    if (seen.has(r.slug)) continue;
    seen.add(r.slug);
    out.push(r);
  }
  for (const r of RECIPECRAVE_RECIPES) {
    if (seen.has(r.slug)) continue;
    seen.add(r.slug);
    out.push(r);
  }
  return out;
})();

export async function getAllRecipes(): Promise<Recipe[]> {
  return COMBINED_RECIPES;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  return COMBINED_RECIPES.find((r) => r.slug === slug) ?? null;
}

export async function getRecipesByCuisine(cuisine: string): Promise<Recipe[]> {
  return COMBINED_RECIPES.filter((r) => r.cuisine === cuisine);
}

export async function getRecipesByDiet(diet: string): Promise<Recipe[]> {
  return COMBINED_RECIPES.filter((r) => r.dietaryTags.includes(diet));
}

export async function getRecipesByCourse(course: string): Promise<Recipe[]> {
  return COMBINED_RECIPES.filter((r) => r.course === course);
}

export async function getRecipesByOccasion(occasion: string): Promise<Recipe[]> {
  return COMBINED_RECIPES.filter((r) => r.occasion === occasion);
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const q = query.toLowerCase();
  return COMBINED_RECIPES.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.keywords.some((k) => k.toLowerCase().includes(q)) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(q)),
  );
}

export async function getRelatedRecipes(recipe: Recipe, limit = 6): Promise<Recipe[]> {
  return COMBINED_RECIPES.filter((r) => r.slug !== recipe.slug)
    .map((r) => ({
      recipe: r,
      score:
        (r.cuisine === recipe.cuisine ? 3 : 0) +
        (r.course === recipe.course ? 2 : 0) +
        r.dietaryTags.filter((d) => recipe.dietaryTags.includes(d)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.recipe);
}

export async function getFeaturedRecipes(limit = 6): Promise<Recipe[]> {
  return COMBINED_RECIPES.slice(0, limit);
}

export async function getTrendingRecipes(limit = 4): Promise<Recipe[]> {
  return [...COMBINED_RECIPES].sort((a, b) => b.viewCount - a.viewCount).slice(0, limit);
}

export type Collection = {
  slug: string;
  title: string;
  description: string;
  recipes: Recipe[];
};

export async function getAllCollections(): Promise<Collection[]> {
  return SEED_COLLECTIONS.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    recipes: c.recipeSlugs
      .map((s) => SEED_RECIPES.find((r) => r.slug === s))
      .filter((r): r is Recipe => Boolean(r)),
  }));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const collections = await getAllCollections();
  return collections.find((c) => c.slug === slug) ?? null;
}
