import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'nominal' | 'warning' | 'critical' | 'mono' | 'outline';
  size?: 'xs' | 'sm';
}

export function Badge({
  className,
  variant = 'default',
  size = 'xs',
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-medium rounded transition-colors select-none';

  const variants = {
    default: 'bg-lab-surface-2 text-lab-text-secondary border border-lab-border-default',
    accent: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    nominal: 'bg-green-500/10 text-green-400 border border-green-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    critical: 'bg-red-500/10 text-red-400 border border-red-500/30',
    mono: 'bg-lab-surface-0 text-lab-text-primary border border-lab-border-subtle font-mono',
    outline: 'bg-transparent text-lab-text-muted border border-lab-border-default',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 leading-none',
    sm: 'text-xs px-2 py-0.5 leading-tight',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
