import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

/**
 * Web App Manifest. Loaded automatically by Next.js at /manifest.webmanifest.
 *
 * Icon set covers:
 *   - any-purpose at 192 + 512 for browser tab/install
 *   - maskable-purpose at 512 (with 20% safe-area padding + brand
 *     background) for Android adaptive-icon launchers that crop/mask
 *   - apple-touch-icon (180×180, shipped separately via the layout
 *     <head> link) for iOS home-screen pin
 *
 * Shortcuts surface common destinations directly from the long-press
 * menu on installed PWAs.
 */
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
    lang: 'en',
    dir: 'ltr',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
    ],
    shortcuts: [
      {
        name: 'AI Meal Planner',
        short_name: 'Meal Plan',
        description: 'Generate a week of meals',
        url: '/meal-planner',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Pantry Scan',
        short_name: 'Pantry',
        description: 'Snap your fridge, get recipes',
        url: '/pantry-match',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Browse Recipes',
        short_name: 'Recipes',
        description: 'All recipes',
        url: '/recipes',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
