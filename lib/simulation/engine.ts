import {
  ElectricalInputs,
  ElectricalOutputs,
  IElectricalModel,
  IVCurvePoint,
  SimulationStatus,
  WaveformSample,
} from './types';
import { ResistorElectricalModel } from './models/resistor-model';
import { CapacitorElectricalModel } from './models/capacitor-model';
import { InductorElectricalModel } from './models/inductor-model';
import { DiodeElectricalModel } from './models/diode-model';
import { LedElectricalModel } from './models/led-model';
import { BjtElectricalModel } from './models/bjt-model';
import { MosfetElectricalModel } from './models/mosfet-model';

export type SimulationListener = (outputs: ElectricalOutputs, timeMs: number) => void;

export class SimulationEngine {
  private static instance: SimulationEngine;

  private models: Map<string, IElectricalModel> = new Map();
  private activeModel: IElectricalModel;
  private status: SimulationStatus = 'running';
  private simTimeMs: number = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: Set<SimulationListener> = new Set();

  private inputs: ElectricalInputs = {
    supplyVoltage: 5.0, // 5V default
    primaryParameter: 10000, // 10k resistor default
    secondaryParameter: 0.1,
    frequencyHz: 60,
    waveform: 'dc',
    ambientTempC: 25.0,
    controlVoltage: 2.5,
  };

  private lastOutputs: ElectricalOutputs;
  private waveformHistory: WaveformSample[] = [];
  private maxHistorySamples: number = 120;

  private constructor() {
    // Register all initial component models
    const resistor = new ResistorElectricalModel();
    const capacitor = new CapacitorElectricalModel();
    const inductor = new InductorElectricalModel();
    const diode = new DiodeElectricalModel();
    const led = new LedElectricalModel();
    const bjt = new BjtElectricalModel();
    const mosfet = new MosfetElectricalModel();

    this.models.set('pass_res_10k', resistor);
    this.models.set('pass_cap_elec_470u', capacitor);
    this.models.set('pass_ind_toroid_100u', inductor);
    this.models.set('semi_diode_1n4148', diode);
    this.models.set('opto_led_red_5mm', led);
    this.models.set('semi_bjt_2n3904', bjt);
    this.models.set('semi_mosfet_2n7000', mosfet);

    this.activeModel = resistor;
    this.lastOutputs = this.activeModel.evaluate(this.inputs, 0.016);
    this.start();
  }

  public static getInstance(): SimulationEngine {
    if (!SimulationEngine.instance) {
      SimulationEngine.instance = new SimulationEngine();
    }
    return SimulationEngine.instance;
  }

  public setActiveComponent(componentId: string): void {
    const model = this.models.get(componentId);
    if (model) {
      this.activeModel = model;
      this.activeModel.reset();
      this.waveformHistory = [];
      // Adjust default primary parameters per component type
      if (componentId === 'pass_res_10k') {
        this.inputs.primaryParameter = 10000;
        this.inputs.supplyVoltage = 5.0;
      } else if (componentId === 'pass_cap_elec_470u') {
        this.inputs.primaryParameter = 0.00047;
        this.inputs.supplyVoltage = 12.0;
      } else if (componentId === 'pass_ind_toroid_100u') {
        this.inputs.primaryParameter = 0.0001;
        this.inputs.supplyVoltage = 5.0;
      } else if (componentId === 'opto_led_red_5mm') {
        this.inputs.supplyVoltage = 2.1;
      } else if (componentId === 'semi_bjt_2n3904') {
        this.inputs.supplyVoltage = 9.0;
        this.inputs.controlVoltage = 2.5;
        this.inputs.primaryParameter = 1000;
      } else if (componentId === 'semi_mosfet_2n7000') {
        this.inputs.supplyVoltage = 10.0;
        this.inputs.controlVoltage = 5.0;
        this.inputs.primaryParameter = 500;
      }

      this.step(0.016);
    }
  }

  public getActiveModel(): IElectricalModel {
    return this.activeModel;
  }

  public updateInputs(partial: Partial<ElectricalInputs>): void {
    this.inputs = { ...this.inputs, ...partial };
    this.step(0.016);
  }

  public getInputs(): ElectricalInputs {
    return { ...this.inputs };
  }

  public getOutputs(): ElectricalOutputs {
    return this.lastOutputs;
  }

  public getWaveformHistory(): WaveformSample[] {
    return [...this.waveformHistory];
  }

  public getStatus(): SimulationStatus {
    return this.status;
  }

  public start(): void {
    if (this.intervalId) return;
    this.status = 'running';
    // Run 60Hz evaluation step (16.6ms)
    this.intervalId = setInterval(() => {
      if (this.status === 'running') {
        this.step(0.016);
      }
    }, 16);

    // In Node.js / test environments, unref to avoid blocking process exit
    if (this.intervalId && typeof this.intervalId === 'object' && 'unref' in this.intervalId) {
      (this.intervalId as any).unref();
    }
  }

  public pause(): void {
    this.status = 'paused';
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public stop(): void {
    this.pause();
  }

  public resume(): void {
    this.status = 'running';
    if (!this.intervalId) {
      this.start();
    }
  }

  public reset(): void {
    this.activeModel.reset();
    this.simTimeMs = 0;
    this.waveformHistory = [];
    this.step(0.016);
  }

  public step(dtSeconds: number): ElectricalOutputs {
    // Determine effective supply voltage based on waveform setting
    let effectiveSupplyV = this.inputs.supplyVoltage;
    if (this.inputs.waveform === 'sine') {
      const f = this.inputs.frequencyHz || 60;
      const omega = 2 * Math.PI * f;
      effectiveSupplyV = this.inputs.supplyVoltage * Math.sin(omega * (this.simTimeMs / 1000));
    } else if (this.inputs.waveform === 'square') {
      const f = this.inputs.frequencyHz || 60;
      const period = 1000 / f;
      effectiveSupplyV = (this.simTimeMs % period) < period / 2 ? this.inputs.supplyVoltage : -this.inputs.supplyVoltage;
    }

    const currentInputs = { ...this.inputs, supplyVoltage: effectiveSupplyV };
    const outputs = this.activeModel.evaluate(currentInputs, dtSeconds, this.lastOutputs);
    this.lastOutputs = outputs;
    this.simTimeMs += dtSeconds * 1000;

    // Record sample in waveform history
    this.waveformHistory.push({
      timeMs: Number(this.simTimeMs.toFixed(1)),
      voltage: outputs.voltageDrop,
      current: outputs.branchCurrent,
      power: outputs.powerDissipation,
      temperatureC: outputs.thermal.junctionTempC,
    });

    if (this.waveformHistory.length > this.maxHistorySamples) {
      this.waveformHistory.shift();
    }

    // Notify listeners
    this.listeners.forEach((cb) => cb(outputs, this.simTimeMs));
    return outputs;
  }

  public subscribe(listener: SimulationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public generateActiveIVCurve(steps: number = 31): IVCurvePoint[] {
    return this.activeModel.generateIVCurve(-12, 12, steps, this.inputs);
  }
}
