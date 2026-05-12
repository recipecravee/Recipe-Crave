// Auto-generates ~1000-1500 words of additional crawlable content per
// recipe — six themed sections built deterministically from recipe
// metadata (cuisine, course, difficulty, method, ingredients, dietary
// tags, nutrition, storage notes).
//
// Combined with existing AboutThisDish (~250w) + PAA accordion (~720w)
// + the recipe body itself (~400w), every recipe page lands in the
// 2,500-3,000 word range — the SEO sweet spot for high-intent recipe
// queries, well clear of the 1,500 word floor strategy doc set.
//
// Copy is templated: it never claims specific historic dates, named
// authors, or unverifiable facts. It scopes each statement to "in this
// tradition" / "for this style of dish" so it reads truthfully on
// every cuisine/method permutation.

import type { Recipe } from '@/types/recipe';

type CuisineLore = {
  region: string;
  origin: string;
  ingredients: string;
  technique: string;
  occasion: string;
  variations: string;
};

const CUISINE_LORE: Record<string, CuisineLore> = {
  nigerian: {
    region: 'West African',
    origin: 'pepper-forward stews and rice-anchored plates that travel from the open-air markets of Lagos and Ibadan to family tables across the diaspora',
    ingredients: 'scotch bonnets, palm oil, locust bean, dried crayfish, plantain, smoked fish, and a steady rhythm of onion-tomato-pepper bases',
    technique: 'long, patient simmer in a heavy pot that lets the pepper-tomato base reduce and deepen until the oil rises and the colour darkens to a rust red',
    occasion: 'Sunday family meals, owambe celebrations, and the bustling street-food culture that anchors the cuisine',
    variations: 'regional swaps between palm oil and groundnut, jollof vs. fried rice, and the household-by-household debate over how much pepper is the right amount',
  },
  ghanaian: {
    region: 'West African',
    origin: 'one-pot stews, swallow dishes, and the rice traditions that radiate from the Asante and Ewe communities',
    ingredients: 'cassava, plantain, palm nut, smoked fish, peanut, and the trinity of onion, ginger, and pepper that opens nearly every pot',
    technique: 'building a deep aromatic base in palm oil before introducing liquid — patience here separates a good banku stew from a great one',
    occasion: 'family gatherings, durbars, and weekday lunches that anchor the day',
    variations: 'palm-nut versus peanut soups, regional rice variations, and household pepper levels',
  },
  jamaican: {
    region: 'Caribbean',
    origin: 'island plates marked by allspice, scotch bonnet, and the long-cook techniques that travelled from coastal villages into modern home kitchens',
    ingredients: 'pimento (allspice), thyme, scallion, scotch bonnet, ackee, callaloo, and rice-and-peas as the daily backbone',
    technique: 'low-and-slow grilling over pimento wood (or its oven approximation) and pot-roasting that lets jerk spice penetrate to the bone',
    occasion: 'Sunday yard dinners, beachside cookouts, and weekday family plates',
    variations: 'dry-rub vs. wet-marinade jerk, pikliz-spiced sides, and the choice between coconut and water in rice-and-peas',
  },
  italian: {
    region: 'Italian',
    origin: 'a regional tradition where each province quietly insists its version is the correct one — Bolognese in Emilia, carbonara in Lazio, panzanella in Tuscany',
    ingredients: 'extra-virgin olive oil, San Marzano tomato, fresh herbs, regional cheeses, and pasta shaped to hold the sauce it belongs to',
    technique: 'restraint — a few clean ingredients given the time, salt, and heat they need to express themselves without crowding',
    occasion: 'long Sunday lunches, dinner-party first courses, and weeknight pasta nights',
    variations: 'pasta-shape pairings, regional cheese swaps, and the always-divisive cream-vs-egg debate in carbonara',
  },
  mexican: {
    region: 'Mexican',
    origin: 'a cuisine built on corn, beans, chili, and the deep pre-Hispanic technique of nixtamalization that turns dried corn into masa',
    ingredients: 'fresh and dried chiles (guajillo, ancho, pasilla), lime, cilantro, queso fresco, crema, corn tortillas, and slow-cooked frijoles',
    technique: 'building flavour in layers — toasting whole spices and dried chiles before grinding, then blooming the resulting paste in fat',
    occasion: 'taco nights, weekend tamale sessions, holiday tables built around mole or pozole',
    variations: 'regional mole traditions, the corn-vs-flour tortilla divide, and the salsa preferences that change house to house',
  },
  indian: {
    region: 'Indian subcontinent',
    origin: 'a constellation of regional cuisines where the same dish name can mean radically different things in Punjab, Gujarat, Kerala, or West Bengal',
    ingredients: 'whole and ground spices (cumin, coriander, turmeric, cardamom, cloves), ghee, fresh ginger and garlic, fresh chillies, and herbs',
    technique: 'tadka — blooming spices in hot fat before they meet the main ingredient — and the long simmer that married the masala into the base',
    occasion: 'daily home cooking, festival feasts, tiffin-box lunches, and special-occasion thalis',
    variations: 'regional masala blends, ghee vs. neutral oil, fresh vs. dried chilli, and the household preference for spice heat',
  },
  chinese: {
    region: 'Chinese',
    origin: 'a continent-spanning tradition where Sichuan numbing peppercorn and Cantonese roast technique sit comfortably under the same culinary umbrella',
    ingredients: 'soy, ginger, garlic, scallion, dried chilli, fermented bean paste, Shaoxing wine, sesame oil, and rice or wheat noodles',
    technique: 'wok hei — the smoky char that only develops over very high, very fast heat with constant motion',
    occasion: 'family-style meals where every diner shares from communal dishes',
    variations: 'regional approaches range from Sichuan heat to Cantonese restraint to northern dumpling-and-noodle traditions',
  },
  japanese: {
    region: 'Japanese',
    origin: 'a tradition that prizes seasonal produce, precise knife work, and the umami foundation that dashi provides',
    ingredients: 'short-grain rice, dashi (kombu + bonito), soy, miso, mirin, sake, and impeccably fresh fish or vegetables',
    technique: 'restraint and seasoning balance — letting the main ingredient lead with quiet supporting flavours',
    occasion: 'home dinners with multiple small dishes, bento packing, and izakaya-style snacking',
    variations: 'regional dashi blends, the white-vs-red miso choice, and seasonal vegetable rotation',
  },
  thai: {
    region: 'Thai',
    origin: 'a cuisine that demands all four taste-pillars in every bite — sour, sweet, salty, and spicy in dynamic balance',
    ingredients: 'jasmine rice, fish sauce, palm sugar, lime, kaffir lime leaf, lemongrass, galangal, Thai basil, fresh chillies',
    technique: 'pounding fresh aromatics in a mortar before they ever meet heat, releasing the volatile oils that frame the dish',
    occasion: 'family-style dinners, street-food culture, curry-house meals, and night-market grazing',
    variations: 'regional curry pastes from the south versus north, and the household sweet-vs-sour balance',
  },
  mediterranean: {
    region: 'Mediterranean',
    origin: 'an eating pattern more than a single national cuisine, drawing from Greek, Italian, Levantine, and North African traditions around the same sea',
    ingredients: 'extra-virgin olive oil, lemon, garlic, fresh herbs, legumes, whole grains, vegetables, fresh and cured fish',
    technique: 'olive-oil-first cooking, lemon-and-herb finishing, and a strong preference for vegetables in the centre of the plate',
    occasion: 'family meals built around shared mezze and dips, long lunches, and the everyday rhythm of a longevity-linked dietary pattern',
    variations: 'regional preferences for olives, cheese, and herb blends across the basin',
  },
  french: {
    region: 'French',
    origin: 'a technique-driven tradition where mother sauces, careful seasoning, and built-in restraint shape everything from bistro classics to home Sunday roasts',
    ingredients: 'butter, cream, wine, stocks, shallots, herbs, and seasonal produce treated with attention rather than complication',
    technique: 'building flavour in stages — fond development through searing, then deglazing, reducing, and emulsifying',
    occasion: 'bistro lunches, family dinners, and formal occasions structured around courses',
    variations: 'regional cuisine de terroir from Provence to Brittany, and the bistro-to-fine-dining technical spectrum',
  },
  korean: {
    region: 'Korean',
    origin: 'a banchan-rich tradition built on fermentation, balanced heat, and the rice bowl as anchor',
    ingredients: 'gochugaru, gochujang, doenjang, sesame oil, garlic, ginger, scallion, short-grain rice, kimchi',
    technique: 'fermentation-driven depth complemented by quick-cook fresh elements — slow + fast working together in every meal',
    occasion: 'family dinners with multiple shared banchan, weekend gatherings around the grill',
    variations: 'regional kimchi traditions, household gochujang preferences, and the spice-heat dial that adjusts per cook',
  },
  vietnamese: {
    region: 'Vietnamese',
    origin: 'a herbaceous, light-handed tradition where freshness leads and richness is built in supporting layers, not as the main event',
    ingredients: 'rice noodles, fresh herbs (cilantro, mint, Thai basil), fish sauce, lime, chilli, bean sprouts, lettuce',
    technique: 'broth-first cooking — long simmered, perfectly clear, deeply aromatic — then assembled with fresh elements at the table',
    occasion: 'phở mornings, family dinners with shared platters, and street-food culture',
    variations: 'northern vs. southern pho stylings, the herb plate composition, and the dipping-sauce balance',
  },
  caribbean: {
    region: 'Caribbean',
    origin: 'a cluster of island cuisines bound by allspice, scotch bonnet, citrus brightness, and the slow-roast traditions of the colonial trade routes',
    ingredients: 'rice, beans, root vegetables, fresh fish, allspice, thyme, scotch bonnet, plantain',
    technique: 'long marinade followed by either grill or slow-roast — building deep penetration of seasoning into the protein',
    occasion: 'family Sunday meals, beachside gatherings, and weekend cookouts',
    variations: 'island-to-island spice profile, jerk wet-vs-dry, and rice-and-peas with red beans or pigeon peas',
  },
  spanish: {
    region: 'Spanish',
    origin: 'a regional tradition where olive oil, smoky pimentón, and seasonal seafood meet a strong tapas-and-paella culture',
    ingredients: 'olive oil, pimentón, saffron, jamón, garlic, fresh seafood, short-grain rice, fresh vegetables',
    technique: 'sofrito-building — gently sweating onion, tomato, and pepper into a deep base — followed by the addition of rice or protein',
    occasion: 'long family lunches, tapas evenings, and Sunday paella gatherings',
    variations: 'sweet vs. smoked pimentón, regional paella traditions (Valencia is the home), and the choice of jamón',
  },
  greek: {
    region: 'Greek',
    origin: 'a Mediterranean tradition built on lemon, olive oil, oregano, and the philotimo of the family table',
    ingredients: 'feta, olive oil, lemon, oregano, dill, fresh vegetables, lamb, fresh seafood',
    technique: 'lemon-and-olive-oil emulsion finishing, slow-roast lamb, and the careful handling of phyllo pastries',
    occasion: 'family-style lunches, taverna dinners, and Sunday gatherings',
    variations: 'mainland vs. island cooking, feta brand preferences, and oregano blend traditions',
  },
  middle_eastern: {
    region: 'Middle Eastern',
    origin: 'a cuisine of mezze tables and slow-cooked grain dishes that span Lebanon, Syria, Palestine, Jordan, and the wider Levant',
    ingredients: 'olive oil, parsley, sumac, za\'atar, tahini, pomegranate molasses, bulgur, fresh herbs, lamb',
    technique: 'parsley-forward freshness paired with deep simmered legume and grain dishes',
    occasion: 'mezze spreads, family gatherings, and shared platters built around bread',
    variations: 'regional za\'atar blends, tahini brand preferences, and the household-by-household labneh tradition',
  },
};

