import { create } from 'zustand';
import {
  PcbProject,
  PcbLayerId,
  PcbDrcResult,
  SoldermaskColor,
  SurfaceFinish,
} from '@/types/pcb';
import { CIRCUIT_PRESETS } from '@/lib/circuit/circuit-presets';
import { convertCircuitToPcbProject } from '@/lib/pcb/circuit-to-pcb-adapter';
import { runDesignRuleCheck } from '@/lib/pcb/pcb-drc';

const INITIAL_PRESET = CIRCUIT_PRESETS.find((p) => p.id === 'exp_led_resistor') || CIRCUIT_PRESETS[0];

const INITIAL_PROJECT: PcbProject = convertCircuitToPcbProject(
  INITIAL_PRESET.components,
  INITIAL_PRESET.wires,
  {
    name: INITIAL_PRESET.id,
    soldermaskColor: 'green',
    surfaceFinish: 'HASL',
  }
);

interface PcbState {
  selectedPresetId: string;
  project: PcbProject;
  activeLayer: 'F_Cu' | 'B_Cu';
  viewMode: '2d' | '3d';
  visibleLayers: Record<PcbLayerId, boolean>;
  selectedComponentId: string | null;
  selectedNetId: number | null;
  drcResult: PcbDrcResult | null;
  drcDialogOpen: boolean;
  exportDialogOpen: boolean;

  setSelectedPresetId: (id: string) => void;
  setProject: (project: PcbProject) => void;
  setActiveLayer: (layer: 'F_Cu' | 'B_Cu') => void;
  setViewMode: (mode: '2d' | '3d') => void;
  toggleLayerVisibility: (layerId: PcbLayerId) => void;
  setSelectedComponentId: (id: string | null) => void;
  setSelectedNetId: (id: number | null) => void;
  setDrcDialogOpen: (open: boolean) => void;
  setExportDialogOpen: (open: boolean) => void;
  rotateComponent: (compId: string) => void;
  runDrc: () => void;
  updateSoldermask: (color: SoldermaskColor) => void;
  updateSurfaceFinish: (finish: SurfaceFinish) => void;
  loadPresetPcb: (presetId: string) => void;
  updateComponentPosition: (id: string, posMm: [number, number]) => void;
  addTrack: (track: import('@/types/pcb').PcbTrack) => void;
  deleteTrack: (trackId: string) => void;
}

export const usePcbStore = create<PcbState>((set, get) => ({
  selectedPresetId: 'exp_led_resistor',
  project: INITIAL_PROJECT,
  activeLayer: 'F_Cu',
  viewMode: '2d',
  visibleLayers: {
    F_Cu: true,
    B_Cu: true,
    F_SilkS: true,
    B_SilkS: false,
    F_Mask: false,
    B_Mask: false,
    Edge_Cuts: true,
    Ratsnest: true,
  },
  selectedComponentId: null,
  selectedNetId: null,
  drcResult: null,
  drcDialogOpen: false,
  exportDialogOpen: false,

  setSelectedPresetId: (selectedPresetId) => set({ selectedPresetId }),
  setProject: (project) => set({ project }),
  setActiveLayer: (activeLayer) => set({ activeLayer }),
  setViewMode: (viewMode) => set({ viewMode }),

  toggleLayerVisibility: (layerId) => {
    set((state) => ({
      visibleLayers: {
        ...state.visibleLayers,
        [layerId]: !state.visibleLayers[layerId],
      },
    }));
  },

  setSelectedComponentId: (selectedComponentId) => set({ selectedComponentId }),
  setSelectedNetId: (selectedNetId) => set({ selectedNetId }),
  setDrcDialogOpen: (drcDialogOpen) => set({ drcDialogOpen }),
  setExportDialogOpen: (exportDialogOpen) => set({ exportDialogOpen }),

  rotateComponent: (compId) => {
    set((state) => {
      const nextComponents = state.project.placedComponents.map((c) => {
        if (c.id === compId) {
          const nextRot = ((c.rotationDeg + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...c, rotationDeg: nextRot };
        }
        return c;
      });
      return { project: { ...state.project, placedComponents: nextComponents } };
    });
  },

  runDrc: () => {
    const { project } = get();
    const result = runDesignRuleCheck(project);
    set({ drcResult: result, drcDialogOpen: true });
  },

  updateSoldermask: (color) => {
    set((state) => ({
      project: {
        ...state.project,
        soldermaskColor: color,
      },
    }));
  },

  updateSurfaceFinish: (finish) => {
    set((state) => ({
      project: {
        ...state.project,
        surfaceFinish: finish,
      },
    }));
  },

  loadPresetPcb: (presetId) => {
    const preset = CIRCUIT_PRESETS.find((p) => p.id === presetId) || CIRCUIT_PRESETS[0];
    const newProject = convertCircuitToPcbProject(preset.components, preset.wires, {
      name: preset.id,
      soldermaskColor: get().project.soldermaskColor,
      surfaceFinish: get().project.surfaceFinish,
    });
    set({
      selectedPresetId: presetId,
      project: newProject,
      selectedComponentId: null,
      selectedNetId: null,
      drcResult: null,
    });
  },

  updateComponentPosition: (id, posMm) => {
    set((state) => ({
      project: {
        ...state.project,
        placedComponents: state.project.placedComponents.map((c) =>
          c.id === id ? { ...c, positionMm: posMm } : c
        ),
      },
    }));
  },

  addTrack: (track) => {
    set((state) => ({
      project: {
        ...state.project,
        tracks: [...state.project.tracks, track],
      },
    }));
  },

  deleteTrack: (trackId) => {
    set((state) => ({
      project: {
        ...state.project,
        tracks: state.project.tracks.filter((t) => t.id !== trackId),
      },
    }));
  },
}));
