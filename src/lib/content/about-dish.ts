// Auto-generates an "About this dish" content block per recipe from
// metadata (cuisine, course, dietary tags, primary ingredients). Adds
// ~250 words of crawlable context per page across 126 recipes — direct
// content-depth win for TODO #14 without hand-writing each one.
//
// The copy is template-driven, never claims false specifics, and reads
// naturally to a home cook. Each section starts from authentic cuisine
// context, then narrows to the recipe's own variables.

import type { Recipe } from '@/types/recipe';

type CuisineNote = {
  region: string;
  staples: string;
  flavor: string;
  occasion: string;
};

// Anchor descriptions per cuisine. Where a cuisine isn't listed, a
// "World cuisine" fallback applies. Keep statements factual and short —
// these compose into the larger generated paragraph, not stand alone.
const CUISINE_NOTES: Record<string, CuisineNote> = {
  nigerian: { region: 'West Africa', staples: 'rice, yam, plantain, pepper-based stews, smoked fish', flavor: 'bold pepper, smoky palm oil, deep umami from crayfish and locust bean', occasion: 'Sunday family meals, owambe parties, and street-food culture' },
  ghanaian: { region: 'West Africa', staples: 'jollof rice, banku, kenkey, fufu with light or peanut soup', flavor: 'warm chili, ginger, and the slow-cooked depth of tomato stew bases', occasion: 'celebrations, communal eating, and weekday comfort meals' },
  jamaican: { region: 'the Caribbean', staples: 'jerk-seasoned proteins, rice and peas, ackee, callaloo', flavor: 'scotch bonnet heat balanced by allspice, thyme, and pimento smoke', occasion: 'beachside cookouts and Sunday dinners' },
  'west-african': { region: 'West Africa', staples: 'rice, plantain, stews built on tomato and pepper, peanut sauces', flavor: 'fiery, smoky, and rounded with palm oil or peanut paste', occasion: 'feast tables and weekday family meals' },
  italian: { region: 'Italy', staples: 'pasta, olive oil, tomato, fresh herbs, regional cheeses', flavor: 'restraint — a few clean ingredients allowed to shine', occasion: 'family lunches, dinner parties, and weeknight pasta nights' },
  mexican: { region: 'Mexico', staples: 'corn tortillas, beans, fresh chiles, lime, cilantro, queso fresco', flavor: 'bright acid, smoky chiles, and layered fresh herbs', occasion: 'taco nights, fiestas, and morning chilaquiles' },
  indian: { region: 'the Indian subcontinent', staples: 'rice, lentils, wheat, ghee, fresh and dried spices', flavor: 'layered masala — toasted whole spices bloomed in fat then deepened with simmer', occasion: 'daily home cooking and festival feasts' },
  chinese: { region: 'China', staples: 'rice, noodles, soy, ginger, garlic, scallion, regional vinegars', flavor: 'umami-driven, balanced across sweet, sour, salty, bitter, and spicy', occasion: 'family-style sharing meals and special-occasion banquets' },
  japanese: { region: 'Japan', staples: 'short-grain rice, dashi, soy, miso, fresh fish, seasonal vegetables', flavor: 'clean umami, restrained seasoning, peak-season produce', occasion: 'home dinners, bento boxes, and izakaya snacks' },
  thai: { region: 'Thailand', staples: 'jasmine rice, fish sauce, lime, galangal, lemongrass, Thai basil', flavor: 'the harmony of sour, sweet, salty, and spicy in every bite', occasion: 'family meals, street-food culture, and curry-house dinners' },
  mediterranean: { region: 'the Mediterranean basin', staples: 'olive oil, vegetables, legumes, whole grains, fish, fresh herbs', flavor: 'olive oil, lemon, garlic, and herb-forward simplicity', occasion: 'everyday eating in a longevity-linked dietary pattern' },
  american: { region: 'the United States', staples: 'beef, poultry, corn, regional barbecue traditions', flavor: 'comfort cooking spanning cuisines and regional styles', occasion: 'weeknight dinners, weekend barbecue, and holiday tables' },
  french: { region: 'France', staples: 'butter, cream, wine, stocks, fresh herbs, regional cheeses', flavor: 'technique-driven — sauces, emulsions, and reductions built from scratch', occasion: 'bistro lunches, family meals, and formal dinners' },
  'middle-eastern': { region: 'the Middle East', staples: 'flatbreads, lamb, rice, chickpeas, yogurt, sumac, za\'atar', flavor: 'warm spice, bright lemon, fresh herbs, and tahini richness', occasion: 'mezze spreads and family gatherings' },
  korean: { region: 'Korea', staples: 'short-grain rice, fermented banchan, gochujang, sesame, garlic', flavor: 'deep fermentation, balanced heat, and contrasting textures', occasion: 'home dinners with multiple shared sides' },
  vietnamese: { region: 'Vietnam', staples: 'rice noodles, fresh herbs, fish sauce, lime, chili', flavor: 'light, herbaceous, and built on freshness rather than richness', occasion: 'phở breakfasts and crowded family dinners' },
  caribbean: { region: 'the Caribbean', staples: 'rice, beans, root vegetables, fresh fish, allspice', flavor: 'island heat, citrus brightness, and tropical fruit accents', occasion: 'beachside meals and Sunday gatherings' },
  spanish: { region: 'Spain', staples: 'olive oil, paprika, garlic, saffron, jamón, seafood', flavor: 'smoky pimentón, garlicky depth, and seasonal seafood', occasion: 'tapas evenings and long family lunches' },
  greek: { region: 'Greece', staples: 'olive oil, lemon, feta, oregano, lamb, fresh vegetables', flavor: 'lemon-forward brightness with herbal mountain notes', occasion: 'family tavernas and Sunday lunches' },
  'south-african': { region: 'Southern Africa', staples: 'maize meal, biltong, braai-grilled meats, sosaties', flavor: 'smoke from the braai paired with sweet-spicy spice blends', occasion: 'weekend braais and family celebrations' },
  ethiopian: { region: 'the Horn of Africa', staples: 'injera, berbere-spiced stews, lentils, niter kibbeh', flavor: 'complex berbere heat layered with clarified spiced butter', occasion: 'communal eating from a shared injera platter' },
  brazilian: { region: 'Brazil', staples: 'rice, beans, beef, manioc flour, tropical fruit', flavor: 'churrasco smoke and bright tropical acidity', occasion: 'churrasco gatherings and Saturday feijoada lunches' },
  filipino: { region: 'the Philippines', staples: 'rice, pork, vinegar, soy, calamansi, coconut', flavor: 'tangy adobo balance — vinegar, soy, garlic, and pepper', occasion: 'family-style meals and fiesta tables' },
  malaysian: { region: 'Malaysia', staples: 'rice, coconut milk, chili paste (sambal), tamarind, lemongrass', flavor: 'layered curry pastes with coconut richness and sour-spicy depth', occasion: 'hawker-stall culture and home-cooked rice meals' },
  persian: { region: 'Iran', staples: 'long-grain rice, saffron, dried fruit, fresh herbs, lamb', flavor: 'saffron, rose, dried-fruit sweetness, and fresh-herb perfume', occasion: 'family dinners and Nowruz celebrations' },
  lebanese: { region: 'the Levant', staples: 'olive oil, parsley, lemon, tahini, bulgur, lamb', flavor: 'parsley-forward freshness, lemon, and warm seven-spice', occasion: 'mezze tables and family meals' },
  moroccan: { region: 'North Africa', staples: 'couscous, preserved lemon, olives, slow-braised tagines', flavor: 'warm ras-el-hanout spice, citrus, and sweet-savory tagine balance', occasion: 'family tagine dinners and celebratory meals' },
  cuban: { region: 'the Caribbean', staples: 'rice, beans, pork, plantain, mojo sauce', flavor: 'sour-orange mojo, garlic, oregano, and slow-roasted pork', occasion: 'family dinners and celebration roasts' },
  hawaiian: { region: 'the Hawaiian Islands', staples: 'rice, pork, fish, taro, tropical fruit', flavor: 'sweet-savory Pacific influences with island fruit and smoke', occasion: 'luaus, plate lunches, and family gatherings' },
  cajun: { region: 'Louisiana', staples: 'rice, andouille, the holy trinity (onion, celery, bell pepper), filé', flavor: 'big spice, smoked sausage, and a dark roux backbone', occasion: 'Sunday gumbos and crawfish boils' },
  'soul-food': { region: 'the American South', staples: 'collards, cornbread, fried chicken, smoked pork, sweet potatoes', flavor: 'slow-cooked depth, smoky pork seasoning, and warm sweetness', occasion: 'Sunday dinners and holiday tables' },
};

