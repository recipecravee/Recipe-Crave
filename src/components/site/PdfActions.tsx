'use client';

import { useState } from 'react';
import { Download, Printer, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Inline Download-as-PDF + Print buttons. Place at the top of any calculator
 * or info-section result panel. Both buttons trigger `window.print()`; the
 * browser print dialog offers "Save as PDF" as a destination so we get PDF
 * export with zero library bloat.
 *
 * Print stylesheet (globals.css) handles:
 *   - RecipeCrave logo watermark behind every page
 *   - .print-brand-header at the top of every printed page (rendered by
 *     root layout, display:none on screen)
 *   - .print-brand-footer at the bottom of every printed page
 */
export function PdfActions({ className = '' }: { className?: string }) {
  const [printed, setPrinted] = useState(false);

  function trigger() {
    if (typeof window === 'undefined') return;
    setPrinted(true);
    window.print();
    setTimeout(() => setPrinted(false), 1500);
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 print:hidden ${className}`}>
      <Button type="button" variant="outline" size="sm" onClick={trigger}>
        {printed ? <Check className="mr-1.5 h-4 w-4" /> : <Download className="mr-1.5 h-4 w-4" />}
        Download as PDF
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={trigger}>
        <Printer className="mr-1.5 h-4 w-4" /> Print
      </Button>
    </div>
  );
}
