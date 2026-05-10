import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callAI } from '@/lib/ai/client';

export const runtime = 'nodejs';
export const maxDuration = 20;

const RequestSchema = z.object({
  ingredient: z.string().min(1).max(80),
  context: z.string().max(200).optional(),
  dietary: z.array(z.string()).optional(),
});

const ResponseSchema = z.object({
  substitutes: z.array(
    z.object({
      name: z.string(),
      ratio: z.string(),
      flavorNote: z.string(),
      dietaryFlags: z.array(z.string()).optional(),
    }),
  ),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 });
  }

  const sys = `You are RecipeCrave's substitution expert. Given an ingredient, suggest 3 substitutes ranked by how well they preserve flavor and function. Each must include a clear conversion ratio and a brief flavor note (max 25 words). Output strict JSON only:
{"substitutes":[{"name":"...","ratio":"1:1","flavorNote":"...","dietaryFlags":["vegan"]}]}`;

  const user = `Ingredient: ${parsed.ingredient}
Context: ${parsed.context ?? 'general use'}
Dietary needs: ${parsed.dietary?.join(', ') ?? 'none'}`;

  try {
    const result = await callAI({
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 600,
      jsonMode: true,
      cacheKey: `sub:${parsed.ingredient}:${parsed.dietary?.join(',') ?? ''}`,
    });

    const data = ResponseSchema.parse(JSON.parse(result.text));
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    console.error('[substitute] failed', err);
    return NextResponse.json({ ok: false, error: 'Could not generate substitutes.' }, { status: 503 });
  }
}
