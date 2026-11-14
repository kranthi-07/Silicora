'use client';

import React from 'react';
import { useCircuitStore } from '@/lib/circuit/circuit-store';
import { MultimeterMode } from '@/lib/circuit/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gauge, Zap, Volume2, X, MoveHorizontal, Disc } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VirtualMultimeterView() {
  const { dmm, setDmmMode, activeTool, setActiveTool, attachDmmProbe, components } =
    useCircuitStore();

  const modes: Array<{ id: MultimeterMode; label: string; icon: string }> = [
    { id: 'voltage_dc', label: 'DC V', icon: 'V⎓' },
    { id: 'voltage_ac', label: 'AC V', icon: 'V~' },
    { id: 'current_dc', label: 'DC mA', icon: 'mA⎓' },
    { id: 'resistance', label: 'Ohms (Ω)', icon: 'Ω' },
    { id: 'continuity', label: 'Continuity', icon: '🔊' },
  ];

  const getCompName = (compId?: string, pinId?: string) => {
    if (!compId) return 'UNATTACHED';
    const comp = components.find((c) => c.id === compId);
    return `${comp?.name || compId} [${pinId || 'Lead'}]`;
  };

  return (
    <div className="w-80 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4 select-none font-mono text-xs shadow-2xl flex flex-col gap-3 transition-colors">
      {/* Multimeter Header & Brand */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#21262D]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="font-bold text-slate-900 dark:text-[#F0F6FC] text-sm tracking-wide">3D-DMM 87V</span>
        </div>
        <Badge variant="accent" size="xs">
          TRUE RMS
        </Badge>
      </div>

      {/* High-Contrast LCD Screen */}
      <div className="bg-[#090B0E] rounded-xl p-3 border border-[#21262D] shadow-inner flex flex-col justify-between h-24">
        {/* Top small mode indicator */}
        <div className="flex items-center justify-between text-[10px] text-[#6E7681]">
          <span>{dmm.mode.toUpperCase().replace('_', ' ')}</span>
          <span className="text-emerald-400 font-bold">AUTO RANGE</span>
        </div>

        {/* Big 7-Segment Readout */}
        <div className="flex items-baseline justify-end gap-1.5 font-bold tracking-tight">
          <span className="text-3xl text-emerald-400 tabular-nums">
            {dmm.isOverload ? 'OL' : dmm.reading.toFixed(3)}
          </span>
          <span className="text-sm text-emerald-500 font-semibold">{dmm.unit}</span>
        </div>

        {/* Bottom Status bar */}
        <div className="flex items-center justify-between text-[9px] text-[#484F58]">
          <span>4000 COUNTS</span>
          <span>SAMPLE: 4/s</span>
        </div>
      </div>

      {/* Rotary Function Selector Buttons */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        {modes.map((m) => {
          const isActive = dmm.mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setDmmMode(m.id)}
              className={cn(
                'py-1.5 px-2 rounded-lg text-center font-bold text-[10px] border transition-all',
                isActive
                  ? 'bg-amber-400/20 text-amber-500 dark:text-amber-400 border-amber-400/60 shadow-sm'
                  : 'bg-slate-100 dark:bg-[#101318] text-slate-600 dark:text-[#8B949E] border-slate-200 dark:border-[#21262D] hover:text-slate-900 dark:hover:text-[#F0F6FC]'
              )}
            >
              <div className="text-xs">{m.icon}</div>
              <div className="text-[9px] tracking-tight truncate">{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* Probe Terminals and Attachment Status */}
      <div className="pt-2 border-t border-slate-200 dark:border-[#21262D] space-y-2 text-[11px]">
        {/* Red Probe (+) */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-[#101318] p-2 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 truncate">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 dark:text-[#6E7681] block">RED PROBE (+)</span>
              <span className="text-slate-800 dark:text-[#F0F6FC] font-semibold truncate block">
                {getCompName(dmm.redProbe.componentId, dmm.redProbe.pinId)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant={activeTool === 'probe_dmm_red' ? 'primary' : 'outline'}
              size="xs"
              onClick={() =>
                setActiveTool(activeTool === 'probe_dmm_red' ? 'select' : 'probe_dmm_red')
              }
            >
              {activeTool === 'probe_dmm_red' ? 'Clipping...' : 'Clip'}
            </Button>
            {dmm.redProbe.componentId && (
              <button
                type="button"
                onClick={() => attachDmmProbe('red', undefined, undefined)}
                className="p-1 text-[#6E7681] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
                title="Unclip Red Probe"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Black Probe (COM) */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-[#101318] p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 truncate">
            <span className="w-3 h-3 rounded-full bg-slate-800 dark:bg-slate-900 border border-slate-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 dark:text-[#6E7681] block">BLACK PROBE (COM)</span>
              <span className="text-slate-800 dark:text-[#F0F6FC] font-semibold truncate block">
                {getCompName(dmm.blackProbe.componentId, dmm.blackProbe.pinId)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant={activeTool === 'probe_dmm_black' ? 'primary' : 'outline'}
              size="xs"
              onClick={() =>
                setActiveTool(activeTool === 'probe_dmm_black' ? 'select' : 'probe_dmm_black')
              }
            >
              {activeTool === 'probe_dmm_black' ? 'Clipping...' : 'Clip'}
            </Button>
            {dmm.blackProbe.componentId && (
              <button
                type="button"
                onClick={() => attachDmmProbe('black', undefined, undefined)}
                className="p-1 text-[#6E7681] hover:text-[#F0F6FC]"
                title="Unclip Black Probe"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
