import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How-To Guides — Cooking Techniques Explained',
  description:
    'Master the kitchen with clear, beginner-friendly cooking technique guides. From knife skills to bread-baking, our how-to library teaches the fundamentals.',
  alternates: { canonical: '/how-to' },
};

const GUIDES = [
  { slug: 'how-to-poach-an-egg', title: 'How to Poach an Egg' },
  { slug: 'how-to-julienne-vegetables', title: 'How to Julienne Vegetables' },
  { slug: 'how-to-make-a-roux', title: 'How to Make a Roux' },
  { slug: 'how-to-temper-chocolate', title: 'How to Temper Chocolate' },
  { slug: 'how-to-cook-perfect-rice', title: 'How to Cook Perfect Rice' },
  { slug: 'how-to-brown-butter', title: 'How to Brown Butter' },
];

export default function HowToIndex() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">How-To Guides</h1>
        <p className="mt-3 text-ink-muted">
          Cooking techniques explained without gatekeeping. Pick a skill, learn it once, use it forever.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/how-to/${g.slug}`}
            className="block rounded-2xl border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md focus-ring"
          >
            <p className="text-xs uppercase tracking-wider text-terracotta-500">Coming soon</p>
            <h2 className="mt-1 font-serif text-lg">{g.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
