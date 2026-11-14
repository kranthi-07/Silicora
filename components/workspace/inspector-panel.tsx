'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { useSimulation } from '@/lib/simulation/use-simulation';
import { ComponentSchematicSymbol } from '@/components/explorer/component-graphics';
import { InspectorLayer3DView } from './inspector-layer-3d-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cpu,
  X,
  Eye,
  GraduationCap,
  Box,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function WorkspaceInspectorPanel() {
  const {
    rightInspectorOpen,
    toggleRightInspector,
    selectedComponent,
    setDetailModalOpen,
    setActiveDetailTab,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';
  const { outputs } = useSimulation();

  if (!rightInspectorOpen) return null;

  if (!selectedComponent) {
    return (
      <aside
        className={cn(
          'w-68 xl:w-72 h-full border-l p-4 shrink-0 flex flex-col justify-center items-center text-center text-xs select-none transition-all duration-300',
          isLight
            ? 'border-slate-200 bg-white/95 text-slate-600 shadow-lg'
            : 'border-[#30363D] bg-[#101318]/95 text-[#8B949E]'
        )}
      >
        <Box
          className={cn(
            'w-8 h-8 mb-2 animate-pulse',
            isLight ? 'text-slate-300' : 'text-[#30363D]'
          )}
        />
        <h4 className={cn('text-xs font-bold', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>
          No Component Selected
        </h4>
        <p className={cn('mt-1 text-[11px]', isLight ? 'text-slate-500' : 'text-[#6E7681]')}>
          Select any part from catalog to inspect geometry and state.
        </p>
      </aside>
    );
  }

  return (
    <aside
      id="tutorial-inspector-panel"
      className={cn(
        'w-72 xl:w-80 h-full border-l backdrop-blur-2xl shrink-0 flex flex-col select-none z-20 transition-all duration-300',
        isLight
          ? 'border-slate-200/90 bg-white/95 text-slate-800 shadow-xl'
          : 'border-white/[0.1] bg-[#101318]/95 text-white shadow-2xl'
      )}
    >
      {/* 1. Header Bar */}
      <div
        className={cn(
          'px-3.5 py-2.5 border-b flex items-center justify-between shrink-0 transition-colors',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/70 border-white/[0.08]'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <div
            className={cn(
              'p-1.5 rounded-lg shrink-0 border',
              isLight
                ? 'bg-sky-50 text-sky-600 border-sky-200'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
            )}
          >
            <Cpu className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span
              className={cn(
                'text-xs font-bold block truncate tracking-tight',
                isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
              )}
            >
              Inspector
            </span>
            <span
              className={cn(
                'text-[9px] font-mono block truncate font-semibold',
                isLight ? 'text-sky-600' : 'text-cyan-400'
              )}
            >
              {selectedComponent.package.standardCode}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleRightInspector}
          className={cn(
            'p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer',
            isLight
              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-white/[0.08]'
          )}
          title="Close Inspector"
          aria-label="Close Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Scrollable Body: Necessary Items Only */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {/* Component Identification Card */}
        <div
          className={cn(
            'p-3 rounded-xl border space-y-2.5 transition-colors',
            isLight
              ? 'bg-slate-50 border-slate-200 shadow-sm'
              : 'bg-gradient-to-b from-[#161B22] to-[#101318] border-white/[0.08] shadow-card'
          )}
        >
          <div className="flex items-start justify-between gap-1.5">
            <div>
              <h3
                className={cn(
                  'text-xs font-bold leading-snug tracking-tight',
                  isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
                )}
              >
                {selectedComponent.name}
              </h3>
              <p
                className={cn(
                  'text-[10px] font-mono mt-0.5',
                  isLight ? 'text-slate-500' : 'text-[#8B949E]'
                )}
              >
                {selectedComponent.package.mounting === 'through_hole'
                  ? 'Through-Hole Technology (THT)'
                  : 'Surface Mount Device (SMD)'}
              </p>
            </div>
            <Badge variant="accent" size="xs" className="shrink-0 text-[9px] px-2 py-0.5 font-mono">
              {selectedComponent.package.mounting === 'through_hole' ? 'THT' : 'SMD'}
            </Badge>
          </div>

          {/* Quick Schematic & Electrical Limits */}
          <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono text-center pt-1">
            <div
              className={cn(
                'p-1.5 rounded-lg border',
                isLight ? 'bg-white border-slate-200' : 'bg-[#090B0E] border-white/[0.06]'
              )}
            >
              <span className={cn('block text-[8px] font-bold', isLight ? 'text-slate-400' : 'text-[#8B949E]')}>
                RATED
              </span>
              <span className={cn('font-bold', isLight ? 'text-sky-600' : 'text-cyan-400')}>
                {selectedComponent.electrical?.ratings?.maxPowerDissipationW
                  ? `${selectedComponent.electrical.ratings.maxPowerDissipationW * 1000}mW`
                  : '0.25W'}
              </span>
            </div>
            <div
              className={cn(
                'p-1.5 rounded-lg border',
                isLight ? 'bg-white border-slate-200' : 'bg-[#090B0E] border-white/[0.06]'
              )}
            >
              <span className={cn('block text-[8px] font-bold', isLight ? 'text-slate-400' : 'text-[#8B949E]')}>
                V_MAX
              </span>
              <span className="text-amber-500 font-bold">
                {selectedComponent.electrical?.ratings?.maxVoltageV || 250}V
              </span>
            </div>
            <div
              className={cn(
                'p-1.5 rounded-lg border',
                isLight ? 'bg-white border-slate-200' : 'bg-[#090B0E] border-white/[0.06]'
              )}
            >
              <span className={cn('block text-[8px] font-bold', isLight ? 'text-slate-400' : 'text-[#8B949E]')}>
                PINS
              </span>
              <span className="text-emerald-500 font-bold">
                {selectedComponent.package.pins.length} Pins
              </span>
            </div>
          </div>

          {/* Quick Guide & Datasheet Actions */}
          <div className="flex items-center gap-1.5 pt-1">
            <Button
              variant="primary"
              size="xs"
              leftIcon={<GraduationCap className="w-3.5 h-3.5 text-amber-300" />}
              onClick={() => {
                setActiveDetailTab('newbie');
                setDetailModalOpen(true);
              }}
              className="flex-1 text-[11px] py-1.5 shadow-sm"
            >
              Guide
            </Button>
            <Button
              variant="secondary"
              size="xs"
              leftIcon={<Eye className="w-3.5 h-3.5 text-[#58A6FF]" />}
              onClick={() => {
                setActiveDetailTab('overview');
                setDetailModalOpen(true);
              }}
              className="flex-1 text-[11px] py-1.5"
            >
              Datasheet
            </Button>
          </div>
        </div>

        {/* 3. 3D PART INSPECTOR: 3D Image & Viewing Experience of Every Part */}
        <div
          className={cn(
            'p-3 rounded-xl border transition-colors',
            isLight
              ? 'bg-slate-50 border-slate-200 shadow-sm'
              : 'bg-gradient-to-b from-[#161B22] to-[#101318] border-white/[0.08] shadow-card'
          )}
        >
          <InspectorLayer3DView component={selectedComponent} />
        </div>
      </div>
    </aside>
  );
}
