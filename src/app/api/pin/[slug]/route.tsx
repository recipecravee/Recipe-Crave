/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { getRecipeBySlug } from '@/lib/data/recipes';

/**
 * Pinterest-optimized vertical pin (1000×1500). Pinterest's algorithm
 * strongly favors 2:3 vertical images. Fetched on-demand via Edge runtime.
 *
 * URL: GET /api/pin/{slug}.png
 *
 * Used by:
 *   - <meta name="pinterest:src"> in recipe page metadata
 *   - <PinItButton> client component to deep-link to Pinterest with this
 *     image as the pin source
 */
export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const cleanSlug = slug.replace(/\.png$/, '');
  const recipe = await getRecipeBySlug(cleanSlug);

  const title = recipe?.title ?? 'RecipeCrave';
  const heroImage = recipe?.heroImage ?? '';
  const meta = recipe
    ? `${recipe.totalTimeMin} min · ${recipe.servings} servings · ${recipe.cuisine ?? 'recipe'}`
    : 'Free recipes · no paywall';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #FAF7F2 0%, #F2EBDC 100%)',
        }}
      >
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            width={1000}
            height={750}
            style={{ width: 1000, height: 750, objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: 1000, height: 750, background: '#c75d3c' }} />
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#c75d3c',
            color: 'white',
            padding: '24px 50px',
          }}
        >
          <span style={{ fontSize: 38, fontWeight: 800 }}>
            Recipe<span style={{ color: '#fae3b0' }}>Crave</span>
          </span>
          <span style={{ fontSize: 22, opacity: 0.9 }}>recipecrave.com</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '50px',
            color: '#1f1b16',
            flex: 1,
          }}
        >
          <div style={{ fontSize: 68, lineHeight: 1.1, fontWeight: 700 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.4, color: '#6b6660', marginTop: 24 }}>
            {meta}
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#c75d3c',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 4,
              marginTop: 'auto',
            }}
          >
            Free · No paywall · Save & print
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 1500,
    },
  );
}
