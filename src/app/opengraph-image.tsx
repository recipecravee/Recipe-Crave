import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/constants';

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F2EBDC 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: '#C75D3C',
              borderRadius: 12,
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
          <div style={{ display: 'flex', fontSize: 40, color: '#1F1B16', fontWeight: 600 }}>
            <span style={{ color: '#1F1B16' }}>Recipe</span>
            <span style={{ color: '#C75D3C' }}>Crave</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 72,
            color: '#1F1B16',
            fontWeight: 600,
            lineHeight: 1.05,
          }}
        >
          The AI cooking coach
        </div>
        <div style={{ display: 'flex', fontSize: 56, color: '#C75D3C', marginTop: 12, lineHeight: 1.1 }}>
          that turns what you have
        </div>
        <div style={{ display: 'flex', fontSize: 56, color: '#2F5D50', marginTop: 4, lineHeight: 1.1 }}>
          into what you crave.
        </div>

        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 'auto',
            fontSize: 22,
            color: '#6B6660',
            fontFamily: 'sans-serif',
          }}
        >
          <span>1000+ recipes</span>
          <span>AI meal planner</span>
          <span>100% free</span>
        </div>
      </div>
    ),
    size,
  );
}
