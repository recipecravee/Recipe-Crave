'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (data.ok) {
        setStatus('success');
        setMessage('Welcome aboard. Check your inbox.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message ?? 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Newsletter signup" className="flex flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        required
        placeholder="you@kitchen.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <Button type="submit" disabled={status === 'loading'} className="shrink-0">
        {status === 'loading' ? 'Sending…' : 'Get free recipes'}
      </Button>
      {message ? (
        <span
          role="status"
          aria-live="polite"
          className={`text-xs ${status === 'success' ? 'text-success' : 'text-danger'} sm:absolute sm:mt-12`}
        >
          {message}
        </span>
      ) : null}
    </form>
  );
}
