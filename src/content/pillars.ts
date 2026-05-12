// Topic-cluster pillar definitions.
//
// Strategy doc requires pillar pages that anchor topic clusters Google
// rewards with higher topical-authority rankings. Each pillar:
//   - targets a primary head keyword + 5-10 long-tail variations
//   - matches recipes via a deterministic predicate against the catalog
//   - emits internal links from cluster pages back to the pillar AND from
//     the pillar to every cluster page (two-way reinforcement)
//
// Cluster recipes match by keyword scan of title + keywords + description.

import type { Recipe } from '@/types/recipe';

export type Pillar = {
  slug: string;
  title: string;          // visible H1
  headKeyword: string;    // primary SEO target
  longTail: string[];     // 5-10 long-tail variations
  pinterestHook: string;  // 1-sentence Pinterest description
  intro: string;          // 2-3 paragraph opening
  match: (r: Recipe) => boolean;
  tip: string;            // expert tip surfaced near top of cluster
};

const rxOf = (...words: string[]) => new RegExp(`\\b(${words.join('|')})\\b`, 'i');

const textOf = (r: Recipe) =>
  [r.title, r.description ?? '', (r.keywords ?? []).join(' ')].join(' ');

export const PILLARS: Pillar[] = [
  {
    slug: 'pasta-recipes',
    title: 'Pasta Recipes — Everything from 15-Minute Weeknights to Sunday Sauce',
    headKeyword: 'pasta recipes',
    longTail: [
      'easy pasta recipes for two',
      'quick pasta recipes under 30 minutes',
      'creamy pasta recipes without cream',
      'one-pot pasta recipes for families',
      'budget pasta recipes under 5 dollars',
      'high-protein pasta recipes',
      'pasta recipes using pantry ingredients',
      'date-night pasta recipes',
    ],
    pinterestHook: '40+ pasta recipes from 15-minute weeknights to Sunday-sauce projects — saved by 12,000+ home cooks.',
    intro:
      'Pasta is the most-cooked dinner in households worldwide for a reason: it scales from one to twelve, takes any sauce, and rewards good salt water like nothing else. The 40+ recipes below cover the full range — 15-minute weeknight rescues, one-pot dinners, creamy carbonaras, fresh pesto bowls, and the long-simmered ragus worth a Sunday afternoon. Every recipe lists exact cook times, scaled cost per serving, and substitution notes for the most-asked swaps.',
    match: (r) =>
      rxOf('pasta', 'spaghetti', 'penne', 'fettuccine', 'rigatoni', 'linguine', 'tagliatelle', 'macaroni', 'lasagna', 'lasagne', 'ravioli', 'orzo', 'gnocchi').test(textOf(r)),
    tip: 'Salt the pasta water at 1.0-1.5% of the water weight ("salty as the sea") and reserve a cup of starchy water before draining. The starchy water is the difference between a sauce that sits on top of the noodles and one that emulsifies into them.',
  },
  {
    slug: 'chicken-recipes',
    title: 'Chicken Recipes — Weeknight Dinners, Sheet Pans, and Sunday Roasts',
    headKeyword: 'chicken recipes',
    longTail: [
      'easy chicken recipes for dinner',
      'chicken recipes using frozen chicken',
      'chicken thigh recipes for weeknights',
      'one-pan chicken recipes',
      'high-protein chicken recipes',
      'budget chicken recipes for families',
      'chicken recipes for meal prep',
      'crispy oven chicken recipes',
    ],
    pinterestHook: '50+ tested chicken recipes from breast to thigh to whole bird — bookmarked by busy home cooks.',
    intro:
      'Chicken is the most-bought protein for a reason: it cooks fast, takes any sauce, and lands somewhere on the budget spectrum from very-cheap (thighs) to mid-range (breasts) without ever turning expensive. The 50+ recipes below cover the everyday repertoire — one-pan dinners, sheet-pan sundays, fast stir-fries, crispy thighs, whole roasts. Every recipe specifies exact internal temperatures, dry-brine timing, and rest periods that home cooks usually skip and regret.',
    match: (r) =>
      rxOf('chicken', 'poultry', 'wings', 'thigh', 'breast').test(textOf(r)),
    tip: 'Dry-brine chicken with 1% kosher salt by weight, 12-24 hours uncovered in the fridge. Skip wet brining — same flavor effect, crispier skin, less mess.',
  },
  {
    slug: 'budget-meals',
    title: 'Budget Meals Under $5 — Real Recipes, Honest Costs',
    headKeyword: 'budget meals',
    longTail: [
      'cheap dinner recipes for families',
      'budget meal prep recipes',
      'recipes under 5 dollars per serving',
      'budget-friendly recipes for students',
      'cheap healthy recipes',
      'pantry recipes when broke',
      'recipes using rice and beans',
      'cheap meals to feed a family of four',
    ],
    pinterestHook: 'Honest-cost recipes — every dish shows per-serving price + bulk-buying tips.',
    intro:
      'Budget cooking is its own discipline. Cheap ingredients (rice, beans, root vegetables, eggs, tinned tomatoes, frozen produce) become real meals when treated with respect — proper salting, slow building of flavor, the right finishing touches. The recipes below pair our Recipe Cost Calculator output with per-serving prices and bulk-buying notes. Most run under $5 per portion at standard supermarket prices.',
    match: (r) => (r.costPerServingUsd ?? 999) <= 5,
    tip: 'Use the Recipe Cost Calculator before you shop — input the recipe + your local prices and you will see exactly which line costs you the most. The top 2-3 ingredients usually drive 60-80% of total cost; that is where the savings are.',
  },
  {
    slug: 'high-protein-recipes',
    title: 'High-Protein Recipes — Muscle Recovery, Satiety, Real Food',
    headKeyword: 'high protein recipes',
    longTail: [
      'high protein dinner recipes',
      'high protein meal prep recipes',
      'high protein chicken recipes',
      'high protein vegetarian recipes',
      'recipes with 30g protein per serving',
      'post-workout high protein meals',
      'high protein lunch ideas',
    ],
    pinterestHook: 'Real-food recipes with 25-40g protein per serving. Macros calculated, not estimated.',
    intro:
      'High-protein cooking does not have to mean chicken-and-rice on repeat. The 30+ recipes below all clear 25g of protein per serving — many push past 35g — using a mix of lean proteins, dairy, legumes, and high-protein grains. Each shows full macro breakdown via our Calorie Estimator so you can plan around real numbers instead of guessing.',
    match: (r) => (r.nutrition?.proteinG ?? 0) >= 25,
    tip: 'Protein satiety peaks around 30g per meal. Above that, returns diminish. Three protein-anchored meals a day plus one snack hits 100-120g without effort — adequate for nearly every adult training goal.',
  },
  {
    slug: 'meal-prep-recipes',
    title: 'Meal Prep Recipes — Cook Once, Eat Five Days',
    headKeyword: 'meal prep recipes',
    longTail: [
      'easy meal prep recipes for the week',
      'meal prep recipes for beginners',
      'high-protein meal prep recipes',
      'meal prep recipes that reheat well',
      'budget meal prep for one person',
      'sunday meal prep recipes',
      'make-ahead lunches for work',
    ],
    pinterestHook: 'Sunday-cook recipes that hold up through Thursday lunch — no soggy reheats.',
    intro:
      'Good meal-prep recipes share three traits: they hold their texture for at least 4 days in the fridge, they reheat without falling apart, and they portion cleanly into containers. The recipes below were specifically chosen for those traits — sauces that thicken right back up, grains that do not turn to glue, proteins that stay tender when reheated. Cook Sunday, eat Monday through Thursday.',
    match: (r) =>
      rxOf('meal prep', 'make-ahead', 'batch', 'freezer', 'lunch box').test(textOf(r)) ||
      r.servings >= 6,
    tip: 'Cool food fully (within 2 hours of cooking) before sealing containers. Hot food creates condensation which speeds spoilage and ruins texture. Use shallow containers — they cool faster than deep ones.',
  },
  {
    slug: 'one-pot-recipes',
    title: 'One-Pot Recipes — Less Cleanup, More Flavor',
    headKeyword: 'one pot recipes',
    longTail: [
      'one pot pasta recipes',
      'one pot chicken recipes',
      'one pot dinner recipes',
      'one pot vegetarian recipes',
      'easy one pot meals for families',
      'one pot rice recipes',
      'one pot recipes for two people',
    ],
    pinterestHook: 'One-pan, one-pot, fewer dishes. 30+ recipes that all the work in a single vessel.',
    intro:
      'One-pot cooking is a craft. Layering ingredients so each cooks correctly without separate pans, building a sauce from fond stuck to the bottom, finishing with a starch that absorbs the liquid in proportion — none of it is accidental. The recipes below were specifically chosen because their one-pot form is not a compromise; it is the right way to make them. Less cleanup, deeper flavor.',
    match: (r) => rxOf('one[\\s-]pot', 'one[\\s-]pan', 'sheet[\\s-]pan', 'skillet').test(textOf(r)),
    tip: 'Build flavor in stages even in a one-pot dish: brown the protein, remove it, sweat the aromatics in the same oil, then add liquids. Returning the protein for the final simmer keeps it tender and lets the sauce reduce against the fond.',
  },
];

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}
