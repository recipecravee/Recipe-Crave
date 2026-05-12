// Cooking measurement conversion across locale conventions.
// Strategy doc: "Cooking measurement unit conversions where applicable."
//
// US customary (cup, tbsp, tsp, oz, lb, °F) vs metric (g, ml, °C). Most
// of the world uses metric in the kitchen; the US is the major outlier.
// Default conversion-target by locale:
//
//   en (US):   imperial — keep as-is
//   en (UK):   metric (oz/lb -> g, °F -> °C)
//   es-MX:     metric
//   all other locales: metric
//
// Conversion accuracy: 1 cup ~ 240 ml ~ 240 g for water-like density.
// Solid ingredient cup-to-gram is density-dependent (see unit-converter
// calculator). For convenience labels, we use water-like default.

const LOCALE_TO_SYSTEM: Record<string, 'imperial' | 'metric'> = {
  en: 'imperial',
  'en-GB': 'metric',
  'es-MX': 'metric',
  // Everything else falls through to metric default
};

export function locationSystem(locale: string): 'imperial' | 'metric' {
  return LOCALE_TO_SYSTEM[locale] ?? 'metric';
}

const CUP_ML = 240;
const TBSP_ML = 15;
const TSP_ML = 5;
const OZ_G = 28.35;
const LB_G = 453.59;
const FL_OZ_ML = 29.5735;

export function fToC(f: number): number {
  return Math.round((f - 32) * (5 / 9));
}

export function cToF(c: number): number {
  return Math.round(c * (9 / 5) + 32);
}

/**
 * Convert a measurement to the target system for a locale.
 * Returns a human-readable label string.
 *
 * Examples:
 *   measureFor(2, 'cup', 'es') -> '480 ml'
 *   measureFor(8, 'oz', 'fr')  -> '227 g'
 *   measureFor(350, 'F', 'de') -> '177 °C'
 */
export function measureFor(qty: number, unit: string, locale: string): string {
  const target = locationSystem(locale);

  if (target === 'imperial') {
    return `${qty} ${unit}`;
  }

  switch (unit.toLowerCase()) {
    case 'cup':
    case 'cups':
      return `${Math.round(qty * CUP_ML)} ml`;
    case 'tbsp':
    case 'tablespoon':
    case 'tablespoons':
      return `${Math.round(qty * TBSP_ML)} ml`;
    case 'tsp':
    case 'teaspoon':
    case 'teaspoons':
      return `${Math.round(qty * TSP_ML)} ml`;
    case 'oz':
    case 'ounce':
    case 'ounces':
      return `${Math.round(qty * OZ_G)} g`;
    case 'fl oz':
    case 'fl-oz':
    case 'fluid ounce':
      return `${Math.round(qty * FL_OZ_ML)} ml`;
    case 'lb':
    case 'pound':
    case 'pounds':
      return `${Math.round(qty * LB_G)} g`;
    case 'f':
    case '°f':
    case 'fahrenheit':
      return `${fToC(qty)} °C`;
    default:
      // Already metric or non-convertible (whole, pinch, etc.)
      return `${qty} ${unit}`;
  }
}

/**
 * Returns the display-friendly label for the user's locale measurement
 * system. Used by a banner that explains the conversion choice.
 */
export function localeSystemLabel(locale: string): string {
  return locationSystem(locale) === 'metric' ? 'Metric (g, ml, °C)' : 'US Customary (cup, oz, °F)';
}
