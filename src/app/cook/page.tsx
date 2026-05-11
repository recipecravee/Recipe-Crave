import type { Metadata } from 'next';
import Link from 'next/link';
import { Mic, Search } from 'lucide-react';
import { getAllRecipes } from '@/lib/data/recipes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Voice Cook Mode — Hands-free Cooking',
  description:
    'Cook with your phone untouched. RecipeCrave reads each step out loud, listens for "next" and "repeat," and keeps your screen awake while your hands stay floury.',
  alternates: { canonical: '/cook' },
};

export default async function CookHubPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const recipes = await getAllRecipes();
  const filtered = q
    ? recipes
        .filter((r) => r.title.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 12)
    : recipes.slice(0, 12);

  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-10 max-w-2xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-500">
          <Mic className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">Voice Cook Mode</h1>
        <p className="mt-3 text-ink-muted">
          Pick a recipe. We read each step out loud. Say <em>&ldquo;next&rdquo;</em>,{' '}
          <em>&ldquo;back&rdquo;</em>, or <em>&ldquo;repeat&rdquo;</em> and the steps advance. Your
          phone stays awake. Your hands stay clean.
        </p>
      </header>

      <form action="/cook" method="get" className="mb-8 flex max-w-xl items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
          <Input name="q" defaultValue={q ?? ''} placeholder="Find a recipe to cook…" className="pl-10" />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <h2 className="mb-4 font-serif text-2xl">
        {q ? `Results for "${q}"` : 'Popular tonight'}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Link
            key={r.slug}
            href={`/recipes/${r.slug}#cook`}
            className="flex items-center gap-3 rounded-xl border border-ink/5 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <Mic className="h-4 w-4 shrink-0 text-terracotta-500" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{r.title}</p>
              <p className="text-xs text-ink-muted">
                {r.totalTimeMin} min · {r.instructions.length} steps
              </p>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-2xl bg-cream-200/40 p-6">
        <h2 className="font-serif text-xl">How it works</h2>
        <ol className="mt-3 space-y-2 text-sm text-ink-muted">
          <li>
            <strong className="text-ink">1.</strong> Pick a recipe above (or open any recipe and tap{' '}
            <em>Start Voice Cook</em>).
          </li>
          <li>
            <strong className="text-ink">2.</strong> Allow microphone access when your browser asks.
            We never record audio. Everything runs on-device.
          </li>
          <li>
            <strong className="text-ink">3.</strong> Say &ldquo;next,&rdquo; &ldquo;back,&rdquo;{' '}
            &ldquo;repeat,&rdquo; or &ldquo;pause&rdquo;. Or tap the buttons. Whichever your hands
            can do at that moment.
          </li>
        </ol>
        <p className="mt-4 text-xs text-ink-subtle">
          Voice mode uses the browser&apos;s built-in Web Speech API. Works best in Chrome, Edge,
          and Safari. iOS Safari may require tapping the screen once to enable audio playback.
        </p>
      </section>
    </div>
  );
}
