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

  const cards = [
    { icon: Calendar, href: '/meal-planner', title: 'Meal planner', body: 'Build a week from your budget and pantry.', ready: true },
    { icon: Camera, href: '/pantry-match', title: 'Pantry scan', body: 'Photo your fridge → matching recipes.', ready: true },
    { icon: Heart, href: '/recipes', title: 'Saved recipes', body: 'Your library of saved recipes, organized.', ready: false },
    { icon: ShoppingCart, href: '/pantry-match', title: 'Grocery lists', body: 'Consolidated lists, ready to export.', ready: false },
    { icon: SettingsIcon, href: '/account', title: 'Preferences', body: 'Diet, allergies, units, budget.', ready: false },
  ];

  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">Dashboard</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-ink sm:text-5xl">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-muted">{user.email}</p>
        </div>
        <SignOutButton />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative block rounded-2xl border-2 border-ink/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta-300 hover:shadow-md focus-ring"
          >
            {!card.ready ? (
              <span className="absolute right-4 top-4 rounded-full bg-cream-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Coming soon
              </span>
            ) : null}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-100 group-hover:bg-terracotta-200">
              <card.icon className="h-5 w-5 text-terracotta-500" aria-hidden />
            </div>
            <h2 className="mt-4 font-serif text-xl font-bold text-ink group-hover:text-terracotta-500">{card.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{card.body}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-2xl bg-gradient-to-br from-cream-200/60 to-terracotta-50 p-6 lg:p-8">
        <h2 className="font-serif text-2xl font-bold text-ink">Quick start</h2>
        <p className="mt-1 text-ink-muted">New here? Build your first meal plan in under 60 seconds.</p>
        <Button asChild size="lg" className="mt-5">
          <Link href="/meal-planner">Generate my first plan</Link>
        </Button>
      </section>
    </div>
  );
}
