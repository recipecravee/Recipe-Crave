import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ScrollToTop } from '@/components/site/ScrollToTop';
import { GoogleAnalytics } from '@/components/site/GoogleAnalytics';
import { FloatingLanguageSelector } from '@/components/site/FloatingLanguageSelector';
import { WelcomePopup } from '@/components/site/WelcomePopup';
import { CookieBanner } from '@/components/site/CookieBanner';
import { StreakTracker } from '@/components/site/StreakTracker';
import { SplashLoader } from '@/components/site/SplashLoader';
import { RouteProgress } from '@/components/site/RouteProgress';
import { FloatingBackButton } from '@/components/site/FloatingBackButton';
import { Suspense } from 'react';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/structured-data';
import { SITE } from '@/lib/constants';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F2' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1714' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'recipes',
    'meal planner',
    'AI cooking',
    'free recipes',
    'cooking app',
    'pantry recipes',
    'nutrition calculator',
    'budget meals',
    'easy dinner ideas',
    'recipe finder',
  ],
  authors: [{ name: SITE.publisher, url: SITE.url }],
  creator: SITE.publisher,
  publisher: SITE.publisher,
  alternates: { canonical: '/' },
  // Google Search Console ownership verification — provisioned 2026-05-12
  // (URL-prefix property https://recipecrave.com). Next.js emits the
  // <meta name="google-site-verification" ...> tag in <head> automatically.
  verification: {
    google: 'Dxappw2dqUgc5bOU3DWOL2tmWvYFsNdENcNtdF6Y3Ak',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitter,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'food',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-cream-100 font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-terracotta-400 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <I18nProvider>
          {/* Global print-only brand header — appears at the top of every printed page
              (display:none on screen, display:flex when printing per globals.css). */}
          <div className="print-brand-header">
            <div className="brand">
              <span>Recipe</span><span className="accent">Crave</span>
            </div>
            <div className="url">recipecrave.com</div>
          </div>

          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />

          {/* Global print-only brand footer */}
          <div className="print-brand-footer">
            Generated by RecipeCrave · recipecrave.com · Free cooking tools, AI meal
            planning, 200+ recipes
          </div>

          <ScrollToTop />
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          <SplashLoader />
          <FloatingBackButton />
          <FloatingLanguageSelector />
          <WelcomePopup />
          <CookieBanner />
          <StreakTracker />
        </I18nProvider>

        {umamiId && umamiSrc ? (
          <Script src={umamiSrc} data-website-id={umamiId} strategy="lazyOnload" />
        ) : null}

        {gaMeasurementId ? <GoogleAnalytics measurementId={gaMeasurementId} /> : null}

        {adsenseClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
