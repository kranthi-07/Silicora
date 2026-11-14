'use client';

import React from 'react';
import { useCircuitStore } from '@/lib/circuit/circuit-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VirtualOscilloscopeView() {
  const { scope, activeTool, setActiveTool, attachScopeProbe, components, isSimRunning } =
    useCircuitStore();

  const getPinName = (compId?: string, pinId?: string) => {
    if (!compId) return 'UNATTACHED';
    const comp = components.find((c) => c.id === compId);
    return `${comp?.name || compId} [${pinId || 'Pin'}]`;
  };

  const width = 340;
  const height = 140;
  const padding = 15;

  // Scale waveforms to SVG paths
  const makePath = (data: number[]) => {
    if (!data || data.length < 2) return '';
    const maxVal = Math.max(1, ...data.map((d) => Math.abs(d))) * 1.25;
    return data
      .map((val, idx) => {
        const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
        const norm = (val + maxVal) / (2 * maxVal);
        const y = padding + (1 - norm) * (height - padding * 2);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const ch1Path = makePath(scope.waveformCh1);
  const ch2Path = makePath(scope.waveformCh2);

  const lastCH1 = scope.waveformCh1[scope.waveformCh1.length - 1] || 0;
  const lastCH2 = scope.waveformCh2[scope.waveformCh2.length - 1] || 0;

  return (
    <div className="w-96 bg-[#161B22] border border-[#30363D] rounded-2xl p-4 select-none font-mono text-xs shadow-2xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#21262D]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-[#F0F6FC]">Bench Oscilloscope</span>
        </div>
        <Badge variant={isSimRunning ? 'nominal' : 'warning'} size="xs">
          {isSimRunning ? 'AUTO TRIGGER' : 'HOLD'}
        </Badge>
      </div>

      {/* Phosphor Scope Screen */}
      <div className="w-full h-36 bg-[#05080c] rounded-xl border border-[#162a1e] relative overflow-hidden flex flex-col justify-between p-2 shadow-inner">
        {/* Reticle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d2217_1px,transparent_1px),linear-gradient(to_bottom,#0d2217_1px,transparent_1px)] bg-[size:24px_24px] opacity-70 pointer-events-none" />

        {/* Readouts top HUD */}
        <div className="relative z-10 flex items-center justify-between text-[10px]">
          <span className="text-cyan-400 font-bold bg-[#00f0ff]/10 px-1.5 py-0.5 rounded border border-[#00f0ff]/30">
            CH1: {lastCH1.toFixed(2)} V
          </span>
          <span className="text-emerald-400 font-bold bg-[#39ff14]/10 px-1.5 py-0.5 rounded border border-[#39ff14]/30">
            CH2: {lastCH2.toFixed(2)} V
          </span>
        </div>

        {/* Waveform SVG */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full relative z-10" preserveAspectRatio="none">
          {/* Ground reference */}
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="#1a4730"
            strokeDasharray="3 3"
          />
          {/* CH1 Trace (Cyan) */}
          <path d={ch1Path} fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
          {/* CH2 Trace (Emerald) */}
          <path d={ch2Path} fill="none" stroke="#39ff14" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex items-center justify-between text-[8px] text-[#527d66]">
          <span>TB: 16.6ms/div</span>
          <span>CH1: 2.0V/div</span>
        </div>
      </div>

      {/* Channel Probes Clip Controls */}
      <div className="space-y-2 text-[11px] pt-1">
        {/* CH1 Clip */}
        <div className="flex items-center justify-between bg-[#101318] p-2 rounded-lg border border-cyan-500/20">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#6E7681] block">CHANNEL 1 (CYAN)</span>
              <span className="text-[#F0F6FC] font-semibold truncate block">
                {getPinName(scope.ch1.componentId, scope.ch1.pinId)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant={activeTool === 'probe_scope_ch1' ? 'primary' : 'outline'}
              size="xs"
              onClick={() =>
                setActiveTool(activeTool === 'probe_scope_ch1' ? 'select' : 'probe_scope_ch1')
              }
            >
              {activeTool === 'probe_scope_ch1' ? 'Clipping...' : 'Clip'}
            </Button>
            {scope.ch1.componentId && (
              <button
                type="button"
                onClick={() => attachScopeProbe('ch1', undefined, undefined)}
                className="p-1 text-[#6E7681] hover:text-[#F0F6FC]"
                title="Unclip CH1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* CH2 Clip */}
        <div className="flex items-center justify-between bg-[#101318] p-2 rounded-lg border border-emerald-500/20">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#6E7681] block">CHANNEL 2 (GREEN)</span>
              <span className="text-[#F0F6FC] font-semibold truncate block">
                {getPinName(scope.ch2.componentId, scope.ch2.pinId)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant={activeTool === 'probe_scope_ch2' ? 'primary' : 'outline'}
              size="xs"
              onClick={() =>
                setActiveTool(activeTool === 'probe_scope_ch2' ? 'select' : 'probe_scope_ch2')
              }
            >
              {activeTool === 'probe_scope_ch2' ? 'Clipping...' : 'Clip'}
            </Button>
            {scope.ch2.componentId && (
              <button
                type="button"
                onClick={() => attachScopeProbe('ch2', undefined, undefined)}
                className="p-1 text-[#6E7681] hover:text-[#F0F6FC]"
                title="Unclip CH2"
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
