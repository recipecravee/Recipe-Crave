// 14 menu categories — RecipeCrave canonical
// taxonomy. Each maps to (course, occasion) filter pair that resolves recipes
// in `getAllRecipes()`. Used by /categories/[slug] dynamic pages and the
// /categories landing.

import { IMG } from './image-bank';

export type MenuCategory = {
  slug: string;
  name: string;
  blurb: string;
  emoji: string;
  image: string;
  // Filter logic — recipes match if course matches AND (occasion is undefined
  // OR recipe.occasion matches one of the listed occasions).
  course: string;
  occasions?: string[];
  // Some categories pull recipes that share the same course as another category
  // (e.g. Snacks + Small Chops both = appetizer). To keep their lists distinct,
  // we filter Snacks to occasion=null and Small Chops to occasion=small-chops.
  occasionMode?: 'include' | 'exclude' | 'none-only';
  // Optional keyword filter (case-insensitive substring against title or
  // keywords array). Used for subcategories that share a course (e.g. Small
  // Chops with Snacks).
  titleKeywords?: string[];
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    slug: 'snacks',
    name: 'Snacks',
    blurb: 'Scotch eggs, butterfly prawns, chicken nuggets, popcorn, banana bread, doughnuts. Fast, snackable, deeply satisfying.',
    emoji: '🥨',
    image: IMG.scotchEgg ?? IMG.meatPie,
    course: 'appetizer',
    occasionMode: 'none-only',
  },
  {
    slug: 'small-chops',
    name: 'Small Chops',
    blurb: 'Samosas, spring rolls, puff puff, Korean corn dogs, mayo rolls. Bite-size party fare.',
    emoji: '🍤',
    image: IMG.samosas ?? IMG.springRolls,
    course: 'appetizer',
    titleKeywords: ['samosa', 'spring roll', 'puff', 'corn dog', 'mayo roll', 'money bag', 'beer batter', 'beef burger', 'chin chin', 'egg roll', 'doughnut', 'sausage roll', 'fish roll'],
  },
  {
    slug: 'pasta',
    name: 'Pasta',
    blurb: 'Spaghetti bolognese, Mac & Cheese, Pink Pasta, Singapore Noodles, Lasagne, Seafood Pasta, Alfredo.',
    emoji: '🍝',
    image: IMG.spaghettiMeatballs ?? IMG.pasta,
    course: 'dinner',
    occasions: ['pasta'],
  },
  {
    slug: 'rice',
    name: 'Rice',
    blurb: "Coconut jollof, signature coconut rice, Suya rice, Jambalaya, Caribbean rice & peas, Pineapple fried rice.",
    emoji: '🍚',
    image: IMG.coconutJollof ?? IMG.jollofRice,
    course: 'dinner',
    occasions: ['rice'],
  },
  {
    slug: 'breakfast',
    name: 'Breakfast',
    blurb: 'Akara, waffles, pancakes, grilled cheese, frittata, milk bread, shawarma, mashed potatoes.',
    emoji: '🍳',
    image: IMG.waffles ?? IMG.pancakes,
    course: 'breakfast',
  },
  {
    slug: 'soups',
    name: 'Soups',
    blurb: 'Egusi, Ogbono, Efo Riro, Afang, Edikang Ikong, Owo, Black Soup, Fisherman, Seafood Okra, Banga.',
    emoji: '🍲',
    image: IMG.egusi ?? IMG.efoRiro,
    course: 'soup',
  },
  {
    slug: 'stews-sauces',
    name: 'Stews & Sauces',
    blurb: 'Bolognese, Buka Stew, Ofada Sauce, Curry Goat, Butter Chicken Curry, Beef Goulash, Turkey Stew.',
    emoji: '🍛',
    image: IMG.bolognese ?? IMG.curry,
    course: 'dinner',
    occasions: ['stew'],
  },
  {
    slug: 'desserts',
    name: 'Desserts',
    blurb: 'Lemon cake, banana bread, cinnamon rolls, cheesecake, parfait, sugar cookies, chocolate muffins, gingerbread.',
    emoji: '🍰',
    image: IMG.lemonCake ?? IMG.cheesecake,
    course: 'dessert',
    occasionMode: 'none-only',
  },
  {
    slug: 'grills',
    name: 'Grills',
    blurb: 'Rotisserie chicken, T-bone steak, grilled prawns, honey BBQ ribs, grilled fish, grilled turkey, grilled Titus & bole.',
    emoji: '🥩',
    image: IMG.steak ?? IMG.bbqRibs,
    course: 'dinner',
    occasions: ['grill'],
  },
  {
    slug: 'sides',
    name: 'Sides',
    blurb: 'Naan, hummus, kelewele, Isi Ewu, Nkwobi, peppered goat meat, Caesar salad, chicken salad, stuffed masa.',
    emoji: '🥗',
    image: IMG.hummus ?? IMG.saladBowl,
    course: 'side',
  },
  {
    slug: 'porridges',
    name: 'Porridges',
    blurb: 'Cowtail & plantain, fried beans, unripe plantain porridge, yam & sweet potato, Ekpang Nkukwo.',
    emoji: '🥘',
    image: IMG.plantain ?? IMG.akara,
    course: 'dinner',
    occasions: ['porridge'],
  },
  {
    slug: 'drinks',
    name: 'Drinks',
    blurb: 'Zobo, Tiger Nut (kunun aya), tropical juice, egg nog. Non-alcoholic refreshment.',
    emoji: '🥤',
    image: IMG.zobo ?? IMG.tropicalJuice,
    course: 'drink',
    occasionMode: 'none-only',
  },
  {
    slug: 'iced-treats',
    name: 'Iced Treats & Shakes',
    blurb: 'Bailey milkshake, Oreo ice cream, blueberry ice cream, chocolate chip ice cream, berry popsicles.',
    emoji: '🍨',
    image: IMG.iceCream ?? IMG.milkshake,
    course: 'dessert',
    occasions: ['frozen'],
  },
  {
    slug: 'cocktails-mocktails',
    name: 'Cocktails & Mocktails',
    blurb: 'Margarita, Mojito, Cosmopolitan, Manhattan, Moscow Mule, Whiskey Sour, Long Island Iced Tea, Strawberry Daiquiri, mimosas.',
    emoji: '🍹',
    image: IMG.margarita ?? IMG.cocktail,
    course: 'drink',
    occasions: ['cocktail'],
  },
];

/**
 * Return recipes that match a given menu category, given the full recipe pool.
 * Used both by the listing page and by counts on the landing tiles.
 */
export function filterByCategory<T extends { course: string; occasion: string | null; title: string; keywords?: string[] }>(
  recipes: T[],
  cat: MenuCategory,
): T[] {
  return recipes.filter((r) => {
    if (r.course !== cat.course) return false;
    if (cat.titleKeywords && cat.titleKeywords.length > 0) {
      const title = r.title.toLowerCase();
      const kw = (r.keywords ?? []).join(' ').toLowerCase();
      return cat.titleKeywords.some((k) => title.includes(k) || kw.includes(k));
    }
    if (cat.occasionMode === 'none-only') return r.occasion === null;
    if (cat.occasions && cat.occasions.length > 0) {
      return r.occasion !== null && cat.occasions.includes(r.occasion);
    }
    return true;
  });
}

export function findCategory(slug: string): MenuCategory | undefined {
  return MENU_CATEGORIES.find((c) => c.slug === slug);
}
