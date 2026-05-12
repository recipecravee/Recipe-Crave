'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Route-segment error boundary. Catches uncaught exceptions inside any
 * non-root route (`/recipes/...`, `/herbs/...`, etc.) so the user sees a
 * branded recovery page instead of the default Next.js error screen.
 *
 * Anything that escapes this boundary bubbles up to `global-error.tsx`.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side errors will already be logged by the framework; client-
    // side ones we surface to console so the user can attach the message
    // when reporting. No third-party logging — kept free + private.
    if (process.env.NODE_ENV !== 'production') {
      console.error('[route-error]', error);
    }
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-7xl text-terracotta-300">Oops</p>
      <h1 className="mt-4 font-serif text-3xl">Something burned in the kitchen.</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        We hit an unexpected error loading this page. The team has been notified.
        Try again — usually a refresh clears it.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-ink-subtle">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild><Link href="/">Back to home</Link></Button>
        <Button variant="outline" asChild><Link href="/recipes">Browse recipes</Link></Button>
      </div>
    </div>
  );
}
