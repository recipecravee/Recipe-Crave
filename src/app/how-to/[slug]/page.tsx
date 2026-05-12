import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ChefHat, BookOpen } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { HOW_TO_GUIDES, getHowToGuide } from '@/content/how-to-guides';
import { breadcrumbJsonLd } from '@/lib/seo/structured-data';
import { absoluteUrl } from '@/lib/utils';

export async function generateStaticParams() {
  return HOW_TO_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getHowToGuide(slug);
  if (!guide) return { title: 'Not found' };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/how-to/${slug}` },
    keywords: guide.keywords,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url: absoluteUrl(`/how-to/${slug}`),
    },
  };
}

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
    if (/^\d+\. /m.test(trimmed)) {
      // Ordered list
      const items = trimmed.split(/\n(?=\d+\. )/).map((l) => l.replace(/^\d+\. /, '').trim());
      return (
        <ol key={i} className="mt-4 list-decimal space-y-2 pl-6 text-base text-ink-muted">
          {items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
          ))}
        </ol>
      );
    }
    if (trimmed.startsWith('- ')) {
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

function renderInline(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong class="text-ink">$1</strong>');
}

export default async function HowToPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getHowToGuide(slug);
  if (!guide) notFound();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'How-To', url: '/how-to' },
    { name: guide.title, url: `/how-to/${slug}` },
  ];

  const otherGuides = HOW_TO_GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <article className="container py-8 lg:py-12">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: guide.title,
            description: guide.description,
            totalTime: `PT${guide.readingTimeMin}M`,
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/how-to" className="hover:text-ink">How-To Guides</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">{guide.title}</li>
        </ol>
      </nav>

      <header className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <BookOpen className="h-3.5 w-3.5" aria-hidden /> How-To Guide · {guide.difficulty}
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">{guide.title}</h1>
        <p className="mt-3 text-lg text-ink-muted">{guide.description}</p>
        <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-ink-subtle">
          <Clock className="h-3 w-3" aria-hidden /> {guide.readingTimeMin} min read
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-3xl">{renderBody(guide.body)}</div>

      <section className="mx-auto mt-16 max-w-3xl border-t border-ink/10 pt-8">
        <h2 className="font-serif text-2xl">Keep learning</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {otherGuides.map((g) => (
            <Link
              key={g.slug}
              href={`/how-to/${g.slug}`}
              className="group block rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-serif text-base font-bold text-ink group-hover:text-terracotta-600">{g.title}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-ink-subtle">
                <Clock className="h-3 w-3" aria-hidden /> {g.readingTimeMin} min
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-cream-100 p-6">
        <p className="flex items-center gap-2 font-serif text-base font-bold text-ink">
          <ChefHat className="h-4 w-4 text-terracotta-500" aria-hidden />
          Put this technique to work
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Browse the full <Link href="/recipes" className="font-bold text-terracotta-600 hover:underline">recipe catalog</Link> for dishes that use this technique — or generate a personalized meal plan with our{' '}
          <Link href="/meal-planner" className="font-bold text-terracotta-600 hover:underline">AI Meal Planner</Link>.
        </p>
      </section>
    </article>
  );
}
