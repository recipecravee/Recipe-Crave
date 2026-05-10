import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-terracotta-100 text-terracotta-700',
        secondary: 'bg-forest-100 text-forest-700',
        outline: 'border border-ink/15 text-ink',
        warm: 'bg-cream-200 text-ink',
        success: 'bg-success/15 text-success',
        warning: 'bg-warning/15 text-warning',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
