import { SEED_RECIPES } from '@/content/seed-recipes';
import { RECIPECRAVE_RECIPES } from '@/content/recipecrave-recipes';
import { CUISINES, DIETS } from '@/lib/constants';

export type SearchItem = {
  kind: 'page' | 'calculator' | 'recipe' | 'cuisine' | 'diet';
  title: string;
  href: string;
  hint?: string;
  keywords?: string;
};

const PAGES: SearchItem[] = [
  { kind: 'page', title: 'All Recipes', href: '/recipes', hint: 'Browse everything' },
  { kind: 'page', title: 'Recipes A to Z', href: '/recipes/a-z', hint: 'Alphabetical index', keywords: 'a-z alphabetical index sorted list every recipe food network style' },
  { kind: 'page', title: 'Categories', href: '/categories', hint: 'By course / meal type' },
  { kind: 'page', title: 'Collections', href: '/collections', hint: 'Hand-picked sets' },
  { kind: 'page', title: 'AI Meal Planner', href: '/meal-planner', hint: 'Plan a full week' },
  { kind: 'page', title: 'Pantry Photo Scan', href: '/pantry-match', hint: 'Cook from your fridge' },
  { kind: 'page', title: 'Voice Cook Mode', href: '/cook', hint: 'Hands-free cooking' },
  { kind: 'page', title: 'Smart Grocery Lists', href: '/grocery-list', hint: 'Multiple recipes, one list' },
  { kind: 'page', title: 'Kitchen Tools & Calculators', href: '/calculators', hint: 'Free cooking tools' },
  { kind: 'page', title: 'How-To Guides', href: '/how-to', hint: 'Techniques + tutorials' },
  { kind: 'page', title: 'About RecipeCrave', href: '/about' },
  { kind: 'page', title: 'Contact', href: '/contact' },
  { kind: 'page', title: 'Editorial Policy', href: '/editorial-policy' },
  { kind: 'page', title: 'Nutrition Disclaimer', href: '/nutrition-disclaimer' },
  { kind: 'page', title: 'Privacy Policy', href: '/privacy' },
  { kind: 'page', title: 'Terms of Use', href: '/terms' },
  { kind: 'page', title: 'My Account', href: '/account' },
  { kind: 'page', title: 'Log in', href: '/login' },
];

const CALCULATORS: SearchItem[] = [
  { kind: 'calculator', title: 'Cups → Grams Converter', href: '/calculators/unit-converter', hint: 'Live · 60+ ingredients', keywords: 'cups grams measurement unit converter ml oz tbsp tsp' },
  { kind: 'calculator', title: 'Temperature Adjuster', href: '/calculators/temperature-adjuster', hint: 'Live · °C / °F / gas mark / air fryer', keywords: 'oven temperature celsius fahrenheit gas mark fan forced convection air fryer' },
  { kind: 'calculator', title: 'Real-time Recipe Scaler', href: '/calculators/realtime-recipe-scaler', hint: 'Live · Most valuable', keywords: 'scale recipe servings cost per serving slider' },
  { kind: 'calculator', title: 'Recipe Cost Calculator', href: '/calculators/recipe-cost', hint: 'Live · multi-currency', keywords: 'cost per serving budget cheap meal food cost percentage restaurant pop-up pricing pack price' },
  { kind: 'calculator', title: 'Calorie Estimator', href: '/calculators/calorie-estimator', hint: 'Coming soon', keywords: 'calories macros nutrition' },
  { kind: 'calculator', title: 'Storage Life Guide', href: '/calculators/storage-life-guide', hint: 'Live · 75+ foods', keywords: 'food safety how long fridge freezer expired pantry spoil mayo eggs' },
  { kind: 'calculator', title: 'Ingredient Substitution Matcher', href: '/calculators/ingredient-substitutions', hint: 'Live · 60+ ingredients', keywords: 'substitute replacement swap buttermilk yogurt egg flour butter dairy free gluten free vegan' },
  { kind: 'calculator', title: 'Baking Ratio Calculator', href: '/calculators/baking-ratio', hint: 'Live · 10 presets', keywords: 'baker percentage flour hydration bread dough sourdough pizza brioche focaccia bagel pie crust' },
  { kind: 'calculator', title: 'Seasoning by Weight Calculator', href: '/calculators/seasoning-by-weight', hint: 'Live · 20 dish presets', keywords: 'salt to taste protein weight seasoning brine dry brine pasta water bread dough percentage' },
  { kind: 'calculator', title: 'Pantry Inventory + Recipe Matcher', href: '/calculators/pantry-inventory-matcher', hint: 'Coming soon', keywords: 'pantry inventory what to cook' },
];

const ALL_INDEXED = [...SEED_RECIPES, ...RECIPECRAVE_RECIPES].filter(
  (r, i, arr) => arr.findIndex((x) => x.slug === r.slug) === i,
);

const RECIPES: SearchItem[] = ALL_INDEXED.map((r) => ({
  kind: 'recipe' as const,
  title: r.title,
  href: `/recipes/${r.slug}`,
  hint: `${r.cuisine ?? ''} · ${r.totalTimeMin}m`.trim(),
  keywords: (r.keywords ?? []).join(' '),
}));

const CUISINE_ITEMS: SearchItem[] = CUISINES.map((c) => ({
  kind: 'cuisine' as const,
  title: `${c.emoji} ${c.name} cuisine`,
  href: `/cuisine/${c.slug}`,
  keywords: c.name,
}));

const DIET_ITEMS: SearchItem[] = DIETS.map((d) => ({
  kind: 'diet' as const,
  title: `${d.name} recipes`,
  href: `/diet/${d.slug}`,
  keywords: d.name,
}));

export const SEARCH_INDEX: SearchItem[] = [
  ...PAGES,
  ...CALCULATORS,
  ...RECIPES,
  ...CUISINE_ITEMS,
  ...DIET_ITEMS,
];

export function searchItems(query: string, limit = 12): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  type Scored = { item: SearchItem; score: number };
  const scored: Scored[] = [];

  for (const item of SEARCH_INDEX) {
    const hay = `${item.title} ${item.keywords ?? ''} ${item.hint ?? ''}`.toLowerCase();
    let score = 0;
    let allHit = true;
    for (const t of tokens) {
      const idx = hay.indexOf(t);
      if (idx < 0) {
        allHit = false;
        break;
      }
      // Earlier match scores higher; title hit scores higher than keyword hit
      const titleIdx = item.title.toLowerCase().indexOf(t);
      score += titleIdx === 0 ? 100 : titleIdx > 0 ? 50 : 10;
      score += Math.max(0, 30 - idx);
    }
    if (!allHit) continue;
    // Boost calculators and pages slightly so they surface first for common queries
    if (item.kind === 'calculator') score += 25;
    if (item.kind === 'page') score += 15;
    scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}
