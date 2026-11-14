import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, SearchX, AlertTriangle, RefreshCw, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  title = 'Simulating Subsystems...',
  description = 'Resolving geometry mesh buffers and parsing SPICE models',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-xl bg-lab-surface-1/50 border border-dashed border-lab-border-default',
        className
      )}
      role="status"
    >
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full blur-md bg-blue-500/10 pointer-events-none" />
      </div>
      <h4 className="text-sm font-semibold text-lab-text-primary tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-lab-text-secondary max-w-sm mt-1 font-mono">
        {description}
      </p>
    </div>
  );
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No Components Found',
  description = 'No parts match your current search query or package filters.',
  icon,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-xl bg-lab-surface-1/40 border border-dashed border-lab-border-default',
        className
      )}
    >
      <div className="w-12 h-12 rounded-lg bg-lab-surface-2 border border-lab-border-subtle flex items-center justify-center text-lab-text-muted mb-4 shadow-sm">
        {icon || <SearchX className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-semibold text-lab-text-primary">{title}</h4>
      <p className="text-xs text-lab-text-secondary max-w-sm mt-1">
        {description}
      </p>
      {actionText && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          className="mt-4"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  errorDetails?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Simulation Engine Exception',
  description = 'An error occurred while evaluating component netlist parameters.',
  errorDetails,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl bg-red-950/20 border border-red-900/40',
        className
      )}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center text-red-400 mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-red-200">{title}</h4>
      <p className="text-xs text-lab-text-secondary max-w-md mt-1">
        {description}
      </p>
      {errorDetails && (
        <pre className="mt-3 p-2.5 rounded bg-lab-surface-0 border border-red-900/30 text-[11px] font-mono text-red-300 text-left max-w-lg overflow-x-auto w-full">
          {errorDetails}
        </pre>
      )}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
          className="mt-4 border-red-800 text-red-300 hover:bg-red-900/30"
        >
          Re-initialize Engine
        </Button>
      )}
    </div>
  );
}
