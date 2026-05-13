'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Top-of-viewport progress bar that fires on every route change. The
 * pathname/searchParams hooks update synchronously when the new route
 * begins streaming, so we drive the bar off those instead of patching
 * <Link> globally.
 *
 * Behavior:
 *   - On nav start: spring to 80% over 250ms.
 *   - On render of new route: jump to 100% then fade to invisible.
 *   - Skips on initial mount so the splash isn't double-decorated.
 *
 * Pure CSS animation, <1KB. No library dependency.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const firstRender = useRef(true);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (finishTimer.current) clearTimeout(finishTimer.current);
    setVisible(true);
    setWidth(0);
    // Spring up to 80% quickly — represents "navigation initiated".
    requestAnimationFrame(() => setWidth(80));
    // Complete to 100% on the next paint cycle of this hook firing
    // (which means the new route's data has resolved).
    finishTimer.current = setTimeout(() => {
      setWidth(100);
      finishTimer.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 250);
    }, 220);
    return () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
    // pathname + search both deliberately watched so query-string-only
    // navigations also fire the bar.
  }, [pathname, search]);

  if (!visible) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 130,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #D2735C, #E29683)',
          boxShadow: '0 0 8px rgba(210, 115, 92, 0.5)',
          transition: 'width 220ms cubic-bezier(.2,.7,.2,1), opacity 200ms',
          opacity: width === 0 ? 0 : 1,
        }}
      />
    </div>
  );
}
