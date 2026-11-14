import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  badge?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills' | 'segmented';
  className?: string;
  size?: 'sm' | 'md';
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
  size = 'sm',
}: TabsProps) {
  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex p-0.5 rounded-lg bg-lab-surface-0 border border-lab-border-subtle select-none',
          className
        )}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all duration-150',
                isActive
                  ? 'bg-lab-surface-2 text-lab-text-primary shadow-sm border border-lab-border-default'
                  : 'text-lab-text-secondary hover:text-lab-text-primary'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] text-lab-text-muted font-mono ml-0.5">
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={cn('flex items-center gap-1.5 select-none overflow-x-auto no-scrollbar', className)} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-150 shrink-0',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-glow'
                  : 'bg-lab-surface-2/60 text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-surface-2 border border-transparent'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] opacity-75 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: underline
  return (
    <div
      className={cn(
        'flex border-b border-lab-border-subtle gap-4 select-none overflow-x-auto no-scrollbar',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 pb-2 text-xs font-medium transition-colors border-b-2 -mb-px shrink-0',
              size === 'md' && 'text-sm pb-2.5',
              isActive
                ? 'border-blue-500 text-lab-text-primary'
                : 'border-transparent text-lab-text-secondary hover:text-lab-text-primary'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-lab-surface-2 text-lab-text-muted font-mono">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
