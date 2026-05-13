import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PantryManager } from './PantryManager';

export const metadata: Metadata = {
  title: 'My pantry — RecipeCrave',
  robots: { index: false, follow: false },
};

export default async function PantryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account/pantry');

  return (
    <article className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/account" className="hover:text-ink">Account</Link></li>
          <li aria-hidden>/</li>
          <li className="text-ink">Pantry</li>
        </ol>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-terracotta-500">
          Your kitchen, synced
        </p>
        <h1 className="mt-1 font-serif text-4xl text-ink sm:text-5xl">My pantry</h1>
        <p className="mt-3 text-sm text-ink-muted">
          The ingredients you have on hand. Adds + removes sync across every device
          you log in on. Match recipes against this list anytime from{' '}
          <Link href="/pantry-match" className="font-semibold text-terracotta-500 hover:underline">
            Pantry Match
          </Link>
          .
        </p>
      </header>

      <PantryManager />
    </article>
  );
}
