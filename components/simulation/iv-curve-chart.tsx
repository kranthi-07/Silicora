'use client';

import React, { useMemo } from 'react';
import { IVCurvePoint } from '@/lib/simulation/types';
import { cn } from '@/lib/utils';

interface IVCurveChartProps {
  points: IVCurvePoint[];
  currentVoltage: number;
  currentCurrent: number;
  className?: string;
  title?: string;
}

export function IVCurveChart({
  points,
  currentVoltage,
  currentCurrent,
  className,
  title = 'Live I-V Characteristic Curve Tracer',
}: IVCurveChartProps) {
  // Chart dimensions & margins
  const width = 420;
  const height = 220;
  const margin = { top: 20, right: 25, bottom: 30, left: 45 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Determine plot bounds
  const { vMin, vMax, iMin, iMax } = useMemo(() => {
    if (!points || points.length === 0) {
      return { vMin: -10, vMax: 10, iMin: -0.01, iMax: 0.01 };
    }
    let minV = Math.min(-2, ...points.map((p) => p.voltage), currentVoltage);
    let maxV = Math.max(2, ...points.map((p) => p.voltage), currentVoltage);
    let minI = Math.min(-0.001, ...points.map((p) => p.current), currentCurrent);
    let maxI = Math.max(0.001, ...points.map((p) => p.current), currentCurrent);

    // Add padding
    const vSpan = maxV - minV || 1;
    const iSpan = maxI - minI || 0.002;
    minV -= vSpan * 0.05;
    maxV += vSpan * 0.05;
    minI -= iSpan * 0.05;
    maxI += iSpan * 0.05;

    return { vMin: minV, vMax: maxV, iMin: minI, iMax: maxI };
  }, [points, currentVoltage, currentCurrent]);

  // Coordinate scales
  const scaleX = (v: number) => {
    return margin.left + ((v - vMin) / (vMax - vMin)) * plotWidth;
  };

  const scaleY = (i: number) => {
    return margin.top + (1 - (i - iMin) / (iMax - iMin)) * plotHeight;
  };

  // Zero-crossing axes
  const originX = Math.max(margin.left, Math.min(margin.left + plotWidth, scaleX(0)));
  const originY = Math.max(margin.top, Math.min(margin.top + plotHeight, scaleY(0)));

  // SVG path generation
  const pathD = useMemo(() => {
    if (!points || points.length < 2) return '';
    return points
      .map((p, idx) => {
        const x = scaleX(p.voltage);
        const y = scaleY(p.current);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [points, vMin, vMax, iMin, iMax]);

  // Operating point coordinates
  const opX = Math.max(margin.left, Math.min(margin.left + plotWidth, scaleX(currentVoltage)));
  const opY = Math.max(margin.top, Math.min(margin.top + plotHeight, scaleY(currentCurrent)));

  // Format current for display
  const formatCurrent = (amps: number) => {
    if (Math.abs(amps) < 1e-3) return `${(amps * 1e6).toFixed(1)} µA`;
    if (Math.abs(amps) < 1) return `${(amps * 1e3).toFixed(2)} mA`;
    return `${amps.toFixed(3)} A`;
  };

  return (
    <div className={cn('bg-[#090B0E] border border-[#21262D] rounded-xl p-3 select-none flex flex-col font-mono', className)}>
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#21262D] text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-[#F0F6FC]">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#8B949E]">
          <span>OP:</span>
          <span className="text-cyan-400 font-bold">{currentVoltage.toFixed(2)} V</span>
          <span className="text-[#30363D]">|</span>
          <span className="text-emerald-400 font-bold">{formatCurrent(currentCurrent)}</span>
        </div>
      </div>

      {/* SVG Canvas Plot */}
      <div className="relative w-full aspect-[2/1] min-h-[170px] mt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Background gridlines */}
          <defs>
            <pattern id="iv-grid" width="30" height="20" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#161B22" strokeWidth="1" />
            </pattern>
            <radialGradient id="op-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect
            x={margin.left}
            y={margin.top}
            width={plotWidth}
            height={plotHeight}
            fill="#090B0E"
          />
          <rect
            x={margin.left}
            y={margin.top}
            width={plotWidth}
            height={plotHeight}
            fill="url(#iv-grid)"
          />

          {/* Coordinate axes */}
          {/* Zero X Axis (Horizontal) */}
          <line
            x1={margin.left}
            y1={originY}
            x2={margin.left + plotWidth}
            y2={originY}
            stroke="#30363D"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* Zero Y Axis (Vertical) */}
          <line
            x1={originX}
            y1={margin.top}
            x2={originX}
            y2={margin.top + plotHeight}
            stroke="#30363D"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Theoretical Characteristic Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#58A6FF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic Operating Point Drop Lines */}
          <line
            x1={opX}
            y1={originY}
            x2={opX}
            y2={opY}
            stroke="#00f0ff"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.6"
          />
          <line
            x1={originX}
            y1={opY}
            x2={opX}
            y2={opY}
            stroke="#00f0ff"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.6"
          />

          {/* Operating Point Glow & Reticle */}
          <circle cx={opX} cy={opY} r="10" fill="url(#op-glow)" />
          <circle cx={opX} cy={opY} r="4.5" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" />

          {/* Axes labels */}
          <text
            x={margin.left + plotWidth - 5}
            y={originY - 6}
            fill="#8B949E"
            fontSize="9"
            textAnchor="end"
          >
            +V (Volts)
          </text>
          <text
            x={originX + 6}
            y={margin.top + 10}
            fill="#8B949E"
            fontSize="9"
            textAnchor="start"
          >
            +I (Amps)
          </text>

          {/* Axis Scale Extremes */}
          <text x={margin.left} y={height - 8} fill="#6E7681" fontSize="8">
            {vMin.toFixed(1)}V
          </text>
          <text x={margin.left + plotWidth} y={height - 8} fill="#6E7681" fontSize="8" textAnchor="end">
            {vMax.toFixed(1)}V
          </text>
          <text x={margin.left - 4} y={margin.top + 10} fill="#6E7681" fontSize="8" textAnchor="end">
            {formatCurrent(iMax)}
          </text>
          <text x={margin.left - 4} y={margin.top + plotHeight} fill="#6E7681" fontSize="8" textAnchor="end">
            {formatCurrent(iMin)}
          </text>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-[#21262D] text-[10px] text-[#8B949E] mt-1">
        <span>Slope: {(Math.abs(currentCurrent) > 1e-9 ? `${(currentVoltage / currentCurrent).toFixed(0)} Ω` : '∞')}</span>
        <span className="text-cyan-400">Swept: {points.length} nodes</span>
      </div>
    </div>
  );
}
