'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Cpu,
  Zap,
  ShieldCheck,
  Download,
  ArrowRight,
  Palette,
  CheckCircle2,
  Sliders,
  Sparkles,
  FileCode,
} from 'lucide-react';

interface PcbLayer {
  id: string;
  name: string;
  gerberExt: string;
  type: 'copper' | 'dielectric' | 'mask' | 'silk';
  thicknessMm: number;
  description: string;
  visible: boolean;
  color: string;
}

const INITIAL_LAYERS: PcbLayer[] = [
  {
    id: 'f_silks',
    name: 'Top Silkscreen (F.SilkS)',
    gerberExt: '.gto',
    type: 'silk',
    thicknessMm: 0.015,
    description: 'Component reference designators (R1, C1, U1), polarity marks, pin 1 chamfers, and barcode.',
    visible: true,
    color: '#F8FAFC',
  },
  {
    id: 'f_mask',
    name: 'Top Soldermask (F.Mask)',
    gerberExt: '.gts',
    type: 'mask',
    thicknessMm: 0.02,
    description: 'Photo-imageable solder resist protecting copper tracks from oxidation and accidental bridging.',
    visible: true,
    color: '#064E3B', // Default Green
  },
  {
    id: 'f_cu',
    name: 'Top Copper Layer (F.Cu)',
    gerberExt: '.gtl',
    type: 'copper',
    thicknessMm: 0.035, // 1oz copper
    description: '1oz (35µm) high-conductivity rolled annealed copper. High-speed differential pairs and SMD pads.',
    visible: true,
    color: '#E09F3E',
  },
  {
    id: 'fr4_core',
    name: 'FR-4 Dielectric Core',
    gerberExt: '.drl',
    type: 'dielectric',
    thicknessMm: 1.5,
    description: 'Woven fiberglass cloth impregnated with epoxy resin. Dielectric constant εr = 4.4 @ 1GHz.',
    visible: true,
    color: '#84934A',
  },
  {
    id: 'b_cu',
    name: 'Bottom Copper Layer (B.Cu)',
    gerberExt: '.gbl',
    type: 'copper',
    thicknessMm: 0.035,
    description: '1oz solid reference ground return plane and power supply distribution tracks.',
    visible: true,
    color: '#C67D22',
  },
  {
    id: 'b_mask',
    name: 'Bottom Soldermask (B.Mask)',
    gerberExt: '.gbs',
    type: 'mask',
    thicknessMm: 0.02,
    description: 'Protective bottom soldermask layer with cutouts for THT lead soldering.',
    visible: false,
    color: '#064E3B',
  },
];

const MASK_COLORS = [
  { name: 'Classic Green', hex: '#064E3B', border: '#059669' },
  { name: 'Matte Black', hex: '#0F172A', border: '#475569' },
  { name: 'OSH Park Purple', hex: '#581C87', border: '#A855F7' },
  { name: 'Ocean Blue', hex: '#1E3A8A', border: '#3B82F6' },
  { name: 'Fiery Red', hex: '#7F1D1D', border: '#EF4444' },
  { name: 'Clean White', hex: '#E2E8F0', border: '#CBD5E1' },
];

