'use client';

import React, { useMemo } from 'react';
import { WaveformSample } from '@/lib/simulation/types';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface ScopeWaveformProps {
  samples: WaveformSample[];
  isRunning?: boolean;
  className?: string;
}

export function ScopeWaveform({
  samples,
  isRunning = true,
  className,
}: ScopeWaveformProps) {
  const width = 600;
  const height = 180;
  const padding = { top: 15, right: 15, bottom: 20, left: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Auto-scale bounds for CH1 (Voltage) and CH2 (Current)
  const { maxV, minV, maxI, minI, lastSample } = useMemo(() => {
    if (!samples || samples.length === 0) {
      return {
        maxV: 10,
        minV: -10,
        maxI: 0.01,
        minI: -0.01,
        lastSample: { voltage: 0, current: 0, power: 0, temperatureC: 25 },
      };
    }

    const voltages = samples.map((s) => s.voltage);
    const currents = samples.map((s) => s.current);

    const vHigh = Math.max(1, ...voltages);
    const vLow = Math.min(-1, ...voltages);
    const iHigh = Math.max(0.001, ...currents);
    const iLow = Math.min(-0.001, ...currents);

    const vBound = Math.max(Math.abs(vHigh), Math.abs(vLow)) * 1.25;
    const iBound = Math.max(Math.abs(iHigh), Math.abs(iLow)) * 1.25;

    return {
      maxV: vBound,
      minV: -vBound,
      maxI: iBound,
      minI: -iBound,
      lastSample: samples[samples.length - 1],
    };
  }, [samples]);

  // Scalers
  const scaleX = (idx: number, total: number) => {
    if (total <= 1) return padding.left;
    return padding.left + (idx / (total - 1)) * plotWidth;
  };

  const scaleY_V = (val: number) => {
    const norm = (val - minV) / (maxV - minV || 1);
    return padding.top + (1 - norm) * plotHeight;
  };

  const scaleY_I = (val: number) => {
    const norm = (val - minI) / (maxI - minI || 1);
    return padding.top + (1 - norm) * plotHeight;
  };

  // Generate SVG path for Voltage (CH1)
  const vPath = useMemo(() => {
    if (!samples || samples.length < 2) return '';
    return samples
      .map((s, idx) => {
        const x = scaleX(idx, samples.length);
        const y = scaleY_V(s.voltage);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [samples, minV, maxV]);

  // Generate SVG path for Current (CH2)
  const iPath = useMemo(() => {
    if (!samples || samples.length < 2) return '';
    return samples
      .map((s, idx) => {
        const x = scaleX(idx, samples.length);
        const y = scaleY_I(s.current);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [samples, minI, maxI]);

  const formatAmps = (amps: number) => {
    if (Math.abs(amps) < 1e-3) return `${(amps * 1e6).toFixed(1)} µA`;
    if (Math.abs(amps) < 1) return `${(amps * 1e3).toFixed(2)} mA`;
    return `${amps.toFixed(3)} A`;
  };

  return (
    <div
      className={cn(
        'w-full h-full bg-[#05080c] rounded-lg border border-[#162a1e] relative overflow-hidden flex flex-col font-mono select-none shadow-inner',
        className
      )}
    >
      {/* Phosphor Graticule Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d2217_1px,transparent_1px),linear-gradient(to_bottom,#0d2217_1px,transparent_1px)] bg-[size:32px_32px] opacity-70 pointer-events-none" />

      {/* Scope Center Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-px bg-[#184d31]/60" />
        <div className="h-full w-px bg-[#184d31]/60 absolute" />
      </div>

      {/* Top Channel Readout HUD */}
      <div className="relative z-10 px-3 py-1.5 flex items-center justify-between text-[11px] bg-[#07130d]/80 border-b border-[#143323]/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold bg-[#00f0ff]/10 px-2 py-0.5 rounded border border-[#00f0ff]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            CH1 (V): {lastSample.voltage.toFixed(2)} V
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-[#39ff14]/10 px-2 py-0.5 rounded border border-[#39ff14]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CH2 (I): {formatAmps(lastSample.current)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-[#6b9d82]">
          <span>P: {(lastSample.power * 1e3).toFixed(1)} mW</span>
          <span>Tj: {lastSample.temperatureC.toFixed(1)} °C</span>
          <span className={isRunning ? 'text-emerald-400' : 'text-amber-400'}>
            [{isRunning ? 'TRIG: AUTO' : 'HOLD'}]
          </span>
        </div>
      </div>

      {/* Waveform SVG Canvas */}
      <div className="flex-1 relative z-10">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Ground Reference line (0V / 0A) */}
          <line
            x1={padding.left}
            y1={scaleY_V(0)}
            x2={padding.left + plotWidth}
            y2={scaleY_V(0)}
            stroke="#1a4730"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* CH1: Voltage Trace (Cyan Phosphor Glow) */}
          <path
            d={vPath}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isRunning ? 'filter drop-shadow-[0_0_3px_#00f0ff]' : ''}
          />

          {/* CH2: Current Trace (Emerald Phosphor Glow) */}
          <path
            d={iPath}
            fill="none"
            stroke="#39ff14"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            className={isRunning ? 'filter drop-shadow-[0_0_3px_#39ff14]' : ''}
          />

          {/* Left Vertical Graticule Scale Labels */}
          <text x={padding.left - 4} y={padding.top + 10} fill="#00f0ff" fontSize="9" textAnchor="end">
            +{maxV.toFixed(1)}V
          </text>
          <text x={padding.left - 4} y={scaleY_V(0) - 2} fill="#6b9d82" fontSize="8" textAnchor="end">
            0V
          </text>
          <text x={padding.left - 4} y={padding.top + plotHeight - 2} fill="#00f0ff" fontSize="9" textAnchor="end">
            {minV.toFixed(1)}V
          </text>
        </svg>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 px-3 py-1 flex items-center justify-between text-[9px] text-[#527d66] bg-[#07130d]/80 border-t border-[#143323]/60">
        <span>TB: 16.6ms/div</span>
        <span>SWEEP: 60 FPS CONTINUOUS</span>
        <span>BUFFER: {samples.length} FRAMES</span>
      </div>
    </div>
  );
}
