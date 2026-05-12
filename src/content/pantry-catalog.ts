// Common pantry / fridge / freezer items grouped by category.
// Each item carries a list of `aliases` used by the matcher to detect
// the same ingredient written different ways in recipe text
// (e.g. recipe says "minced garlic"; pantry item slug is "garlic").

export type PantryItem = {
  slug: string;
  name: string;
  category: string;
  aliases?: string[];
  defaultOn?: boolean;   // items every kitchen is assumed to have
};

export const PANTRY_CATEGORIES = [
  'Protein',
  'Dairy & Eggs',
  'Grains & Pasta',
  'Legumes & Beans',
  'Vegetables',
  'Fruits',
  'Herbs & Spices',
  'Oils & Vinegars',
  'Sauces & Condiments',
  'Baking',
  'Sweeteners',
  'Nuts & Seeds',
  'Other',
] as const;

export const PANTRY_ITEMS: PantryItem[] = [
  // ===== PROTEIN =====
  { slug: 'chicken-breast', name: 'Chicken breast', category: 'Protein', aliases: ['chicken'] },
  { slug: 'chicken-thigh', name: 'Chicken thigh', category: 'Protein', aliases: ['chicken'] },
  { slug: 'ground-beef', name: 'Ground beef / mince', category: 'Protein', aliases: ['ground beef', 'minced beef', 'mince beef', 'beef mince'] },
  { slug: 'steak', name: 'Beef steak', category: 'Protein', aliases: ['steak', 'sirloin', 'ribeye'] },
  { slug: 'pork', name: 'Pork', category: 'Protein', aliases: ['pork chop', 'pork loin', 'pork tenderloin'] },
  { slug: 'bacon', name: 'Bacon', category: 'Protein' },
  { slug: 'sausage', name: 'Sausage', category: 'Protein', aliases: ['italian sausage'] },
  { slug: 'turkey', name: 'Turkey', category: 'Protein', aliases: ['ground turkey', 'turkey breast'] },
  { slug: 'salmon', name: 'Salmon', category: 'Protein' },
  { slug: 'tuna', name: 'Tuna (canned)', category: 'Protein', aliases: ['canned tuna', 'tinned tuna'] },
  { slug: 'shrimp', name: 'Shrimp / prawns', category: 'Protein', aliases: ['shrimp', 'prawns', 'prawn'] },
  { slug: 'white-fish', name: 'White fish (cod, tilapia)', category: 'Protein', aliases: ['cod', 'tilapia', 'haddock', 'pollock', 'sole', 'white fish'] },
  { slug: 'tofu', name: 'Tofu', category: 'Protein' },
  { slug: 'tempeh', name: 'Tempeh', category: 'Protein' },

  // ===== DAIRY & EGGS =====
  { slug: 'eggs', name: 'Eggs', category: 'Dairy & Eggs', aliases: ['egg'] },
  { slug: 'milk', name: 'Milk', category: 'Dairy & Eggs', aliases: ['whole milk', 'skim milk', '2% milk', 'milk'] },
  { slug: 'butter', name: 'Butter', category: 'Dairy & Eggs', aliases: ['unsalted butter', 'salted butter', 'melted butter'] },
  { slug: 'cream', name: 'Heavy cream', category: 'Dairy & Eggs', aliases: ['double cream', 'whipping cream', 'heavy cream'] },
  { slug: 'sour-cream', name: 'Sour cream', category: 'Dairy & Eggs' },
  { slug: 'yogurt', name: 'Yogurt / Greek yogurt', category: 'Dairy & Eggs', aliases: ['greek yogurt', 'plain yogurt', 'yoghurt'] },
  { slug: 'cream-cheese', name: 'Cream cheese', category: 'Dairy & Eggs' },
  { slug: 'cheddar', name: 'Cheddar', category: 'Dairy & Eggs', aliases: ['cheddar cheese'] },
  { slug: 'mozzarella', name: 'Mozzarella', category: 'Dairy & Eggs' },
  { slug: 'parmesan', name: 'Parmesan', category: 'Dairy & Eggs', aliases: ['parmesan cheese', 'parmigiano'] },
  { slug: 'feta', name: 'Feta', category: 'Dairy & Eggs' },

  // ===== GRAINS & PASTA =====
  { slug: 'rice-white', name: 'White rice', category: 'Grains & Pasta', aliases: ['rice', 'long-grain rice', 'jasmine rice', 'basmati rice'] },
  { slug: 'rice-brown', name: 'Brown rice', category: 'Grains & Pasta' },
  { slug: 'pasta', name: 'Pasta (any)', category: 'Grains & Pasta', aliases: ['spaghetti', 'penne', 'linguine', 'rigatoni', 'fettuccine', 'macaroni', 'tagliatelle', 'pasta'] },
  { slug: 'oats', name: 'Oats', category: 'Grains & Pasta', aliases: ['rolled oats', 'oatmeal'] },
  { slug: 'flour-ap', name: 'All-purpose flour', category: 'Grains & Pasta', aliases: ['plain flour', 'flour'] },
  { slug: 'bread', name: 'Bread', category: 'Grains & Pasta', aliases: ['white bread', 'sourdough', 'baguette'] },
  { slug: 'tortilla', name: 'Tortilla', category: 'Grains & Pasta', aliases: ['flour tortilla', 'corn tortilla'] },
  { slug: 'quinoa', name: 'Quinoa', category: 'Grains & Pasta' },
  { slug: 'couscous', name: 'Couscous', category: 'Grains & Pasta' },
  { slug: 'breadcrumbs', name: 'Breadcrumbs', category: 'Grains & Pasta', aliases: ['panko', 'bread crumbs'] },

  // ===== LEGUMES & BEANS =====
  { slug: 'chickpeas', name: 'Chickpeas (canned)', category: 'Legumes & Beans', aliases: ['garbanzo'] },
  { slug: 'black-beans', name: 'Black beans (canned)', category: 'Legumes & Beans' },
  { slug: 'kidney-beans', name: 'Kidney beans (canned)', category: 'Legumes & Beans' },
  { slug: 'lentils', name: 'Lentils', category: 'Legumes & Beans', aliases: ['red lentils', 'green lentils'] },
  { slug: 'cannellini', name: 'Cannellini / white beans', category: 'Legumes & Beans', aliases: ['white beans'] },

  // ===== VEGETABLES =====
  { slug: 'onion', name: 'Onion', category: 'Vegetables', aliases: ['yellow onion', 'white onion', 'red onion'] },
  { slug: 'garlic', name: 'Garlic', category: 'Vegetables', aliases: ['minced garlic', 'garlic clove'] },
  { slug: 'tomato', name: 'Tomato (fresh)', category: 'Vegetables', aliases: ['tomatoes', 'cherry tomato', 'roma tomato', 'plum tomato'] },
  { slug: 'tomato-canned', name: 'Tomato (canned / crushed / paste)', category: 'Vegetables', aliases: ['canned tomato', 'crushed tomato', 'tomato paste', 'tomato sauce', 'passata', 'tomato puree'] },
  { slug: 'carrot', name: 'Carrot', category: 'Vegetables', aliases: ['carrots'] },
  { slug: 'celery', name: 'Celery', category: 'Vegetables' },
  { slug: 'potato', name: 'Potato', category: 'Vegetables', aliases: ['potatoes', 'russet potato', 'yukon potato', 'baby potato'] },
  { slug: 'sweet-potato', name: 'Sweet potato', category: 'Vegetables' },
  { slug: 'bell-pepper', name: 'Bell pepper', category: 'Vegetables', aliases: ['capsicum', 'red pepper', 'green pepper', 'yellow pepper'] },
  { slug: 'chili-pepper', name: 'Chili pepper', category: 'Vegetables', aliases: ['jalapeño', 'jalapeno', 'serrano', 'habanero', 'chili', 'chile', 'red chili'] },
  { slug: 'broccoli', name: 'Broccoli', category: 'Vegetables' },
  { slug: 'cauliflower', name: 'Cauliflower', category: 'Vegetables' },
  { slug: 'spinach', name: 'Spinach', category: 'Vegetables', aliases: ['baby spinach'] },
  { slug: 'kale', name: 'Kale', category: 'Vegetables' },
  { slug: 'lettuce', name: 'Lettuce', category: 'Vegetables', aliases: ['romaine', 'iceberg', 'mixed greens', 'salad greens'] },
  { slug: 'cucumber', name: 'Cucumber', category: 'Vegetables' },
  { slug: 'zucchini', name: 'Zucchini', category: 'Vegetables', aliases: ['courgette'] },
  { slug: 'mushroom', name: 'Mushrooms', category: 'Vegetables', aliases: ['cremini', 'shiitake', 'button mushroom', 'portobello'] },
  { slug: 'cabbage', name: 'Cabbage', category: 'Vegetables', aliases: ['white cabbage', 'red cabbage', 'savoy cabbage'] },
  { slug: 'corn', name: 'Corn / sweetcorn', category: 'Vegetables', aliases: ['sweet corn', 'corn kernels'] },
  { slug: 'peas', name: 'Peas (frozen)', category: 'Vegetables', aliases: ['green peas', 'frozen peas'] },
  { slug: 'green-bean', name: 'Green beans', category: 'Vegetables' },
  { slug: 'avocado', name: 'Avocado', category: 'Vegetables' },
  { slug: 'ginger', name: 'Ginger', category: 'Vegetables', aliases: ['fresh ginger', 'minced ginger'] },
  { slug: 'leek', name: 'Leek', category: 'Vegetables' },
  { slug: 'asparagus', name: 'Asparagus', category: 'Vegetables' },
  { slug: 'eggplant', name: 'Eggplant / aubergine', category: 'Vegetables', aliases: ['aubergine'] },

  // ===== FRUITS =====
  { slug: 'lemon', name: 'Lemon', category: 'Fruits', aliases: ['lemon juice', 'lemon zest'] },
  { slug: 'lime', name: 'Lime', category: 'Fruits', aliases: ['lime juice', 'lime zest'] },
  { slug: 'apple', name: 'Apple', category: 'Fruits' },
  { slug: 'banana', name: 'Banana', category: 'Fruits' },
  { slug: 'orange', name: 'Orange', category: 'Fruits', aliases: ['orange juice', 'orange zest'] },
  { slug: 'berries', name: 'Berries (any)', category: 'Fruits', aliases: ['strawberry', 'blueberry', 'raspberry', 'blackberry', 'mixed berries'] },
  { slug: 'pineapple', name: 'Pineapple', category: 'Fruits' },
  { slug: 'mango', name: 'Mango', category: 'Fruits' },

  // ===== HERBS & SPICES =====
  { slug: 'basil', name: 'Basil (fresh or dried)', category: 'Herbs & Spices', aliases: ['fresh basil', 'dried basil'] },
  { slug: 'parsley', name: 'Parsley', category: 'Herbs & Spices', aliases: ['fresh parsley', 'flat-leaf parsley', 'italian parsley'] },
  { slug: 'cilantro', name: 'Cilantro / coriander', category: 'Herbs & Spices', aliases: ['coriander leaf', 'fresh cilantro', 'coriander'] },
  { slug: 'rosemary', name: 'Rosemary', category: 'Herbs & Spices' },
  { slug: 'thyme', name: 'Thyme', category: 'Herbs & Spices' },
  { slug: 'oregano', name: 'Oregano', category: 'Herbs & Spices', aliases: ['dried oregano'] },
  { slug: 'bay-leaf', name: 'Bay leaf', category: 'Herbs & Spices', aliases: ['bay leaves'] },
  { slug: 'cumin', name: 'Cumin', category: 'Herbs & Spices', aliases: ['ground cumin'] },
  { slug: 'paprika', name: 'Paprika', category: 'Herbs & Spices', aliases: ['smoked paprika', 'sweet paprika'] },
  { slug: 'cinnamon', name: 'Cinnamon', category: 'Herbs & Spices', aliases: ['ground cinnamon'] },
  { slug: 'nutmeg', name: 'Nutmeg', category: 'Herbs & Spices' },
  { slug: 'turmeric', name: 'Turmeric', category: 'Herbs & Spices', aliases: ['ground turmeric'] },
  { slug: 'curry-powder', name: 'Curry powder', category: 'Herbs & Spices' },
  { slug: 'chili-powder', name: 'Chili powder', category: 'Herbs & Spices', aliases: ['chilli powder', 'chile powder'] },
  { slug: 'cayenne', name: 'Cayenne', category: 'Herbs & Spices', aliases: ['cayenne pepper'] },
  { slug: 'red-pepper-flakes', name: 'Red pepper flakes', category: 'Herbs & Spices', aliases: ['chilli flakes', 'crushed red pepper'] },
  { slug: 'ginger-ground', name: 'Ground ginger', category: 'Herbs & Spices' },
  { slug: 'allspice', name: 'Allspice', category: 'Herbs & Spices' },
  { slug: 'garlic-powder', name: 'Garlic powder', category: 'Herbs & Spices' },
  { slug: 'onion-powder', name: 'Onion powder', category: 'Herbs & Spices' },
  { slug: 'salt', name: 'Salt', category: 'Herbs & Spices', defaultOn: true, aliases: ['kosher salt', 'sea salt', 'table salt'] },
  { slug: 'black-pepper', name: 'Black pepper', category: 'Herbs & Spices', defaultOn: true, aliases: ['pepper', 'ground pepper'] },

  // ===== OILS & VINEGARS =====
  { slug: 'olive-oil', name: 'Olive oil', category: 'Oils & Vinegars', defaultOn: true, aliases: ['extra virgin olive oil', 'evoo'] },
  { slug: 'vegetable-oil', name: 'Vegetable / canola oil', category: 'Oils & Vinegars', defaultOn: true, aliases: ['canola oil', 'sunflower oil', 'cooking oil', 'neutral oil'] },
  { slug: 'sesame-oil', name: 'Sesame oil', category: 'Oils & Vinegars' },
  { slug: 'coconut-oil', name: 'Coconut oil', category: 'Oils & Vinegars' },
  { slug: 'white-vinegar', name: 'White vinegar', category: 'Oils & Vinegars' },
  { slug: 'apple-cider-vinegar', name: 'Apple cider vinegar', category: 'Oils & Vinegars', aliases: ['acv'] },
  { slug: 'balsamic', name: 'Balsamic vinegar', category: 'Oils & Vinegars' },
  { slug: 'red-wine-vinegar', name: 'Red wine vinegar', category: 'Oils & Vinegars' },
  { slug: 'rice-vinegar', name: 'Rice vinegar', category: 'Oils & Vinegars' },

  // ===== SAUCES & CONDIMENTS =====
  { slug: 'soy-sauce', name: 'Soy sauce', category: 'Sauces & Condiments', aliases: ['tamari', 'shoyu'] },
  { slug: 'fish-sauce', name: 'Fish sauce', category: 'Sauces & Condiments', aliases: ['nuoc mam', 'nam pla'] },
  { slug: 'worcestershire', name: 'Worcestershire sauce', category: 'Sauces & Condiments' },
  { slug: 'hot-sauce', name: 'Hot sauce', category: 'Sauces & Condiments', aliases: ['sriracha', 'tabasco', 'chili sauce'] },
  { slug: 'ketchup', name: 'Ketchup', category: 'Sauces & Condiments' },
  { slug: 'mustard', name: 'Mustard', category: 'Sauces & Condiments', aliases: ['dijon mustard', 'dijon', 'yellow mustard', 'wholegrain mustard'] },
  { slug: 'mayo', name: 'Mayonnaise', category: 'Sauces & Condiments', aliases: ['mayo'] },
  { slug: 'honey-mustard', name: 'Honey', category: 'Sauces & Condiments' },
  { slug: 'pesto', name: 'Pesto', category: 'Sauces & Condiments' },
  { slug: 'hummus', name: 'Hummus', category: 'Sauces & Condiments' },
  { slug: 'salsa', name: 'Salsa', category: 'Sauces & Condiments' },
  { slug: 'coconut-milk', name: 'Coconut milk (canned)', category: 'Sauces & Condiments' },
  { slug: 'stock-chicken', name: 'Chicken stock / broth', category: 'Sauces & Condiments', aliases: ['chicken broth', 'chicken bouillon'] },
  { slug: 'stock-veg', name: 'Vegetable stock / broth', category: 'Sauces & Condiments', aliases: ['vegetable broth', 'veg stock'] },
  { slug: 'stock-beef', name: 'Beef stock / broth', category: 'Sauces & Condiments', aliases: ['beef broth'] },

  // ===== BAKING =====
  { slug: 'baking-powder', name: 'Baking powder', category: 'Baking' },
  { slug: 'baking-soda', name: 'Baking soda', category: 'Baking', aliases: ['bicarbonate of soda', 'bicarb'] },
  { slug: 'yeast', name: 'Yeast', category: 'Baking', aliases: ['instant yeast', 'active dry yeast'] },
  { slug: 'cocoa', name: 'Cocoa powder', category: 'Baking', aliases: ['cacao powder'] },
  { slug: 'vanilla', name: 'Vanilla extract', category: 'Baking', aliases: ['vanilla'] },
  { slug: 'cornstarch', name: 'Cornstarch / cornflour', category: 'Baking', aliases: ['cornflour'] },
  { slug: 'chocolate-chips', name: 'Chocolate chips', category: 'Baking', aliases: ['chocolate chip'] },

  // ===== SWEETENERS =====
  { slug: 'sugar-white', name: 'White sugar', category: 'Sweeteners', defaultOn: true, aliases: ['granulated sugar', 'sugar', 'caster sugar'] },
  { slug: 'sugar-brown', name: 'Brown sugar', category: 'Sweeteners', aliases: ['light brown sugar', 'dark brown sugar'] },
  { slug: 'powdered-sugar', name: 'Powdered sugar', category: 'Sweeteners', aliases: ['icing sugar', 'confectioners sugar'] },
  { slug: 'honey', name: 'Honey', category: 'Sweeteners' },
  { slug: 'maple-syrup', name: 'Maple syrup', category: 'Sweeteners' },
  { slug: 'agave', name: 'Agave', category: 'Sweeteners' },

  // ===== NUTS & SEEDS =====
  { slug: 'almonds', name: 'Almonds', category: 'Nuts & Seeds' },
  { slug: 'walnuts', name: 'Walnuts', category: 'Nuts & Seeds' },
  { slug: 'cashews', name: 'Cashews', category: 'Nuts & Seeds' },
  { slug: 'peanuts', name: 'Peanuts / peanut butter', category: 'Nuts & Seeds', aliases: ['peanut butter'] },
  { slug: 'sesame-seeds', name: 'Sesame seeds', category: 'Nuts & Seeds' },
  { slug: 'sunflower-seeds', name: 'Sunflower seeds', category: 'Nuts & Seeds' },

  // ===== OTHER =====
  { slug: 'water', name: 'Water', category: 'Other', defaultOn: true },
  { slug: 'olives', name: 'Olives', category: 'Other' },
  { slug: 'capers', name: 'Capers', category: 'Other' },
  { slug: 'pickle', name: 'Pickles', category: 'Other', aliases: ['gherkin', 'cornichon'] },
  { slug: 'anchovy', name: 'Anchovies', category: 'Other' },
];

