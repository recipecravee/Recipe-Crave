// Storage life data — derived from USDA FoodKeeper guidance + FDA cold-storage chart.
// Times are conservative; "best quality" not absolute safety. Frozen times = quality.

export type StorageItem = {
  slug: string;
  name: string;
  category: string;
  aliases?: string[];
  pantry?: { unopened?: string; opened?: string; note?: string };
  fridge?: { unopened?: string; opened?: string; note?: string };
  freezer?: { time?: string; note?: string };
  spoilageSigns: string[];
  reheating?: string;
};

export const STORAGE_CATEGORIES = [
  'Dairy & Eggs',
  'Meat & Poultry',
  'Seafood',
  'Produce — Fruit',
  'Produce — Vegetables',
  'Pantry Staples',
  'Condiments & Sauces',
  'Bakery & Grains',
  'Leftovers & Cooked',
  'Beverages',
] as const;

export const STORAGE_ITEMS: StorageItem[] = [
  // ===== DAIRY & EGGS =====
  {
    slug: 'milk',
    name: 'Milk (whole / 2% / skim)',
    category: 'Dairy & Eggs',
    aliases: ['cow milk', 'fresh milk'],
    fridge: { unopened: '1 week past sell-by date', opened: '5–7 days', note: 'Keep ≤40°F (4°C). Door is warmest — store on a shelf.' },
    freezer: { time: '3 months', note: 'Texture turns grainy on thaw. Best for cooking/baking after.' },
    spoilageSigns: ['Sour smell', 'Yellow tint', 'Lumps or curdling', 'Bloated container'],
  },
  {
    slug: 'butter',
    name: 'Butter (salted)',
    category: 'Dairy & Eggs',
    pantry: { opened: '1–2 days', note: 'Covered butter dish, cool room only. Unsalted spoils faster.' },
    fridge: { unopened: '4 months', opened: '1–2 months' },
    freezer: { time: '6–9 months' },
    spoilageSigns: ['Rancid/cheesy smell', 'Yellow oily edges', 'Mold spots'],
  },
  {
    slug: 'cheese-hard',
    name: 'Hard cheese (cheddar, parmesan, gouda)',
    category: 'Dairy & Eggs',
    fridge: { unopened: '6 months', opened: '3–4 weeks', note: 'Wrap in wax/parchment then loose plastic — needs to breathe.' },
    freezer: { time: '6 months', note: 'Best grated after thaw.' },
    spoilageSigns: ['Surface mold (cut off 1 inch around for hard cheese only)', 'Slimy texture', 'Ammonia smell'],
  },
  {
    slug: 'cheese-soft',
    name: 'Soft cheese (brie, mozzarella, ricotta, cottage)',
    category: 'Dairy & Eggs',
    fridge: { unopened: '1 week past date', opened: '1 week' },
    freezer: { time: 'Not recommended', note: 'Soft cheese separates and weeps on thaw.' },
    spoilageSigns: ['Any visible mold → discard whole block', 'Sour/yeasty smell', 'Pink or black spots'],
  },
  {
    slug: 'yogurt',
    name: 'Yogurt (plain or flavored)',
    category: 'Dairy & Eggs',
    fridge: { unopened: '1–2 weeks past date', opened: '7–10 days' },
    freezer: { time: '1–2 months', note: 'Texture separates. Stir before eating or use in smoothies.' },
    spoilageSigns: ['Excessive watery whey on top is normal — stir in', 'Sour smell beyond tang', 'Mold', 'Bloated lid'],
  },
  {
    slug: 'cream',
    name: 'Heavy cream / double cream',
    category: 'Dairy & Eggs',
    fridge: { unopened: '1 month past date', opened: '7–10 days' },
    freezer: { time: '4 months', note: 'Best for cooking after. Will not whip well.' },
    spoilageSigns: ['Sour smell', 'Lumps', 'Yellow tint'],
  },
  {
    slug: 'eggs',
    name: 'Eggs (in shell)',
    category: 'Dairy & Eggs',
    fridge: { unopened: '3–5 weeks past pack date', note: 'Keep in carton on a shelf, not the door. Float test: sinks = fresh, floats = old.' },
    freezer: { time: '12 months', note: 'Crack and beat first. Do not freeze in shell.' },
    spoilageSigns: ['Sulfur smell when cracked', 'Pink, green, or black interior', 'Floats fully in water test'],
  },
  {
    slug: 'eggs-hard-boiled',
    name: 'Hard-boiled eggs',
    category: 'Dairy & Eggs',
    fridge: { opened: '1 week', note: 'Keep in shell for longest life. Peeled: 5 days in water.' },
    freezer: { time: 'Not recommended', note: 'Whites turn rubbery.' },
    spoilageSigns: ['Off smell', 'Slimy white', 'Discolored yolk'],
  },

  // ===== MEAT & POULTRY =====
  {
    slug: 'ground-beef',
    name: 'Ground beef / mince',
    category: 'Meat & Poultry',
    fridge: { unopened: '1–2 days', note: 'Cook within 2 days of purchase regardless of date.' },
    freezer: { time: '3–4 months', note: 'Wrap tightly. Vacuum-seal extends to 6 months.' },
    spoilageSigns: ['Gray-brown throughout (surface only is OK)', 'Sticky or slimy texture', 'Sour or ammonia smell'],
    reheating: 'Heat to 165°F (74°C) internal. Cooked once only — discard if reheated leftovers go uneaten.',
  },
  {
    slug: 'steak',
    name: 'Steak / beef cuts',
    category: 'Meat & Poultry',
    fridge: { unopened: '3–5 days' },
    freezer: { time: '6–12 months' },
    spoilageSigns: ['Gray-green tint', 'Sticky surface', 'Sour smell'],
  },
  {
    slug: 'chicken-raw',
    name: 'Raw chicken (whole or pieces)',
    category: 'Meat & Poultry',
    fridge: { unopened: '1–2 days', note: 'Bottom shelf only. Keep in original wrapping on a plate.' },
    freezer: { time: 'Whole 12 months · pieces 9 months' },
    spoilageSigns: ['Gray or yellow tint', 'Slimy or tacky surface', 'Sour or sulfur smell'],
    reheating: '165°F (74°C) internal at thickest part.',
  },
  {
    slug: 'pork-raw',
    name: 'Raw pork (chops, roasts)',
    category: 'Meat & Poultry',
    fridge: { unopened: '3–5 days' },
    freezer: { time: '4–12 months' },
    spoilageSigns: ['Gray tint', 'Sour or ammonia smell', 'Slimy texture'],
  },
  {
    slug: 'bacon',
    name: 'Bacon (raw)',
    category: 'Meat & Poultry',
    fridge: { unopened: '2 weeks past date', opened: '1 week' },
    freezer: { time: '1 month', note: 'Cured fats go rancid faster than uncured meats.' },
    spoilageSigns: ['Gray-green color', 'Slimy surface', 'Sour smell'],
  },
  {
    slug: 'sausage-fresh',
    name: 'Fresh sausage (raw, not cured)',
    category: 'Meat & Poultry',
    fridge: { unopened: '1–2 days', opened: '1–2 days' },
    freezer: { time: '1–2 months' },
    spoilageSigns: ['Gray tint', 'Slimy casing', 'Sour smell'],
  },
  {
    slug: 'deli-meat',
    name: 'Deli meat / sliced ham / turkey',
    category: 'Meat & Poultry',
    fridge: { unopened: '2 weeks past date', opened: '3–5 days', note: 'Listeria risk — pregnant should avoid pre-sliced unless reheated to steaming.' },
    freezer: { time: '1–2 months', note: 'Texture suffers.' },
    spoilageSigns: ['Slimy or sticky surface', 'Sour smell', 'Gray edges'],
  },
  {
    slug: 'hot-dogs',
    name: 'Hot dogs / frankfurters',
    category: 'Meat & Poultry',
    fridge: { unopened: '2 weeks past date', opened: '1 week' },
    freezer: { time: '1–2 months' },
    spoilageSigns: ['Slimy', 'Sour smell', 'Discolored'],
  },

  // ===== SEAFOOD =====
  {
    slug: 'fish-fresh',
    name: 'Fresh fish (salmon, cod, tilapia)',
    category: 'Seafood',
    fridge: { unopened: '1–2 days', note: 'Use the day of purchase if possible. Store on ice in fridge.' },
    freezer: { time: 'Lean fish 6 months · fatty fish 2–3 months' },
    spoilageSigns: ['Strong fishy / ammonia smell', 'Dull eyes', 'Slimy flesh', 'Gills brown not red'],
  },
  {
    slug: 'shrimp-raw',
    name: 'Shrimp / prawns (raw)',
    category: 'Seafood',
    fridge: { unopened: '1–2 days' },
    freezer: { time: '6 months' },
    spoilageSigns: ['Ammonia smell (strong = bad)', 'Black spots on shell', 'Slimy', 'Mushy texture'],
  },
  {
    slug: 'shellfish-live',
    name: 'Live shellfish (mussels, clams, oysters)',
    category: 'Seafood',
    fridge: { unopened: '1–2 days', note: 'Cover with damp cloth, never airtight or in water. Discard any that gape and do not close.' },
    freezer: { time: 'Not recommended live' },
    spoilageSigns: ['Open shells that do not close when tapped', 'Cracked shells', 'Off smell'],
  },
  {
    slug: 'canned-tuna',
    name: 'Canned tuna / salmon',
    category: 'Seafood',
    pantry: { unopened: '3–5 years' },
    fridge: { opened: '3–4 days', note: 'Transfer to non-metal container after opening.' },
    spoilageSigns: ['Bulging or dented can — discard unopened', 'Off smell', 'Discoloration'],
  },

  // ===== PRODUCE — FRUIT =====
  {
    slug: 'apples',
    name: 'Apples',
    category: 'Produce — Fruit',
    pantry: { unopened: '1–2 weeks' },
    fridge: { unopened: '4–6 weeks', note: 'Crisper drawer. Keep away from ethylene-sensitive veg.' },
    freezer: { time: '8 months', note: 'Slice and toss with lemon juice first.' },
    spoilageSigns: ['Wrinkled skin', 'Soft spots', 'Brown bruises spreading'],
  },
  {
    slug: 'bananas',
    name: 'Bananas',
    category: 'Produce — Fruit',
    pantry: { opened: '2–7 days depending on ripeness', note: 'Separate hands to slow ripening.' },
    fridge: { note: 'Peel turns black but fruit stays good — only refrigerate when ripe.' },
    freezer: { time: '3 months', note: 'Peel and freeze for smoothies/banana bread.' },
    spoilageSigns: ['Black/brown throughout when cut', 'Mushy', 'Fermented smell'],
  },
  {
    slug: 'berries',
    name: 'Berries (strawberry, blueberry, raspberry)',
    category: 'Produce — Fruit',
    fridge: { unopened: '3–7 days', note: 'Do not wash until ready to eat. Vinegar rinse (1:3 with water) extends life.' },
    freezer: { time: '6 months', note: 'Single-layer freeze first, then bag.' },
    spoilageSigns: ['White or gray fuzz', 'Mushy or leaking', 'Off smell'],
  },
  {
    slug: 'citrus',
    name: 'Citrus (orange, lemon, lime)',
    category: 'Produce — Fruit',
    pantry: { unopened: '1 week' },
    fridge: { unopened: '3–4 weeks' },
    freezer: { time: '4 months', note: 'Juice and zest separately for best results.' },
    spoilageSigns: ['Soft spots', 'White/blue mold', 'Dried, rock-hard'],
  },
  {
    slug: 'avocado',
    name: 'Avocado',
    category: 'Produce — Fruit',
    pantry: { unopened: '3–7 days to ripen' },
    fridge: { opened: '2–3 days ripe · cut half 1–2 days with lemon juice and lid' },
    freezer: { time: '4 months', note: 'Mash with lemon juice first.' },
    spoilageSigns: ['Black flesh throughout', 'Stringy', 'Sour smell'],
  },
  {
    slug: 'grapes',
    name: 'Grapes',
    category: 'Produce — Fruit',
    fridge: { unopened: '1–2 weeks', note: 'Do not wash until use. Keep on stem.' },
    freezer: { time: '12 months', note: 'Frozen whole = great snack.' },
    spoilageSigns: ['Wrinkled', 'Brown stems with mush', 'White mold'],
  },

  // ===== PRODUCE — VEGETABLES =====
  {
    slug: 'lettuce',
    name: 'Lettuce / salad greens',
    category: 'Produce — Vegetables',
    fridge: { unopened: '7–10 days head · 3–5 days bagged', note: 'Wrap in dry paper towel. Avoid moisture.' },
    freezer: { time: 'Not recommended' },
    spoilageSigns: ['Slimy leaves', 'Brown/black edges', 'Wilted beyond crisping in cold water'],
  },
  {
    slug: 'tomatoes',
    name: 'Tomatoes',
    category: 'Produce — Vegetables',
    pantry: { unopened: '5–7 days', note: 'Counter only for flavor. Fridge dulls taste.' },
    fridge: { unopened: '1–2 weeks if very ripe' },
    freezer: { time: '8 months', note: 'Whole or sauce — texture lost, fine for cooking.' },
    spoilageSigns: ['Wrinkled skin', 'Mushy spots', 'White or green mold'],
  },
  {
    slug: 'onions',
    name: 'Onions (whole)',
    category: 'Produce — Vegetables',
    pantry: { unopened: '2–3 months', note: 'Dark, cool, ventilated spot. Not with potatoes — they sprout each other.' },
    fridge: { opened: 'Cut: 7–10 days in airtight container' },
    freezer: { time: '8 months chopped' },
    spoilageSigns: ['Soft spots', 'Black mold at top', 'Slimy layers'],
  },
  {
    slug: 'garlic',
    name: 'Garlic (whole bulb)',
    category: 'Produce — Vegetables',
    pantry: { unopened: '3–5 months', note: 'Ventilated, dark spot.' },
    fridge: { opened: 'Peeled cloves 1 week · minced 2 days' },
    freezer: { time: '12 months whole · 6 months minced' },
    spoilageSigns: ['Green sprouts (still edible but bitter)', 'Soft cloves', 'Brown spots'],
  },
  {
    slug: 'potatoes',
    name: 'Potatoes',
    category: 'Produce — Vegetables',
    pantry: { unopened: '3–5 weeks', note: 'Dark, cool (45–55°F), ventilated. Never fridge — turns sweet & gummy.' },
    spoilageSigns: ['Green skin (cut off — solanine)', 'Soft/wrinkled', 'Heavy sprouting', 'Off smell'],
  },
  {
    slug: 'carrots',
    name: 'Carrots',
    category: 'Produce — Vegetables',
    fridge: { unopened: '3–4 weeks', note: 'Crisper drawer in a bag with paper towel.' },
    freezer: { time: '10–12 months', note: 'Blanch 2 min first.' },
    spoilageSigns: ['Slimy surface', 'Black spots', 'Floppy/rubbery (revive in cold water if minor)'],
  },
  {
    slug: 'broccoli',
    name: 'Broccoli',
    category: 'Produce — Vegetables',
    fridge: { unopened: '7–10 days' },
    freezer: { time: '10–12 months', note: 'Blanch 3 min first.' },
    spoilageSigns: ['Yellowing florets', 'Slimy stem', 'Strong sulfur smell'],
  },
  {
    slug: 'peppers',
    name: 'Bell peppers',
    category: 'Produce — Vegetables',
    fridge: { unopened: '1–2 weeks' },
    freezer: { time: '6 months chopped' },
    spoilageSigns: ['Wrinkled skin', 'Soft mushy spots', 'White inside mold'],
  },
  {
    slug: 'cucumber',
    name: 'Cucumber',
    category: 'Produce — Vegetables',
    fridge: { unopened: '1 week', note: 'Wrap in paper towel inside loose bag.' },
    spoilageSigns: ['Slimy skin', 'Mushy ends', 'Yellow color'],
  },
  {
    slug: 'mushrooms',
    name: 'Mushrooms (fresh)',
    category: 'Produce — Vegetables',
    fridge: { unopened: '7–10 days', note: 'Paper bag, never plastic — needs air.' },
    freezer: { time: '8–12 months cooked', note: 'Sauté first, raw freeze ruins them.' },
    spoilageSigns: ['Slimy caps', 'Dark spots spreading', 'Sour smell', 'Wrinkled and dry'],
  },
  {
    slug: 'herbs-fresh',
    name: 'Fresh herbs (basil, parsley, cilantro)',
    category: 'Produce — Vegetables',
    fridge: { unopened: '7–10 days', note: 'Stems in water glass, bag over leaves. Basil: counter only.' },
    freezer: { time: '4–6 months', note: 'Chop into ice cube trays with oil or water.' },
    spoilageSigns: ['Black leaves', 'Slimy stems', 'Wilt beyond water revival'],
  },

  // ===== PANTRY STAPLES =====
  {
    slug: 'flour-white',
    name: 'All-purpose flour',
    category: 'Pantry Staples',
    pantry: { unopened: '12 months', opened: '6–8 months', note: 'Airtight container. Add bay leaf to deter weevils.' },
    fridge: { opened: '12 months' },
    freezer: { time: '24 months' },
    spoilageSigns: ['Musty or sour smell', 'Insects/webbing', 'Clumping with moisture'],
  },
  {
    slug: 'flour-whole-wheat',
    name: 'Whole wheat flour',
    category: 'Pantry Staples',
    pantry: { unopened: '3 months', opened: '1–3 months', note: 'Oils in germ go rancid fast. Fridge or freezer storage best.' },
    fridge: { opened: '6 months' },
    freezer: { time: '1 year' },
    spoilageSigns: ['Rancid/oily smell', 'Bitter taste'],
  },
  {
    slug: 'sugar-white',
    name: 'White sugar',
    category: 'Pantry Staples',
    pantry: { unopened: 'Indefinite', opened: '2 years', note: 'Airtight. Hardens with moisture but still usable.' },
    spoilageSigns: ['Insects', 'Off smell', 'Mold (very rare unless wet)'],
  },
  {
    slug: 'brown-sugar',
    name: 'Brown sugar',
    category: 'Pantry Staples',
    pantry: { unopened: '2 years', opened: '6 months', note: 'Add bread slice or terracotta disc to keep soft.' },
    spoilageSigns: ['Rock hard (revive: damp paper towel sealed overnight)', 'Off smell'],
  },
  {
    slug: 'rice-white',
    name: 'White rice (uncooked)',
    category: 'Pantry Staples',
    pantry: { unopened: 'Indefinite', opened: '2 years', note: 'Airtight, cool. Vacuum-seal for 30+ years.' },
    spoilageSigns: ['Insects/weevils', 'Musty smell', 'Discoloration'],
  },
  {
    slug: 'rice-brown',
    name: 'Brown rice (uncooked)',
    category: 'Pantry Staples',
    pantry: { unopened: '6 months', opened: '3–6 months', note: 'Oils in bran go rancid. Fridge/freezer for long term.' },
    fridge: { opened: '12 months' },
    freezer: { time: '18 months' },
    spoilageSigns: ['Rancid smell', 'Bitter taste', 'Greasy feel'],
  },
  {
    slug: 'pasta-dry',
    name: 'Dry pasta',
    category: 'Pantry Staples',
    pantry: { unopened: '2 years', opened: '1 year' },
    spoilageSigns: ['Insects', 'Musty smell', 'Crumbling/chalky texture'],
  },
  {
    slug: 'oats',
    name: 'Rolled oats',
    category: 'Pantry Staples',
    pantry: { unopened: '12 months', opened: '6 months' },
    freezer: { time: '24 months' },
    spoilageSigns: ['Rancid smell', 'Insects', 'Mold'],
  },
  {
    slug: 'canned-beans',
    name: 'Canned beans / vegetables',
    category: 'Pantry Staples',
    pantry: { unopened: '2–5 years past date', note: 'Low-acid foods last longer than tomatoes.' },
    fridge: { opened: '3–4 days', note: 'Transfer to non-metal container.' },
    spoilageSigns: ['Bulging or rusted can — discard', 'Hissing on open', 'Off smell', 'Mold'],
  },
  {
    slug: 'cereal',
    name: 'Breakfast cereal',
    category: 'Pantry Staples',
    pantry: { unopened: '6–12 months', opened: '4–6 weeks', note: 'Reseal bag tightly or transfer to airtight.' },
    spoilageSigns: ['Stale (no crunch)', 'Insects', 'Rancid smell (high-fat granolas)'],
  },
  {
    slug: 'nuts',
    name: 'Nuts (raw or roasted)',
    category: 'Pantry Staples',
    pantry: { unopened: '6 months', opened: '1–3 months' },
    fridge: { opened: '6 months' },
    freezer: { time: '12 months' },
    spoilageSigns: ['Rancid/paint-like smell', 'Bitter taste', 'Mold'],
  },
  {
    slug: 'cooking-oil',
    name: 'Cooking oil (olive, vegetable)',
    category: 'Pantry Staples',
    pantry: { unopened: '2 years', opened: '6 months', note: 'Dark, cool spot. Olive oil: 1 year unopened.' },
    spoilageSigns: ['Rancid/crayon smell', 'Bitter or harsh taste', 'Cloudy at room temp (olive — normal if cold)'],
  },

  // ===== CONDIMENTS & SAUCES =====
  {
    slug: 'ketchup',
    name: 'Ketchup',
    category: 'Condiments & Sauces',
    pantry: { unopened: '1 year past date', opened: '1 month', note: 'Fridge after opening — acid + sugar resist spoilage but flavor degrades.' },
    fridge: { opened: '6 months' },
    spoilageSigns: ['Dark brown color', 'Mold near cap', 'Fermented smell'],
  },
  {
    slug: 'mayo',
    name: 'Mayonnaise',
    category: 'Condiments & Sauces',
    pantry: { unopened: '3–4 months past date' },
    fridge: { opened: '2 months', note: 'Always fridge after opening. Egg-based — discard if left out >2 hours.' },
    spoilageSigns: ['Yellow tint deepening', 'Oily separation', 'Sour or rancid smell'],
  },
  {
    slug: 'mustard',
    name: 'Mustard',
    category: 'Condiments & Sauces',
    pantry: { unopened: '2 years' },
    fridge: { opened: '1 year', note: 'Will not spoil for safety, but flavor mellows.' },
    spoilageSigns: ['Dried out top layer', 'Mold (rare)', 'Off smell'],
  },
  {
    slug: 'soy-sauce',
    name: 'Soy sauce',
    category: 'Condiments & Sauces',
    pantry: { unopened: '2–3 years', opened: '1 month' },
    fridge: { opened: '1 year', note: 'High salt = nearly indestructible. Color darkens over time.' },
    spoilageSigns: ['Mold (extremely rare)', 'Cloudy', 'Off taste'],
  },
  {
    slug: 'hot-sauce',
    name: 'Hot sauce',
    category: 'Condiments & Sauces',
    pantry: { unopened: '2 years', opened: '6 months' },
    fridge: { opened: '5 years', note: 'Vinegar + capsaicin = preservatives. Fridge keeps color brighter.' },
    spoilageSigns: ['Brown tint deepening (still safe)', 'Fermented bubbling', 'Mold near cap'],
  },
  {
    slug: 'jam',
    name: 'Jam / jelly / preserves',
    category: 'Condiments & Sauces',
    pantry: { unopened: '1 year' },
    fridge: { opened: '6–12 months', note: 'Use clean spoon — no double-dipping with butter knife.' },
    spoilageSigns: ['Mold on top — discard whole jar (high-sugar mold sends roots deep)', 'Yeasty bubbling', 'Off smell'],
  },
  {
    slug: 'peanut-butter',
    name: 'Peanut butter',
    category: 'Condiments & Sauces',
    pantry: { unopened: '6–9 months past date', opened: '2–3 months' },
    fridge: { opened: '6–9 months', note: 'Natural (no preservatives): fridge to prevent oil rancidity.' },
    spoilageSigns: ['Rancid smell', 'Hard top layer', 'Mold (rare)'],
  },

  // ===== BAKERY & GRAINS =====
  {
    slug: 'bread-sliced',
    name: 'Sliced bread (store-bought)',
    category: 'Bakery & Grains',
    pantry: { opened: '5–7 days' },
    fridge: { opened: '1–2 weeks', note: 'Fridge dries bread fast — only for very humid climates.' },
    freezer: { time: '3 months', note: 'Slice first. Toast straight from frozen.' },
    spoilageSigns: ['Green/black/white mold spots (discard entire loaf)', 'Stale/hard texture', 'Yeasty sour smell'],
  },
  {
    slug: 'bread-artisan',
    name: 'Artisan / sourdough bread',
    category: 'Bakery & Grains',
    pantry: { opened: '3–4 days', note: 'Cut-side down on cutting board, or paper bag.' },
    freezer: { time: '3 months' },
    spoilageSigns: ['Mold', 'Very dry/hard throughout'],
  },
  {
    slug: 'bagels',
    name: 'Bagels',
    category: 'Bakery & Grains',
    pantry: { opened: '5–7 days' },
    freezer: { time: '3 months', note: 'Pre-slice before freezing.' },
    spoilageSigns: ['Mold', 'Hard/stale (revive with damp paper towel + 10s microwave)'],
  },
  {
    slug: 'tortillas',
    name: 'Tortillas (flour or corn)',
    category: 'Bakery & Grains',
    pantry: { opened: '7 days' },
    fridge: { opened: '3–4 weeks' },
    freezer: { time: '6–8 months' },
    spoilageSigns: ['Mold', 'Stiff/cracking', 'Off smell'],
  },

  // ===== LEFTOVERS & COOKED =====
  {
    slug: 'leftovers-cooked-meat',
    name: 'Cooked meat / poultry leftovers',
    category: 'Leftovers & Cooked',
    fridge: { opened: '3–4 days', note: 'Cool to room temp within 2 hours of cooking, then fridge. Shallow container.' },
    freezer: { time: '2–3 months' },
    spoilageSigns: ['Slimy texture', 'Sour or off smell', 'Color change', 'Mold'],
    reheating: 'Heat to 165°F (74°C) internal. Reheat once only.',
  },
  {
    slug: 'cooked-rice',
    name: 'Cooked rice',
    category: 'Leftovers & Cooked',
    fridge: { opened: '3–4 days', note: 'Cool within 1 hour — Bacillus cereus risk if left at room temp.' },
    freezer: { time: '6 months', note: 'Portion before freezing.' },
    spoilageSigns: ['Hard/dried out (still safe)', 'Off smell', 'Slimy texture', 'Mold'],
    reheating: 'Steam or microwave with a splash of water to steaming hot. Reheat once only.',
  },
  {
    slug: 'cooked-pasta',
    name: 'Cooked pasta',
    category: 'Leftovers & Cooked',
    fridge: { opened: '3–5 days' },
    freezer: { time: '2 months' },
    spoilageSigns: ['Slimy', 'Sour smell', 'Mold'],
  },
  {
    slug: 'soup-stew',
    name: 'Soup / stew / curry',
    category: 'Leftovers & Cooked',
    fridge: { opened: '3–4 days', note: 'Cool quickly in shallow container. Cream-based: 2 days max.' },
    freezer: { time: '2–3 months' },
    spoilageSigns: ['Bubbling at room temp', 'Off smell', 'Mold on surface'],
    reheating: 'Bring to rolling boil for 1 minute. Stir to even out heat.',
  },
  {
    slug: 'pizza',
    name: 'Pizza (cooked)',
    category: 'Leftovers & Cooked',
    fridge: { opened: '3–4 days' },
    freezer: { time: '2 months' },
    spoilageSigns: ['Mold on cheese or crust', 'Slimy toppings', 'Sour smell'],
    reheating: 'Skillet on medium-low 5 min covered — best method. Or oven 375°F, 8 min.',
  },

  // ===== BEVERAGES =====
  {
    slug: 'juice',
    name: 'Juice (fridge-section, opened)',
    category: 'Beverages',
    fridge: { unopened: '3 weeks past date', opened: '7–10 days' },
    freezer: { time: '8–12 months', note: 'Leave headspace — liquids expand.' },
    spoilageSigns: ['Carbonation/fizzing (fermenting)', 'Off color', 'Yeasty smell'],
  },
  {
    slug: 'wine-opened',
    name: 'Wine (opened)',
    category: 'Beverages',
    pantry: { opened: '1–2 days red, cool dark' },
    fridge: { opened: 'Red 3–5 days · white 3–5 days · sparkling 1–3 days', note: 'Re-cork or vacuum stopper. Sparkling: special stopper.' },
    spoilageSigns: ['Vinegar smell', 'Brown color (white wine)', 'Flat (sparkling)'],
  },
  {
    slug: 'coffee-ground',
    name: 'Ground coffee',
    category: 'Beverages',
    pantry: { unopened: '3–5 months', opened: '1–2 weeks for peak flavor' },
    freezer: { time: '6 months', note: 'Airtight bag. Removes from freezer in portions to avoid condensation.' },
    spoilageSigns: ['Stale/flat flavor', 'Mold (rare unless wet)', 'Rancid smell'],
  },
  {
    slug: 'tea-bags',
    name: 'Tea (bags or loose)',
    category: 'Beverages',
    pantry: { unopened: '2 years', opened: '1 year', note: 'Cool, dark, away from spices.' },
    spoilageSigns: ['No aroma when bag opened', 'Musty smell', 'Mold (only if exposed to moisture)'],
  },
];

export function findStorageItem(query: string): StorageItem | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    STORAGE_ITEMS.find((i) => i.slug === q) ??
    STORAGE_ITEMS.find((i) => i.name.toLowerCase() === q) ??
    null
  );
}

export function searchStorageItems(query: string, limit = 20): StorageItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  type Scored = { item: StorageItem; score: number };
  const scored: Scored[] = [];
  for (const item of STORAGE_ITEMS) {
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
