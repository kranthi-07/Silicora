'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WorkspaceStatusBar() {
  const { telemetry, selectedComponent, activeEnvironment, themeMode } = useWorkspaceStore();
  const isLight = themeMode === 'light';

  return (
    <footer
      className={cn(
        'h-6 border-t px-3 flex items-center justify-between text-[11px] font-mono select-none shrink-0 z-20 transition-colors',
        isLight
          ? 'bg-slate-100 border-slate-200 text-slate-600'
          : 'bg-[#090B0E] border-[#21262D] text-[#8B949E]'
      )}
    >
      {/* Left: Active component & Node information */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              isLight ? 'bg-sky-600' : 'bg-cyan-400'
            )}
          />
          <span>
            ENV:{' '}
            <strong
              className={cn(
                'uppercase font-bold',
                isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
              )}
            >
              {activeEnvironment.replace(/_/g, ' ')}
            </strong>
          </span>
        </div>

        {selectedComponent && (
          <div className="hidden sm:flex items-center gap-1 text-[10px]">
            <span className={isLight ? 'text-slate-400' : 'text-[#6E7681]'}>PART:</span>
            <span
              className={cn(
                'font-semibold truncate max-w-[200px]',
                isLight ? 'text-sky-700' : 'text-cyan-400'
              )}
            >
              {selectedComponent.name}
            </span>
            <span className={isLight ? 'text-slate-400' : 'text-[#6E7681]'}>
              ({selectedComponent.package.standardCode})
            </span>
          </div>
        )}
      </div>

      {/* Right: Telemetry & Shortcuts */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'hidden md:flex items-center gap-2 text-[10px]',
            isLight ? 'text-slate-500' : 'text-[#6E7681]'
          )}
        >
          <span suppressHydrationWarning>
            XYZ: [{telemetry.cursorCoordinates.x.toFixed(1)},{' '}
            {telemetry.cursorCoordinates.y.toFixed(1)},{' '}
            {telemetry.cursorCoordinates.z.toFixed(1)}] mm
          </span>
        </div>

        <div className="flex items-center gap-1 text-emerald-500">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[10px] font-bold">SOLVER: OK</span>
        </div>

        <div
          className={cn(
            'hidden sm:flex items-center gap-1',
            isLight ? 'text-slate-500' : 'text-[#6E7681]'
          )}
        >
          <kbd
            className={cn(
              'px-1 py-0.5 rounded border text-[9px]',
              isLight
                ? 'bg-white border-slate-300 text-slate-700'
                : 'bg-[#161B22] border-[#21262D] text-[#8B949E]'
            )}
          >
            Space
          </kbd>
          <span className="text-[10px]">Pause</span>
          <kbd
            className={cn(
              'px-1 py-0.5 rounded border text-[9px] ml-1',
              isLight
                ? 'bg-white border-slate-300 text-slate-700'
                : 'bg-[#161B22] border-[#21262D] text-[#8B949E]'
            )}
          >
            E
          </kbd>
          <span className="text-[10px]">Explode</span>
          <kbd
            className={cn(
              'px-1 py-0.5 rounded border text-[9px] ml-1',
              isLight
                ? 'bg-white border-slate-300 text-slate-700'
                : 'bg-[#161B22] border-[#21262D] text-[#8B949E]'
            )}
          >
            C
          </kbd>
          <span className="text-[10px]">Cutaway</span>
        </div>
      </div>
    </footer>
  );
}
