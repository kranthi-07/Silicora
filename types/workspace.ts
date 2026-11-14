export type LabEnvironment =
  | 'component_explorer'
  | 'internal_cutaway'
  | 'electrical_sim_lab'
  | 'circuit_workspace'
  | 'device_explorer'
  | 'pcb_studio'
  | 'learning_academy';

export interface EnvironmentMetadata {
  id: LabEnvironment;
  title: string;
  shortName: string;
  iconName: string;
  tagline: string;
  description: string;
  badge?: string;
  status: 'ready' | 'foundation' | 'planned';
}

export interface WorkspaceTelemetry {
  fps: number;
  engineMode: 'interactive_mna' | 'ngspice_wasm' | 'idle';
  activeNodes: number;
  activeComponents: number;
  zoomLevel: number;
  cursorCoordinates: { x: number; y: number; z: number };
}

export type ViewportMode = 'orbit' | 'pan' | 'cutaway' | 'explode' | 'wire';
