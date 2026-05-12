'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500 text-white shadow-lg ring-2 ring-white/40 transition-all hover:scale-110 hover:bg-terracotta-600 focus-ring print:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
