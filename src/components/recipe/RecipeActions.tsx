'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Printer, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  slug: string;
  title: string;
};

export function RecipeActions({ slug, title }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  // Hydrate save state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saves = JSON.parse(localStorage.getItem('rc:saves') ?? '[]') as string[];
    setSaved(saves.includes(slug));
  }, [slug]);

  function toggleSave() {
    const saves = JSON.parse(localStorage.getItem('rc:saves') ?? '[]') as string[];
    let next: string[];
    if (saves.includes(slug)) {
      next = saves.filter((s) => s !== slug);
      setSaved(false);
    } else {
      next = [...saves, slug];
      setSaved(true);
    }
    localStorage.setItem('rc:saves', JSON.stringify(next));
  }

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // clipboard failed silently
    }
  }

  function handlePrint() {
    router.push(`/recipes/${slug}/print`);
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Button variant={saved ? 'secondary' : 'default'} size="sm" onClick={toggleSave} aria-pressed={saved}>
        <Heart className={`mr-1.5 h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        {saved ? 'Saved' : 'Save'}
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="mr-1.5 h-4 w-4" /> Print
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
        {shared ? 'Copied!' : 'Share'}
      </Button>
    </div>
  );
}
