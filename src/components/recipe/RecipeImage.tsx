'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  src: string | null;
  alt: string;
  priority?: boolean;
  sizes?: string;
  fillTitle?: string;
};

export function RecipeImage({ src, alt, priority = false, sizes, fillTitle }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <>
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-cream-200 via-terracotta-50 to-forest-100 px-4 text-center">
          <span className="font-serif text-2xl text-terracotta-300/70 line-clamp-3">
            {fillTitle ?? alt.split(' ').slice(0, 4).join(' ')}
          </span>
        </div>
      )}
    </>
  );
}
