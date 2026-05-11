// Baker's percentage presets. Flour = 100%. All other ingredients are % of flour by weight.
// Reference values consolidated from King Arthur Baking, Serious Eats Food Lab, and ATK reviews.

export type BakingRatioPreset = {
  slug: string;
  name: string;
  description: string;
  category: 'bread' | 'pizza' | 'enriched' | 'pastry';
  // Baker's percentages — flour is implicit 100%
  hydration: number;        // water %
  salt: number;             // salt %
  yeast?: number;           // instant yeast %
  starter?: number;         // sourdough starter / levain %
  fat?: number;             // butter or oil %
  sugar?: number;           // sugar / honey %
  eggs?: number;            // eggs %
  milk?: number;            // milk % (replaces some water)
  notes?: string;
  hydrationRange?: { min: number; max: number };
};

export const BAKING_PRESETS: BakingRatioPreset[] = [
  {
    slug: 'lean-bread',
    name: 'Lean bread (rustic boule, baguette, ciabatta)',
    description: 'Classic four-ingredient European bread. Open crumb, crisp crust. No fat, no sugar.',
    category: 'bread',
    hydration: 70,
    salt: 2,
    yeast: 0.8,
    notes: 'Cold autolyse 30 min before adding salt for stronger gluten. Bake at 240C / 465F with steam first 15 min.',
    hydrationRange: { min: 60, max: 80 },
  },
  {
    slug: 'enriched-bread',
    name: 'Enriched bread (sandwich loaf, brioche-lite)',
    description: 'Soft, tender crumb. Butter and sugar shorten gluten and feed yeast.',
    category: 'enriched',
    hydration: 60,
    salt: 1.8,
    yeast: 1,
    fat: 6,
    sugar: 6,
    milk: 60,
    notes: 'Milk replaces water (set hydration to 0 if using all milk). Eggs optional. Knead longer than lean bread to develop crumb.',
    hydrationRange: { min: 55, max: 70 },
  },
  {
    slug: 'pizza-napoletana',
    name: 'Pizza Napoletana (00 flour, wood-fired style)',
    description: 'Soft, pliable, easy-to-stretch dough. Long cold ferment for flavour.',
    category: 'pizza',
    hydration: 62,
    salt: 2.8,
    yeast: 0.2,
    notes: 'Use 00 or high-protein bread flour. Cold ferment 24-72h in fridge for max flavour. Stretch by hand only, never roll.',
    hydrationRange: { min: 58, max: 68 },
  },
  {
    slug: 'pizza-newyork',
    name: 'Pizza New York style (high-gluten, oil)',
    description: 'Chewy, foldable slice. Higher hydration than Napoletana, plus oil for tenderness.',
    category: 'pizza',
    hydration: 65,
    salt: 2,
    yeast: 0.5,
    fat: 2,
    sugar: 1,
    notes: 'Cold ferment 48-72h. Bake on steel or stone at max oven temp (260C+). Sugar feeds yeast and adds browning.',
    hydrationRange: { min: 60, max: 70 },
  },
  {
    slug: 'sourdough',
    name: 'Sourdough boule (country loaf)',
    description: 'Wild-yeast levain replaces commercial yeast. Long bulk ferment builds tang.',
    category: 'bread',
    hydration: 75,
    salt: 2,
    starter: 20,
    notes: 'Levain at 100% hydration. Bulk ferment 4-6h at 24C with stretch & folds every 30 min. Cold retard 8-16h.',
    hydrationRange: { min: 65, max: 90 },
  },
  {
    slug: 'brioche',
    name: 'Brioche (butter-rich enriched dough)',
    description: 'Half flour, half butter by feel. Tender, golden, pull-apart crumb.',
    category: 'enriched',
    hydration: 0,
    salt: 1.5,
    yeast: 1.2,
    fat: 50,
    sugar: 12,
    eggs: 60,
    milk: 20,
    notes: 'Eggs and butter replace most water. Mix in stand mixer 12-15 min. Cold rest dough overnight before shaping.',
  },
  {
    slug: 'focaccia',
    name: 'Focaccia (Italian flatbread, olive-oil-rich)',
    description: 'High hydration. Loose, dimpled, drenched in oil. Almost a no-knead.',
    category: 'bread',
    hydration: 80,
    salt: 2,
    yeast: 0.8,
    fat: 8,
    notes: 'Slap and fold instead of kneading. Pour oil into pan before second proof. Bake at 220C / 425F.',
    hydrationRange: { min: 75, max: 90 },
  },
  {
    slug: 'bagels',
    name: 'Bagels (low hydration, malted, boiled)',
    description: 'Dense, chewy, glossy crust. Low water, high gluten, boiled before bake.',
    category: 'bread',
    hydration: 55,
    salt: 1.8,
    yeast: 1,
    sugar: 4,
    notes: 'Use high-gluten or bread flour. Boil 60s per side in malt-water bath. Bake hot (230C / 450F) on parchment.',
    hydrationRange: { min: 50, max: 60 },
  },
  {
    slug: 'pie-crust',
    name: 'Pie crust (American flaky, all-butter)',
    description: '3:2:1 by weight — flour:fat:water. Keep cold for flakiest layers.',
    category: 'pastry',
    hydration: 33,
    salt: 1,
    fat: 66,
    sugar: 2,
    notes: 'Butter must stay solid through mixing. Rest 30 min in fridge before rolling. Bake blind at 200C / 400F.',
  },
  {
    slug: 'pancake-batter',
    name: 'Pancake batter (American buttermilk)',
    description: 'Light, fluffy, baking-powder leavened. Rest batter for tender stack.',
    category: 'pastry',
    hydration: 0,
    salt: 0.8,
    fat: 8,
    sugar: 8,
    eggs: 25,
    milk: 100,
    notes: 'Buttermilk + 2% baking powder + 0.5% baking soda. Do not overmix. Rest 10 min before cooking.',
  },
];

