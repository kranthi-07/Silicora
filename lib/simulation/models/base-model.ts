import {
  ElectricalInputs,
  ElectricalOutputs,
  IElectricalModel,
  IVCurvePoint,
  ThermalState,
  OperatingLimitState,
} from '../types';

export abstract class BaseElectricalModel implements IElectricalModel {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly category: string;

  // Thermal characteristics
  protected rThetaJA: number = 140; // °C/W
  protected rThetaJC: number = 60;  // °C/W
  protected tauThermal: number = 4.5; // seconds
  protected currentJunctionTemp: number = 25.0; // °C
  protected burnTimeAccumulator: number = 0; // seconds over stress limit
  protected isPermanentlyBurnt: boolean = false;

  // Physical limits
  protected maxVoltageV: number = 250;
  protected maxCurrentA: number = 0.05;
  protected maxPowerW: number = 0.25;
  protected maxTempC: number = 155;

  /**
   * Resets thermal and breakdown states.
   */
  public reset(): void {
    this.currentJunctionTemp = 25.0;
    this.burnTimeAccumulator = 0;
    this.isPermanentlyBurnt = false;
  }

  /**
   * Evaluates the first-order dynamic thermal equation:
   * dT_j / dt = (P_d * R_th_JA - (T_j - T_ambient)) / tau_thermal
   */
  protected updateThermalModel(
    powerWatts: number,
    dtSeconds: number,
    ambientTempC: number = 25.0
  ): ThermalState {
    const steadyStateTempRise = Math.max(0, powerWatts) * this.rThetaJA;
    const currentRise = this.currentJunctionTemp - ambientTempC;

    // Euler integration step with numerical stability guard
    const dtSafe = Math.min(dtSeconds, 0.5);
    const dTemp = ((steadyStateTempRise - currentRise) / Math.max(0.01, this.tauThermal)) * dtSafe;
    this.currentJunctionTemp = Math.max(ambientTempC, this.currentJunctionTemp + dTemp);

    // Case temp approximation (R_th_JC / R_th_JA divider)
    const caseRise = (steadyStateTempRise * (this.rThetaJC / this.rThetaJA));
    const caseTemp = ambientTempC + Math.min(caseRise, this.currentJunctionTemp - ambientTempC);

    const thermalNormalized = Math.min(
      1.0,
      Math.max(0, (this.currentJunctionTemp - ambientTempC) / (this.maxTempC - ambientTempC))
    );

    return {
      junctionTempC: Number(this.currentJunctionTemp.toFixed(1)),
      caseTempC: Number(caseTemp.toFixed(1)),
      heatFluxWatts: powerWatts,
      thermalNormalized: Number(thermalNormalized.toFixed(3)),
    };
  }

  /**
   * Calculates signed physical drift velocity for charge carriers:
   * By definition of electric charge (q = -e), electron drift vector is OPPOSITE to conventional current!
   */
  protected calculateDriftVelocities(branchCurrentA: number): {
    conventionalVelocity: number;
    electronVelocity: number;
  } {
    if (Math.abs(branchCurrentA) < 1e-12) {
      return { conventionalVelocity: 0, electronVelocity: 0 };
    }

    // Velocity scaling: smooth logarithmic/tanh curve for visible 3D particle motion
    const sign = Math.sign(branchCurrentA);
    const absI = Math.abs(branchCurrentA);
    const vMax = 25.0; // mm/s maximum rendering speed
    const normalizedSpeed = Math.min(vMax, 4.0 * Math.log10(1 + (absI / 0.001)));

    return {
      // Conventional current flows in positive direction of branch current
      conventionalVelocity: sign * normalizedSpeed,
      // Electron drift is strictly OPPOSITE to conventional current!
      electronVelocity: -sign * normalizedSpeed,
    };
  }

  /**
   * Evaluates operating health against component datasheet boundaries.
   */
  protected evaluateLimits(
    voltage: number,
    current: number,
    power: number,
    dtSeconds: number
  ): OperatingLimitState {
    if (this.isPermanentlyBurnt) {
      return {
        isOverstressed: true,
        overstressReason: 'Component permanently destroyed by excessive electrical power dissipation.',
        stressFactor: 2.5,
        burnoutTriggered: true,
      };
    }

    const absV = Math.abs(voltage);
    const absI = Math.abs(current);
    const absP = Math.abs(power);

    const stressV = absV / this.maxVoltageV;
    const stressI = absI / this.maxCurrentA;
    const stressP = absP / this.maxPowerW;
    const stressT = (this.currentJunctionTemp - 25) / (this.maxTempC - 25);

    const stressFactor = Math.max(stressV, stressI, stressP, stressT);
    const isOverstressed = stressFactor > 1.0;

    let overstressReason: string | undefined;
    if (stressP > 1.0) overstressReason = `Power dissipation (${absP.toFixed(2)}W) exceeds rating (${this.maxPowerW}W)`;
    else if (stressV > 1.0) overstressReason = `Voltage (${absV.toFixed(1)}V) exceeds rating (${this.maxVoltageV}V)`;
    else if (stressI > 1.0) overstressReason = `Current (${absI.toFixed(3)}A) exceeds rating (${this.maxCurrentA}A)`;
    else if (stressT > 1.0) overstressReason = `Junction temperature (${this.currentJunctionTemp.toFixed(1)}°C) exceeds limit (${this.maxTempC}°C)`;

    // Check burnout trigger: P > 2.5 * P_max sustained for > 1.5 seconds
    if (stressP > 2.0 || stressT > 1.3) {
      this.burnTimeAccumulator += dtSeconds;
      if (this.burnTimeAccumulator > 1.5) {
        this.isPermanentlyBurnt = true;
      }
    } else {
      this.burnTimeAccumulator = Math.max(0, this.burnTimeAccumulator - dtSeconds * 0.5);
    }

    return {
      isOverstressed,
      overstressReason,
      stressFactor: Number(stressFactor.toFixed(2)),
      burnoutTriggered: this.isPermanentlyBurnt,
    };
  }

  abstract evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs;

  abstract generateIVCurve(
    vMin: number,
    vMax: number,
    steps: number,
    inputs?: Partial<ElectricalInputs>
  ): IVCurvePoint[];
}
