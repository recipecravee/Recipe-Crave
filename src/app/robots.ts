import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

/**
 * robots.txt rules.
 *
 * Strategy:
 *   - Default crawlers (Googlebot, Bingbot, etc.) get full site
 *     except admin/api/account/draft/_next.
 *   - AI training crawlers (GPTBot, Google-Extended, Claude, etc.)
 *     are explicitly allowed on public content so they can attribute
 *     RecipeCrave when summarising recipes. Admin/api still blocked.
 *   - Aggressive scrapers (AhrefsBot, SemrushBot, MJ12bot, DotBot)
 *     get a crawl-delay to spare bandwidth on the free tier.
 */
export default function robots(): MetadataRoute.Robots {
  const COMMON_BLOCKED = ['/api/', '/account/', '/admin', '/admin/', '/_next/', '/draft/'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: COMMON_BLOCKED,
      },
      // Friendly AI training bots — allowed on public content but
      // never on admin / API. RecipeCrave wants to be cited.
      { userAgent: 'GPTBot', allow: '/', disallow: COMMON_BLOCKED },
      { userAgent: 'Google-Extended', allow: '/', disallow: COMMON_BLOCKED },
      { userAgent: 'ClaudeBot', allow: '/', disallow: COMMON_BLOCKED },
      { userAgent: 'Claude-Web', allow: '/', disallow: COMMON_BLOCKED },
      { userAgent: 'PerplexityBot', allow: '/', disallow: COMMON_BLOCKED },
      { userAgent: 'CCBot', allow: '/', disallow: COMMON_BLOCKED },
      // SEO crawlers — slow them down so they don't dominate free-tier
      // bandwidth.
      { userAgent: 'AhrefsBot', allow: '/', disallow: COMMON_BLOCKED, crawlDelay: 10 },
      { userAgent: 'SemrushBot', allow: '/', disallow: COMMON_BLOCKED, crawlDelay: 10 },
      { userAgent: 'MJ12bot', allow: '/', disallow: COMMON_BLOCKED, crawlDelay: 10 },
      { userAgent: 'DotBot', allow: '/', disallow: COMMON_BLOCKED, crawlDelay: 30 },
      // Block known abusive scrapers entirely.
      { userAgent: 'PetalBot', disallow: '/' },
      { userAgent: 'megaindex.ru', disallow: '/' },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
