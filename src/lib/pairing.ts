// Wine + beer + non-alcoholic beverage pairing auto-generator.
//
// Strategy doc requires wine/beverage pairing suggestions on every recipe.
// Building this with a database of 100k pairings is out of scope. Instead
// we generate 3-4 pairings per recipe by applying classical pairing rules
// to recipe metadata (cuisine, course, main protein keywords).
//
// Pairing principles applied:
//   - Match weight to weight (heavy wine for heavy food)
//   - Match richness to richness (fatty fish wants medium-bodied wine)
//   - Complement OR contrast (acidic wine cuts through cream; tannin
//     softens with protein)
//   - Spicy food prefers off-dry or low-alcohol (Riesling, beer, sake)
//   - Always include a non-alcoholic option for sober drinkers

import type { Recipe } from '@/types/recipe';

export type Pairing = {
  type: 'wine' | 'beer' | 'non-alcoholic' | 'cocktail';
  name: string;
  description: string;
  why: string;
};

type CuisineDefaults = {
  wine: Pairing;
  beer?: Pairing;
  nonAlc: Pairing;
  cocktail?: Pairing;
};

const CUISINE_PAIRINGS: Record<string, CuisineDefaults> = {
  italian: {
    wine: {
      type: 'wine',
      name: 'Chianti Classico',
      description: 'Sangiovese-based dry red, medium tannin, cherry + leather notes',
      why: 'High acidity cuts tomato-based sauces; tannins complement aged parmesan and red meat.',
    },
    beer: { type: 'beer', name: 'Italian pilsner', description: 'Crisp, lightly hoppy', why: 'Refreshes between bites; does not overpower delicate pasta.' },
    nonAlc: { type: 'non-alcoholic', name: 'Sparkling water with lemon', description: 'Plain San Pellegrino + lemon wedge', why: 'Cleanses the palate the same way wine acidity does.' },
  },
  french: {
    wine: { type: 'wine', name: 'Burgundy Pinot Noir', description: 'Elegant red, low tannin, red fruit + earthy notes', why: 'Versatile — pairs with white meats, mushroom dishes, and creamy sauces.' },
    nonAlc: { type: 'non-alcoholic', name: 'Sparkling cider', description: 'Dry French cidre', why: 'Apple acidity mirrors traditional French pairings.' },
  },
  mexican: {
    wine: { type: 'wine', name: 'Off-dry Riesling', description: 'Slightly sweet German Riesling', why: 'Residual sugar buffers chili heat; acidity cuts richness.' },
    beer: { type: 'beer', name: 'Mexican lager', description: 'Pacifico, Modelo, or Corona w/ lime', why: 'Classic regional match; crisp + low-bitter balances spice.' },
    nonAlc: { type: 'non-alcoholic', name: 'Agua de jamaica', description: 'Cold hibiscus tea sweetened lightly', why: 'Tart + floral; complements smoky and citrus-forward Mexican flavors.' },
  },
  indian: {
    wine: { type: 'wine', name: 'German Riesling Kabinett', description: 'Off-dry, low alcohol, lime + petrol notes', why: 'Sweetness tames chili; low alcohol prevents the alcohol-amplifies-heat effect.' },
    beer: { type: 'beer', name: 'Indian Pale Lager (Kingfisher, Taj Mahal)', description: 'Crisp and mildly hoppy', why: 'Light body + carbonation reset palate between spice bursts.' },
    nonAlc: { type: 'non-alcoholic', name: 'Salted lassi or mango lassi', description: 'Yogurt drink, sweet or savory', why: 'Dairy fat coats and cools chili-pepper capsaicin.' },
  },
  thai: {
    wine: { type: 'wine', name: 'New Zealand Sauvignon Blanc', description: 'Crisp, herbaceous, grapefruit notes', why: 'Citrus matches lemongrass + lime; acidity cuts coconut richness.' },
    beer: { type: 'beer', name: 'Singha or Chang lager', description: 'Crisp, slightly sweet', why: 'Regional pairing; balances heat without overpowering aromatics.' },
    nonAlc: { type: 'non-alcoholic', name: 'Coconut water', description: 'Plain young coconut water', why: 'Mirrors coconut-milk base; subtly sweet and electrolyte-balanced.' },
  },
  chinese: {
    wine: { type: 'wine', name: 'Off-dry Gewürztraminer', description: 'Aromatic, lychee + rose notes', why: 'Sweet-aromatic profile bridges sweet-and-sour and 5-spice dishes.' },
    beer: { type: 'beer', name: 'Tsingtao lager', description: 'Light and clean', why: 'Doesn\'t compete with soy, ginger, garlic — the holy trinity of Chinese aromatics.' },
    nonAlc: { type: 'non-alcoholic', name: 'Jasmine tea', description: 'Hot or iced jasmine green tea', why: 'Cuts grease in fried items; perfumes the meal traditionally.' },
  },
  japanese: {
    wine: { type: 'wine', name: 'Junmai sake', description: 'Dry, full-bodied sake', why: 'Native pairing — umami amino acids in sake match miso, soy, fish.' },
    beer: { type: 'beer', name: 'Asahi Super Dry', description: 'Crisp lager, low aroma', why: 'Designed to wash sushi and tempura; doesn\'t mask delicate flavors.' },
    nonAlc: { type: 'non-alcoholic', name: 'Cold barley tea (mugicha)', description: 'Roasted barley, no caffeine', why: 'Nutty roasted notes pair with seared and grilled dishes.' },
  },
  korean: {
    wine: { type: 'wine', name: 'Dry Rosé', description: 'Provence-style rosé, light and crisp', why: 'Versatile against banchan variety; acidity cuts gochujang spice.' },
    beer: { type: 'beer', name: 'Korean lager (Hite, OB)', description: 'Light and crisp', why: 'Local match; cleanses heat from kimchi and gochugaru.' },
    nonAlc: { type: 'non-alcoholic', name: 'Sikhye (sweet rice drink)', description: 'Traditional fermented rice beverage', why: 'Sweet + slightly fizzy palate cleanser.' },
  },
  mediterranean: {
    wine: { type: 'wine', name: 'Greek Assyrtiko', description: 'Crisp white from Santorini, mineral notes', why: 'Salinity matches olives + feta + grilled fish — the Mediterranean trio.' },
    nonAlc: { type: 'non-alcoholic', name: 'Sparkling water with cucumber + mint', description: 'Fresh herbal soda', why: 'Mirrors the herb-forward Mediterranean profile.' },
  },
  'middle-eastern': {
    wine: { type: 'wine', name: 'Lebanese red blend (Château Musar)', description: 'Old-vine reds, balanced and savory', why: 'Bridges spiced lamb, hummus, and grilled vegetables of mezze plates.' },
    nonAlc: { type: 'non-alcoholic', name: 'Mint tea (Moroccan style)', description: 'Steeped green tea with fresh mint + sugar', why: 'Traditional after-meal; aids digestion of rich spiced foods.' },
  },
  caribbean: {
    wine: { type: 'wine', name: 'Off-dry Rosé', description: 'Provençal pink, fruity finish', why: 'Tropical fruit notes mirror Caribbean cuisine; sweetness offsets jerk heat.' },
    beer: { type: 'beer', name: 'Red Stripe lager', description: 'Crisp Jamaican lager', why: 'Local pairing; lightness handles spicy + smoky preparations.' },
    nonAlc: { type: 'non-alcoholic', name: 'Sorrel (hibiscus) drink', description: 'Spiced hibiscus tea, chilled', why: 'Festive regional non-alcoholic standard.' },
    cocktail: { type: 'cocktail', name: 'Rum punch', description: 'Light rum, citrus, grenadine, nutmeg', why: 'Iconic Caribbean pairing for jerk and stews.' },
  },
  nigerian: {
    wine: { type: 'wine', name: 'Malbec', description: 'Argentinian, bold and fruity', why: 'Robust enough for jollof rice, suya, and pepper soup intensity.' },
    beer: { type: 'beer', name: 'Star or Gulder lager', description: 'Nigerian crisp lager', why: 'Local match; refreshes between heat and spice.' },
    nonAlc: { type: 'non-alcoholic', name: 'Zobo (hibiscus drink)', description: 'Spiced Nigerian hibiscus tea, sweetened', why: 'Tart + floral palate cleanser, served chilled.' },
  },
  american: {
    wine: { type: 'wine', name: 'California Zinfandel', description: 'Jammy red with mild spice', why: 'Big enough for BBQ; fruit-forward profile complements caramelized + smoky.' },
    beer: { type: 'beer', name: 'American IPA', description: 'Hop-forward pale ale', why: 'Cuts grease in burgers and fried foods; classic.' },
    nonAlc: { type: 'non-alcoholic', name: 'Iced tea (unsweetened or sweet)', description: 'Cold-brewed black tea', why: 'Tannin balances rich BBQ + Southern dishes.' },
  },
};