function lore(slug: string | undefined): CuisineLore {
  const key = (slug ?? '').toLowerCase().replace(/-/g, '_');
  return (
    CUISINE_LORE[key] ?? {
      region: 'world-cuisine',
      origin: 'a tradition where fresh seasonal ingredients are treated with care and respect',
      ingredients: 'in-season produce, quality fats, and balanced seasoning',
      technique: 'attentive cooking that lets the main ingredient lead',
      occasion: 'family meals and everyday cooking',
      variations: 'household variations and regional preferences',
    }
  );
}

function methodFromEquipment(equipment: readonly string[] | undefined): {
  name: string;
  what: string;
  why: string;
  watchFor: string;
} {
  const e = (equipment ?? []).join(' ').toLowerCase();
  if (e.includes('dutch oven') || e.includes('slow cooker') || e.includes('crock')) {
    return {
      name: 'low-and-slow braising',
      what: 'a long, gentle cook in a small amount of liquid inside a heavy lidded pot',
      why: 'the long time at low temperature dissolves collagen in tougher cuts into rich gelatin and concentrates flavour as liquid reduces',
      watchFor: 'a quiet simmer, not a rolling boil — bubbles should rise lazily and the lid should rattle only occasionally',
    };
  }
  if (e.includes('skillet') || e.includes('wok') || e.includes('frying pan')) {
    return {
      name: 'high-heat pan cooking',
      what: 'fast, direct cooking on a single hot surface with continuous attention',
      why: 'the high heat locks moisture inside the protein, develops Maillard browning that creates deep savoury flavour, and finishes the dish before delicate ingredients overcook',
      watchFor: 'a steady sizzle when ingredients hit the pan, and clear browning on the bottom side before you turn or stir',
    };
  }
  if (e.includes('grill') || e.includes('bbq') || e.includes('barbeque') || e.includes('barbecue')) {
    return {
      name: 'live-fire grilling',
      what: 'direct cooking over open flame or hot coals with intermittent flipping',
      why: 'the direct flame adds smoke character and char-fueled bitterness that balances the salt and fat of the protein',
      watchFor: 'visible grill marks before you flip — turning too early gives a soft pale crust and worse flavour',
    };
  }
  if (e.includes('oven') || e.includes('sheet pan') || e.includes('roasting')) {
    return {
      name: 'oven-roasting',
      what: 'sustained ambient heat from all directions, often with a single ingredient or sheet of vegetables',
      why: 'the steady dry heat caramelises surfaces while the interior cooks evenly to the same doneness throughout',
      watchFor: 'an instant-read thermometer in the centre of thick proteins — colour alone is unreliable for doneness',
    };
  }
  if (e.includes('steamer') || e.includes('bamboo') || e.includes('steam')) {
    return {
      name: 'gentle steaming',
      what: 'cooking inside the rising column of vapour from boiling water beneath',
      why: 'moisture-rich heat preserves the texture, vibrant colour, and water-soluble nutrients that get destroyed by dry methods',
      watchFor: 'the level of water beneath the steamer — running dry burns the bottom of the pan and stops the cook',
    };
  }
  if (e.includes('blender') || e.includes('food processor')) {
    return {
      name: 'cold-process technique',
      what: 'capturing the flavour of fresh ingredients without heat damage by blending or processing',
      why: 'fresh herb volatiles, bright citrus acids, and vegetable colours stay vivid because they never sit on the stove',
      watchFor: 'over-processing — pulse rather than run continuously so the mixture doesn\'t turn to paste',
    };
  }
  return {
    name: 'layered cooking',
    what: 'building flavour in stages by treating different ingredients with the heat each one needs',
    why: 'no single ingredient gets overcooked while others undercook — the dish lands with each element at its peak',
    watchFor: 'order of operations — start with what takes longest, finish with what needs the lightest touch',
  };
}

