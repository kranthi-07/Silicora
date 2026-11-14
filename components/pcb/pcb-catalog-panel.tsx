'use client';

import React from 'react';
import { usePcbStore } from '@/lib/pcb/pcb-store';
import { useWorkspaceStore } from '@/lib/store';
import { CIRCUIT_PRESETS } from '@/lib/circuit/circuit-presets';
import { PcbLayerId } from '@/types/pcb';
import {
  Layers,
  RotateCw,
  Eye,
  EyeOff,
  Cpu,
  ShieldCheck,
  Grid,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PcbCatalogPanelProps {
  onClose?: () => void;
}

export function PcbCatalogPanel({ onClose }: PcbCatalogPanelProps) {
  const {
    project,
    activeLayer,
    setActiveLayer,
    visibleLayers,
    toggleLayerVisibility,
    selectedComponentId,
    setSelectedComponentId,
    selectedNetId,
    setSelectedNetId,
    selectedPresetId,
    loadPresetPcb,
    rotateComponent,
    runDrc,
  } = usePcbStore();

  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  const layersList: Array<{ id: PcbLayerId; name: string; color: string }> = [
    { id: 'F_Cu', name: 'Top Copper (F.Cu)', color: '#ef4444' },
    { id: 'B_Cu', name: 'Bottom Copper (B.Cu)', color: '#3b82f6' },
    { id: 'F_SilkS', name: 'Top Silkscreen (F.SilkS)', color: '#ffffff' },
    { id: 'Edge_Cuts', name: 'Board Outline (Edge.Cuts)', color: '#f59e0b' },
    { id: 'Ratsnest', name: 'Ratsnest Airwires', color: '#facc15' },
  ];

  return (
    <div
      className={cn(
        'h-full flex flex-col shrink-0 select-none font-mono text-xs w-full bg-transparent',
        isLight ? 'text-slate-800' : 'text-[#F0F6FC]'
      )}
    >
      {/* Header Bar */}
      <div
        className={cn(
          'px-3.5 py-2.5 border-b flex items-center justify-between shrink-0 transition-colors',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/70 border-white/[0.08]'
        )}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#F06543]/15 text-[#F06543] border border-[#F06543]/20">
            <Grid className="w-4 h-4" />
          </div>
          <span
            className={cn(
              'text-xs font-bold tracking-tight',
              isLight ? 'text-slate-800' : 'text-[#F0F6FC]'
            )}
          >
            PCB Stackup & Parts
          </span>
          <span
            className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold',
              isLight
                ? 'bg-slate-200/80 text-[#E05332] border-slate-300'
                : 'bg-white/[0.06] text-[#F06543] border-white/[0.08]'
            )}
          >
            {project.placedComponents.length}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/70'
                : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-white/[0.08]'
            )}
            title="Close Catalog"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Preset Selector */}
      <div
        className={cn(
          'p-2.5 border-b shrink-0 space-y-1 transition-colors',
          isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#161B22]/40 border-white/[0.08]'
        )}
      >
        <span
          className={cn(
            'text-[9px] uppercase font-bold block',
            isLight ? 'text-slate-500' : 'text-[#8B949E]'
          )}
        >
          Synthesize Circuit Preset
        </span>
        <select
          value={selectedPresetId}
          onChange={(e) => loadPresetPcb(e.target.value)}
          className={cn(
            'w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer transition-colors',
            isLight
              ? 'bg-white border-slate-300 text-slate-800 focus:border-[#F06543]'
              : 'bg-[#090B0E] border-white/[0.1] text-[#F0F6FC] focus:border-[#F06543]/60'
          )}
        >
          {CIRCUIT_PRESETS.map((p) => (
            <option
              key={p.id}
              value={p.id}
              className={isLight ? 'bg-white text-slate-800' : 'bg-[#12141C] text-white'}
            >
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-3">
        {/* SECTION 1: LAYER STACKUP */}
        <div
          className={cn(
            'p-2.5 rounded-xl border space-y-2 transition-colors',
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#12141A]/90 border-white/[0.06]'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-between pb-1 border-b',
              isLight ? 'border-slate-200' : 'border-white/[0.06]'
            )}
          >
            <span
              className={cn(
                'text-[10px] uppercase font-bold flex items-center gap-1.5',
                isLight ? 'text-slate-600' : 'text-[#8B949E]'
              )}
            >
              <Layers className={cn('w-3.5 h-3.5', isLight ? 'text-sky-600' : 'text-cyan-400')} />
              Layer Stackup
            </span>
            <span className={cn('text-[9px]', isLight ? 'text-slate-400' : 'text-[#6E7681]')}>
              2-Layer FR-4
            </span>
          </div>

          {/* Active Routing Layer Button */}
          <div
            className={cn(
              'flex items-center gap-1.5 p-1 rounded-lg border text-[10px]',
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090B0E] border-white/[0.06]'
            )}
          >
            <span className={cn('px-1 font-bold', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>
              Active:
            </span>
            <button
              type="button"
              onClick={() => setActiveLayer('F_Cu')}
              className={cn(
                'flex-1 py-0.5 rounded text-center font-bold transition-all cursor-pointer',
                activeLayer === 'F_Cu'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-sm'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-[#8B949E] hover:text-white'
              )}
            >
              Top (F.Cu)
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('B_Cu')}
              className={cn(
                'flex-1 py-0.5 rounded text-center font-bold transition-all cursor-pointer',
                activeLayer === 'B_Cu'
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow-sm'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-[#8B949E] hover:text-white'
              )}
            >
              Bot (B.Cu)
            </button>
          </div>

          {/* Layer List & Toggles */}
          <div className="space-y-1">
            {layersList.map((layer) => {
              const isVisible = visibleLayers[layer.id];
              return (
                <div
                  key={layer.id}
                  className={cn(
                    'flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-colors',
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.04]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0 border border-black/30"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span
                      className={cn(
                        'truncate',
                        isVisible
                          ? isLight
                            ? 'text-slate-800 font-medium'
                            : 'text-[#F0F6FC]'
                          : isLight
                          ? 'text-slate-400 line-through'
                          : 'text-[#6E7681] line-through'
                      )}
                    >
                      {layer.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleLayerVisibility(layer.id)}
                    className={cn(
                      'p-0.5 transition-colors cursor-pointer',
                      isLight
                        ? 'text-slate-400 hover:text-slate-700'
                        : 'text-[#8B949E] hover:text-white'
                    )}
                    title={isVisible ? 'Hide layer' : 'Show layer'}
                  >
                    {isVisible ? (
                      <Eye
                        className={cn('w-3.5 h-3.5', isLight ? 'text-sky-600' : 'text-cyan-400')}
                      />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-500 opacity-60" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: PLACED COMPONENTS */}
        <div
          className={cn(
            'p-2.5 rounded-xl border space-y-2 transition-colors',
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#12141A]/90 border-white/[0.06]'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-between pb-1 border-b',
              isLight ? 'border-slate-200' : 'border-white/[0.06]'
            )}
          >
            <span
              className={cn(
                'text-[10px] uppercase font-bold flex items-center gap-1.5',
                isLight ? 'text-slate-600' : 'text-[#8B949E]'
              )}
            >
              <Cpu className={cn('w-3.5 h-3.5', isLight ? 'text-sky-600' : 'text-cyan-400')} />
              Components ({project.placedComponents.length})
            </span>
            <span className={cn('text-[9px]', isLight ? 'text-slate-400' : 'text-[#6E7681]')}>
              Click to Focus
            </span>
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {project.placedComponents.map((comp) => {
              const isSelected = selectedComponentId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComponentId(isSelected ? null : comp.id)}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all border',
                    isSelected
                      ? isLight
                        ? 'bg-sky-50 text-sky-900 border-sky-400 font-bold shadow-sm'
                        : 'bg-cyan-950/70 text-cyan-200 border-cyan-500/50 font-bold'
                      : isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-[#161B22]/60 hover:bg-[#21262D] text-[#8B949E] border-transparent hover:text-white'
                  )}
                >
                  <div className="truncate flex-1">
                    <span className="font-bold mr-1.5 text-white">{comp.designator}</span>
                    <span
                      className={cn('text-[10px]', isLight ? 'text-slate-500' : 'text-[#8B949E]')}
                    >
                      {comp.value}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      rotateComponent(comp.id);
                    }}
                    title="Rotate 90°"
                    className={cn(
                      'p-1 transition-colors cursor-pointer',
                      isLight
                        ? 'text-slate-400 hover:text-sky-600'
                        : 'text-[#8B949E] hover:text-cyan-300'
                    )}
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: NETS LIST */}
        <div
          className={cn(
            'p-2.5 rounded-xl border space-y-2 transition-colors',
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#12141A]/90 border-white/[0.06]'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-between pb-1 border-b',
              isLight ? 'border-slate-200' : 'border-white/[0.06]'
            )}
          >
            <span
              className={cn(
                'text-[10px] uppercase font-bold flex items-center gap-1.5',
                isLight ? 'text-slate-600' : 'text-[#8B949E]'
              )}
            >
              <Grid className={cn('w-3.5 h-3.5', isLight ? 'text-sky-600' : 'text-cyan-400')} />
              Nets ({project.nets.length})
            </span>
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
            {project.nets.map((net) => {
              const isSelected = selectedNetId === net.netId;
              return (
                <div
                  key={net.netId}
                  onClick={() => setSelectedNetId(isSelected ? null : net.netId)}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors border',
                    isSelected
                      ? isLight
                        ? 'bg-sky-50 text-sky-900 border-sky-400 font-bold'
                        : 'bg-cyan-950/70 text-cyan-200 border-cyan-500/50 font-bold'
                      : isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-[#161B22]/60 hover:bg-[#21262D] text-[#8B949E] border-transparent hover:text-white'
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/30"
                    style={{ backgroundColor: net.color }}
                  />
                  <span className="truncate flex-1 text-[11px]">{net.name}</span>
                  <span
                    className={cn(
                      'text-[9px] font-mono shrink-0',
                      isLight ? 'text-slate-400' : 'text-[#6E7681]'
                    )}
                  >
                    Net {net.netId}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: DRC QUICK CHECK ACTION */}
        <div
          className={cn(
            'p-2.5 rounded-xl border flex items-center justify-between transition-colors',
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : 'bg-[#161B22]/70 border-white/[0.08] text-white'
          )}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[11px] font-bold block">DRC Engine</span>
              <span
                className={cn('text-[9px] block', isLight ? 'text-slate-500' : 'text-[#8B949E]')}
              >
                IPC-2221 Rules
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={runDrc}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-sm transition-all cursor-pointer"
          >
            Run DRC
          </button>
        </div>
      </div>
    </div>
  );
}
