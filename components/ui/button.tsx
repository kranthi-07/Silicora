import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'sm',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-border-focus disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-blue-600 hover:bg-blue-500 text-white shadow-sm border border-blue-500/40 hover:shadow-glow',
      accent:
        'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm border border-indigo-500/40 hover:shadow-glow',
      secondary:
        'bg-lab-surface-2 hover:bg-lab-surface-3 text-lab-text-primary border border-lab-border-default hover:border-lab-border-focus',
      outline:
        'bg-transparent hover:bg-lab-surface-2 text-lab-text-primary border border-lab-border-default hover:border-lab-border-focus',
      ghost:
        'bg-transparent hover:bg-lab-surface-2 text-lab-text-secondary hover:text-lab-text-primary',
      danger:
        'bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 hover:border-red-600',
    };

    const sizes = {
      xs: 'text-xs px-2 py-1 gap-1.5 h-6',
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-3.5 py-2 gap-2 h-9',
      lg: 'text-sm px-4 py-2.5 gap-2.5 h-10',
      'icon-sm': 'h-7 w-7 p-0',
      icon: 'h-8 w-8 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
