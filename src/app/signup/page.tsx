import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Sign up — Free forever',
  description: 'Create a free RecipeCrave account to save recipes, build AI meal plans, and access pantry-aware suggestions.',
  alternates: { canonical: '/signup' },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-ink">Create your account</h1>
          <p className="mt-2 text-ink-muted">
            Free forever. No credit card. No paywall in your way.
          </p>
        </header>
        <AuthForm mode="signup" />
        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-terracotta-500 hover:text-terracotta-600">
            Log in
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-ink-subtle">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline">Terms</Link> and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
