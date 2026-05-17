import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin/auth';
import { ModerationQueue } from './ModerationQueue';

export const metadata: Metadata = {
  title: 'Variation moderation — Admin',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function AdminVariationsPage() {
  const c = await cookies();
  const session = verifySession(c.get(ADMIN_COOKIE_NAME)?.value);
  if (!session.ok) redirect('/admin/login?next=/admin/variations');

  return (
    <div className="container py-10 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/admin/dashboard" className="hover:text-ink">Admin dashboard</Link></li>
          <li aria-hidden>/</li>
          <li className="text-ink">Variation moderation</li>
        </ol>
      </nav>

      <header className="mb-8 border-b border-ink/10 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
          Owner area · moderation queue
        </p>
        <h1 className="mt-1 font-serif text-4xl text-ink">Recipe variation moderation</h1>
        <p className="mt-2 text-sm text-ink-muted">
          User-submitted variations of recipes. Approve to make visible on the public recipe
          page; reject to dismiss; spam to flag for stricter filtering. Submitter never sees the
          outcome — moderation is silent.
        </p>
      </header>

      <ModerationQueue />
    </div>
  );
}
