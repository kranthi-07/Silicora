'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useWorkspaceStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function FuturisticFooter() {
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  return (
    <footer
      className={cn(
        'border-t font-sans text-xs py-12 select-none transition-colors duration-300',
        isLight
          ? 'bg-slate-50 border-slate-200 text-slate-600'
          : 'bg-[#0A090D] border-white/[0.05] text-[#8E8899]'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand Logo with Custom Silicon Emblem */}
          <BrandLogo href="/" size="sm" tagline="Spatial Hardware Twin" />

          {/* Quick Links */}
          <div
            className={cn(
              'flex flex-wrap items-center gap-6 text-xs transition-colors',
              isLight ? 'text-slate-600' : 'text-[#8E8899]'
            )}
          >
            <Link href="/workspace/component_explorer" className={isLight ? 'hover:text-slate-900 transition-colors' : 'hover:text-white transition-colors'}>
              Samples
            </Link>
            <Link href="/workspace/internal_cutaway" className={isLight ? 'hover:text-slate-900 transition-colors' : 'hover:text-white transition-colors'}>
              Research
            </Link>
            <Link href="/workspace/electrical_sim_lab" className={isLight ? 'hover:text-slate-900 transition-colors' : 'hover:text-white transition-colors'}>
              Reports
            </Link>
            <Link href="/workspace/circuit_workspace" className={isLight ? 'hover:text-slate-900 transition-colors' : 'hover:text-white transition-colors'}>
              Patterns
            </Link>
            <Link href="/workspace/device_explorer" className={isLight ? 'hover:text-slate-900 transition-colors' : 'hover:text-white transition-colors'}>
              Teardowns
            </Link>
            <Link href="/workspace/pcb_studio" className={isLight ? 'hover:text-slate-900 transition-colors' : 'hover:text-white transition-colors'}>
              PCB Studio
            </Link>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 text-emerald-500 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">WebGL & Solver Nominal</span>
          </div>
        </div>

        {/* Bottom Credits & Hotkeys */}
        <div
          className={cn(
            'pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] transition-colors',
            isLight ? 'border-slate-200 text-slate-500' : 'border-white/[0.05] text-[#6B6675]'
          )}
        >
          <div>
            <span>© {new Date().getFullYear()} Silicora. Focused Scientific Hardware Engineering Workspace.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('silicora_has_seen_full_intro');
                  sessionStorage.removeItem('silicora_has_entered');
                  window.dispatchEvent(new CustomEvent('silicora:replay-intro'));
                }
              }}
              className={isLight ? 'text-slate-600 hover:text-[#F06543] transition-colors' : 'text-[#8E8899] hover:text-[#F06543] transition-colors'}
              title="Replay cinematic 3D intro animation"
            >
              Replay Intro
            </button>
            <span>•</span>
            <span>Quick-Launch:</span>
            <kbd className={cn('px-1.5 py-0.5 rounded border', isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#181520] border-white/[0.08] text-[#8E8899]')}>Ctrl+L</kbd>
            <span>Workspace</span>
            <kbd className={cn('px-1.5 py-0.5 rounded border', isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#181520] border-white/[0.08] text-[#8E8899]')}>Ctrl+D</kbd>
            <span>Editor</span>
          </div>
        </div>
      </div>
    </footer>
  );
}