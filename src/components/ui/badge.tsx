import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'income' | 'expense' | 'asset' | 'outline';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-primary/10 text-primary',
      income: 'bg-income/10 text-income',
      expense: 'bg-expense/10 text-expense',
      asset: 'bg-asset/10 text-asset',
      outline: 'border border-outline text-on-surface-variant',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
