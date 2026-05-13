import type { Recipe } from '@/types/recipe';
import { SITE } from '@/lib/constants';
import { isoDuration, absoluteUrl } from '@/lib/utils';

export function recipeJsonLd(recipe: Recipe) {
  const url = absoluteUrl(`/recipes/${recipe.slug}`);

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': url,
    name: recipe.title,
    description: recipe.description,
    image: recipe.heroImage
      ? [recipe.heroImage, ...(recipe.galleryImages ?? [])].slice(0, 4)
      : undefined,
    author: {
      '@type': 'Organization',
      name: SITE.publisher,
      url: SITE.url,
    },
    datePublished: recipe.publishedAt,
    dateModified: recipe.updatedAt,
    prepTime: isoDuration(recipe.prepTimeMin),
    cookTime: isoDuration(recipe.cookTimeMin),
    totalTime: isoDuration(recipe.totalTimeMin),
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: recipe.course,
    recipeCuisine: recipe.cuisine,
    keywords: recipe.keywords.join(', '),
    recipeIngredient: recipe.ingredients.map((i) =>
      `${i.qty} ${i.unit} ${i.name}${i.notes ? `, ${i.notes}` : ''}`.trim(),
    ),
    recipeInstructions: recipe.instructions.map((s) => ({
      '@type': 'HowToStep',
      position: s.step,
      text: s.text,
      ...(s.imageUrl ? { image: s.imageUrl } : {}),
    })),
    nutrition: recipe.nutrition
      ? {
          '@type': 'NutritionInformation',
          calories: `${recipe.nutrition.calories} kcal`,
          fatContent: `${recipe.nutrition.fatG} g`,
          saturatedFatContent: `${recipe.nutrition.satFatG} g`,
          carbohydrateContent: `${recipe.nutrition.carbsG} g`,
          sugarContent: `${recipe.nutrition.sugarG} g`,
          fiberContent: `${recipe.nutrition.fiberG} g`,
          proteinContent: `${recipe.nutrition.proteinG} g`,
          sodiumContent: `${recipe.nutrition.sodiumMg} mg`,
          servingSize: '1 serving',
        }
      : undefined,
    aggregateRating:
      recipe.ratingCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: recipe.avgRating.toFixed(1),
            reviewCount: recipe.ratingCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    suitableForDiet: recipe.dietaryTags.map((d) => `https://schema.org/${dietToSchema(d)}`),
    video: recipe.videoUrl
      ? {
          '@type': 'VideoObject',
          name: recipe.title,
          description: recipe.description,
          thumbnailUrl: recipe.heroImage,
          contentUrl: recipe.videoUrl,
          uploadDate: recipe.publishedAt,
        }
      : undefined,
  };

  return json;
}

function dietToSchema(slug: string): string {
  const map: Record<string, string> = {
    vegetarian: 'VegetarianDiet',
    vegan: 'VeganDiet',
    'gluten-free': 'GlutenFreeDiet',
    'dairy-free': 'LowLactoseDiet',
    keto: 'LowCarbohydrateDiet',
    paleo: 'LowCarbohydrateDiet',
    'low-carb': 'LowCarbohydrateDiet',
    'low-calorie': 'LowCalorieDiet',
    'low-fat': 'LowFatDiet',
    'low-sodium': 'LowSaltDiet',
    'high-protein': 'LowCalorieDiet',
    diabetic: 'DiabeticDiet',
    halal: 'HalalDiet',
    kosher: 'KosherDiet',
  };
  return map[slug] ?? 'Diet';
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function organizationJsonLd() {
  // sameAs is intentionally omitted — Google flags an empty array as a
  // schema warning. Add real URLs when social profiles exist.
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl('/logo.png'),
    foundingDate: SITE.founded,
    description: SITE.description,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/recipes?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function itemListJsonLd(items: { name: string; url: string; image?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data);
}
