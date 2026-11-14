/**
 * 3D Lab Simulation Engine — Type Definitions
 * Strictly independent of Three.js and DOM APIs.
 */

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'error';

export type WaveformType = 'dc' | 'sine' | 'square' | 'triangle' | 'pulse';

export interface ElectricalInputs {
  /** Supply / Input Voltage in Volts (V) */
  supplyVoltage: number;
  /** Primary parameter (e.g. Resistance in Ohms, Capacitance in Farads, Inductance in Henries) */
  primaryParameter: number;
  /** Secondary parameter (e.g. ESR, load resistance, frequency) */
  secondaryParameter?: number;
  /** AC Signal frequency in Hertz (Hz) if AC waveform is selected */
  frequencyHz?: number;
  /** AC Waveform kind */
  waveform?: WaveformType;
  /** Ambient Temperature in °C (default 25°C) */
  ambientTempC?: number;
  /** Transistor Control Input (e.g. Base current Ib or Gate voltage Vgs) */
  controlVoltage?: number;
  controlCurrent?: number;
}

export interface OperatingLimitState {
  isOverstressed: boolean;
  overstressReason?: string;
  stressFactor: number; // 0.0 to 1.0 (nominal), > 1.0 (exceeded)
  burnoutTriggered: boolean;
}

export interface ThermalState {
  junctionTempC: number;
  caseTempC: number;
  heatFluxWatts: number;
  thermalNormalized: number; // 0.0 (ambient) to 1.0 (T_max)
}

export interface ElectricalOutputs {
  /** Component Voltage Drop in Volts (V) */
  voltageDrop: number;
  /** Conventional Branch Current in Amperes (A) (positive = into anode/lead 1) */
  branchCurrent: number;
  /** Power Dissipation in Watts (W) (P = V * I) */
  powerDissipation: number;
  /** Signed Electron Drift Velocity scalar in mm/s (opposite to conventional current!) */
  electronDriftVelocity: number;
  /** Conventional Current Velocity scalar in mm/s */
  conventionalCurrentVelocity: number;
  /** Dynamic Thermal State */
  thermal: ThermalState;
  /** Operating Limits & Health Envelope */
  limits: OperatingLimitState;
  /** Component-specific physical outputs (e.g. LED lumens, capacitor stored charge, B-field) */
  extra: Record<string, number | string | boolean>;
}

export interface WaveformSample {
  timeMs: number;
  voltage: number;
  current: number;
  power: number;
  temperatureC: number;
}

export interface IVCurvePoint {
  voltage: number;
  current: number;
  power: number;
}

export interface IElectricalModel {
  readonly id: string;
  readonly name: string;
  readonly category: string;

  /**
   * Evaluates the electrical & physical operating point for time-step dt.
   */
  evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs;

  /**
   * Generates analytical DC I-V characteristic curve across a voltage sweep.
   */
  generateIVCurve(
    vMin: number,
    vMax: number,
    steps: number,
    inputs?: Partial<ElectricalInputs>
  ): IVCurvePoint[];

  /**
   * Resets internal integrator state (e.g. capacitor charge, thermal accumulation).
   */
  reset(): void;
}
