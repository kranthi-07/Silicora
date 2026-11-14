import test from 'node:test';
import assert from 'node:assert/strict';
import { ResistorElectricalModel } from '../lib/simulation/models/resistor-model';
import { CapacitorElectricalModel } from '../lib/simulation/models/capacitor-model';
import { InductorElectricalModel } from '../lib/simulation/models/inductor-model';
import { DiodeElectricalModel } from '../lib/simulation/models/diode-model';
import { LedElectricalModel } from '../lib/simulation/models/led-model';
import { BjtElectricalModel } from '../lib/simulation/models/bjt-model';
import { MosfetElectricalModel } from '../lib/simulation/models/mosfet-model';
import { SimulationEngine } from '../lib/simulation/engine';
import { NgspiceAdapter } from '../lib/simulation/ngspice-adapter';

test('Resistor Simulation: Ohms Law and Power Dissipation', () => {
  const resistor = new ResistorElectricalModel(1000, 0.25, 250); // 1k ohm, 0.25W
  const out = resistor.evaluate({ supplyVoltage: 10.0, primaryParameter: 1000 }, 0.016);

  // V = 10V, R = 1000 => I = 0.01 A (10 mA)
  assert.equal(out.voltageDrop, 10.0);
  assert.equal(Math.round(out.branchCurrent * 1000), 10);
  // P = V * I = 10 * 0.01 = 0.1 W
  assert.equal(Math.round(out.powerDissipation * 100) / 100, 0.1);
  assert.equal(out.limits.isOverstressed, false);
});

test('Scientific Invariant: Electron Drift and Conventional Current have OPPOSITE directions', () => {
  const resistor = new ResistorElectricalModel(1000);

  // Positive supply voltage (+5V)
  const positiveSweep = resistor.evaluate({ supplyVoltage: 5.0, primaryParameter: 1000 }, 0.016);
  assert.ok(
    positiveSweep.conventionalCurrentVelocity > 0,
    'Conventional current must be positive for positive voltage'
  );
  assert.ok(
    positiveSweep.electronDriftVelocity < 0,
    'Electron drift must be strictly NEGATIVE for positive conventional current'
  );
  assert.equal(
    Math.sign(positiveSweep.conventionalCurrentVelocity),
    -Math.sign(positiveSweep.electronDriftVelocity),
    'Signs of conventional velocity and electron drift velocity must be opposite!'
  );

  // Negative supply voltage (-5V)
  const negativeSweep = resistor.evaluate({ supplyVoltage: -5.0, primaryParameter: 1000 }, 0.016);
  assert.ok(
    negativeSweep.conventionalCurrentVelocity < 0,
    'Conventional current must be negative for negative voltage'
  );
  assert.ok(
    negativeSweep.electronDriftVelocity > 0,
    'Electron drift must be strictly POSITIVE for negative conventional current'
  );
  assert.equal(
    Math.sign(negativeSweep.conventionalCurrentVelocity),
    -Math.sign(negativeSweep.electronDriftVelocity),
    'Signs of conventional velocity and electron drift velocity must be opposite!'
  );
});

test('Resistor Thermal Integrator: Temperature Rises with Dissipation and Cools when Off', () => {
  const resistor = new ResistorElectricalModel(100, 0.25); // 100 ohm
  // Apply 4V => P = 16 / 100 = 0.16W (dissipating heat)
  let state = resistor.evaluate({ supplyVoltage: 4.0, primaryParameter: 100, ambientTempC: 25.0 }, 0.016);
  const initialTemp = state.thermal.junctionTempC;
  assert.ok(initialTemp >= 25.0, 'Initial junction temperature should start at ambient');

  // Simulate heating over 2 seconds (100 steps of 0.02s)
  for (let i = 0; i < 100; i++) {
    state = resistor.evaluate({ supplyVoltage: 4.0, primaryParameter: 100, ambientTempC: 25.0 }, 0.02, state);
  }
  const heatedTemp = state.thermal.junctionTempC;
  assert.ok(
    heatedTemp > initialTemp,
    `Resistor must heat up above ambient (got ${heatedTemp.toFixed(1)}°C, initial ${initialTemp}°C)`
  );

  // Turn off supply voltage (0V) and simulate cooling over 2 seconds
  for (let i = 0; i < 100; i++) {
    state = resistor.evaluate({ supplyVoltage: 0.0, primaryParameter: 100, ambientTempC: 25.0 }, 0.02, state);
  }
  const cooledTemp = state.thermal.junctionTempC;
  assert.ok(
    cooledTemp < heatedTemp,
    `Resistor must cool down towards ambient when power removed (got ${cooledTemp.toFixed(1)}°C)`
  );
});

