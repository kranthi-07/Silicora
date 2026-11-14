'use client';

import React, { useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowRight,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  Zap,
  Cpu,
  ShieldCheck,
  Compass,
  Activity,
  Scissors,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { BjtTo92Model } from '@/components/viewer/models/bjt-to92-model';
import { DiodeModel } from '@/components/viewer/models/diode-model';
import { LedModel } from '@/components/viewer/models/led-model';
import { AxialResistorModel } from '@/components/viewer/models/axial-resistor-model';

export function HomeHero() {
  const [activeChip, setActiveChip] = useState<'bjt' | 'diode' | 'led' | 'resistor'>('bjt');
  const [xrayBeamPos, setXrayBeamPos] = useState<number>(65); // 0 to 100%
  const [inspectDepthUm, setInspectDepthUm] = useState<number>(145);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80 bg-slate-950">
      {/* Background Microscopic Wafer Grid & Radial Neon Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Operational Telemetry Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-3 border-b border-slate-800/80 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-semibold">3D LAB ENGINE V1.0</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">WebGL 3D Core • ODE Solver • KiCad CAD</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-cyan-400 font-medium">
              6 ENVIRONMENTS READY
            </span>
            <span className="hidden md:inline text-emerald-400/90 font-medium">
              Zero Installation Needed
            </span>
          </div>
        </div>

        {/* Hero Grid: Left Copy & Controls | Right 3D X-Ray Inspection Beam */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT 6 COLS: Title, Narrative, and Quick Launch Buttons */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Generation Electronics Learning Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white font-sans leading-[1.12]">
              Electronics Explored From the{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Inside Out.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Step beyond black-box circuit schematics. Inspect microscopic semiconductor dies, wire live 3D breadboards, probe non-linear quantum carriers, tear down flagship hardware, and design fabrication-ready PCBs in an unified browser workstation.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-6 py-3.5 text-xs font-mono font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 group"
              >
                <span>LAUNCH FULL WORKSTATION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#workbench"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700/80 px-5 py-3.5 text-xs font-mono font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Try Test Bench ↓</span>
              </a>
            </div>

            {/* Micro-Features Checklist */}
            <div className="pt-4 grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Semiconductor Die Cutaways</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>830-Point Breadboard Physics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Shockley & ODE Solvers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>KiCad & RS-274X Export</span>
              </div>
            </div>
          </div>

          {/* RIGHT 6 COLS: Interactive Sub-surface Silicon X-Ray Inspection Beam */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur relative overflow-hidden">
              {/* Inspection Beam HUD Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-bold text-slate-200 uppercase">Sub-Surface CT Scanner</span>
                </div>
                <div className="text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                  DEPTH: {inspectDepthUm} µm
                </div>
              </div>

              {/* Part Selector Pills for Scanner */}
              <div className="flex items-center gap-1.5 mb-3 font-mono text-[11px] overflow-x-auto pb-1">
                {[
                  { id: 'bjt', name: '2N3904 NPN BJT', code: 'TO-92' },
                  { id: 'diode', name: '1N4148 Glass Diode', code: 'DO-35' },
                  { id: 'led', name: '5mm Optic LED', code: 'Radial' },
                  { id: 'resistor', name: '10kΩ Metal Film', code: 'Axial' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setActiveChip(chip.id as any)}
                    className={`px-2.5 py-1 rounded-md transition-all shrink-0 border ${
                      activeChip === chip.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-bold shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {chip.name}
                  </button>
                ))}
              </div>

              {/* 3D Real-Time Inspection Viewport */}
              <div className="relative h-[320px] sm:h-[360px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80">
                {/* Floating Telemetry Coordinates Overlay */}
                <div className="absolute top-2.5 left-2.5 z-10 font-mono text-[10px] text-slate-400 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded backdrop-blur">
                  <span>ORBIT: Active • PEEL: {xrayBeamPos}%</span>
                </div>

                {/* Laser Scanning Beam Line Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-sky-300 to-cyan-500 z-10 pointer-events-none shadow-[0_0_12px_#38bdf8]"
                  style={{ left: `${xrayBeamPos}%` }}
                >
                  <div className="absolute top-2 -left-6 px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 text-[9px] font-mono font-bold uppercase tracking-wider">
                    X-RAY
                  </div>
                </div>

                {/* 3D Canvas with High-Performance Clamp for Butter-Smooth 60fps */}
                <Canvas
                  camera={{ position: [12, 10, 14], fov: 38 }}
                  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                  dpr={[1, 1.5]}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                >
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[15, 25, 15]} intensity={1.5} />
                  <directionalLight position={[-15, -10, -10]} intensity={0.4} />
                  <pointLight position={[0, 8, 0]} intensity={1.0} color="#38bdf8" />

                  <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

                  <Suspense fallback={null}>
                    <group position={[0, 0, 0]}>
                      {activeChip === 'bjt' && <BjtTo92Model />}
                      {activeChip === 'diode' && <DiodeModel variant="do35" />}
                      {activeChip === 'led' && <LedModel />}
                      {activeChip === 'resistor' && <AxialResistorModel />}
                    </group>
                  </Suspense>

                  <ContactShadows position={[0, -5, 0]} opacity={0.6} scale={24} blur={2.2} />
                </Canvas>
              </div>

              {/* Sub-Surface Scanner Beam Scrub Slider */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                    Interactive Casing Peel / X-Ray Beam:
                  </span>
                  <span className="text-cyan-300 font-bold">{xrayBeamPos}% Exposed</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={xrayBeamPos}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setXrayBeamPos(v);
                    setInspectDepthUm(Math.round(20 + v * 2.2));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Outer Mold Enclosure</span>
                  <span>Leadframe & Wirebonds</span>
                  <span>Active Silicon Die</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
