import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function StarRating({ value, size = 'md', className }: Props) {
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  const clamped = Math.max(0, Math.min(5, value));
  const full = Math.floor(clamped);
  const hasHalf = clamped - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className={cn(sizes[size], 'fill-warning text-warning')} />
      ))}
      {hasHalf ? (
        <span className="relative inline-flex">
          <Star className={cn(sizes[size], 'text-warning/30')} />
          <Star
            className={cn(sizes[size], 'absolute inset-0 fill-warning text-warning')}
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        </span>
      ) : null}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className={cn(sizes[size], 'text-warning/30')} />
      ))}
    </span>
  );
}