export function HomePcbInspector() {
  const [layers, setLayers] = useState<PcbLayer[]>(INITIAL_LAYERS);
  const [activeMaskColor, setActiveMaskColor] = useState(MASK_COLORS[0]);
  const [selectedNet, setSelectedNet] = useState<'VCC' | 'GND' | 'SPI_CLK' | 'RF_50'>('SPI_CLK');
  const [showDrc, setShowDrc] = useState(true);

  const toggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  };

  const totalBoardThicknessMm = layers
    .filter((l) => l.visible)
    .reduce((sum, l) => sum + l.thicknessMm, 0)
    .toFixed(3);

  return (
    <section id="pcb" className="w-full py-20 bg-[#07090D] border-t border-slate-800/80 relative overflow-hidden">
      {/* Decorative PCB Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            Phase 6: Multi-Layer PCB Studio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive PCB Stackup & Net Tracer
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            Deconstruct production circuit boards layer by layer. Toggle soldermasks, peel copper planes,
            trace high-frequency signal pulses through plated vias, and export industry-standard Gerber RS-274X packages.
          </p>
        </div>

        {/* Studio Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 backdrop-blur-sm">
          {/* Soldermask color palette */}
          <div className="flex items-center gap-2.5">
            <Palette className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-300">Soldermask Resin:</span>
            <div className="flex items-center gap-1.5">
              {MASK_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setActiveMaskColor(color)}
                  style={{ backgroundColor: color.hex, borderColor: color.border }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    activeMaskColor.name === color.name ? 'scale-125 ring-2 ring-emerald-400' : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-slate-400 ml-1">({activeMaskColor.name})</span>
          </div>

          {/* Interactive Net Tracer Selector */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-slate-300">Trace Net:</span>
            <div className="flex items-center gap-1">
              {(['SPI_CLK', 'VCC', 'GND', 'RF_50'] as const).map((net) => (
                <button
                  key={net}
                  onClick={() => setSelectedNet(net)}
                  className={`text-xs font-mono px-2.5 py-1 rounded-md transition-all ${
                    selectedNet === net
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400 font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/80'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* Total Stackup Thickness */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Total Stackup:</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">
              {totalBoardThicknessMm} mm
            </span>
          </div>
        </div>

        {/* Interactive Layout: Stackup Explorer + Board Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Layer Peeler List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Substrate Layer Stackup ({layers.filter((l) => l.visible).length}/{layers.length} active)
            </h3>

            <div className="space-y-2.5">
              {layers.map((layer) => {
                const isMask = layer.type === 'mask';
                const displayColor = isMask ? activeMaskColor.hex : layer.color;

                return (
                  <div
                    key={layer.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      layer.visible
                        ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                        : 'bg-slate-950/50 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLayer(layer.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            layer.visible
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'bg-slate-800 border-slate-700 text-transparent'
                          }`}
                        >
                          ✓
                        </button>

                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: displayColor }}
                          />
                          <span className="text-sm font-semibold text-slate-200">
                            {layer.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {layer.thicknessMm} mm
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                          {layer.gerberExt}
                        </span>
                      </div>
                    </div>

                    {layer.visible && (
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed pl-8">
                        {layer.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Design Rule Check (DRC) Live Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Live Design Rule Check (DRC)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  0 ERRORS • 0 WARNINGS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">MIN TRACE WIDTH:</span>
                  8.0 mil (0.203 mm)
                </div>
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">COPPER CLEARANCE:</span>
                  6.0 mil (0.152 mm)
                </div>
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">VIA ANNULAR RING:</span>
                  4.0 mil (0.102 mm)
                </div>
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">IMPEDANCE (RF 50Ω):</span>
                  50.2 Ω (±0.4%)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Board & Net Simulation Canvas */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden shadow-2xl">
              {/* Virtual PCB Board Surface */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
                    PCB Substrate Net Inspector
                  </span>
                </div>
                <div className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 animate-bounce" />
                  Active Signal Net: <strong className="text-white font-bold">{selectedNet}</strong>
                </div>
              </div>

              {/* Realistic SVG PCB Board Rendering */}
              <div
                className="w-full h-80 rounded-xl relative border-2 border-emerald-500/30 overflow-hidden shadow-inner flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: activeMaskColor.hex }}
              >
                <svg
                  viewBox="0 0 600 320"
                  className="w-full h-full select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Glowing filter for active net */}
                    <filter id="net-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Silkscreen Grid & Reference Markings (if Top Silk is visible) */}
                  {layers.find((l) => l.id === 'f_silks')?.visible && (
                    <g stroke="#FFFFFF" strokeWidth="1" opacity="0.85" fill="none">
                      {/* Board boundary chamfers */}
                      <rect x="20" y="20" width="560" height="280" rx="8" stroke="#FFFFFF" strokeWidth="1.5" />
                      {/* Logo and Rev */}
                      <text x="35" y="45" fill="#FFFFFF" fontSize="12" fontFamily="monospace" fontWeight="bold">
                        3D_LAB_CORE // REV 2.4
                      </text>
                      <text x="35" y="60" fill="#FFFFFF" fontSize="9" fontFamily="monospace">
                        HIGH-SPEED MICROSTRIP TESTBED
                      </text>
                      {/* Component outlines */}
                      <rect x="180" y="90" width="120" height="120" strokeDasharray="3,3" />
                      <text x="185" y="105" fill="#FFFFFF" fontSize="10" fontFamily="monospace">U1: MCU_BGA</text>
                      <rect x="360" y="90" width="80" height="60" />
                      <text x="365" y="105" fill="#FFFFFF" fontSize="10" fontFamily="monospace">U2: FLASH</text>
                      <rect x="360" y="180" width="80" height="50" />
                      <text x="365" y="195" fill="#FFFFFF" fontSize="10" fontFamily="monospace">U3: LDO_3V3</text>
                    </g>
                  )}

                  {/* Passive Copper Traces (F.Cu) */}
                  {layers.find((l) => l.id === 'f_cu')?.visible && (
                    <g stroke="#D97706" strokeWidth="2.5" fill="none" opacity="0.5">
                      <path d="M 60 100 L 140 100 L 180 120" />
                      <path d="M 60 120 L 120 120 L 180 140" />
                      <path d="M 60 140 L 110 140 L 180 160" />
                      <path d="M 300 130 L 360 130" />
                      <path d="M 300 150 L 360 150" />
                      <path d="M 440 120 L 520 120" />
                      <path d="M 440 200 L 520 200" />
                    </g>
                  )}

                  {/* Dynamic Glowing Net based on selectedNet */}
                  {selectedNet === 'SPI_CLK' && (
                    <g filter="url(#net-glow)">
                      <path
                        d="M 180 130 L 240 130 L 260 160 L 320 160 L 360 120"
                        stroke="#F59E0B"
                        strokeWidth="3.5"
                        fill="none"
                        strokeDasharray="8,4"
                        className="animate-pulse"
                      />
                      {/* Vias along the trace */}
                      <circle cx="260" cy="160" r="5" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
                      <circle cx="320" cy="160" r="5" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
                    </g>
                  )}

                  {selectedNet === 'VCC' && (
                    <g filter="url(#net-glow)">
                      <path
                        d="M 440 190 L 520 190 L 520 80 L 240 80 L 240 100"
                        stroke="#EF4444"
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray="12,4"
                        className="animate-pulse"
                      />
                      <circle cx="520" cy="80" r="7" fill="#FCA5A5" stroke="#991B1B" strokeWidth="2.5" />
                    </g>
                  )}

                  {selectedNet === 'GND' && (
                    <g filter="url(#net-glow)">
                      {/* Copper pour zone representation */}
                      <rect x="40" y="240" width="520" height="40" fill="#10B981" fillOpacity="0.4" stroke="#059669" strokeWidth="2" />
                      <text x="50" y="265" fill="#6EE7B7" fontSize="11" fontFamily="monospace">
                        SOLID GROUND RETURN PLANE (0.002 Ω RESISTANCE)
                      </text>
                    </g>
                  )}

                  {selectedNet === 'RF_50' && (
                    <g filter="url(#net-glow)">
                      <path
                        d="M 60 70 L 130 70 L 160 110 L 200 110"
                        stroke="#06B6D4"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="6,3"
                        className="animate-pulse"
                      />
                      <circle cx="60" cy="70" r="6" fill="#67E8F9" stroke="#0891B2" strokeWidth="2" />
                      <circle cx="200" cy="110" r="6" fill="#67E8F9" stroke="#0891B2" strokeWidth="2" />
                    </g>
                  )}

                  {/* Surface Mount Pads (ENIG Gold Finish) */}
                  <g fill="#FBBF24" stroke="#78350F" strokeWidth="1">
                    <rect x="190" y="115" width="8" height="8" rx="1" />
                    <rect x="190" y="130" width="8" height="8" rx="1" />
                    <rect x="190" y="145" width="8" height="8" rx="1" />
                    <rect x="280" y="115" width="8" height="8" rx="1" />
                    <rect x="280" y="130" width="8" height="8" rx="1" />
                    <rect x="280" y="145" width="8" height="8" rx="1" />

                    <rect x="365" y="115" width="8" height="6" rx="1" />
                    <rect x="365" y="125" width="8" height="6" rx="1" />
                    <rect x="425" y="115" width="8" height="6" rx="1" />
                    <rect x="425" y="125" width="8" height="6" rx="1" />
                  </g>
                </svg>

                {/* Overlaid Net Stats Badge */}
                <div className="absolute bottom-3 left-3 bg-slate-950/85 border border-slate-800 rounded-lg px-3 py-1.5 backdrop-blur-md">
                  <div className="text-[10px] font-mono text-slate-400">NET ROUTE:</div>
                  <div className="text-xs font-mono font-bold text-amber-400">
                    {selectedNet === 'SPI_CLK' && 'U1.CLK_OUT → VIA_L1_L2 → U2.SCK (Delay: 0.18 ns)'}
                    {selectedNet === 'VCC' && 'U3.VOUT (+3.3V) → FILTER_CAP → U1.VDD (IR Drop: 8 mV)'}
                    {selectedNet === 'GND' && 'LAYER 2 SOLID GROUND FLOOD (Plane Impedance: 12 mΩ)'}
                    {selectedNet === 'RF_50' && 'SMA_ANT1 → 50Ω COPLANAR WAVEGUIDE → LNA_IN (Loss: 0.04 dB)'}
                  </div>
                </div>
              </div>

              {/* Manufacturing & KiCad Portability Callout */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      Standard Gerber & KiCad 8.0 Sync
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Bi-directional EDA netlist synchronization with zero vendor lock-in.
                    </p>
                  </div>
                </div>

                <Link
                  href="/workspace/pcb_studio"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide shadow-lg shadow-emerald-900/30 transition-all group"
                >
                  <span>Launch Full PCB Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
