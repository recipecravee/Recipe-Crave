import Link from 'next/link';
import Image from 'next/image';
import { Search, User } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MegaMenu } from './MegaMenu';

export async function Header() {
  let user: { email: string | undefined } | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    user = data.user ? { email: data.user.email ?? undefined } : null;
  } catch {
    user = null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream-100/95 shadow-sm backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${SITE.name} home`}
          className="flex items-center gap-3 rounded-md focus-ring"
        >
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12"
            priority
            unoptimized
          />
          <span className="font-serif text-2xl font-bold sm:text-3xl">
            <span className="text-ink">Recipe</span>
            <span className="text-terracotta-400">Crave</span>
          </span>
        </Link>

        <MegaMenu userEmail={user?.email} />
      </div>
    </header>
  );
}