test('Resistor Overstress and Permanent Burnout Mode', () => {
  const resistor = new ResistorElectricalModel(100, 0.25); // 0.25W max rated
  // Severely overload: 24V on 100 ohm => P = 5.76 W (23x over rating!)
  let state = resistor.evaluate({ supplyVoltage: 24.0, primaryParameter: 100 }, 0.016);

  // Advance time until burnout triggers (> 1.5 seconds)
  for (let i = 0; i < 200; i++) {
    state = resistor.evaluate({ supplyVoltage: 24.0, primaryParameter: 100 }, 0.02, state);
    if (state.limits.burnoutTriggered) {
      // Step once more to evaluate the post-burnout open-circuit state
      state = resistor.evaluate({ supplyVoltage: 24.0, primaryParameter: 100 }, 0.02, state);
      break;
    }
  }

  assert.equal(state.limits.burnoutTriggered, true, 'Component should trigger burnout under 23x power overload');
  // Burnt component should transition to high impedance open circuit (1 GΩ)
  assert.ok(
    state.branchCurrent < 1e-6,
    `Burnt resistor must act as open circuit (leakage current < 1 µA, got ${state.branchCurrent} A)`
  );
});

test('Capacitor Dynamic RC Integrator: Charging Profile', () => {
  const capacitor = new CapacitorElectricalModel(0.001); // 1000 µF
  let state = capacitor.evaluate({ supplyVoltage: 10.0, primaryParameter: 0.001, secondaryParameter: 100 }, 0.016);
  assert.ok(state.voltageDrop > 0, 'Capacitor starts charging on first step');
  const step1Voltage = state.voltageDrop;

  // Step evaluate over time
  for (let i = 0; i < 50; i++) {
    state = capacitor.evaluate({ supplyVoltage: 10.0, primaryParameter: 0.001, secondaryParameter: 100 }, 0.016, state);
  }
  assert.ok(
    state.voltageDrop > step1Voltage,
    `Capacitor must accumulate charge over time (got ${state.voltageDrop.toFixed(2)}V > ${step1Voltage.toFixed(2)}V)`
  );
  assert.ok(
    state.voltageDrop <= 10.0,
    'Capacitor voltage must not exceed supply rail'
  );
});

test('Inductor Dynamic RL Integrator: Current Growth and Stored Energy', () => {
  const inductor = new InductorElectricalModel(0.01); // 10 mH
  let state = inductor.evaluate({ supplyVoltage: 5.0, primaryParameter: 0.01 }, 0.016);

  for (let i = 0; i < 60; i++) {
    state = inductor.evaluate({ supplyVoltage: 5.0, primaryParameter: 0.01 }, 0.016, state);
  }
  assert.ok(state.branchCurrent > 0, 'Inductor current must build up');
  assert.ok(
    Number(state.extra.storedEnergyJoules) > 0,
    'Inductor must store magnetic field energy (E = 0.5 * L * I^2)'
  );
});

test('Diode Shockley Equation: Forward Knee vs Reverse Leakage', () => {
  const diode = new DiodeElectricalModel();
  
  // Reverse bias (-5V): current must be minuscule leakage
  const reverseState = diode.evaluate({ supplyVoltage: -5.0, primaryParameter: 0.026 }, 0.016);
  assert.ok(
    Math.abs(reverseState.branchCurrent) < 1e-6,
    'Reverse current must be tiny leakage (< 1 µA)'
  );

  // Below forward knee (0.3V): negligible conduction
  const lowForwardState = diode.evaluate({ supplyVoltage: 0.3, primaryParameter: 0.026 }, 0.016);
  assert.ok(lowForwardState.branchCurrent < 0.001, 'Current below 0.3V should be negligible');

  // Above forward knee (0.75V): exponential conduction
  const highForwardState = diode.evaluate({ supplyVoltage: 0.75, primaryParameter: 0.026 }, 0.016);
  assert.ok(
    highForwardState.branchCurrent > 0.01,
    `Forward conduction above 0.7V must conduct current (got ${(highForwardState.branchCurrent * 1e3).toFixed(1)} mA)`
  );
});

