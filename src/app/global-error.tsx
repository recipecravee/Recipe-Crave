'use client';

import { useEffect } from 'react';

/**
 * Root error boundary. Fires when an error occurs in the root layout
 * itself, which means `<html>` and `<body>` have to be rendered by this
 * component since the layout is the thing that crashed.
 *
 * Keep it dependency-free (no Tailwind classes that rely on the layout's
 * stylesheet being loaded — they will be available via Next's build but
 * we use inline styles defensively so the page at least renders).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[global-error]', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          textAlign: 'center',
          padding: '2rem 1rem',
          background: '#FDF8F1',
          color: '#2A211A',
        }}
      >
        <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '4.5rem', color: '#E29683' }}>
          Oh no
        </p>
        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '2rem', marginTop: '0.5rem' }}>
          RecipeCrave hit a critical error.
        </h1>
        <p style={{ maxWidth: '32rem', marginTop: '0.75rem', color: '#6B5E54' }}>
          The site failed to load completely. Refresh to try again. If this keeps happening, email us at
          {' '}
          <a href="mailto:hello@recipecrave.com" style={{ color: '#D2735C', textDecoration: 'underline' }}>
            hello@recipecrave.com
          </a>
          .
        </p>
        {error.digest ? (
          <p style={{ fontSize: '0.75rem', color: '#8B7E73', marginTop: '0.5rem' }}>
            Reference: <code style={{ fontFamily: 'monospace' }}>{error.digest}</code>
          </p>
        ) : null}
        <button
          onClick={() => reset()}
          style={{
            marginTop: '2rem',
            background: '#D2735C',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
