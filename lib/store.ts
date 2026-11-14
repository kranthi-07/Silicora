import { create } from 'zustand';
import { LabEnvironment, WorkspaceTelemetry, ViewportMode } from '@/types/workspace';
import { ComponentCategory, ComponentItem } from '@/types/component';
import { MOCK_COMPONENTS } from '@/data/mock-components';

export type CameraPreset = 'iso' | 'front' | 'top' | 'side';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface WorkspaceState {
  // Navigation & Environments
  activeEnvironment: LabEnvironment;
  setActiveEnvironment: (env: LabEnvironment) => void;

  // Code Editor & Serial Monitor
  codeEditorOpen: boolean;
  setCodeEditorOpen: (open: boolean) => void;
  toggleCodeEditor: () => void;

  // Notifications System
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Component Explorer Filtering & Selection
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ComponentCategory;
  setSelectedCategory: (cat: ComponentCategory) => void;
  selectedMounting: string | null;
  setSelectedMounting: (m: string | null) => void;
  selectedComponent: ComponentItem | null;
  setSelectedComponent: (comp: ComponentItem | null) => void;
  
  // UI Panels Layout
  leftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  setLeftSidebarOpen: (open: boolean) => void;
  rightInspectorOpen: boolean;
  toggleRightInspector: () => void;
  setRightInspectorOpen: (open: boolean) => void;
  bottomDockOpen: boolean;
  toggleBottomDock: () => void;
  setBottomDockOpen: (open: boolean) => void;

  // Catalog View Mode ('3d' | 'grid' | 'table')
  catalogViewMode: '3d' | 'grid' | 'table';
  setCatalogViewMode: (mode: '3d' | 'grid' | 'table') => void;

  // Viewport 3D Tool Controls
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  explodePercent: number;
  setExplodePercent: (p: number) => void;
  cutawayActive: boolean;
  setCutawayActive: (active: boolean) => void;
  cutawayPlaneAxis: 'x' | 'y' | 'z';
  setCutawayPlaneAxis: (axis: 'x' | 'y' | 'z') => void;
  cutawayOffset: number;
  setCutawayOffset: (offset: number) => void;
  xRayMode: boolean;
  toggleXRayMode: () => void;
  setXRayMode: (val: boolean) => void;

  // 3D Cutaway Layers & Selection
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  layerVisibility: Record<string, boolean>;
  toggleLayerVisibility: (layerId: string) => void;
  setLayerVisible: (layerId: string, visible: boolean) => void;
  resetLayerVisibility: () => void;

  // 3D Camera Controls
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
  cameraTrigger: number; // Increment to force camera animation

  // Dialogs
  detailModalOpen: boolean;
  setDetailModalOpen: (open: boolean) => void;
  tutorialsModalOpen: boolean;
  setTutorialsModalOpen: (open: boolean) => void;
  activeDetailTab: 'newbie' | 'overview' | 'pinout' | 'spice' | 'layers' | 'failure';
  setActiveDetailTab: (tab: 'newbie' | 'overview' | 'pinout' | 'spice' | 'layers' | 'failure') => void;

  // Telemetry
  telemetry: WorkspaceTelemetry;
  updateTelemetry: (partial: Partial<WorkspaceTelemetry>) => void;

  // Workspace Page Transition Loader
  isTransitioningToWorkspace: boolean;
  setIsTransitioningToWorkspace: (transitioning: boolean) => void;

  // Workspace -> Home Page Return Transition
  isTransitioningToHome: boolean;
  setIsTransitioningToHome: (transitioning: boolean) => void;

  // Active Test Bench Simulation Engine & Flowing Current State
  isSimRunning: boolean;
  isSimLoading: boolean;
  simLoadingProgress: number;
  setIsSimRunning: (running: boolean) => void;
  setIsSimLoading: (loading: boolean) => void;
  setSimLoadingProgress: (p: number) => void;
  startSimulationWithLoading: () => void;
  stopSimulationEngine: () => void;

  // Visual Theme (Dark Lab Mode vs Light Studio Mode)
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  toggleThemeMode: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  // Defaults
  activeEnvironment: 'component_explorer',
  setActiveEnvironment: (env) => set({ activeEnvironment: env }),

  // Code Editor & Serial Monitor
  codeEditorOpen: false,
  setCodeEditorOpen: (open) => set({ codeEditorOpen: open }),
  toggleCodeEditor: () => set((s) => ({ codeEditorOpen: !s.codeEditorOpen })),

  // Notifications
  notifications: [
    {
      id: 'notif_1',
      title: 'Inbuilt Serial Monitor Online',
      message: 'Virtual MCU COM3 active at 9600 baud. Press Ctrl+D to launch the coding platform.',
      timestamp: 'Just now',
      read: false,
      type: 'info',
    },
    {
      id: 'notif_2',
      title: 'Simulation Solver Calibrated',
      message: 'Transient ODE solver and Shockley semiconductor models ready.',
      timestamp: '5m ago',
      read: false,
      type: 'success',
    },
    {
      id: 'notif_3',
      title: 'Phase 6: PCB Studio DRC Clean',
      message: 'Design rules verified with 6.0 mil minimum annular ring clearance.',
      timestamp: '12m ago',
      read: false,
      type: 'info',
    },
  ],
  unreadNotificationsCount: 3,
  markNotificationRead: (id) =>
    set((s) => {
      const updated = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      const count = updated.filter((n) => !n.read).length;
      return { notifications: updated, unreadNotificationsCount: count };
    }),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadNotificationsCount: 0,
    })),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectedCategory: 'all',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  selectedMounting: null,
  setSelectedMounting: (selectedMounting) => set({ selectedMounting }),
  selectedComponent: MOCK_COMPONENTS.find((c) => c.id === 'pass_res_10k') || MOCK_COMPONENTS[0], // Resistor prioritized as requested
  setSelectedComponent: (comp) =>
    set({
      selectedComponent: comp,
      selectedLayerId: null,
      layerVisibility: {},
    }),

  leftSidebarOpen: false,
  toggleLeftSidebar: () => set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  setLeftSidebarOpen: (leftSidebarOpen) => set({ leftSidebarOpen }),
  rightInspectorOpen: false,
  toggleRightInspector: () => set((s) => ({ rightInspectorOpen: !s.rightInspectorOpen })),
  setRightInspectorOpen: (rightInspectorOpen) => set({ rightInspectorOpen }),
  bottomDockOpen: false,
  toggleBottomDock: () => set((s) => ({ bottomDockOpen: !s.bottomDockOpen })),
  setBottomDockOpen: (bottomDockOpen) => set({ bottomDockOpen }),

  catalogViewMode: '3d',
  setCatalogViewMode: (catalogViewMode) => set({ catalogViewMode }),

  viewportMode: 'orbit',
  setViewportMode: (viewportMode) => set({ viewportMode }),
  explodePercent: 0,
  setExplodePercent: (explodePercent) => set({ explodePercent }),
  cutawayActive: false,
  setCutawayActive: (cutawayActive) => set({ cutawayActive }),
  cutawayPlaneAxis: 'y',
  setCutawayPlaneAxis: (cutawayPlaneAxis) => set({ cutawayPlaneAxis }),
  cutawayOffset: 0,
  setCutawayOffset: (cutawayOffset) => set({ cutawayOffset }),
  xRayMode: false,
  toggleXRayMode: () => set((state) => ({ xRayMode: !state.xRayMode })),
  setXRayMode: (xRayMode) => set({ xRayMode }),

  selectedLayerId: null,
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  layerVisibility: {},
  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layerId]: state.layerVisibility[layerId] === undefined ? false : !state.layerVisibility[layerId],
      },
    })),
  setLayerVisible: (layerId, visible) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layerId]: visible,
      },
    })),
  resetLayerVisibility: () => set({ layerVisibility: {}, selectedLayerId: null }),

  cameraPreset: 'iso',
  cameraTrigger: 0,
  setCameraPreset: (preset) =>
    set((s) => ({ cameraPreset: preset, cameraTrigger: s.cameraTrigger + 1 })),

  detailModalOpen: false,
  setDetailModalOpen: (detailModalOpen) => set({ detailModalOpen }),
  tutorialsModalOpen: false,
  setTutorialsModalOpen: (tutorialsModalOpen) => set({ tutorialsModalOpen }),
  activeDetailTab: 'overview',
  setActiveDetailTab: (activeDetailTab) => set({ activeDetailTab }),

  telemetry: {
    fps: 60,
    engineMode: 'idle',
    activeNodes: 0,
    activeComponents: 1,
    zoomLevel: 100,
    cursorCoordinates: { x: 0, y: 0, z: 0 },
  },
  updateTelemetry: (partial) =>
    set((s) => ({ telemetry: { ...s.telemetry, ...partial } })),

  isTransitioningToWorkspace: false,
  setIsTransitioningToWorkspace: (isTransitioningToWorkspace) =>
    set({ isTransitioningToWorkspace }),

  isTransitioningToHome: false,
  setIsTransitioningToHome: (isTransitioningToHome) =>
    set({ isTransitioningToHome }),

  // Simulation controls & automated loading progress sequence
  isSimRunning: false,
  isSimLoading: false,
  simLoadingProgress: 0,
  setIsSimRunning: (isSimRunning) => set({ isSimRunning }),
  setIsSimLoading: (isSimLoading) => set({ isSimLoading }),
  setSimLoadingProgress: (simLoadingProgress) => set({ simLoadingProgress }),
  startSimulationWithLoading: () => {
    set({ isSimLoading: true, isSimRunning: false, simLoadingProgress: 0 });
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        clearInterval(interval);
        set({ isSimLoading: false, isSimRunning: true, simLoadingProgress: 100 });
      } else {
        set({ simLoadingProgress: progress });
      }
    }, 45); // ~1.2s total duration
  },
  stopSimulationEngine: () => {
    set({ isSimRunning: false, isSimLoading: false, simLoadingProgress: 0 });
  },

  // Visual Theme (Dark Lab Mode vs Light Studio Mode)
  themeMode: 'dark',
  setThemeMode: (themeMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('silicora_theme', themeMode);
    }
    set({ themeMode });
  },
  toggleThemeMode: () => {
    set((state) => {
      const nextTheme = state.themeMode === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('silicora_theme', nextTheme);
      }
      return { themeMode: nextTheme };
    });
  },
}));
