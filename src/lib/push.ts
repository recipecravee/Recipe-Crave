/**
 * Web Push subscription helpers (client-side).
 *
 * Flow:
 *   1. User taps "Enable" on PushNotificationPrompt.
 *   2. Browser prompts for Notification permission.
 *   3. On grant, subscribe via the registered service worker:
 *      registration.pushManager.subscribe({ applicationServerKey })
 *   4. POST the resulting subscription object to /api/push/subscribe.
 *   5. Server stores it; daily-digest cron later sends pushes to every
 *      stored subscription.
 *
 * Owner action to fully activate:
 *   - Generate VAPID keypair: `npx web-push generate-vapid-keys`
 *   - Set in Vercel: NEXT_PUBLIC_VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY
 *   - Apply the push_subscriptions table migration in Supabase
 *
 * Until VAPID keys exist this hook stays disabled — usePushSupported()
 * returns false so the UI never prompts.
 */

const PROMPT_DISMISSED_KEY = 'rc:push-prompt-dismissed';

export function getVapidPublicKey(): string | null {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  return key && key.length > 20 ? key : null;
}

export function pushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  if (!('serviceWorker' in navigator)) return false;
  if (!('PushManager' in window)) return false;
  if (!('Notification' in window)) return false;
  return Boolean(getVapidPublicKey());
}

export function isPromptDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return Boolean(window.localStorage.getItem(PROMPT_DISMISSED_KEY));
  } catch {
    return false;
  }
}

export function dismissPrompt(): void {
  try {
    window.localStorage.setItem(PROMPT_DISMISSED_KEY, String(Date.now()));
  } catch {
    /* swallow */
  }
}

function urlBase64ToUint8Array(b64: string): Uint8Array {
  const padding = '='.repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr;
}

export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  if (!pushSupported()) return { ok: false, error: 'Push not supported on this device' };
  const vapid = getVapidPublicKey();
  if (!vapid) return { ok: false, error: 'Push not configured server-side' };

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { ok: false, error: permission === 'denied' ? 'Notifications blocked' : 'Permission not granted' };
    }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        // Cast to BufferSource — Uint8Array<ArrayBufferLike> is compatible
        // at runtime; TS lib types are over-strict here.
        applicationServerKey: urlBase64ToUint8Array(vapid).buffer as ArrayBuffer,
      });
    }
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
    if (!res.ok) return { ok: false, error: 'Could not register subscription' };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Subscribe failed' };
  }
}
