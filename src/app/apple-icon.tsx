import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F4D8CB 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          gap: 4,
        }}
      >
        <div style={{ fontSize: 72, color: '#C75D3C', fontWeight: 700, lineHeight: 1 }}>R</div>
        <div style={{ fontSize: 18, color: '#1F1B16', fontWeight: 600, letterSpacing: 1 }}>CRAVE</div>
      </div>
    ),
    size,
  );
}
