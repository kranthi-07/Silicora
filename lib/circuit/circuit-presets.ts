/**
 * 3D Lab — Initial Supported Experiments Presets
 * Pre-configured circuits ready to load into Breadboard or Open 3D mode.
 */

import { CircuitElementInstance, WireConnection, CircuitProject } from './types';

export interface CircuitExperimentPreset {
  id: string;
  title: string;
  description: string;
  learningGoal: string;
  components: CircuitElementInstance[];
  wires: WireConnection[];
}

export const CIRCUIT_PRESETS: CircuitExperimentPreset[] = [
  // 1. Battery and Resistor
  {
    id: 'exp_battery_resistor',
    title: '1. Battery and Resistor (Basic Loop)',
    description: 'A 9V DC source powering a 1kΩ metal film resistor in a single closed loop.',
    learningGoal: "Validate Ohm's Law (I = V / R = 9V / 1000Ω = 9 mA) and power dissipation (P = V * I = 81 mW).",
    components: [
      {
        id: 'bat_1',
        kind: 'dc_source',
        name: '9V Battery Source',
        position: [-25, 0, -5],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 9.0 },
        pins: [
          { pinId: 'pos', name: '+ (Positive)', pinNumber: 1, type: 'power', offsetMm: [0, 5, -8] },
          { pinId: 'neg', name: '- (Negative)', pinNumber: 2, type: 'ground', offsetMm: [0, 5, 8] },
        ],
      },
      {
        id: 'res_1',
        kind: 'resistor',
        name: 'R1 (1 kΩ)',
        position: [20, 0, -5],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 1000 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'gnd_1',
        kind: 'ground',
        name: 'Ground Reference',
        position: [-25, 0, 20],
        rotation: [0, 0, 0],
        parameters: {},
        pins: [
          { pinId: 'gnd', name: 'GND', pinNumber: 1, type: 'ground', offsetMm: [0, 0, 0] },
        ],
      },
    ],
    wires: [
      { id: 'w1', fromComponentId: 'bat_1', fromPinId: 'pos', toComponentId: 'res_1', toPinId: 'p1', color: '#ef4444' },
      { id: 'w2', fromComponentId: 'res_1', fromPinId: 'p2', toComponentId: 'bat_1', toPinId: 'neg', color: '#0f172a' },
      { id: 'w3', fromComponentId: 'bat_1', fromPinId: 'neg', toComponentId: 'gnd_1', toPinId: 'gnd', color: '#10b981' },
    ],
  },

  // 2. LED with Current-Limiting Resistor
  {
    id: 'exp_led_resistor',
    title: '2. LED with Current-Limiting Resistor',
    description: 'A 5V supply driving a 5mm Red LED protected by a 330Ω current-limiting resistor.',
    learningGoal: 'Demonstrate diode forward knee (Vf = 1.85V), resistor drop (VR = 3.15V), safe branch current (I = 9.5 mA), and photon emission.',
    components: [
      {
        id: 'pwr_1',
        kind: 'dc_source',
        name: '5V DC Supply',
        position: [-30, 0, 0],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 5.0 },
        pins: [
          { pinId: 'pos', name: '+5V', pinNumber: 1, type: 'power', offsetMm: [0, 5, -8] },
          { pinId: 'neg', name: 'GND', pinNumber: 2, type: 'ground', offsetMm: [0, 5, 8] },
        ],
      },
      {
        id: 'res_lim',
        kind: 'resistor',
        name: 'R_limit (330 Ω)',
        position: [0, 0, -10],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 330 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'led_1',
        kind: 'led',
        name: 'LED1 (Red 5mm)',
        position: [25, 0, 0],
        rotation: [0, 0, 0],
        parameters: { forwardVoltageV: 1.85, ledColor: 'red' },
        pins: [
          { pinId: 'anode', name: 'Anode (+)', pinNumber: 1, type: 'anode', offsetMm: [0, 0, -4] },
          { pinId: 'cathode', name: 'Cathode (-)', pinNumber: 2, type: 'cathode', offsetMm: [0, 0, 4] },
        ],
      },
      {
        id: 'gnd_1',
        kind: 'ground',
        name: 'GND',
        position: [-30, 0, 22],
        rotation: [0, 0, 0],
        parameters: {},
        pins: [{ pinId: 'gnd', name: 'GND', pinNumber: 1, type: 'ground', offsetMm: [0, 0, 0] }],
      },
    ],
    wires: [
      { id: 'w1', fromComponentId: 'pwr_1', fromPinId: 'pos', toComponentId: 'res_lim', toPinId: 'p1', color: '#ef4444' },
      { id: 'w2', fromComponentId: 'res_lim', fromPinId: 'p2', toComponentId: 'led_1', toPinId: 'anode', color: '#eab308' },
      { id: 'w3', fromComponentId: 'led_1', fromPinId: 'cathode', toComponentId: 'pwr_1', toPinId: 'neg', color: '#0f172a' },
      { id: 'w4', fromComponentId: 'pwr_1', fromPinId: 'neg', toComponentId: 'gnd_1', toPinId: 'gnd', color: '#10b981' },
    ],
  },

  // 3. Series Resistors (Voltage Divider)
  {
    id: 'exp_series_resistors',
    title: '3. Series Resistors (Voltage Divider)',
    description: 'Two resistors (R1 = 1kΩ, R2 = 2kΩ) in series across a 12V supply creating a precision voltage divider.',
    learningGoal: 'Demonstrate series resistance addition (R_total = 3kΩ), identical series current (4 mA), and voltage division ratio (V_out = 8V).',
    components: [
      {
        id: 'src_12v',
        kind: 'dc_source',
        name: '12V Supply',
        position: [-30, 0, 0],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 12.0 },
        pins: [
          { pinId: 'pos', name: '+12V', pinNumber: 1, type: 'power', offsetMm: [0, 5, -8] },
          { pinId: 'neg', name: 'GND', pinNumber: 2, type: 'ground', offsetMm: [0, 5, 8] },
        ],
      },
      {
        id: 'r1',
        kind: 'resistor',
        name: 'R1 (1 kΩ)',
        position: [5, 0, -12],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 1000 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'r2',
        kind: 'resistor',
        name: 'R2 (2 kΩ)',
        position: [5, 0, 12],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 2000 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'gnd_1',
        kind: 'ground',
        name: 'GND',
        position: [-30, 0, 22],
        rotation: [0, 0, 0],
        parameters: {},
        pins: [{ pinId: 'gnd', name: 'GND', pinNumber: 1, type: 'ground', offsetMm: [0, 0, 0] }],
      },
    ],
    wires: [
      { id: 'w1', fromComponentId: 'src_12v', fromPinId: 'pos', toComponentId: 'r1', toPinId: 'p1', color: '#ef4444' },
      { id: 'w2', fromComponentId: 'r1', fromPinId: 'p2', toComponentId: 'r2', toPinId: 'p1', color: '#3b82f6' }, // Midpoint V_out = 8V
      { id: 'w3', fromComponentId: 'r2', fromPinId: 'p2', toComponentId: 'src_12v', toPinId: 'neg', color: '#0f172a' },
      { id: 'w4', fromComponentId: 'src_12v', fromPinId: 'neg', toComponentId: 'gnd_1', toPinId: 'gnd', color: '#10b981' },
    ],
  },

  // 4. Parallel Resistors
  {
    id: 'exp_parallel_resistors',
    title: '4. Parallel Resistors',
    description: 'Two resistors (R1 = 1kΩ, R2 = 1kΩ) connected in parallel across 10V.',
    learningGoal: 'Demonstrate equivalent parallel resistance (Req = 500Ω) and Kirchhoffs Current Law (I_total = I1 + I2 = 20 mA).',
    components: [
      {
        id: 'src_10v',
        kind: 'dc_source',
        name: '10V Supply',
        position: [-30, 0, 0],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 10.0 },
        pins: [
          { pinId: 'pos', name: '+10V', pinNumber: 1, type: 'power', offsetMm: [0, 5, -8] },
          { pinId: 'neg', name: 'GND', pinNumber: 2, type: 'ground', offsetMm: [0, 5, 8] },
        ],
      },
      {
        id: 'r_par1',
        kind: 'resistor',
        name: 'R1 (1 kΩ)',
        position: [10, 0, -10],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 1000 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'r_par2',
        kind: 'resistor',
        name: 'R2 (1 kΩ)',
        position: [10, 0, 10],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 1000 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'gnd_1',
        kind: 'ground',
        name: 'GND',
        position: [-30, 0, 22],
        rotation: [0, 0, 0],
        parameters: {},
        pins: [{ pinId: 'gnd', name: 'GND', pinNumber: 1, type: 'ground', offsetMm: [0, 0, 0] }],
      },
    ],
    wires: [
      { id: 'w1', fromComponentId: 'src_10v', fromPinId: 'pos', toComponentId: 'r_par1', toPinId: 'p1', color: '#ef4444' },
      { id: 'w2', fromComponentId: 'r_par1', fromPinId: 'p1', toComponentId: 'r_par2', toPinId: 'p1', color: '#ef4444' },
      { id: 'w3', fromComponentId: 'r_par1', fromPinId: 'p2', toComponentId: 'src_10v', toPinId: 'neg', color: '#0f172a' },
      { id: 'w4', fromComponentId: 'r_par2', fromPinId: 'p2', toComponentId: 'src_10v', toPinId: 'neg', color: '#0f172a' },
      { id: 'w5', fromComponentId: 'src_10v', fromPinId: 'neg', toComponentId: 'gnd_1', toPinId: 'gnd', color: '#10b981' },
    ],
  },

  // 5. RC Charging and Discharging
  {
    id: 'exp_rc_circuit',
    title: '5. RC Charging & Discharging Circuit',
    description: 'A 10V supply charging a 100µF capacitor through a 10kΩ resistor with push-switch discharge.',
    learningGoal: 'Demonstrate RC time constant tau = R * C = 1.0 second, exponential asymptotic voltage rise, and stored energy.',
    components: [
      {
        id: 'src_rc',
        kind: 'dc_source',
        name: '10V DC',
        position: [-35, 0, 0],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 10.0 },
        pins: [
          { pinId: 'pos', name: '+10V', pinNumber: 1, type: 'power', offsetMm: [0, 5, -8] },
          { pinId: 'neg', name: 'GND', pinNumber: 2, type: 'ground', offsetMm: [0, 5, 8] },
        ],
      },
      {
        id: 'r_rc',
        kind: 'resistor',
        name: 'R (10 kΩ)',
        position: [-5, 0, -10],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 10000 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'cap_1',
        kind: 'capacitor',
        name: 'C1 (100 µF)',
        position: [20, 0, 0],
        rotation: [0, 0, 0],
        parameters: { capacitanceFarads: 0.0001 },
        pins: [
          { pinId: 'pos', name: '+', pinNumber: 1, type: 'passive', offsetMm: [0, 0, -4] },
          { pinId: 'neg', name: '-', pinNumber: 2, type: 'passive', offsetMm: [0, 0, 4] },
        ],
      },
      {
        id: 'btn_disch',
        kind: 'pushbutton',
        name: 'SW1 (Discharge)',
        position: [20, 0, 18],
        rotation: [0, 0, 0],
        parameters: { switchClosed: false },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-6, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [6, 0, 0] },
        ],
      },
      {
        id: 'gnd_1',
        kind: 'ground',
        name: 'GND',
        position: [-35, 0, 22],
        rotation: [0, 0, 0],
        parameters: {},
        pins: [{ pinId: 'gnd', name: 'GND', pinNumber: 1, type: 'ground', offsetMm: [0, 0, 0] }],
      },
    ],
    wires: [
      { id: 'w1', fromComponentId: 'src_rc', fromPinId: 'pos', toComponentId: 'r_rc', toPinId: 'p1', color: '#ef4444' },
      { id: 'w2', fromComponentId: 'r_rc', fromPinId: 'p2', toComponentId: 'cap_1', toPinId: 'pos', color: '#3b82f6' },
      { id: 'w3', fromComponentId: 'cap_1', fromPinId: 'neg', toComponentId: 'src_rc', toPinId: 'neg', color: '#0f172a' },
      { id: 'w4', fromComponentId: 'cap_1', fromPinId: 'pos', toComponentId: 'btn_disch', toPinId: 'p1', color: '#eab308' },
      { id: 'w5', fromComponentId: 'btn_disch', fromPinId: 'p2', toComponentId: 'cap_1', toPinId: 'neg', color: '#0f172a' },
      { id: 'w6', fromComponentId: 'src_rc', fromPinId: 'neg', toComponentId: 'gnd_1', toPinId: 'gnd', color: '#10b981' },
    ],
  },

  // 6. BJT Switching Circuit
  {
    id: 'exp_bjt_switch',
    title: '6. NPN BJT Transistor Switch',
    description: 'A 2N3904 NPN BJT in common-emitter configuration switching an indicator LED on/off via base control current.',
    learningGoal: 'Demonstrate small base current (Ib ~ 0.5 mA) saturating the collector-emitter channel (Vce_sat ~ 0.2V) to switch 15 mA through the LED.',
    components: [
      {
        id: 'v_main',
        kind: 'dc_source',
        name: '9V Main Rail',
        position: [-35, 0, -10],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 9.0 },
        pins: [
          { pinId: 'pos', name: '+9V', pinNumber: 1, type: 'power', offsetMm: [0, 5, -8] },
          { pinId: 'neg', name: 'GND', pinNumber: 2, type: 'ground', offsetMm: [0, 5, 8] },
        ],
      },
      {
        id: 'r_collector',
        kind: 'resistor',
        name: 'R_col (470 Ω)',
        position: [0, 0, -20],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 470 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'led_bjt',
        kind: 'led',
        name: 'LED (Red)',
        position: [20, 0, -20],
        rotation: [0, 0, 0],
        parameters: { forwardVoltageV: 1.85, ledColor: 'red' },
        pins: [
          { pinId: 'anode', name: 'Anode', pinNumber: 1, type: 'anode', offsetMm: [0, 0, -4] },
          { pinId: 'cathode', name: 'Cathode', pinNumber: 2, type: 'cathode', offsetMm: [0, 0, 4] },
        ],
      },
      {
        id: 'q_npn',
        kind: 'transistor_npn',
        name: '2N3904 NPN',
        position: [20, 0, 0],
        rotation: [0, 0, 0],
        parameters: { beta: 150 },
        pins: [
          { pinId: 'collector', name: 'Collector', pinNumber: 1, type: 'passive', offsetMm: [0, 0, -6] },
          { pinId: 'base', name: 'Base', pinNumber: 2, type: 'passive', offsetMm: [-6, 0, 0] },
          { pinId: 'emitter', name: 'Emitter', pinNumber: 3, type: 'passive', offsetMm: [0, 0, 6] },
        ],
      },
      {
        id: 'r_base',
        kind: 'resistor',
        name: 'R_base (4.7 kΩ)',
        position: [-10, 0, 5],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 4700 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'gnd_1',
        kind: 'ground',
        name: 'GND',
        position: [-35, 0, 20],
        rotation: [0, 0, 0],
        parameters: {},
        pins: [{ pinId: 'gnd', name: 'GND', pinNumber: 1, type: 'ground', offsetMm: [0, 0, 0] }],
      },
    ],
    wires: [
      { id: 'w1', fromComponentId: 'v_main', fromPinId: 'pos', toComponentId: 'r_collector', toPinId: 'p1', color: '#ef4444' },
      { id: 'w2', fromComponentId: 'r_collector', fromPinId: 'p2', toComponentId: 'led_bjt', toPinId: 'anode', color: '#eab308' },
      { id: 'w3', fromComponentId: 'led_bjt', fromPinId: 'cathode', toComponentId: 'q_npn', toPinId: 'collector', color: '#3b82f6' },
      { id: 'w4', fromComponentId: 'v_main', fromPinId: 'pos', toComponentId: 'r_base', toPinId: 'p1', color: '#ef4444' },
      { id: 'w5', fromComponentId: 'r_base', fromPinId: 'p2', toComponentId: 'q_npn', toPinId: 'base', color: '#3b82f6' },
      { id: 'w6', fromComponentId: 'q_npn', fromPinId: 'emitter', toComponentId: 'v_main', toPinId: 'neg', color: '#0f172a' },
      { id: 'w7', fromComponentId: 'v_main', fromPinId: 'neg', toComponentId: 'gnd_1', toPinId: 'gnd', color: '#10b981' },
    ],
  },

  // 7. MOSFET Switching Circuit
  {
    id: 'exp_mosfet_switch',
    title: '7. N-Channel MOSFET Load Switch',
    description: 'A 2N7000 N-channel MOSFET switching a 12V resistive heater/load with 5V gate control.',
    learningGoal: 'Demonstrate zero steady-state gate current (pure capacitive field-effect control), low Rds_on (~3Ω), and high-efficiency load switching.',
    components: [
      {
        id: 'v_load',
        kind: 'dc_source',
        name: '12V Load Supply',
        position: [-35, 0, -10],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 12.0 },
        pins: [
          { pinId: 'pos', name: '+12V', pinNumber: 1, type: 'power', offsetMm: [0, 5, -8] },
          { pinId: 'neg', name: 'GND', pinNumber: 2, type: 'ground', offsetMm: [0, 5, 8] },
        ],
      },
      {
        id: 'r_load',
        kind: 'resistor',
        name: 'R_load (100 Ω)',
        position: [0, 0, -20],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 100 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      },
      {
        id: 'q_fet',
        kind: 'transistor_mosfet',
        name: '2N7000 MOSFET',
        position: [20, 0, 0],
        rotation: [0, 0, 0],
        parameters: { vThreshold: 2.1 },
        pins: [
          { pinId: 'drain', name: 'Drain (D)', pinNumber: 1, type: 'passive', offsetMm: [0, 0, -6] },
          { pinId: 'gate', name: 'Gate (G)', pinNumber: 2, type: 'passive', offsetMm: [-6, 0, 0] },
          { pinId: 'source', name: 'Source (S)', pinNumber: 3, type: 'passive', offsetMm: [0, 0, 6] },
        ],
      },
      {
        id: 'btn_gate',
        kind: 'pushbutton',
        name: 'Gate Trigger SW',
        position: [-10, 0, 5],
        rotation: [0, 0, 0],
        parameters: { switchClosed: true }, // Gate triggered ON
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-6, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [6, 0, 0] },
        ],
      },
      {
        id: 'gnd_1',
        kind: 'ground',
        name: 'GND',
        position: [-35, 0, 20],
        rotation: [0, 0, 0],
        parameters: {},
        pins: [{ pinId: 'gnd', name: 'GND', pinNumber: 1, type: 'ground', offsetMm: [0, 0, 0] }],
      },
    ],
    wires: [
      { id: 'w1', fromComponentId: 'v_load', fromPinId: 'pos', toComponentId: 'r_load', toPinId: 'p1', color: '#ef4444' },
      { id: 'w2', fromComponentId: 'r_load', fromPinId: 'p2', toComponentId: 'q_fet', toPinId: 'drain', color: '#3b82f6' },
      { id: 'w3', fromComponentId: 'v_load', fromPinId: 'pos', toComponentId: 'btn_gate', toPinId: 'p1', color: '#ef4444' },
      { id: 'w4', fromComponentId: 'btn_gate', fromPinId: 'p2', toComponentId: 'q_fet', toPinId: 'gate', color: '#eab308' },
      { id: 'w5', fromComponentId: 'q_fet', fromPinId: 'source', toComponentId: 'v_load', toPinId: 'neg', color: '#0f172a' },
      { id: 'w6', fromComponentId: 'v_load', fromPinId: 'neg', toComponentId: 'gnd_1', toPinId: 'gnd', color: '#10b981' },
    ],
  },
];
