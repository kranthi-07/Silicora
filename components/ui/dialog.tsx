'use client';

import React, { useEffect, useId } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  showCloseButton?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}: DialogProps) {
  const titleId = useId();
  const descId = useId();

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 select-none"
    >
      {/* 1. Opaque Backdrop Blur (Prevents any background card bleed-through) */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Modal Frame */}
      <div
        className={cn(
          'relative w-full max-h-[88vh] rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-200',
          maxWidthClasses[maxWidth]
        )}
      >
        {/* Dialog Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#21262D] bg-slate-50 dark:bg-[#101318] shrink-0">
          <div className="min-w-0 pr-4">
            <h2 id={titleId} className="text-base font-bold text-slate-900 dark:text-[#F0F6FC] tracking-tight truncate">
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5 font-mono truncate">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-800 dark:text-[#8B949E] dark:hover:text-[#F0F6FC] p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-[#21262D] border border-transparent transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dialog Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#161B22] text-slate-800 dark:text-[#F0F6FC] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
