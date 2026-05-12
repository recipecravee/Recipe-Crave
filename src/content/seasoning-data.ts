// Seasoning-by-weight reference table.
//
// All percentages are salt-as-mass relative to food mass at the indicated stage.
// Sources cross-referenced from:
//   - Samin Nosrat, "Salt, Fat, Acid, Heat" (2017)
//   - Nathan Myhrvold, "Modernist Cuisine" (Vol. 1, pp. 230-247)
//   - Kenji López-Alt, "The Food Lab" + Serious Eats brine + dry-cure articles
//   - America's Test Kitchen, "Cook's Illustrated" salting guidelines
//   - USDA FSIS curing & brining guidance
//
// Rates are the *target* finished salinity, NOT the "first dose". Always
// salt in stages — start at ~80% of target, taste, finish. The UI surfaces
// an 80% suggested first dose alongside the calculated total.

export type SeasoningProfile = {
  slug: string;
  name: string;
  category: 'protein' | 'produce' | 'liquid' | 'starch' | 'cure';
  saltPercent: number;        // canonical salt:food mass ratio (default intensity)
  minPercent: number;         // light end (intensity slider 0%)
  maxPercent: number;         // bold end (intensity slider 100%)
  stage: 'raw' | 'finished' | 'cooking-water' | 'dough';
  notes: string;
  // Complementary aromatics — multipliers relative to salt mass.
  // E.g. pepper 0.25 = use one quarter the mass of pepper as salt.
  aromatics: {
    pepper?: number;
    garlicPowder?: number;
    onionPowder?: number;
    paprika?: number;
    driedHerbs?: number;
    sugar?: number;
  };
  timing?: string;            // when to apply
  saltType?: string;          // recommended salt type
};

