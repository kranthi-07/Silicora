'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Activity,
  Layers,
  RotateCcw,
  Scissors,
  Sliders,
  Maximize2,
  Check,
  GraduationCap,
} from 'lucide-react';
import { BjtTo92Model } from '@/components/viewer/models/bjt-to92-model';
import { DiodeModel } from '@/components/viewer/models/diode-model';
import { LedModel } from '@/components/viewer/models/led-model';
import { AxialResistorModel } from '@/components/viewer/models/axial-resistor-model';
import { ElectrolyticCapModel } from '@/components/viewer/models/electrolytic-cap-model';
import { useWorkspaceStore } from '@/lib/store';
import { MOCK_COMPONENTS } from '@/data/mock-components';
import { cn } from '@/lib/utils';

export function FuturisticHero() {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [telemetryMode, setTelemetryMode] = useState<0 | 1 | 2>(0);
  const [densityToggle, setDensityToggle] = useState(false);
  const [insightToggle, setInsightToggle] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const {
    setSelectedComponent,
    setCutawayActive,
    setCutawayOffset,
    setExplodePercent,
    setIsTransitioningToWorkspace,
    setTutorialsModalOpen,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';

  // On homepage, strictly keep 3D component closed with zero layer separations
  useEffect(() => {
    setCutawayActive(false);
    setCutawayOffset(0);
    setExplodePercent(0);
  }, [setCutawayActive, setCutawayOffset, setExplodePercent]);

  const samples = [
    {
      id: 'semi_bjt_2n3904',
      code: 'Sample C-214',
      name: '2N3904 NPN BJT',
      category: 'Semiconductor Switch',
      density: '18.6k',
      drift: '0.12 mm/s',
      structures: '12,540',
      interactions: '8,216',
      signals: '3,782',
      status: 'Analyzing',
      phase: 'Active saturation phase',
      modelType: 'bjt',
    },
    {
      id: 'pass_res_10k',
      code: 'Sample R-102',
      name: '10kΩ Metal Film',
      category: 'Helical Precision',
      density: '24.2k',
      drift: '0.08 mm/s',
      structures: '14,120',
      interactions: '6,450',
      signals: '5,000',
      status: 'Calibrating',
      phase: 'Laser-trimmed helix',
      modelType: 'resistor',
    },
    {
      id: 'opto_led_5mm_red',
      code: 'Sample L-505',
      name: '5mm Optical LED',
      category: 'Quantum Well Opto',
      density: '31.8k',
      drift: '0.24 mm/s',
      structures: '16,800',
      interactions: '9,120',
      signals: '4,290',
      status: 'Emitting',
      phase: 'Radiative photon phase',
      modelType: 'led',
    },
    {
      id: 'semi_diode_1n4148',
      code: 'Sample D-418',
      name: '1N4148 Fast Diode',
      category: 'Hermetic Switch',
      density: '19.4k',
      drift: '0.15 mm/s',
      structures: '11,900',
      interactions: '7,340',
      signals: '4,100',
      status: 'Detecting',
      phase: 'Planar PN conduction',
      modelType: 'diode',
    },
    {
      id: 'pass_cap_electrolytic_470u',
      code: 'Sample K-470',
      name: '470μF Electrolytic',
      category: 'Polarized Energy',
      density: '42.1k',
      drift: '0.04 mm/s',
      structures: '18,400',
      interactions: '11,200',
      signals: '6,150',
      status: 'Charging',
      phase: 'Dielectric foil roll',
      modelType: 'capacitor',
    },
  ];

  const currentSample = samples[activeSampleIndex];

  // Telemetry profiles for the interactive Donut Gauge
  const telemetryModes = [
    { percent: 68, label: 'active', strokeOffset: 38.2, structures: currentSample.structures, interactions: currentSample.interactions, signals: currentSample.signals },
    { percent: 84, label: 'high flux', strokeOffset: 19.1, structures: '15,820', interactions: '10,410', signals: '5,890' },
    { percent: 96, label: 'peak load', strokeOffset: 4.8, structures: '18,940', interactions: '12,980', signals: '7,430' },
  ];
  const activeTelemetry = telemetryModes[telemetryMode];

  // Sync workspace store when sample or cutaway/explode changes
  useEffect(() => {
    const comp = MOCK_COMPONENTS.find((c) => c.id === currentSample.id);
    if (comp) {
      setSelectedComponent(comp);
    }
  }, [currentSample.id, setSelectedComponent]);

  useEffect(() => {
    setCutawayActive(false);
    setCutawayOffset(0);
    setExplodePercent(0);
  }, [setCutawayActive, setCutawayOffset, setExplodePercent]);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <section
      className={cn(
        'relative w-full pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden select-none transition-colors duration-300',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#0A090D] text-white'
      )}
    >
      {/* 1. Warm Ambient Luminous Coral/Crimson Halo (Exactly matches reference image) */}
      <div
        className={cn(
          'absolute top-1/4 left-1/2 -translate-x-1/4 w-[750px] h-[550px] blur-[120px] pointer-events-none transition-opacity duration-300',
          isLight
            ? 'bg-[radial-gradient(circle,rgba(240,101,67,0.12)_0%,rgba(226,88,62,0.06)_35%,rgba(56,189,248,0.04)_60%,transparent_75%)] opacity-80'
            : 'bg-[radial-gradient(circle,rgba(240,101,67,0.18)_0%,rgba(226,88,62,0.10)_35%,rgba(147,51,234,0.04)_60%,transparent_75%)]'
        )}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* HERO UPPER SECTION: Left Content & Right Floating Metric Pods */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
          
          {/* LEFT COLUMN: Editorial Typography & Live Overview Card */}
          <div className="lg:col-span-5 space-y-7 z-10">
            {/* Editorial Headline with Italic Serif Accent */}
            <div className="space-y-3">
              <h1
                className={cn(
                  'text-4xl sm:text-5xl lg:text-[58px] font-normal tracking-tight font-sans leading-[1.08] transition-colors',
                  isLight ? 'text-slate-900' : 'text-white'
                )}
              >
                Explore hidden <br />
                <span className="font-serif italic font-normal text-[#F06543]">patterns</span> inside <br />
                living systems
              </h1>

              <p
                className={cn(
                  'text-sm sm:text-[15px] font-sans leading-relaxed max-w-md pt-2 transition-colors',
                  isLight ? 'text-slate-600' : 'text-[#9A95A4]'
                )}
              >
                Visualize cellular structures, sample behavior, and molecular activity through a focused scientific workspace.
              </p>
            </div>

            {/* CTAs: Primary Coral Capsule & Secondary Map Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/workspace"
                onClick={() => setIsTransitioningToWorkspace(true)}
                className="flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-gradient-to-r from-[#E2583E] via-[#F06543] to-[#FF7A59] text-white text-sm font-medium shadow-[0_4px_24px_rgba(240,101,67,0.4)] hover:shadow-[0_6px_32px_rgba(240,101,67,0.6)] hover:scale-102 active:scale-98 transition-all group"
              >
                <span>Explore Samples</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </Link>

              <Link
                href="/workspace/circuit_workspace"
                onClick={() => setIsTransitioningToWorkspace(true)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm transition-all',
                  isLight
                    ? 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 shadow-sm'
                    : 'bg-[#14121A] border-white/[0.08] text-[#A5A0AF] hover:text-white hover:border-white/[0.2]'
                )}
              >
                <span>View Research Map</span>
                <Compass className="w-4 h-4 text-[#A5A0AF]" />
              </Link>

              <button
                type="button"
                onClick={() => setTutorialsModalOpen(true)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm transition-all cursor-pointer group shadow-sm',
                  isLight
                    ? 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:border-amber-500'
                    : 'bg-[#14121A] border-white/[0.08] text-[#A5A0AF] hover:text-white hover:border-amber-400/50'
                )}
                title="Open Interactive Tutorials"
              >
                <GraduationCap className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Tutorials</span>
              </button>
            </div>

            {/* WIDE CARD: "Live Cellular Overview" (Bottom-Left) */}
            <div
              className={cn(
                'w-full rounded-3xl border p-5 backdrop-blur-xl space-y-4 smooth-card transition-colors duration-200',
                isLight
                  ? 'bg-white/95 border-slate-200/90 shadow-xl'
                  : 'bg-[#131119]/90 border-white/[0.07] shadow-2xl'
              )}
            >
              <div className="flex items-center justify-between text-xs font-sans">
                <span
                  className={cn(
                    'font-medium flex items-center gap-1.5',
                    isLight ? 'text-slate-700' : 'text-[#8E8899]'
                  )}
                >
                  <span>Live Cellular Overview</span>
                  <span className={cn('text-[10px]', isLight ? 'text-slate-400' : 'text-[#6B6675]')}>
                    (Click gauge to cycle)
                  </span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-[#F06543]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F06543] animate-pulse" />
                  <span className="capitalize">{activeTelemetry.label}</span>
                </div>
              </div>

              {/* Data Row: Donut Gauge, Wave Area Chart, Checklist */}
              <div className="grid grid-cols-12 gap-3 items-center">
                {/* 1. Circular Donut Gauge (Interactive click to cycle levels) */}
                <div
                  className="col-span-3 flex flex-col items-center justify-center cursor-pointer group"
                  onClick={() => setTelemetryMode((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
                  title="Click to cycle telemetry load"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="19"
                        stroke={isLight ? '#E2E8F0' : '#221E2C'}
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="19"
                        stroke="#F06543"
                        strokeWidth="4"
                        strokeDasharray="119.38"
                        strokeDashoffset={activeTelemetry.strokeOffset}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-500 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span
                        className={cn(
                          'text-xs font-bold leading-tight',
                          isLight ? 'text-slate-800' : 'text-white'
                        )}
                      >
                        {activeTelemetry.percent}%
                      </span>
                      <span className={cn('text-[8px]', isLight ? 'text-slate-500' : 'text-[#8E8899]')}>
                        {activeTelemetry.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Crimson Smooth Area Waveform Chart (Animated fluid wave) */}
                <div className="col-span-5 h-14 flex items-center justify-center px-1 overflow-hidden">
                  <div className="w-full h-full animate-wave-fluid">
                    <svg className="w-full h-full" viewBox="0 0 160 55" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="coralAreaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E2583E" stopOpacity={isLight ? 0.35 : 0.45} />
                          <stop offset="100%" stopColor="#E2583E" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,48 Q 20,48 35,40 T 70,42 T 95,20 T 125,36 T 160,25 L 160,55 L 0,55 Z"
                        fill="url(#coralAreaFill)"
                      />
                      <path
                        d="M 0,48 Q 20,48 35,40 T 70,42 T 95,20 T 125,36 T 160,25"
                        stroke="#F06543"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>

                {/* 3. Metric Checklist */}
                <div className="col-span-4 space-y-1 text-[11px] font-sans">
                  <div
                    className={cn(
                      'flex items-center justify-between',
                      isLight ? 'text-slate-600' : 'text-[#9A95A4]'
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F06543]" />
                      Structures
                    </span>
                    <span className={cn('font-medium', isLight ? 'text-slate-800' : 'text-white')}>
                      {activeTelemetry.structures}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'flex items-center justify-between',
                      isLight ? 'text-slate-600' : 'text-[#9A95A4]'
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      Interactions
                    </span>
                    <span className={cn('font-medium', isLight ? 'text-slate-800' : 'text-white')}>
                      {activeTelemetry.interactions}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'flex items-center justify-between',
                      isLight ? 'text-slate-600' : 'text-[#9A95A4]'
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Signals
                    </span>
                    <span className={cn('font-medium', isLight ? 'text-slate-800' : 'text-white')}>
                      {activeTelemetry.signals}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER & RIGHT: 3D Spatial Canvas with Interactive In-Chamber Controls */}
          <div className="lg:col-span-7 relative h-[520px] flex items-center justify-center">
            
            {/* The Majestic 3D Translucent Luminous Model Stage */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <Canvas
                camera={{ position: [11, 8, 14], fov: 32 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                {/* Warm Coral / Amber Lighting Setup to match reference art */}
                <ambientLight intensity={0.7} />
                <directionalLight position={[12, 20, 10]} intensity={2.0} color="#FF7A59" />
                <directionalLight position={[-15, -10, -10]} intensity={0.8} color="#9333EA" />
                <pointLight position={[0, 4, 0]} intensity={1.8} color="#F59E0B" />

                <OrbitControls
                  makeDefault
                  enableZoom={false}
                  autoRotate={autoRotate}
                  autoRotateSpeed={1.5}
                  enableDamping
                  dampingFactor={0.05}
                />

                <Suspense fallback={null}>
                  <group position={[-2.8, 0, 0]}>
                    {currentSample.modelType === 'bjt' && <BjtTo92Model />}
                    {currentSample.modelType === 'resistor' && <AxialResistorModel />}
                    {currentSample.modelType === 'led' && <LedModel />}
                    {currentSample.modelType === 'diode' && <DiodeModel variant="do35" />}
                    {currentSample.modelType === 'capacitor' && <ElectrolyticCapModel />}
                  </group>
                </Suspense>

                <ContactShadows position={[-2.8, -4.5, 0]} opacity={0.5} scale={20} blur={2.5} color="#E2583E" />
              </Canvas>

              {/* Sample Switcher Subtle Floating Chip on Top-Left */}
              <div
                className={cn(
                  'absolute top-2 left-6 z-10 flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-md transition-colors',
                  isLight
                    ? 'bg-white/90 border-slate-200/90'
                    : 'bg-[#14121A]/85 border-white/[0.08]'
                )}
              >
                {samples.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSampleIndex(idx)}
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[11px] font-sans transition-all duration-200',
                      activeSampleIndex === idx
                        ? 'bg-[#F06543] text-white font-medium shadow-[0_0_12px_rgba(240,101,67,0.5)]'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-[#8E8899] hover:text-white hover:bg-white/[0.05]'
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Solid Enclosure Indicator & Free Orbit Pill on Bottom-Left */}
              <div
                className={cn(
                  'absolute bottom-3 left-6 z-10 flex items-center gap-2.5 backdrop-blur-md px-3.5 py-1.5 rounded-full border shadow-md text-xs font-sans transition-colors',
                  isLight
                    ? 'bg-white/90 border-slate-200/90'
                    : 'bg-[#14121A]/85 border-white/[0.08]'
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-1.5 text-[11px]',
                    isLight ? 'text-slate-600' : 'text-[#A5A0AF]'
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Enclosure: Solid Physical</span>
                </div>

                <div className={cn('w-px h-3.5', isLight ? 'bg-slate-200' : 'bg-white/[0.1]')} />

                {/* Free Orbit / Auto-Rotate Toggle */}
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-colors',
                    autoRotate
                      ? 'bg-[#F06543]/20 text-[#FF7A59] border border-[#F06543]/30 font-semibold'
                      : isLight
                      ? 'text-slate-500 hover:text-slate-900'
                      : 'text-[#8E8899] hover:text-white'
                  )}
                  title="Toggle 360° Continuous Orbit"
                >
                  <RotateCcw className={cn('w-3 h-3', autoRotate && 'animate-spin')} style={{ animationDuration: '6s' }} />
                  <span>{autoRotate ? '360° Orbit' : 'Paused'}</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: 3 Vertical Floating Metric Cards (Overlaid right on the hero) */}
            <div className="relative z-10 ml-auto w-full max-w-[270px] space-y-3 pointer-events-auto">
              
              {/* Card 1: Molecular Density (Click to toggle particle count vs drift velocity) */}
              <div
                onClick={() => setDensityToggle(!densityToggle)}
                className={cn(
                  'p-4 rounded-2xl backdrop-blur-xl border shadow-xl space-y-2 smooth-card cursor-pointer group transition-colors',
                  isLight
                    ? 'bg-white/95 border-slate-200/90 text-slate-800'
                    : 'bg-[#131119]/85 border-white/[0.07] text-white'
                )}
                title="Click to toggle density metric"
              >
                <div className="flex items-center justify-between">
                  {/* Left: Golden Dotted Dial */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#F59E0B]/10 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="11" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.7" />
                      <circle cx="16" cy="16" r="6" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.9" />
                      <circle cx="16" cy="16" r="2.2" fill="#F59E0B" />
                    </svg>
                  </div>

                  {/* Middle: Number & Label */}
                  <div className="text-left flex-1 pl-3">
                    <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#8E8899]')}>
                      {densityToggle ? 'Electron Drift Velocity' : 'Molecular Density'}
                    </span>
                    <span className={cn('text-xl font-bold tracking-tight', isLight ? 'text-slate-900' : 'text-white')}>
                      {densityToggle ? currentSample.drift : currentSample.density}
                    </span>
                    <span className={cn('text-[9px] block -mt-1', isLight ? 'text-slate-400' : 'text-[#8E8899]')}>
                      {densityToggle ? 'mean velocity' : 'particles'}
                    </span>
                  </div>

                  {/* Right: Golden Glowing Sparkline */}
                  <div className="w-16 h-8 flex items-center">
                    <svg className="w-full h-full" viewBox="0 0 60 28" fill="none">
                      <path
                        d="M 0,24 Q 15,26 25,18 T 42,12 L 60,4"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="60" cy="4" r="2" fill="#F59E0B" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card 2: Research Scan (Click to trigger radar sweep) */}
              <div
                onClick={handleTriggerScan}
                className={cn(
                  'p-4 rounded-2xl backdrop-blur-xl border shadow-xl space-y-1 smooth-card cursor-pointer group transition-colors',
                  isLight
                    ? 'bg-white/95 border-slate-200/90 text-slate-800'
                    : 'bg-[#131119]/85 border-white/[0.07] text-white'
                )}
                title="Click to trigger research scan"
              >
                <div className="flex items-center justify-between">
                  {/* Left: Radar Concentric Scanner */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#9333EA]/10 group-hover:scale-105 transition-transform">
                    <svg className={cn('w-8 h-8 transition-transform duration-700', isScanning && 'rotate-180')} viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="12" stroke="#9333EA" strokeWidth="1" opacity="0.4" />
                      <circle cx="16" cy="16" r="8" stroke="#F06543" strokeWidth="1.5" strokeDasharray="3 2" />
                      <circle cx="16" cy="16" r="3.5" stroke="#F06543" strokeWidth="1.5" />
                      <circle cx="16" cy="16" r="1.5" fill="#F06543" />
                    </svg>
                  </div>

                  {/* Middle: Label & Sample Code */}
                  <div className="text-left flex-1 pl-3">
                    <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#8E8899]')}>Research Scan</span>
                    <span className={cn('text-xs font-semibold block', isLight ? 'text-slate-900' : 'text-white')}>{currentSample.code}</span>
                    <span className="text-[10px] text-[#F06543] flex items-center gap-1">
                      <span className={cn('w-1 h-1 rounded-full bg-[#F06543]', isScanning ? 'animate-ping' : 'animate-pulse')} />
                      {isScanning ? 'Scanning...' : currentSample.status}
                    </span>
                  </div>

                  {/* Right: Multi-Ring Circular Donut Gauge */}
                  <div className="w-10 h-10 flex items-center justify-center">
                    <svg className="w-10 h-10" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" stroke={isLight ? '#E2E8F0' : '#221E2C'} strokeWidth="3" fill="none" />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="#F06543"
                        strokeWidth="3"
                        strokeDasharray="100.5"
                        strokeDashoffset="35"
                        strokeLinecap="round"
                        fill="none"
                        transform="rotate(-90 20 20)"
                      />
                      <circle cx="20" cy="20" r="11" stroke={isLight ? '#E2E8F0' : '#221E2C'} strokeWidth="2.5" fill="none" />
                      <circle
                        cx="20"
                        cy="20"
                        r="11"
                        stroke="#9333EA"
                        strokeWidth="2.5"
                        strokeDasharray="69.1"
                        strokeDashoffset="25"
                        strokeLinecap="round"
                        fill="none"
                        transform="rotate(45 20 20)"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card 3: Lab Insight (Click to toggle Thermal vs Saturation) */}
              <div
                onClick={() => setInsightToggle(!insightToggle)}
                className={cn(
                  'p-4 rounded-2xl backdrop-blur-xl border shadow-xl smooth-card cursor-pointer group transition-colors',
                  isLight
                    ? 'bg-white/95 border-slate-200/90 text-slate-800'
                    : 'bg-[#131119]/85 border-white/[0.07] text-white'
                )}
                title="Click to toggle insight"
              >
                <div className="flex items-center justify-between">
                  {/* Left: Minimal Node Icon in Circle */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Activity className="w-4 h-4" />
                  </div>

                  {/* Middle: Insight Status */}
                  <div className="text-left flex-1 pl-3">
                    <span className={cn('text-[10px] block', isLight ? 'text-slate-500' : 'text-[#8E8899]')}>
                      {insightToggle ? 'Thermal Load' : 'Lab Insight'}
                    </span>
                    <span className={cn('text-xs font-semibold block', isLight ? 'text-slate-900' : 'text-white')}>
                      {insightToggle ? 'Tj: 25.4°C Nominal' : currentSample.phase}
                    </span>
                  </div>

                  {/* Right: Circular Micro-Lattice Macro Thumbnail */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl overflow-hidden border flex items-center justify-center shadow-inner',
                      isLight
                        ? 'bg-slate-100 border-slate-200'
                        : 'bg-gradient-to-tr from-[#1E293B] to-[#0F172A] border-white/[0.1]'
                    )}
                  >
                    <div className="w-full h-full bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:4px_4px] opacity-70" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3. HERO LOWER SECTION: 3 Feature Spotlight Cards (Fully functional links to environments) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          
          {/* Spotlight Card 1: Live Sample Mapping -> routes to /workspace/internal_cutaway */}
          <Link
            href="/workspace/internal_cutaway"
            onClick={() => setIsTransitioningToWorkspace(true)}
            className={cn(
              'p-5 rounded-3xl border shadow-xl flex items-center gap-4 group smooth-card transition-all duration-300',
              isLight
                ? 'bg-white/95 border-slate-200/90 hover:border-[#F06543]/60'
                : 'bg-[#131119]/90 border-white/[0.07] hover:border-[#F06543]/40'
            )}
          >
            {/* Left Circular 3D Cutaway Thumbnail */}
            <div className="w-16 h-16 rounded-full shrink-0 bg-gradient-to-tr from-[#2A1725] via-[#3B1E28] to-[#1F1422] p-1 border border-white/[0.1] shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_50%,#F06543_0%,#9333EA_45%,#0F0E17_80%)] opacity-90 flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white/90" />
              </div>
            </div>

            {/* Middle Copy */}
            <div className="flex-1 space-y-1">
              <h2
                className={cn(
                  'text-sm font-semibold tracking-tight group-hover:text-[#F06543] transition-colors',
                  isLight ? 'text-slate-900' : 'text-white'
                )}
              >
                Live Sample Mapping
              </h2>
              <p className={cn('text-xs leading-relaxed', isLight ? 'text-slate-500' : 'text-[#8E8899]')}>
                Track cellular interactions and sample dynamics in real time with advanced imaging.
              </p>
            </div>

            {/* Right Circular Arrow Button */}
            <div
              className={cn(
                'w-7 h-7 rounded-full border flex items-center justify-center shrink-0 group-hover:bg-[#F06543] group-hover:text-white transition-all duration-300',
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#1C1A24] border-white/[0.06]'
              )}
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8899] group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Spotlight Card 2: Pattern Analysis -> routes to /workspace/circuit_workspace */}
          <Link
            href="/workspace/circuit_workspace"
            onClick={() => setIsTransitioningToWorkspace(true)}
            className={cn(
              'p-5 rounded-3xl border shadow-xl flex items-center gap-4 group smooth-card transition-all duration-300',
              isLight
                ? 'bg-white/95 border-slate-200/90 hover:border-[#F06543]/60'
                : 'bg-[#131119]/90 border-white/[0.07] hover:border-[#F06543]/40'
            )}
          >
            {/* Left Hexagonal Lattice Vector Icon */}
            <div className="w-16 h-16 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
                <polygon points="28,4 50,16 50,40 28,52 6,40 6,16" stroke="#F06543" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <circle cx="28" cy="28" r="3" fill="#F06543" />
                <circle cx="28" cy="16" r="2" fill="#F06543" opacity="0.8" />
                <circle cx="28" cy="40" r="2" fill="#F06543" opacity="0.8" />
                <circle cx="18" cy="22" r="2" fill="#F06543" opacity="0.8" />
                <circle cx="38" cy="22" r="2" fill="#F06543" opacity="0.8" />
                <circle cx="18" cy="34" r="2" fill="#F06543" opacity="0.8" />
                <circle cx="38" cy="34" r="2" fill="#F06543" opacity="0.8" />
                <line x1="28" y1="28" x2="28" y2="16" stroke="#F06543" strokeWidth="1" opacity="0.6" />
                <line x1="28" y1="28" x2="28" y2="40" stroke="#F06543" strokeWidth="1" opacity="0.6" />
                <line x1="28" y1="28" x2="18" y2="22" stroke="#F06543" strokeWidth="1" opacity="0.6" />
                <line x1="28" y1="28" x2="38" y2="22" stroke="#F06543" strokeWidth="1" opacity="0.6" />
                <line x1="28" y1="28" x2="18" y2="34" stroke="#F06543" strokeWidth="1" opacity="0.6" />
                <line x1="28" y1="28" x2="38" y2="34" stroke="#F06543" strokeWidth="1" opacity="0.6" />
              </svg>
            </div>

            {/* Middle Copy */}
            <div className="flex-1 space-y-1">
              <h2
                className={cn(
                  'text-sm font-semibold tracking-tight group-hover:text-[#F06543] transition-colors',
                  isLight ? 'text-slate-900' : 'text-white'
                )}
              >
                Pattern Analysis
              </h2>
              <p className={cn('text-xs leading-relaxed', isLight ? 'text-slate-500' : 'text-[#8E8899]')}>
                Detect structural patterns, anomalies, and behavioral trends with precision.
              </p>
            </div>

            {/* Right Circular Arrow Button */}
            <div
              className={cn(
                'w-7 h-7 rounded-full border flex items-center justify-center shrink-0 group-hover:bg-[#F06543] group-hover:text-white transition-all duration-300',
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#1C1A24] border-white/[0.06]'
              )}
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8899] group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Spotlight Card 3: Microstructure Library -> routes to /workspace/component_explorer */}
          <Link
            href="/workspace/component_explorer"
            onClick={() => setIsTransitioningToWorkspace(true)}
            className={cn(
              'p-5 rounded-3xl border shadow-xl flex items-center gap-4 group smooth-card transition-all duration-300',
              isLight
                ? 'bg-white/95 border-slate-200/90 hover:border-[#F06543]/60'
                : 'bg-[#131119]/90 border-white/[0.07] hover:border-[#F06543]/40'
            )}
          >
            {/* Left Circular Thumbnail of Micro-Structures */}
            <div className="w-16 h-16 rounded-full shrink-0 bg-gradient-to-tr from-[#1F241E] via-[#2A3524] to-[#182017] p-1 border border-white/[0.1] shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_50%,#E2583E_0%,#F59E0B_35%,#10B981_70%,#0B120E_90%)] opacity-85 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white/90" />
              </div>
            </div>

            {/* Middle Copy */}
            <div className="flex-1 space-y-1">
              <h2
                className={cn(
                  'text-sm font-semibold tracking-tight group-hover:text-[#F06543] transition-colors',
                  isLight ? 'text-slate-900' : 'text-white'
                )}
              >
                Microstructure Library
              </h2>
              <p className={cn('text-xs leading-relaxed', isLight ? 'text-slate-500' : 'text-[#8E8899]')}>
                Access a curated library of cellular structures and molecular formations.
              </p>
            </div>

            {/* Right Circular Arrow Button */}
            <div
              className={cn(
                'w-7 h-7 rounded-full border flex items-center justify-center shrink-0 group-hover:bg-[#F06543] group-hover:text-white transition-all duration-300',
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#1C1A24] border-white/[0.06]'
              )}
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8899] group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}