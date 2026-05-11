// Ingredient substitution database.
// Sources: King Arthur Baking, Serious Eats, America's Test Kitchen, USDA.
// Ratios assume volumetric measure unless noted.

export type AllergenFlag = 'dairy' | 'gluten' | 'egg' | 'nut' | 'soy' | 'animal';
export type BestFor = 'baking' | 'cooking' | 'sauces' | 'frying' | 'raw' | 'sweet' | 'savory';
export type FlavorImpact = 'subtle' | 'noticeable' | 'major';
export type Quality = 'best' | 'good' | 'acceptable';

export type Substitute = {
  name: string;
  ratio: string;
  quality: Quality;
  bestFor?: BestFor[];
  flavorImpact?: FlavorImpact;
  allergenFlags?: AllergenFlag[];
  notes?: string;
};

export type IngredientSub = {
  slug: string;
  name: string;
  category: string;
  aliases?: string[];
  subs: Substitute[];
};

export const SUBSTITUTION_CATEGORIES = [
  'Dairy',
  'Eggs',
  'Flour & Starch',
  'Fat & Oil',
  'Sweetener',
  'Leavening',
  'Acid & Vinegar',
  'Herb & Spice',
  'Sauce & Condiment',
  'Liquid',
  'Protein',
  'Pantry',
] as const;

const QUALITY_RANK: Record<Quality, number> = { best: 3, good: 2, acceptable: 1 };

