import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';
import { HOW_TO_GUIDES } from '@/content/how-to-guides';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'How-To Guides — Cooking Techniques Explained',
  description:
    'Master kitchen fundamentals with clear, beginner-friendly technique guides. From poaching eggs to tempering chocolate, our how-to library teaches the skills professional cooks rely on.',
  alternates: { canonical: '/how-to' },
};

export default function HowToIndex() {
  return (
    <div className="container py-10 lg:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'How-To Guides', url: '/how-to' },
        ])}
      />
      <header className="mb-12 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <BookOpen className="h-3.5 w-3.5" aria-hidden /> Technique Library
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">How-To Guides</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Cooking techniques explained without gatekeeping. Pick a skill, learn
          it once, use it forever. Each guide covers the technique, common
          mistakes, and the dishes that use it.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {HOW_TO_GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/how-to/${g.slug}`}
            className="group block rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-ring"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta-500">
              {g.difficulty}
            </p>
            <h2 className="mt-2 font-serif text-xl font-bold text-ink group-hover:text-terracotta-600">
              {g.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{g.excerpt}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-ink-subtle">
              <Clock className="h-3 w-3" aria-hidden /> {g.readingTimeMin} min read
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-2xl bg-cream-100 p-6 text-center">
        <p className="text-sm text-ink-muted">
          More guides publishing regularly. Want a specific technique covered?
          Email <a href="mailto:recipecrave@gmail.com" className="font-bold text-terracotta-600 hover:underline">recipecrave@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
