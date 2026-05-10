import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, Calendar, ShoppingCart, Camera, Settings as SettingsIcon } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { SignOutButton } from './SignOutButton';

export const metadata: Metadata = {
  title: 'My account',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
        </div>
        <SignOutButton />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Heart, href: '/account/saved', title: 'Saved recipes', body: 'Your library of saved recipes, organized.' },
          { icon: Calendar, href: '/meal-planner', title: 'Meal planner', body: 'Build a week from your budget and pantry.' },
          { icon: ShoppingCart, href: '/account/grocery', title: 'Grocery lists', body: 'Consolidated lists, ready to export.' },
          { icon: Camera, href: '/pantry-match', title: 'Pantry scan', body: 'Photo your fridge → matching recipes.' },
          { icon: SettingsIcon, href: '/account/settings', title: 'Preferences', body: 'Diet, allergies, units, budget.' },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group block rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-ring"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-100">
              <card.icon className="h-5 w-5 text-terracotta-500" aria-hidden />
            </div>
            <h2 className="mt-4 font-serif text-lg group-hover:text-terracotta-500">{card.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{card.body}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-2xl bg-cream-200/40 p-6">
        <h2 className="font-serif text-xl">Quick start</h2>
        <p className="mt-1 text-sm text-ink-muted">New here? Build your first meal plan in under 60 seconds.</p>
        <Button asChild className="mt-4">
          <Link href="/meal-planner">Generate my first plan</Link>
        </Button>
      </section>
    </div>
  );
}
