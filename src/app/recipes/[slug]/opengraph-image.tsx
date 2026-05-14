import { ImageResponse } from 'next/og';
import { getRecipeBySlug, getAllRecipes } from '@/lib/data/recipes';

export const alt = 'Recipe on RecipeCrave';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((r) => ({ slug: r.slug }));
}

/**
 * Per-recipe OG image. Pulled when this recipe is shared on social —
 * Twitter/X, Facebook, Slack, Discord, LinkedIn, iMessage all fetch
 * /recipes/{slug}/opengraph-image.png and render the result as the
 * preview card.
 *
 * Composition: split layout — left half = recipe title + cuisine +
 * time/servings/cost, right half = hero photo (Unsplash URL from
 * recipe.heroImage). When no hero image, falls back to gradient.
 */
export default async function RecipeOgImage({ params }: { params: { slug: string } }) {
  const recipe = await getRecipeBySlug(params.slug);
  if (!recipe) {
    // Defer to root OG by returning the wordmark — Next will still
    // produce a valid 1200×630.
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF7F2 0%, #F2EBDC 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 72,
            fontFamily: 'serif',
            color: '#1F1B16',
          }}
        >
          RecipeCrave
        </div>
      ),
      size,
    );
  }

  const title = recipe.title.length > 60 ? recipe.title.slice(0, 58) + '…' : recipe.title;
  const cuisine = recipe.cuisine ? recipe.cuisine.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : null;
  const cost =
    typeof recipe.costPerServingUsd === 'number' ? `$${recipe.costPerServingUsd.toFixed(2)}/serving` : null;
  const hero = recipe.heroImage;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAF7F2',
          width: '100%',
          height: '100%',
          display: 'flex',
          fontFamily: 'serif',
        }}
      >
        {/* Left text panel */}
        <div
          style={{
            flex: '1.1',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: '#C75D3C',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              R
            </div>
            <div style={{ display: 'flex', fontSize: 28, color: '#1F1B16', fontWeight: 600 }}>
              <span>Recipe</span>
              <span style={{ color: '#C75D3C' }}>Crave</span>
            </div>
          </div>

          {cuisine ? (
            <div
              style={{
                display: 'flex',
                fontSize: 18,
                color: '#C75D3C',
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: 'uppercase',
                marginBottom: 16,
                fontFamily: 'sans-serif',
              }}
            >
              {cuisine}
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              fontSize: 60,
              color: '#1F1B16',
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 28,
              marginTop: 'auto',
              fontSize: 22,
              color: '#6B6660',
              fontFamily: 'sans-serif',
            }}
          >
            <span>{recipe.totalTimeMin} min</span>
            <span>serves {recipe.servings}</span>
            {cost ? <span>{cost}</span> : null}
          </div>
        </div>

        {/* Right image panel */}
        <div
          style={{
            flex: '1',
            display: 'flex',
            background: hero
              ? `linear-gradient(135deg, #DA8B6D 0%, #2F5D50 100%)`
              : 'linear-gradient(135deg, #DA8B6D 0%, #2F5D50 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero}
              alt=""
              width={550}
              height={630}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 72,
                fontFamily: 'serif',
                color: 'white',
                opacity: 0.45,
              }}
            >
              {cuisine ?? 'Recipe'}
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
