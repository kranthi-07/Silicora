'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { AxialResistorModel } from './models/axial-resistor-model';
import { ElectrolyticCapModel } from './models/electrolytic-cap-model';
import { CeramicCapModel } from './models/ceramic-cap-model';
import { LedModel } from './models/led-model';
import { DiodeModel } from './models/diode-model';
import { BjtTo92Model } from './models/bjt-to92-model';
import { MosfetTo92Model } from './models/mosfet-to92-model';
import { IcDipModel } from './models/ic-dip-model';
import { PhotoresistorModel } from './models/photoresistor-model';
import { PotentiometerModel } from './models/potentiometer-model';
import { TactileSwitchModel } from './models/tactile-switch-model';
import { ToroidInductorModel } from './models/toroid-inductor-model';
import { PiezoBuzzerModel } from './models/piezo-buzzer-model';
import { TemperatureSensorModel } from './models/temperature-sensor-model';
import { ComputeBoardModel } from './models/compute-board-model';
import { BatteryCellModel } from './models/battery-cell-model';
import { UnsupportedModel } from './models/unsupported-model';
import { InteractivePinLabels } from './interactive-labels';
import { BurnoutSmokeEffect } from './burnout-smoke-effect';

export function ComponentRenderer() {
  const selectedComponent = useWorkspaceStore((state) => state.selectedComponent);

  if (!selectedComponent) return null;

  const renderModel = () => {
    const { id, symbolType, package: pkg } = selectedComponent;

    // 1. Resistors
    if (id === 'pass_res_10k' || symbolType === 'resistor' || pkg.standardCode.startsWith('Axial')) {
      return <AxialResistorModel />;
    }

    // 2. Capacitors
    if (id === 'pass_cap_elec_470u' || symbolType === 'polarized_capacitor' || pkg.standardCode.includes('Radial-Can')) {
      return <ElectrolyticCapModel />;
    }
    if (id === 'pass_cap_cer_100n' || pkg.standardCode.includes('Disc')) {
      return <CeramicCapModel />;
    }

    // 3. Optoelectronics & LEDs
    if (id === 'opto_led_red_5mm' || symbolType === 'led') {
      return <LedModel />;
    }

    // 4. Ordinary Diodes (1N4148 DO-35, 1N4007 DO-41)
    if (
      id === 'semi_diode_1n4148' ||
      id === 'semi_diode_1n4007' ||
      symbolType === 'diode' ||
      pkg.standardCode === 'DO-35' ||
      pkg.standardCode === 'DO-41'
    ) {
      return <DiodeModel variant={pkg.standardCode === 'DO-41' ? 'do41' : 'do35'} />;
    }

    // 5. Bipolar Junction Transistors (BJTs)
    if (id === 'semi_bjt_2n3904' || symbolType === 'bjt_npn') {
      return <BjtTo92Model />;
    }

    // 6. Field-Effect Transistors (MOSFETs)
    if (id === 'semi_mosfet_2n7000' || symbolType === 'mosfet_n') {
      return <MosfetTo92Model />;
    }

    // 7. Integrated Circuits (DIP-8: NE555 Timer, LM358 Op-Amp)
    if (id === 'ic_ne555_timer' || id === 'ic_lm358_opamp' || pkg.standardCode.includes('DIP')) {
      return <IcDipModel />;
    }

    // 8. Photoresistors & CdS LDR
    if (id === 'sensor_ldr_5mm' || symbolType === 'photoresistor' || pkg.standardCode.includes('LDR')) {
      return <PhotoresistorModel />;
    }

    // 9. Potentiometers
    if (id === 'pass_pot_10k' || symbolType === 'potentiometer') {
      return <PotentiometerModel />;
    }

    // 10. Tactile Switches
    if (id === 'sw_tact_6mm' || symbolType === 'switch' || pkg.standardCode.includes('Tact')) {
      return <TactileSwitchModel />;
    }

    // 11. Inductors & Toroids
    if (id === 'pass_ind_toroid_100u' || symbolType === 'inductor') {
      return <ToroidInductorModel />;
    }

    // 12. Acoustic Piezo Buzzers
    if (id === 'out_buzzer_5v' || symbolType === 'buzzer') {
      return <PiezoBuzzerModel />;
    }

    // 13. Temperature Sensors (LM35)
    if (id === 'sensor_temp_lm35' || id.includes('temp') || id.includes('lm35')) {
      return <TemperatureSensorModel />;
    }

    // 14. Compute & Microcontroller Boards
    if (id.includes('pico') || id.includes('arduino') || id.includes('board')) {
      return <ComputeBoardModel variant={id.includes('arduino') ? 'arduino' : 'pico'} />;
    }

    // 15. Power & Batteries
    if (id.includes('battery') || symbolType === 'battery') {
      return <BatteryCellModel variant={id.includes('aa') ? 'aa' : '9v'} />;
    }

    // 16. Explicit Unsupported Model Fallback
    return <UnsupportedModel />;
  };

  return (
    <group name="ActiveComponentAssembly">
      {renderModel()}
      <InteractivePinLabels pins={selectedComponent.package.pins} />
      <BurnoutSmokeEffect />
    </group>
  );
}
