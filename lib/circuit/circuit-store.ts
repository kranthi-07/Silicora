'use client';

import { create } from 'zustand';
import {
  CircuitElementInstance,
  WireConnection,
  CircuitWorkspaceMode,
  WireColor,
  MultimeterMode,
  MultimeterProbeState,
  CircuitComponentKind,
  CircuitProject,
} from './types';
import { solveCircuit, SolvedCircuitState } from './circuit-solver';
import { CIRCUIT_PRESETS, CircuitExperimentPreset } from './circuit-presets';
import { WorkbenchAudio } from '@/lib/audio/workbench-sounds';

export type WorkspaceTool = 'select' | 'wire' | 'probe_dmm_red' | 'probe_dmm_black' | 'probe_scope_ch1' | 'probe_scope_ch2' | 'delete';

interface CircuitHistorySnapshot {
  components: CircuitElementInstance[];
  wires: WireConnection[];
}

interface CircuitWorkspaceState {
  // Mode
  mode: CircuitWorkspaceMode;
  setMode: (mode: CircuitWorkspaceMode) => void;

  // Active Breadboard Bus Highlight
  activeHoveredBusId: string | null;
  setActiveHoveredBusId: (busId: string | null) => void;

  // Active Tool & Selection
  activeTool: WorkspaceTool;
  setActiveTool: (tool: WorkspaceTool) => void;
  selectedId: string | null;
  selectedType: 'component' | 'wire' | null;
  setSelected: (id: string | null, type: 'component' | 'wire' | null) => void;

  // Active Wire Color for drawing
  activeWireColor: WireColor;
  setActiveWireColor: (color: WireColor) => void;

  // Interactive Wire Drafting State
  wireDraftStart: {
    componentId: string;
    pinId: string;
    worldPosition: [number, number, number];
  } | null;
  setWireDraftStart: (start: { componentId: string; pinId: string; worldPosition: [number, number, number] } | null) => void;

  // Components & Wires
  components: CircuitElementInstance[];
  wires: WireConnection[];

  // Component Actions
  addComponent: (comp: CircuitElementInstance) => void;
  updateComponentPosition: (id: string, position: [number, number, number]) => void;
  updateComponentParameters: (id: string, params: Record<string, any>) => void;
  rotateComponent: (id: string, stepYDeg?: number) => void;
  removeComponent: (id: string) => void;

  // Wire Actions
  addWire: (fromCompId: string, fromPinId: string, toCompId: string, toPinId: string, color?: WireColor) => void;
  removeWire: (id: string) => void;
  updateWireColor: (id: string, color: WireColor) => void;

  // Simulation State
  isSimRunning: boolean;
  toggleSimulation: () => void;
  solvedState: SolvedCircuitState;
  recomputeCircuit: () => void;

  // Virtual Instruments
  dmm: MultimeterProbeState;
  setDmmMode: (mode: MultimeterMode) => void;
  attachDmmProbe: (probe: 'red' | 'black', componentId?: string, pinId?: string) => void;
  scope: {
    ch1: { componentId?: string; pinId?: string };
    ch2: { componentId?: string; pinId?: string };
    waveformCh1: number[];
    waveformCh2: number[];
  };
  attachScopeProbe: (ch: 'ch1' | 'ch2', componentId?: string, pinId?: string) => void;

  // Presets & Project Persistence
  activePresetId: string | null;
  loadPreset: (presetId: string) => void;
  exportProjectJson: () => string;
  importProjectJson: (json: string) => boolean;

  // Undo / Redo
  undoStack: CircuitHistorySnapshot[];
  redoStack: CircuitHistorySnapshot[];
  undo: () => void;
  redo: () => void;
  pushHistorySnapshot: () => void;
}

// Initial default experiment: Battery and Resistor
const initialPreset = CIRCUIT_PRESETS[0];

