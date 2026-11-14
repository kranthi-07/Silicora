import test from 'node:test';
import assert from 'node:assert/strict';
import { solveCircuit } from '../lib/circuit/circuit-solver';
import { CIRCUIT_PRESETS } from '../lib/circuit/circuit-presets';
import {
  getBreadboardBusId,
  getHolePositionMm,
  generateBreadboardHoles,
} from '../lib/circuit/breadboard-topology';
import { CircuitElementInstance, WireConnection } from '../lib/circuit/types';

test('Breadboard Topology: Tie-point physical coordinates and spring clip bus grouping', () => {
  const holes = generateBreadboardHoles();
  assert.equal(holes.length, 420); // 30 cols * (2 pwr top + 5 term top + 5 term bot + 2 pwr bot = 14) = 420 holes

  // Same terminal column sharing spring clip bus
  const bus10a = getBreadboardBusId('terminal_top', 10, 'a');
  const bus10b = getBreadboardBusId('terminal_top', 10, 'b');
  const bus10e = getBreadboardBusId('terminal_top', 10, 'e');
  const bus11a = getBreadboardBusId('terminal_top', 11, 'a');
  const bus10f = getBreadboardBusId('terminal_bottom', 10, 'f');

  assert.equal(bus10a, bus10b, 'Rows a and b in column 10 must share the same bus');
  assert.equal(bus10a, bus10e, 'Rows a and e in column 10 must share the same bus');
  assert.notEqual(bus10a, bus11a, 'Different columns must be electrically isolated');
  assert.notEqual(bus10a, bus10f, 'Top bank (a-e) and bottom bank (f-j) must be isolated by the center trough');

  // Continuous power rails
  const pwrTopCol1 = getBreadboardBusId('power_top', 1, '+');
  const pwrTopCol30 = getBreadboardBusId('power_top', 30, '+');
  assert.equal(pwrTopCol1, pwrTopCol30, 'Power rail (+) must be continuous along the entire breadboard length');
});

test('Experiment 1 (Battery and Resistor): Ohms Law and Current Calculation', () => {
  const preset = CIRCUIT_PRESETS.find((p) => p.id === 'exp_battery_resistor')!;
  const solved = solveCircuit(preset.components, preset.wires);

  // 9V across 1000 ohms => I = 0.009 A (9 mA), P = 0.081 W (81 mW)
  const current = solved.branchCurrents['res_1'];
  const power = solved.powerDissipations['res_1'];

  assert.equal(Math.round(current * 1000), 9, 'Branch current through 1k resistor must be 9 mA');
  assert.equal(Math.round(power * 1000), 81, 'Power dissipation must be 81 mW');
  assert.equal(solved.diagnostics.hasShortCircuit, false, 'Loop must have zero short circuits');
});

test('Experiment 2 (LED with Resistor): Forward Diode Voltage and Current Limiting', () => {
  const preset = CIRCUIT_PRESETS.find((p) => p.id === 'exp_led_resistor')!;
  const solved = solveCircuit(preset.components, preset.wires);

  const ledCurrent = solved.branchCurrents['led_1'];
  const resCurrent = solved.branchCurrents['res_lim'];

  // Current must flow through the loop (> 0)
  assert.ok(ledCurrent > 0.005, `LED current must be > 5 mA (got ${(ledCurrent * 1000).toFixed(1)} mA)`);
  assert.ok(ledCurrent < 0.025, `LED current must be safely limited below 25 mA (got ${(ledCurrent * 1000).toFixed(1)} mA)`);
  assert.equal(
    Math.round(ledCurrent * 1000),
    Math.round(resCurrent * 1000),
    'Series elements must carry identical branch current'
  );
});

test('Experiment 3 (Series Resistors): Precision Voltage Divider Ratio', () => {
  const preset = CIRCUIT_PRESETS.find((p) => p.id === 'exp_series_resistors')!;
  const solved = solveCircuit(preset.components, preset.wires);

  // 12V across 1k + 2k = 3k total => I = 4 mA
  // Midpoint voltage across R2 (2k) = 12V - (4 mA * 1k) = 8.0V (or 4.0V depending on reference)
  const i1 = solved.branchCurrents['r1'];
  const i2 = solved.branchCurrents['r2'];

  assert.equal(Math.round(i1 * 1000), 4, 'Current through R1 must be 4 mA');
  assert.equal(Math.round(i2 * 1000), 4, 'Current through R2 must be 4 mA');

  const vMid = solved.pinVoltages['r1:p2'];
  assert.equal(Math.round(vMid), 8, 'Voltage divider midpoint must equal 8V');
});

