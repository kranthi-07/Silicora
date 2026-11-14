import { BaseElectricalModel } from './base-model';
import { ElectricalInputs, ElectricalOutputs, IVCurvePoint } from '../types';

export class CapacitorElectricalModel extends BaseElectricalModel {
  readonly id = 'pass_cap_elec_470u';
  readonly name = 'Electrolytic Capacitor';
  readonly category = 'passive';

  private storedVoltage: number = 0; // Internal capacitor plate voltage V_c

  constructor(capacitanceFarads = 0.00047, maxVoltageVolts = 25) {
    super();
    this.maxVoltageV = maxVoltageVolts;
    this.maxCurrentA = 2.5; // Ripple current max
    this.maxPowerW = 0.35;
    this.rThetaJA = 90;
    this.rThetaJC = 35;
    this.tauThermal = 18;
  }

  public reset(): void {
    super.reset();
    this.storedVoltage = 0;
  }

  public evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs {
    const supplyVoltage = inputs.supplyVoltage;
    const capacitance = Math.max(1e-12, inputs.primaryParameter || 0.00047);
    const esr = Math.max(0.01, inputs.secondaryParameter || 0.15); // Equivalent Series Resistance

    // Overvoltage breakdown
    if (Math.abs(supplyVoltage) > this.maxVoltageV * 1.3) {
      this.isPermanentlyBurnt = true;
    }

    if (this.isPermanentlyBurnt) {
      const leakage = supplyVoltage / 0.1; // Short circuit failure
      const power = leakage * supplyVoltage;
      const thermal = this.updateThermalModel(power, dtSeconds, inputs.ambientTempC);
      const limits = this.evaluateLimits(supplyVoltage, leakage, power, dtSeconds);

      return {
        voltageDrop: supplyVoltage,
        branchCurrent: leakage,
        powerDissipation: power,
        conventionalCurrentVelocity: 0,
        electronDriftVelocity: 0,
        thermal,
        limits,
        extra: {
          storedChargeCoulombs: 0,
          storedEnergyJoules: 0,
          stateOfCharge: 0,
        },
      };
    }

    // Dynamic RC Charging/Discharging step:
    // dV_c / dt = (V_supply - V_c) / (ESR * C)
    const tauRC = Math.max(1e-6, esr * capacitance);
    const dVc = ((supplyVoltage - this.storedVoltage) / tauRC) * Math.min(dtSeconds, 0.1);
    this.storedVoltage += dVc;

    // Charging/Discharging branch current: I_c = C * (dVc / dt)
    const branchCurrent = (supplyVoltage - this.storedVoltage) / esr;
    const powerDissipation = Math.abs(branchCurrent * branchCurrent * esr);

    const storedCharge = capacitance * this.storedVoltage;
    const storedEnergy = 0.5 * capacitance * Math.pow(this.storedVoltage, 2);

    const thermal = this.updateThermalModel(powerDissipation, dtSeconds, inputs.ambientTempC);
    const { conventionalVelocity, electronVelocity } = this.calculateDriftVelocities(branchCurrent);
    const limits = this.evaluateLimits(this.storedVoltage, branchCurrent, powerDissipation, dtSeconds);

    return {
      voltageDrop: this.storedVoltage,
      branchCurrent,
      powerDissipation,
      conventionalCurrentVelocity: conventionalVelocity,
      electronDriftVelocity: electronVelocity,
      thermal,
      limits,
      extra: {
        storedChargeCoulombs: Number(storedCharge.toExponential(3)),
        storedEnergyJoules: Number(storedEnergy.toExponential(3)),
        stateOfCharge: Number((Math.abs(this.storedVoltage) / this.maxVoltageV).toFixed(3)),
        plateVoltage: Number(this.storedVoltage.toFixed(2)),
      },
    };
  }

  public generateIVCurve(
    vMin: number = 0,
    vMax: number = 25,
    steps: number = 31,
    inputs?: Partial<ElectricalInputs>
  ): IVCurvePoint[] {
    const c = Math.max(1e-12, inputs?.primaryParameter || 0.00047);
    const esr = Math.max(0.01, inputs?.secondaryParameter || 0.15);
    const stepSize = (vMax - vMin) / (steps - 1);
    const points: IVCurvePoint[] = [];

    for (let i = 0; i < steps; i++) {
      const v = vMin + i * stepSize;
      const iPeak = v / esr;
      const energy = 0.5 * c * v * v;
      points.push({
        voltage: Number(v.toFixed(2)),
        current: Number(iPeak.toFixed(3)),
        power: Number(energy.toFixed(4)),
      });
    }

    return points;
  }
}
