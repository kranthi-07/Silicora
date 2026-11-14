'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { useSimulation } from '@/lib/simulation/use-simulation';
import { ComponentCanvas } from '@/components/viewer/component-canvas';
import { IVCurveChart } from './iv-curve-chart';
import { ScopeWaveform } from './scope-waveform';
import { SimulationControlHud } from './simulation-control-hud';
import { NgspiceAdapter } from '@/lib/simulation/ngspice-adapter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Activity, LineChart, Terminal, Zap, Play, Pause, RotateCcw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SimLabView() {
  const { selectedComponent, themeMode } = useWorkspaceStore();
  const isLight = themeMode === 'light';
  const {
    status,
    inputs,
    outputs,
    waveformHistory,
    ivCurve,
    setSupplyVoltage,
    setPrimaryParameter,
    setWaveform,
    start,
    pause,
    resume,
    reset,
  } = useSimulation();

  const [activeTab, setActiveTab] = useState<'iv_curve' | 'scope' | 'spice'>('iv_curve');
  const [copied, setCopied] = useState(false);

  const isRunning = status === 'running';

  const spiceNetlist = React.useMemo(() => {
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

  const tabs = [
    { id: 'iv_curve', label: 'I-V Curve Tracer', icon: <LineChart className="w-3.5 h-3.5" /> },
    { id: 'scope', label: 'Virtual Oscilloscope (CH1/CH2)', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'spice', label: 'ngspice Netlist Engine', icon: <Terminal className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className={cn(
        'flex-1 w-full h-full flex flex-col xl:flex-row overflow-hidden select-none font-mono transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#090B0E] text-slate-100'
      )}
    >
      {/* LEFT / TOP: 3D Interactive Simulation Viewport */}
      <div
        className={cn(
          'flex-1 h-1/2 xl:h-full relative border-b xl:border-b-0 xl:border-r',
          isLight ? 'border-slate-200' : 'border-[#21262D]'
        )}
      >
        <ComponentCanvas />
      </div>

      {/* RIGHT / BOTTOM: Bench Instruments & Characteristic Plots */}
      <div
        className={cn(
          'w-full xl:w-[480px] h-1/2 xl:h-full flex flex-col shrink-0 overflow-hidden border-l transition-colors',
          isLight
            ? 'bg-white border-slate-200 text-slate-800 shadow-xl'
            : 'bg-[#101318] border-[#21262D] text-[#F0F6FC]'
        )}
      >
        {/* Bench Tabs Header */}
        <div
          className={cn(
            'h-10 px-3 border-b flex items-center justify-between shrink-0 transition-colors',
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22] border-[#21262D]'
          )}
        >
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            variant="underline"
            size="sm"
          />

          <div className="flex items-center gap-1.5">
            <Button
              variant={isRunning ? 'secondary' : 'primary'}
              size="xs"
              leftIcon={isRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              onClick={() => (isRunning ? pause() : resume())}
            >
              {isRunning ? 'Pause' : 'Run'}
            </Button>
            <Button variant="ghost" size="xs" onClick={reset} title="Reset Simulation">
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
          {activeTab === 'iv_curve' && (
            <div className="flex-1 flex flex-col gap-3">
              <IVCurveChart
                points={ivCurve}
                currentVoltage={outputs.voltageDrop}
                currentCurrent={outputs.branchCurrent}
                title={`${selectedComponent?.name || 'Device'} I-V Curve Tracer`}
              />

              {/* Operating Point Telemetry Box */}
              <div
                className={cn(
                  'grid grid-cols-2 gap-2 text-xs p-3 rounded-xl border transition-colors',
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#090B0E] border-[#21262D]'
                )}
              >
                <div>
                  <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#6E7681]')}>BIAS VOLTAGE</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{outputs.voltageDrop.toFixed(3)} V</span>
                </div>
                <div>
                  <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#6E7681]')}>BRANCH CURRENT</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {(outputs.branchCurrent * 1e3).toFixed(3)} mA
                  </span>
                </div>
                <div>
                  <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#6E7681]')}>DISSIPATION</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {(outputs.powerDissipation * 1e3).toFixed(1)} mW
                  </span>
                </div>
                <div>
                  <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#6E7681]')}>JUNCTION TEMP</span>
                  <span className={cn('font-bold', isLight ? 'text-slate-800' : 'text-[#F0F6FC]')}>
                    {outputs.thermal.junctionTempC.toFixed(1)} °C
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scope' && (
            <div className="flex-1 flex flex-col gap-3">
              <div className="h-56">
                <ScopeWaveform samples={waveformHistory} isRunning={isRunning} />
              </div>

              <div
                className={cn(
                  'p-3 rounded-xl border space-y-2 text-xs transition-colors',
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#090B0E] border-[#21262D]'
                )}
              >
                <span className={cn('text-xs font-bold block', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>Oscilloscope Math Channels</span>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>V_RMS (CH1):</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{(Math.abs(outputs.voltageDrop) * 0.707).toFixed(2)} V</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>I_RMS (CH2):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{(Math.abs(outputs.branchCurrent) * 0.707 * 1e3).toFixed(2)} mA</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>Apparent Power S:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{(outputs.powerDissipation * 1e3).toFixed(1)} mVA</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'spice' && (
            <div
              className={cn(
                'flex-1 flex flex-col gap-2 p-3 rounded-xl border transition-colors',
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090B0E] border-[#21262D]'
              )}
            >
              <div className={cn('flex items-center justify-between pb-2 border-b', isLight ? 'border-slate-200' : 'border-[#21262D]')}>
                <span className={cn('text-xs font-bold', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>ngspice Netlist Generation</span>
                <Button
                  variant="secondary"
                  size="xs"
                  leftIcon={copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  onClick={handleCopyNetlist}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <pre
                className={cn(
                  'flex-1 overflow-y-auto custom-scrollbar text-[11px] whitespace-pre p-2 rounded border select-text font-mono',
                  isLight ? 'bg-white border-slate-200 text-emerald-700' : 'bg-[#05080c] border-[#161B22] text-emerald-400'
                )}
              >
                {spiceNetlist}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
