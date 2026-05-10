'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrintControls({ slug }: { slug: string }) {
  // Auto-prompt print dialog on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  function handlePrint() {
    if (typeof window !== 'undefined') window.print();
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/recipes/${slug}`}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to recipe
        </Link>
      </Button>
      <Button size="sm" onClick={handlePrint}>
        <Printer className="mr-1.5 h-4 w-4" />
        Print again
      </Button>
    </div>
  );
}
