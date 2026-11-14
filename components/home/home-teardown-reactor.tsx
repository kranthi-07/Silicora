'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { DEVICES_DATA } from '@/data/devices-data';
import { DeviceExplodedModel } from '@/components/devices/models/device-exploded-model';
import { DeviceItem, DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import {
  Layers,
  Cpu,
  Smartphone,
  Laptop,
  Refrigerator,
  Sparkles,
  ArrowRight,
  Maximize2,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export function HomeTeardownReactor() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('device_smartphone');
  const [explodePercent, setExplodePercent] = useState<number>(65);
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string | null>('sub_logic_board');
  const [selectedPartId, setSelectedPartId] = useState<string | null>('soc_ap');

  const currentDevice: DeviceItem =
    DEVICES_DATA.find((d) => d.id === selectedDeviceId) || DEVICES_DATA[0];

  const selectedSubsystem = currentDevice.subsystems.find(
    (s) => s.id === selectedSubsystemId
  ) || currentDevice.subsystems[0];

  const selectedPart =
    selectedSubsystem?.components.find((c) => c.id === selectedPartId) ||
    selectedSubsystem?.components[0];

  const handleSelectSubsystem = (subsystem: DeviceSubsystem) => {
    setSelectedSubsystemId(subsystem.id);
    if (subsystem.components.length > 0) {
      setSelectedPartId(subsystem.components[0].id);
    } else {
      setSelectedPartId(null);
    }
  };

  const handleSelectPart = (part: DeviceComponentPart) => {
    setSelectedPartId(part.id);
    setSelectedSubsystemId(part.subsystemId);
  };

  return (
    <section id="teardown" className="w-full py-20 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/10 to-indigo-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            3D Teardown & Subsystem Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exploded Hardware Reactor
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            Peel back production hardware down to the silicon substrate. Inspect multilayer interconnects, 
            thermal vapor chambers, RF antenna routing, and mechanical subsystems with live physical callouts.
          </p>
        </div>

        {/* Device Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => {
              setSelectedDeviceId('device_smartphone');
              setSelectedSubsystemId('sub_logic_board');
              setSelectedPartId('soc_ap');
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selectedDeviceId === 'device_smartphone'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            5G Flagship Smartphone
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              selectedDeviceId === 'device_smartphone' ? 'bg-cyan-700/40 text-cyan-950' : 'bg-slate-800 text-slate-400'
            }`}>
              Image 2 & 4
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedDeviceId('device_laptop');
              setSelectedSubsystemId(DEVICES_DATA.find((d) => d.id === 'device_laptop')?.subsystems[0]?.id || null);
              setSelectedPartId(null);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selectedDeviceId === 'device_laptop'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4" />
            Ultrabook Laptop (Numbered Callouts)
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              selectedDeviceId === 'device_laptop' ? 'bg-cyan-700/40 text-cyan-950' : 'bg-slate-800 text-slate-400'
            }`}>
              Image 3
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedDeviceId('device_refrigerator');
              setSelectedSubsystemId(DEVICES_DATA.find((d) => d.id === 'device_refrigerator')?.subsystems[0]?.id || null);
              setSelectedPartId(null);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selectedDeviceId === 'device_refrigerator'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Refrigerator className="w-4 h-4" />
            Inverter Refrigerator Cutaway
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              selectedDeviceId === 'device_refrigerator' ? 'bg-cyan-700/40 text-cyan-950' : 'bg-slate-800 text-slate-400'
            }`}>
              Image 1
            </span>
          </button>
        </div>

        {/* Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          {/* 3D Viewport Column */}
          <div className="lg:col-span-8 flex flex-col h-[520px] sm:h-[600px] relative border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Top Viewport Header with Scrub Controls */}
            <div className="p-3 sm:p-4 bg-slate-950/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 z-20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider">
                  Interactive 3D Teardown Stage
                </span>
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                  • Click & Drag to Orbit •
                </span>
              </div>

              {/* Exploded Stack Scrubber */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                  Explode: <strong className="text-cyan-400 font-bold">{explodePercent}%</strong>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explodePercent}
                  onChange={(e) => setExplodePercent(Number(e.target.value))}
                  className="w-32 sm:w-44 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => setExplodePercent(0)}
                    className="text-[10px] font-mono px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                    title="Fully assembled"
                  >
                    0%
                  </button>
                  <button
                    onClick={() => setExplodePercent(60)}
                    className="text-[10px] font-mono px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                    title="Inspected separation"
                  >
                    60%
                  </button>
                  <button
                    onClick={() => setExplodePercent(100)}
                    className="text-[10px] font-mono px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                    title="Full exploded stack"
                  >
                    100%
                  </button>
                </div>
              </div>
            </div>

            {/* Three.js Canvas Container */}
            <div className="flex-1 w-full h-full relative bg-[#07090D]">
              <Canvas
                camera={{ position: [14, 16, 20], fov: 42, near: 0.1, far: 1000 }}
                gl={{ powerPreference: 'high-performance', antialias: true }}
                dpr={[1, 1.5]}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <color attach="background" args={['#07090D']} />
                <ambientLight intensity={0.9} />
                <directionalLight position={[20, 30, 20]} intensity={1.5} />
                <directionalLight position={[-20, 15, -20]} intensity={0.8} color="#93C5FD" />
                <pointLight position={[0, -10, 0]} intensity={0.5} />

                <Suspense fallback={null}>
                  <DeviceExplodedModel
                    device={currentDevice}
                    explodePercent={explodePercent}
                    selectedSubsystemId={selectedSubsystemId}
                    selectedPartId={selectedPartId}
                    onSelectPart={handleSelectPart}
                    onSelectSubsystem={handleSelectSubsystem}
                  />
                </Suspense>

                <Grid
                  position={[0, -6, 0]}
                  args={[40, 40]}
                  cellSize={1}
                  cellThickness={0.8}
                  cellColor="#1E293B"
                  sectionSize={5}
                  sectionThickness={1.2}
                  sectionColor="#334155"
                  fadeDistance={35}
                />

                {/* OrbitControls with enableZoom={false} to preserve smooth homepage page scroll */}
                <OrbitControls enableZoom={false} enablePan={true} maxPolarAngle={Math.PI / 2 + 0.1} />
              </Canvas>

              {/* Subsystem quick tags at bottom of 3D canvas */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10 pointer-events-auto">
                {currentDevice.subsystems.map((sub) => {
                  const isActive = selectedSubsystemId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubsystem(sub)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 backdrop-blur-md ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-semibold shadow-md'
                          : 'bg-slate-900/80 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/80'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: sub.color || '#38BDF8' }}
                      />
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Inspector & Engineering Dossier Column */}
          <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[600px] bg-slate-950/40">
            <div>
              {/* Device Title & Meta */}
              <div className="pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                    {currentDevice.category} CAD Archive
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Model: {currentDevice.modelYear}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {currentDevice.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {currentDevice.tagline}
                </p>
              </div>

              {/* Selected Subsystem / Part Inspection */}
              {selectedPart ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {selectedPart.packageType}
                      </span>
                      {selectedPart.calloutNumber && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                          Leader #{selectedPart.calloutNumber}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">
                      {selectedPart.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {selectedPart.functionalRole}
                    </p>
                  </div>

                  {/* Key Engineering Specifications */}
                  {selectedPart.keySpecs && (
                    <div>
                      <h5 className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Micro-Architecture Specs
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedPart.keySpecs).map(([key, value]) => (
                          <div key={key} className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                            <div className="text-[10px] font-mono text-slate-500">{key}</div>
                            <div className="text-xs font-mono text-cyan-300 font-medium truncate">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Signal Flow / Working Principle */}
                  {selectedPart.signalFlow && (
                    <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60 text-xs space-y-1.5">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                        Real-World Signal Path
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-cyan-400">Input:</strong> {selectedPart.signalFlow.input}
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-amber-400">Processing:</strong> {selectedPart.signalFlow.processing}
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedSubsystem ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedSubsystem.color || '#38BDF8' }} />
                      {selectedSubsystem.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {selectedSubsystem.description}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Contained Subsystem Components
                    </h5>
                    <div className="space-y-1.5">
                      {selectedSubsystem.components.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectPart(c)}
                          className="w-full text-left p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between group transition-colors"
                        >
                          <span className="truncate group-hover:text-cyan-400">{c.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{c.packageType}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Manufacturing facts callout */}
              {currentDevice.documentedEngineeringFacts.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    Verified Manufacturing Fact
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    &quot;{currentDevice.documentedEngineeringFacts[0]}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Launch Full Device CAD Studio CTA */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href={`/workspace/device_explorer?device=${currentDevice.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold tracking-wide shadow-lg shadow-cyan-900/30 transition-all group"
              >
                <span>Launch in Full Device CAD Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
