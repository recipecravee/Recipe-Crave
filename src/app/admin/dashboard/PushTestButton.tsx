'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * Owner-only button that POSTs to /api/admin/push-test, fanning a test
 * push to every active subscription. Mirrors what the 09:00 daily-digest
 * cron does — lets the owner confirm VAPID is wired without waiting.
 *
 * Renders inline status (sent / failed / total) under the button after
 * each call. Disables while in-flight to avoid double-fires.
 */
export function PushTestButton() {
  const [status, setStatus] = useState<
    | { state: 'idle' }
    | { state: 'sending' }
    | { state: 'done'; sent: number; failed: number; total: number; message?: string }
    | { state: 'error'; error: string }
  >({ state: 'idle' });

  async function send() {
    setStatus({ state: 'sending' });
    try {
      const res = await fetch('/api/admin/push-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'RecipeCrave admin test',
          body: 'If you see this, VAPID + service worker are wired correctly.',
          url: 'https://www.recipecrave.com',
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        sent?: number;
        failed?: number;
        total?: number;
        message?: string;
      };
      if (!res.ok || !json.ok) {
        setStatus({ state: 'error', error: json.error ?? `HTTP ${res.status}` });
        return;
      }
      setStatus({
        state: 'done',
        sent: json.sent ?? 0,
        failed: json.failed ?? 0,
        total: json.total ?? 0,
        ...(json.message ? { message: json.message } : {}),
      });
    } catch (e) {
      setStatus({ state: 'error', error: e instanceof Error ? e.message : 'unknown' });
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Send className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-500" aria-hidden />
        <div className="flex-1">
          <p className="font-serif text-lg font-bold text-ink">Fire a test push</p>
          <p className="mt-1 text-sm text-ink-muted">
            Fans a single test notification to every active subscription. Mirrors
            what the 09:00 UTC daily digest does — use it to confirm VAPID and
            the service worker are wired before waiting for the cron.
          </p>
          <button
            type="button"
            onClick={send}
            disabled={status.state === 'sending'}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-terracotta-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.state === 'sending' ? 'Sending…' : 'Send test push'}
          </button>

          {status.state === 'done' ? (
            <div className="mt-3 inline-flex items-start gap-2 rounded-lg bg-forest-50 px-3 py-2 text-sm text-forest-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden />
              <span>
                Sent <strong>{status.sent}</strong> / failed{' '}
                <strong>{status.failed}</strong> / total{' '}
                <strong>{status.total}</strong>
                {status.message ? <> — {status.message}</> : null}
              </span>
            </div>
          ) : null}

          {status.state === 'error' ? (
            <div className="mt-3 inline-flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
              <span>{status.error}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
