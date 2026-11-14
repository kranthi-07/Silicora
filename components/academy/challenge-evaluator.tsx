'use client';

import React, { useState } from 'react';
import { PracticalChallengeConfig } from '@/types/academy';
import { useAcademyStore } from '@/lib/academy/academy-store';
import { useWorkspaceStore } from '@/lib/store';
import { Target, CheckCircle2, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChallengeEvaluatorProps {
  challenge: PracticalChallengeConfig;
  onPass: () => void;
}

export function ChallengeEvaluator({ challenge, onPass }: ChallengeEvaluatorProps) {
  const { challengeResults, recordChallengePass } = useAcademyStore();
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';
  const hasPassed = !!challengeResults[challenge.id];

  const [resistance, setResistance] = useState<number>(challenge.initialResistance ?? 1000);
  const [voltage, setVoltage] = useState<number>(challenge.initialVoltage);
  const [capacitance] = useState<number>(challenge.initialCapacitance ?? 0.00047);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Dynamic calculations based on target parameter
  let currentValue = 0;
  let unit = '';

  if (challenge.targetParameter === 'time_constant_ms') {
    // tau = R * C (in seconds), convert to ms
    currentValue = (resistance * capacitance) * 1000;
    unit = 'ms';
  } else if (challenge.targetParameter === 'current_mA') {
    // I = (V - 2.0V LED drop) / R in mA
    const vDrop = Math.max(0, voltage - 2.0);
    currentValue = (vDrop / Math.max(1, resistance)) * 1000;
    unit = 'mA';
  } else if (challenge.targetParameter === 'power_mW') {
    currentValue = ((voltage * voltage) / Math.max(1, resistance)) * 1000;
    unit = 'mW';
  }

  const target = challenge.targetValue;
  const tolPercent = challenge.tolerancePercent;
  const minAllowed = target * (1 - tolPercent / 100);
  const maxAllowed = target * (1 + tolPercent / 100);
  const isWithinTolerance = currentValue >= minAllowed && currentValue <= maxAllowed;

  const handleEvaluate = () => {
    if (isWithinTolerance) {
      recordChallengePass(challenge.id);
      onPass();
    }
  };

  return (
    <div
      className={cn(
        'p-6 rounded-2xl border space-y-6 transition-colors',
        isLight
          ? 'bg-white border-slate-200 shadow-md text-slate-800'
          : 'bg-[#161B22] border-[#30363D]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'flex items-center gap-2 text-xs font-mono',
            isLight ? 'text-sky-600' : 'text-cyan-400'
          )}
        >
          <Target className="w-4 h-4" />
          <span className="uppercase tracking-wider font-semibold">Practical Engineering Challenge</span>
        </div>
        {hasPassed && (
          <span
            className={cn(
              'flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full font-bold border',
              isLight
                ? 'text-emerald-700 bg-emerald-100 border-emerald-300'
                : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            CHALLENGE RESOLVED
          </span>
        )}
      </div>

      <p
        className={cn(
          'text-sm font-semibold leading-relaxed',
          isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
        )}
      >
        {challenge.prompt}
      </p>

      {/* Target vs Live Telemetry */}
      <div className="grid grid-cols-2 gap-4 font-mono text-center">
        <div
          className={cn(
            'p-3.5 rounded-xl border',
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101318] border-[#21262D]'
          )}
        >
          <span className={cn('text-[10px] uppercase block', isLight ? 'text-slate-500' : 'text-[#6E7681]')}>
            Target Goal
          </span>
          <span
            className={cn(
              'text-base font-bold mt-1 block',
              isLight ? 'text-sky-600' : 'text-[#58A6FF]'
            )}
          >
            {target.toFixed(1)} {unit} (±{tolPercent}%)
          </span>
        </div>

        <div
          className={cn(
            'p-3.5 rounded-xl border',
            isWithinTolerance
              ? isLight
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : 'bg-[#101318] border-[#21262D] text-[#F0F6FC]'
          )}
        >
          <span className={cn('text-[10px] uppercase block', isLight ? 'text-slate-500' : 'text-[#6E7681]')}>
            Current Output
          </span>
          <span className="text-base font-bold mt-1 block">
            {currentValue.toFixed(1)} {unit}
          </span>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div
        className={cn(
          'space-y-4 p-4 rounded-xl border',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101318] border-[#21262D]'
        )}
      >
        {/* Resistance Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className={isLight ? 'text-slate-600' : 'text-[#8B949E]'}>Resistance (R):</span>
            <span className={cn('font-bold', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>{resistance} Ω</span>
          </div>
          <input
            type="range"
            min="10"
            max="10000"
            step="10"
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-300 dark:bg-[#21262D] rounded-lg appearance-none cursor-pointer accent-[#58A6FF]"
          />
        </div>

        {/* Voltage Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className={isLight ? 'text-slate-600' : 'text-[#8B949E]'}>Supply Voltage (V):</span>
            <span className={cn('font-bold', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>{voltage.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            min="1"
            max="24"
            step="0.5"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-300 dark:bg-[#21262D] rounded-lg appearance-none cursor-pointer accent-[#58A6FF]"
          />
        </div>
      </div>

      {/* Evaluation Button */}
      <div className="flex items-center gap-3">
        <Button
          variant={isWithinTolerance ? 'primary' : 'outline'}
          size="md"
          className="flex-1 font-mono text-xs"
          onClick={handleEvaluate}
        >
          {isWithinTolerance ? 'Validate & Complete Challenge' : 'Test Circuit Parameters'}
        </Button>

        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="p-2.5 rounded-lg border border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
          title="Toggle Engineering Hint"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Engineering Hint */}
      {showHint && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{challenge.hint}</span>
        </div>
      )}

      {/* Success Message */}
      {hasPassed && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200">
          <strong className="block font-bold text-emerald-100 mb-1">Challenge Passed!</strong>
          {challenge.successMessage}
        </div>
      )}
    </div>
  );
}