export const SEASONING_PROFILES: SeasoningProfile[] = [
  // ===== PROTEIN — raw, season-before-cooking =====
  {
    slug: 'red-meat-steak',
    name: 'Red meat — steaks & chops (raw)',
    category: 'protein',
    saltPercent: 0.85,
    minPercent: 0.6,
    maxPercent: 1.2,
    stage: 'raw',
    notes: 'Apply 40 minutes to 24 hours before cooking. Salt draws moisture out, then it re-absorbs as a brine — surface dries for a better sear. Under 40 min, salt sits wet on the surface and steams.',
    aromatics: { pepper: 0.4, garlicPowder: 0.15 },
    timing: '40 min – 24 h ahead, uncovered in fridge for dry brine',
    saltType: 'Kosher or flaky sea salt',
  },
  {
    slug: 'red-meat-roast',
    name: 'Red meat — large roasts (raw)',
    category: 'protein',
    saltPercent: 1.0,
    minPercent: 0.8,
    maxPercent: 1.5,
    stage: 'raw',
    notes: 'Larger cuts need more salt because most of the mass is interior. 24-48 hours uncovered in the fridge produces the best crust and interior seasoning.',
    aromatics: { pepper: 0.4, garlicPowder: 0.2 },
    timing: '24–48 h ahead, uncovered',
    saltType: 'Kosher salt',
  },
  {
    slug: 'ground-meat',
    name: 'Ground meat (burgers, meatballs, sausage)',
    category: 'protein',
    saltPercent: 1.5,
    minPercent: 1.0,
    maxPercent: 2.0,
    stage: 'raw',
    notes: 'Higher rate because salt is mixed throughout, not just on the surface. Salt above 1.5% changes protein structure — mince binds together (good for sausage, bad for tender burgers). Stay under 1.0% if you want a loose, crumbly burger.',
    aromatics: { pepper: 0.4, garlicPowder: 0.2, onionPowder: 0.15 },
    timing: 'Just before forming or up to 1 h ahead',
    saltType: 'Fine sea or table salt mixes evenly',
  },
  {
    slug: 'poultry-whole',
    name: 'Whole poultry (chicken, turkey)',
    category: 'protein',
    saltPercent: 1.0,
    minPercent: 0.75,
    maxPercent: 1.5,
    stage: 'raw',
    notes: 'Dry-brine 24 hours uncovered in fridge for crisp skin and seasoned-through meat. Skip wet brine — same effect, more work, soggier skin.',
    aromatics: { pepper: 0.35, garlicPowder: 0.2, paprika: 0.2 },
    timing: '12–24 h ahead, uncovered',
    saltType: 'Kosher salt',
  },
  {
    slug: 'poultry-pieces',
    name: 'Chicken / turkey pieces',
    category: 'protein',
    saltPercent: 1.0,
    minPercent: 0.7,
    maxPercent: 1.3,
    stage: 'raw',
    notes: 'Same target as whole bird. Salt at least 1 hour ahead — 12 hours is better. Pat dry before cooking.',
    aromatics: { pepper: 0.3, garlicPowder: 0.2 },
    timing: '1–24 h ahead',
    saltType: 'Kosher salt',
  },
  {
    slug: 'fish-delicate',
    name: 'Fish — delicate (cod, sole, tilapia, flounder)',
    category: 'protein',
    saltPercent: 0.6,
    minPercent: 0.4,
    maxPercent: 0.85,
    stage: 'raw',
    notes: 'Apply 10–15 minutes ahead — no longer, or the texture turns mushy. Thin white fish absorbs salt fast.',
    aromatics: { pepper: 0.3 },
    timing: '10–15 min ahead, no longer',
    saltType: 'Fine sea salt',
  },
  {
    slug: 'fish-firm',
    name: 'Fish — firm (salmon, tuna, swordfish, halibut)',
    category: 'protein',
    saltPercent: 0.85,
    minPercent: 0.6,
    maxPercent: 1.2,
    stage: 'raw',
    notes: 'Firm-fleshed fish tolerates and benefits from a 30–45 minute pre-salt. Salmon especially: the salt firms the texture and makes searing easier.',
    aromatics: { pepper: 0.35 },
    timing: '20–45 min ahead',
    saltType: 'Kosher or flaky',
  },
  {
    slug: 'shellfish',
    name: 'Shellfish (shrimp, scallops)',
    category: 'protein',
    saltPercent: 0.5,
    minPercent: 0.3,
    maxPercent: 0.75,
    stage: 'raw',
    notes: 'Shellfish is naturally salty from brine. Under-salt rather than over. For seared scallops, salt just before the pan — too early draws water and prevents browning.',
    aromatics: { pepper: 0.3 },
    timing: 'Just before cooking',
    saltType: 'Fine sea salt',
  },
  {
    slug: 'tofu',
    name: 'Tofu / tempeh / plant protein',
    category: 'protein',
    saltPercent: 1.0,
    minPercent: 0.7,
    maxPercent: 1.5,
    stage: 'raw',
    notes: 'Press tofu first to remove water. Salt the dry surface 15 min ahead so it can absorb. Plant proteins are bland — season aggressively.',
    aromatics: { pepper: 0.3, garlicPowder: 0.3, onionPowder: 0.2 },
    timing: '15–30 min after pressing',
    saltType: 'Any',
  },

  // ===== PRODUCE & VEG =====
  {
    slug: 'veg-roast',
    name: 'Vegetables — roasted (raw weight)',
    category: 'produce',
    saltPercent: 1.0,
    minPercent: 0.75,
    maxPercent: 1.5,
    stage: 'raw',
    notes: 'Toss veg with oil first, then salt + spice. Salting after oil ensures even adhesion. Hardy veg (potato, carrot, brussels) can take the upper end; delicate (zucchini, tomato) the lower.',
    aromatics: { pepper: 0.35, garlicPowder: 0.25, driedHerbs: 0.5 },
    timing: 'Just before roasting',
    saltType: 'Kosher salt',
  },
  {
    slug: 'veg-sauteed',
    name: 'Vegetables — sautéed / stir-fried',
    category: 'produce',
    saltPercent: 0.85,
    minPercent: 0.6,
    maxPercent: 1.2,
    stage: 'raw',
    notes: 'Add salt early to draw out moisture and concentrate flavor. Finish with a second pinch to wake everything up.',
    aromatics: { pepper: 0.3, garlicPowder: 0.3 },
    timing: 'Early in the cook',
    saltType: 'Kosher salt',
  },
  {
    slug: 'salad',
    name: 'Raw salad (greens + dressing)',
    category: 'produce',
    saltPercent: 0.6,
    minPercent: 0.4,
    maxPercent: 0.9,
    stage: 'finished',
    notes: 'Salt the dressing, not the leaves. Leaves wilt and weep if salted directly more than 5 min ahead of plating.',
    aromatics: { pepper: 0.3 },
    timing: 'In the dressing, not on the leaves',
    saltType: 'Fine sea salt',
  },

  // ===== LIQUID DISHES =====
  {
    slug: 'soup-stew',
    name: 'Soup / stew / curry (finished dish)',
    category: 'liquid',
    saltPercent: 0.85,
    minPercent: 0.6,
    maxPercent: 1.0,
    stage: 'finished',
    notes: 'Salt the finished dish, not each layer. Layering salt makes finished totals impossible to control. Use a low-sodium stock so you can finish at exactly the right point.',
    aromatics: { pepper: 0.25, driedHerbs: 0.4 },
    timing: 'At the end, then adjust',
    saltType: 'Fine sea salt dissolves fast',
  },
  {
    slug: 'sauce',
    name: 'Sauce (pan, tomato, cream, pasta)',
    category: 'liquid',
    saltPercent: 0.9,
    minPercent: 0.7,
    maxPercent: 1.1,
    stage: 'finished',
    notes: 'Most pasta sauces taste under-salted because they will mix with pasta water (already salted) and pasta itself. Aim slightly bold on the sauce alone.',
    aromatics: { pepper: 0.3, garlicPowder: 0.2, driedHerbs: 0.4 },
    timing: 'Adjust at end',
    saltType: 'Fine sea salt',
  },
  {
    slug: 'pasta-water',
    name: 'Pasta cooking water',
    category: 'liquid',
    saltPercent: 1.0,
    minPercent: 0.75,
    maxPercent: 1.5,
    stage: 'cooking-water',
    notes: '"Salty as the sea" is roughly 1.0–1.5% of water mass. Pasta only absorbs 1–2% of that — most goes down the drain. Underestimating here is the #1 reason home pasta tastes flat.',
    aromatics: {},
    timing: 'When water is at a rolling boil',
    saltType: 'Coarse sea or kosher salt',
  },
  {
    slug: 'veg-blanch-water',
    name: 'Vegetable blanching water',
    category: 'liquid',
    saltPercent: 1.0,
    minPercent: 0.75,
    maxPercent: 1.5,
    stage: 'cooking-water',
    notes: 'Heavily salted blanching water seasons through and helps green veg keep its color (sodium ion exchange with chlorophyll).',
    aromatics: {},
    timing: 'Before veg goes in',
    saltType: 'Coarse sea or kosher salt',
  },

  // ===== STARCH =====
  {
    slug: 'bread-dough',
    name: 'Bread dough (baker\'s percent)',
    category: 'starch',
    saltPercent: 1.8,
    minPercent: 1.5,
    maxPercent: 2.2,
    stage: 'dough',
    notes: 'Salt percent in bread is calculated against flour weight only, not total dough weight. Under 1.5% the loaf tastes flat; over 2.2% the yeast struggles. 2% is the global standard.',
    aromatics: {},
    timing: 'With flour at the start',
    saltType: 'Fine sea salt dissolves before kneading',
  },
  {
    slug: 'rice-grain',
    name: 'Rice & grains (cooking water)',
    category: 'starch',
    saltPercent: 1.0,
    minPercent: 0.75,
    maxPercent: 1.25,
    stage: 'cooking-water',
    notes: 'Salt the water, not the cooked grain. Salt added after cooking sits on the surface and tastes harsh.',
    aromatics: {},
    timing: 'Before grain goes in',
    saltType: 'Fine sea salt',
  },

  // ===== CURE / BRINE =====
  {
    slug: 'wet-brine-poultry',
    name: 'Wet brine — poultry (in brine liquid mass)',
    category: 'cure',
    saltPercent: 6,
    minPercent: 5,
    maxPercent: 8,
    stage: 'finished',
    notes: 'Wet brine percentage is calculated against TOTAL brine liquid mass, not meat. Standard 6% (60 g salt per 1 kg water). 8 hours for parts, 12-24 h for whole bird. Dry-brining (above) is usually better.',
    aromatics: { sugar: 0.5 },
    timing: '8–24 h',
    saltType: 'Kosher salt',
  },
  {
    slug: 'dry-cure-bacon',
    name: 'Dry cure — bacon / pancetta (% of meat)',
    category: 'cure',
    saltPercent: 2.5,
    minPercent: 2.0,
    maxPercent: 3.0,
    stage: 'raw',
    notes: 'Pink curing salt (#1 / Prague Powder) at 0.25% is required for safety on cured meats that will not be hot-smoked. This calculator gives salt only — add curing salt separately at fixed 0.25%.',
    aromatics: { sugar: 0.4, pepper: 0.3 },
    timing: '7–10 days, flipping daily',
    saltType: 'Kosher + 0.25% pink #1 (separate addition)',
  },
];

