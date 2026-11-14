'use client';

import React, { useState } from 'react';
import { DeviceComponentPart } from '@/types/device';
import {
  Image as ImageIcon,
  Cpu,
  Workflow,
  Sparkles,
  Maximize2,
  ExternalLink,
  Layers,
  Zap,
  Radio,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ComponentWorkingBlueprintProps {
  part: DeviceComponentPart;
  onOpenCatalogPart?: (catalogId: string) => void;
}

export function ComponentWorkingBlueprint({
  part,
  onOpenCatalogPart,
}: ComponentWorkingBlueprintProps) {
  const [viewTab, setViewTab] = useState<'photo' | 'die_xray' | 'blueprint'>('photo');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // SVG-based fallback real component rendering if network image cannot load
  const renderFallbackIllustration = () => (
    <div className="w-full h-44 rounded-lg bg-[#0d1117] border border-[#30363d] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blueprint grid */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Procedural Vector IC rendering */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-28 h-28 rounded-md bg-[#161b22] border-2 border-[#58a6ff]/60 shadow-[0_0_20px_rgba(56,189,248,0.2)] flex flex-col items-center justify-center p-2 relative">
          {/* Pin 1 index dot */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#58a6ff] shadow-[0_0_6px_#58a6ff]" />
          
          {/* Laser etched markings */}
          <div className="text-[8px] font-mono text-[#8b949e] uppercase font-bold tracking-widest text-center mt-1">
            {part.packageType}
          </div>
          <div className="text-[11px] font-mono text-[#f0f6fc] font-bold text-center mt-1 truncate max-w-[90px]">
            {part.id.toUpperCase()}
          </div>
          <div className="text-[7px] font-mono text-[#58a6ff] text-center mt-1">
            {part.keySpecs[Object.keys(part.keySpecs)[0]] || 'SILICON DIE'}
          </div>

          {/* Solder ball / pin matrix indicator */}
          <div className="mt-2 grid grid-cols-4 gap-1 opacity-70">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#eab308]" />
            ))}
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#8b949e] mt-2 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-[#58a6ff]" /> Authentic Hardware Silhouette
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#101318] rounded-lg border border-[#21262d]">
        <button
          type="button"
          onClick={() => setViewTab('photo')}
          className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all ${
            viewTab === 'photo'
              ? 'bg-[#21262d] text-[#58a6ff] shadow-sm'
              : 'text-[#8b949e] hover:text-[#f0f6fc]'
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          <span>Real Photo</span>
        </button>

        <button
          type="button"
          onClick={() => setViewTab('die_xray')}
          className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all ${
            viewTab === 'die_xray'
              ? 'bg-[#21262d] text-[#58a6ff] shadow-sm'
              : 'text-[#8b949e] hover:text-[#f0f6fc]'
          }`}
        >
          <Cpu className="w-3 h-3" />
          <span>X-Ray / Die</span>
        </button>

        <button
          type="button"
          onClick={() => setViewTab('blueprint')}
          className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all ${
            viewTab === 'blueprint'
              ? 'bg-[#21262d] text-[#58a6ff] shadow-sm'
              : 'text-[#8b949e] hover:text-[#f0f6fc]'
          }`}
        >
          <Workflow className="w-3 h-3" />
          <span>Working Schema</span>
        </button>
      </div>

      {/* 1. REAL COMPONENT PHOTO TAB */}
      {viewTab === 'photo' && (
        <div className="relative rounded-xl overflow-hidden border border-[#30363d] bg-[#090b0e] group">
          {part.realImageUrl && !imageError ? (
            <div className="relative w-full h-44 bg-black/40 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={part.realImageUrl}
                alt={part.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-[#f0f6fc] bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                <span className="truncate">{part.packageType}</span>
                <span className="text-[#58a6ff] shrink-0">Macro Teardown</span>
              </div>
            </div>
          ) : (
            renderFallbackIllustration()
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 hover:bg-black/90 text-white/80 hover:text-white transition-all shadow-md"
            title="Expand Blueprint & Silicon Die"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. SILICON DIE / X-RAY TAB */}
      {viewTab === 'die_xray' && (
        <div className="relative rounded-xl overflow-hidden border border-[#30363d] bg-[#090b0e] p-3">
          <div className="w-full h-40 rounded-lg bg-[#0d1117] border border-[#21262d] flex flex-col items-center justify-center relative overflow-hidden">
            {part.dieShotUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={part.dieShotUrl}
                alt={`${part.name} Silicon Die Shot`}
                className="w-full h-full object-cover opacity-85"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                <Layers className="w-8 h-8 text-[#58a6ff] mb-2" />
                <span className="text-xs font-mono font-bold text-[#f0f6fc]">
                  Sub-surface Microscopic Die
                </span>
                <span className="text-[10px] text-[#8b949e] mt-1">
                  19 Billion FinFET Gates // Copper Redistribution Layers
                </span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-[#f0f6fc] bg-black/70 backdrop-blur-md px-2 py-1 rounded border border-white/10">
              <span className="text-emerald-400">Nanosheet / BGA Array</span>
              <span className="text-[#8b949e]">Microscopic Cross-Section</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. WORKING SCHEMATIC BLUEPRINT TAB */}
      {viewTab === 'blueprint' && (
        <div className="p-3.5 rounded-xl bg-[#0a192f] border border-[#00e5ff]/30 space-y-2.5 text-[#00e5ff] font-mono">
          <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-1.5 text-[10px]">
            <span className="font-bold flex items-center gap-1">
              <Workflow className="w-3 h-3" />
              CAD TRANSDUCTION BLUEPRINT
            </span>
            <span className="text-[9px] text-[#00e5ff]/70">DWG-{part.id.toUpperCase()}</span>
          </div>

          {/* SVG Functional Flow Diagram */}
          <div className="py-2 flex items-center justify-between gap-1 text-[10px]">
            <div className="flex-1 p-2 rounded bg-[#071324] border border-[#00e5ff]/20 text-center">
              <span className="text-[9px] text-[#64748b] block">INPUT</span>
              <span className="text-[10px] text-[#f0f6fc] font-bold block truncate">
                {part.signalFlow?.input ? 'Signals / VBAT' : 'Electrical Current'}
              </span>
            </div>
            <span className="text-[#00e5ff] font-bold">→</span>
            <div className="flex-1 p-2 rounded bg-[#00e5ff]/10 border border-[#00e5ff]/40 text-center shadow-[0_0_12px_rgba(0,229,255,0.15)]">
              <span className="text-[9px] text-[#00e5ff] block font-bold">CORE ENGINE</span>
              <span className="text-[10px] text-[#f0f6fc] font-bold block truncate">
                {part.name.split(' ')[0]}
              </span>
            </div>
            <span className="text-[#00e5ff] font-bold">→</span>
            <div className="flex-1 p-2 rounded bg-[#071324] border border-[#00e5ff]/20 text-center">
              <span className="text-[9px] text-[#64748b] block">OUTPUT</span>
              <span className="text-[10px] text-emerald-400 font-bold block truncate">
                {part.signalFlow?.output ? 'Physical Action' : 'Function'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Plain-English "How It Works Inside This Device" Section */}
      <div className="p-3 rounded-xl bg-[#161b22] border border-[#21262d] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#f0f6fc]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>How It Works Inside This Device</span>
        </div>
        <p className="text-[11px] text-[#c9d1d9] leading-relaxed">
          {part.howItWorksInsideDevice || part.description}
        </p>

        {/* Signal Flow Breakdown */}
        {part.signalFlow && (
          <div className="pt-2 border-t border-[#21262d] space-y-1.5 font-mono text-[10px]">
            <div className="flex items-start gap-2">
              <span className="text-[#58a6ff] shrink-0 font-bold">IN:</span>
              <span className="text-[#8b949e]">{part.signalFlow.input}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 shrink-0 font-bold">CORE:</span>
              <span className="text-[#8b949e]">{part.signalFlow.processing}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 shrink-0 font-bold">OUT:</span>
              <span className="text-[#8b949e]">{part.signalFlow.output}</span>
            </div>
          </div>
        )}
      </div>

      {/* Scientific Working Principle Card */}
      {part.workingPrinciple && (
        <div className="p-3 rounded-xl bg-[#101318] border border-[#21262d] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8b949e] uppercase font-semibold">
            <Zap className="w-3 h-3 text-[#58a6ff]" />
            <span>Physics & Operating Principle</span>
          </div>
          <p className="text-[11px] text-[#8b949e] leading-relaxed font-sans">
            {part.workingPrinciple}
          </p>
        </div>
      )}

      {/* Fullscreen Blueprint Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 select-none">
          <div className="w-full max-w-3xl bg-[#0a192f] rounded-2xl border-2 border-[#00e5ff]/50 shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#00e5ff]/30 flex items-center justify-between bg-[#071324]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#00e5ff] tracking-widest block">
                  3D LAB SPECIFICATION // PART DWG NO: {part.id.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">{part.name}</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="text-xs font-mono text-[#00e5ff] border-[#00e5ff]/40 hover:bg-[#00e5ff]/20"
              >
                Close Blueprint ✕
              </Button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-[#c9d1d9]">
              {/* High-res Image & CAD Dimensions Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-[#00e5ff]/30 bg-black/50 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={part.realImageUrl || part.dieShotUrl}
                    alt={part.name}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                  <div className="text-[10px] font-mono text-center text-[#00e5ff] mt-2">
                    Verified Physical Micro-Photo (High Resolution)
                  </div>
                </div>

                <div className="rounded-xl border border-[#00e5ff]/30 bg-[#071324] p-4 flex flex-col justify-between font-mono text-xs">
                  <div>
                    <h5 className="text-[#00e5ff] font-bold uppercase tracking-wider mb-2">
                      Mechanical Dimensions & Tolerances
                    </h5>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span className="text-[#8b949e]">Package Type:</span>
                        <span className="text-white font-bold">{part.packageType}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span className="text-[#8b949e]">Width × Height × Depth:</span>
                        <span className="text-white font-bold">
                          {part.dimensionsMm[0]} × {part.dimensionsMm[1]} × {part.dimensionsMm[2]} mm
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span className="text-[#8b949e]">Position in Device:</span>
                        <span className="text-[#00e5ff]">
                          [{part.positionMm[0]}, {part.positionMm[1]}, {part.positionMm[2]}] mm
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span className="text-[#8b949e]">CAD Callout Index:</span>
                        <span className="text-amber-400 font-bold">#{part.calloutNumber || 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#00e5ff]/20">
                    <span className="text-[10px] text-[#00e5ff] block mb-1">ELECTRICAL ENVELOPE</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {Object.entries(part.keySpecs).map(([k, v]) => (
                        <div key={k} className="p-1.5 rounded bg-black/40 border border-white/10">
                          <span className="text-[#8b949e] block text-[9px]">{k}</span>
                          <span className="text-white font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Working Mechanics Description */}
              <div className="p-4 rounded-xl bg-[#071324] border border-[#00e5ff]/20 space-y-2">
                <h5 className="text-sm font-bold text-[#00e5ff] flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Engineering Working Mechanics in Action
                </h5>
                <p className="text-xs text-[#c9d1d9] leading-relaxed">
                  {part.howItWorksInsideDevice}
                </p>
                {part.workingPrinciple && (
                  <p className="text-xs text-[#8b949e] leading-relaxed pt-2 border-t border-white/10">
                    <strong className="text-white">Physical Operating Law: </strong>
                    {part.workingPrinciple}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
