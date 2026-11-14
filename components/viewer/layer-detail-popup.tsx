'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { useSimulation } from '@/lib/simulation/use-simulation';
import {
  Layers,
  X,
  Sparkles,
  Zap,
  Flame,
  Info,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function LayerDetailPopup() {
  const {
    selectedComponent,
    selectedLayerId,
    setSelectedLayerId,
    isSimRunning,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';
  const { outputs } = useSimulation();

  if (!selectedComponent || !selectedLayerId) return null;

  const layer = selectedComponent.visual3d.internalLayers.find(
    (l) => l.layerId === selectedLayerId
  );

  if (!layer) return null;

  const layerIndex = selectedComponent.visual3d.internalLayers.findIndex(
    (l) => l.layerId === selectedLayerId
  );
  const totalLayers = selectedComponent.visual3d.internalLayers.length;

  const formatMaterial = (mat: string) => {
    switch (mat) {
      case 'copper_leadframe':
        return 'Copper / Nickel Leadframe';
      case 'gold_wirebond':
        return 'Pure Gold Bondwire (25 µm)';
      case 'silicon_die':
        return 'Monocrystalline Silicon Die';
      case 'ceramic':
        return 'Alumina Ceramic Core (Al₂O₃)';
      case 'plastic_mold':
        return 'Conformal Protective Epoxy';
      case 'ferrite':
        return 'Sintered MnZn Ferrite';
      default:
        return mat.replace(/_/g, ' ');
    }
  };

  const getLayerRoleDescription = (layerId: string) => {
    switch (layerId) {
      case 'spiral':
      case 'carbon_track':
        return 'The primary conductive/resistive element. Microscopic laser spiral grooves define the exact electrical resistance and guide electron drift path across the core.';
      case 'core':
      case 'ceramic_base':
        return 'Provides mechanical rigidity and high dielectric insulation, absorbing internal Joule heat without expanding or conducting stray currents.';
      case 'caps':
      case 'terminals':
      case 'leads':
        return 'Precision tinned metal terminals that provide low-resistance electrical interface to external PCB traces or solder joints.';
      case 'lacquer':
      case 'housing':
      case 'pvc_sleeve':
      case 'epoxy_mold':
        return 'Hermetically seals the internal active elements against atmospheric moisture, oxidation, and mechanical friction, maintaining dielectric stability.';
      case 'die':
        return 'Semiconductor micro-junction containing active P-N or gate structures where electronic carrier injection, depletion, or switching takes place.';
      case 'wirebonds':
        return 'Microscopic ultrasonic bonds providing high-speed electrical links between external leadframe pins and the delicate semiconductor die pads.';
      case 'winding':
      case 'enamelled_winding':
        return 'High-purity insulated magnet wire coils that generate concentrated magnetic flux linkages and store inductive energy.';
      case 'can':
        return 'Impact-resistant aluminum enclosure engineered with safety pressure vents to dissipate internal thermal expansion safely.';
      default:
        return 'Essential structural and electrical sub-surface layer responsible for physical stability and operating reliability.';
    }
  };

  return (
    <div className="absolute top-16 left-4 sm:left-6 z-30 pointer-events-auto w-80 sm:w-88 max-w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={cn(
          'backdrop-blur-2xl rounded-2xl border p-3.5 text-xs font-sans relative overflow-hidden transition-colors',
          isLight
            ? 'bg-white/95 border-slate-300 shadow-[0_16px_40px_rgba(0,0,0,0.15)] text-slate-800'
            : 'bg-[#101318]/95 border-cyan-500/40 shadow-[0_16px_50px_rgba(0,0,0,0.85)] text-[#F0F6FC]'
        )}
      >
        {/* Glow Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-[#F06543]" />

        {/* Header Row */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'p-1.5 rounded-xl border shrink-0',
                isLight
                  ? 'bg-sky-50 text-sky-700 border-sky-300'
                  : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.25)]'
              )}
            >
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'text-[9px] font-mono px-1.5 py-0.2 rounded-full border font-bold',
                    isLight
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                  )}
                >
                  LAYER {layerIndex + 1} OF {totalLayers}
                </span>
                <span
                  className={cn(
                    'text-[9px] font-mono',
                    isLight ? 'text-slate-400' : 'text-[#8B949E]'
                  )}
                >
                  {selectedComponent.package.standardCode}
                </span>
              </div>
              <h4
                className={cn(
                  'text-xs font-bold tracking-tight mt-0.5 truncate max-w-[190px]',
                  isLight ? 'text-slate-900' : 'text-white'
                )}
              >
                {layer.displayName}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedLayerId(null)}
            className={cn(
              'p-1 rounded-lg transition-colors cursor-pointer',
              isLight
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                : 'text-[#8B949E] hover:text-white hover:bg-white/[0.08]'
            )}
            title="Deselect Layer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Material & Function Specifications */}
        <div className="mt-2.5 space-y-1.5 text-[11px] font-mono">
          <div
            className={cn(
              'p-2 rounded-xl border flex items-center justify-between',
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/80 border-white/[0.06]'
            )}
          >
            <span
              className={cn(
                'text-[9px] uppercase font-bold',
                isLight ? 'text-slate-500' : 'text-[#8B949E]'
              )}
            >
              MATERIAL
            </span>
            <span
              className={cn(
                'font-semibold truncate ml-2 text-right',
                isLight ? 'text-sky-700' : 'text-cyan-300'
              )}
            >
              {formatMaterial(layer.materialType)}
            </span>
          </div>

          <div
            className={cn(
              'p-2 rounded-xl border flex items-center justify-between',
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/80 border-white/[0.06]'
            )}
          >
            <span
              className={cn(
                'text-[9px] uppercase font-bold',
                isLight ? 'text-slate-500' : 'text-[#8B949E]'
              )}
            >
              SIM STATUS
            </span>
            <div className="flex items-center gap-1.5">
              {isSimRunning ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span
                    className={cn(
                      'font-semibold text-[10px]',
                      isLight ? 'text-emerald-700' : 'text-emerald-300'
                    )}
                  >
                    Active ({outputs.voltageDrop.toFixed(1)}V drop)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span
                    className={cn('text-[10px]', isLight ? 'text-slate-500' : 'text-[#8B949E]')}
                  >
                    Standby (0.00 V)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Educational Physics Role */}
        <div
          className={cn(
            'mt-2 p-2.5 rounded-xl border text-[11px] leading-relaxed',
            isLight
              ? 'bg-slate-100/70 border-slate-200 text-slate-700'
              : 'bg-[#090B0E]/80 border-white/[0.06] text-[#C9D1D9]'
          )}
        >
          <span className="text-amber-600 font-semibold mr-1">Function:</span>
          {getLayerRoleDescription(layer.layerId)}
        </div>

        {/* Footer Actions */}
        <div
          className={cn(
            'mt-2.5 flex items-center justify-between text-[10px] font-mono pt-2 border-t',
            isLight ? 'border-slate-200 text-slate-500' : 'border-white/[0.06] text-[#8B949E]'
          )}
        >
          <span>Click empty space to dismiss</span>
          <button
            type="button"
            onClick={() => setSelectedLayerId(null)}
            className={cn(
              'font-semibold hover:underline cursor-pointer',
              isLight ? 'text-sky-700 hover:text-sky-800' : 'text-cyan-400 hover:text-cyan-300'
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
