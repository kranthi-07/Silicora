export type ComponentCategory =
  | 'all'
  | 'passive'
  | 'discrete_semiconductor'
  | 'integrated_circuit'
  | 'opamp_linear'
  | 'electromechanical'
  | 'sensor'
  | 'optoelectronics'
  | 'power_management';

export type MountingType = 'through_hole' | 'smd' | 'chassis' | 'terminal';

export interface BoundingBox3D {
  widthMm: number;
  heightMm: number;
  depthMm: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PinAnchor {
  pinId: string;
  pinNumber: number;
  name: string;
  type: 'passive' | 'input' | 'output' | 'power' | 'ground' | 'tri_state';
  positionMm: Vector3D;
  leadDirection: Vector3D;
  breadboardCompatible: boolean;
}

export interface PhysicalPackage {
  standardCode: string; // e.g. "TO-92", "DIP-8", "0805", "DO-35"
  mounting: MountingType;
  dimensionsMm: BoundingBox3D;
  pitchMm: number | null;
  pins: PinAnchor[];
}

export interface LODManifest {
  lod0GlbUrl: string;
  lod1GlbUrl: string;
  lod2GlbUrl: string;
}

export interface CutawayLayer {
  layerId: string;
  displayName: string;
  meshNodeName: string;
  materialType: 'plastic_mold' | 'copper_leadframe' | 'silicon_die' | 'gold_wirebond' | 'ceramic' | 'ferrite';
  defaultVisible: boolean;
  canClip: boolean;
  colorRampTarget?: 'thermal' | 'depletion_zone' | 'current_density';
}

export interface PinMapping {
  pinNumber: number;
  pinName: string;
  spiceNodeOrder: number;
}

export interface AbsoluteMaxRatings {
  maxVoltageV: number;
  maxCurrentContinuousA: number;
  maxCurrentPeakA: number;
  maxPowerDissipationW: number;
  maxJunctionTempC: number;
  minOperatingTempC: number;
}

export interface ThermalProperties {
  rThetaJA: number;
  rThetaJC: number;
  thermalTimeConstantSec: number;
}

export interface ElectricalModel {
  kind: 'primitive' | 'subcircuit';
  spicePrefix: 'R' | 'C' | 'L' | 'D' | 'Q' | 'M' | 'X' | 'U' | 'S' | 'V';
  subcircuitName?: string;
  netlistTemplate: string;
  pinMap: PinMapping[];
  ratings: AbsoluteMaxRatings;
  thermal: ThermalProperties;
  rawSpiceModel: string;
}

export interface BeginnerGuide {
  plainEnglishAnalogy: string;
  howToIdentify: string;
  polarityGuide: {
    isPolarized: boolean;
    pinIdentificationRule: string;
    warningIfReversed?: string;
  };
  realWorldExample: string;
  beginnerMistakesToAvoid: string[];
}

export interface PedagogicalData {
  tagline: string;
  summary: string;
  physicalOperatingPrinciple: string;
  microscopicMechanism: string;
  commonFailureModes: Array<{
    trigger: string;
    consequence: string;
    visualEffect: 'burn_mark' | 'pop_split' | 'smoke_cloud' | 'no_visible_change';
  }>;
  datasheetUrl?: string;
  beginnerGuide?: BeginnerGuide;
}

export interface ComponentItem {
  id: string;
  slug: string;
  name: string;
  category: Exclude<ComponentCategory, 'all'>;
  package: PhysicalPackage;
  visual3d: {
    lods: LODManifest;
    internalLayers: CutawayLayer[];
    previewColor: string;
  };
  electrical: ElectricalModel;
  educational: PedagogicalData;
  featured?: boolean;
  tags: string[];
  symbolType?:
    | 'resistor'
    | 'capacitor'
    | 'polarized_capacitor'
    | 'inductor'
    | 'diode'
    | 'led'
    | 'bjt_npn'
    | 'mosfet_n'
    | 'opamp'
    | 'ic_timer'
    | 'switch'
    | 'potentiometer'
    | 'photoresistor'
    | 'buzzer'
    | 'temperature_sensor'
    | 'microcontroller'
    | 'battery';
}
