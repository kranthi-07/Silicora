'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import {
  Scissors,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { AxialResistorModel } from '@/components/viewer/models/axial-resistor-model';
import { DiodeModel } from '@/components/viewer/models/diode-model';
import { LedModel } from '@/components/viewer/models/led-model';
import { ElectrolyticCapModel } from '@/components/viewer/models/electrolytic-cap-model';
import { BjtTo92Model } from '@/components/viewer/models/bjt-to92-model';
import { MosfetTo92Model } from '@/components/viewer/models/mosfet-to92-model';
import { ComponentPhysicalIllustration } from '@/components/explorer/component-graphics';

interface ShowcasePart {
  id: string;
  name: string;
  family: string;
  packageCode: string;
  symbol: any;
  layers: Array<{ id: string; name: string; desc: string }>;
  principle: string;
  carrierPhysics: string;
  polarity: string;
  demoTitle: string;
  demoParams: { label: string; unit: string; min: number; max: number; default: number };
  calculateOutput: (val: number) => { outLabel: string; outVal: string; formula: string };
}

const SHOWCASE_PARTS: ShowcasePart[] = [
  {
    id: 'pass_res_10k',
    name: '10kΩ Metal Film Resistor',
    family: 'Resistor',
    packageCode: 'Axial-0.25W',
    symbol: 'resistor',
    layers: [
      { id: 'lacquer', name: 'Epoxy Lacquer & Bands', desc: 'Protective casing with EIA color bands' },
      { id: 'spiral', name: 'Helical Thin Film', desc: 'Laser-trimmed nickel-chromium spiral' },
      { id: 'core', name: 'Ceramic Core', desc: 'Alumina insulator rod' },
      { id: 'caps', name: 'Tinned Steel Caps', desc: 'End caps and welded axial leads' },
    ],
    principle: 'Opposes electrical current flow by converting kinetic electron energy into heat via atomic lattice collisions (Joule dissipation).',
    carrierPhysics: 'Conduction electrons collide with vibrating alumina and metal lattice phonons, obeying Ohm’s law V = I × R.',
    polarity: 'Non-polarized. Can be inserted in either direction into a breadboard or PCB.',
    demoTitle: 'Ohm’s Law Voltage vs Current',
    demoParams: { label: 'Applied Voltage', unit: 'V', min: 1, max: 24, default: 9 },
    calculateOutput: (v) => ({
      outLabel: 'Loop Current',
      outVal: `${((v / 10000) * 1000).toFixed(2)} mA`,
      formula: `I = V / R = ${v}V / 10kΩ`,
    }),
  },
  {
    id: 'semi_diode_1n4148',
    name: '1N4148 Fast Switching Diode',
    family: 'Diode',
    packageCode: 'DO-35',
    symbol: 'diode',
    layers: [
      { id: 'glass', name: 'Hermetic Glass Bead', desc: 'Clear bead with cathode black band' },
      { id: 'die', name: 'Silicon PN Die', desc: 'Semiconductor epitaxial junction' },
      { id: 'cat_whisker', name: 'Tungsten Whisker', desc: 'Spring-loaded S-contact wire' },
      { id: 'leads', name: 'Axial Leads', desc: 'Copper-clad Dumet leads' },
    ],
    principle: 'Semiconductor one-way valve: conducts easily in forward bias (~0.7V threshold) while blocking reverse current.',
    carrierPhysics: 'Forward bias reduces the PN depletion barrier allowing majority carriers to diffuse across the junction.',
    polarity: 'Polarized! The black painted stripe marks the Cathode (-) terminal. Current flows towards the stripe.',
    demoTitle: 'Shockley Forward Diode Conduction',
    demoParams: { label: 'Forward Bias', unit: 'V', min: 0.1, max: 1.2, default: 0.7 },
    calculateOutput: (v) => {
      const isConduction = v >= 0.65;
      const current = isConduction ? Math.exp((v - 0.65) * 8) * 2 : 0.001;
      return {
        outLabel: isConduction ? 'Forward Current' : 'Leakage State',
        outVal: isConduction ? `${current.toFixed(1)} mA` : 'Blocked (< 1 µA)',
        formula: isConduction ? `Conducting above knee (0.65V)` : `Depletion zone active`,
      };
    },
  },
  {
    id: 'opto_led_red_5mm',
    name: '5mm Red Indicator LED',
    family: 'LED',
    packageCode: 'Radial-5mm',
    symbol: 'led',
    layers: [
      { id: 'epoxy_lens', name: 'Tinted Epoxy Lens', desc: 'Diffused optical focusing dome' },
      { id: 'cup', name: 'Reflector Anvil & Post', desc: 'Leadframe anvil cup and post' },
      { id: 'die', name: 'AlGaAs Optic Die', desc: 'Radiative recombination quantum die' },
      { id: 'wire', name: 'Gold Wirebond', desc: '25µm microscopic bond wire' },
    ],
    principle: 'Solid-state light emitter: injected electrons and holes recombine radiatively to emit photons of energy equal to the bandgap (~630nm red).',
    carrierPhysics: 'Direct bandgap quantum recombination converting electrical energy directly into visible light without filament heat.',
    polarity: 'Polarized! Longer leg is Anode (+); shorter leg and flat rim edge is Cathode (-).',
    demoTitle: 'Radiometric Flux & Current',
    demoParams: { label: 'Forward Voltage', unit: 'V', min: 1.0, max: 2.4, default: 2.0 },
    calculateOutput: (v) => {
      const on = v >= 1.8;
      const flux = on ? Math.min(100, Math.round(((v - 1.8) / 0.4) * 100)) : 0;
      return {
        outLabel: on ? 'Luminous Output' : 'Optical State',
        outVal: on ? `${flux}% Brightness` : 'Dark (Below 1.8V Threshold)',
        formula: on ? `Photons emitted: E = h * c / λ` : `Sub-threshold bias`,
      };
    },
  },
  {
    id: 'pass_cap_elec_470u',
    name: '470µF 25V Electrolytic Cap',
    family: 'Capacitor',
    packageCode: 'Radial-Can-8x11',
    symbol: 'polarized_capacitor',
    layers: [
      { id: 'pvc_sleeve', name: 'PVC Vinyl Sleeve', desc: 'Insulating sleeve with polarity line' },
      { id: 'can', name: 'Aluminum Pressure Can', desc: 'Deep-drawn can with safety vent' },
      { id: 'winding', name: 'Jelly-Roll Foil', desc: 'Etched foil & electrolyte paper' },
      { id: 'bung', name: 'Rubber Sealing Bung', desc: 'Hermetic seal and lead rivets' },
    ],
    principle: 'Stores electrical charge electrostatically across an ultra-thin aluminum oxide dielectric layer for energy storage and filtering.',
    carrierPhysics: 'Microscopic electrostatic field displacement between etched high-surface-area aluminum foils separated by nanometer-thin Al2O3.',
    polarity: 'Polarized! White stripe with minus (-) symbols marks the Negative lead. Reversing causes hydrogen gas buildup!',
    demoTitle: 'RC Charging Time Constant',
    demoParams: { label: 'Time Elapsed', unit: 'ms', min: 0, max: 2000, default: 470 },
    calculateOutput: (t) => {
      const tau = 470; // R=1k, C=470u => tau=470ms
      const vCap = 9.0 * (1 - Math.exp(-t / tau));
      return {
        outLabel: 'Capacitor Voltage',
        outVal: `${vCap.toFixed(2)} V (of 9V max)`,
        formula: `V(t) = 9V * (1 - e^(-t / 470ms))`,
      };
    },
  },
  {
    id: 'semi_bjt_2n3904',
    name: '2N3904 NPN BJT Transistor',
    family: 'BJT',
    packageCode: 'TO-92',
    symbol: 'bjt_npn',
    layers: [
      { id: 'epoxy', name: 'Molded Epoxy Shell', desc: 'D-cut black plastic body' },
      { id: 'die', name: 'Silicon NPN Die', desc: 'Emitter, Base, Collector junctions' },
      { id: 'leadframe', name: 'Copper Leadframe', desc: 'Central collector mounting flag' },
      { id: 'wirebonds', name: 'Gold Bond Wires', desc: 'Base & Emitter microscopic wires' },
    ],
    principle: 'Current-controlled active amplifier and switch: a small base current controls a much larger collector-emitter current.',
    carrierPhysics: 'Electrons injected from the N-emitter diffuse across the thin P-base and are swept into the N-collector by reverse bias.',
    polarity: 'Pinout: Pin 1 = Emitter, Pin 2 = Base, Pin 3 = Collector (looking at flat face).',
    demoTitle: 'Current Gain (β / hFE = 100)',
    demoParams: { label: 'Base Current (Ib)', unit: 'µA', min: 0, max: 200, default: 50 },
    calculateOutput: (ib) => {
      const ic = (ib * 100) / 1000;
      return {
        outLabel: 'Collector Current (Ic)',
        outVal: `${ic.toFixed(2)} mA`,
        formula: `Ic = β * Ib = 100 * ${ib}µA`,
      };
    },
  },
  {
    id: 'semi_mosfet_2n7000',
    name: '2N7000 N-Channel MOSFET',
    family: 'MOSFET',
    packageCode: 'TO-92',
    symbol: 'mosfet_n',
    layers: [
      { id: 'epoxy', name: 'Molded Epoxy Shell', desc: 'D-cut TO-92 encapsulation' },
      { id: 'die', name: 'Trench-Gate Silicon Die', desc: 'Insulated oxide gate & trench' },
      { id: 'leadframe', name: 'Drain Copper Paddle', desc: 'Thermal and electrical substrate' },
      { id: 'wires', name: 'Gold Bond Wires', desc: 'Source & Gate contacts' },
    ],
    principle: 'Voltage-controlled switch: electrostatic gate field modulates inversion channel conductance without drawing DC gate current.',
    carrierPhysics: 'Positive gate voltage pulls minority electrons to form an N-inversion channel under the SiO2 gate dielectric.',
    polarity: 'Pinout: Pin 1 = Source, Pin 2 = Gate, Pin 3 = Drain.',
    demoTitle: 'Threshold Gate Switching',
    demoParams: { label: 'Gate Voltage (Vgs)', unit: 'V', min: 0, max: 5.0, default: 3.3 },
    calculateOutput: (vgs) => {
      const on = vgs >= 2.1;
      return {
        outLabel: on ? 'Channel State: ON' : 'Channel State: OFF',
        outVal: on ? 'Conducting (Rds < 5Ω)' : 'High Impedance (> 100MΩ)',
        formula: on ? `Vgs (${vgs}V) > Vth (2.1V)` : `Vgs (${vgs}V) < Vth (2.1V)`,
      };
    },
  },
];

