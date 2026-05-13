import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/lib/constants';
import { MegaMenu } from './MegaMenu';

/**
 * Static server component. Auth state is fetched by the <AccountButton />
 * client island inside MegaMenu — keeping cookies() out of this tree
 * means the root layout no longer marks every page as dynamic, which
 * is what restores ISR caching of the homepage (revalidate: 3600).
 */
export function Header() {
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
            width={64}
            height={64}
            sizes="(max-width: 639px) 56px, 48px"
            className="h-14 w-14 sm:h-12 sm:w-12"
            priority
          />
          <span className="hidden font-serif text-xl font-bold min-[360px]:inline sm:text-2xl lg:text-3xl">
            <span className="text-ink">Recipe</span>
            <span className="text-terracotta-400">Crave</span>
          </span>
        </Link>

        <MegaMenu />
      </div>
    </header>
  );
}