export type ScaledRecipe = {
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  starter: number;
  fat: number;
  sugar: number;
  eggs: number;
  milk: number;
  total: number;
};

/**
 * Scale a baker's percentage preset by the target flour weight (g).
 * `hydrationOverride` lets the user adjust hydration % via slider.
 */
export function scalePreset(preset: BakingRatioPreset, flourGrams: number, hydrationOverride?: number): ScaledRecipe {
  const flour = Math.max(0, flourGrams);
  const hydration = hydrationOverride ?? preset.hydration;
  const water = (flour * hydration) / 100;
  const salt = (flour * preset.salt) / 100;
  const yeast = preset.yeast ? (flour * preset.yeast) / 100 : 0;
  const starter = preset.starter ? (flour * preset.starter) / 100 : 0;
  const fat = preset.fat ? (flour * preset.fat) / 100 : 0;
  const sugar = preset.sugar ? (flour * preset.sugar) / 100 : 0;
  const eggs = preset.eggs ? (flour * preset.eggs) / 100 : 0;
  const milk = preset.milk ? (flour * preset.milk) / 100 : 0;
  const total = flour + water + salt + yeast + starter + fat + sugar + eggs + milk;
  return { flour, water, salt, yeast, starter, fat, sugar, eggs, milk, total };
}

/**
 * Round each ingredient sensibly: flour to nearest 5g, micro-ingredients (salt, yeast) to 0.1g, rest to 1g.
 */
export function roundIngredient(grams: number, type: 'flour' | 'micro' | 'normal'): number {
  if (grams === 0) return 0;
  if (type === 'flour') return Math.round(grams / 5) * 5;
  if (type === 'micro') return Math.round(grams * 10) / 10;
  return Math.round(grams);
}

export const CUSTOM_PRESETS_KEY = 'recipecrave-baking-presets';

export type CustomPreset = Omit<BakingRatioPreset, 'category' | 'notes' | 'hydrationRange'> & {
  custom: true;
  createdAt: string;
};
