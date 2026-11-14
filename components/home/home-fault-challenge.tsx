'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Activity,
  Award,
} from 'lucide-react';

interface ResistorChoice {
  value: number; // ohms
  label: string;
  e12BandColors: string[];
  currentMa: number;
  status: 'burnout' | 'overstress' | 'marginal' | 'optimal' | 'dim' | 'off';
  message: string;
  resistorTempC: number;
}

const RESISTOR_CHOICES: ResistorChoice[] = [
  {
    value: 0,
    label: '0 Ω (Jumper Wire)',
    e12BandColors: ['#000000'],
    currentMa: 1400,
    status: 'burnout',
    message: 'EOS CATASTROPHE! 1.4A surges through the 25mA junction. Bond-wire vaporizes in 4 milliseconds.',
    resistorTempC: 380,
  },
  {
    value: 47,
    label: '47 Ω',
    e12BandColors: ['#F97316', '#7C3AED', '#000000', '#D97706'], // Yellow, Violet, Black, Gold
    currentMa: 148.9,
    status: 'overstress',
    message: 'THERMAL RUNAWAY! 149mA causes severe die overheating (140°C). Epoxy lens will scorch.',
    resistorTempC: 185,
  },
  {
    value: 150,
    label: '150 Ω',
    e12BandColors: ['#92400E', '#10B981', '#92400E', '#D97706'], // Brown, Green, Brown, Gold
    currentMa: 46.6,
    status: 'marginal',
    message: 'EXCEEDS ABSOLUTE MAXIMUM! 46mA exceeds 25mA limit. Operating lifetime cut from 100,000h to 48 hours.',
    resistorTempC: 62,
  },
  {
    value: 330,
    label: '330 Ω (Calculated)',
    e12BandColors: ['#F97316', '#F97316', '#92400E', '#D97706'], // Orange, Orange, Brown, Gold
    currentMa: 21.2,
    status: 'optimal',
    message: 'ENGINEERING PERFECTION! 21.2mA drives peak 630nm luminescence within Safe Operating Area (SOA).',
    resistorTempC: 31,
  },
  {
    value: 1000,
    label: '1.0 kΩ',
    e12BandColors: ['#92400E', '#000000', '#EF4444', '#D97706'], // Brown, Black, Red, Gold
    currentMa: 7.0,
    status: 'dim',
    message: 'LOW-POWER INDICATION. 7.0mA yields gentle, comfortable visibility with ultra-long battery life.',
    resistorTempC: 26,
  },
  {
    value: 10000,
    label: '10 kΩ',
    e12BandColors: ['#92400E', '#000000', '#F97316', '#D97706'], // Brown, Black, Orange, Gold
    currentMa: 0.7,
    status: 'off',
    message: 'SUB-THRESHOLD. 0.7mA is near recombination leakage threshold. Die emission is barely discernible.',
    resistorTempC: 25,
  },
];

