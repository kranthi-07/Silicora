import { BaseElectricalModel } from './base-model';
import { ElectricalInputs, ElectricalOutputs, IVCurvePoint } from '../types';

export class BjtElectricalModel extends BaseElectricalModel {
  readonly id = 'semi_bjt_2n3904';
  readonly name = '2N3904 NPN BJT';
  readonly category = 'discrete_semiconductor';

  private hFE: number = 200; // Typical DC current gain beta
  private vBeThreshold: number = 0.65; // Base-Emitter forward turn-on voltage
  private vCeSat: number = 0.2; // Collector-Emitter saturation voltage

  constructor() {
    super();
    this.maxVoltageV = 40.0; // V_CEO
    this.maxCurrentA = 0.2; // 200mA Collector continuous
    this.maxPowerW = 0.625;
    this.rThetaJA = 200;
    this.rThetaJC = 83.3;
    this.tauThermal = 12.0;
  }

  public evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs {
    const vCC = inputs.supplyVoltage; // Collector supply voltage (V)
    const vBaseInput = inputs.controlVoltage ?? 2.5; // Base input driving voltage (V)
    const rBase = 10000; // 10k Base driving resistor
    const rCollector = inputs.primaryParameter || 1000; // 1k Collector load resistor

    // 1. Calculate Base Current I_B
    let iBase = 0;
    if (vBaseInput > this.vBeThreshold) {
      iBase = (vBaseInput - this.vBeThreshold) / rBase;
    }

    // 2. Transistor Operating Region Determination:
    // Max possible saturation current with load resistor
    const iColSat = Math.max(0, (vCC - this.vCeSat) / rCollector);
    const iColActive = iBase * this.hFE;

    let iCollector = 0;
    let vCE = vCC;
    let operatingRegion: 'cutoff' | 'active' | 'saturation' = 'cutoff';

    if (iBase <= 1e-9) {
      // Cutoff Region: Switch is OFF
      operatingRegion = 'cutoff';
      iCollector = 1e-9;
      vCE = vCC;
    } else if (iColActive >= iColSat) {
      // Saturation Region: Switch is ON (Fully turned on)
      operatingRegion = 'saturation';
      iCollector = iColSat;
      vCE = this.vCeSat;
    } else {
      // Active Amplification Region
      operatingRegion = 'active';
      iCollector = iColActive;
      vCE = vCC - (iCollector * rCollector);
    }

    // Power Dissipation: P_D = V_CE * I_C + V_BE * I_B
    const powerDissipation = Math.max(0, (vCE * iCollector) + (this.vBeThreshold * iBase));
    const thermal = this.updateThermalModel(powerDissipation, dtSeconds, inputs.ambientTempC);
    const { conventionalVelocity, electronVelocity } = this.calculateDriftVelocities(iCollector);
    const limits = this.evaluateLimits(vCE, iCollector, powerDissipation, dtSeconds);

    return {
      voltageDrop: vCE,
      branchCurrent: iCollector,
      powerDissipation,
      conventionalCurrentVelocity: conventionalVelocity,
      electronDriftVelocity: electronVelocity,
      thermal,
      limits,
      extra: {
        baseCurrentMicroAmps: Number((iBase * 1e6).toFixed(1)),
        collectorCurrentMilliAmps: Number((iCollector * 1e3).toFixed(2)),
        operatingRegion,
        transconductanceGm: Number(((iCollector / 0.026)).toFixed(3)),
        vCE: Number(vCE.toFixed(2)),
      },
    };
  }

  public generateIVCurve(
    vMin: number = 0,
    vMax: number = 20,
    steps: number = 41,
    inputs?: Partial<ElectricalInputs>
  ): IVCurvePoint[] {
    const stepSize = (vMax - vMin) / (steps - 1);
    const points: IVCurvePoint[] = [];

    for (let i = 0; i < steps; i++) {
      const v = vMin + i * stepSize;
      const res = this.evaluate({ supplyVoltage: v, primaryParameter: 1000, controlVoltage: inputs?.controlVoltage ?? 2.5 }, 0.01);
      points.push({
        voltage: Number(v.toFixed(2)),
        current: Number(res.branchCurrent.toFixed(6)),
        power: Number(res.powerDissipation.toFixed(4)),
      });
    }

    return points;
  }
}
