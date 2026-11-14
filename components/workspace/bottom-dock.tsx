'use client';

import React, { useState, useMemo } from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { useSimulation } from '@/lib/simulation/use-simulation';
import { NgspiceAdapter } from '@/lib/simulation/ngspice-adapter';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Terminal, Zap, Play, Pause, RotateCcw, LineChart, Copy, Check } from 'lucide-react';
import { ScopeWaveform } from '@/components/simulation/scope-waveform';
import { IVCurveChart } from '@/components/simulation/iv-curve-chart';
import { cn } from '@/lib/utils';

export function WorkspaceBottomDock() {
  const { bottomDockOpen, toggleBottomDock, selectedComponent, telemetry, themeMode } =
    useWorkspaceStore();
  const isLight = themeMode === 'light';

  const {
    status,
    inputs,
    outputs,
    waveformHistory,
    ivCurve,
    start,
    pause,
    resume,
    reset,
  } = useSimulation();

  const [activeDockTab, setActiveDockTab] = useState<'scope' | 'iv_curve' | 'spice_log' | 'diagnostics'>('scope');
  const [copied, setCopied] = useState(false);

  const isRunning = status === 'running';

  // Generate live SPICE deck using the NgspiceAdapter
  const spiceNetlist = useMemo(() => {
    if (!selectedComponent) return '* No active component selected';
    return NgspiceAdapter.generateCircuitDeck(
      selectedComponent.id,
      inputs.supplyVoltage,
      inputs.primaryParameter
    );
  }, [selectedComponent, inputs.supplyVoltage, inputs.primaryParameter]);

  const handleCopyNetlist = () => {
    navigator.clipboard.writeText(spiceNetlist);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!bottomDockOpen) return null;

  const tabs = [
    { id: 'scope', label: 'Virtual Oscilloscope (CH1/CH2)', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'iv_curve', label: 'I-V Curve Tracer', icon: <LineChart className="w-3.5 h-3.5" /> },
    { id: 'spice_log', label: 'ngspice Netlist Deck', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'diagnostics', label: 'Telemetry & Physics', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className={cn(
        'h-72 border-t flex flex-col shrink-0 select-none z-20 transition-colors',
        isLight
          ? 'bg-white border-slate-200 text-slate-800 shadow-lg'
          : 'bg-[#101318] border-[#30363D]'
      )}
    >
      {/* Dock Header with Tabs and Actions */}
      <div
        className={cn(
          'h-10 px-3 border-b flex items-center justify-between shrink-0 transition-colors',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22] border-[#21262D]'
        )}
      >
        <Tabs
          tabs={tabs}
          activeTab={activeDockTab}
          onChange={(id) => setActiveDockTab(id as any)}
          variant="underline"
          size="sm"
        />

        <div className="flex items-center gap-2 font-mono">
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            size="xs"
            leftIcon={isRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            onClick={() => (isRunning ? pause() : resume())}
          >
            {isRunning ? 'Pause Engine' : 'Resume Engine'}
          </Button>

          <Button
            variant="ghost"
            size="xs"
            leftIcon={<RotateCcw className="w-3 h-3" />}
            onClick={reset}
            title="Reset Simulation State"
          >
            Reset
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={toggleBottomDock}
            className={isLight ? 'text-slate-500 hover:text-slate-900' : 'text-[#8B949E] hover:text-[#F0F6FC]'}
          >
            Hide Dock
          </Button>
        </div>
      </div>

      {/* Dock Content */}
      <div className="flex-1 overflow-hidden p-3 font-mono text-xs">
        {/* Tab 1: Virtual Oscilloscope */}
        {activeDockTab === 'scope' && (
          <div className="h-full flex flex-col md:flex-row gap-3">
            <div className="flex-1 h-full min-h-[160px]">
              <ScopeWaveform samples={waveformHistory} isRunning={isRunning} />
            </div>

            {/* Oscilloscope Control & Measurement Strip */}
            <div
              className={cn(
                'w-full md:w-64 rounded-lg border p-3 flex flex-col justify-between shrink-0 transition-colors',
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#090B0E] border-[#21262D]'
              )}
            >
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>SAMPLING RATE:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">60 Hz Realtime</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>CH1 (VOLTAGE):</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{outputs.voltageDrop.toFixed(2)} V</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>CH2 (CURRENT):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {(outputs.branchCurrent * 1e3).toFixed(2)} mA
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>WAVEFORM:</span>
                  <span className={cn('font-bold uppercase', isLight ? 'text-slate-800' : 'text-[#F0F6FC]')}>{inputs.waveform || 'DC'}</span>
                </div>
              </div>

              <div className={cn('flex gap-1.5 pt-2 border-t', isLight ? 'border-slate-200' : 'border-[#21262D]')}>
                <Badge variant={isRunning ? 'nominal' : 'warning'} size="xs">
                  {isRunning ? 'TRIGGER: LOCKED' : 'FREEZE'}
                </Badge>
                <Badge variant="mono" size="xs">
                  SAMPLES: {waveformHistory.length}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: I-V Curve Tracer */}
        {activeDockTab === 'iv_curve' && (
          <div className="h-full flex flex-col md:flex-row gap-3">
            <div className="flex-1 h-full min-h-[160px]">
              <IVCurveChart
                points={ivCurve}
                currentVoltage={outputs.voltageDrop}
                currentCurrent={outputs.branchCurrent}
                title={`${selectedComponent?.name || 'Component'} — Theoretical Characteristic Curve`}
              />
            </div>

            <div
              className={cn(
                'w-full md:w-72 rounded-lg border p-3 flex flex-col justify-between shrink-0 text-[11px] transition-colors',
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#090B0E] border-[#21262D]'
              )}
            >
              <div className="space-y-2">
                <span className={cn('text-xs font-bold block', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>Operating Point Metrics</span>
                <div className={cn('flex justify-between border-b pb-1', isLight ? 'border-slate-200' : 'border-[#21262D]')}>
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>Voltage (V_op):</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{outputs.voltageDrop.toFixed(3)} V</span>
                </div>
                <div className={cn('flex justify-between border-b pb-1', isLight ? 'border-slate-200' : 'border-[#21262D]')}>
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>Current (I_op):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{(outputs.branchCurrent * 1e3).toFixed(3)} mA</span>
                </div>
                <div className={cn('flex justify-between border-b pb-1', isLight ? 'border-slate-200' : 'border-[#21262D]')}>
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>Dissipated Power:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{(outputs.powerDissipation * 1e3).toFixed(2)} mW</span>
                </div>
                <div className={cn('flex justify-between border-b pb-1', isLight ? 'border-slate-200' : 'border-[#21262D]')}>
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>Differential Res (r_d):</span>
                  <span className={cn('font-bold', isLight ? 'text-slate-800' : 'text-[#F0F6FC]')}>
                    {Math.abs(outputs.branchCurrent) > 1e-9
                      ? `${(outputs.voltageDrop / outputs.branchCurrent).toFixed(0)} Ω`
                      : '∞'}
                  </span>
                </div>
              </div>

              <div className={cn('pt-2 border-t', isLight ? 'border-slate-200' : 'border-[#21262D]')}>
                <Badge variant={outputs.limits.burnoutTriggered ? 'critical' : 'nominal'} size="xs">
                  {outputs.limits.burnoutTriggered ? 'BURNT STATE' : 'LINEAR REGION'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: ngspice Netlist Deck */}
        {activeDockTab === 'spice_log' && (
          <div
            className={cn(
              'h-full rounded-lg border p-3 overflow-hidden flex flex-col font-mono text-[11px] transition-colors',
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090B0E] border-[#21262D]'
            )}
          >
            <div className={cn('flex items-center justify-between pb-2 border-b mb-2', isLight ? 'border-slate-200' : 'border-[#21262D]')}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className={cn('font-bold', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>Auto-Generated SPICE Deck (ngspice-42 syntax)</span>
              </div>
              <Button
                variant="secondary"
                size="xs"
                leftIcon={copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                onClick={handleCopyNetlist}
              >
                {copied ? 'Copied' : 'Copy Netlist'}
              </Button>
            </div>
            <pre
              className={cn(
                'flex-1 overflow-y-auto custom-scrollbar whitespace-pre leading-relaxed select-text p-2 rounded border font-mono',
                isLight ? 'bg-white border-slate-200 text-emerald-700' : 'bg-[#05080c] border-[#161B22] text-emerald-400'
              )}
            >
              {spiceNetlist}
            </pre>
          </div>
        )}

        {/* Tab 4: Telemetry & Physics */}
        {activeDockTab === 'diagnostics' && (
          <div className="h-full grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className={cn('p-3 rounded-lg border transition-colors', isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090B0E] border-[#21262D]')}>
              <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>CONVENTIONAL VELOCITY</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {outputs.conventionalCurrentVelocity.toFixed(2)} mm/s
              </span>
              <span className={cn('text-[9px] block mt-1', isLight ? 'text-slate-400' : 'text-[#6E7681]')}>Positive → Negative</span>
            </div>
            <div className={cn('p-3 rounded-lg border transition-colors', isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090B0E] border-[#21262D]')}>
              <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>ELECTRON DRIFT VELOCITY</span>
              <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                {outputs.electronDriftVelocity.toFixed(2)} mm/s
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 block mt-1">Opposite direction (Invariant)</span>
            </div>
            <div className={cn('p-3 rounded-lg border transition-colors', isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090B0E] border-[#21262D]')}>
              <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>JUNCTION TEMPERATURE</span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                {outputs.thermal.junctionTempC.toFixed(1)} °C
              </span>
              <span className={cn('text-[9px] block mt-1', isLight ? 'text-slate-400' : 'text-[#6E7681]')}>First-Order Thermal Tau = 4.5s</span>
            </div>
            <div className={cn('p-3 rounded-lg border transition-colors', isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090B0E] border-[#21262D]')}>
              <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>STRESS ENVELOPE</span>
              <span className={cn('text-base font-bold', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>
                {Math.round(outputs.limits.stressFactor * 100)}% Max
              </span>
              <span className={cn('text-[9px] block mt-1', isLight ? 'text-slate-400' : 'text-[#6E7681]')}>Rated P_max = 0.25 W</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
