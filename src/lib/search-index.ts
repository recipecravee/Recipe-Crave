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
  { kind: 'page', title: '30-Day Condition Meal Plans', href: '/meal-plans', hint: '4 structured protocols', keywords: 'meal plan 30 day condition specific health' },
  { kind: 'page', title: '30-Day Anti-Inflammation Meal Plan', href: '/meal-plans/30-day-anti-inflammation', keywords: 'anti inflammation meal plan turmeric daily 30 day protocol' },
  { kind: 'page', title: '30-Day Diabetes Management Meal Plan', href: '/meal-plans/30-day-diabetes-management', keywords: 'diabetes meal plan type 2 fenugreek cinnamon 30 day blood sugar' },
  { kind: 'page', title: '30-Day Gut Healing Meal Plan', href: '/meal-plans/30-day-gut-healing', keywords: 'gut healing meal plan microbiome fermented foods bone broth' },
  { kind: 'page', title: '30-Day Sleep Optimization Meal Plan', href: '/meal-plans/30-day-sleep-optimization', keywords: 'sleep optimization meal plan ashwagandha chamomile cortisol' },
  { kind: 'page', title: 'Pantry Photo Scan', href: '/pantry-match', hint: 'Cook from your fridge' },
  { kind: 'page', title: 'Voice Cook Mode', href: '/cook', hint: 'Hands-free cooking' },
  { kind: 'page', title: 'Smart Grocery Lists', href: '/grocery-list', hint: 'Multiple recipes, one list' },
  { kind: 'page', title: 'Kitchen Tools & Calculators', href: '/calculators', hint: 'Free cooking tools' },
  { kind: 'page', title: 'How-To Guides', href: '/how-to', hint: 'Techniques + tutorials' },
  { kind: 'page', title: 'How to Poach an Egg', href: '/how-to/how-to-poach-an-egg', hint: 'Technique · 5 min read', keywords: 'poach egg technique perfect poached egg vinegar' },
  { kind: 'page', title: 'How to Julienne Vegetables', href: '/how-to/how-to-julienne-vegetables', hint: 'Knife skills · 4 min', keywords: 'julienne knife cut matchstick vegetables technique' },
  { kind: 'page', title: 'How to Make a Roux', href: '/how-to/how-to-make-a-roux', hint: 'Technique · 6 min', keywords: 'roux blonde brown gumbo bechamel sauce thickener flour butter' },
  { kind: 'page', title: 'How to Temper Chocolate', href: '/how-to/how-to-temper-chocolate', hint: 'Technique · 7 min', keywords: 'temper chocolate seeding method glossy snap dipping bark' },
  { kind: 'page', title: 'How to Cook Perfect Rice', href: '/how-to/how-to-cook-perfect-rice', hint: 'Technique · 6 min', keywords: 'cook perfect rice water ratio fluffy long grain basmati jasmine sushi' },
  { kind: 'page', title: 'How to Brown Butter', href: '/how-to/how-to-brown-butter', hint: 'Technique · 4 min', keywords: 'brown butter beurre noisette nutty caramelized maillard' },
  { kind: 'page', title: 'About RecipeCrave', href: '/about' },
  { kind: 'page', title: 'Contact', href: '/contact' },
  { kind: 'page', title: 'Editorial Policy', href: '/editorial-policy' },
  { kind: 'page', title: 'Nutrition Disclaimer', href: '/nutrition-disclaimer' },
  { kind: 'page', title: 'Privacy Policy', href: '/privacy' },
  { kind: 'page', title: 'Terms of Use', href: '/terms' },
  { kind: 'page', title: 'RecipeCrave Blog', href: '/blog', hint: 'Evidence-backed cooking & health', keywords: 'blog articles cooking science health turmeric cinnamon bone broth diabetes inflammation' },
  { kind: 'page', title: 'Turmeric vs Ibuprofen', href: '/blog/turmeric-vs-ibuprofen-anti-inflammatory-comparison', hint: 'Article · 9 min read', keywords: 'turmeric ibuprofen anti-inflammatory comparison natural pain relief curcumin' },
  { kind: 'page', title: '30-Day Anti-Inflammation Plan', href: '/blog/30-day-anti-inflammation-recipe-plan', hint: 'Article · 12 min read', keywords: '30 day anti-inflammation meal plan arthritis inflammation diet' },
  { kind: 'page', title: 'Managing Type 2 Diabetes Through Food', href: '/blog/managing-type-2-diabetes-through-food', hint: 'Article · 11 min read', keywords: 'type 2 diabetes diet blood sugar food management glycemic' },
  { kind: 'page', title: 'Cinnamon for Blood Sugar', href: '/blog/cinnamon-for-blood-sugar-complete-guide', hint: 'Article · 7 min read', keywords: 'cinnamon blood sugar diabetes ceylon cassia dosage' },
  { kind: 'page', title: 'Bone Broth & Gut Healing', href: '/blog/bone-broth-gut-healing-real-evidence', hint: 'Article · 8 min read', keywords: 'bone broth gut healing collagen glutamine leaky gut science evidence' },
  { kind: 'page', title: 'Therapeutic Herbs & Functional Foods', href: '/herbs', hint: 'Food as medicine', keywords: 'medicinal herbs functional food turmeric ginger cinnamon ashwagandha inflammation blood sugar gut health' },
  { kind: 'page', title: 'Herb-Drug Safety Checker', href: '/safety-check', hint: 'Free interaction checker', keywords: 'herb drug interaction checker turmeric warfarin cinnamon metformin ashwagandha thyroid contraindication' },
  { kind: 'page', title: 'Chicken Recipes', href: '/ingredient/chicken', keywords: 'chicken thigh breast wings poultry' },
  { kind: 'page', title: 'Beef Recipes', href: '/ingredient/beef', keywords: 'beef steak ground ribeye chuck' },
  { kind: 'page', title: 'Pork Recipes', href: '/ingredient/pork', keywords: 'pork chop tenderloin bacon sausage' },
  { kind: 'page', title: 'Fish Recipes', href: '/ingredient/fish', keywords: 'fish salmon cod tilapia tuna seafood' },
  { kind: 'page', title: 'Shrimp Recipes', href: '/ingredient/shrimp', keywords: 'shrimp prawn 15 minute' },
  { kind: 'page', title: 'Tofu Recipes', href: '/ingredient/tofu', keywords: 'tofu tempeh silken plant protein vegan' },
  { kind: 'page', title: 'Egg Recipes', href: '/ingredient/eggs', keywords: 'eggs omelette frittata shakshuka carbonara' },
  { kind: 'page', title: 'Bean & Legume Recipes', href: '/ingredient/beans', keywords: 'beans lentil chickpea garbanzo black bean' },
  { kind: 'page', title: 'Rice Recipes', href: '/ingredient/rice', keywords: 'rice pilaf risotto fried rice bowl' },
  { kind: 'page', title: 'Pasta Recipes', href: '/ingredient/pasta', keywords: 'pasta spaghetti penne linguine lasagna' },
  { kind: 'page', title: 'Potato Recipes', href: '/ingredient/potatoes', keywords: 'potatoes mashed fries roast' },
  { kind: 'page', title: 'Mushroom Recipes', href: '/ingredient/mushrooms', keywords: 'mushroom cremini shiitake portobello umami' },
  { kind: 'page', title: 'Spinach Recipes', href: '/ingredient/spinach', keywords: 'spinach iron leafy greens' },
  { kind: 'page', title: 'Broccoli Recipes', href: '/ingredient/broccoli', keywords: 'broccoli roast stir fry vegetable' },
  { kind: 'page', title: 'Date Night Recipes', href: '/for/date-night', keywords: 'date night dinner for two romantic' },
  { kind: 'page', title: 'Meal Prep Recipes', href: '/for/meal-prep', keywords: 'meal prep make ahead batch sunday cook' },
  { kind: 'page', title: 'Family Dinner Recipes', href: '/for/family-dinner', keywords: 'family dinner kid friendly 4 6 people' },
  { kind: 'page', title: 'Holiday Recipes', href: '/for/holiday', keywords: 'holiday thanksgiving christmas easter feast' },
  { kind: 'page', title: 'Quick Weeknight Dinners', href: '/for/quick-weeknight', keywords: 'quick 30 minute weeknight easy dinner' },
  { kind: 'page', title: 'Recipes for Impressing Guests', href: '/for/impressing-guests', keywords: 'impressive dinner party show stopper' },
  { kind: 'page', title: 'Comfort Food Recipes', href: '/for/comfort-food', keywords: 'comfort food stew chili mac cheese' },
  { kind: 'page', title: 'Healthy Light Recipes', href: '/for/healthy-light', keywords: 'healthy light low calorie vegetable forward' },
  { kind: 'page', title: 'Recipes for Inflammation', href: '/conditions/inflammation', keywords: 'anti-inflammatory recipes turmeric ginger arthritis' },
  { kind: 'page', title: 'Recipes for Blood Sugar Management', href: '/conditions/blood-sugar', keywords: 'diabetic recipes blood sugar cinnamon fenugreek glycemic' },
  { kind: 'page', title: 'Recipes for Heart Health', href: '/conditions/heart-health', keywords: 'heart health cholesterol garlic olive oil hibiscus' },
  { kind: 'page', title: 'Recipes for Sleep & Stress', href: '/conditions/sleep-stress', keywords: 'sleep recipes stress ashwagandha chamomile cortisol' },
  { kind: 'page', title: 'Recipes for Digestion', href: '/conditions/digestion', keywords: 'digestion recipes ginger fennel peppermint IBS bloating' },
  { kind: 'page', title: 'Recipes for Gut Health', href: '/conditions/gut-health', keywords: 'gut microbiome probiotic fermented miso sauerkraut' },
  { kind: 'page', title: 'Recipes for Immune Support', href: '/conditions/immune', keywords: 'immune boost garlic ginger turmeric vitamin C' },
  { kind: 'page', title: 'My Saved Recipes', href: '/saved', hint: 'Local bookmarks', keywords: 'saved bookmarked favourites' },
  { kind: 'page', title: 'Pasta Recipes (cluster)', href: '/pillars/pasta-recipes', hint: 'Topic cluster pillar', keywords: 'pasta spaghetti carbonara pesto' },
  { kind: 'page', title: 'Chicken Recipes (cluster)', href: '/pillars/chicken-recipes', hint: 'Topic cluster pillar', keywords: 'chicken thigh breast wings' },
  { kind: 'page', title: 'Budget Meals Under $5', href: '/pillars/budget-meals', hint: 'Topic cluster pillar', keywords: 'budget cheap affordable broke pantry' },
  { kind: 'page', title: 'High-Protein Recipes', href: '/pillars/high-protein-recipes', hint: 'Topic cluster pillar', keywords: 'high protein macros muscle' },
  { kind: 'page', title: 'Meal Prep Recipes', href: '/pillars/meal-prep-recipes', hint: 'Topic cluster pillar', keywords: 'meal prep make ahead batch cook' },
  { kind: 'page', title: 'One-Pot Recipes', href: '/pillars/one-pot-recipes', hint: 'Topic cluster pillar', keywords: 'one pot one pan sheet pan' },
  { kind: 'page', title: 'My Account', href: '/account' },
  { kind: 'page', title: 'Log in', href: '/login' },
];

