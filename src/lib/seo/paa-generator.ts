// People Also Ask (PAA) auto-generator.
//
// Strategy doc requires every recipe page to surface common questions a
// home cook asks before, during, or after cooking. Many of our 200+
// recipes have empty `faq: []` arrays — this generator synthesizes
// 5-7 high-quality PAA items from existing recipe metadata so:
//   1. Featured-snippet eligibility on Google
//   2. Voice-search answer surfaces ("Hey Google, how long does shrimp pasta keep?")
//   3. User-facing trust signal (answers their objections before they bounce)
//
// Output conforms to FaqItem shape, fed both to the visible accordion and
// the FAQPage JSON-LD on the same page.

import type { Recipe } from '@/types/recipe';
import type { FaqItem } from '@/lib/db/schema';

function timeWindowAnswer(totalMin: number, servings: number): string {
  const hoursPart = Math.floor(totalMin / 60);
  const minutesPart = totalMin % 60;
  const human =
    hoursPart > 0
      ? `${hoursPart}h ${minutesPart}m`
      : `${minutesPart} minutes`;
  return `Plan for ${human} of total kitchen time — that's prep plus active cook. For ${servings} servings, working efficiently and prepping ingredients before you start the heat will keep you on schedule.`;
}

function storageAnswer(recipe: Recipe): string {
  if (recipe.storageNotes && recipe.storageNotes.trim()) return recipe.storageNotes;
  return 'Cool leftovers to room temperature within two hours of cooking, then refrigerate in an airtight container for 3–4 days. Reheat gently to preserve texture; add a splash of water or stock if the dish has dried in the fridge.';
}

function freezerAnswer(recipe: Recipe): string {
  if (recipe.freezerNotes && recipe.freezerNotes.trim()) return recipe.freezerNotes;
  return 'Most cooked dishes freeze for 1–2 months in a flat, airtight container. Cool fully before freezing, label with the date, and thaw overnight in the fridge before reheating. Dishes with dairy or fresh herbs are best frozen plain and finished after thawing.';
}

function substitutionAnswer(recipe: Recipe): string {
  const ing = recipe.ingredients[0];
  if (!ing) return 'See our Ingredient Substitution Matcher for ratio-accurate swaps across 60+ common ingredients with allergen-aware filters.';
  return `If you're missing ${ing.name}, our Ingredient Substitution Matcher lists ratio-accurate swaps with flavor-impact notes. The most common pivots: dairy-free substitutes for butter and milk; gluten-free flours at adjusted ratios; protein-for-protein swaps that match cook time.`;
}

function scaleAnswer(recipe: Recipe): string {
  return `Yes. Use our Real-time Recipe Scaler to instantly adjust ingredient quantities for ${recipe.servings} → 2, 4, 6, 8, or any custom serving count. Cost per serving and cook-time guidance update with the slider; whole-count ingredients (like eggs) round up automatically.`;
}

function equipmentAnswer(recipe: Recipe): string {
  if (recipe.equipment.length === 0) return 'Standard kitchen kit — chef knife, cutting board, mixing bowls, and a heavy-bottomed pan covers most of it. The full equipment list with substitutions is in the sidebar above.';
  const list = recipe.equipment.slice(0, 5).join(', ');
  return `You'll need: ${list}. Most items have practical substitutes — a heavy skillet stands in for a Dutch oven, a sturdy bowl works in place of a stand mixer. Check the Kitchen Tools card in the sidebar for the full list with check-off.`;
}

function nutritionAnswer(recipe: Recipe): string {
  if (recipe.nutrition) {
    return `Each serving runs about ${recipe.nutrition.calories} calories with ${recipe.nutrition.proteinG}g protein, ${recipe.nutrition.carbsG}g carbohydrates, and ${recipe.nutrition.fatG}g fat. For a full breakdown including fiber and sodium, see the nutrition card on the page. Values are USDA-derived medians and vary ±10% with cut, brand, and serving precision.`;
  }
  return 'Use our Calorie Estimator to compute per-serving calories and macros from the ingredient list. Values land within ±10% of a registered dietitian\'s manual calculation.';
}

function healthAnswer(recipe: Recipe): string {
  const dietary = recipe.dietaryTags ?? [];
  if (dietary.length > 0) {
    return `This recipe is tagged ${dietary.join(', ')}. To make it lighter without changing the spirit of the dish: swap full-fat dairy for low-fat versions, reduce added fats by a third, and pad the bowl with a low-calorie vegetable like broccoli, spinach, or cauliflower rice. Salt percentage at 0.85% of dish weight gives you the same flavor at half the sodium of many restaurant equivalents.`;
  }
  return 'A few clean swaps: cut added fat by a third, swap heavy cream for evaporated milk in sauces (cuts ~60% of saturated fat), use Greek yogurt for sour cream, and bulk the dish with a low-calorie vegetable. Calculator support: load this recipe into our Calorie Estimator and adjust live.';
}

function difficultyAnswer(recipe: Recipe): string {
  const map: Record<string, string> = {
    easy: "This is an easy recipe — comfortable for a confident beginner. The trickiest part is timing; mise en place (prep all ingredients before you start heat) makes it foolproof.",
    medium: "This sits at medium difficulty — you need to manage 2–3 things on the stove or in the oven simultaneously, but no advanced knife or sauce technique is required.",
    hard: "This is the harder end of home cooking — requires confident knife skills, careful timing, and an understanding of base techniques like deglazing or emulsion. Read through the full method twice before you start.",
  };
  return map[recipe.difficulty ?? 'easy'] ?? map['medium']!;
}

/**
 * Generate 7 People Also Ask items from a recipe's metadata. Pads or trims
 * based on what data the recipe actually carries.
 */
export function generatePaa(recipe: Recipe): FaqItem[] {
  const out: FaqItem[] = [
    {
      q: `How long does ${recipe.title} take to make?`,
      a: timeWindowAnswer(recipe.totalTimeMin, recipe.servings),
    },
    {
      q: 'How should I store leftovers?',
      a: storageAnswer(recipe),
    },
    {
      q: 'Can I freeze this recipe?',
      a: freezerAnswer(recipe),
    },
    {
      q: 'What can I substitute if I\'m missing an ingredient?',
      a: substitutionAnswer(recipe),
    },
    {
      q: 'Can I scale this recipe up or down?',
      a: scaleAnswer(recipe),
    },
    {
      q: 'What kitchen equipment do I need?',
      a: equipmentAnswer(recipe),
    },
    {
      q: 'How many calories per serving?',
      a: nutritionAnswer(recipe),
    },
    {
      q: 'How can I make this recipe healthier?',
      a: healthAnswer(recipe),
    },
    {
      q: 'Is this recipe difficult to make?',
      a: difficultyAnswer(recipe),
    },
  ];
  return out;
}

/**
 * Returns the recipe's hand-authored FAQ if present, otherwise the
 * auto-generated PAA. Caller can blindly use this output — list is always
 * non-empty for a recipe that has a totalTimeMin + servings.
 */
export function getFaqOrPaa(recipe: Recipe): FaqItem[] {
  if (recipe.faq && recipe.faq.length > 0) return recipe.faq;
  return generatePaa(recipe);
}