export const SEASONING_CATEGORIES = [
  { value: 'protein', label: 'Protein (raw)' },
  { value: 'produce', label: 'Vegetables' },
  { value: 'liquid', label: 'Soups, sauces & cooking water' },
  { value: 'starch', label: 'Bread & grains' },
  { value: 'cure', label: 'Brines & cures' },
] as const;

// Salt-type density reference (US standard) for tsp <-> gram conversion.
// Coarse salts have huge volume differences. Always prefer gram over tsp.
export const SALT_DENSITY = {
  // grams per teaspoon
  'fine-sea': 5.7,        // also: table salt, fine iodized
  'kosher-diamond': 2.8,  // Diamond Crystal — lightest, fluffiest
  'kosher-morton': 4.8,   // Morton kosher — denser flakes
  'flake': 2.4,           // Maldon, Jacobsen
  'rock': 5.5,            // Himalayan, sea salt grinder
} as const;

export type SaltType = keyof typeof SALT_DENSITY;

export const SALT_TYPE_LABELS: Record<SaltType, string> = {
  'fine-sea': 'Fine sea / table salt',
  'kosher-diamond': 'Diamond Crystal kosher',
  'kosher-morton': 'Morton kosher',
  flake: 'Flake (Maldon, Jacobsen)',
  rock: 'Rock / grinder',
};

