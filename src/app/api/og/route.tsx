import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/**
 * /api/og — dynamic OG image generator for arbitrary pages.
 *
 * Query params:
 *   title    (required) — main headline, capped at 80 chars
 *   subtitle (optional) — secondary line, capped at 120 chars
 *   eyebrow  (optional) — small uppercase label above title
 *   accent   (optional) — 'terracotta' (default) | 'forest' | 'amber'
 *
 * Used by blog posts, how-to guides, and any page that wants a custom
 * card without ImageResponse logic in its own route file. Output is
 * cached by Vercel edge for 1 day.
 *
 * Examples:
 *   /api/og?title=Bone+Broth+Gut+Healing&eyebrow=Editorial
 *   /api/og?title=Whole30+Meal+Plan&subtitle=30+days+structured&accent=forest
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') ?? 'RecipeCrave').slice(0, 80);
  const subtitle = (searchParams.get('subtitle') ?? '').slice(0, 120);
  const eyebrow = (searchParams.get('eyebrow') ?? '').slice(0, 40);
  const accent = (searchParams.get('accent') ?? 'terracotta') as 'terracotta' | 'forest' | 'amber';

  const accentColor =
    accent === 'forest' ? '#2F5D50' : accent === 'amber' ? '#D08F30' : '#C75D3C';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAF7F2',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '70px 80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'auto' }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: accentColor,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#1F1B16', fontWeight: 600 }}>
            <span>Recipe</span>
            <span style={{ color: accentColor }}>Crave</span>
          </div>
        </div>

        {/* Body */}
        {eyebrow ? (
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              color: accentColor,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom: 18,
              fontFamily: 'sans-serif',
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 50 ? 56 : 68,
            color: '#1F1B16',
            fontWeight: 600,
            lineHeight: 1.1,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: '#6B6660',
              lineHeight: 1.4,
              marginTop: 18,
              fontFamily: 'sans-serif',
              maxWidth: 1040,
            }}
          >
            {subtitle}
          </div>
        ) : null}

        {/* Right-edge accent bar */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 14,
            background: accentColor,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      },
    },
  );
}