// =================================================================
// MATCHER
// =================================================================
// Given a set of pantry-item slugs the user owns and a list of recipes,
// score each recipe by what fraction of its ingredients the user has.

export type RecipeMatch = {
  recipeSlug: string;
  matched: string[];      // ingredient names matched
  missing: string[];      // ingredient names NOT in pantry
  matchPct: number;       // 0..100
  totalIngredients: number;
};

const PANTRY_BY_SLUG: Record<string, PantryItem> = Object.fromEntries(
  PANTRY_ITEMS.map((p) => [p.slug, p]),
);

// Build a lowercase needle->slug map at module load.
// Longer needles ranked first so multi-word patterns ("tomato paste")
// match before single-word ("tomato"). Resolves both to the right slug.
type Needle = { needle: string; slug: string };
const NEEDLE_INDEX: Needle[] = (() => {
  const all: Needle[] = [];
  for (const item of PANTRY_ITEMS) {
    all.push({ needle: item.name.toLowerCase(), slug: item.slug });
    for (const a of item.aliases ?? []) all.push({ needle: a.toLowerCase(), slug: item.slug });
    // Slug as fallback needle (with hyphens converted to space)
    all.push({ needle: item.slug.replace(/-/g, ' '), slug: item.slug });
  }
  // Deduplicate (needle+slug)
  const seen = new Set<string>();
  const out = all.filter((n) => {
    const k = `${n.needle}|${n.slug}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return out.sort((a, b) => b.needle.length - a.needle.length);
})();

/**
 * Detect which pantry-slug (if any) a single ingredient-text line refers to.
 * Returns the slug, or null if no match.
 *
 * Match rules:
 *   1. Each needle in NEEDLE_INDEX is checked as a substring of the lowercased
 *      ingredient text. First (longest) hit wins.
 *   2. Match boundaries: whole-word (using regex \b) to prevent
 *      "egg" matching "eggplant".
 */
export function detectPantrySlug(ingredientText: string): string | null {
  if (!ingredientText) return null;
  const hay = ingredientText.toLowerCase();
  for (const { needle, slug } of NEEDLE_INDEX) {
    // Use word-boundary match
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'i');
    if (re.test(hay)) return slug;
  }
  return null;
}

export type RecipeLike = {
  slug: string;
  ingredients: Array<{ name: string } | string>;
};

/**
 * Score a recipe against an owned-pantry-slugs Set.
 */
export function scoreRecipe(recipe: RecipeLike, owned: Set<string>): RecipeMatch {
  const matched: string[] = [];
  const missing: string[] = [];
  for (const ing of recipe.ingredients) {
    const text = typeof ing === 'string' ? ing : ing.name;
    const slug = detectPantrySlug(text);
    if (slug && owned.has(slug)) {
      matched.push(text);
    } else if (slug && PANTRY_BY_SLUG[slug]?.defaultOn && owned.has(slug)) {
      matched.push(text);
    } else {
      missing.push(text);
    }
  }
  const total = recipe.ingredients.length;
  return {
    recipeSlug: recipe.slug,
    matched,
    missing,
    matchPct: total > 0 ? (matched.length / total) * 100 : 0,
    totalIngredients: total,
  };
}

export function defaultOwnedSet(): Set<string> {
  return new Set(PANTRY_ITEMS.filter((i) => i.defaultOn).map((i) => i.slug));
}
