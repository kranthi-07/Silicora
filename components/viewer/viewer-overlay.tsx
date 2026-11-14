'use client';

import React, { useState } from 'react';
import { useWorkspaceStore, CameraPreset } from '@/lib/store';
import { LayerThumbnail } from './layer-thumbnail';
import {
  Layers,
  Scissors,
  RotateCcw,
  Eye,
  EyeOff,
  Compass,
  Sliders,
  Zap,
  Box,
  LayoutGrid,
  Table,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SimulationControlHud } from '@/components/simulation/simulation-control-hud';
import { LayerDetailPopup } from './layer-detail-popup';
import { useSimulation } from '@/lib/simulation/use-simulation';
import { Flame } from 'lucide-react';

export function ViewerOverlay() {
  const [showSimHud, setShowSimHud] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  const {
    selectedComponent,
    cameraPreset,
    setCameraPreset,
    cutawayActive,
    setCutawayActive,
    cutawayOffset,
    setCutawayOffset,
    explodePercent,
    setExplodePercent,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
    toggleLayerVisibility,
    catalogViewMode,
    setCatalogViewMode,
    themeMode,
    xRayMode,
    toggleXRayMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';
  const { outputs, reset, showThermalHeatmap, setShowThermalHeatmap } = useSimulation();

  if (!selectedComponent) return null;

  const presets: Array<{ id: CameraPreset; label: string }> = [
    { id: 'iso', label: 'Iso' },
    { id: 'front', label: 'Front' },
    { id: 'top', label: 'Top' },
    { id: 'side', label: 'Side' },
  ];

  const activeHoveredLayerData = selectedComponent.visual3d.internalLayers.find(
    (l) => l.layerId === hoveredLayer
  );

  return (
    <div className="absolute inset-0 pointer-events-none p-3 sm:p-4 flex flex-col justify-between select-none z-10 overflow-hidden">
      {/* 1. TOP COMMAND BAR */}
      <div className="flex items-center justify-between w-full pointer-events-auto gap-2">
        {/* Left: Compact Component Badge */}
        <div
          className={cn(
            'backdrop-blur-xl px-3 py-1.5 rounded-full border flex items-center gap-2 shrink min-w-0 transition-colors',
            isLight
              ? 'bg-white/95 border-slate-300 shadow-md text-slate-800'
              : 'bg-[#101318]/90 border-[#30363D]/80 shadow-hud text-[#F0F6FC]'
          )}
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full animate-pulse shrink-0',
              isLight ? 'bg-sky-600' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
            )}
          />
          <span
            className={cn(
              'text-xs font-bold truncate tracking-tight max-w-[120px] sm:max-w-[180px]',
              isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
            )}
          >
            {selectedComponent.name}
          </span>
          <span
            className={cn(
              'text-[9px] font-mono px-1.5 py-0.2 rounded-full border shrink-0 font-semibold hidden sm:inline',
              isLight
                ? 'bg-sky-50 text-sky-700 border-sky-300'
                : 'bg-[#161B22] text-cyan-400 border-[#21262D]'
            )}
          >
            {selectedComponent.package.standardCode}
          </span>
        </div>

        {/* Center: Compact View Mode Switcher */}
        <div
          id="tutorial-view-switchers"
          className={cn(
            'inline-flex rounded-full backdrop-blur-xl p-0.5 border shrink-0 transition-colors',
            isLight
              ? 'bg-white/95 border-slate-300 shadow-md text-slate-700'
              : 'bg-[#101318]/90 border-[#30363D]/80 shadow-hud text-[#8B949E]'
          )}
        >
          <button
            type="button"
            onClick={() => setCatalogViewMode('3d')}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1 cursor-pointer',
              catalogViewMode === '3d'
                ? isLight
                  ? 'bg-sky-100 text-sky-900 font-bold border border-sky-300 shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-[#8B949E] hover:text-[#F0F6FC]'
            )}
            title="3D Interactive Stage"
          >
            <Box className="w-3 h-3 text-current" />
            <span className="hidden md:inline">3D Stage</span>
          </button>

          <button
            type="button"
            onClick={() => setCatalogViewMode('grid')}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1 cursor-pointer',
              catalogViewMode === 'grid'
                ? isLight
                  ? 'bg-sky-100 text-sky-900 font-bold border border-sky-300 shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-[#8B949E] hover:text-[#F0F6FC]'
            )}
            title="Catalog Cards Grid"
          >
            <LayoutGrid className="w-3 h-3 text-current" />
            <span className="hidden md:inline">Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => setCatalogViewMode('table')}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1 cursor-pointer',
              catalogViewMode === 'table'
                ? isLight
                  ? 'bg-sky-100 text-sky-900 font-bold border border-sky-300 shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-[#8B949E] hover:text-[#F0F6FC]'
            )}
            title="Technical Parameter Table"
          >
            <Table className="w-3 h-3 text-current" />
            <span className="hidden md:inline">Table</span>
          </button>
        </div>

        {/* Right: Camera Orientation Capsule & SPICE Sim Toggle */}
        <div
          className={cn(
            'backdrop-blur-xl p-0.5 rounded-full border flex items-center gap-0.5 shrink-0 transition-colors',
            isLight
              ? 'bg-white/95 border-slate-300 shadow-md'
              : 'bg-[#101318]/90 border-[#30363D]/80 shadow-hud'
          )}
        >
          <div
            className={cn(
              'px-1.5 py-0.5 text-[9px] font-mono uppercase flex items-center gap-0.5 border-r mr-0.5',
              isLight
                ? 'text-slate-500 border-slate-300'
                : 'text-[#8B949E] border-[#21262D]/80'
            )}
          >
            <Compass className={cn('w-3 h-3', isLight ? 'text-sky-600' : 'text-cyan-400')} />
            <span className="hidden lg:inline">Cam</span>
          </div>

          {presets.map((p) => {
            const isActive = cameraPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setCameraPreset(p.id)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer',
                  isActive
                    ? isLight
                      ? 'bg-sky-100 text-sky-900 font-bold border border-sky-300 shadow-sm'
                      : 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]'
                )}
              >
                {p.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCameraPreset('iso')}
            className={cn(
              'p-1 rounded-full transition-colors cursor-pointer',
              isLight
                ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
            )}
            title="Reset Camera Target"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <div className={cn('w-px h-3.5 mx-0.5', isLight ? 'bg-slate-300' : 'bg-[#21262D]')} />

          {/* Sim Engine HUD Toggle */}
          <button
            id="tutorial-sim-toggle"
            type="button"
            onClick={() => setShowSimHud(!showSimHud)}
            className={cn(
              'px-2 py-0.5 rounded-full text-[11px] font-mono transition-all flex items-center gap-1 border cursor-pointer',
              showSimHud
                ? isLight
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold shadow-sm'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                : isLight
                ? 'bg-transparent text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                : 'bg-transparent text-[#8B949E] border-transparent hover:text-[#F0F6FC] hover:bg-[#161B22]'
            )}
            title="Toggle Live SPICE Simulation HUD"
          >
            <Zap className="w-2.5 h-2.5 text-current" />
            <span className="hidden sm:inline">Sim</span>
          </button>

          {/* X-Ray / Glass Package Mode Toggle */}
          <button
            type="button"
            onClick={toggleXRayMode}
            className={cn(
              'px-2 py-0.5 rounded-full text-[11px] font-mono transition-all flex items-center gap-1 border cursor-pointer',
              xRayMode
                ? isLight
                  ? 'bg-purple-100 text-purple-800 border-purple-400 font-bold shadow-sm'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold shadow-sm'
                : isLight
                ? 'bg-transparent text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                : 'bg-transparent text-[#8B949E] border-transparent hover:text-[#F0F6FC] hover:bg-[#161B22]'
            )}
            title="Toggle X-Ray Frosted Glass Package"
          >
            <Sparkles className="w-2.5 h-2.5 text-current" />
            <span className="hidden sm:inline">X-Ray</span>
          </button>

          {/* Thermal IR Heatmap Toggle */}
          <button
            type="button"
            onClick={() => setShowThermalHeatmap(!showThermalHeatmap)}
            className={cn(
              'px-2 py-0.5 rounded-full text-[11px] font-mono transition-all flex items-center gap-1 border cursor-pointer',
              showThermalHeatmap
                ? isLight
                  ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-sm'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold shadow-sm'
                : isLight
                ? 'bg-transparent text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                : 'bg-transparent text-[#8B949E] border-transparent hover:text-[#F0F6FC] hover:bg-[#161B22]'
            )}
            title={`Thermal IR Heatmap (${outputs.thermal.junctionTempC.toFixed(1)}°C)`}
          >
            <Flame className="w-2.5 h-2.5 text-current" />
            <span className="hidden sm:inline">
              {showThermalHeatmap ? `${outputs.thermal.junctionTempC.toFixed(0)}°C` : 'Thermal'}
            </span>
          </button>
        </div>
      </div>

      {/* Burnout / Overstress Alarm Banner */}
      {outputs.limits.burnoutTriggered && (
        <div className="pointer-events-auto self-center mt-2 animate-bounce z-30">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-red-600/95 text-white border border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.7)] text-xs font-mono">
            <Flame className="w-4 h-4 animate-pulse text-amber-300" />
            <span className="font-bold">COMPONENT BURNOUT: MAXIMUM RATINGS EXCEEDED</span>
            <button
              type="button"
              onClick={() => reset()}
              className="ml-2 px-2.5 py-1 rounded bg-white text-red-600 hover:bg-slate-100 font-bold text-[10px] uppercase shadow cursor-pointer transition-colors"
            >
              Cool Down / Reset
            </button>
          </div>
        </div>
      )}

      {/* Floating Simulation Control HUD */}
      {showSimHud && (
        <div className="pointer-events-auto self-start mt-2">
          <SimulationControlHud />
        </div>
      )}

      {/* Floating Layer Details Pop-up (Triggers on layer click) */}
      <LayerDetailPopup />

      {/* 2. BOTTOM MASTER DOCK: Visual Layer Cards & Cutaway Slider */}
      <div
        id="tutorial-bottom-dock"
        className="pointer-events-auto flex flex-col items-center gap-1.5 w-full"
      >
        {/* Hovered Layer Tooltip Callout */}
        {activeHoveredLayerData && (
          <div
            className={cn(
              'px-3 py-1 rounded-full backdrop-blur-md border text-xs font-mono shadow-lg flex items-center gap-2 animate-fadeIn transition-colors',
              isLight
                ? 'bg-white/95 border-sky-400 text-slate-800'
                : 'bg-[#161B22]/95 border-cyan-500/40 text-[#F0F6FC]'
            )}
          >
            <span
              className={cn('w-2 h-2 rounded-full', isLight ? 'bg-sky-600' : 'bg-cyan-400')}
            />
            <span
              className={cn(
                'font-bold',
                isLight ? 'text-sky-700' : 'text-cyan-300'
              )}
            >
              {activeHoveredLayerData.displayName}
            </span>
            <span className={isLight ? 'text-slate-500 text-[10px]' : 'text-[#8B949E] text-[10px]'}>
              ({activeHoveredLayerData.materialType.replace('_', ' ')})
            </span>
          </div>
        )}

        <div
          className={cn(
            'backdrop-blur-2xl p-1.5 rounded-2xl border flex flex-wrap items-center justify-center gap-2.5 max-w-full transition-colors',
            isLight
              ? 'bg-white/95 border-slate-300 shadow-xl text-slate-800'
              : 'bg-[#101318]/90 border-[#30363D]/80 shadow-2xl text-white'
          )}
        >
          {/* SECTION A: Visual Image Thumbnails for Internal Layers */}
          <div className="flex items-center gap-1.5 px-1.5">
            <span
              className={cn(
                'text-[9px] font-mono font-bold uppercase flex items-center gap-1 mr-0.5',
                isLight ? 'text-slate-500' : 'text-[#8B949E]'
              )}
            >
              <Layers className={cn('w-3 h-3', isLight ? 'text-sky-600' : 'text-cyan-400')} />
              <span className="hidden sm:inline">Layers</span>
            </span>

            {/* Visual Thumbnail Tiles */}
            <div className="flex items-center gap-1">
              {selectedComponent.visual3d.internalLayers.map((layer, index) => {
                const isVisible = layerVisibility[layer.layerId] !== false;
                const isSelected = selectedLayerId === layer.layerId;
                const layerColor =
                  layer.materialType === 'copper_leadframe'
                    ? '#F59E0B'
                    : layer.materialType === 'gold_wirebond'
                    ? '#FBBF24'
                    : layer.materialType === 'silicon_die'
                    ? '#38BDF8'
                    : layer.materialType === 'ceramic'
                    ? '#CBD5E1'
                    : '#64748B';

                return (
                  <div
                    key={layer.layerId}
                    onMouseEnter={() => setHoveredLayer(layer.layerId)}
                    onMouseLeave={() => setHoveredLayer(null)}
                    onClick={() => setSelectedLayerId(isSelected ? null : layer.layerId)}
                    className={cn(
                      'relative group w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all border p-1',
                      isSelected
                        ? isLight
                          ? 'bg-sky-100 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.35)] scale-105'
                          : 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] scale-105'
                        : isVisible
                        ? isLight
                          ? 'bg-slate-100 border-slate-300 hover:border-sky-400 hover:bg-slate-200'
                          : 'bg-[#161B22] border-[#30363D] hover:border-cyan-500/50 hover:bg-[#21262D]'
                        : isLight
                        ? 'bg-slate-200/60 border-slate-300 opacity-40 grayscale'
                        : 'bg-[#0D1117]/80 border-[#21262D] opacity-40 grayscale'
                    )}
                    title={`${layer.displayName} (${layer.materialType.replace('_', ' ')})`}
                  >
                    {/* Visual Vector Image of the Layer */}
                    <LayerThumbnail
                      layerId={layer.layerId}
                      materialType={layer.materialType}
                      colorHex={layerColor}
                      className="w-full h-full"
                    />

                    {/* Miniature Layer Sequence Badge */}
                    <span
                      className={cn(
                        'absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full border text-[8px] font-mono flex items-center justify-center font-bold',
                        isLight
                          ? 'bg-white border-slate-300 text-slate-600'
                          : 'bg-[#101318] border-[#30363D] text-[#8B949E]'
                      )}
                    >
                      {index + 1}
                    </span>

                    {/* Eye toggle button on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(layer.layerId);
                      }}
                      className={cn(
                        'absolute -bottom-1 -right-1 p-0.5 rounded-full border transition-colors',
                        isLight
                          ? 'bg-white border-slate-300 text-slate-500 hover:text-sky-600'
                          : 'bg-[#101318] border-[#30363D] text-[#8B949E] hover:text-cyan-400'
                      )}
                      title={isVisible ? 'Hide layer' : 'Show layer'}
                    >
                      {isVisible ? (
                        <Eye
                          className={cn('w-2.5 h-2.5', isLight ? 'text-sky-600' : 'text-cyan-400')}
                        />
                      ) : (
                        <EyeOff className="w-2.5 h-2.5 text-red-500" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={cn('w-px h-5 hidden sm:block', isLight ? 'bg-slate-300' : 'bg-[#21262D]')}
          />

          {/* SECTION B: 3D Cutaway Separation Slider */}
          <div
            className={cn(
              'flex items-center gap-2 px-2.5 py-1 rounded-xl border transition-colors',
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0D1117] border-[#21262D]'
            )}
          >
            <button
              type="button"
              onClick={() => {
                if (cutawayActive && cutawayOffset > 0) {
                  setCutawayActive(false);
                  setCutawayOffset(0);
                } else {
                  setCutawayActive(true);
                  setCutawayOffset(cutawayOffset <= 0 ? 3.5 : cutawayOffset);
                }
              }}
              className={cn(
                'px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 border cursor-pointer',
                cutawayActive && cutawayOffset > 0
                  ? isLight
                    ? 'bg-sky-100 text-sky-800 border-sky-300 shadow-sm'
                    : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-glowCyan'
                  : isLight
                  ? 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                  : 'bg-[#161B22] text-[#8B949E] border-[#30363D] hover:text-[#F0F6FC]'
              )}
              title="Toggle Physical Casing Cutaway"
            >
              <Scissors className="w-3 h-3" />
              <span>CUTAWAY</span>
            </button>

            <div className="flex items-center gap-1.5">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={Math.max(0, cutawayOffset)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCutawayOffset(val);
                  setCutawayActive(val > 0);
                }}
                className={cn(
                  'w-16 sm:w-20 h-1.5 rounded-lg appearance-none cursor-pointer',
                  isLight ? 'bg-slate-300 accent-sky-600' : 'bg-[#21262D] accent-cyan-400'
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-mono font-bold min-w-[32px]',
                  isLight ? 'text-sky-700' : 'text-cyan-400'
                )}
              >
                {Math.max(0, cutawayOffset)}mm
              </span>
            </div>
          </div>

          <div
            className={cn('w-px h-5 hidden md:block', isLight ? 'bg-slate-300' : 'bg-[#21262D]')}
          />

          {/* SECTION C: Exploded View Slider */}
          <div
            className={cn(
              'hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-colors',
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0D1117] border-[#21262D]'
            )}
          >
            <span
              className={cn(
                'text-[9px] font-mono flex items-center gap-1',
                isLight ? 'text-slate-500' : 'text-[#8B949E]'
              )}
            >
              <Sliders className={cn('w-2.5 h-2.5', isLight ? 'text-blue-600' : 'text-[#58A6FF]')} />
              EXPLODE:
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={explodePercent}
              onChange={(e) => setExplodePercent(Number(e.target.value))}
              className={cn(
                'w-14 lg:w-16 h-1.5 rounded-lg appearance-none cursor-pointer',
                isLight ? 'bg-slate-300 accent-blue-600' : 'bg-[#21262D] accent-[#58A6FF]'
              )}
            />
            <span
              className={cn(
                'text-[10px] font-mono font-bold min-w-[28px]',
                isLight ? 'text-blue-700' : 'text-[#58A6FF]'
              )}
            >
              {explodePercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
