'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

/**
 * Always-on floating "go back one step" button. Renders on every page
 * except the homepage and admin.
 *
 * Uses browser history.back() so it respects the user's actual nav
 * trail. When history.length is too small (direct landing from search
 * or external link), falls back to a sensible parent route derived
 * from the URL pattern.
 *
 * Pinned bottom-left so it never fights the floating language picker
 * (bottom-right) or the route progress bar (top).
 */
export function FloatingBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const hide =
    !mounted ||
    pathname === '/' ||
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/dashboard');
  if (hide) return null;

  function onClick() {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back();
      return;
    }
    router.push(fallbackParent(pathname));
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back one step"
      className="rc-back-btn fixed bottom-5 left-3 z-40 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2.5 text-sm font-bold text-ink shadow-md ring-1 ring-ink/10 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lg focus-ring print:hidden sm:bottom-6 sm:left-6"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden />
      Back
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .rc-back-btn { animation: rc-back-in 320ms cubic-bezier(.2,.7,.2,1) both; }
          @keyframes rc-back-in {
            from { transform: translateX(-12px); opacity: 0; }
            to   { transform: translateX(0); opacity: 1; }
          }
        }
      `}</style>
    </button>
  );
}

function fallbackParent(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length <= 1) return '/';
  const head = parts[0];
  if (head === 'recipes') return '/recipes';
  if (head === 'cuisine') return '/cuisines';
  if (head === 'diet') return '/diets';
  if (head === 'category') return '/recipes';
  if (head === 'collections') return '/collections';
  if (head === 'how-to') return '/how-to';
  if (head === 'meal-plans') return '/meal-plans';
  if (head === 'blog') return '/blog';
  if (head === 'herbs') return '/herbs';
  if (head === 'calculators') return '/calculators';
  return '/' + parts.slice(0, -1).join('/');
}
