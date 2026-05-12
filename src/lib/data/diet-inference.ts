// Inferred dietary tagging.
//
// Many seed + RecipeCrave recipes were imported without explicit diet tags
// for keto / paleo / low-carb / low-sodium / diabetic / halal / kosher.
// Rather than backfill ~200 recipes manually we infer tags from the
// existing ingredient + nutrition + cuisine data using rules pulled from
// each diet's published guidelines.
//
// Predicate sources:
//   keto / low-carb: ADA, Atkins, Virta Health published cutoffs
//   paleo:           Loren Cordain "Paleo Diet" (2002) exclusion lists
//   diabetic:        American Diabetes Association GL/fiber thresholds
//   low-sodium:      USDA Dietary Guidelines (<= 600 mg/serving = "low")
//   halal:           Sharia food-law standard exclusion list
//   kosher:          basic mishna exclusion (no pork, shellfish, meat+dairy)
//   gluten-free:     conservative — any wheat/barley/rye derivative excludes

import type { Recipe } from '@/types/recipe';

const txt = (r: Recipe): string =>
  [
    r.title,
    r.description ?? '',
    (r.keywords ?? []).join(' '),
    r.ingredients.map((i) => i.name).join(' '),
  ]
    .join(' ')
    .toLowerCase();

const containsWord = (s: string, ...words: string[]): boolean => {
  const rx = new RegExp(`\\b(${words.join('|')})\\b`, 'i');
  return rx.test(s);
};

// === Per-diet inference predicates ===

function isKeto(r: Recipe): boolean {
  const carb = r.nutrition?.carbsG;
  if (typeof carb === 'number' && carb > 10) return false; // hard cap
  const t = txt(r);
  // Exclude common keto-disqualifying ingredients
  if (containsWord(t, 'sugar', 'honey', 'maple', 'rice', 'pasta', 'bread', 'flour', 'potato', 'corn', 'beans', 'lentil', 'banana', 'oat', 'tortilla', 'noodle')) return false;
  // Require some fat-bearing ingredient signal
  if (!containsWord(t, 'butter', 'cream', 'cheese', 'oil', 'avocado', 'bacon', 'egg', 'salmon', 'beef', 'pork', 'lamb', 'almond', 'walnut', 'olive'))
    return false;
  return true;
}

function isPaleo(r: Recipe): boolean {
  const t = txt(r);
  // Paleo excludes grains, legumes, dairy, refined sugar, processed
  if (
    containsWord(t, 'rice', 'pasta', 'bread', 'flour', 'wheat', 'barley', 'oats', 'quinoa', 'lentil', 'bean', 'chickpea', 'tofu', 'tempeh', 'peanut', 'cheese', 'milk', 'yogurt', 'cream', 'butter')
  )
    return false;
  if (containsWord(t, 'sugar', 'corn syrup', 'honey')) {
    // Paleo allows honey in moderation — keep recipes that only use honey
    if (!containsWord(t, 'sugar', 'corn syrup')) {
      // honey-only is OK
    } else {
      return false;
    }
  }
  // Require a paleo-friendly protein or vegetable anchor
  return containsWord(t, 'beef', 'chicken', 'pork', 'lamb', 'fish', 'salmon', 'shrimp', 'egg', 'avocado', 'spinach', 'broccoli', 'cauliflower', 'sweet potato');
}

function isLowCarb(r: Recipe): boolean {
  const carb = r.nutrition?.carbsG;
  if (typeof carb === 'number') return carb <= 20;
  // Fallback heuristic: exclude high-carb anchors
  const t = txt(r);
  return !containsWord(t, 'pasta', 'bread', 'rice', 'potato', 'flour', 'sugar', 'corn', 'noodle');
}

function isLowSodium(r: Recipe): boolean {
  const sodium = r.nutrition?.sodiumMg;
  if (typeof sodium === 'number') return sodium <= 600;
  // Fallback: exclude obvious high-salt ingredients
  const t = txt(r);
  return !containsWord(t, 'soy sauce', 'fish sauce', 'bacon', 'ham', 'sausage', 'olive', 'pickle', 'anchovy', 'feta', 'parmesan', 'miso', 'salted');
}

function isLowFat(r: Recipe): boolean {
  const fat = r.nutrition?.fatG;
  if (typeof fat === 'number') return fat <= 8;
  return false;
}

