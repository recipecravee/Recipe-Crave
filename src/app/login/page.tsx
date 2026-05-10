import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to RecipeCrave to save recipes, build meal plans, and sync across devices.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-ink">Welcome back</h1>
          <p className="mt-2 text-ink-muted">Log in to RecipeCrave</p>
        </header>
        <AuthForm mode="signin" />
        <p className="mt-6 text-center text-sm text-ink-muted">
          New here?{' '}
          <Link href="/signup" className="font-medium text-terracotta-500 hover:text-terracotta-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
