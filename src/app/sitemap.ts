import type { MetadataRoute } from 'next';
import { SITE, CUISINES, DIETS } from '@/lib/constants';
import { getAllRecipes, getAllCollections } from '@/lib/data/recipes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getAllRecipes();
  const collections = await getAllCollections();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE.url}/recipes`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/collections`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/meal-planner`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/pantry-match`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/how-to`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE.url}/calculators`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
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

  return [...staticRoutes, ...cuisineRoutes, ...dietRoutes, ...collectionRoutes, ...recipeRoutes];
}
