// USDA-derived calorie & macronutrient table (kcal + g per 100 g edible portion).
// Values cross-referenced from USDA FoodData Central (Standard Reference Legacy + SR-28),
// rounded to one decimal for non-zero macros, integer for kcal.
//
// Volumetric ingredients carry an explicit `gramsPerCup` so a single 1 cup → g
// conversion path serves both this calculator and the unit-converter without
// either becoming the authoritative source. Where omitted, defaults to 240 g
// (the average density of common liquids).

export type FoodNutrition = {
  slug: string;
  name: string;
  category: string;
  aliases?: string[];
  kcalPer100g: number;
  proteinG: number;    // per 100 g
  carbG: number;
  fatG: number;
  fiberG: number;
  gramsPerCup?: number;
};

export const CALORIE_CATEGORIES = [
  'Meat & Poultry',
  'Seafood',
  'Eggs & Dairy',
  'Grains & Bread',
  'Legumes & Beans',
  'Vegetables',
  'Fruits',
  'Nuts & Seeds',
  'Fats & Oils',
  'Sweeteners',
  'Sauces & Condiments',
  'Beverages',
  'Snacks & Sweets',
  'Prepared & Misc',
] as const;

export const CALORIE_TABLE: FoodNutrition[] = [
  // ===== MEAT & POULTRY =====
  { slug: 'chicken-breast-skinless', name: 'Chicken breast, skinless, raw', category: 'Meat & Poultry', kcalPer100g: 120, proteinG: 23, carbG: 0, fatG: 2.6, fiberG: 0 },
  { slug: 'chicken-breast-cooked', name: 'Chicken breast, cooked', category: 'Meat & Poultry', kcalPer100g: 165, proteinG: 31, carbG: 0, fatG: 3.6, fiberG: 0 },
  { slug: 'chicken-thigh-skinless', name: 'Chicken thigh, skinless, cooked', category: 'Meat & Poultry', kcalPer100g: 209, proteinG: 26, carbG: 0, fatG: 11, fiberG: 0 },
  { slug: 'chicken-wings', name: 'Chicken wings, cooked', category: 'Meat & Poultry', kcalPer100g: 290, proteinG: 27, carbG: 0, fatG: 20, fiberG: 0 },
  { slug: 'ground-beef-80', name: 'Ground beef, 80% lean / 20% fat, cooked', category: 'Meat & Poultry', kcalPer100g: 254, proteinG: 26, carbG: 0, fatG: 17, fiberG: 0 },
  { slug: 'ground-beef-90', name: 'Ground beef, 90% lean / 10% fat, cooked', category: 'Meat & Poultry', kcalPer100g: 217, proteinG: 26, carbG: 0, fatG: 12, fiberG: 0 },
  { slug: 'steak-ribeye', name: 'Steak, ribeye, cooked', category: 'Meat & Poultry', kcalPer100g: 271, proteinG: 24, carbG: 0, fatG: 19, fiberG: 0 },
  { slug: 'steak-sirloin', name: 'Steak, sirloin, cooked', category: 'Meat & Poultry', kcalPer100g: 206, proteinG: 29, carbG: 0, fatG: 9, fiberG: 0 },
  { slug: 'pork-chop', name: 'Pork chop, cooked', category: 'Meat & Poultry', kcalPer100g: 231, proteinG: 26, carbG: 0, fatG: 13, fiberG: 0 },
  { slug: 'pork-tenderloin', name: 'Pork tenderloin, cooked', category: 'Meat & Poultry', kcalPer100g: 143, proteinG: 26, carbG: 0, fatG: 3.5, fiberG: 0 },
  { slug: 'bacon', name: 'Bacon, cooked', category: 'Meat & Poultry', kcalPer100g: 541, proteinG: 37, carbG: 1.4, fatG: 42, fiberG: 0 },
  { slug: 'ham', name: 'Ham, lean, cooked', category: 'Meat & Poultry', kcalPer100g: 145, proteinG: 21, carbG: 1.5, fatG: 5, fiberG: 0 },
  { slug: 'turkey-breast', name: 'Turkey breast, cooked', category: 'Meat & Poultry', kcalPer100g: 135, proteinG: 30, carbG: 0, fatG: 1, fiberG: 0 },
  { slug: 'turkey-ground', name: 'Ground turkey, cooked', category: 'Meat & Poultry', kcalPer100g: 189, proteinG: 27, carbG: 0, fatG: 8, fiberG: 0 },
  { slug: 'lamb-chop', name: 'Lamb chop, cooked', category: 'Meat & Poultry', kcalPer100g: 282, proteinG: 25, carbG: 0, fatG: 21, fiberG: 0 },
  { slug: 'sausage-italian', name: 'Sausage, Italian, cooked', category: 'Meat & Poultry', kcalPer100g: 268, proteinG: 14, carbG: 1.4, fatG: 22, fiberG: 0 },
  { slug: 'hot-dog', name: 'Hot dog, beef', category: 'Meat & Poultry', kcalPer100g: 290, proteinG: 10, carbG: 4, fatG: 26, fiberG: 0 },
  { slug: 'deli-ham', name: 'Deli ham, sliced', category: 'Meat & Poultry', kcalPer100g: 112, proteinG: 18, carbG: 1, fatG: 4, fiberG: 0 },
  { slug: 'deli-turkey', name: 'Deli turkey, sliced', category: 'Meat & Poultry', kcalPer100g: 104, proteinG: 17, carbG: 4.2, fatG: 1.5, fiberG: 0 },

  // ===== SEAFOOD =====
  { slug: 'salmon-atlantic', name: 'Salmon, Atlantic, cooked', category: 'Seafood', kcalPer100g: 208, proteinG: 20, carbG: 0, fatG: 13, fiberG: 0 },
  { slug: 'salmon-canned', name: 'Salmon, canned in water', category: 'Seafood', kcalPer100g: 142, proteinG: 20, carbG: 0, fatG: 6, fiberG: 0 },
  { slug: 'tuna-canned', name: 'Tuna, canned in water', category: 'Seafood', kcalPer100g: 116, proteinG: 26, carbG: 0, fatG: 1, fiberG: 0 },
  { slug: 'cod', name: 'Cod, cooked', category: 'Seafood', kcalPer100g: 105, proteinG: 23, carbG: 0, fatG: 0.9, fiberG: 0 },
  { slug: 'tilapia', name: 'Tilapia, cooked', category: 'Seafood', kcalPer100g: 128, proteinG: 26, carbG: 0, fatG: 2.7, fiberG: 0 },
  { slug: 'shrimp', name: 'Shrimp, cooked', category: 'Seafood', kcalPer100g: 99, proteinG: 24, carbG: 0.2, fatG: 0.3, fiberG: 0 },
  { slug: 'scallops', name: 'Scallops, cooked', category: 'Seafood', kcalPer100g: 137, proteinG: 24, carbG: 6.3, fatG: 0.9, fiberG: 0 },
  { slug: 'crab', name: 'Crab meat, cooked', category: 'Seafood', kcalPer100g: 87, proteinG: 18, carbG: 0, fatG: 1.1, fiberG: 0 },
  { slug: 'lobster', name: 'Lobster, cooked', category: 'Seafood', kcalPer100g: 89, proteinG: 19, carbG: 0, fatG: 0.9, fiberG: 0 },
  { slug: 'tuna-fresh', name: 'Tuna, fresh, cooked', category: 'Seafood', kcalPer100g: 184, proteinG: 30, carbG: 0, fatG: 6.3, fiberG: 0 },

  // ===== EGGS & DAIRY =====
  { slug: 'egg-whole', name: 'Egg, whole, large (1 = 50 g)', category: 'Eggs & Dairy', kcalPer100g: 155, proteinG: 13, carbG: 1.1, fatG: 11, fiberG: 0 },
  { slug: 'egg-white', name: 'Egg white, large (1 = 33 g)', category: 'Eggs & Dairy', kcalPer100g: 52, proteinG: 11, carbG: 0.7, fatG: 0.2, fiberG: 0 },
  { slug: 'milk-whole', name: 'Milk, whole', category: 'Eggs & Dairy', kcalPer100g: 61, proteinG: 3.2, carbG: 4.8, fatG: 3.3, fiberG: 0, gramsPerCup: 244 },
  { slug: 'milk-skim', name: 'Milk, skim', category: 'Eggs & Dairy', kcalPer100g: 34, proteinG: 3.4, carbG: 5, fatG: 0.1, fiberG: 0, gramsPerCup: 245 },
  { slug: 'milk-2pct', name: 'Milk, 2%', category: 'Eggs & Dairy', kcalPer100g: 50, proteinG: 3.3, carbG: 4.7, fatG: 2, fiberG: 0, gramsPerCup: 244 },
  { slug: 'almond-milk', name: 'Almond milk, unsweetened', category: 'Eggs & Dairy', kcalPer100g: 13, proteinG: 0.6, carbG: 0.6, fatG: 1.1, fiberG: 0.4, gramsPerCup: 240 },
  { slug: 'oat-milk', name: 'Oat milk, unsweetened', category: 'Eggs & Dairy', kcalPer100g: 47, proteinG: 1, carbG: 7, fatG: 1.5, fiberG: 0.8, gramsPerCup: 240 },
  { slug: 'soy-milk', name: 'Soy milk, unsweetened', category: 'Eggs & Dairy', kcalPer100g: 33, proteinG: 3.3, carbG: 0.6, fatG: 1.8, fiberG: 0.4, gramsPerCup: 243 },
  { slug: 'coconut-milk-canned', name: 'Coconut milk, canned, full-fat', category: 'Eggs & Dairy', kcalPer100g: 230, proteinG: 2.3, carbG: 6, fatG: 24, fiberG: 2.2, gramsPerCup: 240 },
  { slug: 'yogurt-plain', name: 'Yogurt, plain whole milk', category: 'Eggs & Dairy', kcalPer100g: 61, proteinG: 3.5, carbG: 4.7, fatG: 3.3, fiberG: 0, gramsPerCup: 245 },
  { slug: 'yogurt-greek-nonfat', name: 'Yogurt, Greek, nonfat', category: 'Eggs & Dairy', kcalPer100g: 59, proteinG: 10, carbG: 3.6, fatG: 0.4, fiberG: 0, gramsPerCup: 245 },
  { slug: 'yogurt-greek-2pct', name: 'Yogurt, Greek, 2% fat', category: 'Eggs & Dairy', kcalPer100g: 73, proteinG: 9.9, carbG: 3.9, fatG: 1.9, fiberG: 0, gramsPerCup: 245 },
  { slug: 'butter', name: 'Butter, salted', category: 'Eggs & Dairy', kcalPer100g: 717, proteinG: 0.9, carbG: 0.1, fatG: 81, fiberG: 0, gramsPerCup: 227 },
  { slug: 'heavy-cream', name: 'Heavy cream', category: 'Eggs & Dairy', kcalPer100g: 340, proteinG: 2.8, carbG: 2.8, fatG: 36, fiberG: 0, gramsPerCup: 238 },
  { slug: 'sour-cream', name: 'Sour cream', category: 'Eggs & Dairy', kcalPer100g: 198, proteinG: 2.4, carbG: 4.6, fatG: 19, fiberG: 0, gramsPerCup: 230 },
  { slug: 'cream-cheese', name: 'Cream cheese', category: 'Eggs & Dairy', kcalPer100g: 342, proteinG: 6, carbG: 4.1, fatG: 34, fiberG: 0, gramsPerCup: 232 },
  { slug: 'cottage-cheese', name: 'Cottage cheese, 2% fat', category: 'Eggs & Dairy', kcalPer100g: 84, proteinG: 11, carbG: 4.3, fatG: 2.3, fiberG: 0, gramsPerCup: 226 },
  { slug: 'cheddar', name: 'Cheddar cheese', category: 'Eggs & Dairy', kcalPer100g: 403, proteinG: 25, carbG: 1.3, fatG: 33, fiberG: 0, gramsPerCup: 113 },
  { slug: 'mozzarella', name: 'Mozzarella, low-moisture', category: 'Eggs & Dairy', kcalPer100g: 280, proteinG: 28, carbG: 3.1, fatG: 17, fiberG: 0, gramsPerCup: 112 },
  { slug: 'mozzarella-fresh', name: 'Mozzarella, fresh', category: 'Eggs & Dairy', kcalPer100g: 250, proteinG: 18, carbG: 2.2, fatG: 19, fiberG: 0, gramsPerCup: 132 },
  { slug: 'parmesan', name: 'Parmesan, grated', category: 'Eggs & Dairy', kcalPer100g: 431, proteinG: 38, carbG: 4.1, fatG: 29, fiberG: 0, gramsPerCup: 100 },
  { slug: 'feta', name: 'Feta cheese', category: 'Eggs & Dairy', kcalPer100g: 264, proteinG: 14, carbG: 4.1, fatG: 21, fiberG: 0, gramsPerCup: 150 },

  // ===== GRAINS & BREAD =====
  { slug: 'rice-white-cooked', name: 'Rice, white, cooked', category: 'Grains & Bread', kcalPer100g: 130, proteinG: 2.7, carbG: 28, fatG: 0.3, fiberG: 0.4, gramsPerCup: 158 },
  { slug: 'rice-brown-cooked', name: 'Rice, brown, cooked', category: 'Grains & Bread', kcalPer100g: 112, proteinG: 2.3, carbG: 23, fatG: 0.8, fiberG: 1.8, gramsPerCup: 195 },
  { slug: 'rice-white-raw', name: 'Rice, white, raw', category: 'Grains & Bread', kcalPer100g: 360, proteinG: 6.6, carbG: 79, fatG: 0.6, fiberG: 1.3, gramsPerCup: 185 },
  { slug: 'rice-brown-raw', name: 'Rice, brown, raw', category: 'Grains & Bread', kcalPer100g: 367, proteinG: 7.5, carbG: 76, fatG: 2.7, fiberG: 3.4, gramsPerCup: 190 },
  { slug: 'quinoa-cooked', name: 'Quinoa, cooked', category: 'Grains & Bread', kcalPer100g: 120, proteinG: 4.4, carbG: 21, fatG: 1.9, fiberG: 2.8, gramsPerCup: 185 },
  { slug: 'couscous-cooked', name: 'Couscous, cooked', category: 'Grains & Bread', kcalPer100g: 112, proteinG: 3.8, carbG: 23, fatG: 0.2, fiberG: 1.4, gramsPerCup: 173 },
  { slug: 'bulgur-cooked', name: 'Bulgur, cooked', category: 'Grains & Bread', kcalPer100g: 83, proteinG: 3.1, carbG: 19, fatG: 0.2, fiberG: 4.5, gramsPerCup: 182 },
  { slug: 'barley-cooked', name: 'Barley, pearl, cooked', category: 'Grains & Bread', kcalPer100g: 123, proteinG: 2.3, carbG: 28, fatG: 0.4, fiberG: 3.8, gramsPerCup: 157 },
  { slug: 'oats-rolled', name: 'Oats, rolled, dry', category: 'Grains & Bread', kcalPer100g: 389, proteinG: 16.9, carbG: 66, fatG: 6.9, fiberG: 10.6, gramsPerCup: 81 },
  { slug: 'pasta-cooked', name: 'Pasta, cooked', category: 'Grains & Bread', kcalPer100g: 158, proteinG: 5.8, carbG: 31, fatG: 0.9, fiberG: 1.8, gramsPerCup: 140 },
  { slug: 'pasta-dry', name: 'Pasta, dry', category: 'Grains & Bread', kcalPer100g: 371, proteinG: 13, carbG: 75, fatG: 1.5, fiberG: 3.2, gramsPerCup: 113 },
  { slug: 'flour-ap', name: 'Flour, all-purpose', category: 'Grains & Bread', kcalPer100g: 364, proteinG: 10.3, carbG: 76, fatG: 1, fiberG: 2.7, gramsPerCup: 125 },
  { slug: 'flour-whole-wheat', name: 'Flour, whole wheat', category: 'Grains & Bread', kcalPer100g: 340, proteinG: 13.2, carbG: 72, fatG: 2.5, fiberG: 10.7, gramsPerCup: 120 },
  { slug: 'bread-white', name: 'Bread, white', category: 'Grains & Bread', kcalPer100g: 265, proteinG: 9, carbG: 49, fatG: 3.2, fiberG: 2.7 },
  { slug: 'bread-wholewheat', name: 'Bread, whole wheat', category: 'Grains & Bread', kcalPer100g: 247, proteinG: 13, carbG: 41, fatG: 4.2, fiberG: 7 },
  { slug: 'bread-sourdough', name: 'Bread, sourdough', category: 'Grains & Bread', kcalPer100g: 289, proteinG: 11, carbG: 56, fatG: 1.7, fiberG: 2.5 },
  { slug: 'bagel', name: 'Bagel, plain', category: 'Grains & Bread', kcalPer100g: 250, proteinG: 10, carbG: 49, fatG: 1.5, fiberG: 2.1 },
  { slug: 'tortilla-flour', name: 'Tortilla, flour, 8-inch', category: 'Grains & Bread', kcalPer100g: 312, proteinG: 8.3, carbG: 50, fatG: 9, fiberG: 3.2 },
  { slug: 'tortilla-corn', name: 'Tortilla, corn', category: 'Grains & Bread', kcalPer100g: 218, proteinG: 5.7, carbG: 45, fatG: 2.9, fiberG: 6.3 },
  { slug: 'pancake-mix-prepared', name: 'Pancake, prepared', category: 'Grains & Bread', kcalPer100g: 227, proteinG: 6, carbG: 28, fatG: 9, fiberG: 1 },
  { slug: 'cornflakes', name: 'Cereal, cornflakes', category: 'Grains & Bread', kcalPer100g: 357, proteinG: 7, carbG: 84, fatG: 0.4, fiberG: 3, gramsPerCup: 28 },
  { slug: 'granola', name: 'Granola', category: 'Grains & Bread', kcalPer100g: 484, proteinG: 13, carbG: 56, fatG: 24, fiberG: 8.9, gramsPerCup: 122 },

  // ===== LEGUMES & BEANS =====
  { slug: 'lentils-cooked', name: 'Lentils, cooked', category: 'Legumes & Beans', kcalPer100g: 116, proteinG: 9, carbG: 20, fatG: 0.4, fiberG: 7.9, gramsPerCup: 198 },
  { slug: 'lentils-dry', name: 'Lentils, dry', category: 'Legumes & Beans', kcalPer100g: 353, proteinG: 25, carbG: 60, fatG: 1.1, fiberG: 31, gramsPerCup: 192 },
  { slug: 'chickpeas-cooked', name: 'Chickpeas, cooked', category: 'Legumes & Beans', kcalPer100g: 164, proteinG: 8.9, carbG: 27, fatG: 2.6, fiberG: 7.6, gramsPerCup: 164 },
  { slug: 'chickpeas-canned', name: 'Chickpeas, canned, drained', category: 'Legumes & Beans', kcalPer100g: 139, proteinG: 7.1, carbG: 22, fatG: 2.6, fiberG: 6, gramsPerCup: 160 },
  { slug: 'black-beans-cooked', name: 'Black beans, cooked', category: 'Legumes & Beans', kcalPer100g: 132, proteinG: 8.9, carbG: 23.7, fatG: 0.5, fiberG: 8.7, gramsPerCup: 172 },
  { slug: 'kidney-beans-cooked', name: 'Kidney beans, cooked', category: 'Legumes & Beans', kcalPer100g: 127, proteinG: 8.7, carbG: 23, fatG: 0.5, fiberG: 6.4, gramsPerCup: 177 },
  { slug: 'pinto-beans-cooked', name: 'Pinto beans, cooked', category: 'Legumes & Beans', kcalPer100g: 143, proteinG: 9, carbG: 26, fatG: 0.7, fiberG: 9, gramsPerCup: 171 },
  { slug: 'edamame', name: 'Edamame, cooked', category: 'Legumes & Beans', kcalPer100g: 121, proteinG: 12, carbG: 9, fatG: 5, fiberG: 5, gramsPerCup: 155 },
  { slug: 'tofu-firm', name: 'Tofu, firm', category: 'Legumes & Beans', kcalPer100g: 144, proteinG: 17, carbG: 2.8, fatG: 9, fiberG: 2.3, gramsPerCup: 252 },
  { slug: 'tempeh', name: 'Tempeh', category: 'Legumes & Beans', kcalPer100g: 195, proteinG: 20, carbG: 7.6, fatG: 11, fiberG: 0 },
  { slug: 'peanut-butter', name: 'Peanut butter, smooth', category: 'Legumes & Beans', kcalPer100g: 588, proteinG: 25, carbG: 20, fatG: 50, fiberG: 6, gramsPerCup: 258 },

  // ===== VEGETABLES =====
  { slug: 'broccoli', name: 'Broccoli, raw', category: 'Vegetables', kcalPer100g: 34, proteinG: 2.8, carbG: 7, fatG: 0.4, fiberG: 2.6, gramsPerCup: 91 },
  { slug: 'spinach', name: 'Spinach, raw', category: 'Vegetables', kcalPer100g: 23, proteinG: 2.9, carbG: 3.6, fatG: 0.4, fiberG: 2.2, gramsPerCup: 30 },
  { slug: 'kale', name: 'Kale, raw', category: 'Vegetables', kcalPer100g: 49, proteinG: 4.3, carbG: 8.8, fatG: 0.9, fiberG: 3.6, gramsPerCup: 67 },
  { slug: 'lettuce', name: 'Lettuce, romaine', category: 'Vegetables', kcalPer100g: 17, proteinG: 1.2, carbG: 3.3, fatG: 0.3, fiberG: 2.1, gramsPerCup: 47 },
  { slug: 'tomato', name: 'Tomato, raw', category: 'Vegetables', kcalPer100g: 18, proteinG: 0.9, carbG: 3.9, fatG: 0.2, fiberG: 1.2, gramsPerCup: 180 },
  { slug: 'tomato-canned', name: 'Tomato, canned, crushed', category: 'Vegetables', kcalPer100g: 32, proteinG: 1.6, carbG: 7.3, fatG: 0.3, fiberG: 1.9, gramsPerCup: 245 },
  { slug: 'tomato-paste', name: 'Tomato paste', category: 'Vegetables', kcalPer100g: 82, proteinG: 4.3, carbG: 19, fatG: 0.5, fiberG: 4.1, gramsPerCup: 262 },
  { slug: 'onion', name: 'Onion, raw', category: 'Vegetables', kcalPer100g: 40, proteinG: 1.1, carbG: 9.3, fatG: 0.1, fiberG: 1.7, gramsPerCup: 160 },
  { slug: 'garlic', name: 'Garlic, raw', category: 'Vegetables', kcalPer100g: 149, proteinG: 6.4, carbG: 33, fatG: 0.5, fiberG: 2.1 },
  { slug: 'carrot', name: 'Carrot, raw', category: 'Vegetables', kcalPer100g: 41, proteinG: 0.9, carbG: 9.6, fatG: 0.2, fiberG: 2.8, gramsPerCup: 128 },
  { slug: 'potato', name: 'Potato, raw, with skin', category: 'Vegetables', kcalPer100g: 77, proteinG: 2, carbG: 17, fatG: 0.1, fiberG: 2.2 },
  { slug: 'potato-mashed', name: 'Potato, mashed (with milk + butter)', category: 'Vegetables', kcalPer100g: 113, proteinG: 1.9, carbG: 17, fatG: 4.2, fiberG: 1.5, gramsPerCup: 210 },
  { slug: 'sweet-potato', name: 'Sweet potato, raw', category: 'Vegetables', kcalPer100g: 86, proteinG: 1.6, carbG: 20, fatG: 0.1, fiberG: 3 },
  { slug: 'bell-pepper', name: 'Bell pepper, red, raw', category: 'Vegetables', kcalPer100g: 31, proteinG: 1, carbG: 6, fatG: 0.3, fiberG: 2.1, gramsPerCup: 149 },
  { slug: 'cucumber', name: 'Cucumber, raw', category: 'Vegetables', kcalPer100g: 16, proteinG: 0.7, carbG: 3.6, fatG: 0.1, fiberG: 0.5, gramsPerCup: 119 },
  { slug: 'zucchini', name: 'Zucchini, raw', category: 'Vegetables', kcalPer100g: 17, proteinG: 1.2, carbG: 3.1, fatG: 0.3, fiberG: 1, gramsPerCup: 124 },
  { slug: 'mushrooms', name: 'Mushrooms, white, raw', category: 'Vegetables', kcalPer100g: 22, proteinG: 3.1, carbG: 3.3, fatG: 0.3, fiberG: 1, gramsPerCup: 96 },
  { slug: 'cauliflower', name: 'Cauliflower, raw', category: 'Vegetables', kcalPer100g: 25, proteinG: 1.9, carbG: 5, fatG: 0.3, fiberG: 2, gramsPerCup: 100 },
  { slug: 'cabbage', name: 'Cabbage, raw', category: 'Vegetables', kcalPer100g: 25, proteinG: 1.3, carbG: 5.8, fatG: 0.1, fiberG: 2.5, gramsPerCup: 89 },
  { slug: 'asparagus', name: 'Asparagus, raw', category: 'Vegetables', kcalPer100g: 20, proteinG: 2.2, carbG: 3.9, fatG: 0.1, fiberG: 2.1, gramsPerCup: 134 },
  { slug: 'corn', name: 'Corn, sweet, cooked', category: 'Vegetables', kcalPer100g: 96, proteinG: 3.4, carbG: 21, fatG: 1.5, fiberG: 2.4, gramsPerCup: 165 },
  { slug: 'peas', name: 'Peas, green, cooked', category: 'Vegetables', kcalPer100g: 84, proteinG: 5.4, carbG: 16, fatG: 0.2, fiberG: 5.5, gramsPerCup: 160 },
  { slug: 'celery', name: 'Celery, raw', category: 'Vegetables', kcalPer100g: 16, proteinG: 0.7, carbG: 3, fatG: 0.2, fiberG: 1.6, gramsPerCup: 101 },
  { slug: 'avocado', name: 'Avocado, raw', category: 'Vegetables', kcalPer100g: 160, proteinG: 2, carbG: 8.5, fatG: 14.7, fiberG: 6.7, gramsPerCup: 150 },

  // ===== FRUITS =====
  { slug: 'banana', name: 'Banana, raw', category: 'Fruits', kcalPer100g: 89, proteinG: 1.1, carbG: 23, fatG: 0.3, fiberG: 2.6 },
  { slug: 'apple', name: 'Apple, raw, with skin', category: 'Fruits', kcalPer100g: 52, proteinG: 0.3, carbG: 14, fatG: 0.2, fiberG: 2.4 },
  { slug: 'orange', name: 'Orange, raw', category: 'Fruits', kcalPer100g: 47, proteinG: 0.9, carbG: 12, fatG: 0.1, fiberG: 2.4 },
  { slug: 'lemon', name: 'Lemon, raw', category: 'Fruits', kcalPer100g: 29, proteinG: 1.1, carbG: 9, fatG: 0.3, fiberG: 2.8 },
  { slug: 'lime', name: 'Lime, raw', category: 'Fruits', kcalPer100g: 30, proteinG: 0.7, carbG: 11, fatG: 0.2, fiberG: 2.8 },
  { slug: 'grape', name: 'Grapes, raw', category: 'Fruits', kcalPer100g: 67, proteinG: 0.6, carbG: 17, fatG: 0.4, fiberG: 0.9, gramsPerCup: 151 },
  { slug: 'strawberry', name: 'Strawberries, raw', category: 'Fruits', kcalPer100g: 32, proteinG: 0.7, carbG: 7.7, fatG: 0.3, fiberG: 2, gramsPerCup: 152 },
  { slug: 'blueberry', name: 'Blueberries, raw', category: 'Fruits', kcalPer100g: 57, proteinG: 0.7, carbG: 14, fatG: 0.3, fiberG: 2.4, gramsPerCup: 148 },
  { slug: 'raspberry', name: 'Raspberries, raw', category: 'Fruits', kcalPer100g: 52, proteinG: 1.2, carbG: 12, fatG: 0.7, fiberG: 6.5, gramsPerCup: 123 },
  { slug: 'blackberry', name: 'Blackberries, raw', category: 'Fruits', kcalPer100g: 43, proteinG: 1.4, carbG: 9.6, fatG: 0.5, fiberG: 5.3, gramsPerCup: 144 },
  { slug: 'pineapple', name: 'Pineapple, raw', category: 'Fruits', kcalPer100g: 50, proteinG: 0.5, carbG: 13, fatG: 0.1, fiberG: 1.4, gramsPerCup: 165 },
  { slug: 'mango', name: 'Mango, raw', category: 'Fruits', kcalPer100g: 60, proteinG: 0.8, carbG: 15, fatG: 0.4, fiberG: 1.6, gramsPerCup: 165 },
  { slug: 'watermelon', name: 'Watermelon, raw', category: 'Fruits', kcalPer100g: 30, proteinG: 0.6, carbG: 7.6, fatG: 0.2, fiberG: 0.4, gramsPerCup: 152 },
  { slug: 'cantaloupe', name: 'Cantaloupe, raw', category: 'Fruits', kcalPer100g: 34, proteinG: 0.8, carbG: 8.2, fatG: 0.2, fiberG: 0.9, gramsPerCup: 160 },
  { slug: 'peach', name: 'Peach, raw', category: 'Fruits', kcalPer100g: 39, proteinG: 0.9, carbG: 9.5, fatG: 0.3, fiberG: 1.5, gramsPerCup: 154 },
  { slug: 'pear', name: 'Pear, raw', category: 'Fruits', kcalPer100g: 57, proteinG: 0.4, carbG: 15, fatG: 0.1, fiberG: 3.1 },
  { slug: 'plum', name: 'Plum, raw', category: 'Fruits', kcalPer100g: 46, proteinG: 0.7, carbG: 11, fatG: 0.3, fiberG: 1.4 },
  { slug: 'cherry', name: 'Cherries, sweet, raw', category: 'Fruits', kcalPer100g: 63, proteinG: 1.1, carbG: 16, fatG: 0.2, fiberG: 2.1, gramsPerCup: 154 },
  { slug: 'pomegranate', name: 'Pomegranate, raw (arils)', category: 'Fruits', kcalPer100g: 83, proteinG: 1.7, carbG: 19, fatG: 1.2, fiberG: 4, gramsPerCup: 174 },
  { slug: 'kiwi', name: 'Kiwi, raw', category: 'Fruits', kcalPer100g: 61, proteinG: 1.1, carbG: 15, fatG: 0.5, fiberG: 3 },
  { slug: 'dates', name: 'Dates, Medjool', category: 'Fruits', kcalPer100g: 277, proteinG: 1.8, carbG: 75, fatG: 0.2, fiberG: 6.7 },
  { slug: 'raisins', name: 'Raisins', category: 'Fruits', kcalPer100g: 299, proteinG: 3.1, carbG: 79, fatG: 0.5, fiberG: 3.7, gramsPerCup: 165 },

  // ===== NUTS & SEEDS =====
  { slug: 'almonds', name: 'Almonds, raw', category: 'Nuts & Seeds', kcalPer100g: 579, proteinG: 21, carbG: 22, fatG: 50, fiberG: 12.5, gramsPerCup: 143 },
  { slug: 'peanuts', name: 'Peanuts, roasted', category: 'Nuts & Seeds', kcalPer100g: 567, proteinG: 26, carbG: 16, fatG: 49, fiberG: 8.5, gramsPerCup: 146 },
  { slug: 'walnuts', name: 'Walnuts, raw', category: 'Nuts & Seeds', kcalPer100g: 654, proteinG: 15, carbG: 14, fatG: 65, fiberG: 6.7, gramsPerCup: 100 },
  { slug: 'cashews', name: 'Cashews, raw', category: 'Nuts & Seeds', kcalPer100g: 553, proteinG: 18, carbG: 30, fatG: 44, fiberG: 3.3, gramsPerCup: 137 },
  { slug: 'pistachios', name: 'Pistachios, raw', category: 'Nuts & Seeds', kcalPer100g: 560, proteinG: 20, carbG: 28, fatG: 45, fiberG: 10.6, gramsPerCup: 123 },
  { slug: 'pecans', name: 'Pecans, raw', category: 'Nuts & Seeds', kcalPer100g: 691, proteinG: 9.2, carbG: 14, fatG: 72, fiberG: 9.6, gramsPerCup: 99 },
  { slug: 'sunflower-seeds', name: 'Sunflower seeds', category: 'Nuts & Seeds', kcalPer100g: 584, proteinG: 21, carbG: 20, fatG: 51, fiberG: 8.6, gramsPerCup: 140 },
  { slug: 'pumpkin-seeds', name: 'Pumpkin seeds', category: 'Nuts & Seeds', kcalPer100g: 559, proteinG: 30, carbG: 11, fatG: 49, fiberG: 6, gramsPerCup: 129 },
  { slug: 'chia-seeds', name: 'Chia seeds', category: 'Nuts & Seeds', kcalPer100g: 486, proteinG: 17, carbG: 42, fatG: 31, fiberG: 34, gramsPerCup: 170 },
  { slug: 'flaxseed', name: 'Flaxseed, ground', category: 'Nuts & Seeds', kcalPer100g: 534, proteinG: 18, carbG: 29, fatG: 42, fiberG: 27, gramsPerCup: 130 },
  { slug: 'sesame-seeds', name: 'Sesame seeds', category: 'Nuts & Seeds', kcalPer100g: 573, proteinG: 18, carbG: 23, fatG: 50, fiberG: 12, gramsPerCup: 144 },

  // ===== FATS & OILS =====
  { slug: 'olive-oil', name: 'Olive oil', category: 'Fats & Oils', kcalPer100g: 884, proteinG: 0, carbG: 0, fatG: 100, fiberG: 0, gramsPerCup: 216 },
  { slug: 'vegetable-oil', name: 'Vegetable / canola oil', category: 'Fats & Oils', kcalPer100g: 884, proteinG: 0, carbG: 0, fatG: 100, fiberG: 0, gramsPerCup: 218 },
  { slug: 'coconut-oil', name: 'Coconut oil', category: 'Fats & Oils', kcalPer100g: 892, proteinG: 0, carbG: 0, fatG: 99, fiberG: 0, gramsPerCup: 216 },
  { slug: 'sesame-oil', name: 'Sesame oil', category: 'Fats & Oils', kcalPer100g: 884, proteinG: 0, carbG: 0, fatG: 100, fiberG: 0, gramsPerCup: 218 },
  { slug: 'ghee', name: 'Ghee', category: 'Fats & Oils', kcalPer100g: 900, proteinG: 0, carbG: 0, fatG: 100, fiberG: 0, gramsPerCup: 230 },
  { slug: 'lard', name: 'Lard', category: 'Fats & Oils', kcalPer100g: 902, proteinG: 0, carbG: 0, fatG: 100, fiberG: 0, gramsPerCup: 205 },

  // ===== SWEETENERS =====
  { slug: 'sugar-white', name: 'Sugar, granulated', category: 'Sweeteners', kcalPer100g: 387, proteinG: 0, carbG: 100, fatG: 0, fiberG: 0, gramsPerCup: 200 },
  { slug: 'sugar-brown', name: 'Sugar, brown (packed)', category: 'Sweeteners', kcalPer100g: 380, proteinG: 0, carbG: 98, fatG: 0, fiberG: 0, gramsPerCup: 220 },
  { slug: 'powdered-sugar', name: 'Sugar, powdered', category: 'Sweeteners', kcalPer100g: 389, proteinG: 0, carbG: 100, fatG: 0, fiberG: 0, gramsPerCup: 120 },
  { slug: 'honey', name: 'Honey', category: 'Sweeteners', kcalPer100g: 304, proteinG: 0.3, carbG: 82, fatG: 0, fiberG: 0.2, gramsPerCup: 339 },
  { slug: 'maple-syrup', name: 'Maple syrup', category: 'Sweeteners', kcalPer100g: 260, proteinG: 0, carbG: 67, fatG: 0.2, fiberG: 0, gramsPerCup: 322 },
  { slug: 'agave-nectar', name: 'Agave nectar', category: 'Sweeteners', kcalPer100g: 310, proteinG: 0.1, carbG: 76, fatG: 0.5, fiberG: 0.2, gramsPerCup: 332 },
  { slug: 'molasses', name: 'Molasses', category: 'Sweeteners', kcalPer100g: 290, proteinG: 0, carbG: 75, fatG: 0.1, fiberG: 0, gramsPerCup: 337 },

  // ===== SAUCES & CONDIMENTS =====
  { slug: 'soy-sauce', name: 'Soy sauce', category: 'Sauces & Condiments', kcalPer100g: 53, proteinG: 8, carbG: 4.9, fatG: 0.1, fiberG: 0.6, gramsPerCup: 256 },
  { slug: 'ketchup', name: 'Ketchup', category: 'Sauces & Condiments', kcalPer100g: 101, proteinG: 1.7, carbG: 27, fatG: 0.4, fiberG: 0.3, gramsPerCup: 272 },
  { slug: 'mayo', name: 'Mayonnaise', category: 'Sauces & Condiments', kcalPer100g: 680, proteinG: 1, carbG: 0.6, fatG: 75, fiberG: 0, gramsPerCup: 220 },
  { slug: 'mustard-yellow', name: 'Mustard, yellow', category: 'Sauces & Condiments', kcalPer100g: 66, proteinG: 4.4, carbG: 5.8, fatG: 4, fiberG: 3.3, gramsPerCup: 250 },
  { slug: 'mustard-dijon', name: 'Mustard, Dijon', category: 'Sauces & Condiments', kcalPer100g: 92, proteinG: 4.6, carbG: 5.3, fatG: 6, fiberG: 3, gramsPerCup: 250 },
  { slug: 'hot-sauce', name: 'Hot sauce (sriracha)', category: 'Sauces & Condiments', kcalPer100g: 93, proteinG: 1.9, carbG: 19, fatG: 0.9, fiberG: 2.2, gramsPerCup: 240 },
  { slug: 'bbq-sauce', name: 'BBQ sauce', category: 'Sauces & Condiments', kcalPer100g: 172, proteinG: 0.8, carbG: 41, fatG: 0.6, fiberG: 0.9, gramsPerCup: 280 },
  { slug: 'salsa', name: 'Salsa, prepared', category: 'Sauces & Condiments', kcalPer100g: 36, proteinG: 1.5, carbG: 7.6, fatG: 0.2, fiberG: 1.8, gramsPerCup: 260 },
  { slug: 'pesto', name: 'Pesto, basil', category: 'Sauces & Condiments', kcalPer100g: 418, proteinG: 5, carbG: 6, fatG: 43, fiberG: 1.5, gramsPerCup: 240 },
  { slug: 'hummus', name: 'Hummus', category: 'Sauces & Condiments', kcalPer100g: 166, proteinG: 7.9, carbG: 14, fatG: 9.6, fiberG: 6, gramsPerCup: 246 },
  { slug: 'jam', name: 'Jam / fruit preserves', category: 'Sauces & Condiments', kcalPer100g: 278, proteinG: 0.4, carbG: 69, fatG: 0.1, fiberG: 1.1, gramsPerCup: 322 },
  { slug: 'salt', name: 'Salt', category: 'Sauces & Condiments', kcalPer100g: 0, proteinG: 0, carbG: 0, fatG: 0, fiberG: 0 },
  { slug: 'black-pepper', name: 'Black pepper, ground', category: 'Sauces & Condiments', kcalPer100g: 251, proteinG: 10.4, carbG: 64, fatG: 3.3, fiberG: 25.3 },

  // ===== BEVERAGES =====
  { slug: 'water', name: 'Water', category: 'Beverages', kcalPer100g: 0, proteinG: 0, carbG: 0, fatG: 0, fiberG: 0, gramsPerCup: 240 },
  { slug: 'coffee-black', name: 'Coffee, black, brewed', category: 'Beverages', kcalPer100g: 1, proteinG: 0.1, carbG: 0, fatG: 0, fiberG: 0, gramsPerCup: 240 },
  { slug: 'tea-black', name: 'Tea, black, brewed', category: 'Beverages', kcalPer100g: 1, proteinG: 0, carbG: 0.2, fatG: 0, fiberG: 0, gramsPerCup: 240 },
  { slug: 'orange-juice', name: 'Orange juice', category: 'Beverages', kcalPer100g: 45, proteinG: 0.7, carbG: 10, fatG: 0.2, fiberG: 0.2, gramsPerCup: 248 },
  { slug: 'apple-juice', name: 'Apple juice', category: 'Beverages', kcalPer100g: 46, proteinG: 0.1, carbG: 11, fatG: 0.1, fiberG: 0.2, gramsPerCup: 248 },
  { slug: 'wine-red', name: 'Wine, red, dry', category: 'Beverages', kcalPer100g: 85, proteinG: 0.07, carbG: 2.6, fatG: 0, fiberG: 0, gramsPerCup: 235 },
  { slug: 'wine-white', name: 'Wine, white, dry', category: 'Beverages', kcalPer100g: 82, proteinG: 0.07, carbG: 2.6, fatG: 0, fiberG: 0, gramsPerCup: 235 },
  { slug: 'beer-regular', name: 'Beer, regular', category: 'Beverages', kcalPer100g: 43, proteinG: 0.5, carbG: 3.5, fatG: 0, fiberG: 0, gramsPerCup: 240 },

  // ===== SNACKS & SWEETS =====
  { slug: 'chocolate-dark', name: 'Chocolate, dark, 70-85%', category: 'Snacks & Sweets', kcalPer100g: 598, proteinG: 7.8, carbG: 46, fatG: 43, fiberG: 11 },
  { slug: 'chocolate-milk', name: 'Chocolate, milk', category: 'Snacks & Sweets', kcalPer100g: 535, proteinG: 7.7, carbG: 59, fatG: 30, fiberG: 3.4 },
  { slug: 'cocoa-powder', name: 'Cocoa powder, unsweetened', category: 'Snacks & Sweets', kcalPer100g: 228, proteinG: 19.6, carbG: 58, fatG: 14, fiberG: 33, gramsPerCup: 86 },
  { slug: 'cookie-chocchip', name: 'Cookie, chocolate chip', category: 'Snacks & Sweets', kcalPer100g: 484, proteinG: 5, carbG: 67, fatG: 22, fiberG: 2.4 },
  { slug: 'cake-chocolate', name: 'Cake, chocolate, frosted', category: 'Snacks & Sweets', kcalPer100g: 371, proteinG: 4.3, carbG: 50, fatG: 18, fiberG: 2.6 },
  { slug: 'ice-cream-vanilla', name: 'Ice cream, vanilla', category: 'Snacks & Sweets', kcalPer100g: 207, proteinG: 3.5, carbG: 24, fatG: 11, fiberG: 0.7, gramsPerCup: 132 },
  { slug: 'donut-glazed', name: 'Donut, glazed', category: 'Snacks & Sweets', kcalPer100g: 421, proteinG: 5.2, carbG: 51, fatG: 23, fiberG: 1.5 },
  { slug: 'croissant', name: 'Croissant, butter', category: 'Snacks & Sweets', kcalPer100g: 406, proteinG: 8.2, carbG: 46, fatG: 21, fiberG: 2.6 },
  { slug: 'potato-chips', name: 'Potato chips', category: 'Snacks & Sweets', kcalPer100g: 536, proteinG: 7, carbG: 53, fatG: 35, fiberG: 4.4 },
  { slug: 'pretzels', name: 'Pretzels, hard', category: 'Snacks & Sweets', kcalPer100g: 380, proteinG: 10, carbG: 80, fatG: 2.8, fiberG: 3.4 },
  { slug: 'popcorn-air', name: 'Popcorn, air-popped', category: 'Snacks & Sweets', kcalPer100g: 387, proteinG: 12, carbG: 78, fatG: 4.5, fiberG: 15, gramsPerCup: 8 },

  // ===== PREPARED & MISC =====
  { slug: 'pizza-cheese', name: 'Pizza, cheese, regular crust', category: 'Prepared & Misc', kcalPer100g: 266, proteinG: 11, carbG: 33, fatG: 10, fiberG: 2.3 },
  { slug: 'french-fries', name: 'French fries, restaurant', category: 'Prepared & Misc', kcalPer100g: 312, proteinG: 3.4, carbG: 41, fatG: 15, fiberG: 3.8 },
  { slug: 'burger-patty', name: 'Hamburger patty (no bun)', category: 'Prepared & Misc', kcalPer100g: 250, proteinG: 26, carbG: 0, fatG: 17, fiberG: 0 },
  { slug: 'mac-and-cheese', name: 'Mac and cheese, prepared', category: 'Prepared & Misc', kcalPer100g: 164, proteinG: 6.4, carbG: 20, fatG: 6.4, fiberG: 0.9, gramsPerCup: 200 },
  { slug: 'soup-tomato', name: 'Soup, tomato, prepared with water', category: 'Prepared & Misc', kcalPer100g: 31, proteinG: 0.9, carbG: 6, fatG: 0.6, fiberG: 0.4, gramsPerCup: 244 },
  { slug: 'soup-chicken-noodle', name: 'Soup, chicken noodle', category: 'Prepared & Misc', kcalPer100g: 25, proteinG: 1.4, carbG: 3, fatG: 0.6, fiberG: 0.2, gramsPerCup: 241 },
  { slug: 'pad-thai', name: 'Pad Thai (restaurant)', category: 'Prepared & Misc', kcalPer100g: 184, proteinG: 7.5, carbG: 23, fatG: 7, fiberG: 1.6 },
  { slug: 'sushi-roll', name: 'Sushi roll (avg)', category: 'Prepared & Misc', kcalPer100g: 156, proteinG: 6, carbG: 28, fatG: 2, fiberG: 0.9 },
  { slug: 'burrito', name: 'Burrito, bean & cheese', category: 'Prepared & Misc', kcalPer100g: 206, proteinG: 8, carbG: 27, fatG: 7.7, fiberG: 4 },
];

