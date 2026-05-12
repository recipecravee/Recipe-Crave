import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAllRecipes } from '@/lib/data/recipes';
import { SignOutButton } from './SignOutButton';
import { AccountDashboard } from './AccountDashboard';

export const metadata: Metadata = {
  title: 'My account',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Project recipe catalog to a lightweight client payload so the dashboard
  // can hydrate saved/recent slugs from localStorage and render cards
  // without an extra fetch.
  const all = await getAllRecipes();
  const catalog = all.map((r) => ({
    slug: r.slug,
    title: r.title,
    heroImage: r.heroImage,
    totalTimeMin: r.totalTimeMin,
    servings: r.servings,
    cuisine: r.cuisine,
    course: r.course,
  }));

  return (
    <>
      <div className="container pt-8 print:hidden">
        <div className="flex items-center justify-end">
          <SignOutButton />
        </div>
      </div>
      <AccountDashboard userEmail={user.email ?? 'cook'} catalog={catalog} />
    </>
  );
}
