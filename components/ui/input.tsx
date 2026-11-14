import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  hasClear?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      leftIcon,
      rightIcon,
      onClear,
      hasClear,
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-2.5 text-lab-text-muted pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          className={cn(
            'w-full bg-lab-surface-0 border border-lab-border-default rounded-md px-3 py-1.5 text-xs text-lab-text-primary placeholder:text-lab-text-muted transition-colors focus:outline-none focus:border-lab-border-focus focus:ring-1 focus:ring-lab-border-focus disabled:opacity-50',
            leftIcon && 'pl-8',
            (rightIcon || (hasClear && value)) && 'pr-8',
            className
          )}
          {...props}
        />
        {hasClear && value && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 p-0.5 text-lab-text-muted hover:text-lab-text-primary rounded transition-colors"
            tabIndex={-1}
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {rightIcon && !hasClear && (
          <div className="absolute right-2.5 text-lab-text-muted pointer-events-none flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