// =================================================================
// UNIT CONVERSION TO GRAMS
// =================================================================
// Mass units: direct. Volume units: density-aware via gramsPerCup.
// Pieces (whole, slice, each): per-ingredient lookup with sensible defaults.

const CUP_ML = 240;
const TBSP_ML = 15;
const TSP_ML = 5;
const FL_OZ_ML = 29.5735;

const PIECE_DEFAULTS: Record<string, number> = {
  'egg-whole': 50,
  'egg-white': 33,
  banana: 118,
  apple: 182,
  orange: 131,
  lemon: 84,
  lime: 67,
  kiwi: 69,
  peach: 150,
  pear: 178,
  plum: 66,
  tomato: 123,
  onion: 110,
  garlic: 3,        // single clove
  potato: 173,
  'sweet-potato': 130,
  'bell-pepper': 119,
  carrot: 61,
  cucumber: 301,
  zucchini: 196,
  'tortilla-flour': 49,
  'tortilla-corn': 24,
  bagel: 95,
  croissant: 67,
  'donut-glazed': 60,
  bacon: 8,         // 1 slice
  'bread-white': 25,
  'bread-wholewheat': 32,
  'bread-sourdough': 35,
};

export type UnitKey =
  | 'g' | 'kg' | 'oz' | 'lb'
  | 'ml' | 'l' | 'fl-oz'
  | 'cup' | 'tbsp' | 'tsp'
  | 'whole' | 'slice' | 'each';

