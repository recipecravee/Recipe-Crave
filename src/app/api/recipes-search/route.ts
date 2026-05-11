import { NextResponse } from 'next/server';
import { searchRecipes, getAllRecipes } from '@/lib/data/recipes';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const recipes = q ? await searchRecipes(q) : (await getAllRecipes()).slice(0, 10);
  return NextResponse.json({
    recipes: recipes.slice(0, 10).map((r) => ({
      slug: r.slug,
      title: r.title,
      servings: r.servings,
      ingredients: r.ingredients,
    })),
  });
}
