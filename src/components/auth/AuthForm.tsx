'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const supabase = createSupabaseBrowserClient();

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
        if (error) throw error;
        setStatus('success');
        setMessage('Check your inbox to confirm your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus('success');
        setMessage('Logged in. Redirecting…');
        router.refresh();
        setTimeout(() => router.push('/account'), 500);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Authentication failed.');
    }
  }

  async function handleGoogle() {
    const supabase = createSupabaseBrowserClient();
    setStatus('loading');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative mt-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@kitchen.com"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative mt-1">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" disabled={status === 'loading'} size="lg" className="w-full">
          {status === 'loading' ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
        </Button>

        {message ? (
          <div
            role={status === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            className={`flex items-start gap-2 rounded-md p-3 text-sm ${
              status === 'error'
                ? 'bg-danger/10 text-danger'
                : 'bg-success/10 text-success'
            }`}
          >
            {status === 'error' ? (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        ) : null}
      </form>

      <div className="relative my-5 flex items-center">
        <div className="flex-1 border-t border-ink/10" />
        <span className="px-3 text-xs text-ink-subtle">or</span>
        <div className="flex-1 border-t border-ink/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={handleGoogle}
        disabled={status === 'loading'}
      >
        Continue with Google
      </Button>

      {mode === 'signin' ? (
        <p className="mt-4 text-center text-xs text-ink-subtle">
          <a href="#" className="hover:text-ink-muted">Forgot your password?</a>
        </p>
      ) : null}
    </div>
  );
}
