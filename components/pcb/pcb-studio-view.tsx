'use client';

import React, { useState, useMemo } from 'react';
import {
  PcbProject,
  PcbLayerId,
  PcbPlacedComponent,
  PcbTrack,
  SoldermaskColor,
  SurfaceFinish,
  PcbDrcResult,
} from '@/types/pcb';
import { CIRCUIT_PRESETS } from '@/lib/circuit/circuit-presets';
import { usePcbStore } from '@/lib/pcb/pcb-store';
import { useWorkspaceStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Pcb2DCanvas } from './pcb-2d-canvas';
import { Pcb3DCanvas } from './pcb-3d-canvas';
import { PcbDrcDialog } from './pcb-drc-dialog';
import { PcbExportDialog } from './pcb-export-dialog';
import {
  Layers,
  Box,
  Sliders,
  Download,
  RotateCw,
  Palette,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export function PcbStudioView() {
  const {
    project,
    viewMode,
    setViewMode,
    activeLayer,
    visibleLayers,
    selectedComponentId,
    setSelectedComponentId,
    selectedNetId,
    setSelectedNetId,
    selectedPresetId,
    loadPresetPcb,
    rotateComponent,
    updateComponentPosition,
    addTrack,
    deleteTrack,
    drcResult,
    drcDialogOpen,
    setDrcDialogOpen,
    exportDialogOpen,
    setExportDialogOpen,
    runDrc,
    updateSoldermask,
  } = usePcbStore();

  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  // Local 3D preview toggles
  const [explodeStackPercent, setExplodeStackPercent] = useState<number>(0);
  const [show3DComponents, setShow3DComponents] = useState<boolean>(true);

  const selectedComponent = useMemo(
    () => project.placedComponents.find((c) => c.id === selectedComponentId),
    [project.placedComponents, selectedComponentId]
  );

  return (
    <div
      className={cn(
        'flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden font-sans transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-slate-950 text-slate-100'
      )}
    >
      {/* Top Studio Toolbar */}
      <header
        className={cn(
          'h-12 border-b px-4 flex items-center justify-between shrink-0 gap-3 transition-colors',
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
            : 'border-slate-800 bg-slate-900/90'
        )}
      >
        {/* Left: Circuit Preset Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Schematic:</span>
          </div>
          <select
            value={selectedPresetId}
            onChange={(e) => loadPresetPcb(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {CIRCUIT_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.title}
              </option>
            ))}
          </select>
        </div>

        {/* Center: 2D / 3D Mode Switcher */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              viewMode === '2d'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2D Layout
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              viewMode === '3d'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            3D Preview
          </button>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* 3D Stack Exploded View Slider (in 3D mode) */}
          {viewMode === '3d' && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 text-xs">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Stackup Explode:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={explodeStackPercent}
                onChange={(e) => setExplodeStackPercent(Number(e.target.value))}
                className="w-20 accent-sky-500 cursor-pointer"
              />
              <span className="font-mono text-slate-300 w-8">{explodeStackPercent}%</span>
            </div>
          )}

          {/* Soldermask Color Selector */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            {(['green', 'black', 'blue', 'purple', 'red', 'white'] as SoldermaskColor[]).map((c) => (
              <button
                key={c}
                onClick={() => updateSoldermask(c)}
                title={`Soldermask: ${c}`}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  c === 'green'
                    ? 'bg-emerald-700'
                    : c === 'black'
                    ? 'bg-zinc-900'
                    : c === 'blue'
                    ? 'bg-blue-600'
                    : c === 'purple'
                    ? 'bg-purple-600'
                    : c === 'red'
                    ? 'bg-rose-700'
                    : 'bg-slate-100'
                } ${project.soldermaskColor === c ? 'scale-125 border-white ring-1 ring-white/30' : 'border-transparent'}`}
              />
            ))}
          </div>

          {/* DRC Button */}
          <button
            onClick={runDrc}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">DRC Check</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => setExportDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CAD</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body: Single Canvas + Right Inspector (Sidebar unified into Catalog) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center: Canvas Viewport (2D or 3D) */}
        <main className="flex-1 relative overflow-hidden bg-slate-950">
          {viewMode === '2d' ? (
            <Pcb2DCanvas
              project={project}
              activeLayer={activeLayer}
              selectedComponentId={selectedComponentId}
              selectedNetId={selectedNetId}
              visibleLayers={visibleLayers}
              onSelectComponent={setSelectedComponentId}
              onSelectNet={setSelectedNetId}
              onUpdateComponentPosition={updateComponentPosition}
              onRotateComponent={rotateComponent}
              onAddTrack={addTrack}
              onDeleteTrack={deleteTrack}
            />
          ) : (
            <Pcb3DCanvas
              project={project}
              explodeStackPercent={explodeStackPercent}
              showComponents={show3DComponents}
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
            />
          )}
        </main>

        {/* Right Inspector Panel */}
        <aside
          className={cn(
            'w-72 border-l p-4 shrink-0 overflow-y-auto transition-colors',
            isLight
              ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
              : 'border-slate-800 bg-slate-900/60 text-slate-100'
          )}
        >
          {selectedComponent ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-sky-300">
                  {selectedComponent.designator}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {selectedComponent.side.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Value</span>
                <p className="text-slate-200 font-sans font-medium">{selectedComponent.value}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Footprint</span>
                <p className="text-slate-200 text-[11px] break-all">{selectedComponent.footprintId}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Position X</span>
                  <p className="text-slate-200 font-bold">{selectedComponent.positionMm[0]} mm</p>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Position Y</span>
                  <p className="text-slate-200 font-bold">{selectedComponent.positionMm[1]} mm</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Rotation</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-bold">{selectedComponent.rotationDeg}°</span>
                  <button
                    onClick={() => rotateComponent(selectedComponent.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                  >
                    <RotateCw className="w-3 h-3" />
                    +90°
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <span className="text-slate-400 block text-[11px] mb-2">Pad Net Bindings</span>
                <div className="space-y-1">
                  {Object.entries(selectedComponent.padNetMap).map(([padNum, netId]) => {
                    const net = project.nets.find((n) => n.netId === netId);
                    return (
                      <div
                        key={padNum}
                        className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800/80"
                      >
                        <span className="text-slate-400">Pad {padNum}</span>
                        <span className="text-sky-300 font-medium">
                          {net?.name || `Net ${netId}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
                Board Specifications
              </h3>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Dimensions:</span>
                  <span>{project.boardOutline.widthMm} × {project.boardOutline.heightMm} mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Thickness:</span>
                  <span>{project.boardOutline.thicknessMm} mm (FR-4)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Copper Layers:</span>
                  <span>{project.copperLayerCount} Layers (F.Cu, B.Cu)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Soldermask:</span>
                  <span className="capitalize">{project.soldermaskColor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Surface Finish:</span>
                  <span>{project.surfaceFinish}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Total Tracks:</span>
                  <span>{project.tracks.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Total Vias:</span>
                  <span>{project.vias.length}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 text-[11px] font-sans">
                💡 <strong>Tip:</strong> Open the Catalog sidebar (or click Catalog in the topbar) to access Layer Stackup, Components list, and Nets router.
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* DRC Modal Dialog */}
      <PcbDrcDialog
        isOpen={drcDialogOpen}
        result={drcResult}
        onClose={() => setDrcDialogOpen(false)}
        onNavigateToViolation={(pos) => {}}
      />

      {/* Export CAD & Manufacturing Modal Dialog */}
      <PcbExportDialog
        isOpen={exportDialogOpen}
        project={project}
        onClose={() => setExportDialogOpen(false)}
      />
    </div>
  );
}
