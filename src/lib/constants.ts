export const SITE = {
  name: 'RecipeCrave',
  tagline: 'AI cooking coach that turns what you have into what you crave.',
  description:
    'Free AI-powered recipe discovery, meal planning, and step-by-step cooking with calories, costs, and pantry-aware suggestions. The smartest free cooking app on the web.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://recipecrave.com',
  ogImage: '/og-default.png',
  twitter: '@recipecrave',
  email: 'hello@recipecrave.com',
  publisher: 'GridPoint Digital Solution',
  founded: '2026',
} as const;

export const CUISINES = [
  { slug: 'italian', name: 'Italian', emoji: '🍝' },
  { slug: 'mexican', name: 'Mexican', emoji: '🌮' },
  { slug: 'indian', name: 'Indian', emoji: '🍛' },
  { slug: 'chinese', name: 'Chinese', emoji: '🥡' },
  { slug: 'japanese', name: 'Japanese', emoji: '🍱' },
  { slug: 'thai', name: 'Thai', emoji: '🍜' },
  { slug: 'mediterranean', name: 'Mediterranean', emoji: '🥗' },
  { slug: 'american', name: 'American', emoji: '🍔' },
  { slug: 'french', name: 'French', emoji: '🥐' },
  { slug: 'middle-eastern', name: 'Middle Eastern', emoji: '🧆' },
  { slug: 'west-african', name: 'West African', emoji: '🍲' },
  { slug: 'korean', name: 'Korean', emoji: '🍚' },
  { slug: 'vietnamese', name: 'Vietnamese', emoji: '🍲' },
  { slug: 'caribbean', name: 'Caribbean', emoji: '🍹' },
  { slug: 'spanish', name: 'Spanish', emoji: '🥘' },
  { slug: 'greek', name: 'Greek', emoji: '🫒' },
] as const;

export const DIETS = [
  { slug: 'vegetarian', name: 'Vegetarian', schema: 'VegetarianDiet' },
  { slug: 'vegan', name: 'Vegan', schema: 'VeganDiet' },
  { slug: 'gluten-free', name: 'Gluten-Free', schema: 'GlutenFreeDiet' },
  { slug: 'dairy-free', name: 'Dairy-Free', schema: 'LowLactoseDiet' },
  { slug: 'keto', name: 'Keto', schema: 'LowCarbohydrateDiet' },
  { slug: 'paleo', name: 'Paleo', schema: 'LowCarbohydrateDiet' },
  { slug: 'low-carb', name: 'Low-Carb', schema: 'LowCarbohydrateDiet' },
  { slug: 'low-calorie', name: 'Low-Calorie', schema: 'LowCalorieDiet' },
  { slug: 'low-fat', name: 'Low-Fat', schema: 'LowFatDiet' },
  { slug: 'low-sodium', name: 'Low-Sodium', schema: 'LowSaltDiet' },
  { slug: 'high-protein', name: 'High-Protein', schema: 'LowCalorieDiet' },
  { slug: 'diabetic', name: 'Diabetic-Friendly', schema: 'DiabeticDiet' },
  { slug: 'halal', name: 'Halal', schema: 'HalalDiet' },
  { slug: 'kosher', name: 'Kosher', schema: 'KosherDiet' },
] as const;

export const COURSES = [
  'breakfast',
  'brunch',
  'lunch',
  'dinner',
  'appetizer',
  'side',
  'soup',
  'salad',
  'snack',
  'dessert',
  'drink',
  'sauce',
] as const;

export const OCCASIONS = [
  'weeknight',
  'date-night',
  'meal-prep',
  'game-day',
  'thanksgiving',
  'christmas',
  'easter',
  'birthday',
  'potluck',
  'picnic',
  'summer-grilling',
  'comfort-food',
] as const;

export const NAV_LINKS = [
  { href: '/recipes', label: 'Recipes' },
  { href: '/collections', label: 'Collections' },
  { href: '/meal-planner', label: 'Meal Planner' },
  { href: '/pantry-match', label: "What's In My Fridge" },
  { href: '/how-to', label: 'How-To' },
  { href: '/calculators', label: 'Free Tools' },
] as const;