test('Experiment 4 (Parallel Resistors): Kirchhoffs Current Law and Equivalent Resistance', () => {
  const preset = CIRCUIT_PRESETS.find((p) => p.id === 'exp_parallel_resistors')!;
  const solved = solveCircuit(preset.components, preset.wires);

  // 10V across two 1k parallel resistors: I1 = 10 mA, I2 = 10 mA, I_src = 20 mA
  const i1 = solved.branchCurrents['r_par1'];
  const i2 = solved.branchCurrents['r_par2'];
  const iSrc = solved.branchCurrents['src_10v'];

  assert.equal(Math.round(i1 * 1000), 10, 'R1 current must be 10 mA');
  assert.equal(Math.round(i2 * 1000), 10, 'R2 current must be 10 mA');
  assert.equal(Math.round(iSrc * 1000), 20, 'Total source current must equal sum of branches (20 mA)');
});

test('Experiment 6 (BJT Transistor Switch): Base Current Switching Collector Load', () => {
  const preset = CIRCUIT_PRESETS.find((p) => p.id === 'exp_bjt_switch')!;
  const solved = solveCircuit(preset.components, preset.wires);

  const ic = solved.branchCurrents['q_npn'];
  assert.ok(ic > 0.005, 'BJT collector should conduct current to illuminate LED');
});

test('Experiment 7 (MOSFET Switch): Gate Control', () => {
  const preset = CIRCUIT_PRESETS.find((p) => p.id === 'exp_mosfet_switch')!;
  const solved = solveCircuit(preset.components, preset.wires);

  const iDrain = solved.branchCurrents['q_fet'];
  assert.ok(iDrain > 0.05, 'MOSFET drain should conduct through 100 ohm load');
});

test('Circuit Diagnostics: Detection of Short Circuits across Power Supply', () => {
  const badCircuit: { components: CircuitElementInstance[]; wires: WireConnection[] } = {
    components: [
      {
        id: 'pwr_short',
        kind: 'dc_source',
        name: 'Short Source',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 5.0 },
        pins: [
          { pinId: 'pos', name: '+', pinNumber: 1, type: 'power', offsetMm: [0, 0, 0] },
          { pinId: 'neg', name: '-', pinNumber: 2, type: 'ground', offsetMm: [0, 0, 0] },
        ],
      },
    ],
    // Direct zero-resistance wire shorting positive to negative terminal!
    wires: [
      {
        id: 'short_wire',
        fromComponentId: 'pwr_short',
        fromPinId: 'pos',
        toComponentId: 'pwr_short',
        toPinId: 'neg',
        color: '#ef4444',
      },
    ],
  };

  const solved = solveCircuit(badCircuit.components, badCircuit.wires);
  assert.equal(
    solved.diagnostics.hasShortCircuit,
    true,
    'Circuit solver must detect short circuit when power terminals are directly tied!'
  );
});

test('Circuit Diagnostics: Detection of Reverse-Biased LEDs', () => {
  const reversedLedCircuit: { components: CircuitElementInstance[]; wires: WireConnection[] } = {
    components: [
      {
        id: 'bat_rev',
        kind: 'dc_source',
        name: 'Battery',
        position: [-20, 0, 0],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 5.0 },
        pins: [
          { pinId: 'pos', name: '+', pinNumber: 1, type: 'power', offsetMm: [0, 0, 0] },
          { pinId: 'neg', name: '-', pinNumber: 2, type: 'ground', offsetMm: [0, 0, 0] },
        ],
      },
      {
        id: 'led_backwards',
        kind: 'led',
        name: 'Backwards LED',
        position: [20, 0, 0],
        rotation: [0, 0, 0],
        parameters: { forwardVoltageV: 1.85 },
        pins: [
          { pinId: 'anode', name: 'A', pinNumber: 1, type: 'anode', offsetMm: [0, 0, 0] },
          { pinId: 'cathode', name: 'K', pinNumber: 2, type: 'cathode', offsetMm: [0, 0, 0] },
        ],
      },
    ],
    wires: [
      // Wire POS to Cathode, and NEG to Anode (Reversed!)
      { id: 'w1', fromComponentId: 'bat_rev', fromPinId: 'pos', toComponentId: 'led_backwards', toPinId: 'cathode', color: '#ef4444' },
      { id: 'w2', fromComponentId: 'led_backwards', fromPinId: 'anode', toComponentId: 'bat_rev', toPinId: 'neg', color: '#0f172a' },
    ],
  };

  const solved = solveCircuit(reversedLedCircuit.components, reversedLedCircuit.wires);
  assert.ok(
    solved.diagnostics.reversedLeds.includes('led_backwards'),
    'Solver must flag reversed-polarity LED'
  );
});
