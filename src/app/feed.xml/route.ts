import { NextResponse } from 'next/server';
import { getAllRecipes } from '@/lib/data/recipes';
import { BLOG_POSTS } from '@/content/blog-posts';
import { SITE } from '@/lib/constants';

export const runtime = 'nodejs';
export const revalidate = 3600;

/**
 * RSS 2.0 feed combining recipes + blog posts.
 *
 * Sorted by publishedAt desc, capped at 50 most recent items so the
 * payload stays small. RSS readers, IFTTT/Zapier, and content
 * aggregators (Feedly, Inoreader) auto-discover via the
 * <link rel="alternate" type="application/rss+xml"> tag we ship from
 * layout's <head>.
 */
export async function GET() {
  const recipes = await getAllRecipes();
  const items: Array<{ title: string; link: string; description: string; pubDate: string; guid: string; category?: string }> = [];

  for (const r of recipes.slice(0, 50)) {
    items.push({
      title: r.title,
      link: `${SITE.url}/recipes/${r.slug}`,
      description: r.description,
      pubDate: new Date(r.publishedAt).toUTCString(),
      guid: `${SITE.url}/recipes/${r.slug}`,
      category: r.cuisine || undefined,
    });
  }
  for (const p of BLOG_POSTS.slice(0, 20)) {
    items.push({
      title: p.title,
      link: `${SITE.url}/blog/${p.slug}`,
      description: p.description,
      pubDate: new Date(p.publishedAt).toUTCString(),
      guid: `${SITE.url}/blog/${p.slug}`,
      category: 'Editorial',
    });
  }
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  const top = items.slice(0, 50);

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${esc(SITE.tagline)}</description>
    <language>en-us</language>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${SITE.url}/logo.png</url>
      <title>${esc(SITE.name)}</title>
      <link>${SITE.url}</link>
    </image>
${top
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.link}</link>
      <description>${esc(i.description)}</description>
      <pubDate>${i.pubDate}</pubDate>
      <guid isPermaLink="true">${i.guid}</guid>${i.category ? `\n      <category>${esc(i.category)}</category>` : ''}
      <dc:creator>RecipeCrave Editorial</dc:creator>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
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
