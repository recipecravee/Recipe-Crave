import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-7xl text-terracotta-300">404</p>
      <h1 className="mt-4 font-serif text-3xl">This recipe took a wrong turn.</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist, or moved kitchens. Let&apos;s get you back.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild><Link href="/">Back to home</Link></Button>
        <Button variant="outline" asChild><Link href="/recipes">Browse recipes</Link></Button>
      </div>
    </div>
  );
}
