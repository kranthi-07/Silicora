'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { Activity, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SimulationLoadingModal() {
  const {
    isSimLoading,
    simLoadingProgress,
    selectedComponent,
  } = useWorkspaceStore();

  if (!isSimLoading) return null;

  const componentName = selectedComponent?.name || 'Selected Component';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto select-none font-mono animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0D0B12]/95 border border-[#F06543]/40 shadow-[0_0_50px_rgba(240,101,67,0.25)] p-6 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-[#F06543] to-amber-400 animate-pulse" />

        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F06543] animate-ping" />
            <span className="text-[10px] tracking-wider uppercase text-[#F06543] font-bold">
              Digital Twin Test Bench
            </span>
          </div>
          <span className="text-xs font-bold text-white bg-[#1A1624] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
            {simLoadingProgress}%
          </span>
        </div>

        {/* Dynamic Title with Component Name */}
        <div className="space-y-1 mb-5">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
            <span className="truncate">Simulating {componentName}...</span>
          </h2>
          <p className="text-xs text-[#8E8899] font-sans">
            Attaching source leads in 3D scene and evaluating SPICE electrical transport equations.
          </p>
        </div>

        {/* Sleek Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-[#1A1624] border border-white/[0.08] overflow-hidden p-0.5 mb-5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-[#F06543] to-amber-400 transition-all duration-75 shadow-[0_0_12px_rgba(240,101,67,0.8)]"
            style={{ width: `${simLoadingProgress}%` }}
          />
        </div>

        {/* Automated Execution Steps Checklist */}
        <div className="space-y-2 text-xs">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5">
            {simLoadingProgress > 25 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
            )}
            <span className={cn(simLoadingProgress > 25 ? 'text-white' : 'text-[#8E8899]')}>
              Connecting test bench source leads in 3D viewport
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-2.5">
            {simLoadingProgress > 65 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : simLoadingProgress > 25 ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
            )}
            <span className={cn(simLoadingProgress > 65 ? 'text-white' : 'text-[#8E8899]')}>
              Establishing regulated DC bias voltage
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-2.5">
            {simLoadingProgress >= 100 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : simLoadingProgress > 65 ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
            )}
            <span className={cn(simLoadingProgress >= 100 ? 'text-white' : 'text-[#8E8899]')}>
              Starting dotted flowing current simulation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
