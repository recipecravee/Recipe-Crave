/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.spoonacular.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'imagedelivery.net' },
    ],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },
  async redirects() {
    // 301 redirects for slug renames. Preserves any inbound links and prevents
    // SEO duplicate-content penalties when canonical paths change.
    return [
      // Typo fixes — old misspelled slugs to the canonical spelling
      { source: '/recipes/carribean-rice-and-peas', destination: '/recipes/caribbean-rice-and-peas', permanent: true },
      { source: '/recipes/yam-and-sweet-ptatoes', destination: '/recipes/yam-and-sweet-potatoes', permanent: true },
      // Duplicate-recipe merges — old slug folds into canonical
      { source: '/recipes/zobo', destination: '/recipes/zobo-hibiscus-drink', permanent: true },
      { source: '/recipes/akara', destination: '/recipes/akara-bean-fritters', permanent: true },
    ];
  },
};

// Lazy-load Sentry only if auth token is set, so missing Sentry env doesn't break builds.
async function withOptionalSentry(config) {
  if (!process.env.SENTRY_AUTH_TOKEN) return config;
  try {
    const { withSentryConfig } = await import('@sentry/nextjs');
    return withSentryConfig(config, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
    });
  } catch {
    return config;
  }
}

export default await withOptionalSentry(nextConfig);
