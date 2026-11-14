'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Activity,
  Zap,
  Flame,
  ArrowRight,
  Sliders,
  Play,
  RotateCcw,
  Gauge,
  Thermometer,
  Radio,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export function HomeWorkbenchSandbox() {
  const [activeInstrument, setActiveInstrument] = useState<'thermal' | 'scope' | 'drift' | 'stress'>('thermal');

  // 1. Thermal Camera State
  const [supplyVoltage, setSupplyVoltage] = useState<number>(5.0); // 0 to 12V
  const [resistanceVal, setResistanceVal] = useState<number>(100); // 50 to 500 ohms
  const ratedPowerW = 0.25; // 1/4W resistor rating
  const powerW = (supplyVoltage * supplyVoltage) / resistanceVal;
  const tempRiseC = powerW * 300; // RthetaJA = 300 C/W
  const junctionTempC = Math.round(25 + tempRiseC);
  const isOverheated = powerW > ratedPowerW;

  // 2. Oscilloscope State
  const [waveformType, setWaveformType] = useState<'sine' | 'square' | 'triangle'>('sine');
  const [frequencyHz, setFrequencyHz] = useState<number>(1000);
  const [amplitudeV, setAmplitudeV] = useState<number>(5.0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3. Carrier Drift State
  const [circuitCurrentA, setCircuitCurrentA] = useState<number>(2.5); // -5 to +5 A

  // Animate oscilloscope phosphor sweep
  useEffect(() => {
    if (activeInstrument !== 'scope') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const renderScope = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark phosphor screen with faint grid
      ctx.fillStyle = '#05130b';
      ctx.fillRect(0, 0, width, height);

      // Oscilloscope Reticle Grid
      ctx.strokeStyle = '#0f381e';
      ctx.lineWidth = 1;
      const divX = width / 10;
      const divY = height / 8;

      for (let x = 0; x <= width; x += divX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += divY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center crosshairs
      ctx.strokeStyle = '#165b2f';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Draw Glowing Phosphor Trace
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const centerY = height / 2;
      const scaleY = (height / 2) * (amplitudeV / 10) * 0.8;
      const cycles = (frequencyHz / 1000) * 3;

      for (let x = 0; x < width; x++) {
        const t = (x / width) * cycles * 2 * Math.PI + phase;
        let yVal = 0;

        if (waveformType === 'sine') {
          yVal = Math.sin(t);
        } else if (waveformType === 'square') {
          yVal = Math.sin(t) >= 0 ? 0.95 : -0.95;
        } else if (waveformType === 'triangle') {
          yVal = (2 / Math.PI) * Math.asin(Math.sin(t));
        }

        const y = centerY - yVal * scaleY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      phase += 0.08;
      animationFrameId = requestAnimationFrame(renderScope);
    };

    renderScope();
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeInstrument, waveformType, frequencyHz, amplitudeV]);

  return (
    <section id="workbench" className="py-16 sm:py-24 bg-slate-950 border-t border-slate-800 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono text-emerald-400 mb-3">
            <Gauge className="w-3.5 h-3.5" />
            <span>Virtual Benchtop Instrument Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans">
            Hands-On Instruments. Live Semiconductor Physics.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans">
            Test equations before soldering. Drag voltage rails, inspect thermal infrared heat dissipation, and capture real-time oscilloscope waveforms directly in your browser.
          </p>
        </div>

        {/* Instrument Tab Switcher */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 font-mono text-xs">
          {[
            { id: 'thermal', name: 'FLIR Thermal Heatmap', icon: Thermometer, color: 'text-rose-400' },
            { id: 'scope', name: 'Phosphor Oscilloscope', icon: Radio, color: 'text-emerald-400' },
            { id: 'drift', name: 'Carrier Drift Velocimeter', icon: Zap, color: 'text-cyan-400' },
            { id: 'stress', name: 'Overstress Burnout Test', icon: Flame, color: 'text-amber-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeInstrument === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveInstrument(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/60 text-white font-bold shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Workbench Instrument Enclosure */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7 shadow-2xl backdrop-blur">
          {/* INSTRUMENT 1: FLIR Thermal Heatmap */}
          {activeInstrument === 'thermal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Visual Thermal Viewport */}
              <div className="lg:col-span-7 flex flex-col h-[340px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative justify-center items-center p-6 text-center">
                {/* Thermal Color Gradient Visualization */}
                <div
                  className="w-48 h-20 rounded-2xl border transition-all duration-300 relative flex items-center justify-center shadow-xl"
                  style={{
                    backgroundColor: isOverheated
                      ? '#ef4444'
                      : junctionTempC > 80
                      ? '#ea580c'
                      : junctionTempC > 45
                      ? '#d97706'
                      : '#1e3a8a',
                    borderColor: isOverheated ? '#f87171' : '#38bdf8',
                    boxShadow: isOverheated
                      ? '0 0 40px #ef4444'
                      : junctionTempC > 80
                      ? '0 0 30px #ea580c'
                      : '0 0 15px #1e3a8a',
                  }}
                >
                  <div className="text-white font-mono text-center">
                    <span className="text-2xl font-black">{junctionTempC}°C</span>
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-90">
                      {isOverheated ? 'CRITICAL THERMAL RUNAWAY' : 'JUNCTION TEMPERATURE'}
                    </span>
                  </div>
                </div>

                {/* Resistor Lead Wire Graphics */}
                <div className="flex items-center justify-between w-72 mt-2 font-mono text-[11px] text-slate-400">
                  <span>Lead 1 (-)</span>
                  <span>100Ω Thin-Film Core</span>
                  <span>Lead 2 (+)</span>
                </div>

                {/* Thermal Legend Gradient Bar */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-blue-700" /> 25°C Ambient
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-600" /> 60°C Warm
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-rose-600" /> 100°C Limit
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 animate-pulse" /> &gt;150°C Burnout
                  </span>
                </div>
              </div>

              {/* Thermal Controls */}
              <div className="lg:col-span-5 space-y-5 font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-rose-400 uppercase">
                      Infrared Thermal Dissipation
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${isOverheated ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {isOverheated ? 'SOA VIOLATED' : 'SAFE OPERATING AREA'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Electrical power converts directly into thermal heat according to Joule dissipation: P = V² / R.
                  </p>
                </div>

                {/* Voltage Slider */}
                <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Applied Voltage:</span>
                    <span className="text-white font-bold">{supplyVoltage.toFixed(1)} V</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.2"
                    value={supplyVoltage}
                    onChange={(e) => setSupplyVoltage(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0V (Off)</span>
                    <span>5V (Logic)</span>
                    <span>10V (Stress)</span>
                  </div>
                </div>

                {/* Physics Formula Readout */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Dissipated Power</span>
                    <span className={`text-base font-bold ${isOverheated ? 'text-rose-400' : 'text-slate-200'}`}>
                      {(powerW * 1000).toFixed(0)} mW
                    </span>
                    <span className="text-[10px] text-slate-500 block">Rated Max: 250mW</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Branch Current</span>
                    <span className="text-base font-bold text-cyan-300">
                      {((supplyVoltage / resistanceVal) * 1000).toFixed(1)} mA
                    </span>
                    <span className="text-[10px] text-slate-500 block">I = V / R</span>
                  </div>
                </div>

                <Link
                  href="/workspace/electrical_sim_lab"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
                >
                  <span>Open Full SPICE Sim Lab</span>
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                </Link>
              </div>
            </div>
          )}

          {/* INSTRUMENT 2: Phosphor Oscilloscope */}
          {activeInstrument === 'scope' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Scope Screen */}
              <div className="lg:col-span-7 flex flex-col h-[340px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative justify-center items-center">
                <canvas
                  ref={canvasRef}
                  width={540}
                  height={320}
                  className="w-full h-full"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>CH1: ACTIVE • AUTO TRIGGER</span>
                </div>
              </div>

              {/* Scope Controls */}
              <div className="lg:col-span-5 space-y-4 font-mono text-xs">
                <div>
                  <span className="text-sm font-bold text-emerald-400 uppercase block">
                    Dual-Channel Waveform DSO
                  </span>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Real-time timebase sweep with configurable signal generator parameters.
                  </p>
                </div>

                {/* Waveform Selector */}
                <div className="flex gap-2">
                  {(['sine', 'square', 'triangle'] as const).map((wt) => (
                    <button
                      key={wt}
                      onClick={() => setWaveformType(wt)}
                      className={`flex-1 py-1.5 rounded-lg border text-center uppercase font-bold text-[11px] ${
                        waveformType === wt
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {wt}
                    </button>
                  ))}
                </div>

                {/* Frequency Control */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Frequency:</span>
                    <span className="text-white font-bold">{frequencyHz} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="4000"
                    step="100"
                    value={frequencyHz}
                    onChange={(e) => setFrequencyHz(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                {/* Amplitude Control */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Peak Voltage (Vpp):</span>
                    <span className="text-white font-bold">{(amplitudeV * 2).toFixed(1)} Vpp</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={amplitudeV}
                    onChange={(e) => setAmplitudeV(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                <Link
                  href="/workspace/electrical_sim_lab"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
                >
                  <span>Connect Probes in Sim Lab</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>
          )}

          {/* INSTRUMENT 3: Carrier Drift Velocimeter */}
          {activeInstrument === 'drift' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col h-[340px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative justify-center items-center p-6 text-center">
                {/* Copper Lattice Particle Flow Visualization */}
                <div className="w-full max-w-md h-24 rounded-xl border border-slate-700 bg-slate-900/90 relative overflow-hidden flex items-center justify-center">
                  {/* Conduction Wire Representation */}
                  <div className="text-slate-400 font-mono text-xs">
                    <span className="text-cyan-400 font-bold block mb-1">
                      COPPER WIRE CROSS-SECTION (AWG 22)
                    </span>
                    <span>
                      {circuitCurrentA > 0
                        ? `Electron Drift: WEST (←) • Conventional Current: EAST (→)`
                        : circuitCurrentA < 0
                        ? `Electron Drift: EAST (→) • Conventional Current: WEST (←)`
                        : 'Zero Net Carrier Drift (Thermal Equilibrium)'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 font-mono text-xs text-slate-300 space-y-1">
                  <div className="text-cyan-400 text-xl font-bold">
                    v_d = {(circuitCurrentA * -18.2).toFixed(1)} µm/s
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Scientific Law: Electron drift has the <strong>OPPOSITE</strong> sign of conventional current!
                  </div>
                </div>
              </div>

              {/* Drift Controls */}
              <div className="lg:col-span-5 space-y-4 font-mono text-xs">
                <div>
                  <span className="text-sm font-bold text-cyan-400 uppercase block">
                    Charge Carrier Dynamics
                  </span>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Calculate true electron drift velocity: v_d = -I / (n * q * A), where n = 8.5×10²⁸ electrons/m³.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wire Current:</span>
                    <span className="text-cyan-300 font-bold">{circuitCurrentA.toFixed(1)} A</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={circuitCurrentA}
                    onChange={(e) => setCircuitCurrentA(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>-5A (Reverse)</span>
                    <span>0A (Equilibrium)</span>
                    <span>+5A (Forward)</span>
                  </div>
                </div>

                <Link
                  href="/workspace/component_explorer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
                >
                  <span>Inspect Carrier Physics in 3D</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </Link>
              </div>
            </div>
          )}

          {/* INSTRUMENT 4: Overstress Burnout Test */}
          {activeInstrument === 'stress' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col h-[340px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative justify-center items-center p-6 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
                  <Flame className="w-12 h-12" />
                </div>
                <h4 className="text-lg font-bold text-white font-sans">
                  Failure Mode & Safe Operating Area (SOA)
                </h4>
                <p className="text-xs text-slate-400 font-sans max-w-sm mt-1">
                  Pushing silicon beyond maximum junction breakdown ratings melts bond wires and turns diodes into short circuits.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-4 font-mono text-xs">
                <div>
                  <span className="text-sm font-bold text-amber-400 uppercase block">
                    Component Destruction Limits
                  </span>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Every 3D Lab model tracks real datasheet absolute maximum limits (Vmax, Imax, Pmax, Tjmax).
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Resistor Overstress:</span>
                    <span>Lacquer Char & Open Circuit</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Capacitor Overvoltage:</span>
                    <span>Electrolyte Venting</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Diode Reverse Breakdown:</span>
                    <span>Junction Avalanche Melt</span>
                  </div>
                </div>

                <Link
                  href="/workspace/circuit_workspace"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors text-xs font-semibold"
                >
                  <span>Build Safe Circuits on Breadboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
