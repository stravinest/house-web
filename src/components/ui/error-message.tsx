import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, X } from 'lucide-react';

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onClose?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>(
  (
    {
      className,
      title = '오류',
      message,
      onClose,
      variant = 'error',
      ...props
    },
    ref
  ) => {
    const variants = {
      error: 'bg-expense/10 border-expense/20 text-expense',
      warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-500',
      info: 'bg-primary/10 border-primary/20 text-primary',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-xl border animate-slide-down',
          variants[variant],
          className
        )}
        role='alert'
        aria-live='assertive'
        {...props}
      >
        <div className='flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 flex-shrink-0 mt-0.5' aria-hidden='true' />
          <div className='flex-1'>
            <p className='font-medium text-sm'>{title}</p>
            <p className='text-sm mt-1 opacity-90'>{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className='flex-shrink-0 hover:opacity-70 transition-opacity'
              aria-label='닫기'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';

export { ErrorMessage };
