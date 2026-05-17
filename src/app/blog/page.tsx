import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '@/content/blog-posts';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Blog — Evidence-Backed Cooking & Health',
  description:
    'Deep-dive articles on therapeutic herbs, blood-sugar management, anti-inflammatory eating, and the science behind cooking. Cited sources, real research, no wellness pseudoscience.',
  alternates: { canonical: '/blog' },
  keywords: [
    'food blog',
    'cooking science',
    'evidence based cooking',
    'turmeric vs ibuprofen',
    'anti-inflammatory diet',
    'diabetes diet plan',
    'gut health food',
  ],
};

export default function BlogLanding() {
  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const featured = sortedPosts[0]!;
  const rest = sortedPosts.slice(1);

  return (
    <div className="container py-10 lg:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ])}
      />
      <header className="mb-12 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <BookOpen className="h-3.5 w-3.5" aria-hidden /> The RecipeCrave Blog
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          Evidence-backed cooking &amp; health
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          Deep-dive articles on the science behind kitchen choices — what
          turmeric actually does, when bone broth helps, how cinnamon affects
          blood sugar. Sourced from peer-reviewed research, not wellness folklore.
        </p>
      </header>

      {/* Featured article */}
      <section className="mb-12">
        <Link
          href={`/blog/${featured.slug}`}
          className="group block rounded-3xl bg-gradient-to-br from-terracotta-50 via-cream-50 to-forest-50 p-6 shadow-sm transition-all hover:shadow-md sm:p-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            Featured · Most recent
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink group-hover:text-terracotta-600 sm:text-4xl">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base text-ink-muted sm:text-lg">{featured.description}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-subtle">
            <Clock className="h-3 w-3" aria-hidden /> {featured.readingTimeMin} min read · Updated{' '}
            {new Date(featured.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </p>
        </Link>
      </section>

      {/* Rest */}
      <section>
        <h2 className="mb-4 font-serif text-2xl">More articles</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-serif text-lg font-bold text-ink group-hover:text-terracotta-600">{post.title}</p>
              <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-subtle">
                <Clock className="h-3 w-3" aria-hidden /> {post.readingTimeMin} min read
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-cream-100 p-6 text-center">
        <p className="text-sm text-ink-muted">
          More articles publishing weekly. Topics requested? Email{' '}
          <a href="mailto:recipecrave@gmail.com" className="font-bold text-terracotta-600 hover:underline">
            recipecrave@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