const DEFAULT_PAIRING: CuisineDefaults = {
  wine: { type: 'wine', name: 'Versatile dry rosé', description: 'Provence-style, crisp and pale', why: 'Works across many cuisines without dominating.' },
  beer: { type: 'beer', name: 'Light lager', description: 'Crisp, low-bitter, low-aroma', why: 'Refreshing and neutral.' },
  nonAlc: { type: 'non-alcoholic', name: 'Sparkling water with lemon', description: 'San Pellegrino or Topo Chico', why: 'Universal palate cleanser.' },
};

/**
 * Generate 3-4 pairings for any recipe based on its cuisine + course +
 * keyword profile. Always returns at least one non-alcoholic option.
 */
export function generatePairings(recipe: Recipe): Pairing[] {
  const cuisineKey = (recipe.cuisine ?? '').toLowerCase();
  const defaults = CUISINE_PAIRINGS[cuisineKey] ?? DEFAULT_PAIRING;
  const text = `${recipe.title} ${recipe.description ?? ''} ${(recipe.keywords ?? []).join(' ')}`.toLowerCase();

  const out: Pairing[] = [];
  out.push(defaults.wine);
  if (defaults.beer) out.push(defaults.beer);
  out.push(defaults.nonAlc);
  if (defaults.cocktail) out.push(defaults.cocktail);

  // Protein-based overrides — bigger reds for heavy red meats; cleaner whites for fish.
  if (/\b(beef|steak|lamb|brisket|short rib|venison|stew)\b/.test(text)) {
    out[0] = {
      type: 'wine',
      name: 'Argentine Malbec or California Cabernet',
      description: 'Bold red, full body, blackberry + cedar notes',
      why: 'Heavy red meat needs tannin + ripe fruit to balance fat and char.',
    };
  } else if (/\b(salmon|tuna|swordfish|fatty fish)\b/.test(text)) {
    out[0] = {
      type: 'wine',
      name: 'Oregon Pinot Noir',
      description: 'Medium-bodied red, low tannin, red-fruit notes',
      why: 'Fatty fish wants a wine with weight but not aggression — Pinot is the classic.',
    };
  } else if (/\b(cod|tilapia|halibut|sole|haddock|white fish|shrimp)\b/.test(text)) {
    out[0] = {
      type: 'wine',
      name: 'Albariño or Vermentino',
      description: 'Crisp coastal white, citrus + mineral notes',
      why: 'Delicate white fish demands a wine that does not overpower.',
    };
  } else if (/\b(chicken|turkey|poultry)\b/.test(text)) {
    out[0] = {
      type: 'wine',
      name: 'Unoaked Chardonnay',
      description: 'Crisp white, green apple + citrus notes',
      why: 'Classic pairing for white meats; oak absent so the wine does not dominate.',
    };
  } else if (/\b(vegan|vegetarian|tofu|tempeh)\b/.test(text)) {
    out[0] = {
      type: 'wine',
      name: 'Beaujolais Villages',
      description: 'Light red, low tannin, fresh fruit notes',
      why: 'Light enough to pair with vegetables without dominating; serve slightly chilled.',
    };
  }

  // Spice-level override — capsaicin + alcohol amplify each other, so push toward off-dry.
  if (/\b(spicy|chili|chile|hot sauce|sriracha|cayenne|jerk|gochujang)\b/.test(text)) {
    out[0] = {
      type: 'wine',
      name: 'Off-dry Riesling',
      description: 'German Spätlese-level Riesling, slight residual sugar',
      why: 'Residual sugar buffers chili heat; low alcohol avoids amplifying the burn.',
    };
  }

  // Dessert-course override
  if (recipe.course === 'dessert' || /\b(dessert|cake|cookie|pudding|tart|pie)\b/.test(text)) {
    return [
      { type: 'wine', name: 'Port or Late-harvest Riesling', description: 'Sweet fortified or dessert wine', why: 'Dessert wine should be at least as sweet as the dessert itself; otherwise the wine tastes thin.' },
      { type: 'non-alcoholic', name: 'Espresso or strong coffee', description: 'Single shot or French press', why: 'Bitter coffee balances residual sweetness; classic finish.' },
      { type: 'non-alcoholic', name: 'Mint tea', description: 'Fresh-leaf or bag', why: 'Cleansing herbal finish for chocolate or fruit-based desserts.' },
    ];
  }

  // Breakfast / beverage course override
  if (recipe.course === 'breakfast' || recipe.course === 'beverage') {
    return [
      { type: 'non-alcoholic', name: 'Freshly brewed coffee', description: 'French press, drip, or pour-over', why: 'Caffeine-anchored morning pairing.' },
      { type: 'non-alcoholic', name: 'Green tea or matcha', description: 'Hot or iced', why: 'Lower-caffeine alternative; light bitterness balances rich breakfasts.' },
      { type: 'non-alcoholic', name: 'Fresh-squeezed orange juice', description: 'Cold-pressed', why: 'Bright acidity wakes the palate.' },
    ];
  }

  return out.slice(0, 4);
}