export const UNIT_OPTIONS: { value: UnitKey; label: string }[] = [
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'oz', label: 'oz' },
  { value: 'lb', label: 'lb' },
  { value: 'ml', label: 'ml' },
  { value: 'l', label: 'l' },
  { value: 'fl-oz', label: 'fl oz' },
  { value: 'cup', label: 'cup' },
  { value: 'tbsp', label: 'tbsp' },
  { value: 'tsp', label: 'tsp' },
  { value: 'whole', label: 'whole' },
  { value: 'slice', label: 'slice' },
  { value: 'each', label: 'each' },
];

export function toGrams(qty: number, unit: UnitKey, food: FoodNutrition | null): number {
  if (!isFinite(qty) || qty <= 0) return 0;
  switch (unit) {
    case 'g': return qty;
    case 'kg': return qty * 1000;
    case 'oz': return qty * 28.3495;
    case 'lb': return qty * 453.592;
  }
  if (unit === 'whole' || unit === 'slice' || unit === 'each') {
    // Use per-piece default. If no food matched, fall back to 100 g.
    const w = food ? (PIECE_DEFAULTS[food.slug] ?? 100) : 100;
    return qty * w;
  }
  // Volume → grams via density. Fallback density: 240 g/cup (water-like).
  const gPerCup = food?.gramsPerCup ?? 240;
  const gPerMl = gPerCup / CUP_ML;
  switch (unit) {
    case 'ml': return qty * gPerMl;
    case 'l': return qty * 1000 * gPerMl;
    case 'fl-oz': return qty * FL_OZ_ML * gPerMl;
    case 'cup': return qty * gPerCup;
    case 'tbsp': return qty * TBSP_ML * gPerMl;
    case 'tsp': return qty * TSP_ML * gPerMl;
  }
  return 0;
}