const CALCULATORS: SearchItem[] = [
  { kind: 'calculator', title: 'Cups → Grams Converter', href: '/calculators/unit-converter', hint: 'Live · 60+ ingredients', keywords: 'cups grams measurement unit converter ml oz tbsp tsp' },
  { kind: 'calculator', title: 'Temperature Adjuster', href: '/calculators/temperature-adjuster', hint: 'Live · °C / °F / gas mark / air fryer', keywords: 'oven temperature celsius fahrenheit gas mark fan forced convection air fryer' },
  { kind: 'calculator', title: 'Real-time Recipe Scaler', href: '/calculators/realtime-recipe-scaler', hint: 'Live · Most valuable', keywords: 'scale recipe servings cost per serving slider' },
  { kind: 'calculator', title: 'Recipe Cost Calculator', href: '/calculators/recipe-cost', hint: 'Live · multi-currency', keywords: 'cost per serving budget cheap meal food cost percentage restaurant pop-up pricing pack price' },
  { kind: 'calculator', title: 'Calorie Estimator', href: '/calculators/calorie-estimator', hint: 'Live · 150+ USDA foods', keywords: 'calories macros nutrition protein carbs fat fiber recipe calorie macro split' },
  { kind: 'calculator', title: 'Storage Life Guide', href: '/calculators/storage-life-guide', hint: 'Live · 75+ foods', keywords: 'food safety how long fridge freezer expired pantry spoil mayo eggs' },
  { kind: 'calculator', title: 'Ingredient Substitution Matcher', href: '/calculators/ingredient-substitutions', hint: 'Live · 60+ ingredients', keywords: 'substitute replacement swap buttermilk yogurt egg flour butter dairy free gluten free vegan' },
  { kind: 'calculator', title: 'Baking Ratio Calculator', href: '/calculators/baking-ratio', hint: 'Live · 10 presets', keywords: 'baker percentage flour hydration bread dough sourdough pizza brioche focaccia bagel pie crust' },
  { kind: 'calculator', title: 'Seasoning by Weight Calculator', href: '/calculators/seasoning-by-weight', hint: 'Live · 20 dish presets', keywords: 'salt to taste protein weight seasoning brine dry brine pasta water bread dough percentage' },
  { kind: 'calculator', title: 'Pantry Inventory + Recipe Matcher', href: '/calculators/pantry-inventory-matcher', hint: 'Live · 200+ recipes', keywords: 'pantry inventory what to cook what can I cook tonight fridge ingredients use up food waste' },
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
