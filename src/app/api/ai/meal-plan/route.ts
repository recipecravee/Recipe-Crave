import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callAI } from '@/lib/ai/client';

export const runtime = 'nodejs';
export const maxDuration = 30;

const RequestSchema = z.object({
  householdSize: z.number().int().min(1).max(12),
  weeklyBudgetUsd: z.number().min(10).max(1000),
  diet: z.string().optional(),
  pantry: z.array(z.string()).optional().default([]),
  allergies: z.array(z.string()).optional().default([]),
});

const PlanSchema = z.object({
  plan: z.array(
    z.object({
      day: z.string(),
      recipeTitle: z.string(),
      course: z.string(),
      estimatedCostUsd: z.number(),
      estimatedCalories: z.number(),
      notes: z.string().optional(),
    }),
  ),
  groceryList: z.array(z.string()),
  totalCostUsd: z.number(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 });
  }

  const systemPrompt = `You are RecipeCrave's meal planning assistant. Generate practical, budget-conscious 7-day dinner plans.

Constraints:
- Stay within the user's weekly budget (USD).
- Respect dietary preferences and allergies.
- Use pantry items where reasonable to reduce shopping.
- Vary cuisines and proteins across the week.
- Suggest realistic recipes a home cook can make in 20-45 minutes.

Output strict JSON only:
{
  "plan": [
    {"day":"Monday","recipeTitle":"...","course":"dinner","estimatedCostUsd":12.50,"estimatedCalories":480,"notes":"optional brief tip"},
    ... 7 days total
  ],
  "groceryList": ["1 lb chicken thighs", "2 onions", ...],
  "totalCostUsd": number
}`;

  const userPrompt = `Household size: ${parsed.householdSize}
Weekly budget: $${parsed.weeklyBudgetUsd}
Dietary preference: ${parsed.diet ?? 'none'}
Allergies: ${parsed.allergies.join(', ') || 'none'}
Pantry items: ${parsed.pantry.join(', ') || 'none'}`;

  try {
    const result = await callAI({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      maxTokens: 2000,
      jsonMode: true,
      cacheKey: `mealplan:${JSON.stringify(parsed)}`,
    });

    let plan;
    try {
      plan = PlanSchema.parse(JSON.parse(result.text));
    } catch (err) {
      console.error('[meal-plan] schema validation failed', err, result.text);
      return NextResponse.json({ ok: false, error: 'AI returned an invalid plan. Try again.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, plan, provider: result.provider, latencyMs: result.latencyMs });
  } catch (err) {
    console.error('[meal-plan] AI call failed', err);
    return NextResponse.json({ ok: false, error: 'AI service unavailable. Try again shortly.' }, { status: 503 });
  }
}
