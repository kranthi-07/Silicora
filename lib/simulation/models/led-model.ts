import { BaseElectricalModel } from './base-model';
import { ElectricalInputs, ElectricalOutputs, IVCurvePoint } from '../types';

export class LedElectricalModel extends BaseElectricalModel {
  readonly id = 'opto_led_red_5mm';
  readonly name = '5mm Red Diffused LED';
  readonly category = 'optoelectronics';

  private forwardThreshold: number = 1.85; // Volts
  private ratedCurrent: number = 0.02; // 20mA nominal
  private ratedLumens: number = 2.5; // lm (635nm red)

  constructor() {
    super();
    this.maxVoltageV = 5.0; // Reverse breakdown rating
    this.maxCurrentA = 0.035; // 35mA Absolute Max
    this.maxPowerW = 0.085;
    this.rThetaJA = 300;
    this.rThetaJC = 120;
    this.tauThermal = 1.8;
  }

  public evaluate(
    inputs: ElectricalInputs,
    dtSeconds: number,
    previousState?: ElectricalOutputs
  ): ElectricalOutputs {
    const vApplied = inputs.supplyVoltage;
    let branchCurrent = 0;
    let forwardVoltageDrop = 0;
    let luminousFluxLm = 0;

    // Direct reverse breakdown damage if Vr > 5V
    if (vApplied < -this.maxVoltageV) {
      this.isPermanentlyBurnt = true;
    }

    if (this.isPermanentlyBurnt) {
      return {
        voltageDrop: vApplied,
        branchCurrent: 0,
        powerDissipation: 0,
        conventionalCurrentVelocity: 0,
        electronDriftVelocity: 0,
        thermal: this.updateThermalModel(0, dtSeconds, inputs.ambientTempC),
        limits: {
          isOverstressed: true,
          overstressReason: 'Reverse breakdown dielectric short destroyed semiconductor die.',
          stressFactor: 2.5,
          burnoutTriggered: true,
        },
        extra: {
          luminousFluxLumens: 0,
          emissiveIntensity: 0,
          photonWavelengthNm: 635,
          optoState: 'damaged',
        },
      };
    }

    if (vApplied <= 0) {
      // Reverse biased: negligible pico-amp leakage
      branchCurrent = -1e-11;
      forwardVoltageDrop = vApplied;
    } else if (vApplied < this.forwardThreshold) {
      // Sub-threshold exponential conduction
      const subRatio = vApplied / this.forwardThreshold;
      branchCurrent = 1e-6 * Math.exp(subRatio * 6.0);
      forwardVoltageDrop = vApplied;
    } else {
      // Forward conduction zone: dynamic slope resistance ~ 15 Ohms
      const rDyn = 15.0;
      branchCurrent = 0.001 + (vApplied - this.forwardThreshold) / rDyn;
      forwardVoltageDrop = this.forwardThreshold + branchCurrent * 8.0;

      // Radiometric Luminous Flux calculation:
      const activeCurrent = Math.max(0, branchCurrent - 0.0015);
      luminousFluxLm = this.ratedLumens * Math.pow(activeCurrent / this.ratedCurrent, 1.15);
    }

    const powerDissipation = Math.max(0, forwardVoltageDrop * branchCurrent);
    const thermal = this.updateThermalModel(powerDissipation, dtSeconds, inputs.ambientTempC);
    const { conventionalVelocity, electronVelocity } = this.calculateDriftVelocities(branchCurrent);
    const limits = this.evaluateLimits(forwardVoltageDrop, branchCurrent, powerDissipation, dtSeconds);

    // Normalized emissive glow for 3D shaders (0.0 to 1.5)
    const emissiveIntensity = Math.min(2.0, luminousFluxLm / this.ratedLumens);

    return {
      voltageDrop: forwardVoltageDrop,
      branchCurrent,
      powerDissipation,
      conventionalCurrentVelocity: conventionalVelocity,
      electronDriftVelocity: electronVelocity,
      thermal,
      limits,
      extra: {
        luminousFluxLumens: Number(luminousFluxLm.toFixed(2)),
        emissiveIntensity: Number(emissiveIntensity.toFixed(3)),
        photonWavelengthNm: 635,
        optoState: branchCurrent > 0.002 ? 'emitting' : 'off',
      },
    };
  }

  public generateIVCurve(
    vMin: number = -2,
    vMax: number = 2.4,
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
