import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllRecipes } from '@/lib/data/recipes';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1).max(40),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'Provide at least one ingredient.' }, { status: 400 });
  }

  const pantry = new Set(parsed.ingredients.map((s) => s.toLowerCase()));
  const recipes = await getAllRecipes();

  const matched = recipes
    .map((r) => {
      const matches = r.ingredients.filter((ing) =>
        Array.from(pantry).some((p) => ing.name.toLowerCase().includes(p)),
      );
      return { recipe: r, score: matches.length };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 24)
    .map((m) => m.recipe);

  return NextResponse.json({ ok: true, recipes: matched });
}
