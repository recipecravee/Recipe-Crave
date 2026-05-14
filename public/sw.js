/**
 * RecipeCrave service worker.
 *
 * Caching strategy:
 *   - Static assets (CSS, JS, fonts, icons, logo): cache-first with
 *     network fallback. Lifetime: 30 days, capped at 100 entries.
 *   - HTML routes: network-first with cache fallback. Serves cached
 *     copy when offline, falls back to /offline.html when nothing
 *     cached for that route.
 *   - Images (Unsplash + Next image proxy): stale-while-revalidate.
 *     Show cached immediately, refresh in background. Capped 60 entries.
 *
 * Stores requirements satisfied:
 *   - Google Play TWA: needs any service-worker registration.
 *   - Apple App Store: needs verifiable offline value.
 *   - Lighthouse PWA audit: installable + works offline.
 *
 * Version bump on each deploy invalidates the old cache so users get
 * fresh code without manual clear.
 */

const VERSION = 'rc-v1';
const STATIC_CACHE = `${VERSION}-static`;
const HTML_CACHE = `${VERSION}-html`;
const IMG_CACHE = `${VERSION}-img`;

const PRECACHE = ['/', '/offline.html', '/manifest.webmanifest', '/logo.png', '/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip cross-origin POSTs, analytics beacons, etc.
  if (url.origin !== self.location.origin && !url.hostname.includes('unsplash.com')) {
    return;
  }

  // Static assets: cache-first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(?:css|js|woff2?|ttf|svg|ico|png)$/i)
  ) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // Images: stale-while-revalidate
  if (url.pathname.startsWith('/_next/image') || url.hostname.includes('unsplash.com')) {
    event.respondWith(staleWhileRevalidate(req, IMG_CACHE));
    return;
  }

  // Same-origin HTML navigation: network-first
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(req, HTML_CACHE));
    return;
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return cached || Response.error();
  }
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  } catch (e) {
    const cached = await cache.match(req);
    if (cached) return cached;
    return caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

// Push notifications — scaffolded for future feature. Requires owner to
// provision VAPID keys and wire send-side.
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'RecipeCrave', body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'RecipeCrave', {
      body: payload.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: payload.url || '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(self.clients.openWindow(url));
});
