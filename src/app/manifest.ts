import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF7F2',
    theme_color: '#C75D3C',
    orientation: 'portrait-primary',
    categories: ['food', 'lifestyle', 'productivity'],
    icons: [
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    ],
  };
}
