import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, BookOpen, Leaf, ChefHat } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { BLOG_POSTS, getBlogPost } from '@/content/blog-posts';
import { HERBS } from '@/content/herbs';
import { getAllRecipes } from '@/lib/data/recipes';
import { breadcrumbJsonLd } from '@/lib/seo/structured-data';
import { absoluteUrl } from '@/lib/utils';

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Not found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: absoluteUrl(`/blog/${slug}`),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: absoluteUrl(
            `/api/og?eyebrow=Editorial&accent=forest&title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.description.slice(0, 110))}`,
          ),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

/**
 * Renders the lightweight markdown body. The body string in BlogPost uses:
 *   - paragraphs separated by \n\n
 *   - headings start with "## "
 *   - bold text wrapped in ** ** (simple inline)
 *
 * No JSX-injection of unknown HTML — only the patterns this renderer
 * recognizes. Safer than dropping in a full markdown lib for our scope.
 */
function renderBody(body: string): React.ReactNode {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="mt-10 font-serif text-2xl font-bold text-ink">
          {trimmed.slice(3).trim()}
        </h2>
      );
    }
    if (trimmed.startsWith('- ')) {
      // unordered list — split into items
      const items = trimmed.split(/\n- /).map((l) => l.replace(/^- /, '').trim());
      return (
        <ul key={i} className="mt-4 space-y-1.5">
          {items.map((it, j) => (
            <li key={j} className="flex items-start gap-2 text-base text-ink-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400" aria-hidden />
              <span dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="mt-4 text-base leading-relaxed text-ink-muted"
        dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
      />
    );
  });
}

// Inline transform — bold (**text**) only. No raw HTML allowed in source.
function renderInline(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong class="text-ink">$1</strong>');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` },
  ];

  const allRecipes = await getAllRecipes();
  const linkedRecipes = (post.relatedRecipes ?? [])
    .map((rs) => allRecipes.find((r) => r.slug === rs))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const linkedHerbs = (post.relatedHerbs ?? [])
    .map((hs) => HERBS.find((h) => h.slug === hs))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));

  // Other blog posts for "More articles" footer
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="container py-8 lg:py-12">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { '@type': 'Organization', name: post.author.name },
            publisher: {
              '@type': 'Organization',
              name: 'RecipeCrave',
              logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
            },
            mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
            keywords: post.keywords,
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/blog" className="hover:text-ink">Blog</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">{post.title}</li>
        </ol>
      </nav>

      <header className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <BookOpen className="h-3.5 w-3.5" aria-hidden /> Article
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">{post.title}</h1>
        <p className="mt-3 text-lg text-ink-muted">{post.description}</p>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-subtle">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden /> {post.readingTimeMin} min read
          </span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </time>
          <span aria-hidden>·</span>
          <span>by {post.author.name}</span>
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-3xl">{renderBody(post.body)}</div>

      <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-cream-100 p-5 text-xs text-ink-muted">
        <p>
          <strong className="text-ink">About the author.</strong> {post.author.bio}
        </p>
      </div>

      {linkedRecipes.length > 0 ? (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl">
            <ChefHat className="h-5 w-5 text-terracotta-500" aria-hidden />
            Recipes mentioned
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {linkedRecipes.map((r) => (
              <Link
                key={r.slug}
                href={`/recipes/${r.slug}`}
                className="group block rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="font-serif text-base font-bold text-ink group-hover:text-terracotta-500">
                  {r.title}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {r.totalTimeMin} min · {r.servings} servings
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {linkedHerbs.length > 0 ? (
        <section className="mx-auto mt-8 max-w-3xl">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl">
            <Leaf className="h-5 w-5 text-forest-700" aria-hidden />
            Therapeutic herbs referenced
          </h2>
          <div className="flex flex-wrap gap-2">
            {linkedHerbs.map((h) => (
              <Link
                key={h.slug}
                href={`/herbs/${h.slug}`}
                className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1.5 text-xs font-bold capitalize text-forest-700 hover:bg-forest-100"
              >
                {h.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-16 max-w-3xl border-t border-ink/10 pt-8">
        <h2 className="font-serif text-2xl">Keep reading</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {otherPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-serif text-base font-bold text-ink group-hover:text-terracotta-600">{p.title}</p>
              <p className="mt-2 line-clamp-3 text-xs text-ink-muted">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