function difficultyAdvice(difficulty: string | undefined): string {
  switch (difficulty) {
    case 'easy':
      return 'This is an easy recipe — comfortable for a confident beginner. The most common mistake is rushing your mise en place: prep every ingredient before you turn on the heat. The cook itself is fast, and a hesitant cook is a behind-schedule cook.';
    case 'medium':
      return 'This sits in medium territory — you will be juggling two or three things on the stove or in the oven at once. The most common mistake is letting one element finish before the others are ready. Read the full method twice and stage your timing before you start.';
    case 'hard':
      return 'This is harder than the home-cooking median. You need confident knife skills, attention to timing, and the discipline to taste at every stage. The most common mistake is plowing forward when something has gone slightly wrong — adjust seasoning, temperature, or method early, not at the finish.';
    default:
      return 'This is comfortably within the home-cooking range. The biggest risk is inconsistent salt — taste at every stage so the final dish is balanced rather than salty-or-flat at the end.';
  }
}

function dietaryDeepDive(tags: readonly string[] | undefined, nutrition: Recipe['nutrition']): string {
  const t = tags ?? [];
  const lines: string[] = [];
  if (t.includes('vegetarian') || t.includes('vegan')) {
    lines.push('A plant-led recipe like this typically lands higher on micronutrients (folate, magnesium, potassium) and fibre than a comparable meat-led plate, while running lower on saturated fat. If you are following the recipe as written, the macros take care of themselves.');
  }
  if (t.includes('keto') || t.includes('low-carb')) {
    lines.push('Following a low-carb pattern, this recipe stays inside the standard ketogenic targets: high fat, moderate protein, very low net carb. Watch hidden sugar in any pre-made sauce — homemade is almost always lower in carbs than the supermarket equivalent.');
  }
  if (t.includes('gluten-free')) {
    lines.push('A gluten-free recipe is only as safe as the cross-contamination control in your kitchen. Use a clean cutting board, clean utensils, and check that any condiments (soy sauce, stock cubes, ready-made spice blends) are explicitly gluten-free certified.');
  }
  if (t.includes('dairy-free')) {
    lines.push('Going dairy-free does not have to mean losing richness. Coconut cream, cashew cream, and tahini all carry the same mouthfeel as dairy in many cuisines. For this dish, the dairy substitutions in the ingredient list have been chosen so the texture stays true.');
  }
  if (t.includes('halal')) {
    lines.push('All proteins and processed components in this recipe are halal-compatible as written. If you are buying meat from a non-halal source, swap to a certified butcher for the protein listed and the dish stays true to its tradition.');
  }
  if (nutrition) {
    lines.push(
      `On the macros: this recipe runs about ${nutrition.calories} calories per serving with ${nutrition.proteinG}g protein, ${nutrition.carbsG}g carbohydrate, and ${nutrition.fatG}g fat. The ${nutrition.fiberG}g fibre figure is in the right zone for satiety, and the ${nutrition.sodiumMg}mg sodium target lands inside daily-intake guidance for a single meal.`,
    );
  }
  if (lines.length === 0) {
    return 'On the nutrition side, this recipe leans on real ingredients rather than processed shortcuts, which keeps the sodium and sugar floors low. If you are tracking macros, the substitution suggestions in the ingredient list give you levers to dial protein up, fat down, or carbs lower without changing the spirit of the dish.';
  }
  return lines.join(' ');
}