export function HomeShowcase3D() {
  const [selectedPartId, setSelectedPartId] = useState<string>('pass_res_10k');
  const [cutawayActive, setCutawayActive] = useState<boolean>(true);
  const [demoInputVal, setDemoInputVal] = useState<number>(9);
  const [webglError, setWebglError] = useState<boolean>(false);

  const currentPart = SHOWCASE_PARTS.find((p) => p.id === selectedPartId) || SHOWCASE_PARTS[0];

  const handleSelectPart = (partId: string) => {
    setSelectedPartId(partId);
    const part = SHOWCASE_PARTS.find((p) => p.id === partId);
    if (part) {
      setDemoInputVal(part.demoParams.default);
    }
  };

  const output = currentPart.calculateOutput(demoInputVal);

  return (
    <section id="showcase" className="relative py-16 sm:py-24 bg-slate-950 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-mono text-cyan-400 mb-3">
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive 3D Component Inspection</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans">
            See What Happens Inside Electronic Components
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans">
            Rotate realistic 3D representations, part their outer casings to inspect internal semiconductor dies, and evaluate their physical equations.
          </p>
        </div>

        {/* Component Selector Navigation Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          {SHOWCASE_PARTS.map((part) => {
            const isSelected = selectedPartId === part.id;
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => handleSelectPart(part.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                  <ComponentPhysicalIllustration componentId={part.id} className="w-full h-full" />
                </div>
                <span>{part.name}</span>
                <span className="text-[10px] text-slate-500 hidden md:inline">({part.packageCode})</span>
              </button>
            );
          })}
        </div>

        {/* Main Split Showcase Surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 shadow-2xl backdrop-blur">
          {/* LEFT 7 COLS: Live 3D Interactive Viewport */}
          <div className="lg:col-span-7 flex flex-col h-[420px] sm:h-[480px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 relative">
            {/* 3D Viewport Controls Bar */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 backdrop-blur shadow-sm">
                <span className="text-cyan-400 font-bold">{currentPart.packageCode}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Click & Drag to Orbit</span>
              </div>

              {/* Cutaway Shell Separation Toggle */}
              <button
                type="button"
                onClick={() => setCutawayActive(!cutawayActive)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border backdrop-blur shadow-sm ${
                  cutawayActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Separates external casing to reveal internal semiconductor die and layers"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>{cutawayActive ? 'CUTAWAY: OPEN' : 'CUTAWAY: CLOSED'}</span>
              </button>
            </div>

            {/* Canvas or Fallback */}
            {webglError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 font-mono text-xs">
                <p className="text-amber-400 font-bold mb-1">WebGL 3D Context Notice</p>
                <p>Interactive 3D requires hardware acceleration.</p>
              </div>
            ) : (
              <Canvas
                camera={{ position: [14, 12, 16], fov: 38 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <ambientLight intensity={0.7} />
                <directionalLight position={[20, 30, 20]} intensity={1.5} />
                <directionalLight position={[-20, -10, -10]} intensity={0.4} />
                <pointLight position={[0, 10, 0]} intensity={0.8} />

                <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

                <Suspense fallback={null}>
                  <group position={[0, 0, 0]}>
                    {selectedPartId === 'pass_res_10k' && <AxialResistorModel />}
                    {selectedPartId === 'semi_diode_1n4148' && <DiodeModel variant="do35" />}
                    {selectedPartId === 'opto_led_red_5mm' && <LedModel />}
                    {selectedPartId === 'pass_cap_elec_470u' && <ElectrolyticCapModel />}
                    {selectedPartId === 'semi_bjt_2n3904' && <BjtTo92Model />}
                    {selectedPartId === 'semi_mosfet_2n7000' && <MosfetTo92Model />}
                  </group>
                </Suspense>

                <ContactShadows position={[0, -6, 0]} opacity={0.5} scale={30} blur={2} />
              </Canvas>
            )}

            {/* Bottom Layer Tags Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 shrink-0 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                <Layers className="w-3 h-3 text-cyan-400" />
                Layers:
              </span>
              {currentPart.layers.map((l) => (
                <span
                  key={l.id}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700/80 shrink-0 backdrop-blur"
                >
                  {l.name}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT 5 COLS: Scientific Blueprint & Educational Simulator */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 font-mono text-xs">
            {/* Header info */}
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {currentPart.family}
                </span>
                <span className="text-[11px] text-slate-400">{currentPart.packageCode}</span>
              </div>
              <h3 className="text-lg font-bold text-white font-sans">{currentPart.name}</h3>
            </div>

            {/* Physical Operating Principle */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                Operating Principle
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {currentPart.principle}
              </p>
            </div>

            {/* Microscopic Carrier Physics */}
            <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Microscopic Charge Carriers
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {currentPart.carrierPhysics}
              </p>
            </div>

            {/* Polarity Rule */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Polarity & Terminal Rule
              </span>
              <p className="text-amber-300/90 font-sans text-xs">
                {currentPart.polarity}
              </p>
            </div>

            {/* Live Educational Model Simulator */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  {currentPart.demoTitle}
                </span>
                <span className="text-[10px] text-slate-500">Educational Analytical Model</span>
              </div>

              {/* Slider Input */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{currentPart.demoParams.label}:</span>
                  <span className="text-white font-bold">
                    {demoInputVal} {currentPart.demoParams.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={currentPart.demoParams.min}
                  max={currentPart.demoParams.max}
                  step={0.1}
                  value={demoInputVal}
                  onChange={(e) => setDemoInputVal(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                />
              </div>

              {/* Calculated Outputs */}
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{output.outLabel}</span>
                  <span className="text-sm font-bold text-cyan-300">{output.outVal}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Equation</span>
                  <span className="text-[11px] text-slate-300">{output.formula}</span>
                </div>
              </div>
            </div>

            {/* Deep Link to Full Explorer */}
            <div className="pt-2">
              <Link
                href="/workspace/component_explorer"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
              >
                <span>Open in 3D Component Explorer</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