export function searchFoods(query: string, limit = 12): FoodNutrition[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  type Scored = { item: FoodNutrition; score: number };
  const scored: Scored[] = [];
  for (const item of CALORIE_TABLE) {
    const hay = `${item.name} ${(item.aliases ?? []).join(' ')} ${item.category}`.toLowerCase();
    let score = 0;
    let allHit = true;
    for (const t of tokens) {
      const idx = hay.indexOf(t);
      if (idx < 0) {
        allHit = false;
        break;
      }
      const nameIdx = item.name.toLowerCase().indexOf(t);
      score += nameIdx === 0 ? 100 : nameIdx > 0 ? 50 : 10;
      score += Math.max(0, 30 - idx);
    }
    if (!allHit) continue;
    scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

export type LineNutrition = {
  grams: number;
  kcal: number;
  protein: number;
  carb: number;
  fat: number;
  fiber: number;
};

export function computeLine(food: FoodNutrition | null, qty: number, unit: UnitKey, manualKcalPer100g?: number, manualProteinPer100g?: number, manualCarbPer100g?: number, manualFatPer100g?: number): LineNutrition {
  const grams = toGrams(qty, unit, food);
  const f100 = grams / 100;
  // If food matched, use its values. If manual override and no food, use manual.
  const k = food?.kcalPer100g ?? (manualKcalPer100g ?? 0);
  const p = food?.proteinG ?? (manualProteinPer100g ?? 0);
  const c = food?.carbG ?? (manualCarbPer100g ?? 0);
  const fG = food?.fatG ?? (manualFatPer100g ?? 0);
  const fiber = food?.fiberG ?? 0;
  return {
    grams,
    kcal: k * f100,
    protein: p * f100,
    carb: c * f100,
    fat: fG * f100,
    fiber: fiber * f100,
  };
}