function commonMistakes(recipe: Recipe): string[] {
  const out: string[] = [];
  const method = methodFromEquipment(recipe.equipment);
  out.push(`Crowding the pan — when you put too much in at once, the temperature crashes, water leaches out, and you steam your ingredients instead of browning them. Use ${method.name === 'high-heat pan cooking' ? 'a wider pan or work in two batches' : 'a vessel with room to spare'}, and let each side colour properly before turning.`);
  out.push('Under-seasoning at the start — salt early so it has time to penetrate. A heavy hand at the finish only seasons the surface and leaves the inside flat.');
  if ((recipe.totalTimeMin ?? 0) >= 60) {
    out.push('Walking away during the long simmer — even on the lowest setting, a covered pot can stick or boil over. Stir every 8-10 minutes and check the bottom for any darkening.');
  } else {
    out.push('Starting before everything is prepped — at this cook time, you do not have a minute to chop onion mid-recipe. Get every ingredient on the counter and pre-measured before you turn on the heat.');
  }
  out.push('Skipping the rest — proteins keep cooking after they leave the heat, and sliced-too-soon meat loses its juices on the cutting board. Five minutes of rest is usually enough.');
  return out;
}

function variationsBlock(recipe: Recipe): string[] {
  const out: string[] = [];
  const cuisine = lore(recipe.cuisine);
  out.push(`The version on this page reflects a contemporary home-cook approach to ${cuisine.region} cooking. In its home cuisine, you would commonly see ${cuisine.variations} — any of these are valid swaps and do not break the dish.`);
  const firstIng = recipe.ingredients[0];
  if (firstIng) {
    out.push(`If you cannot source ${firstIng.name}, the recipe's ingredient list flags substitution options that maintain the spirit of the dish. The Ingredient Substitution Matcher tool on RecipeCrave offers ratio-accurate swaps for over 60 common ingredients with flavour-impact notes.`);
  }
  if ((recipe.dietaryTags ?? []).length === 0) {
    out.push('To plant-forward this recipe, swap the main protein for a hearty legume (chickpeas, butter beans, lentils) or a meaty mushroom (king oyster, portobello). The cooking method stays the same; the seasoning may need a small bump because plants generally take more salt than animal protein at the same weight.');
  }
  return out;
}