test('LED Optical Emission: Turn-on Forward Threshold and Radiometric Flux', () => {
  const led = new LedElectricalModel();

  // 1.0V (below red LED 1.85V bandgap): zero lumens
  const offState = led.evaluate({ supplyVoltage: 1.0, primaryParameter: 1.85 }, 0.016);
  assert.equal(offState.extra.luminousFluxLumens, 0, 'LED must not emit light below turn-on voltage');

  // 2.2V (above red LED bandgap): active light emission
  const onState = led.evaluate({ supplyVoltage: 2.2, primaryParameter: 1.85 }, 0.016);
  assert.ok(
    Number(onState.extra.luminousFluxLumens) > 0,
    'LED must emit photons/lumens when forward biased above threshold'
  );
  assert.ok(
    Number(onState.extra.emissiveIntensity) > 0,
    'Emissive intensity must be positive'
  );
});

test('BJT Transistor: Active Amplification and Saturation', () => {
  const bjt = new BjtElectricalModel(); // Default Small Signal

  // Cutoff mode: Vbe = 0V
  const cutoff = bjt.evaluate({ supplyVoltage: 10.0, controlVoltage: 0.0, primaryParameter: 1000 }, 0.016);
  assert.equal(cutoff.extra.operatingRegion, 'cutoff');
  assert.ok(cutoff.branchCurrent < 1e-6, 'Cutoff collector current must be near zero');

  // Active mode: Vbe = 0.75V
  const active = bjt.evaluate({ supplyVoltage: 10.0, controlVoltage: 0.75, primaryParameter: 1000 }, 0.016);
  assert.ok(
    active.branchCurrent > 0.001,
    'Active mode should have amplified collector current'
  );
  assert.ok(
    active.extra.operatingRegion === 'active' || active.extra.operatingRegion === 'saturation'
  );
});

test('MOSFET: Triode and Saturation Regimes', () => {
  const mosfet = new MosfetElectricalModel(); // Vth = 2.1V

  // Vgs below threshold (1.0V): cutoff (sub-threshold leakage < 1 µA)
  const cutoff = mosfet.evaluate({ supplyVoltage: 10.0, controlVoltage: 1.0, primaryParameter: 500 }, 0.016);
  assert.equal(cutoff.extra.operatingMode, 'cutoff');
  assert.ok(cutoff.branchCurrent < 1e-6, 'Cutoff drain leakage current must be < 1 µA');

  // Vgs above threshold (5.0V): saturation
  const sat = mosfet.evaluate({ supplyVoltage: 10.0, controlVoltage: 5.0, primaryParameter: 500 }, 0.016);
  assert.equal(sat.extra.operatingMode, 'saturation');
  assert.ok(sat.branchCurrent > 0.01, 'Drain current in saturation must be non-zero');
});

test('ngspice Netlist Generation via NgspiceAdapter', () => {
  const resistorDeck = NgspiceAdapter.generateCircuitDeck('pass_res_10k', 12.0, 10000);
  assert.ok(resistorDeck.includes('* 3D Lab Simulation Engine - ngspice Testbench Deck'));
  assert.ok(resistorDeck.includes('V_SRC 1 0 DC 12'));
  assert.ok(resistorDeck.includes('R1 1 0 10000'));
  assert.ok(resistorDeck.includes('.end'));

  const ledDeck = NgspiceAdapter.generateCircuitDeck('opto_led_red_5mm', 5.0);
  assert.ok(ledDeck.includes('D_LED'));
  assert.ok(ledDeck.includes('.MODEL LED_RED_5MM'));
});

test('SimulationEngine Singleton and State Observer Integration', () => {
  const engine = SimulationEngine.getInstance();
  assert.ok(engine, 'Singleton instance should exist');

  engine.setActiveComponent('pass_res_10k');
  engine.updateInputs({ supplyVoltage: 15.0, primaryParameter: 5000 });

  let notified = false;
  const unsubscribe = engine.subscribe((outputs) => {
    notified = true;
    assert.equal(outputs.voltageDrop, 15.0);
  });

  const stepOutputs = engine.step(0.016);
  assert.equal(stepOutputs.voltageDrop, 15.0);
  assert.ok(notified, 'Subscribers must be notified on evaluation step');

  unsubscribe();

  // Test I-V curve generation
  const curve = engine.generateActiveIVCurve(15);
  assert.equal(curve.length, 15);
  assert.ok(curve[0].voltage < curve[curve.length - 1].voltage);

  engine.pause();
});
