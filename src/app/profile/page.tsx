import type { Metadata } from 'next';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import { HealthProfileClient } from './HealthProfileClient';

export const metadata: Metadata = {
  title: 'Your Health Profile — Personalized Recipe Recommendations',
  description:
    'Build your health profile in 60 seconds. We use it to recommend recipes, herbs, and meal plans that match your conditions, dietary preferences, allergies, and cooking goals. Free, stored only in your browser.',
  alternates: { canonical: '/profile' },
  robots: { index: false, follow: true },
};

export default function HealthProfilePage() {
  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/account" className="hover:text-ink">Account</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">Health profile</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <UserCircle className="h-3.5 w-3.5" aria-hidden /> Personalization
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Your health profile</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Tell us about the conditions you manage, your dietary preferences,
          allergies, and cooking goals. We&apos;ll personalize recipe + meal-plan
          + herb recommendations across the site. Stored only in your browser
          — never uploaded.
        </p>
      </header>

      <HealthProfileClient />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-cream-100 p-6">
        <h2 className="font-serif text-xl">How we use your profile</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li>• <strong className="text-ink">Recipe filtering</strong> — your dashboard surfaces dishes that match your conditions + diet + allergies</li>
          <li>• <strong className="text-ink">Meal plan auto-pick</strong> — we suggest the 30-day plan that aligns with your top condition</li>
          <li>• <strong className="text-ink">Herb safety</strong> — cross-references with the <Link href="/safety-check" className="font-bold text-terracotta-600 hover:underline">drug interaction checker</Link> for active medications</li>
          <li>• <strong className="text-ink">Browser-only storage</strong> — clear your browser data and the profile resets</li>
        </ul>
      </section>
    </div>
  );
}