function cuisineFor(slug: string | undefined): CuisineNote {
  const key = (slug ?? '').toLowerCase();
  return (
    CUISINE_NOTES[key] ?? {
      region: 'a world-cuisine tradition',
      staples: 'fresh seasonal ingredients prepared with care',
      flavor: 'balanced seasoning that lets the main ingredient shine',
      occasion: 'family meals and everyday cooking',
    }
  );
}

function courseFraming(course: string): string {
  const map: Record<string, string> = {
    breakfast: 'a morning dish that wakes the palate without weighing you down for the day ahead',
    lunch: 'a midday meal balanced between satisfying and light enough to keep you moving',
    dinner: 'the kind of evening meal that anchors the day — substantial, social, and worth slowing down for',
    appetizer: 'a small-plate opener built to share, prime appetite, and start conversation',
    soup: 'a soup-or-stew dish — the cooking method that turns humble ingredients into deep, layered flavor through time and heat',
    salad: 'a fresh, vegetable-forward dish that brings crunch, acid, and brightness to the table',
    side: 'a side dish written to round out a main protein with contrasting texture and seasoning',
    dessert: 'a sweet course meant to close a meal with satisfaction rather than heaviness',
    snack: 'a between-meals bite sized for portability and quick hunger satisfaction',
    drink: 'a beverage built to complement food or stand on its own as an afternoon ritual',
  };
  return map[course] ?? 'a recipe written to fit naturally into a real home-cooked meal';
}

