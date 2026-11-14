'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useCircuitStore } from '@/lib/circuit/circuit-store';
import { useWorkspaceStore } from '@/lib/store';
import { Breadboard3D } from './breadboard-3d';
import { CircuitComponent3D } from './circuit-component-3d';
import { CircuitWire3D } from './circuit-wire-3d';
import { DraftingWire3D } from './drafting-wire-3d';
import { CircuitMultimeterProbes3D } from './circuit-multimeter-probes-3d';
import { VirtualMultimeterView } from './virtual-multimeter-view';
import { VirtualOscilloscopeView } from './virtual-oscilloscope-view';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Trash2,
  Undo2,
  Redo2,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  AlertTriangle,
  Zap,
  Sliders,
  MousePointer,
  Cable,
} from 'lucide-react';
import { WireColor } from '@/lib/circuit/types';
import { cn } from '@/lib/utils';

export function CircuitWorkspaceView() {
  const {
    mode,
    setMode,
    activeTool,
    setActiveTool,
    activeWireColor,
    setActiveWireColor,
    components,
    wires,
    selectedId,
    selectedType,
    rotateComponent,
    removeComponent,
    removeWire,
    updateComponentParameters,
    undo,
    redo,
    undoStack,
    redoStack,
    isSimRunning,
    toggleSimulation,
    solvedState,
  } = useCircuitStore();

  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  const [showDmm, setShowDmm] = useState(true);
  const [showScope, setShowScope] = useState(false);

  // Keyboard shortcuts: R for rotate, Delete/Backspace for delete, Ctrl+Z for undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'r' || e.key === 'R') {
        if (selectedId && selectedType === 'component') {
          rotateComponent(selectedId, 90);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && selectedType === 'component') {
          removeComponent(selectedId);
        } else if (selectedId && selectedType === 'wire') {
          removeWire(selectedId);
        }
      } else if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
        undo();
      } else if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) {
        redo();
      } else if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select');
      } else if (e.key === 'w' || e.key === 'W') {
        setActiveTool('wire');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedType, rotateComponent, removeComponent, removeWire, undo, redo, setActiveTool]);

  const selectedElement = components.find((c) => c.id === selectedId);

  const wireColors: Array<{ color: WireColor; name: string }> = [
    { color: '#ef4444', name: 'Red (+VCC)' },
    { color: '#0f172a', name: 'Black (GND)' },
    { color: '#3b82f6', name: 'Blue (Signal)' },
    { color: '#10b981', name: 'Green (Earth)' },
    { color: '#eab308', name: 'Yellow (Trigger)' },
    { color: '#f8fafc', name: 'White (Clock)' },
  ];

  return (
    <div
      className={cn(
        'flex-1 w-full h-full flex overflow-hidden select-none font-mono transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#090B0E] text-slate-100'
      )}
    >
      {/* CENTER 3D WORKSPACE VIEWPORT */}
      <div className="flex-1 h-full relative flex flex-col overflow-hidden">
        {/* TOP WORKSPACE TOOLBAR */}
        <div
          className={cn(
            'h-11 px-3 backdrop-blur-md border-b flex items-center justify-between shrink-0 z-20 transition-colors',
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
              : 'bg-[#101318]/90 border-[#21262D]'
          )}
        >
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            {/* Mode: Breadboard vs Open 3D */}
            <div
              className={cn(
                'flex items-center gap-1 p-0.5 rounded-lg border transition-colors',
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#161B22] border-[#21262D]'
              )}
            >
              <button
                type="button"
                onClick={() => setMode('breadboard')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-semibold transition-colors',
                  mode === 'breadboard'
                    ? isLight
                      ? 'bg-white text-cyan-700 shadow-sm border border-slate-200'
                      : 'bg-[#21262D] text-cyan-400 shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                )}
              >
                Virtual Breadboard
              </button>
              <button
                type="button"
                onClick={() => setMode('open_3d')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-semibold transition-colors',
                  mode === 'open_3d'
                    ? isLight
                      ? 'bg-white text-cyan-700 shadow-sm border border-slate-200'
                      : 'bg-[#21262D] text-cyan-400 shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                )}
              >
                Open 3D Circuit
              </button>
            </div>
          </div>

          {/* Tools & Wiring Colors */}
          <div className="flex items-center gap-1.5">
            {/* Select Tool */}
            <button
              type="button"
              onClick={() => setActiveTool('select')}
              className={cn(
                'p-1.5 rounded text-xs transition-colors border cursor-pointer',
                activeTool === 'select'
                  ? isLight
                    ? 'bg-cyan-100 text-cyan-800 border-cyan-400 font-bold'
                    : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                  : 'bg-[#161B22] text-[#8B949E] border-[#21262D] hover:text-[#F0F6FC]'
              )}
              title="Select / Move Tool (V)"
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>

            {/* Wire Tool */}
            <button
              type="button"
              onClick={() => setActiveTool('wire')}
              className={cn(
                'p-1.5 rounded text-xs transition-colors border cursor-pointer',
                activeTool === 'wire'
                  ? isLight
                    ? 'bg-cyan-100 text-cyan-800 border-cyan-400 font-bold'
                    : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                  : 'bg-[#161B22] text-[#8B949E] border-[#21262D] hover:text-[#F0F6FC]'
              )}
              title="Interactive Wire Tool (W)"
            >
              <Cable className="w-3.5 h-3.5" />
            </button>

            {/* Wire Color Palette */}
            <div
              className={cn(
                'flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-lg border transition-colors',
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#161B22] border-[#21262D]'
              )}
            >
              {wireColors.map((wc) => (
                <button
                  key={wc.color}
                  type="button"
                  onClick={() => setActiveWireColor(wc.color)}
                  className={cn(
                    'w-3.5 h-3.5 rounded-full transition-transform',
                    activeWireColor === wc.color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  )}
                  style={{ backgroundColor: wc.color }}
                  title={wc.name}
                />
              ))}
            </div>

            <div className="w-px h-4 bg-[#21262D]" />

            {/* Component Rotation */}
            {selectedId && selectedType === 'component' && (
              <button
                type="button"
                onClick={() => rotateComponent(selectedId, 90)}
                className="px-2 py-1 rounded bg-[#161B22] border border-[#21262D] text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] text-xs flex items-center gap-1"
                title="Rotate Component 90° (R)"
              >
                <RotateCw className="w-3 h-3 text-cyan-400" />
                <span>Rotate</span>
              </button>
            )}

            {/* Delete Selected */}
            {selectedId && (
              <button
                type="button"
                onClick={() => {
                  if (selectedType === 'component') removeComponent(selectedId);
                  else if (selectedType === 'wire') removeWire(selectedId);
                }}
                className="p-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                title="Delete Selected (Del)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Undo / Redo */}
            <button
              type="button"
              disabled={undoStack.length === 0}
              onClick={undo}
              className="p-1.5 rounded text-[#8B949E] hover:text-[#F0F6FC] disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={redoStack.length === 0}
              onClick={redo}
              className="p-1.5 rounded text-[#8B949E] hover:text-[#F0F6FC] disabled:opacity-30"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Simulation Status & Virtual Instruments */}
          <div className="flex items-center gap-2">
            {/* Short circuit / fault warning badge */}
            {solvedState.diagnostics.hasShortCircuit ? (
              <Badge variant="critical" size="xs">
                SHORT CIRCUIT DETECTED
              </Badge>
            ) : (
              <Badge variant="nominal" size="xs">
                POWER: {(solvedState.diagnostics.totalPowerWatts * 1000).toFixed(0)} mW
              </Badge>
            )}

            {/* Simulation Play / Pause */}
            <button
              type="button"
              onClick={toggleSimulation}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-bold border flex items-center gap-1 transition-colors',
                isSimRunning
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              )}
            >
              {isSimRunning ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-amber-400" />}
              <span>{isSimRunning ? 'RUN' : 'PAUSED'}</span>
            </button>

            {/* Virtual Instruments Toggles */}
            <Button
              variant={showDmm ? 'primary' : 'secondary'}
              size="xs"
              leftIcon={<Gauge className="w-3 h-3" />}
              onClick={() => setShowDmm(!showDmm)}
            >
              Multimeter
            </Button>
            <Button
              variant={showScope ? 'primary' : 'secondary'}
              size="xs"
              leftIcon={<Activity className="w-3 h-3" />}
              onClick={() => setShowScope(!showScope)}
            >
              Oscilloscope
            </Button>
          </div>
        </div>

        {/* 3D WEBGL CANVAS */}
        <div className="flex-1 w-full h-full relative">
          <Canvas
            shadows
            camera={{ position: [0, 45, 60], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[20, 40, 20]} intensity={1.5} castShadow />
              <pointLight position={[-20, 30, -20]} intensity={0.6} />

              <OrbitControls
                makeDefault
                target={[0, 0, 0]}
                maxPolarAngle={Math.PI / 2 - 0.05}
                minDistance={15}
                maxDistance={180}
              />

              {/* Engineering Worktable Surface */}
              <mesh receiveShadow position={[0, -5.0, 0]}>
                <boxGeometry args={[300, 2, 200]} />
                <meshStandardMaterial color={isLight ? '#cbd5e1' : '#0b0f17'} roughness={0.8} />
              </mesh>
              <gridHelper
                args={[200, 40, isLight ? '#94a3b8' : '#1e293b', isLight ? '#cbd5e1' : '#0f172a']}
                position={[0, -3.9, 0]}
              />

              {/* Breadboard 3D Model (when in breadboard mode) */}
              {mode === 'breadboard' && <Breadboard3D />}

              {/* Placed Circuit Component Instances */}
              {components.map((comp) => (
                <CircuitComponent3D key={comp.id} element={comp} />
              ))}

              {/* Physical Connecting 3D Wires */}
              {wires.map((wire) => (
                <CircuitWire3D key={wire.id} wire={wire} />
              ))}

              {/* Live Drafting Wire (follows cursor) */}
              <DraftingWire3D />

              {/* Physical 3D Multimeter Contact Probes */}
              <CircuitMultimeterProbes3D />
            </Suspense>
          </Canvas>

          {/* FLOATING VIRTUAL MULTIMETER BENCH TOOL */}
          {showDmm && (
            <div className="absolute bottom-4 left-4 z-20">
              <VirtualMultimeterView />
            </div>
          )}

          {/* FLOATING VIRTUAL OSCILLOSCOPE BENCH TOOL */}
          {showScope && (
            <div className="absolute bottom-4 right-4 z-20">
              <VirtualOscilloscopeView />
            </div>
          )}

          {/* SELECTED COMPONENT PARAMETER EDIT POPUP */}
          {selectedElement && selectedType === 'component' && (
            <div className="absolute top-14 right-4 z-20 w-72 bg-[#161B22]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#30363D] shadow-2xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#21262D]">
                <span className="font-bold text-[#F0F6FC]">{selectedElement.name}</span>
                <Badge variant="accent" size="xs">
                  {selectedElement.kind.toUpperCase()}
                </Badge>
              </div>

              {/* Parameter Editor Inputs */}
              {selectedElement.kind === 'resistor' && (
                <div className="space-y-1">
                  <span className="text-[#8B949E] text-[10px]">Resistance:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="1000000"
                      value={selectedElement.parameters.resistanceOhms ?? 1000}
                      onChange={(e) =>
                        updateComponentParameters(selectedElement.id, {
                          resistanceOhms: Math.max(1, parseFloat(e.target.value) || 1),
                        })
                      }
                      className="flex-1 bg-[#090B0E] border border-[#21262D] rounded px-2 py-1 text-cyan-400 font-bold"
                    />
                    <span className="text-[#8B949E]">Ω</span>
                  </div>
                </div>
              )}

              {selectedElement.kind === 'dc_source' && (
                <div className="space-y-1">
                  <span className="text-[#8B949E] text-[10px]">Supply Voltage:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0.1"
                      max="48"
                      step="0.5"
                      value={selectedElement.parameters.voltageVolts ?? 9}
                      onChange={(e) =>
                        updateComponentParameters(selectedElement.id, {
                          voltageVolts: Math.max(0.1, parseFloat(e.target.value) || 1),
                        })
                      }
                      className="flex-1 bg-[#090B0E] border border-[#21262D] rounded px-2 py-1 text-cyan-400 font-bold"
                    />
                    <span className="text-[#8B949E]">V</span>
                  </div>
                </div>
              )}

              {selectedElement.kind === 'capacitor' && (
                <div className="space-y-1">
                  <span className="text-[#8B949E] text-[10px]">Capacitance:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0.000001"
                      max="0.01"
                      step="0.00001"
                      value={(selectedElement.parameters.capacitanceFarads ?? 0.0001) * 1e6}
                      onChange={(e) =>
                        updateComponentParameters(selectedElement.id, {
                          capacitanceFarads: (parseFloat(e.target.value) || 10) * 1e-6,
                        })
                      }
                      className="flex-1 bg-[#090B0E] border border-[#21262D] rounded px-2 py-1 text-cyan-400 font-bold"
                    />
                    <span className="text-[#8B949E]">µF</span>
                  </div>
                </div>
              )}

              {/* Live Telemetry for this component */}
              <div className="pt-2 border-t border-[#21262D] grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-[#090B0E] p-1.5 rounded border border-[#21262D]">
                  <span className="text-[#6E7681] block">CURRENT</span>
                  <span className="text-emerald-400 font-bold">
                    {((solvedState.branchCurrents[selectedElement.id] || 0) * 1000).toFixed(2)} mA
                  </span>
                </div>
                <div className="bg-[#090B0E] p-1.5 rounded border border-[#21262D]">
                  <span className="text-[#6E7681] block">POWER</span>
                  <span className="text-amber-400 font-bold">
                    {((solvedState.powerDissipations[selectedElement.id] || 0) * 1000).toFixed(1)} mW
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
