import { ElectricalInputs, IVCurvePoint } from './types';

export interface NgspiceNetlistConfig {
  circuitTitle: string;
  netlistLines: string[];
  analysisCommand: string; // e.g. ".tran 10u 5m" or ".dc V1 -10 10 0.2"
}

export interface NgspiceRunResult {
  runId: string;
  converged: boolean;
  timeSteps?: Float64Array;
  vectors: Record<string, Float64Array>;
  stdoutLog: string[];
  elapsedMs: number;
}

/**
 * NgspiceAdapter
 * Provides netlist compilation and worker message protocol bridges
 * for advanced SPICE engine execution.
 */
export class NgspiceAdapter {
  /**
   * Synthesizes an authoritative SPICE netlist for the component bench test.
   */
  public static generateBenchNetlist(
    componentId: string,
    inputs: ElectricalInputs
  ): NgspiceNetlistConfig {
    const vIn = inputs.supplyVoltage;
    const lines: string[] = [];

    lines.push('* 3D Lab Bench Test Netlist');
    lines.push(`V_SRC 1 0 DC ${vIn}`);

    switch (componentId) {
      case 'pass_res_10k': {
        const rVal = inputs.primaryParameter || 10000;
        lines.push(`R1 1 0 ${rVal}`);
        return {
          circuitTitle: 'Resistor DC Characterization',
          netlistLines: lines,
          analysisCommand: '.dc V_SRC -15 15 0.5',
        };
      }

      case 'pass_cap_elec_470u': {
        const cVal = inputs.primaryParameter || 0.00047;
        const esr = inputs.secondaryParameter || 0.15;
        lines.push(`R_ESR 1 2 ${esr}`);
        lines.push(`C1 2 0 ${cVal} IC=0`);
        return {
          circuitTitle: 'Capacitor Transient Step Response',
          netlistLines: lines,
          analysisCommand: '.tran 100u 50m uic',
        };
      }

      case 'pass_ind_toroid_100u': {
        const lVal = inputs.primaryParameter || 0.0001;
        const dcr = inputs.secondaryParameter || 0.08;
        lines.push(`R_DCR 1 2 ${dcr}`);
        lines.push(`L1 2 0 ${lVal}`);
        return {
          circuitTitle: 'Inductor Step Response',
          netlistLines: lines,
          analysisCommand: '.tran 10u 5m uic',
        };
      }

      case 'opto_led_red_5mm': {
        lines.push('R_LIMIT 1 2 220');
        lines.push('D_LED 2 0 LED_RED_5MM');
        lines.push('.MODEL LED_RED_5MM D(IS=1E-20 N=1.8 RS=2.5 BV=5 IBV=10U EG=1.9)');
        return {
          circuitTitle: 'LED Optoelectronic Characterization',
          netlistLines: lines,
          analysisCommand: '.dc V_SRC 0 5 0.05',
        };
      }

      case 'semi_bjt_2n3904': {
        const vBase = inputs.controlVoltage ?? 2.5;
        lines.push(`V_BASE 3 0 DC ${vBase}`);
        lines.push('R_BASE 3 2 10k');
        lines.push('R_COL 1 4 1k');
        lines.push('Q1 4 2 0 Q2N3904');
        lines.push('.MODEL Q2N3904 NPN(IS=1E-14 VAF=100 BF=200 IKF=0.4)');
        return {
          circuitTitle: 'BJT Common Emitter Switch & Amp',
          netlistLines: lines,
          analysisCommand: '.dc V_SRC 0 15 0.2',
        };
      }

      default:
        lines.push(`R_DUMMY 1 0 10k`);
        return {
          circuitTitle: 'Default Bench Circuit',
          netlistLines: lines,
          analysisCommand: '.op',
        };
    }
  }

  /**
   * Generates a complete ready-to-run SPICE circuit deck string.
   */
  public static generateCircuitDeck(
    componentId: string,
    supplyVoltage: number = 5.0,
    primaryParameter?: number
  ): string {
    const config = this.generateBenchNetlist(componentId, {
      supplyVoltage,
      primaryParameter: primaryParameter || 10000,
    });

    return [
      `* 3D Lab Simulation Engine - ngspice Testbench Deck`,
      `* Title: ${config.circuitTitle}`,
      `* Component: ${componentId}`,
      ...config.netlistLines,
      config.analysisCommand,
      `.control`,
      `run`,
      `print all`,
      `.endc`,
      `.end`,
    ].join('\n');
  }

  /**
   * Adapts raw SPICE simulation vectors into uniform IVCurvePoint array.
   */
  public static mapSpiceVectorsToIVCurve(
    voltageVector: Float64Array,
    currentVector: Float64Array
  ): IVCurvePoint[] {
    const points: IVCurvePoint[] = [];
    const len = Math.min(voltageVector.length, currentVector.length);

    for (let i = 0; i < len; i++) {
      const v = voltageVector[i];
      const iVal = Math.abs(currentVector[i]);
      points.push({
        voltage: Number(v.toFixed(3)),
        current: Number(iVal.toFixed(6)),
        power: Number((v * iVal).toFixed(4)),
      });
    }

    return points;
  }
}
