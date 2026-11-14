import { BaseElectricalModel } from './base-model';
import { ElectricalInputs, ElectricalOutputs, IVCurvePoint } from '../types';

export class DiodeElectricalModel extends BaseElectricalModel {
  readonly id = 'semi_diode_1n4148';
  readonly name = '1N4148 Switching Diode';
  readonly category = 'discrete_semiconductor';

  protected isSatCurrent: number = 2.5e-9; // Saturation current Is (Amperes)
  protected emissionCoeff: number = 1.75; // Ideality factor n
  protected seriesResistance: number = 0.5; // Rs in Ohms
  protected breakdownVoltage: number = 100.0; // Vbr in Volts
  protected thermalVoltage: number = 0.02585; // Vt = kT/q at 300K

  constructor() {
    super();
    this.maxVoltageV = 100;
    this.maxCurrentA = 0.3; // 300mA continuous
    this.maxPowerW = 0.5;
    this.rThetaJA = 300;
    this.rThetaJC = 120;
    this.tauThermal = 3.0;
  }

  public evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs {
    const vApplied = inputs.supplyVoltage;
    let branchCurrent = 0;
    let forwardVoltageDrop = 0;

    // 1. Reverse Breakdown Check (Avalanche)
    if (vApplied < -this.breakdownVoltage) {
      const vOver = Math.abs(vApplied) - this.breakdownVoltage;
      branchCurrent = -(vOver / 2.0); // Steep avalanche conduction
      forwardVoltageDrop = -this.breakdownVoltage;
    }
    // 2. Normal Forward / Reverse Bias (Shockley Equation with series resistance)
    else {
      if (vApplied > 0.0) {
        // Forward bias: solve exponential with linear series resistance knee
        const vKnee = 0.65;
        if (vApplied < vKnee) {
          branchCurrent = this.isSatCurrent * (Math.exp(vApplied / (this.emissionCoeff * this.thermalVoltage)) - 1);
          forwardVoltageDrop = vApplied;
        } else {
          // Linearized differential resistance past knee
          const rDyn = this.seriesResistance + 0.8;
          branchCurrent = 0.01 + (vApplied - vKnee) / rDyn;
          forwardVoltageDrop = Math.min(vApplied, vKnee + branchCurrent * this.seriesResistance);
        }
      } else {
        // Reverse bias leakage: -Is
        branchCurrent = -this.isSatCurrent * (1 - Math.exp(vApplied / (this.emissionCoeff * this.thermalVoltage)));
        forwardVoltageDrop = vApplied;
      }
    }

    const powerDissipation = Math.max(0, forwardVoltageDrop * branchCurrent);
    const thermal = this.updateThermalModel(powerDissipation, dtSeconds, inputs.ambientTempC);
    const { conventionalVelocity, electronVelocity } = this.calculateDriftVelocities(branchCurrent);
    const limits = this.evaluateLimits(forwardVoltageDrop, branchCurrent, powerDissipation, dtSeconds);

    // Microscopic Depletion Layer width: W_dep ~ sqrt(V_bi - V_bias)
    const vBi = 0.7; // Built-in barrier potential
    const effectiveBias = Math.min(vBi - 0.05, forwardVoltageDrop);
    const depletionWidthNormalized = Math.min(
      1.0,
      Math.max(0.1, Math.sqrt(Math.max(0, vBi - effectiveBias) / (vBi + 10.0)))
    );

    return {
      voltageDrop: forwardVoltageDrop,
      branchCurrent,
      powerDissipation,
      conventionalCurrentVelocity: conventionalVelocity,
      electronDriftVelocity: electronVelocity,
      thermal,
      limits,
      extra: {
        depletionWidthNormalized: Number(depletionWidthNormalized.toFixed(3)),
        conductionState: branchCurrent > 0.005 ? 'forward_conduction' : vApplied < -this.breakdownVoltage ? 'avalanche_breakdown' : 'reverse_blocking',
      },
    };
  }

  public generateIVCurve(
    vMin: number = -5,
    vMax: number = 1.2,
    steps: number = 41,
    inputs?: Partial<ElectricalInputs>
  ): IVCurvePoint[] {
    const stepSize = (vMax - vMin) / (steps - 1);
    const points: IVCurvePoint[] = [];

    for (let i = 0; i < steps; i++) {
      const v = vMin + i * stepSize;
      const res = this.evaluate({ supplyVoltage: v, primaryParameter: 0 }, 0.01);
      points.push({
        voltage: Number(v.toFixed(3)),
        current: Number(res.branchCurrent.toFixed(6)),
        power: Number(res.powerDissipation.toFixed(4)),
      });
    }

    return points;
  }
}
