import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/content/blog-posts';
import { SITE } from '@/lib/constants';

export const runtime = 'nodejs';
export const revalidate = 600;

/**
 * Google News sitemap (RFC + Google's news extension). Surfaces blog
 * posts published in the last 48 hours to /news-sitemap.xml so they
 * are eligible for the Top stories carousel and Google News inclusion.
 *
 * Spec: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 *
 * Notes:
 *   - Google News requires items < 2 days old. Older posts return 0
 *     entries; that is correct behaviour, not a bug.
 *   - Publication name + language are required by the spec.
 *   - Generation date must be RFC 3339.
 */
export async function GET() {
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const recent = BLOG_POSTS.filter((p) => new Date(p.publishedAt).getTime() > cutoff);

  const items = recent
    .map(
      (p) => `  <url>
    <loc>${SITE.url}/blog/${p.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${esc(SITE.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(p.publishedAt).toISOString()}</news:publication_date>
      <news:title>${esc(p.title)}</news:title>
      ${p.keywords.length > 0 ? `<news:keywords>${esc(p.keywords.slice(0, 10).join(', '))}</news:keywords>` : ''}
    </news:news>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
