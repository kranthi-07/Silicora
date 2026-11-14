/**
 * 3D Lab — Phase 5: Device Explorer Domain Types
 * Sourced technical information for real-world electronic products.
 */

export type DeviceCategory =
  | 'mobile'
  | 'computing'
  | 'power'
  | 'appliance'
  | 'consumer_audio_video';

export interface ComponentSignalFlow {
  input: string;
  processing: string;
  output: string;
}

export interface DeviceComponentPart {
  id: string;
  name: string;
  functionalRole: string;
  manufacturerPartCode?: string;
  packageType: string;
  subsystemId: string;
  /** Relative 3D position [x, y, z] in mm inside device */
  positionMm: [number, number, number];
  dimensionsMm: [number, number, number];
  color: string;
  description: string;
  keySpecs: Record<string, string>;
  /** Optional link to Component Explorer catalog part ID */
  relatedCatalogComponentId?: string;
  /** Scientific & physical operating principles */
  workingPrinciple?: string;
  /** Plain-English explanation of role and purpose inside this device */
  howItWorksInsideDevice?: string;
  /** Signal and power transduction path */
  signalFlow?: ComponentSignalFlow;
  /** Reference to real component photo */
  realImageUrl?: string;
  /** Reference to microscopic silicon die shot / X-ray */
  dieShotUrl?: string;
  /** Numbered index for CAD blueprint technical drawing callouts */
  calloutNumber?: number;
}

export interface DeviceSubsystem {
  id: string;
  name: string;
  description: string;
  color: string;
  /** Exploded view separation translation [x, y, z] in mm at 100% explode */
  separationVector: [number, number, number];
  components: DeviceComponentPart[];
}

export interface PowerRailInfo {
  name: string;
  nominalVoltageV: number;
  maxCurrentA: number;
  source: string;
  destinations: string[];
  description: string;
}

export interface SignalBusInfo {
  name: string;
  protocol: string;
  clockRate: string;
  source: string;
  destinations: string[];
  description: string;
}

export interface BlockDiagramNode {
  id: string;
  label: string;
  category: 'power' | 'processor' | 'memory' | 'sensor' | 'io' | 'actuator' | 'rf';
  subsystemId: string;
  x: number; // Layout grid percentage 0-100
  y: number; // Layout grid percentage 0-100
}

export interface BlockDiagramConnection {
  fromNodeId: string;
  toNodeId: string;
  busType: 'power' | 'data' | 'control' | 'analog';
  label?: string;
}

export interface DeviceItem {
  id: string;
  name: string;
  category: DeviceCategory;
  modelYear: string;
  tagline: string;
  synopsis: string;
  workingPrinciples: string;
  documentedEngineeringFacts: string[];
  subsystems: DeviceSubsystem[];
  powerRails: PowerRailInfo[];
  signalBuses: SignalBusInfo[];
  blockDiagramNodes: BlockDiagramNode[];
  blockDiagramConnections: BlockDiagramConnection[];
}
