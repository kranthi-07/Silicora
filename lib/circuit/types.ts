/**
 * 3D Lab — Phase 4: Circuit Workspace Domain Types
 * Independent of Three.js and DOM APIs.
 */

export type CircuitWorkspaceMode = 'breadboard' | 'open_3d';

export type WireColor =
  | '#ef4444' // Red (VCC / Positive)
  | '#0f172a' // Black (GND / Negative)
  | '#3b82f6' // Blue (Signal)
  | '#10b981' // Green (Earth / Reference)
  | '#eab308' // Yellow (Aux / Trigger)
  | '#f8fafc' // White (Clock / Control)
  | '#ea580c'; // Orange (Power rail)

export interface LogicalPin {
  pinId: string;
  name: string;
  pinNumber: number;
  type: 'passive' | 'anode' | 'cathode' | 'base' | 'collector' | 'emitter' | 'gate' | 'drain' | 'source' | 'power' | 'ground';
  /** Relative offset in mm from component origin [x, y, z] */
  offsetMm: [number, number, number];
  /** Assigned electrical net ID during graph resolution */
  netId?: number;
  /** Breadboard grid position if plugged into a breadboard */
  breadboardTiePoint?: {
    section: 'power_top' | 'terminal_top' | 'terminal_bottom' | 'power_bottom';
    column: number; // 1 to 30 or 60
    row: string; // 'a'..'e' or 'f'..'j' or '+' or '-'
  };
}

export type CircuitComponentKind =
  | 'dc_source'
  | 'ground'
  | 'resistor'
  | 'capacitor'
  | 'inductor'
  | 'diode'
  | 'led'
  | 'transistor_npn'
  | 'transistor_mosfet'
  | 'pushbutton'
  | 'potentiometer';

export interface CircuitElementInstance {
  id: string;
  kind: CircuitComponentKind;
  catalogId?: string;
  name: string;
  /** 3D position [x, y, z] in mm */
  position: [number, number, number];
  /** 3D rotation [rx, ry, rz] in radians */
  rotation: [number, number, number];
  /** Logical pins on this component */
  pins: LogicalPin[];
  /** Component specific parameters */
  parameters: {
    resistanceOhms?: number;
    voltageVolts?: number;
    capacitanceFarads?: number;
    inductanceHenries?: number;
    forwardVoltageV?: number;
    ledColor?: 'red' | 'green' | 'blue' | 'yellow';
    beta?: number; // BJT gain
    vThreshold?: number; // MOSFET threshold
    switchClosed?: boolean; // Pushbutton state
    potWiperPosition?: number; // 0.0 to 1.0
  };
}

export interface WireConnection {
  id: string;
  fromComponentId: string;
  fromPinId: string;
  toComponentId: string;
  toPinId: string;
  color: WireColor;
  /** Optional custom sag / curvature (0 = straight, 1 = deep catenary) */
  sag?: number;
}

export interface ElectricalNet {
  netId: number;
  name: string;
  isGround: boolean;
  isPower: boolean;
  voltage: number; // Volts relative to ground
  connectedPins: Array<{
    componentId: string;
    pinId: string;
  }>;
}

export interface CircuitDiagnostics {
  hasShortCircuit: boolean;
  shortCircuitReason?: string;
  hasOpenCircuit: boolean;
  floatingNodes: number[];
  reversedLeds: string[];
  burnedComponents: string[];
  validationErrors: string[];
  solvedNodeVoltages: Record<number, number>;
  branchCurrents: Record<string, number>; // componentId -> Current in Amperes
  totalPowerWatts: number;
}

export interface CircuitProject {
  version: string;
  title: string;
  mode: CircuitWorkspaceMode;
  components: CircuitElementInstance[];
  wires: WireConnection[];
  createdAt: string;
  updatedAt: string;
}

export type MultimeterMode = 'voltage_dc' | 'voltage_ac' | 'current_dc' | 'resistance' | 'continuity';

export interface MultimeterProbeState {
  redProbe: {
    componentId?: string;
    pinId?: string;
    netId?: number;
  };
  blackProbe: {
    componentId?: string;
    pinId?: string;
    netId?: number;
  };
  mode: MultimeterMode;
  reading: number;
  unit: string;
  isOverload: boolean;
}