export const SUBSTITUTION_ITEMS: IngredientSub[] = [
  // ===== DAIRY =====
  {
    slug: 'buttermilk',
    name: 'Buttermilk',
    category: 'Dairy',
    subs: [
      { name: 'Milk + lemon juice', ratio: '1 cup milk + 1 tbsp lemon juice', quality: 'best', bestFor: ['baking'], flavorImpact: 'subtle', allergenFlags: ['dairy'], notes: 'Stir, rest 5–10 min until curdled.' },
      { name: 'Milk + white vinegar', ratio: '1 cup milk + 1 tbsp white vinegar', quality: 'best', bestFor: ['baking'], flavorImpact: 'subtle', allergenFlags: ['dairy'], notes: 'Rest 5–10 min.' },
      { name: 'Plain yogurt (thinned)', ratio: '3/4 cup yogurt + 1/4 cup water', quality: 'good', bestFor: ['baking', 'sauces'], flavorImpact: 'subtle', allergenFlags: ['dairy'] },
      { name: 'Kefir', ratio: '1:1', quality: 'good', flavorImpact: 'subtle', allergenFlags: ['dairy'] },
      { name: 'Sour cream (thinned)', ratio: '3/4 cup sour cream + 1/4 cup water', quality: 'acceptable', bestFor: ['baking'], allergenFlags: ['dairy'] },
    ],
  },
  {
    slug: 'heavy-cream',
    name: 'Heavy cream / double cream',
    category: 'Dairy',
    aliases: ['whipping cream'],
    subs: [
      { name: 'Whole milk + melted butter', ratio: '3/4 cup milk + 1/4 cup melted butter', quality: 'best', bestFor: ['baking', 'cooking'], flavorImpact: 'subtle', allergenFlags: ['dairy'], notes: 'Will not whip — only use for sauces and baking.' },
      { name: 'Evaporated milk', ratio: '1:1', quality: 'good', bestFor: ['cooking', 'sauces'], flavorImpact: 'subtle', allergenFlags: ['dairy'] },
      { name: 'Coconut cream (chilled)', ratio: '1:1', quality: 'good', bestFor: ['baking', 'sauces'], flavorImpact: 'noticeable', notes: 'Dairy-free. Whips when cold.' },
      { name: 'Greek yogurt + milk', ratio: '1/2 cup each', quality: 'acceptable', bestFor: ['sauces'], allergenFlags: ['dairy'] },
    ],
  },
  {
    slug: 'sour-cream',
    name: 'Sour cream',
    category: 'Dairy',
    subs: [
      { name: 'Plain Greek yogurt', ratio: '1:1', quality: 'best', bestFor: ['baking', 'cooking', 'raw'], flavorImpact: 'subtle', allergenFlags: ['dairy'] },
      { name: 'Crème fraîche', ratio: '1:1', quality: 'best', flavorImpact: 'subtle', allergenFlags: ['dairy'] },
      { name: 'Buttermilk', ratio: '1:1', quality: 'good', bestFor: ['baking'], allergenFlags: ['dairy'], notes: 'Thinner — works for batters, not toppings.' },
      { name: 'Cashew cream', ratio: '1:1', quality: 'good', allergenFlags: ['nut'], notes: 'Dairy-free. Soak cashews, blend with lemon + water.' },
    ],
  },
  {
    slug: 'milk-whole',
    name: 'Whole milk',
    category: 'Dairy',
    subs: [
      { name: 'Skim milk + butter', ratio: '1 cup skim + 2 tsp melted butter', quality: 'best', bestFor: ['baking'], allergenFlags: ['dairy'] },
      { name: 'Evaporated milk + water', ratio: '1/2 cup each', quality: 'good', allergenFlags: ['dairy'] },
      { name: 'Oat milk (full-fat)', ratio: '1:1', quality: 'good', bestFor: ['baking', 'cooking'], flavorImpact: 'subtle' },
      { name: 'Soy milk', ratio: '1:1', quality: 'good', bestFor: ['baking', 'cooking'], allergenFlags: ['soy'] },
      { name: 'Almond milk', ratio: '1:1', quality: 'acceptable', allergenFlags: ['nut'], notes: 'Thinner. Reduce other liquids slightly.' },
    ],
  },
  {
    slug: 'butter',
    name: 'Butter (unsalted)',
    category: 'Dairy',
    subs: [
      { name: 'Margarine', ratio: '1:1', quality: 'best', bestFor: ['baking'], allergenFlags: [] },
      { name: 'Coconut oil', ratio: '1:1', quality: 'good', bestFor: ['baking', 'frying'], flavorImpact: 'noticeable', notes: 'Solid at <76°F. Use refined for neutral flavor.' },
      { name: 'Vegetable oil', ratio: '3/4 of butter amount', quality: 'good', bestFor: ['baking'], notes: 'Cake/muffin only — not laminated dough.' },
      { name: 'Applesauce', ratio: '1:1 up to half the butter', quality: 'acceptable', bestFor: ['baking', 'sweet'], notes: 'Cuts fat but changes texture. Best for quick breads.' },
      { name: 'Greek yogurt', ratio: '1:1 for half the butter', quality: 'acceptable', bestFor: ['baking'], allergenFlags: ['dairy'] },
    ],
  },
  {
    slug: 'cream-cheese',
    name: 'Cream cheese',
    category: 'Dairy',
    subs: [
      { name: 'Mascarpone', ratio: '1:1', quality: 'best', flavorImpact: 'subtle', allergenFlags: ['dairy'] },
      { name: 'Ricotta (drained, blended)', ratio: '1:1', quality: 'good', allergenFlags: ['dairy'] },
      { name: 'Greek yogurt (strained overnight)', ratio: '1:1', quality: 'good', flavorImpact: 'noticeable', allergenFlags: ['dairy'] },
      { name: 'Cottage cheese (blended smooth)', ratio: '1:1', quality: 'acceptable', allergenFlags: ['dairy'] },
    ],
  },
  {
    slug: 'parmesan',
    name: 'Parmesan cheese (grated)',
    category: 'Dairy',
    aliases: ['parmigiano'],
    subs: [
      { name: 'Pecorino Romano', ratio: '1:1', quality: 'best', flavorImpact: 'noticeable', allergenFlags: ['dairy'], notes: 'Saltier and sharper — reduce added salt.' },
      { name: 'Grana Padano', ratio: '1:1', quality: 'best', flavorImpact: 'subtle', allergenFlags: ['dairy'] },
      { name: 'Nutritional yeast', ratio: '1/2 of parmesan', quality: 'acceptable', flavorImpact: 'noticeable', notes: 'Dairy-free umami. Best on pasta and popcorn.' },
    ],
  },

  // ===== EGGS =====
  {
    slug: 'egg',
    name: 'Egg (whole, large)',
    category: 'Eggs',
    aliases: ['eggs'],
    subs: [
      { name: 'Flax egg', ratio: '1 tbsp ground flax + 3 tbsp water (per egg)', quality: 'best', bestFor: ['baking'], allergenFlags: [], notes: 'Rest 5 min until gel. Works in muffins, cookies, pancakes.' },
      { name: 'Chia egg', ratio: '1 tbsp chia + 3 tbsp water (per egg)', quality: 'best', bestFor: ['baking'], notes: 'Rest 10 min.' },
      { name: 'Mashed banana', ratio: '1/4 cup per egg', quality: 'good', bestFor: ['baking', 'sweet'], flavorImpact: 'noticeable', notes: 'Adds sweetness and density.' },
      { name: 'Unsweetened applesauce', ratio: '1/4 cup per egg', quality: 'good', bestFor: ['baking'], flavorImpact: 'subtle' },
      { name: 'Silken tofu (blended)', ratio: '1/4 cup per egg', quality: 'good', bestFor: ['baking'], allergenFlags: ['soy'] },
      { name: 'Aquafaba (chickpea liquid)', ratio: '3 tbsp per egg', quality: 'best', bestFor: ['baking'], notes: 'Whips like egg white. Best for meringues and macarons.' },
      { name: 'Commercial egg replacer (Bob\'s Red Mill, JUST Egg)', ratio: 'Per package', quality: 'best', bestFor: ['baking', 'cooking'] },
    ],
  },
  {
    slug: 'egg-white',
    name: 'Egg white',
    category: 'Eggs',
    subs: [
      { name: 'Aquafaba', ratio: '2 tbsp per egg white', quality: 'best', bestFor: ['baking'], notes: 'Whips to stiff peaks like real egg white.' },
      { name: 'Flax gel', ratio: '1 tbsp ground flax + 3 tbsp water', quality: 'acceptable', bestFor: ['baking'] },
    ],
  },

  // ===== FLOUR & STARCH =====
  {
    slug: 'all-purpose-flour',
    name: 'All-purpose flour',
    category: 'Flour & Starch',
    aliases: ['plain flour', 'AP flour'],
    subs: [
      { name: 'Bread flour', ratio: '1:1', quality: 'good', bestFor: ['baking'], allergenFlags: ['gluten'], notes: 'Chewier — best for bread, pizza, not cakes.' },
      { name: 'Cake flour', ratio: '1 cup cake flour = 1 cup AP minus 2 tbsp', quality: 'good', bestFor: ['baking'], allergenFlags: ['gluten'], notes: 'Tender crumb — for cakes only.' },
      { name: 'Whole wheat flour', ratio: '3/4 of AP amount', quality: 'good', bestFor: ['baking'], allergenFlags: ['gluten'], flavorImpact: 'noticeable' },
      { name: '1-to-1 gluten-free blend (Bob\'s Red Mill, King Arthur)', ratio: '1:1', quality: 'good', bestFor: ['baking'] },
      { name: 'Almond flour + tapioca starch', ratio: '3/4 cup almond + 1/4 cup tapioca per cup AP', quality: 'acceptable', bestFor: ['baking'], allergenFlags: ['nut'] },
    ],
  },
  {
    slug: 'cake-flour',
    name: 'Cake flour',
    category: 'Flour & Starch',
    subs: [
      { name: 'AP flour + cornstarch', ratio: '1 cup AP - 2 tbsp, + 2 tbsp cornstarch', quality: 'best', bestFor: ['baking'], allergenFlags: ['gluten'], notes: 'Sift 3× for fine texture.' },
    ],
  },
  {
    slug: 'self-rising-flour',
    name: 'Self-rising flour',
    category: 'Flour & Starch',
    subs: [
      { name: 'AP flour + baking powder + salt', ratio: '1 cup AP + 1½ tsp baking powder + 1/4 tsp salt', quality: 'best', bestFor: ['baking'], allergenFlags: ['gluten'] },
    ],
  },
  {
    slug: 'bread-flour',
    name: 'Bread flour',
    category: 'Flour & Starch',
    subs: [
      { name: 'AP flour + vital wheat gluten', ratio: '1 cup AP + 1 tsp vital wheat gluten', quality: 'best', bestFor: ['baking'], allergenFlags: ['gluten'] },
      { name: 'AP flour', ratio: '1:1', quality: 'acceptable', bestFor: ['baking'], allergenFlags: ['gluten'], notes: 'Slightly less chew. Fine for pizza, pretzels.' },
    ],
  },
  {
    slug: 'cornstarch',
    name: 'Cornstarch',
    category: 'Flour & Starch',
    subs: [
      { name: 'Arrowroot powder', ratio: '1:1', quality: 'best', bestFor: ['sauces'], notes: 'Better for acidic sauces.' },
      { name: 'Tapioca starch', ratio: '1:1', quality: 'best', bestFor: ['sauces', 'baking'] },
      { name: 'All-purpose flour', ratio: '2:1 (use twice as much)', quality: 'good', bestFor: ['sauces'], allergenFlags: ['gluten'], notes: 'Will be cloudier.' },
      { name: 'Potato starch', ratio: '1:1', quality: 'good', bestFor: ['sauces', 'frying'] },
    ],
  },
  {
    slug: 'breadcrumbs',
    name: 'Breadcrumbs',
    category: 'Flour & Starch',
    subs: [
      { name: 'Panko', ratio: '1:1', quality: 'best', bestFor: ['frying', 'baking'], allergenFlags: ['gluten'] },
      { name: 'Crushed crackers', ratio: '1:1', quality: 'good', allergenFlags: ['gluten'] },
      { name: 'Crushed cornflakes', ratio: '1:1', quality: 'good', bestFor: ['frying'] },
      { name: 'Rolled oats (pulsed)', ratio: '1:1', quality: 'good', bestFor: ['baking'] },
      { name: 'Almond meal', ratio: '1:1', quality: 'good', allergenFlags: ['nut'], notes: 'Gluten-free option.' },
    ],
  },

  // ===== FAT & OIL =====
  {
    slug: 'vegetable-oil',
    name: 'Vegetable oil',
    category: 'Fat & Oil',
    subs: [
      { name: 'Canola oil', ratio: '1:1', quality: 'best', bestFor: ['baking', 'frying'] },
      { name: 'Sunflower oil', ratio: '1:1', quality: 'best', bestFor: ['baking', 'frying'] },
      { name: 'Light olive oil', ratio: '1:1', quality: 'good', bestFor: ['baking', 'cooking'], flavorImpact: 'subtle' },
      { name: 'Melted butter', ratio: '1:1', quality: 'good', bestFor: ['baking'], allergenFlags: ['dairy'], flavorImpact: 'noticeable' },
      { name: 'Coconut oil (melted)', ratio: '1:1', quality: 'good', bestFor: ['baking'], flavorImpact: 'noticeable' },
    ],
  },
  {
    slug: 'olive-oil',
    name: 'Olive oil (extra virgin)',
    category: 'Fat & Oil',
    subs: [
      { name: 'Avocado oil', ratio: '1:1', quality: 'best', bestFor: ['cooking', 'frying', 'raw'] },
      { name: 'Light/refined olive oil', ratio: '1:1', quality: 'best', bestFor: ['frying', 'cooking'] },
      { name: 'Grapeseed oil', ratio: '1:1', quality: 'good', bestFor: ['raw', 'cooking'] },
    ],
  },
  {
    slug: 'shortening',
    name: 'Vegetable shortening',
    category: 'Fat & Oil',
    aliases: ['Crisco'],
    subs: [
      { name: 'Butter', ratio: '1:1 + 2 tbsp extra per cup', quality: 'best', bestFor: ['baking'], allergenFlags: ['dairy'] },
      { name: 'Lard', ratio: '1:1', quality: 'best', bestFor: ['baking'], allergenFlags: ['animal'] },
      { name: 'Coconut oil (solid)', ratio: '1:1', quality: 'good', bestFor: ['baking'], flavorImpact: 'subtle' },
    ],
  },

  // ===== SWEETENERS =====
  {
    slug: 'sugar-white',
    name: 'Granulated sugar',
    category: 'Sweetener',
    subs: [
      { name: 'Caster sugar', ratio: '1:1', quality: 'best', bestFor: ['baking'] },
      { name: 'Brown sugar (packed)', ratio: '1:1', quality: 'good', bestFor: ['baking'], flavorImpact: 'noticeable', notes: 'Molasses adds moisture and depth.' },
      { name: 'Coconut sugar', ratio: '1:1', quality: 'good', bestFor: ['baking'], flavorImpact: 'noticeable' },
      { name: 'Honey', ratio: '3/4 of sugar amount + reduce liquid by 1/4 cup', quality: 'acceptable', bestFor: ['baking', 'sauces'], flavorImpact: 'noticeable', notes: 'Reduce oven temp 25°F.' },
      { name: 'Maple syrup', ratio: '3/4 of sugar amount + reduce liquid', quality: 'acceptable', bestFor: ['baking'], flavorImpact: 'noticeable' },
    ],
  },
  {
    slug: 'brown-sugar',
    name: 'Brown sugar',
    category: 'Sweetener',
    subs: [
      { name: 'White sugar + molasses', ratio: '1 cup white sugar + 1 tbsp molasses (light) or 2 tbsp (dark)', quality: 'best', bestFor: ['baking'], notes: 'Whisk to combine.' },
      { name: 'Coconut sugar', ratio: '1:1', quality: 'good', bestFor: ['baking'] },
      { name: 'Maple syrup (reduced)', ratio: 'See notes', quality: 'acceptable', notes: 'Reduce other liquids by 3 tbsp per cup.' },
    ],
  },
  {
    slug: 'powdered-sugar',
    name: 'Powdered sugar / icing sugar',
    category: 'Sweetener',
    aliases: ['confectioners sugar'],
    subs: [
      { name: 'Blender-ground white sugar + cornstarch', ratio: '1 cup sugar + 1 tbsp cornstarch, blend 1 min', quality: 'best', bestFor: ['baking'], notes: 'Sift before use.' },
    ],
  },
  {
    slug: 'honey',
    name: 'Honey',
    category: 'Sweetener',
    subs: [
      { name: 'Maple syrup', ratio: '1:1', quality: 'best', bestFor: ['baking', 'sauces'] },
      { name: 'Agave nectar', ratio: '1:1', quality: 'best', bestFor: ['baking', 'raw'] },
      { name: 'Brown rice syrup', ratio: '1:1', quality: 'good' },
      { name: 'Granulated sugar + water', ratio: '1 cup sugar + 1/4 cup water', quality: 'acceptable', bestFor: ['baking'] },
    ],
  },

  // ===== LEAVENING =====
  {
    slug: 'baking-powder',
    name: 'Baking powder',
    category: 'Leavening',
    subs: [
      { name: 'Baking soda + cream of tartar', ratio: '1 tsp = 1/4 tsp baking soda + 1/2 tsp cream of tartar', quality: 'best', bestFor: ['baking'] },
      { name: 'Baking soda + lemon juice', ratio: '1 tsp = 1/4 tsp soda + 1/2 tsp lemon juice (add to wet)', quality: 'good', bestFor: ['baking'] },
      { name: 'Baking soda + vinegar', ratio: '1 tsp = 1/4 tsp soda + 1/2 tsp vinegar', quality: 'good', bestFor: ['baking'] },
    ],
  },
  {
    slug: 'baking-soda',
    name: 'Baking soda',
    category: 'Leavening',
    aliases: ['bicarbonate of soda'],
    subs: [
      { name: 'Baking powder', ratio: '3:1 (use 3× as much)', quality: 'acceptable', bestFor: ['baking'], notes: 'Cannot fully replace — recipe may turn out denser. Only works if recipe has acid.' },
    ],
  },
  {
    slug: 'yeast',
    name: 'Active dry yeast',
    category: 'Leavening',
    subs: [
      { name: 'Instant yeast', ratio: '3/4 of active dry amount', quality: 'best', bestFor: ['baking'], notes: 'No blooming needed. Add directly to dry.' },
      { name: 'Fresh cake yeast', ratio: '1 packet dry = 2/3 oz fresh', quality: 'best', bestFor: ['baking'] },
      { name: 'Sourdough starter', ratio: '1 cup starter for 1 packet yeast', quality: 'good', bestFor: ['baking'], notes: 'Reduce flour by 1/2 cup and water by 1/2 cup.' },
    ],
  },

  // ===== ACID & VINEGAR =====
  {
    slug: 'lemon-juice',
    name: 'Lemon juice',
    category: 'Acid & Vinegar',
    subs: [
      { name: 'Lime juice', ratio: '1:1', quality: 'best', flavorImpact: 'subtle' },
      { name: 'White vinegar', ratio: '1/2 of lemon amount', quality: 'good', bestFor: ['baking', 'sauces'], notes: 'Less aromatic — only for acid function.' },
      { name: 'Apple cider vinegar', ratio: '1/2 of lemon amount', quality: 'good', bestFor: ['baking', 'sauces'], flavorImpact: 'subtle' },
      { name: 'White wine', ratio: '1:1', quality: 'acceptable', bestFor: ['cooking', 'sauces'] },
    ],
  },
  {
    slug: 'white-vinegar',
    name: 'White vinegar',
    category: 'Acid & Vinegar',
    subs: [
      { name: 'Apple cider vinegar', ratio: '1:1', quality: 'best', flavorImpact: 'subtle' },
      { name: 'Rice vinegar', ratio: '1:1', quality: 'good', bestFor: ['raw', 'cooking'] },
      { name: 'Lemon juice', ratio: '2× vinegar amount', quality: 'good' },
    ],
  },
  {
    slug: 'balsamic-vinegar',
    name: 'Balsamic vinegar',
    category: 'Acid & Vinegar',
    subs: [
      { name: 'Red wine vinegar + sugar', ratio: '1 tbsp vinegar + 1/2 tsp sugar', quality: 'best', flavorImpact: 'subtle' },
      { name: 'Apple cider vinegar + brown sugar', ratio: '1 tbsp ACV + 1/2 tsp brown sugar', quality: 'good' },
    ],
  },
  {
    slug: 'red-wine-vinegar',
    name: 'Red wine vinegar',
    category: 'Acid & Vinegar',
    subs: [
      { name: 'Apple cider vinegar', ratio: '1:1', quality: 'best' },
      { name: 'Balsamic (thinned with water)', ratio: '1:1 with 1/2 water', quality: 'good', flavorImpact: 'noticeable' },
    ],
  },

  // ===== HERB & SPICE =====
  {
    slug: 'fresh-herbs',
    name: 'Fresh herbs (any)',
    category: 'Herb & Spice',
    subs: [
      { name: 'Dried herbs', ratio: '1/3 of fresh amount', quality: 'best', notes: '1 tbsp fresh = 1 tsp dried. Add early in cooking.' },
    ],
  },
  {
    slug: 'dried-herbs',
    name: 'Dried herbs (any)',
    category: 'Herb & Spice',
    subs: [
      { name: 'Fresh herbs', ratio: '3× dried amount', quality: 'best', notes: 'Add at end of cooking for best flavor.' },
    ],
  },
  {
    slug: 'allspice',
    name: 'Allspice',
    category: 'Herb & Spice',
    subs: [
      { name: 'Cinnamon + nutmeg + cloves', ratio: 'Equal parts to total allspice amount', quality: 'best' },
    ],
  },
  {
    slug: 'pumpkin-spice',
    name: 'Pumpkin pie spice',
    category: 'Herb & Spice',
    subs: [
      { name: 'Cinnamon + ginger + nutmeg + allspice', ratio: '3:1:1:1', quality: 'best' },
    ],
  },
  {
    slug: 'italian-seasoning',
    name: 'Italian seasoning',
    category: 'Herb & Spice',
    subs: [
      { name: 'Oregano + basil + thyme + rosemary', ratio: 'Equal parts', quality: 'best' },
    ],
  },
  {
    slug: 'cajun-seasoning',
    name: 'Cajun seasoning',
    category: 'Herb & Spice',
    subs: [
      { name: 'Paprika + cayenne + garlic powder + onion powder + oregano + thyme', ratio: '2:1:1:1:1:1', quality: 'best' },
    ],
  },
  {
    slug: 'garlic-clove',
    name: 'Fresh garlic clove',
    category: 'Herb & Spice',
    subs: [
      { name: 'Garlic powder', ratio: '1 clove = 1/8 tsp powder', quality: 'good', notes: 'Loses aromatic top notes.' },
      { name: 'Garlic salt', ratio: '1 clove = 1/2 tsp', quality: 'acceptable', notes: 'Reduce added salt.' },
      { name: 'Granulated garlic', ratio: '1 clove = 1/4 tsp', quality: 'good' },
    ],
  },

  // ===== SAUCE & CONDIMENT =====
  {
    slug: 'soy-sauce',
    name: 'Soy sauce',
    category: 'Sauce & Condiment',
    subs: [
      { name: 'Tamari', ratio: '1:1', quality: 'best', allergenFlags: ['soy'], notes: 'Usually gluten-free — check label.' },
      { name: 'Coconut aminos', ratio: '1:1', quality: 'best', flavorImpact: 'subtle', notes: 'Sweeter, less salty. Reduce sugar elsewhere.' },
      { name: 'Worcestershire + water', ratio: '1:1 with 1 part water', quality: 'good', allergenFlags: ['gluten'] },
      { name: 'Liquid aminos', ratio: '1:1', quality: 'good', allergenFlags: ['soy'] },
    ],
  },
  {
    slug: 'worcestershire',
    name: 'Worcestershire sauce',
    category: 'Sauce & Condiment',
    subs: [
      { name: 'Soy sauce + sugar + lemon', ratio: '1 tbsp soy + 1/4 tsp sugar + 1/4 tsp lemon juice', quality: 'best', allergenFlags: ['soy', 'gluten'] },
      { name: 'Fish sauce + lemon + sugar', ratio: '1 tbsp + 1/2 tsp + 1/4 tsp', quality: 'good', flavorImpact: 'noticeable', allergenFlags: ['animal'] },
    ],
  },
  {
    slug: 'tomato-sauce',
    name: 'Tomato sauce (canned)',
    category: 'Sauce & Condiment',
    subs: [
      { name: 'Tomato paste + water', ratio: '1/2 cup paste + 1 cup water = 1 cup sauce', quality: 'best', bestFor: ['cooking', 'sauces'] },
      { name: 'Crushed tomatoes (blended)', ratio: '1:1', quality: 'best' },
      { name: 'Tomato purée', ratio: '1:1', quality: 'good' },
    ],
  },
  {
    slug: 'tomato-paste',
    name: 'Tomato paste',
    category: 'Sauce & Condiment',
    subs: [
      { name: 'Tomato sauce (reduced)', ratio: '3 tbsp sauce reduced to 1 tbsp paste', quality: 'best', bestFor: ['cooking'] },
      { name: 'Ketchup', ratio: '1:1', quality: 'acceptable', flavorImpact: 'noticeable', notes: 'Adds sugar + vinegar.' },
    ],
  },
  {
    slug: 'ketchup',
    name: 'Ketchup',
    category: 'Sauce & Condiment',
    subs: [
      { name: 'Tomato paste + vinegar + sugar', ratio: '6 tbsp paste + 1 tbsp vinegar + 1 tbsp sugar + pinch salt', quality: 'best' },
    ],
  },
  {
    slug: 'mayo',
    name: 'Mayonnaise',
    category: 'Sauce & Condiment',
    subs: [
      { name: 'Greek yogurt', ratio: '1:1', quality: 'best', bestFor: ['raw', 'sauces'], allergenFlags: ['dairy'], flavorImpact: 'subtle' },
      { name: 'Sour cream', ratio: '1:1', quality: 'good', allergenFlags: ['dairy'] },
      { name: 'Hummus', ratio: '1:1', quality: 'good', bestFor: ['raw'], flavorImpact: 'noticeable' },
      { name: 'Mashed avocado', ratio: '1:1', quality: 'good', bestFor: ['raw'], flavorImpact: 'noticeable' },
    ],
  },
  {
    slug: 'dijon-mustard',
    name: 'Dijon mustard',
    category: 'Sauce & Condiment',
    subs: [
      { name: 'Whole grain mustard', ratio: '1:1', quality: 'best', flavorImpact: 'subtle' },
      { name: 'Yellow mustard + horseradish', ratio: '1 tbsp yellow + 1/4 tsp horseradish', quality: 'good' },
    ],
  },

  // ===== LIQUID =====
  {
    slug: 'wine-white',
    name: 'White wine (cooking)',
    category: 'Liquid',
    subs: [
      { name: 'Chicken stock + lemon juice', ratio: '1 cup stock + 1 tbsp lemon', quality: 'best', bestFor: ['cooking', 'sauces'] },
      { name: 'White grape juice + vinegar', ratio: '1 cup juice + 1 tbsp vinegar', quality: 'good', bestFor: ['baking'] },
      { name: 'Vegetable stock + lemon', ratio: '1 cup + 1 tbsp', quality: 'good' },
    ],
  },
  {
    slug: 'wine-red',
    name: 'Red wine (cooking)',
    category: 'Liquid',
    subs: [
      { name: 'Beef stock + balsamic', ratio: '1 cup stock + 1 tbsp balsamic', quality: 'best', bestFor: ['cooking', 'sauces'], allergenFlags: ['animal'] },
      { name: 'Pomegranate juice + vinegar', ratio: '1 cup juice + 1 tbsp red wine vinegar', quality: 'good' },
      { name: 'Cranberry juice + lemon', ratio: '1 cup + 1 tsp lemon', quality: 'acceptable' },
    ],
  },
  {
    slug: 'chicken-stock',
    name: 'Chicken stock',
    category: 'Liquid',
    subs: [
      { name: 'Vegetable stock', ratio: '1:1', quality: 'best', bestFor: ['cooking', 'sauces'] },
      { name: 'Bouillon cube + water', ratio: '1 cube per cup water', quality: 'good', allergenFlags: ['animal'] },
      { name: 'Mushroom stock', ratio: '1:1', quality: 'good', flavorImpact: 'noticeable' },
      { name: 'Water + miso paste', ratio: '1 cup water + 1 tsp miso', quality: 'acceptable', allergenFlags: ['soy'] },
    ],
  },
  {
    slug: 'beef-stock',
    name: 'Beef stock',
    category: 'Liquid',
    subs: [
      { name: 'Mushroom stock + soy sauce', ratio: '1 cup + 1 tsp', quality: 'best', allergenFlags: ['soy'] },
      { name: 'Vegetable stock + Worcestershire', ratio: '1 cup + 1 tsp', quality: 'good' },
      { name: 'Beef bouillon + water', ratio: '1 cube per cup', quality: 'good' },
    ],
  },

  // ===== PROTEIN =====
  {
    slug: 'ground-beef',
    name: 'Ground beef',
    category: 'Protein',
    subs: [
      { name: 'Ground turkey or chicken', ratio: '1:1', quality: 'good', flavorImpact: 'subtle', notes: 'Leaner — add 1 tbsp olive oil per pound.' },
      { name: 'Ground pork', ratio: '1:1', quality: 'good', flavorImpact: 'subtle' },
      { name: 'Lentils (cooked)', ratio: '1:1', quality: 'good', notes: 'Best for chili, taco filling, sauce.' },
      { name: 'Plant-based crumbles (Beyond, Impossible)', ratio: '1:1', quality: 'best', allergenFlags: ['soy'] },
      { name: 'Mushrooms (finely chopped)', ratio: '1:1', quality: 'good', bestFor: ['cooking'] },
    ],
  },
  {
    slug: 'bacon',
    name: 'Bacon',
    category: 'Protein',
    subs: [
      { name: 'Pancetta', ratio: '1:1', quality: 'best', allergenFlags: ['animal'] },
      { name: 'Prosciutto', ratio: '1:1', quality: 'good', flavorImpact: 'subtle' },
      { name: 'Turkey bacon', ratio: '1:1', quality: 'good', flavorImpact: 'subtle' },
      { name: 'Tempeh bacon', ratio: '1:1', quality: 'good', allergenFlags: ['soy'] },
      { name: 'Coconut bacon (smoked flakes)', ratio: '1/2 of bacon weight', quality: 'acceptable' },
    ],
  },

  // ===== PANTRY =====
  {
    slug: 'cocoa-powder',
    name: 'Unsweetened cocoa powder',
    category: 'Pantry',
    subs: [
      { name: 'Unsweetened baking chocolate (melted)', ratio: '1 oz chocolate = 3 tbsp cocoa + 1 tbsp fat', quality: 'best', bestFor: ['baking'] },
      { name: 'Dutch-process cocoa', ratio: '1:1', quality: 'best', bestFor: ['baking'], notes: 'May need to adjust leavening — Dutch is alkaline.' },
      { name: 'Carob powder', ratio: '1:1', quality: 'acceptable', flavorImpact: 'noticeable' },
    ],
  },
  {
    slug: 'chocolate-chips',
    name: 'Chocolate chips (semi-sweet)',
    category: 'Pantry',
    subs: [
      { name: 'Chopped chocolate bar', ratio: '1:1', quality: 'best', bestFor: ['baking'] },
      { name: 'Cocoa nibs', ratio: '1:1', quality: 'good', notes: 'Less sweet — add 1 tbsp sugar per cup.' },
      { name: 'Carob chips', ratio: '1:1', quality: 'acceptable' },
    ],
  },
  {
    slug: 'cornmeal',
    name: 'Cornmeal',
    category: 'Pantry',
    subs: [
      { name: 'Polenta', ratio: '1:1', quality: 'best' },
      { name: 'Corn flour (finer)', ratio: '1:1', quality: 'good', notes: 'Finer texture — best for cornbread, not coatings.' },
      { name: 'Semolina', ratio: '1:1', quality: 'acceptable', allergenFlags: ['gluten'] },
    ],
  },
  {
    slug: 'pine-nuts',
    name: 'Pine nuts',
    category: 'Pantry',
    subs: [
      { name: 'Walnuts', ratio: '1:1', quality: 'best', allergenFlags: ['nut'], notes: 'Toast for similar warmth.' },
      { name: 'Almonds (slivered)', ratio: '1:1', quality: 'good', allergenFlags: ['nut'] },
      { name: 'Cashews', ratio: '1:1', quality: 'good', allergenFlags: ['nut'] },
      { name: 'Sunflower seeds (toasted)', ratio: '1:1', quality: 'good', notes: 'Nut-free.' },
    ],
  },
  {
    slug: 'vanilla-extract',
    name: 'Vanilla extract',
    category: 'Pantry',
    subs: [
      { name: 'Vanilla bean paste', ratio: '1:1', quality: 'best', bestFor: ['baking'] },
      { name: 'Vanilla bean (scraped)', ratio: '1 tsp extract = 1/2 bean', quality: 'best', bestFor: ['baking'] },
      { name: 'Maple syrup', ratio: '1:1', quality: 'acceptable', flavorImpact: 'noticeable' },
      { name: 'Almond extract', ratio: '1/2 of vanilla amount', quality: 'acceptable', allergenFlags: ['nut'] },
    ],
  },
];

export function findSubstitution(query: string): IngredientSub | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    SUBSTITUTION_ITEMS.find((i) => i.slug === q) ??
    SUBSTITUTION_ITEMS.find((i) => i.name.toLowerCase() === q) ??
    null
  );
}

export function searchSubstitutions(query: string, limit = 20): IngredientSub[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  type Scored = { item: IngredientSub; score: number };
  const scored: Scored[] = [];
  for (const item of SUBSTITUTION_ITEMS) {
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

export function rankSubsByContext(
  subs: Substitute[],
  filterAllergens: AllergenFlag[],
  bestForFilter?: BestFor,
): Substitute[] {
  let filtered = subs;
  if (filterAllergens.length > 0) {
    filtered = filtered.filter(
      (s) => !(s.allergenFlags ?? []).some((f) => filterAllergens.includes(f)),
    );
  }
  if (bestForFilter) {
    filtered = filtered.filter(
      (s) => !s.bestFor || s.bestFor.includes(bestForFilter),
    );
  }
  return [...filtered].sort((a, b) => QUALITY_RANK[b.quality] - QUALITY_RANK[a.quality]);
}