export const useCircuitStore = create<CircuitWorkspaceState>((set, get) => {
  const initialComponents = JSON.parse(JSON.stringify(initialPreset.components));
  const initialWires = JSON.parse(JSON.stringify(initialPreset.wires));
  const initialSolved = solveCircuit(initialComponents, initialWires, 'breadboard');

  return {
    mode: 'breadboard',
    setMode: (mode) => {
      set({ mode });
      get().recomputeCircuit();
    },

    activeHoveredBusId: null,
    setActiveHoveredBusId: (activeHoveredBusId) => set({ activeHoveredBusId }),

    activeTool: 'select',
    setActiveTool: (activeTool) => set({ activeTool }),
    selectedId: null,
    selectedType: null,
    setSelected: (selectedId, selectedType) => set({ selectedId, selectedType }),

    activeWireColor: '#ef4444',
    setActiveWireColor: (activeWireColor) => set({ activeWireColor }),

    wireDraftStart: null,
    setWireDraftStart: (wireDraftStart) => set({ wireDraftStart }),

    components: initialComponents,
    wires: initialWires,

    isSimRunning: true,
    toggleSimulation: () => set((s) => ({ isSimRunning: !s.isSimRunning })),
    solvedState: initialSolved,

    recomputeCircuit: () => {
      const { components, wires, mode } = get();
      const solved = solveCircuit(components, wires, mode);

      // Update DMM reading based on attached probes
      const { dmm } = get();
      let reading = 0;
      let unit = 'V';
      let isOverload = false;

      const vRed = dmm.redProbe.componentId && dmm.redProbe.pinId
        ? solved.pinVoltages[`${dmm.redProbe.componentId}:${dmm.redProbe.pinId}`] ?? 0
        : 0;
      const vBlack = dmm.blackProbe.componentId && dmm.blackProbe.pinId
        ? solved.pinVoltages[`${dmm.blackProbe.componentId}:${dmm.blackProbe.pinId}`] ?? 0
        : 0;

      if (dmm.mode === 'voltage_dc') {
        reading = vRed - vBlack;
        unit = 'V';
      } else if (dmm.mode === 'voltage_ac') {
        reading = Math.abs(vRed - vBlack) * 0.707;
        unit = 'Vrms';
      } else if (dmm.mode === 'current_dc') {
        // Current through the red probe component
        const compId = dmm.redProbe.componentId;
        reading = compId ? (solved.branchCurrents[compId] || 0) * 1000 : 0;
        unit = 'mA';
      } else if (dmm.mode === 'resistance') {
        const comp = components.find((c) => c.id === dmm.redProbe.componentId);
        reading = comp?.parameters.resistanceOhms ?? 0;
        unit = 'Ω';
      } else if (dmm.mode === 'continuity') {
        const netRed = dmm.redProbe.componentId && dmm.redProbe.pinId
          ? solved.pinVoltages[`${dmm.redProbe.componentId}:${dmm.redProbe.pinId}`]
          : null;
        const netBlack = dmm.blackProbe.componentId && dmm.blackProbe.pinId
          ? solved.pinVoltages[`${dmm.blackProbe.componentId}:${dmm.blackProbe.pinId}`]
          : null;
        reading = (netRed !== null && netBlack !== null && Math.abs(vRed - vBlack) < 0.05) ? 0.1 : 999999;
        unit = reading < 1 ? 'BEEP (0.1Ω)' : 'OPEN';
      }

      // Update Oscilloscope waveform histories
      const { scope } = get();
      const ch1V = scope.ch1.componentId && scope.ch1.pinId
        ? solved.pinVoltages[`${scope.ch1.componentId}:${scope.ch1.pinId}`] ?? 0
        : 0;
      const ch2V = scope.ch2.componentId && scope.ch2.pinId
        ? solved.pinVoltages[`${scope.ch2.componentId}:${scope.ch2.pinId}`] ?? 0
        : 0;

      const newWaveCh1 = [...scope.waveformCh1.slice(-60), ch1V];
      const newWaveCh2 = [...scope.waveformCh2.slice(-60), ch2V];

      set({
        solvedState: solved,
        dmm: { ...dmm, reading: Number(reading.toFixed(3)), unit, isOverload },
        scope: { ...scope, waveformCh1: newWaveCh1, waveformCh2: newWaveCh2 },
      });
    },

    pushHistorySnapshot: () => {
      const { components, wires, undoStack } = get();
      const snapshot: CircuitHistorySnapshot = {
        components: JSON.parse(JSON.stringify(components)),
        wires: JSON.parse(JSON.stringify(wires)),
      };
      set({
        undoStack: [...undoStack.slice(-20), snapshot],
        redoStack: [],
      });
    },

    addComponent: (comp) => {
      get().pushHistorySnapshot();
      set((s) => ({
        components: [...s.components, comp],
        selectedId: comp.id,
        selectedType: 'component',
      }));
      get().recomputeCircuit();
    },

    updateComponentPosition: (id, position) => {
      set((s) => ({
        components: s.components.map((c) => (c.id === id ? { ...c, position } : c)),
      }));
      get().recomputeCircuit();
    },

    updateComponentParameters: (id, params) => {
      get().pushHistorySnapshot();
      set((s) => ({
        components: s.components.map((c) =>
          c.id === id ? { ...c, parameters: { ...c.parameters, ...params } } : c
        ),
      }));
      get().recomputeCircuit();
    },

    rotateComponent: (id, stepYDeg = 90) => {
      get().pushHistorySnapshot();
      const rad = (stepYDeg * Math.PI) / 180;
      set((s) => ({
        components: s.components.map((c) =>
          c.id === id
            ? { ...c, rotation: [c.rotation[0], (c.rotation[1] + rad) % (Math.PI * 2), c.rotation[2]] }
            : c
        ),
      }));
      get().recomputeCircuit();
    },

    removeComponent: (id) => {
      get().pushHistorySnapshot();
      set((s) => ({
        components: s.components.filter((c) => c.id !== id),
        wires: s.wires.filter((w) => w.fromComponentId !== id && w.toComponentId !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
        selectedType: s.selectedId === id ? null : s.selectedType,
      }));
      get().recomputeCircuit();
    },

    addWire: (fromCompId, fromPinId, toCompId, toPinId, color) => {
      if (fromCompId === toCompId && fromPinId === toPinId) return; // Cannot connect pin to itself
      get().pushHistorySnapshot();
      const newWire: WireConnection = {
        id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fromComponentId: fromCompId,
        fromPinId: fromPinId,
        toComponentId: toCompId,
        toPinId: toPinId,
        color: color || get().activeWireColor,
      };
      set((s) => ({
        wires: [...s.wires, newWire],
        wireDraftStart: null,
      }));
      get().recomputeCircuit();
    },

    removeWire: (id) => {
      get().pushHistorySnapshot();
      set((s) => ({
        wires: s.wires.filter((w) => w.id !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
        selectedType: s.selectedId === id ? null : s.selectedType,
      }));
      get().recomputeCircuit();
    },

    updateWireColor: (id, color) => {
      get().pushHistorySnapshot();
      set((s) => ({
        wires: s.wires.map((w) => (w.id === id ? { ...w, color } : w)),
      }));
    },

    // DMM state
    dmm: {
      redProbe: {},
      blackProbe: {},
      mode: 'voltage_dc',
      reading: 0,
      unit: 'V',
      isOverload: false,
    },
    setDmmMode: (mode) => {
      WorkbenchAudio.playDialTick();
      set((s) => ({ dmm: { ...s.dmm, mode } }));
      get().recomputeCircuit();
    },
    attachDmmProbe: (probe, componentId, pinId) => {
      if (componentId) {
        WorkbenchAudio.playProbeSnap(probe);
      }
      set((s) => ({
        dmm: {
          ...s.dmm,
          [probe === 'red' ? 'redProbe' : 'blackProbe']: { componentId, pinId },
        },
      }));
      get().recomputeCircuit();
    },

    // Oscilloscope state
    scope: {
      ch1: {},
      ch2: {},
      waveformCh1: Array(60).fill(0),
      waveformCh2: Array(60).fill(0),
    },
    attachScopeProbe: (ch, componentId, pinId) => {
      set((s) => ({
        scope: {
          ...s.scope,
          [ch]: { componentId, pinId },
        },
      }));
      get().recomputeCircuit();
    },

    // Preset & File Management
    activePresetId: initialPreset.id,
    loadPreset: (presetId) => {
      const preset = CIRCUIT_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      get().pushHistorySnapshot();
      const freshComponents = JSON.parse(JSON.stringify(preset.components));
      const freshWires = JSON.parse(JSON.stringify(preset.wires));
      set({
        activePresetId: preset.id,
        components: freshComponents,
        wires: freshWires,
        selectedId: null,
        selectedType: null,
      });
      get().recomputeCircuit();
    },

    exportProjectJson: () => {
      const { components, wires, mode } = get();
      const project: CircuitProject = {
        version: '1.0.0',
        title: '3D Lab Circuit Project',
        mode,
        components,
        wires,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return JSON.stringify(project, null, 2);
    },

    importProjectJson: (json) => {
      try {
        const project: CircuitProject = JSON.parse(json);
        if (!project.components || !project.wires) return false;
        get().pushHistorySnapshot();
        set({
          mode: project.mode || 'breadboard',
          components: project.components,
          wires: project.wires,
          selectedId: null,
          selectedType: null,
        });
        get().recomputeCircuit();
        return true;
      } catch (err) {
        console.error('Failed to parse circuit project JSON', err);
        return false;
      }
    },

    // Undo / Redo
    undoStack: [],
    redoStack: [],
    undo: () => {
      const { undoStack, redoStack, components, wires } = get();
      if (undoStack.length === 0) return;
      const prev = undoStack[undoStack.length - 1];
      const newUndo = undoStack.slice(0, -1);
      const currentSnapshot: CircuitHistorySnapshot = {
        components: JSON.parse(JSON.stringify(components)),
        wires: JSON.parse(JSON.stringify(wires)),
      };
      set({
        components: prev.components,
        wires: prev.wires,
        undoStack: newUndo,
        redoStack: [...redoStack, currentSnapshot],
      });
      get().recomputeCircuit();
    },

    redo: () => {
      const { redoStack, undoStack, components, wires } = get();
      if (redoStack.length === 0) return;
      const next = redoStack[redoStack.length - 1];
      const newRedo = redoStack.slice(0, -1);
      const currentSnapshot: CircuitHistorySnapshot = {
        components: JSON.parse(JSON.stringify(components)),
        wires: JSON.parse(JSON.stringify(wires)),
      };
      set({
        components: next.components,
        wires: next.wires,
        redoStack: newRedo,
        undoStack: [...undoStack, currentSnapshot],
      });
      get().recomputeCircuit();
    },
  };
});
