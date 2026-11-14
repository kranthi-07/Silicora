'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SimulationEngine } from './engine';
import {
  ElectricalInputs,
  ElectricalOutputs,
  IVCurvePoint,
  SimulationStatus,
  WaveformSample,
} from './types';
import { useWorkspaceStore } from '@/lib/store';

export interface UseSimulationReturn {
  engine: SimulationEngine;
  status: SimulationStatus;
  inputs: ElectricalInputs;
  outputs: ElectricalOutputs;
  waveformHistory: WaveformSample[];
  ivCurve: IVCurvePoint[];
  // Control actions
  setSupplyVoltage: (voltage: number) => void;
  setPrimaryParameter: (param: number) => void;
  setSecondaryParameter: (param: number) => void;
  setControlVoltage: (voltage: number) => void;
  setWaveform: (waveform: 'dc' | 'sine' | 'square' | 'pulse') => void;
  setFrequencyHz: (freq: number) => void;
  setAmbientTempC: (tempC: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  // Visual toggles
  showCurrentFlow: boolean;
  setShowCurrentFlow: (show: boolean) => void;
  showElectronDrift: boolean;
  setShowElectronDrift: (show: boolean) => void;
  showThermalHeatmap: boolean;
  setShowThermalHeatmap: (show: boolean) => void;
}

export function useSimulation(): UseSimulationReturn {
  const { selectedComponent } = useWorkspaceStore();
  const engine = useMemo(() => SimulationEngine.getInstance(), []);

  const [status, setStatus] = useState<SimulationStatus>(engine.getStatus());
  const [inputs, setInputs] = useState<ElectricalInputs>(engine.getInputs());
  const [outputs, setOutputs] = useState<ElectricalOutputs>(engine.getOutputs());
  const [waveformHistory, setWaveformHistory] = useState<WaveformSample[]>(engine.getWaveformHistory());
  const [ivCurve, setIvCurve] = useState<IVCurvePoint[]>(() => engine.generateActiveIVCurve());

  // Visualization display preferences
  const [showCurrentFlow, setShowCurrentFlow] = useState<boolean>(true);
  const [showElectronDrift, setShowElectronDrift] = useState<boolean>(true);
  const [showThermalHeatmap, setShowThermalHeatmap] = useState<boolean>(true);

  // Sync active model when selected component changes
  useEffect(() => {
    if (selectedComponent) {
      engine.setActiveComponent(selectedComponent.id);
      setInputs(engine.getInputs());
      setOutputs(engine.getOutputs());
      setWaveformHistory(engine.getWaveformHistory());
      setIvCurve(engine.generateActiveIVCurve());
      setStatus(engine.getStatus());
    }
  }, [selectedComponent, engine]);

  // Subscribe to real-time engine evaluation ticks
  useEffect(() => {
    const unsubscribe = engine.subscribe((newOutputs) => {
      setOutputs(newOutputs);
      setWaveformHistory(engine.getWaveformHistory());
      setStatus(engine.getStatus());
    });

    return () => {
      unsubscribe();
    };
  }, [engine]);

  // Actions
  const setSupplyVoltage = useCallback(
    (voltage: number) => {
      engine.updateInputs({ supplyVoltage: voltage });
      setInputs(engine.getInputs());
      setIvCurve(engine.generateActiveIVCurve());
    },
    [engine]
  );

  const setPrimaryParameter = useCallback(
    (param: number) => {
      engine.updateInputs({ primaryParameter: param });
      setInputs(engine.getInputs());
      setIvCurve(engine.generateActiveIVCurve());
    },
    [engine]
  );

  const setSecondaryParameter = useCallback(
    (param: number) => {
      engine.updateInputs({ secondaryParameter: param });
      setInputs(engine.getInputs());
      setIvCurve(engine.generateActiveIVCurve());
    },
    [engine]
  );

  const setControlVoltage = useCallback(
    (voltage: number) => {
      engine.updateInputs({ controlVoltage: voltage });
      setInputs(engine.getInputs());
      setIvCurve(engine.generateActiveIVCurve());
    },
    [engine]
  );

  const setWaveform = useCallback(
    (waveform: 'dc' | 'sine' | 'square' | 'pulse') => {
      engine.updateInputs({ waveform });
      setInputs(engine.getInputs());
    },
    [engine]
  );

  const setFrequencyHz = useCallback(
    (freq: number) => {
      engine.updateInputs({ frequencyHz: freq });
      setInputs(engine.getInputs());
    },
    [engine]
  );

  const setAmbientTempC = useCallback(
    (tempC: number) => {
      engine.updateInputs({ ambientTempC: tempC });
      setInputs(engine.getInputs());
    },
    [engine]
  );

  const start = useCallback(() => {
    engine.start();
    setStatus('running');
  }, [engine]);

  const pause = useCallback(() => {
    engine.pause();
    setStatus('paused');
  }, [engine]);

  const resume = useCallback(() => {
    engine.resume();
    setStatus('running');
  }, [engine]);

  const reset = useCallback(() => {
    engine.reset();
    setOutputs(engine.getOutputs());
    setWaveformHistory(engine.getWaveformHistory());
    setIvCurve(engine.generateActiveIVCurve());
    setStatus(engine.getStatus());
  }, [engine]);

  return {
    engine,
    status,
    inputs,
    outputs,
    waveformHistory,
    ivCurve,
    setSupplyVoltage,
    setPrimaryParameter,
    setSecondaryParameter,
    setControlVoltage,
    setWaveform,
    setFrequencyHz,
    setAmbientTempC,
    start,
    pause,
    resume,
    reset,
    showCurrentFlow,
    setShowCurrentFlow,
    showElectronDrift,
    setShowElectronDrift,
    showThermalHeatmap,
    setShowThermalHeatmap,
  };
}