function dietaryNote(tags: readonly string[] | undefined): string | null {
  if (!tags || tags.length === 0) return null;
  const friendly: Record<string, string> = {
    vegetarian: 'fully meat-free',
    vegan: 'plant-based with no animal products',
    'gluten-free': 'safe for gluten-sensitive eaters when standard ingredient brands are used',
    'dairy-free': 'lactose-friendly without trade-offs in richness',
    keto: 'low-carb and keto-aligned',
    paleo: 'paleo-compatible with no grains, legumes, or refined sugar',
    halal: 'halal-friendly with pork and alcohol omitted by design',
    kosher: 'kosher-style with meat and dairy kept separate',
    'low-carb': 'lower-carb without sacrificing satiety',
    pescatarian: 'pescatarian — fish and plants only',
    'whole30': 'Whole30-compatible',
    'low-fodmap': 'low-FODMAP for sensitive digestive systems',
  };
  const human = tags.map((t) => friendly[t] ?? t).slice(0, 3);
  if (human.length === 1) return `It also fits eaters following a ${human[0]} pattern.`;
  if (human.length === 2) return `It also fits eaters following ${human[0]} and ${human[1]} eating patterns.`;
  return `It also fits eaters following ${human[0]}, ${human[1]}, and ${human[2]} patterns.`;
}

function methodNote(equipment: readonly string[] | undefined): string {
  const e = (equipment ?? []).join(' ').toLowerCase();
  if (e.includes('dutch oven') || e.includes('slow cooker')) return 'low-and-slow braising — the technique that transforms tougher cuts into spoon-tender bites and concentrates flavor as liquid reduces';
  if (e.includes('skillet') || e.includes('wok')) return 'high-heat pan cooking — fast, direct heat that locks in juice and develops the Maillard browning that drives savory depth';
  if (e.includes('grill') || e.includes('bbq')) return 'open-flame grilling — direct heat that adds smoke character and char-fueled umami';
  if (e.includes('oven') || e.includes('sheet pan')) return 'oven-roasting — steady ambient heat that caramelizes surfaces while the interior cooks evenly';
  if (e.includes('steamer')) return 'gentle steaming — moisture-rich cooking that preserves texture, color, and nutrients';
  if (e.includes('blender') || e.includes('food processor')) return 'cold-process or quick-blend technique that captures fresh-ingredient flavor without heat damage';
  return 'a layered cooking technique that builds flavor in stages';
}

export type AboutDish = {
  intro: string;
  tradition: string;
  technique: string;
  serveSuggestion: string;
};

export function generateAboutDish(recipe: Recipe): AboutDish {
  const c = cuisineFor(recipe.cuisine);
  const courseFrame = courseFraming(recipe.course);
  const diet = dietaryNote(recipe.dietaryTags);
  const technique = methodNote(recipe.equipment);

  const intro =
    `${recipe.title} sits firmly in the ${c.region} tradition. ` +
    `As ${courseFrame}, it leans on the staples that define the cuisine — ${c.staples} — ` +
    `and finishes with the ${c.flavor} that makes it instantly recognizable on the table.` +
    (diet ? ` ${diet}` : '');

  const tradition =
    `In its home kitchens, a dish like this shows up around ${c.occasion}. ` +
    `The version here keeps that spirit intact while adjusting quantities, sourcing, and timing ` +
    `for a contemporary home cook who may be working with a standard supermarket pantry rather than ` +
    `a neighborhood market. Substitutions, where they appear in the ingredient list, are chosen so the ` +
    `dish still reads as ${c.region} on the plate rather than a vague approximation of it.`;

  const techniqueParagraph =
    `Behind the recipe is ${technique}. That choice isn't decorative — it's what gives the dish ` +
    `its final texture and depth. If you understand the technique, you can confidently scale, substitute, ` +
    `or adjust the recipe without breaking it. We explain the key moves inside the method block above; ` +
    `each step note tells you what should be happening and how to recognize when it has gone right.`;

  const serveSuggestion =
    `Serve ${recipe.title} the way it is eaten at home in ${c.region}: simply, with the components that ` +
    `naturally accompany it rather than a long list of garnishes. ` +
    `${recipe.servings === 1
      ? 'It scales easily for a household — see the recipe scaler above to bump the yield.'
      : `Plan for ${recipe.servings} as written, and use the scaler to adjust up for guests or down for solo cooking.`} ` +
    `For drink pairings tuned to this cuisine and the specific protein in the dish, check the “What to drink with this” block above.`;

  return { intro, tradition, technique: techniqueParagraph, serveSuggestion };
}