export type SeasoningResult = {
  saltGrams: number;
  saltTsp: number;
  saltFirstDose: number;     // 80% of target
  pepperGrams?: number;
  garlicPowderGrams?: number;
  onionPowderGrams?: number;
  paprikaGrams?: number;
  driedHerbsGrams?: number;
  sugarGrams?: number;
};

export function computeSeasoning(
  profile: SeasoningProfile,
  foodMassG: number,
  intensity: number,           // 0..100 slider position
  saltType: SaltType,
): SeasoningResult {
  // Map intensity to actual salt %, lerping between min/max around saltPercent.
  // Intensity 50 = saltPercent. 0 = minPercent. 100 = maxPercent.
  const t = Math.max(0, Math.min(100, intensity)) / 100;
  let pct: number;
  if (t < 0.5) {
    pct = profile.minPercent + (profile.saltPercent - profile.minPercent) * (t / 0.5);
  } else {
    pct = profile.saltPercent + (profile.maxPercent - profile.saltPercent) * ((t - 0.5) / 0.5);
  }

  const saltGrams = (foodMassG * pct) / 100;
  const saltTsp = saltGrams / SALT_DENSITY[saltType];

  const a = profile.aromatics;
  return {
    saltGrams,
    saltTsp,
    saltFirstDose: saltGrams * 0.8,
    pepperGrams: a.pepper ? saltGrams * a.pepper : undefined,
    garlicPowderGrams: a.garlicPowder ? saltGrams * a.garlicPowder : undefined,
    onionPowderGrams: a.onionPowder ? saltGrams * a.onionPowder : undefined,
    paprikaGrams: a.paprika ? saltGrams * a.paprika : undefined,
    driedHerbsGrams: a.driedHerbs ? saltGrams * a.driedHerbs : undefined,
    sugarGrams: a.sugar ? saltGrams * a.sugar : undefined,
  };
}

// Convert oz → g (1 oz = 28.3495 g)
export function ozToG(oz: number): number {
  return oz * 28.3495;
}