export function HomeFaultChallenge() {
  const [selectedResistorIndex, setSelectedResistorIndex] = useState<number>(3); // Default 330 ohm
  const [probeMode, setProbeMode] = useState<'voltage' | 'current' | 'power'>('current');

  const activeChoice = RESISTOR_CHOICES[selectedResistorIndex];
  const supplyVoltage = 9.0;
  const ledForwardVoltage = activeChoice.status === 'burnout' ? 0.2 : 2.0;
  const resistorVoltage = supplyVoltage - ledForwardVoltage;
  const circuitPowerMw = Math.round(resistorVoltage * activeChoice.currentMa);

  return (
    <section id="challenge" className="w-full py-20 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            Interactive Lab Challenge • Live Telemetry
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Fix the Circuit Fault: The 9V LED Overstress
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            A 9V rail is connected to a 2V gallium-arsenide LED. Without the correct ballast resistor,
            the semiconductor junction will blow. Dial the decade selector to save the component.
          </p>
        </div>

        {/* Main Challenge Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Schematic & Animated Component */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Breadboard Test Socket
                </span>
              </div>

              {/* Multimeter Mode Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setProbeMode('current')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    probeMode === 'current' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Loop Current (mA)
                </button>
                <button
                  onClick={() => setProbeMode('voltage')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    probeMode === 'voltage' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Resistor Drop (V)
                </button>
                <button
                  onClick={() => setProbeMode('power')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    probeMode === 'power' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dissipation (mW)
                </button>
              </div>
            </div>

            {/* Virtual Breadboard Circuit SVG */}
            <div className="w-full h-64 bg-slate-950 rounded-xl border border-slate-800/80 relative flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 500 220" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                {/* 9V Battery Symbol */}
                <g transform="translate(60, 60)">
                  <rect x="0" y="20" width="36" height="60" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                  <rect x="6" y="10" width="10" height="10" rx="1" fill="#DC2626" />
                  <rect x="20" y="14" width="10" height="6" rx="1" fill="#475569" />
                  <text x="18" y="55" fill="#F8FAFC" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    9V
                  </text>
                </g>

                {/* Circuit Wiring */}
                <g stroke="#94A3B8" strokeWidth="3" fill="none">
                  {/* Battery + to Resistor */}
                  <path d="M 78 70 L 78 40 L 190 40" />
                  {/* Resistor to LED */}
                  <path d="M 270 40 L 370 40 L 370 80" />
                  {/* LED cathode to Ground / Battery - */}
                  <path d="M 370 140 L 370 180 L 78 180 L 78 140" />
                </g>

                {/* Resistor Slot */}
                <g transform="translate(190, 25)">
                  <rect x="0" y="0" width="80" height="30" rx="6" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
                  {/* Color Bands */}
                  {activeChoice.e12BandColors.map((color, idx) => (
                    <rect
                      key={idx}
                      x={14 + idx * 16}
                      y="0"
                      width="6"
                      height="30"
                      fill={color}
                    />
                  ))}
                  <text x="40" y="-8" fill="#F8FAFC" fontSize="11" fontFamily="monospace" textAnchor="middle">
                    {activeChoice.label}
                  </text>
                </g>

                {/* LED Representation with Dynamic Glow */}
                <g transform="translate(350, 75)">
                  {/* Dynamic Glow Halo */}
                  {activeChoice.status === 'optimal' && (
                    <circle cx="20" cy="25" r="32" fill="#EF4444" opacity="0.35" className="animate-pulse" />
                  )}
                  {activeChoice.status === 'marginal' && (
                    <circle cx="20" cy="25" r="42" fill="#EF4444" opacity="0.6" className="animate-pulse" />
                  )}
                  {activeChoice.status === 'overstress' && (
                    <circle cx="20" cy="25" r="50" fill="#F97316" opacity="0.85" className="animate-ping" />
                  )}
                  {activeChoice.status === 'burnout' && (
                    <g>
                      <circle cx="20" cy="25" r="35" fill="#334155" opacity="0.8" />
                      <text x="20" y="30" fill="#F87171" fontSize="18" fontWeight="bold" textAnchor="middle">
                        💥
                      </text>
                    </g>
                  )}

                  {/* LED Body */}
                  <path
                    d="M 8 10 C 8 2, 32 2, 32 10 L 32 35 C 32 38, 8 38, 8 35 Z"
                    fill={
                      activeChoice.status === 'burnout'
                        ? '#334155'
                        : activeChoice.status === 'off'
                        ? '#7F1D1D'
                        : '#DC2626'
                    }
                    stroke="#F87171"
                    strokeWidth="1.5"
                  />
                  {/* Flange */}
                  <rect x="5" y="35" width="30" height="4" rx="1" fill="#991B1B" />
                  <text x="20" y="55" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    RED LED (2V)
                  </text>
                </g>

                {/* Live Current Flow Animated Dots */}
                {activeChoice.status !== 'burnout' && (
                  <circle cx="140" cy="40" r="3" fill="#38BDF8" className="animate-ping" />
                )}
              </svg>

              {/* Multimeter Overlay Display */}
              <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Fluke Precision Telemetry
                </div>
                <div className="text-xl font-mono font-extrabold text-white mt-1">
                  {probeMode === 'current' && (
                    <span>
                      {activeChoice.currentMa} <span className="text-xs text-indigo-400">mA</span>
                    </span>
                  )}
                  {probeMode === 'voltage' && (
                    <span>
                      {resistorVoltage.toFixed(2)} <span className="text-xs text-indigo-400">V</span>
                    </span>
                  )}
                  {probeMode === 'power' && (
                    <span>
                      {circuitPowerMw} <span className="text-xs text-indigo-400">mW</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Live Result Banner */}
            <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              activeChoice.status === 'optimal'
                ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                : activeChoice.status === 'burnout'
                ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                : 'bg-amber-950/60 border-amber-600 text-amber-200'
            }`}>
              {activeChoice.status === 'optimal' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : activeChoice.status === 'burnout' ? (
                <Flame className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold">
                  {activeChoice.status === 'optimal'
                    ? 'DESIGN VERIFIED: E12 STANDARD COMPLIANT'
                    : activeChoice.status === 'burnout'
                    ? 'ELECTRICAL OVERSTRESS FAILURE (EOS)'
                    : 'OUTSIDE SAFE OPERATING AREA (SOA)'}
                </h4>
                <p className="text-xs mt-1 leading-relaxed opacity-90">
                  {activeChoice.message}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Decade Dial & Mathematical Solver */}
          <div className="lg:col-span-5 space-y-4">
            {/* Decade Dial Selector */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold mb-3">
                Decade Resistor Selector
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Click a resistance value to insert it into the active breadboard circuit:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {RESISTOR_CHOICES.map((choice, idx) => (
                  <button
                    key={choice.value}
                    onClick={() => setSelectedResistorIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedResistorIndex === idx
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 font-bold scale-[1.02]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-mono">{choice.label}</div>
                    <div className="text-[10px] opacity-75 mt-0.5 font-mono">
                      {choice.currentMa} mA
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mathematical Derivation Box */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-3">
              <div className="text-slate-400 uppercase tracking-wider font-semibold text-[11px] flex items-center justify-between">
                <span>Kirchhoff & Ohm&apos;s Law Proof</span>
                <span className="text-indigo-400">R = (Vs - Vf) / I</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-slate-300">
                <div>Vs (Battery Rail) = 9.0 V</div>
                <div>Vf (LED Drop) = 2.0 V</div>
                <div>Target Current (If) = 20 mA = 0.020 A</div>
                <div className="pt-2 border-t border-slate-800 text-emerald-400 font-bold">
                  R = (9.0 - 2.0) / 0.020 = 350 Ω → Standard E12: 330 Ω
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                In standard E12 series (10% tolerance), 330 Ω yields 21.2 mA, perfectly balancing lumen output against PN-junction longevity.
              </p>
            </div>

            {/* Launch Academy Flow CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-800/60 shadow-xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Master 24+ Interactive Electronics Labs
              </h4>
              <p className="text-xs text-slate-300 mb-3">
                Explore bipolar transistors, MOSFET switching, op-amp filters, and Fourier analysis in the guided Academy.
              </p>
              <Link
                href="/workspace/learning_academy"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide transition-all group"
              >
                <span>Launch Guided Academy Labs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
