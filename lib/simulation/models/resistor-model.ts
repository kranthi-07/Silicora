import { BaseElectricalModel } from './base-model';
import { ElectricalInputs, ElectricalOutputs, IVCurvePoint } from '../types';

export class ResistorElectricalModel extends BaseElectricalModel {
  readonly id = 'pass_res_10k';
  readonly name = 'Resistor (Ohmic Conductor)';
  readonly category = 'passive';

  constructor(
    nominalResistanceOhms = 10000,
    maxPowerWatts = 0.25,
    maxVoltageVolts = 250
  ) {
    super();
    this.maxPowerW = maxPowerWatts;
    this.maxVoltageV = maxVoltageVolts;
    this.maxCurrentA = Math.sqrt(this.maxPowerW / nominalResistanceOhms);
    this.rThetaJA = 140; // 0.25W metal film typical
    this.rThetaJC = 60;
    this.tauThermal = 4.5;
  }

  public evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs {
    const supplyVoltage = inputs.supplyVoltage;
    // Guard against non-positive resistance to prevent division by zero
    const resistance = Math.max(0.01, inputs.primaryParameter || 10000);

    // If component is permanently burnt out from sustained overload:
    if (this.isPermanentlyBurnt) {
      const openCircuitResistance = 1e9; // 1 Giga-ohm
      const leakageCurrent = supplyVoltage / openCircuitResistance;
      const power = leakageCurrent * supplyVoltage;
      const thermal = this.updateThermalModel(0, dtSeconds, inputs.ambientTempC);
      const limits = this.evaluateLimits(supplyVoltage, leakageCurrent, power, dtSeconds);

      return {
        voltageDrop: supplyVoltage,
        branchCurrent: leakageCurrent,
        powerDissipation: power,
        conventionalCurrentVelocity: 0,
        electronDriftVelocity: 0,
        thermal,
        limits,
        extra: {
          effectiveResistance: openCircuitResistance,
          ohmicState: 'burnt_open_circuit',
          carrierScatteringRate: 0,
        },
      };
    }

    // Standard Ohmic calculation: V = I * R => I = V / R
    const branchCurrent = supplyVoltage / resistance;
    const powerDissipation = Math.abs(supplyVoltage * branchCurrent);

    // Update first-order thermal differential equation
    const thermal = this.updateThermalModel(
      powerDissipation,
      dtSeconds,
      inputs.ambientTempC
    );

    // Calculate signed velocities (strictly opposite for conventional vs electron!)
    const { conventionalVelocity, electronVelocity } =
      this.calculateDriftVelocities(branchCurrent);

    // Health envelope check
    const limits = this.evaluateLimits(
      supplyVoltage,
      branchCurrent,
      powerDissipation,
      dtSeconds
    );

    // Normalized carrier scattering rate (proportional to current density & lattice temp)
    const scatteringRate = Math.min(
      1.0,
      Math.abs(branchCurrent) / (this.maxCurrentA * 1.5)
    );

    return {
      voltageDrop: supplyVoltage,
      branchCurrent,
      powerDissipation,
      conventionalCurrentVelocity: conventionalVelocity,
      electronDriftVelocity: electronVelocity,
      thermal,
      limits,
      extra: {
        effectiveResistance: resistance,
        ohmicState: 'linear_conduction',
        carrierScatteringRate: scatteringRate,
      },
    };
  }

  public generateIVCurve(
    vMin: number = -15,
    vMax: number = 15,
    steps: number = 31,
    inputs?: Partial<ElectricalInputs>
  ): IVCurvePoint[] {
    const r = Math.max(0.01, inputs?.primaryParameter || 10000);
    const stepSize = (vMax - vMin) / (steps - 1);
    const points: IVCurvePoint[] = [];

    for (let i = 0; i < steps; i++) {
      const v = vMin + i * stepSize;
      const iCurrent = v / r;
      const p = Math.abs(v * iCurrent);
      points.push({
        voltage: Number(v.toFixed(3)),
        current: Number(iCurrent.toFixed(6)),
        power: Number(p.toFixed(4)),
      });
    }

    return points;
  }
}
