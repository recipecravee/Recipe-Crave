'use client';

import dynamic from 'next/dynamic';

/**
 * Single client wrapper that lazy-mounts every non-critical floating
 * widget. The dynamic() calls live in a client component so we can use
 * `ssr: false` (Next.js forbids it in Server Components like the root
 * layout). Importing this from the layout costs one static import; the
 * underlying widget chunks load on idle.
 */
const FloatingLanguageSelector = dynamic(() => import('./FloatingLanguageSelector').then((m) => m.FloatingLanguageSelector), { ssr: false });
const WelcomePopup = dynamic(() => import('./WelcomePopup').then((m) => m.WelcomePopup), { ssr: false });
const CookieBanner = dynamic(() => import('./CookieBanner').then((m) => m.CookieBanner), { ssr: false });
const StreakTracker = dynamic(() => import('./StreakTracker').then((m) => m.StreakTracker), { ssr: false });
const SplashLoader = dynamic(() => import('./SplashLoader').then((m) => m.SplashLoader), { ssr: false });
const RouteProgress = dynamic(() => import('./RouteProgress').then((m) => m.RouteProgress), { ssr: false });
const FloatingBackButton = dynamic(() => import('./FloatingBackButton').then((m) => m.FloatingBackButton), { ssr: false });

export function LazyFloatingWidgets() {
  return (
    <>
      <SplashLoader />
      <RouteProgress />
      <FloatingBackButton />
      <FloatingLanguageSelector />
      <WelcomePopup />
      <CookieBanner />
      <StreakTracker />
    </>
  );
}
