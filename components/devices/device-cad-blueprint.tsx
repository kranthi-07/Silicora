'use client';

import React, { useState } from 'react';
import { DeviceItem, DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import {
  Compass,
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Cpu,
  Zap,
  Info,
  CheckCircle2,
  Crosshair,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DeviceCadBlueprintProps {
  device: DeviceItem;
  selectedSubsystemId: string | null;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
}

export function DeviceCadBlueprint({
  device,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
}: DeviceCadBlueprintProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterSubsystemId, setFilterSubsystemId] = useState<string | null>(null);

  // Flatten all parts with callouts
  const allParts = device.subsystems.flatMap((s) => s.components);
  const activePart = allParts.find((p) => p.id === selectedPartId) || null;

  return (
    <div className="w-full h-full flex flex-col bg-[#061220] text-[#00e5ff] font-mono select-none relative overflow-hidden">
      {/* Blueprint Drafting Header HUD */}
      <div className="px-6 py-3 border-b border-[#00e5ff]/20 bg-[#040c16]/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/40 text-[#00e5ff]">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#00e5ff]/70 tracking-widest uppercase">
                ENGINEERING CAD BLUEPRINT // MECHANICAL & ELECTRICAL SPECIFICATION
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00e5ff]/20 text-[#00e5ff] font-bold">
                1:1 METRIC
              </span>
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {device.name} — Full Schematic Assembly Drawing
            </h2>
          </div>
        </div>

        {/* Subsystem Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0a192f] p-1 rounded-lg border border-[#00e5ff]/30 text-xs">
          <button
            type="button"
            onClick={() => setFilterSubsystemId(null)}
            className={`px-2.5 py-1 rounded text-[11px] transition-all ${
              filterSubsystemId === null
                ? 'bg-[#00e5ff] text-[#040c16] font-bold shadow-[0_0_10px_#00e5ff]'
                : 'text-[#00e5ff]/70 hover:text-white'
            }`}
          >
            All Systems ({allParts.length})
          </button>
          {device.subsystems.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => {
                setFilterSubsystemId(sub.id);
                onSelectSubsystem(sub);
              }}
              className={`px-2.5 py-1 rounded text-[11px] transition-all truncate max-w-[140px] ${
                filterSubsystemId === sub.id
                  ? 'bg-[#00e5ff] text-[#040c16] font-bold shadow-[0_0_10px_#00e5ff]'
                  : 'text-[#00e5ff]/70 hover:text-white'
              }`}
            >
              {sub.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.15))}
            className="p-1.5 rounded-lg bg-[#0a192f] hover:bg-[#00e5ff]/20 border border-[#00e5ff]/30 text-[#00e5ff]"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-bold w-12 text-center text-white">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.75, z + 0.15))}
            className="p-1.5 rounded-lg bg-[#0a192f] hover:bg-[#00e5ff]/20 border border-[#00e5ff]/30 text-[#00e5ff]"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg bg-[#0a192f] hover:bg-[#00e5ff]/20 border border-[#00e5ff]/30 text-[#00e5ff]"
            title="Reset Scale"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main CAD Blueprint Canvas Area */}
      <div className="flex-1 overflow-auto relative p-8 flex items-center justify-center custom-scrollbar">
        {/* Drafting Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00e5ff 1px, transparent 1px),
              linear-gradient(to bottom, #00e5ff 1px, transparent 1px),
              linear-gradient(to right, rgba(0, 229, 255, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 229, 255, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
          }}
        />

        {/* Blueprint Framing Sheet */}
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          className="relative w-[1100px] h-[720px] border-2 border-[#00e5ff]/60 bg-[#071324]/90 shadow-[0_0_60px_rgba(0,229,255,0.15)] rounded-lg p-6 flex flex-col justify-between transition-transform duration-200"
        >
          {/* Border Dimension Coordinates */}
          <div className="absolute top-1 left-4 right-4 flex justify-between text-[8px] text-[#00e5ff]/60 font-mono tracking-widest pointer-events-none">
            <span>A</span>
            <span>B</span>
            <span>C</span>
            <span>D</span>
            <span>E</span>
            <span>F</span>
            <span>G</span>
            <span>H</span>
          </div>

          <div className="grid grid-cols-12 gap-6 h-full pb-14">
            {/* Orthographic View 1: Front Elevation & Chassis Dimensions (Cols 1-4) */}
            <div className="col-span-4 border border-[#00e5ff]/30 rounded-lg p-4 bg-[#050e1a]/80 flex flex-col relative">
              <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-1 mb-2">
                <span className="text-[10px] font-bold uppercase text-[#00e5ff]">
                  VIEW A: FRONT ELEVATION
                </span>
                <span className="text-[9px] text-[#8b949e]">DIM: 160.8 × 78.1 mm</span>
              </div>

              {/* Front Phone Wireframe Vector Graphic */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-[190px] h-[390px] border-2 border-[#00e5ff] rounded-[32px] relative flex flex-col items-center justify-between p-3 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                  {/* Top Earpiece Speaker */}
                  <div className="w-10 h-1 rounded-full bg-[#00e5ff]/60 mb-1" />

                  {/* Punch Hole Camera Cutout */}
                  <div className="w-4 h-4 rounded-full border-2 border-[#00e5ff] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                  </div>

                  {/* Active Screen Bounds */}
                  <div className="w-full flex-1 my-2 border border-dashed border-[#00e5ff]/40 rounded-[24px] relative flex flex-col items-center justify-center">
                    <span className="text-[9px] text-[#00e5ff]/50 font-bold uppercase tracking-wider">
                      6.7&quot; LTPO AMOLED
                    </span>
                    <span className="text-[8px] text-[#8b949e]">2800 × 1260 px</span>

                    {/* Ultrasonic Fingerprint Callout Area */}
                    <div
                      onClick={() => {
                        const fp = allParts.find((p) => p.id === 'fprint_sensor');
                        if (fp) onSelectPart(fp);
                      }}
                      className="absolute bottom-6 w-14 h-14 rounded-full border-2 border-dashed border-amber-400 bg-amber-400/10 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-400/20 transition-colors"
                    >
                      <Crosshair className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-[7px] text-amber-300 font-bold mt-0.5">② SENSOR</span>
                    </div>
                  </div>

                  {/* Display Driver IC Callout at bottom */}
                  <div
                    onClick={() => {
                      const ddic = allParts.find((p) => p.id === 'oled_ddic');
                      if (ddic) onSelectPart(ddic);
                    }}
                    className="w-24 h-4 rounded bg-[#00e5ff]/20 border border-[#00e5ff] flex items-center justify-center cursor-pointer hover:bg-[#00e5ff]/40 transition-colors"
                  >
                    <span className="text-[8px] text-[#00e5ff] font-bold">① DDIC COF</span>
                  </div>
                </div>

                {/* Dimension Leader Lines */}
                <div className="absolute -left-2 top-10 bottom-10 flex flex-col justify-between items-center text-[8px] text-[#00e5ff]/70 font-mono">
                  <span>▲</span>
                  <span className="rotate-[-90deg] whitespace-nowrap">160.8 mm</span>
                  <span>▼</span>
                </div>
              </div>
            </div>

            {/* Orthographic View 2: Motherboard SLP Component Placement (Cols 5-9) */}
            <div className="col-span-5 border border-[#00e5ff]/30 rounded-lg p-4 bg-[#050e1a]/80 flex flex-col relative">
              <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-1 mb-2">
                <span className="text-[10px] font-bold uppercase text-[#00e5ff]">
                  VIEW B: SUBSTRATE-LIKE PCB (SLP) SILICON LAYOUT
                </span>
                <span className="text-[9px] text-[#8b949e]">LAYER: TOP SILK & SMPS</span>
              </div>

              {/* L-Shaped Motherboard CAD Vector */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-[280px] h-[390px] relative">
                  {/* Motherboard Upper Section */}
                  <div className="absolute top-0 left-0 w-[240px] h-[190px] border-2 border-[#10b981] bg-[#064e3b]/30 rounded-lg p-2">
                    <span className="text-[8px] text-[#10b981] font-bold tracking-widest block">
                      HIGH-DENSITY HDI PCB CORE
                    </span>

                    {/* Camera Island Cutout / Module */}
                    <div
                      onClick={() => {
                        const cam = allParts.find((p) => p.id === 'cam_module');
                        if (cam) onSelectPart(cam);
                      }}
                      className={`absolute top-6 left-2 w-24 h-28 rounded-lg border-2 flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all ${
                        selectedPartId === 'cam_module'
                          ? 'border-[#00e5ff] bg-[#00e5ff]/20 shadow-[0_0_15px_#00e5ff]'
                          : 'border-white/40 bg-black/40 hover:border-white'
                      }`}
                    >
                      <span className="text-[7px] text-[#00e5ff] font-bold">⑧ TRIPLE CAM</span>
                      <div className="w-8 h-8 rounded-full border-2 border-[#00e5ff] my-1 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[#0284c7]" />
                      </div>
                      <span className="text-[6px] text-white/80">50MP 1&quot; + 5x</span>
                    </div>

                    {/* 3nm Application Processor (SoC + PoP RAM) */}
                    <div
                      onClick={() => {
                        const soc = allParts.find((p) => p.id === 'soc_ap');
                        if (soc) onSelectPart(soc);
                      }}
                      className={`absolute top-8 right-3 w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        selectedPartId === 'soc_ap'
                          ? 'border-[#00e5ff] bg-[#00e5ff]/30 shadow-[0_0_20px_#00e5ff]'
                          : 'border-[#10b981] bg-[#0f172a] hover:border-[#00e5ff]'
                      }`}
                    >
                      <Cpu className="w-5 h-5 text-[#00e5ff] mb-1" />
                      <span className="text-[7px] font-bold text-white text-center">
                        ③ 3nm SoC + RAM
                      </span>
                      <span className="text-[6px] text-[#10b981]">19B Transistors</span>
                    </div>

                    {/* UFS 4.0 Storage */}
                    <div
                      onClick={() => {
                        const ufs = allParts.find((p) => p.id === 'storage_ufs');
                        if (ufs) onSelectPart(ufs);
                      }}
                      className={`absolute bottom-2 left-28 w-20 h-10 rounded border flex flex-col items-center justify-center cursor-pointer transition-all ${
                        selectedPartId === 'storage_ufs'
                          ? 'border-[#00e5ff] bg-[#00e5ff]/30 shadow-[0_0_12px_#00e5ff]'
                          : 'border-white/30 bg-black/50 hover:border-white'
                      }`}
                    >
                      <span className="text-[7px] font-bold text-white">④ 512GB UFS 4.0</span>
                      <span className="text-[6px] text-[#8b949e]">4,200 MB/s</span>
                    </div>
                  </div>

                  {/* L-Shaped Spine along right edge */}
                  <div className="absolute top-[188px] right-10 w-[70px] h-[120px] border-r-2 border-l-2 border-b-2 border-[#10b981] bg-[#064e3b]/30 p-1 flex flex-col justify-around">
                    {/* PMIC Regulator */}
                    <div
                      onClick={() => {
                        const pmic = allParts.find((p) => p.id === 'main_pmic');
                        if (pmic) onSelectPart(pmic);
                      }}
                      className={`p-1 rounded border flex flex-col items-center justify-center cursor-pointer transition-all ${
                        selectedPartId === 'main_pmic'
                          ? 'border-[#00e5ff] bg-[#00e5ff]/30'
                          : 'border-amber-400/50 bg-black/40 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-[6px] text-amber-300 font-bold">⑤ PMIC 8-PHASE</span>
                    </div>

                    {/* 5G Modem */}
                    <div
                      onClick={() => {
                        const modem = allParts.find((p) => p.id === 'modem_rf');
                        if (modem) onSelectPart(modem);
                      }}
                      className={`p-1 rounded border flex flex-col items-center justify-center cursor-pointer transition-all ${
                        selectedPartId === 'modem_rf'
                          ? 'border-[#00e5ff] bg-[#00e5ff]/30'
                          : 'border-[#58a6ff]/50 bg-black/40 hover:border-[#58a6ff]'
                      }`}
                    >
                      <span className="text-[6px] text-[#58a6ff] font-bold">⑥ 5G MODEM</span>
                    </div>
                  </div>

                  {/* Battery Cavity (Left of the L-spine) */}
                  <div
                    onClick={() => {
                      const batt = allParts.find((p) => p.id === 'batt_cell');
                      if (batt) onSelectPart(batt);
                    }}
                    className={`absolute top-[195px] left-0 w-[185px] h-[175px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                      selectedPartId === 'batt_cell'
                        ? 'border-[#00e5ff] bg-[#00e5ff]/20 shadow-[0_0_20px_#00e5ff]'
                        : 'border-[#ca8a04] bg-[#ca8a04]/10 hover:bg-[#ca8a04]/20'
                    }`}
                  >
                    <span className="text-[9px] text-[#ca8a04] font-bold">
                      ⑨ 4,500 mAh LI-ION POUCH
                    </span>
                    <span className="text-[8px] text-[#8b949e]">17.5 Wh // 65W Fast Charge</span>
                    <span className="text-[7px] text-[#eab308] mt-1 border border-[#eab308]/40 px-1.5 py-0.5 rounded">
                      Silicon-Carbon Anode
                    </span>
                  </div>

                  {/* Bottom Daughterboard & USB-C Port */}
                  <div className="absolute bottom-0 left-0 right-0 h-10 border-2 border-[#10b981] bg-[#064e3b]/30 rounded-lg flex items-center justify-between px-2">
                    {/* Stereo Speaker */}
                    <button
                      type="button"
                      onClick={() => {
                        const spk = allParts.find((p) => p.id === 'stereo_speakers');
                        if (spk) onSelectPart(spk);
                      }}
                      className="text-[6px] text-white p-1 rounded bg-black/40 border border-white/20 hover:border-[#00e5ff]"
                    >
                      ⑬ SPEAKER
                    </button>

                    {/* USB-C Receptacle */}
                    <button
                      type="button"
                      onClick={() => {
                        const usb = allParts.find((p) => p.id === 'usbc_port');
                        if (usb) onSelectPart(usb);
                      }}
                      className={`px-3 py-1 rounded border font-bold text-[7px] transition-all ${
                        selectedPartId === 'usbc_port'
                          ? 'border-[#00e5ff] bg-[#00e5ff] text-black shadow-[0_0_12px_#00e5ff]'
                          : 'border-white/40 bg-black text-[#00e5ff] hover:border-[#00e5ff]'
                      }`}
                    >
                      ⑮ USB-C 3.2
                    </button>

                    {/* Taptic Engine */}
                    <button
                      type="button"
                      onClick={() => {
                        const tap = allParts.find((p) => p.id === 'taptic_engine');
                        if (tap) onSelectPart(tap);
                      }}
                      className="text-[6px] text-white p-1 rounded bg-black/40 border border-white/20 hover:border-[#00e5ff]"
                    >
                      ⑫ TAPTIC LRA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Orthographic View 3: Section A-A Thermal & Mechanical Stackup (Cols 10-12) */}
            <div className="col-span-3 border border-[#00e5ff]/30 rounded-lg p-4 bg-[#050e1a]/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-1 mb-2">
                  <span className="text-[10px] font-bold uppercase text-[#00e5ff]">
                    SECTION A-A: LAYER STACK
                  </span>
                  <span className="text-[9px] text-[#8b949e]">Z: 7.65 mm</span>
                </div>

                <div className="space-y-1.5 text-[9px] font-mono">
                  <div className="p-1 rounded bg-[#090b0e] border border-white/20 flex justify-between">
                    <span className="text-white">1. Cover Glass (Victus)</span>
                    <span className="text-[#00e5ff]">0.55 mm</span>
                  </div>
                  <div className="p-1 rounded bg-[#1e1b4b] border border-indigo-500/40 flex justify-between">
                    <span className="text-indigo-300">2. LTPO AMOLED Screen</span>
                    <span className="text-[#00e5ff]">0.30 mm</span>
                  </div>
                  <div className="p-1 rounded bg-[#064e3b] border border-emerald-500/40 flex justify-between">
                    <span className="text-emerald-300">3. SLP Logic Board + SoC</span>
                    <span className="text-[#00e5ff]">0.85 mm</span>
                  </div>
                  <div className="p-1 rounded bg-[#b45309]/30 border border-amber-600/50 flex justify-between">
                    <span className="text-amber-400">4. Copper Vapor Chamber</span>
                    <span className="text-[#00e5ff]">0.35 mm</span>
                  </div>
                  <div className="p-1 rounded bg-[#ca8a04]/20 border border-yellow-500/40 flex justify-between">
                    <span className="text-yellow-300">5. 4500mAh Li-Po Cell</span>
                    <span className="text-[#00e5ff]">4.20 mm</span>
                  </div>
                  <div className="p-1 rounded bg-[#64748b]/20 border border-slate-500/40 flex justify-between">
                    <span className="text-slate-300">6. Titanium Midframe</span>
                    <span className="text-[#00e5ff]">0.75 mm</span>
                  </div>
                  <div className="p-1 rounded bg-[#b45309]/20 border border-amber-500/30 flex justify-between">
                    <span className="text-amber-300">7. Qi2 Wireless Coil</span>
                    <span className="text-[#00e5ff]">0.40 mm</span>
                  </div>
                  <div className="p-1 rounded bg-[#090b0e] border border-white/20 flex justify-between">
                    <span className="text-white">8. Rear Ceramic Glass</span>
                    <span className="text-[#00e5ff]">0.65 mm</span>
                  </div>
                </div>
              </div>

              {/* Vapor Chamber Hotspot Button */}
              <div
                onClick={() => {
                  const vc = allParts.find((p) => p.id === 'vapor_chamber');
                  if (vc) onSelectPart(vc);
                }}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  selectedPartId === 'vapor_chamber'
                    ? 'border-[#00e5ff] bg-[#00e5ff]/20 shadow-[0_0_15px_#00e5ff]'
                    : 'border-amber-600/50 bg-[#b45309]/10 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 mb-1">
                  <span>⑪ VAPOR CHAMBER</span>
                  <span className="text-[9px] text-[#00e5ff]">0.35 mm</span>
                </div>
                <p className="text-[8px] text-[#8b949e]">
                  Two-phase deionized water cooling with vacuum-sealed sintered wicks.
                </p>
              </div>
            </div>
          </div>

          {/* Authentic Blueprint Title Block (Bottom-Right corner) */}
          <div className="absolute bottom-3 right-4 w-[420px] bg-[#040c16] border border-[#00e5ff] rounded p-2.5 font-mono text-[9px] text-[#00e5ff] shadow-lg">
            <div className="flex justify-between border-b border-[#00e5ff]/30 pb-1 font-bold">
              <span>3D LAB SYSTEM HARDWARE BLUEPRINT</span>
              <span>DWG NO: 3DLAB-CAD-SP5G-01</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1 text-[8px] border-b border-[#00e5ff]/20">
              <div>
                <span className="text-[#64748b] block">DRAWN BY:</span>
                <span className="text-white">Antigravity CAD</span>
              </div>
              <div>
                <span className="text-[#64748b] block">SCALE:</span>
                <span className="text-white">1:1 Metric</span>
              </div>
              <div>
                <span className="text-[#64748b] block">DATE:</span>
                <span className="text-white">2026-11-05</span>
              </div>
            </div>
            <div className="flex justify-between pt-1 text-[8px]">
              <span className="text-[#64748b]">TOLERANCE: +/- 0.05 mm</span>
              <span className="text-emerald-400 font-bold">STATUS: PRODUCTION VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
