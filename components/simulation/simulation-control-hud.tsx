'use client';

import React, { useState, useEffect } from 'react';
import { useSimulation } from '@/lib/simulation/use-simulation';
import { useWorkspaceStore } from '@/lib/store';
import {
  Play,
  Square,
  Zap,
  Flame,
  Activity,
  Gauge,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkbenchAudio } from '@/lib/audio/workbench-sounds';

export function SimulationControlHud() {
  const {
    inputs,
    outputs,
    setSupplyVoltage,
    setPrimaryParameter,
    start,
    pause,
  } = useSimulation();

  const {
    isSimRunning,
    isSimLoading,
    startSimulationWithLoading,
    stopSimulationEngine,
    selectedComponent,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';

  const [expanded, setExpanded] = useState(true);
  // Control Mode: 'voltage' or 'current'
  const [controlMode, setControlMode] = useState<'voltage' | 'current'>('voltage');

  // Local state for free-hand user interaction
  const [userVoltage, setUserVoltage] = useState<number>(inputs.supplyVoltage || 5.0);
  const [userResistance, setUserResistance] = useState<number>(inputs.primaryParameter || 10000);
  const [userCurrentMa, setUserCurrentMa] = useState<number>(
    inputs.primaryParameter > 0
      ? (inputs.supplyVoltage / inputs.primaryParameter) * 1000
      : 20
  );

  // Sync when inputs change from outside (e.g. changing component)
  useEffect(() => {
    if (inputs.supplyVoltage !== undefined) {
      setUserVoltage(inputs.supplyVoltage);
    }
    if (inputs.primaryParameter !== undefined && inputs.primaryParameter > 0) {
      setUserResistance(inputs.primaryParameter);
    }
  }, [inputs.supplyVoltage, inputs.primaryParameter]);

  // Handle Voltage slider change
  const handleVoltageChange = (val: number) => {
    WorkbenchAudio.playDialTick();
    const v = Math.max(0, Number(val.toFixed(2)));
    setUserVoltage(v);
    setSupplyVoltage(v);
    if (userResistance > 0) {
      const iMa = (v / userResistance) * 1000;
      setUserCurrentMa(Number(iMa.toFixed(2)));
    }
  };

  // Handle Resistance slider change
  const handleResistanceChange = (val: number) => {
    WorkbenchAudio.playDialTick();
    const r = Math.max(1, Number(val));
    setUserResistance(r);
    setPrimaryParameter(r);
    if (controlMode === 'current') {
      // Keep current constant -> adjust voltage V = I * R
      const v = (userCurrentMa / 1000) * r;
      const clampedV = Math.min(48, Math.max(0, Number(v.toFixed(2))));
      setUserVoltage(clampedV);
      setSupplyVoltage(clampedV);
    } else {
      // Keep voltage constant -> recalculate current
      const iMa = (userVoltage / r) * 1000;
      setUserCurrentMa(Number(iMa.toFixed(2)));
    }
  };

  // Handle Current slider change
  const handleCurrentChange = (valMa: number) => {
    WorkbenchAudio.playDialTick();
    const iMa = Math.max(0.1, Number(valMa));
    setUserCurrentMa(iMa);
    // V = I * R
    const targetV = (iMa / 1000) * userResistance;
    const clampedV = Math.min(48, Math.max(0, Number(targetV.toFixed(2))));
    setUserVoltage(clampedV);
    setSupplyVoltage(clampedV);
  };

  const handleStartSimulation = () => {
    WorkbenchAudio.playSwitchClick();
    startSimulationWithLoading();
    start();
  };

  const handleStopSimulation = () => {
    WorkbenchAudio.playSwitchClick();
    stopSimulationEngine();
    pause();
  };

  const formatCurrent = (amps: number) => {
    if (!isSimRunning) return '0.00 mA';
    if (Math.abs(amps) < 1e-6) return `${(amps * 1e9).toFixed(1)} nA`;
    if (Math.abs(amps) < 1e-3) return `${(amps * 1e6).toFixed(1)} µA`;
    if (Math.abs(amps) < 1) return `${(amps * 1e3).toFixed(2)} mA`;
    return `${amps.toFixed(3)} A`;
  };

  const formatPower = (watts: number) => {
    if (!isSimRunning) return '0.00 mW';
    if (watts < 1e-3) return `${(watts * 1e6).toFixed(1)} µW`;
    if (watts < 1) return `${(watts * 1e3).toFixed(1)} mW`;
    return `${watts.toFixed(2)} W`;
  };

  const formatResistance = (ohms: number) => {
    if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(1)} MΩ`;
    if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(1)} kΩ`;
    return `${ohms.toFixed(0)} Ω`;
  };

  return (
    <div
      id="tutorial-sim-hud"
      className="absolute top-14 right-4 z-20 pointer-events-auto w-88 max-w-[calc(100vw-2rem)] select-none font-mono"
    >
      <div
        className={cn(
          'backdrop-blur-xl rounded-2xl border overflow-hidden flex flex-col transition-all',
          isLight
            ? 'bg-white/95 border-slate-300 shadow-xl text-slate-800'
            : 'bg-[#101318]/95 border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-[#F0F6FC]'
        )}
      >
        {/* Top Header Bar */}
        <div
          className={cn(
            'px-4 py-2.5 border-b flex items-center justify-between transition-colors',
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/90 border-white/[0.08]'
          )}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                isSimRunning
                  ? 'bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse'
                  : 'bg-amber-400'
              )}
            />
            <span
              className={cn(
                'text-xs font-bold tracking-tight',
                isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
              )}
            >
              Interactive Sim Engine
            </span>
            <span
              className={cn(
                'text-[9px] font-bold px-2 py-0.5 rounded-full border',
                isSimRunning
                  ? isLight
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isLight
                  ? 'bg-slate-200/80 text-slate-600 border-slate-300'
                  : 'bg-white/[0.06] text-[#8B949E] border-white/[0.08]'
              )}
            >
              {isSimRunning ? 'SIMULATING LIVE' : 'STANDBY'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'p-1 rounded-lg transition-colors cursor-pointer',
              isLight
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
            )}
            title={expanded ? 'Minimize' : 'Expand'}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {expanded && (
          <div className="p-3.5 space-y-3.5 text-xs">
            {/* MASTER START / STOP BUTTON */}
            {!isSimRunning ? (
              <button
                type="button"
                onClick={handleStartSimulation}
                disabled={isSimLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START SIMULATION</span>
              </button>
            ) : (
              <div
                className={cn(
                  'flex items-center justify-between p-2 rounded-xl border',
                  isLight
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-emerald-950/40 border-emerald-500/30'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span
                    className={cn(
                      'text-[11px] font-bold',
                      isLight ? 'text-emerald-800' : 'text-emerald-300'
                    )}
                  >
                    Current Flowing · Leads Connected
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleStopSimulation}
                  className={cn(
                    'py-1 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border',
                    isLight
                      ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300'
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30'
                  )}
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop Sim</span>
                </button>
              </div>
            )}

            {/* LIVE DIGITAL MULTI-METER READOUT (Ohm's Law Live Display) */}
            <div
              className={cn(
                'grid grid-cols-2 gap-2 p-2.5 rounded-xl border transition-colors',
                isLight
                  ? 'bg-slate-50 border-slate-200 shadow-inner'
                  : 'bg-[#090B0E] border-white/[0.08] shadow-inner'
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-lg border',
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-[#12151D] border-cyan-500/20'
                )}
              >
                <span
                  className={cn(
                    'text-[9px] block uppercase font-bold tracking-wider',
                    isLight ? 'text-slate-400' : 'text-[#8B949E]'
                  )}
                >
                  VOLTAGE DROP (V)
                </span>
                <span
                  className={cn(
                    'text-base font-extrabold font-mono tracking-tight',
                    isLight ? 'text-sky-700' : 'text-cyan-400'
                  )}
                >
                  {isSimRunning ? outputs.voltageDrop.toFixed(2) : userVoltage.toFixed(2)} V
                </span>
              </div>

              <div
                className={cn(
                  'p-2 rounded-lg border',
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-[#12151D] border-emerald-500/20'
                )}
              >
                <span
                  className={cn(
                    'text-[9px] block uppercase font-bold tracking-wider',
                    isLight ? 'text-slate-400' : 'text-[#8B949E]'
                  )}
                >
                  CURRENT (I)
                </span>
                <span className="text-base font-extrabold text-emerald-400 font-mono tracking-tight">
                  {isSimRunning
                    ? formatCurrent(outputs.branchCurrent)
                    : `${userCurrentMa.toFixed(1)} mA`}
                </span>
              </div>

              <div
                className={cn(
                  'p-2 rounded-lg border',
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-[#12151D] border-purple-500/20'
                )}
              >
                <span
                  className={cn(
                    'text-[9px] block uppercase font-bold tracking-wider',
                    isLight ? 'text-slate-400' : 'text-[#8B949E]'
                  )}
                >
                  RESISTANCE (R)
                </span>
                <span
                  className={cn(
                    'text-sm font-bold font-mono',
                    isLight ? 'text-purple-700' : 'text-purple-300'
                  )}
                >
                  {formatResistance(userResistance)}
                </span>
              </div>

              <div
                className={cn(
                  'p-2 rounded-lg border',
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-[#12151D] border-amber-500/20'
                )}
              >
                <span
                  className={cn(
                    'text-[9px] block uppercase font-bold tracking-wider',
                    isLight ? 'text-slate-400' : 'text-[#8B949E]'
                  )}
                >
                  POWER (P = V×I)
                </span>
                <span
                  className={cn(
                    'text-sm font-bold font-mono',
                    isLight ? 'text-amber-600' : 'text-amber-400'
                  )}
                >
                  {isSimRunning
                    ? formatPower(outputs.powerDissipation)
                    : `${((userVoltage * (userCurrentMa / 1000)) * 1000).toFixed(1)} mW`}
                </span>
              </div>
            </div>

            {/* FREE-HANDS INTERACTIVE SLIDERS */}
            <div
              className={cn(
                'space-y-3 p-3 rounded-xl border transition-colors',
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090B0E] border-white/[0.08]'
              )}
            >
              {/* Mode Selector Pill */}
              <div
                className={cn(
                  'flex items-center justify-between pb-1 border-b',
                  isLight ? 'border-slate-200' : 'border-white/[0.06]'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] uppercase font-bold tracking-wider',
                    isLight ? 'text-slate-500' : 'text-[#8B949E]'
                  )}
                >
                  Free-Hands Simulation Controls
                </span>
                <div
                  className={cn(
                    'flex items-center gap-1 p-0.5 rounded-lg border',
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#161B22] border-white/[0.08]'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setControlMode('voltage')}
                    className={cn(
                      'px-2 py-0.5 rounded text-[9px] font-bold transition-all',
                      controlMode === 'voltage'
                        ? isLight
                          ? 'bg-sky-200 text-sky-900 border border-sky-400'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : isLight
                        ? 'text-slate-500 hover:text-slate-900'
                        : 'text-[#8B949E] hover:text-white'
                    )}
                  >
                    Drive V
                  </button>
                  <button
                    type="button"
                    onClick={() => setControlMode('current')}
                    className={cn(
                      'px-2 py-0.5 rounded text-[9px] font-bold transition-all',
                      controlMode === 'current'
                        ? isLight
                          ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isLight
                        ? 'text-slate-500 hover:text-slate-900'
                        : 'text-[#8B949E] hover:text-white'
                    )}
                  >
                    Drive I
                  </button>
                </div>
              </div>

              {/* 1. VOLTAGE CONTROL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#C9D1D9] flex items-center gap-1.5 font-bold">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Source Voltage (Vs)
                  </span>
                  <span className="text-cyan-400 font-bold text-xs bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                    {userVoltage.toFixed(1)} V
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.1"
                  value={userVoltage}
                  onChange={(e) => handleVoltageChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#21262D] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                {/* Voltage Presets */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {[3.3, 5.0, 9.0, 12.0].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleVoltageChange(v)}
                      className={cn(
                        'flex-1 py-0.5 rounded text-[9px] font-semibold transition-all border',
                        Math.abs(userVoltage - v) < 0.1
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-[#161B22] text-[#8B949E] border-white/[0.06] hover:text-white hover:bg-[#21262D]'
                      )}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CURRENT CONTROL */}
              <div className="space-y-1.5 pt-1.5 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#C9D1D9] flex items-center gap-1.5 font-bold">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Current (I)
                  </span>
                  <span className="text-emerald-400 font-bold text-xs bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    {userCurrentMa >= 1000
                      ? `${(userCurrentMa / 1000).toFixed(2)} A`
                      : `${userCurrentMa.toFixed(1)} mA`}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  step="1"
                  value={userCurrentMa}
                  onChange={(e) => handleCurrentChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#21262D] rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                {/* Current Presets */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {[10, 20, 50, 100].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleCurrentChange(i)}
                      className={cn(
                        'flex-1 py-0.5 rounded text-[9px] font-semibold transition-all border',
                        Math.abs(userCurrentMa - i) < 1
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-[#161B22] text-[#8B949E] border-white/[0.06] hover:text-white hover:bg-[#21262D]'
                      )}
                    >
                      {i}mA
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. RESISTANCE CONTROL */}
              <div className="space-y-1.5 pt-1.5 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#C9D1D9] flex items-center gap-1.5 font-bold">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    Resistance (R)
                  </span>
                  <span className="text-purple-300 font-bold text-xs bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
                    {formatResistance(userResistance)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="100"
                  value={userResistance}
                  onChange={(e) => handleResistanceChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#21262D] rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
                {/* Resistance Presets */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {[
                    { label: '220Ω', val: 220 },
                    { label: '1kΩ', val: 1000 },
                    { label: '4.7k', val: 4700 },
                    { label: '10kΩ', val: 10000 },
                  ].map((r) => (
                    <button
                      key={r.val}
                      type="button"
                      onClick={() => handleResistanceChange(r.val)}
                      className={cn(
                        'flex-1 py-0.5 rounded text-[9px] font-semibold transition-all border',
                        Math.abs(userResistance - r.val) < 50
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                          : 'bg-[#161B22] text-[#8B949E] border-white/[0.06] hover:text-white hover:bg-[#21262D]'
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
