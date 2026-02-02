import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { FileX, Search, AlertCircle } from 'lucide-react';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'search' | 'error';
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      action,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const defaultIcons = {
      default: <FileX className='w-12 h-12 text-on-surface-variant' />,
      search: <Search className='w-12 h-12 text-on-surface-variant' />,
      error: <AlertCircle className='w-12 h-12 text-destructive' />,
    };

    const displayIcon = icon || defaultIcons[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-6 text-center',
          className
        )}
        {...props}
      >
        <div className='mb-4'>{displayIcon}</div>
        <h3 className='text-lg font-semibold text-on-surface mb-2'>
          {title}
        </h3>
        {description && (
          <p className='text-sm text-on-surface-variant max-w-md mb-6'>
            {description}
          </p>
        )}
        {action && <div className='mt-2'>{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export { EmptyState };
