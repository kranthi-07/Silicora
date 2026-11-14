'use client';

import React, { useState } from 'react';
import { ComponentItem } from '@/types/component';
import { useWorkspaceStore } from '@/lib/store';
import { ComponentPhysicalIllustration, ComponentSchematicSymbol } from './component-graphics';
import { Layers, Eye, Cpu, HelpCircle, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComponentCardProps {
  component: ComponentItem;
}

export function ComponentCard({ component }: ComponentCardProps) {
  const {
    selectedComponent,
    setSelectedComponent,
    setDetailModalOpen,
    setActiveDetailTab,
    setCutawayActive,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';

  const [previewMode, setPreviewMode] = useState<'physical' | 'schematic'>('physical');

  const isSelected = selectedComponent?.id === component.id;

  const handleSelect = () => {
    setSelectedComponent(component);
  };

  const handleInspect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponent(component);
    setActiveDetailTab('overview');
    setDetailModalOpen(true);
  };

  const handleCutaway = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponent(component);
    setCutawayActive(true);
    setActiveDetailTab('layers');
    setDetailModalOpen(true);
  };

  const isPolarized = component.educational.beginnerGuide?.polarityGuide.isPolarized ?? false;

  return (
    <div
      onClick={handleSelect}
      className={cn(
        'group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none',
        isLight
          ? isSelected
            ? 'border-sky-500 ring-2 ring-sky-500/40 shadow-lg bg-sky-50/50 text-slate-800'
            : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-slate-50/70 shadow-md text-slate-800'
          : isSelected
          ? 'border-[#58A6FF] ring-2 ring-[#58A6FF]/40 shadow-[0_0_25px_rgba(88,166,255,0.2)] bg-[#1c222c] text-[#F0F6FC]'
          : 'bg-[#161B22] border-[#30363D] hover:border-[#58A6FF]/60 hover:bg-[#1a2029] shadow-md text-[#F0F6FC]'
      )}
    >
      {/* 1. Header Strip */}
      <div
        className={cn(
          'px-4 py-2.5 flex items-center justify-between border-b transition-colors',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101318]/80 border-[#21262D]'
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border',
              isLight
                ? 'bg-white text-slate-800 border-slate-200 shadow-sm'
                : 'bg-[#21262D] text-[#F0F6FC] border-[#30363D]'
            )}
          >
            {component.package.standardCode}
          </span>
          <span className={cn('text-[10px] font-mono', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>
            {component.package.pins.length} PINS
          </span>
        </div>

        {/* Polarity Tag (Critical for Newbies) */}
        <span
          className={cn(
            'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border',
            isPolarized
              ? isLight
                ? 'text-amber-800 bg-amber-100 border-amber-300'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : isLight
              ? 'text-slate-500 bg-slate-100 border-slate-200'
              : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
          )}
        >
          {isPolarized ? 'POLARIZED (+/-)' : 'NON-POLARIZED'}
        </span>
      </div>

      {/* 2. Visual Component Display Canvas (Physical vs Schematic Toggle) */}
      <div
        className={cn(
          'relative px-4 pt-4 pb-2 flex flex-col items-center border-b transition-colors',
          isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#0D1117] border-[#21262D]'
        )}
      >
        {/* Toggle between Real Physical Part & Schematic Symbol */}
        <div
          className={cn(
            'absolute top-2.5 right-2.5 z-10 flex items-center p-0.5 rounded-lg border',
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#161B22] border-[#30363D]'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setPreviewMode('physical')}
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-mono transition-colors',
              previewMode === 'physical'
                ? isLight
                  ? 'bg-sky-100 text-sky-700 font-bold'
                  : 'bg-[#21262D] text-[#58A6FF] font-bold'
                : isLight
                ? 'text-slate-500 hover:text-slate-800'
                : 'text-[#8B949E] hover:text-[#F0F6FC]'
            )}
            title="Real-World Physical Packaging"
          >
            Physical
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('schematic')}
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-mono transition-colors',
              previewMode === 'schematic'
                ? isLight
                  ? 'bg-sky-100 text-sky-700 font-bold'
                  : 'bg-[#21262D] text-[#58A6FF] font-bold'
                : isLight
                ? 'text-slate-500 hover:text-slate-800'
                : 'text-[#8B949E] hover:text-[#F0F6FC]'
            )}
            title="IEEE Schematic Circuit Symbol"
          >
            Symbol
          </button>
        </div>

        {/* Dynamic Graphic Container */}
        <div className="w-full h-24 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-200">
          {previewMode === 'physical' ? (
            <ComponentPhysicalIllustration componentId={component.id} className="w-full h-full max-h-20" />
          ) : (
            <ComponentSchematicSymbol symbolType={component.symbolType} className="w-full h-full max-h-20" />
          )}
        </div>

        {/* Quick Physical ID Tagline */}
        {component.educational.beginnerGuide && (
          <p className={cn('text-[10px] text-center font-mono truncate w-full mt-1', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>
            {component.educational.beginnerGuide.howToIdentify}
          </p>
        )}
      </div>

      {/* 3. Component Identity & Plain-English Description */}
      <div className="p-4 space-y-3">
        <div>
          <h4
            className={cn(
              'text-sm font-bold tracking-tight transition-colors truncate',
              isLight ? 'text-slate-900 group-hover:text-sky-600' : 'text-[#F0F6FC] group-hover:text-[#58A6FF]'
            )}
          >
            {component.name}
          </h4>
          <p className={cn('text-xs mt-1 line-clamp-2 leading-relaxed', isLight ? 'text-slate-600' : 'text-[#8B949E]')}>
            {component.educational.beginnerGuide?.plainEnglishAnalogy || component.educational.tagline}
          </p>
        </div>

        {/* Telemetry Ratings */}
        <div className="grid grid-cols-3 gap-1.5 font-mono text-center text-xs">
          <div className={cn('p-1.5 rounded-lg border', isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101318] border-[#21262D]')}>
            <span className={cn('text-[9px] block', isLight ? 'text-slate-400' : 'text-[#6E7681]')}>Vmax</span>
            <span className={cn('text-[11px] font-semibold', isLight ? 'text-slate-800' : 'text-[#F0F6FC]')}>
              {component.electrical.ratings.maxVoltageV}V
            </span>
          </div>
          <div className={cn('p-1.5 rounded-lg border', isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101318] border-[#21262D]')}>
            <span className={cn('text-[9px] block', isLight ? 'text-slate-400' : 'text-[#6E7681]')}>Imax</span>
            <span className={cn('text-[11px] font-semibold', isLight ? 'text-slate-800' : 'text-[#F0F6FC]')}>
              {component.electrical.ratings.maxCurrentContinuousA < 1
                ? `${(component.electrical.ratings.maxCurrentContinuousA * 1000).toFixed(0)}mA`
                : `${component.electrical.ratings.maxCurrentContinuousA}A`}
            </span>
          </div>
          <div className={cn('p-1.5 rounded-lg border', isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101318] border-[#21262D]')}>
            <span className={cn('text-[9px] block', isLight ? 'text-slate-400' : 'text-[#6E7681]')}>Pdiss</span>
            <span className={cn('text-[11px] font-semibold', isLight ? 'text-slate-800' : 'text-[#F0F6FC]')}>
              {component.electrical.ratings.maxPowerDissipationW}W
            </span>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons Footer */}
      <div
        className={cn(
          'px-4 py-2.5 border-t flex items-center justify-between gap-2 transition-colors',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101318]/70 border-[#21262D]'
        )}
      >
        <button
          type="button"
          onClick={handleCutaway}
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded-lg transition-colors',
            isLight
              ? 'text-sky-700 hover:text-sky-900 hover:bg-slate-200/70'
              : 'text-[#8B949E] hover:text-cyan-400 hover:bg-[#21262D]'
          )}
        >
          <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
          <span>Cutaway</span>
        </button>

        <button
          type="button"
          onClick={handleInspect}
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium py-1 px-3 rounded-lg border transition-colors shadow-sm',
            isLight
              ? 'bg-white text-slate-800 hover:bg-slate-100 border-slate-200'
              : 'bg-[#21262D] text-[#F0F6FC] hover:bg-[#30363D] border-[#30363D]'
          )}
        >
          <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-[#58A6FF]" />
          <span>Newbie Guide & Specs</span>
        </button>
      </div>
    </div>
  );
}
