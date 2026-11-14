import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  actions?: React.ReactNode;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      title,
      subtitle,
      icon,
      collapsible = false,
      collapsed = false,
      onToggleCollapse,
      onClose,
      actions,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col bg-lab-surface-1 border border-lab-border-default rounded-lg overflow-hidden transition-all duration-200 shadow-card',
          collapsed && 'h-auto',
          className
        )}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-lab-surface-1/90 border-b border-lab-border-subtle shrink-0 select-none">
            <div className="flex items-center gap-2 min-w-0">
              {collapsible && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="text-lab-text-muted hover:text-lab-text-primary p-0.5 rounded transition-colors"
                  aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
                >
                  {collapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
              {icon && <span className="text-blue-400 shrink-0">{icon}</span>}
              <div className="min-w-0">
                <span className="text-xs font-semibold text-lab-text-primary block truncate">
                  {title}
                </span>
                {subtitle && (
                  <span className="text-[10px] text-lab-text-muted block truncate font-mono">
                    {subtitle}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {actions}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-lab-text-muted hover:text-lab-text-primary p-1 rounded transition-colors ml-1"
                  aria-label="Close panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            {children}
          </div>
        )}
      </div>
    );
  }
);

Panel.displayName = 'Panel';
