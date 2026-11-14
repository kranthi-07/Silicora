import { BaseElectricalModel } from './base-model';
import { ElectricalInputs, ElectricalOutputs, IVCurvePoint } from '../types';

export class InductorElectricalModel extends BaseElectricalModel {
  readonly id = 'pass_ind_toroid_100u';
  readonly name = 'Toroidal Inductor';
  readonly category = 'passive';

  private storedCurrent: number = 0; // Internal inductor branch current I_L

  constructor(inductanceHenries = 0.0001, maxCurrentAmps = 2.5) {
    super();
    this.maxVoltageV = 100;
    this.maxCurrentA = maxCurrentAmps;
    this.maxPowerW = 1.2;
    this.rThetaJA = 65;
    this.rThetaJC = 25;
    this.tauThermal = 25;
  }

  public reset(): void {
    super.reset();
    this.storedCurrent = 0;
  }

  public evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs {
    const supplyVoltage = inputs.supplyVoltage;
    const inductance = Math.max(1e-9, inputs.primaryParameter || 0.0001);
    const dcr = Math.max(0.01, inputs.secondaryParameter || 0.08); // DC Winding Resistance (Ohms)

    // Dynamic RL Step:
    // dI / dt = (V_supply - I * DCR) / L
    const dI = ((supplyVoltage - this.storedCurrent * dcr) / inductance) * Math.min(dtSeconds, 0.05);
    this.storedCurrent += dI;

    const voltageDrop = supplyVoltage - (this.storedCurrent * dcr);
    const branchCurrent = this.storedCurrent;
    const powerDissipation = Math.pow(branchCurrent, 2) * dcr;

    const magneticFlux = inductance * branchCurrent;
    const storedEnergy = 0.5 * inductance * Math.pow(branchCurrent, 2);

    const thermal = this.updateThermalModel(powerDissipation, dtSeconds, inputs.ambientTempC);
    const { conventionalVelocity, electronVelocity } = this.calculateDriftVelocities(branchCurrent);
    const limits = this.evaluateLimits(voltageDrop, branchCurrent, powerDissipation, dtSeconds);

    return {
      voltageDrop,
      branchCurrent,
      powerDissipation,
      conventionalCurrentVelocity: conventionalVelocity,
      electronDriftVelocity: electronVelocity,
      thermal,
      limits,
      extra: {
        magneticFluxWebers: Number(magneticFlux.toExponential(3)),
        storedEnergyJoules: Number(storedEnergy.toExponential(3)),
        coreSaturationPercent: Number(Math.min(100, (Math.abs(branchCurrent) / this.maxCurrentA) * 100).toFixed(1)),
      },
    };
  }

  public generateIVCurve(
    vMin: number = 0,
    vMax: number = 5,
    steps: number = 21,
    inputs?: Partial<ElectricalInputs>
  ): IVCurvePoint[] {
    const dcr = Math.max(0.01, inputs?.secondaryParameter || 0.08);
    const stepSize = (vMax - vMin) / (steps - 1);
    const points: IVCurvePoint[] = [];

    for (let i = 0; i < steps; i++) {
      const v = vMin + i * stepSize;
      const iSteady = v / dcr;
      points.push({
        voltage: Number(v.toFixed(2)),
        current: Number(iSteady.toFixed(3)),
        power: Number((v * iSteady).toFixed(3)),
      });
    }

    return points;
  }
}