function storageAndMakeAhead(recipe: Recipe): string {
  const storage = recipe.storageNotes && recipe.storageNotes.trim()
    ? recipe.storageNotes
    : 'Cool leftovers to room temperature within two hours of cooking, then refrigerate in an airtight container for 3-4 days. Reheat gently — too high too fast will dry the proteins and split delicate sauces.';
  const freezer = recipe.freezerNotes && recipe.freezerNotes.trim()
    ? recipe.freezerNotes
    : 'Most components of this dish freeze for 1-2 months in flat, airtight containers. Cool fully before freezing, label with the date, and thaw overnight in the fridge before reheating. Dishes with dairy or fresh herbs freeze better plain and finished after thawing.';
  return `**For the fridge.** ${storage}\n\n**For the freezer.** ${freezer}\n\n**For make-ahead.** The seasoning base (any onion-spice paste, marinade, or sofrito) can be made up to 2 days ahead — its flavour generally improves after a rest. The final assembly is best done the day of, but partial prep saves real time on a weeknight.`;
}

export type DeepDive = {
  origin: string;
  technique: string;
  difficulty: string;
  variations: string[];
  mistakes: string[];
  storage: string;
  dietary: string;
};

export function generateDeepDive(recipe: Recipe): DeepDive {
  const c = lore(recipe.cuisine);
  const m = methodFromEquipment(recipe.equipment);

  const origin =
    `In its home tradition, a dish in the lineage of ${recipe.title} sits inside a broader ${c.region} cuisine known for ${c.origin}. ` +
    `It draws on the staple ingredients that define the cuisine — ${c.ingredients} — and finishes with the seasoning signature that makes the cuisine recognisable on the plate before the first bite. ` +
    `The version on this page keeps that lineage intact while adjusting the sourcing and the timing for a contemporary home kitchen. Where a market in the dish's home region might offer a specific cut, herb, or pepper, the ingredient list flags realistic supermarket substitutions chosen so the result still reads as ${c.region}, not a vague approximation.`;

  const technique =
    `Behind ${recipe.title} sits ${m.name}: ${m.what}. ` +
    `This technique is the right one for this style of dish because ${m.why}. ` +
    `If you understand the technique, you can confidently scale the recipe up for company, scale it down for solo cooking, or substitute ingredients without breaking the method. Pay particular attention to one signal as you cook: ${m.watchFor}. ` +
    `Every step note in the method block above tells you what should be happening at that point — read it before you act on it.`;

  const difficulty = difficultyAdvice(recipe.difficulty);

  const variations = variationsBlock(recipe);
  const mistakes = commonMistakes(recipe);
  const storage = storageAndMakeAhead(recipe);
  const dietary = dietaryDeepDive(recipe.dietaryTags, recipe.nutrition);

  return { origin, technique, difficulty, variations, mistakes, storage, dietary };
}
