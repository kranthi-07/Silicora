'use client';

import React, { useState, useEffect } from 'react';
import { ComponentItem } from '@/types/component';
import { ElectricalOutputs } from '@/lib/simulation/types';
import { Badge } from '@/components/ui/badge';
import { Zap, Flame, Activity, Info, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisualPhysicsWidgetProps {
  component: ComponentItem;
  outputs: ElectricalOutputs;
}

// Resistor Color Code Table
const RESISTOR_COLORS = [
  { name: 'Black', hex: '#0F172A', text: '#FFFFFF', digit: 0, mult: 1 },
  { name: 'Brown', hex: '#78350F', text: '#FFFFFF', digit: 1, mult: 10 },
  { name: 'Red', hex: '#DC2626', text: '#FFFFFF', digit: 2, mult: 100 },
  { name: 'Orange', hex: '#EA580C', text: '#FFFFFF', digit: 3, mult: 1000 },
  { name: 'Yellow', hex: '#CA8A04', text: '#000000', digit: 4, mult: 10000 },
  { name: 'Green', hex: '#16A34A', text: '#FFFFFF', digit: 5, mult: 100000 },
  { name: 'Blue', hex: '#2563EB', text: '#FFFFFF', digit: 6, mult: 1000000 },
  { name: 'Violet', hex: '#9333EA', text: '#FFFFFF', digit: 7, mult: 10000000 },
  { name: 'Grey', hex: '#4B5563', text: '#FFFFFF', digit: 8, mult: 100000000 },
  { name: 'White', hex: '#F9FAFB', text: '#000000', digit: 9, mult: 1000000000 },
];

export function VisualPhysicsWidget({ component, outputs }: VisualPhysicsWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [activePin, setActivePin] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom states for Resistor Color Decoder
  const [band1, setBand1] = useState(1); // Brown
  const [band2, setBand2] = useState(0); // Black
  const [band3, setBand3] = useState(3); // Orange (10^3 = 1k)
  const isResistor = component.category === 'passive' && component.name.toLowerCase().includes('resistor');

  const calculatedResistance = (band1 * 10 + band2) * RESISTOR_COLORS[band3].mult;
  const formattedResistance =
    calculatedResistance >= 1e6
      ? `${(calculatedResistance / 1e6).toFixed(1)} MΩ`
      : calculatedResistance >= 1e3
      ? `${(calculatedResistance / 1e3).toFixed(0)} kΩ`
      : `${calculatedResistance} Ω`;

  const isCapacitor = component.category === 'passive' && component.name.toLowerCase().includes('capacitor');
  const isLed = component.category === 'optoelectronics' || component.name.toLowerCase().includes('led');

  // Guard values for SSR to prevent hydration discrepancy
  const displayVoltage = mounted ? outputs.voltageDrop : 5.0;
  const displayCurrent = mounted ? outputs.branchCurrent : 0.0005;
  const displayPower = mounted ? outputs.powerDissipation : 0.0025;
  const displayTemp = mounted ? outputs.thermal.junctionTempC : 25.0;

  // Thermal safe percentage
  const maxPdiss = component.electrical?.ratings?.maxPowerDissipationW || 0.25;
  const powerPercent = Math.min(100, Math.max(5, (displayPower / maxPdiss) * 100));

  return (
    <div className="space-y-2.5 font-sans select-none">
      {/* 1. VISUAL MULTI-METER GAUGE */}
      <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#161B22] to-[#101318] border border-[#30363D]/80 shadow-card space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <Zap className="w-3 h-3" />
            </span>
            <span className="text-[10px] font-bold text-[#F0F6FC] uppercase tracking-wider font-mono">
              Live Physics
            </span>
          </div>
          <Badge
            variant={
              outputs.limits.burnoutTriggered
                ? 'critical'
                : outputs.limits.isOverstressed
                ? 'warning'
                : 'nominal'
            }
            size="xs"
            className="animate-pulse text-[8px] px-1.5 py-0.2"
          >
            {outputs.limits.burnoutTriggered
              ? 'BURNT'
              : outputs.limits.isOverstressed
              ? 'OVER'
              : 'STABLE'}
          </Badge>
        </div>

        {/* Visual Voltage & Current Arc Gauges */}
        <div className="grid grid-cols-2 gap-2">
          {/* Voltage Dial */}
          <div className="p-2 rounded-lg bg-[#0D1117] border border-[#21262D] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[9px] font-mono text-[#8B949E]">
              <span>VOLTAGE</span>
              <span className="text-cyan-400 font-bold">V_drop</span>
            </div>
            
            <div className="my-1 flex items-baseline gap-0.5">
              <span suppressHydrationWarning className="text-lg font-bold font-mono text-cyan-400 tracking-tight">
                {displayVoltage.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono text-[#8B949E]">V</span>
            </div>

            {/* Visual dynamic potential bar */}
            <div className="w-full bg-[#161B22] h-1.5 rounded-full overflow-hidden border border-[#21262D]/60">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (displayVoltage / 12) * 100)}%` }}
              />
            </div>
          </div>

          {/* Current Flow Chevrons */}
          <div className="p-2 rounded-lg bg-[#0D1117] border border-[#21262D] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[9px] font-mono text-[#8B949E]">
              <span>CURRENT</span>
              <span className="text-emerald-400 font-bold">I_branch</span>
            </div>

            <div className="my-1 flex items-baseline gap-0.5">
              <span suppressHydrationWarning className="text-lg font-bold font-mono text-emerald-400 tracking-tight">
                {Math.abs(displayCurrent) < 1e-3
                  ? (displayCurrent * 1e6).toFixed(1)
                  : (displayCurrent * 1e3).toFixed(2)}
              </span>
              <span className="text-[10px] font-mono text-[#8B949E]">
                {Math.abs(displayCurrent) < 1e-3 ? 'µA' : 'mA'}
              </span>
            </div>

            {/* Animated Flow Chevrons */}
            <div className="w-full bg-[#161B22] h-1.5 rounded-full overflow-hidden flex items-center px-1 gap-1 border border-[#21262D]/60">
              <span className="w-1.5 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="w-1.5 h-1 rounded-full bg-emerald-400 animate-pulse delay-75" />
              <span className="w-1.5 h-1 rounded-full bg-emerald-400 animate-pulse delay-150" />
            </div>
          </div>
        </div>

        {/* Visual Thermal & Power Dissipation Gauge */}
        <div className="p-2 rounded-lg bg-[#0D1117] border border-[#21262D] space-y-1">
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span suppressHydrationWarning className="text-[#8B949E] flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-amber-400" />
              LOAD ({displayTemp.toFixed(1)}°C)
            </span>
            <span suppressHydrationWarning className="text-amber-400 font-bold">
              {displayPower < 1
                ? `${(displayPower * 1e3).toFixed(1)} mW`
                : `${displayPower.toFixed(2)} W`}
            </span>
          </div>

          <div className="w-full bg-[#161B22] h-1.5 rounded-full overflow-hidden border border-[#21262D]/60">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                powerPercent > 85
                  ? 'bg-gradient-to-r from-amber-500 to-red-500'
                  : 'bg-gradient-to-r from-emerald-500 via-amber-400 to-cyan-400'
              )}
              style={{ width: `${powerPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. COMPONENT-SPECIFIC ANIMATED VISUALIZERS */}
      
      {/* CASE A: Resistor Interactive Color Band Visualizer & Live Decoder */}
      {isResistor && (
        <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#161B22] to-[#101318] border border-[#30363D]/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#F0F6FC] font-mono flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" />
              Color Band Decoder
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
              {formattedResistance}
            </span>
          </div>

          {/* Graphical Resistor Representation */}
          <div className="py-1.5 px-2 rounded-lg bg-[#0D1117] border border-[#21262D] flex items-center justify-center relative overflow-hidden">
            <div className="flex items-center relative z-10 w-full max-w-[180px] justify-center">
              {/* Left Lead */}
              <div className="w-4 h-1 bg-slate-400 rounded-l shrink-0" />

              {/* Resistor Body */}
              <div className="flex-1 h-8 rounded-lg bg-gradient-to-r from-[#D9B78B] via-[#E2C7A3] to-[#D9B78B] border border-[#8C6D46] shadow-sm flex items-center justify-around px-2 relative">
                {/* Band 1 */}
                <button
                  type="button"
                  onClick={() => setBand1((b) => (b + 1) % 10)}
                  className="w-3 h-full transition-transform hover:scale-110 cursor-pointer rounded-xs shadow"
                  style={{ backgroundColor: RESISTOR_COLORS[band1].hex }}
                  title={`Band 1: ${RESISTOR_COLORS[band1].name} (${band1})`}
                />
                {/* Band 2 */}
                <button
                  type="button"
                  onClick={() => setBand2((b) => (b + 1) % 10)}
                  className="w-3 h-full transition-transform hover:scale-110 cursor-pointer rounded-xs shadow"
                  style={{ backgroundColor: RESISTOR_COLORS[band2].hex }}
                  title={`Band 2: ${RESISTOR_COLORS[band2].name} (${band2})`}
                />
                {/* Band 3 Multiplier */}
                <button
                  type="button"
                  onClick={() => setBand3((b) => (b + 1) % 6)}
                  className="w-3 h-full transition-transform hover:scale-110 cursor-pointer rounded-xs shadow"
                  style={{ backgroundColor: RESISTOR_COLORS[band3].hex }}
                  title={`Multiplier: ${RESISTOR_COLORS[band3].name} (x${RESISTOR_COLORS[band3].mult})`}
                />
                {/* Band 4 Tolerance */}
                <div
                  className="w-2.5 h-full rounded-xs bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow"
                  title="Tolerance: Gold (±5%)"
                />
              </div>

              {/* Right Lead */}
              <div className="w-4 h-1 bg-slate-400 rounded-r shrink-0" />
            </div>
          </div>

          {/* Interactive band value badges */}
          <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9px]">
            <div
              className="p-1 rounded border border-[#21262D] cursor-pointer hover:border-cyan-500/50 transition-colors"
              style={{ backgroundColor: `${RESISTOR_COLORS[band1].hex}25` }}
              onClick={() => setBand1((b) => (b + 1) % 10)}
            >
              <div className="text-[#8B949E] text-[8px]">1st</div>
              <div className="font-bold text-[#F0F6FC]">{band1}</div>
            </div>
            <div
              className="p-1 rounded border border-[#21262D] cursor-pointer hover:border-cyan-500/50 transition-colors"
              style={{ backgroundColor: `${RESISTOR_COLORS[band2].hex}25` }}
              onClick={() => setBand2((b) => (b + 1) % 10)}
            >
              <div className="text-[#8B949E] text-[8px]">2nd</div>
              <div className="font-bold text-[#F0F6FC]">{band2}</div>
            </div>
            <div
              className="p-1 rounded border border-[#21262D] cursor-pointer hover:border-cyan-500/50 transition-colors"
              style={{ backgroundColor: `${RESISTOR_COLORS[band3].hex}25` }}
              onClick={() => setBand3((b) => (b + 1) % 6)}
            >
              <div className="text-[#8B949E] text-[8px]">Mult</div>
              <div className="font-bold text-[#F0F6FC]">10^{band3}</div>
            </div>
          </div>
        </div>
      )}

      {/* CASE B: Capacitor Visual Dielectric Charge Tank */}
      {isCapacitor && (
        <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#161B22] to-[#101318] border border-[#30363D]/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#F0F6FC] font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 text-blue-400" />
              Charge Tank
            </span>
            <span className="text-[9px] font-mono font-bold text-blue-400">
              Q = 2.35 mC
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#0D1117] border border-[#21262D] space-y-1">
            <div className="w-full h-3 bg-[#161B22] rounded overflow-hidden border border-[#21262D] p-0.5">
              <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded animate-pulse" style={{ width: '45%' }} />
            </div>
            <div className="flex justify-between text-[8px] font-mono text-[#6E7681]">
              <span>0V</span>
              <span>5.0V</span>
              <span>25V Max</span>
            </div>
          </div>
        </div>
      )}

      {/* CASE C: LED Visual Photon Emission Spectrum */}
      {isLed && (
        <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#161B22] to-[#101318] border border-[#30363D]/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#F0F6FC] font-mono flex items-center gap-1">
              <Zap className="w-3 h-3 text-red-400" />
              Photon Emission
            </span>
            <span className="text-[9px] font-mono font-bold text-red-400">
              625 nm
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#0D1117] border border-[#21262D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              </div>
              <div className="text-[10px] font-bold text-[#F0F6FC]">Radiant Flux Active</div>
            </div>
            <Badge variant="nominal" size="xs" className="text-[8px] px-1 py-0.2">ACTIVE</Badge>
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE PINOUT PROBE */}
      <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#161B22] to-[#101318] border border-[#30363D]/80 shadow-card space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#F0F6FC] font-mono flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Pinout Leads
          </span>
          <span className="text-[9px] text-[#8B949E] font-mono">
            {component.package.pins.length} Pins
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {component.package.pins.map((pin) => {
            const isSelected = activePin === pin.pinNumber;
            return (
              <button
                key={pin.pinNumber}
                type="button"
                onClick={() => setActivePin(isSelected ? null : pin.pinNumber)}
                className={cn(
                  'p-1.5 rounded-lg text-left border font-mono transition-all',
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/60 shadow-sm'
                    : 'bg-[#0D1117] border-[#21262D] hover:bg-[#161B22]'
                )}
              >
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-[#F0F6FC]">P{pin.pinNumber}</span>
                  <span className="text-cyan-400 font-semibold">{pin.type}</span>
                </div>
                <div className="text-[8px] text-[#8B949E] truncate mt-0.5">
                  {pin.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. EXPANDABLE THEORY ACCORDION */}
      <div className="rounded-xl border border-[#30363D]/60 bg-[#101318]/70 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTheory(!showTheory)}
          className="w-full px-2.5 py-1.5 flex items-center justify-between text-[10px] font-medium text-[#8B949E] hover:text-[#F0F6FC] transition-colors font-mono"
        >
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-cyan-400" />
            Physics & Principle
          </span>
          {showTheory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showTheory && (
          <div className="p-2 text-[10px] text-[#8B949E] leading-relaxed border-t border-[#21262D] space-y-1 bg-[#0D1117]">
            <p className="text-[#F0F6FC]">
              {component.educational.tagline}
            </p>
            <p className="text-[#6E7681]">
              {component.educational.physicalOperatingPrinciple}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