function isLowCalorie(r: Recipe): boolean {
  const kcal = r.nutrition?.calories;
  if (typeof kcal === 'number') return kcal <= 400;
  return false;
}

function isHighProtein(r: Recipe): boolean {
  const p = r.nutrition?.proteinG;
  if (typeof p === 'number') return p >= 25;
  // Fallback to existing tag
  return false;
}

function isDiabetic(r: Recipe): boolean {
  const c = r.nutrition?.carbsG;
  const f = r.nutrition?.fiberG ?? 0;
  if (typeof c !== 'number') return false;
  // ADA "diabetes-friendly": carb load <= 45g w/ at least 3g fiber per serving
  return c <= 45 && f >= 3;
}

function isHalal(r: Recipe): boolean {
  const t = txt(r);
  return !containsWord(t, 'pork', 'bacon', 'ham', 'prosciutto', 'pancetta', 'lard', 'wine', 'beer', 'rum', 'vodka', 'whiskey', 'sake', 'mirin', 'vermouth');
}

function isKosher(r: Recipe): boolean {
  const t = txt(r);
  // No pork, no shellfish, no meat+dairy mix
  if (containsWord(t, 'pork', 'bacon', 'ham', 'pancetta', 'shrimp', 'prawn', 'lobster', 'crab', 'clam', 'mussel', 'oyster', 'scallop'))
    return false;
  // Mixed meat + dairy disqualifies (basic mishna rule)
  const hasMeat = containsWord(t, 'beef', 'chicken', 'lamb', 'turkey', 'duck');
  const hasDairy = containsWord(t, 'milk', 'cream', 'butter', 'cheese', 'yogurt', 'parmesan', 'mozzarella', 'cheddar');
  if (hasMeat && hasDairy) return false;
  return true;
}

function isGlutenFree(r: Recipe): boolean {
  const t = txt(r);
  return !containsWord(t, 'wheat', 'barley', 'rye', 'flour', 'pasta', 'bread', 'cracker', 'soy sauce', 'noodle', 'tortilla', 'couscous', 'bulgur', 'panko');
}

function isDairyFree(r: Recipe): boolean {
  const t = txt(r);
  return !containsWord(t, 'milk', 'cream', 'butter', 'cheese', 'yogurt', 'parmesan', 'mozzarella', 'cheddar', 'ricotta', 'feta', 'mascarpone', 'sour cream', 'buttermilk', 'ghee');
}

function isVegetarian(r: Recipe): boolean {
  const t = txt(r);
  return !containsWord(t, 'beef', 'chicken', 'pork', 'lamb', 'fish', 'salmon', 'shrimp', 'prawn', 'tuna', 'crab', 'lobster', 'bacon', 'ham', 'sausage', 'anchovy', 'turkey', 'duck', 'oyster', 'scallop', 'cod', 'tilapia', 'gelatin');
}

function isVegan(r: Recipe): boolean {
  if (!isVegetarian(r)) return false;
  return isDairyFree(r) && !containsWord(txt(r), 'egg', 'honey');
}

// === Single registry ===
const INFERENCE: Record<string, (r: Recipe) => boolean> = {
  keto: isKeto,
  paleo: isPaleo,
  'low-carb': isLowCarb,
  'low-sodium': isLowSodium,
  'low-fat': isLowFat,
  'low-calorie': isLowCalorie,
  'high-protein': isHighProtein,
  diabetic: isDiabetic,
  halal: isHalal,
  kosher: isKosher,
  'gluten-free': isGlutenFree,
  'dairy-free': isDairyFree,
  vegetarian: isVegetarian,
  vegan: isVegan,
};

export function matchesDiet(recipe: Recipe, dietSlug: string): boolean {
  // Honor explicit tag first
  if (recipe.dietaryTags?.includes(dietSlug)) return true;
  const fn = INFERENCE[dietSlug];
  return fn ? fn(recipe) : false;
}

/**
 * Filter a recipe collection by diet slug, mixing explicit tags + inferred
 * predicates so every diet page has a non-empty result whenever the
 * catalog contains qualifying recipes.
 */
export function filterByDiet(recipes: Recipe[], dietSlug: string): Recipe[] {
  return recipes.filter((r) => matchesDiet(r, dietSlug));
}
