import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:border-terracotta-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400/30 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
