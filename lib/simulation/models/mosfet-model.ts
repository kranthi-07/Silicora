import { BaseElectricalModel } from './base-model';
import { ElectricalInputs, ElectricalOutputs, IVCurvePoint } from '../types';

export class MosfetElectricalModel extends BaseElectricalModel {
  readonly id = 'semi_mosfet_2n7000';
  readonly name = '2N7000 N-Channel MOSFET';
  readonly category = 'discrete_semiconductor';

  private vThreshold: number = 2.1; // Gate threshold voltage V_th (Volts)
  private transconductanceKn: number = 0.12; // A/V^2 process transconductance parameter
  private channelModLambda: number = 0.015; // 1/V Early voltage parameter

  constructor() {
    super();
    this.maxVoltageV = 60.0; // V_DS max
    this.maxCurrentA = 0.2; // 200mA continuous
    this.maxPowerW = 0.4;
    this.rThetaJA = 312.5;
    this.rThetaJC = 125;
    this.tauThermal = 8.0;
  }

  public evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs {
    const vDS = Math.max(0, inputs.supplyVoltage);
    const vGS = Math.max(0, inputs.controlVoltage ?? 5.0); // Gate-to-Source driving voltage
    const rLoad = inputs.primaryParameter || 500; // Load resistance

    let iDrain = 0;
    let operatingMode: 'cutoff' | 'triode_linear' | 'saturation' = 'cutoff';

    // 1. Cutoff Region: V_GS < V_th
    if (vGS < this.vThreshold) {
      operatingMode = 'cutoff';
      iDrain = 1e-9;
    } else {
      const vOverdrive = vGS - this.vThreshold;

      // 2. Linear / Triode Region: V_DS < V_GS - V_th
      if (vDS < vOverdrive) {
        operatingMode = 'triode_linear';
        iDrain = this.transconductanceKn * (vOverdrive * vDS - 0.5 * Math.pow(vDS, 2));
      }
      // 3. Saturation Region: V_DS >= V_GS - V_th (Square Law)
      else {
        operatingMode = 'saturation';
        iDrain =
          0.5 *
          this.transconductanceKn *
          Math.pow(vOverdrive, 2) *
          (1 + this.channelModLambda * vDS);
      }
    }

    // Limit maximum possible current through load resistance
    const iMaxLoad = vDS / rLoad;
    iDrain = Math.min(iDrain, iMaxLoad);

    const vDropDS = vDS - (iDrain * rLoad);
    const powerDissipation = Math.max(0, vDropDS * iDrain);

    const thermal = this.updateThermalModel(powerDissipation, dtSeconds, inputs.ambientTempC);
    const { conventionalVelocity, electronVelocity } = this.calculateDriftVelocities(iDrain);
    const limits = this.evaluateLimits(vDS, iDrain, powerDissipation, dtSeconds);

    const rdsOn = vGS >= 4.5 && iDrain > 0.01 ? Number((vDropDS / iDrain).toFixed(2)) : 5.0;

    return {
      voltageDrop: vDropDS,
      branchCurrent: iDrain,
      powerDissipation,
      conventionalCurrentVelocity: conventionalVelocity,
      electronDriftVelocity: electronVelocity,
      thermal,
      limits,
      extra: {
        operatingMode,
        gateOverdriveVoltage: Number(Math.max(0, vGS - this.vThreshold).toFixed(2)),
        drainCurrentMilliAmps: Number((iDrain * 1000).toFixed(2)),
        rdsOnOhms: rdsOn,
        vGS: Number(vGS.toFixed(2)),
      },
    };
  }

  public generateIVCurve(
    vMin: number = 0,
    vMax: number = 15,
    steps: number = 31,
    inputs?: Partial<ElectricalInputs>
  ): IVCurvePoint[] {
    const stepSize = (vMax - vMin) / (steps - 1);
    const points: IVCurvePoint[] = [];

    for (let i = 0; i < steps; i++) {
      const v = vMin + i * stepSize;
      const res = this.evaluate({ supplyVoltage: v, primaryParameter: 500, controlVoltage: inputs?.controlVoltage ?? 5.0 }, 0.01);
      points.push({
        voltage: Number(v.toFixed(2)),
        current: Number(res.branchCurrent.toFixed(6)),
        power: Number(res.powerDissipation.toFixed(4)),
      });
    }

    return points;
  }
}
