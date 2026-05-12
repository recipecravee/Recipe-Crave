import type { MetadataRoute } from 'next';
import { SITE, CUISINES, DIETS } from '@/lib/constants';
import { getAllRecipes, getAllCollections } from '@/lib/data/recipes';
import { HERBS, CONDITIONS } from '@/content/herbs';
import { HOW_TO_GUIDES } from '@/content/how-to-guides';
import { MEAL_PLANS } from '@/content/meal-plans';
import { BLOG_POSTS } from '@/content/blog-posts';

const CALCULATOR_SLUGS = [
  'baking-ratio',
  'calorie-estimator',
  'ingredient-substitutions',
  'pantry-inventory-matcher',
  'realtime-recipe-scaler',
  'recipe-cost',
  'seasoning-by-weight',
  'servings-scaler',
  'storage-life-guide',
  'temperature-adjuster',
  'unit-converter',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getAllRecipes();
  const collections = await getAllCollections();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE.url}/recipes`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/collections`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/meal-planner`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/meal-plans`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE.url}/pantry-match`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/how-to`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE.url}/calculators`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    // === Herbal / food-as-medicine vertical ===
    { url: `${SITE.url}/herbal-cooking`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/herbs`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE.url}/safety-check`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // === Editorial + personalization ===
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE.url}/profile`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // === Policy / about ===
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE.url}/editorial-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/nutrition-disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const cuisineRoutes: MetadataRoute.Sitemap = CUISINES.map((c) => ({
    url: `${SITE.url}/cuisine/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const dietRoutes: MetadataRoute.Sitemap = DIETS.map((d) => ({
    url: `${SITE.url}/diet/${d.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE.url}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${SITE.url}/recipes/${r.slug}`,
    lastModified: new Date(r.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const calculatorRoutes: MetadataRoute.Sitemap = CALCULATOR_SLUGS.map((slug) => ({
    url: `${SITE.url}/calculators/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const herbRoutes: MetadataRoute.Sitemap = HERBS.map((h) => ({
    url: `${SITE.url}/herbs/${h.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // /herbs landing also exposes per-condition pillars; herbal-cooking hub
  // links to them by anchor. Surface each as its own sitemap entry under the
  // hub so Google can crawl them directly.
  const conditionRoutes: MetadataRoute.Sitemap = CONDITIONS.map((c) => ({
    url: `${SITE.url}/herbal-cooking#${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const howToRoutes: MetadataRoute.Sitemap = HOW_TO_GUIDES.map((g) => ({
    url: `${SITE.url}/how-to/${g.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  const mealPlanRoutes: MetadataRoute.Sitemap = MEAL_PLANS.map((p) => ({
    url: `${SITE.url}/meal-plans/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...cuisineRoutes,
    ...dietRoutes,
    ...collectionRoutes,
    ...recipeRoutes,
    ...calculatorRoutes,
    ...herbRoutes,
    ...conditionRoutes,
    ...howToRoutes,
    ...mealPlanRoutes,
    ...blogRoutes,
  ];
}
