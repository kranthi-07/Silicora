/**
 * 3D Lab — Standard IPC & KiCad-Compatible Footprint Library
 */

import { PcbFootprint } from '@/types/pcb';
import { CircuitComponentKind } from '@/lib/circuit/types';

export const FOOTPRINT_LIBRARY: Record<string, PcbFootprint> = {
  // 1. Axial Resistor: DIN0207, 10.16mm (0.4") pitch, 2.5mm body dia
  'R_Axial_DIN0207_P10.16mm': {
    id: 'R_Axial_DIN0207_P10.16mm',
    name: 'R_Axial_DIN0207_P10.16mm',
    category: 'Resistor_THT',
    standardCode: 'DIN0207',
    description: 'Axial leaded resistor, length 6.5mm, diameter 2.5mm, 10.16mm lead spacing',
    courtyardSizeMm: [12.0, 4.0],
    model3dKind: 'resistor',
    pads: [
      {
        padNumber: '1',
        shape: 'roundrect',
        offsetMm: [-5.08, 0],
        sizeMm: [1.8, 1.8],
        drillMm: 0.8,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '2',
        shape: 'circle',
        offsetMm: [5.08, 0],
        sizeMm: [1.8, 1.8],
        drillMm: 0.8,
        layers: ['F_Cu', 'B_Cu'],
      },
    ],
    silkscreenLines: [
      [-3.25, -1.25, 3.25, -1.25],
      [3.25, -1.25, 3.25, 1.25],
      [3.25, 1.25, -3.25, 1.25],
      [-3.25, 1.25, -3.25, -1.25],
      [-4.0, 0, -3.25, 0],
      [3.25, 0, 4.0, 0],
    ],
  },

  // 2. 5mm THT LED: 2.54mm pitch, round dome, flat cathode marker
  'LED_D5.0mm_P2.54mm': {
    id: 'LED_D5.0mm_P2.54mm',
    name: 'LED_D5.0mm_P2.54mm',
    category: 'LED_THT',
    standardCode: 'LED_5MM',
    description: 'Radial LED 5mm diameter, 2.54mm lead spacing (Pad 1 = Anode, Pad 2 = Cathode)',
    courtyardSizeMm: [6.0, 6.0],
    model3dKind: 'led',
    pads: [
      {
        padNumber: '1', // Anode
        shape: 'rect',
        offsetMm: [-1.27, 0],
        sizeMm: [1.6, 1.6],
        drillMm: 0.8,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '2', // Cathode
        shape: 'circle',
        offsetMm: [1.27, 0],
        sizeMm: [1.6, 1.6],
        drillMm: 0.8,
        layers: ['F_Cu', 'B_Cu'],
      },
    ],
    silkscreenLines: [
      [-2.5, -2.5, 2.0, -2.5],
      [2.0, -2.5, 2.0, 2.5],
      [2.0, 2.5, -2.5, 2.5],
      [-2.5, 2.5, -2.5, -2.5],
      // Cathode flat edge line indicator
      [2.3, -2.5, 2.3, 2.5],
    ],
    silkscreenCircles: [
      [0, 0, 2.5],
    ],
  },

  // 3. DO-35 Small Signal Diode (1N4148): 7.62mm pitch, cathode band
  'D_DO-35_SOD27_P7.62mm': {
    id: 'D_DO-35_SOD27_P7.62mm',
    name: 'D_DO-35_SOD27_P7.62mm',
    category: 'Diode_THT',
    standardCode: 'DO-35',
    description: 'DO-35 glass axial diode, 7.62mm lead spacing (Pad 1 = Cathode, Pad 2 = Anode)',
    courtyardSizeMm: [9.5, 3.5],
    model3dKind: 'diode',
    pads: [
      {
        padNumber: '1', // Cathode
        shape: 'rect',
        offsetMm: [-3.81, 0],
        sizeMm: [1.6, 1.6],
        drillMm: 0.8,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '2', // Anode
        shape: 'circle',
        offsetMm: [3.81, 0],
        sizeMm: [1.6, 1.6],
        drillMm: 0.8,
        layers: ['F_Cu', 'B_Cu'],
      },
    ],
    silkscreenLines: [
      [-2.2, -1.0, 2.2, -1.0],
      [2.2, -1.0, 2.2, 1.0],
      [2.2, 1.0, -2.2, 1.0],
      [-2.2, 1.0, -2.2, -1.0],
      // Cathode band marking
      [-1.4, -1.0, -1.4, 1.0],
      [-1.1, -1.0, -1.1, 1.0],
    ],
  },

  // 4. Radial Electrolytic Capacitor: 8mm Can, 3.5mm lead pitch
  'CP_Radial_D8.0mm_P3.50mm': {
    id: 'CP_Radial_D8.0mm_P3.50mm',
    name: 'CP_Radial_D8.0mm_P3.50mm',
    category: 'Capacitor_THT',
    standardCode: 'CP_Radial_8x11',
    description: 'Radial polarized electrolytic capacitor, 8mm diameter, 3.5mm lead spacing',
    courtyardSizeMm: [9.0, 9.0],
    model3dKind: 'capacitor',
    pads: [
      {
        padNumber: '1', // Positive (+)
        shape: 'rect',
        offsetMm: [-1.75, 0],
        sizeMm: [1.8, 1.8],
        drillMm: 0.8,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '2', // Negative (-)
        shape: 'circle',
        offsetMm: [1.75, 0],
        sizeMm: [1.8, 1.8],
        drillMm: 0.8,
        layers: ['F_Cu', 'B_Cu'],
      },
    ],
    silkscreenLines: [
      // Plus symbol near Pad 1
      [-3.0, 1.5, -2.2, 1.5],
      [-2.6, 1.1, -2.6, 1.9],
    ],
    silkscreenCircles: [
      [0, 0, 4.0],
    ],
  },

  // 5. TO-92 Transistor (BJT / MOSFET): 1.27mm inline pitch, D-cut outline
  'TO-92_Inline_P1.27mm': {
    id: 'TO-92_Inline_P1.27mm',
    name: 'TO-92_Inline_P1.27mm',
    category: 'Package_TO_SOT_THT',
    standardCode: 'TO-92',
    description: 'TO-92 3-pin transistor package, 1.27mm inline lead spacing (E, B, C or S, G, D)',
    courtyardSizeMm: [5.5, 4.5],
    model3dKind: 'transistor_npn',
    pads: [
      {
        padNumber: '1',
        shape: 'rect',
        offsetMm: [-1.27, 0],
        sizeMm: [1.3, 1.3],
        drillMm: 0.7,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '2',
        shape: 'circle',
        offsetMm: [0, 0],
        sizeMm: [1.3, 1.3],
        drillMm: 0.7,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '3',
        shape: 'circle',
        offsetMm: [1.27, 0],
        sizeMm: [1.3, 1.3],
        drillMm: 0.7,
        layers: ['F_Cu', 'B_Cu'],
      },
    ],
    silkscreenLines: [
      [-2.2, -1.2, 2.2, -1.2],
      [-2.2, -1.2, -2.2, 0.8],
      [2.2, -1.2, 2.2, 0.8],
      [-2.2, 0.8, 2.2, 0.8],
    ],
    silkscreenCircles: [
      [0, 0, 2.4],
    ],
  },

  // 6. Screw Terminal Block / DC Power Connector: 2-pin 5.08mm (0.2") pitch
  'TerminalBlock_bornier-2_P5.08mm': {
    id: 'TerminalBlock_bornier-2_P5.08mm',
    name: 'TerminalBlock_bornier-2_P5.08mm',
    category: 'TerminalBlock',
    standardCode: 'TB_2P_5.08',
    description: '2-Position screw terminal block, 5.08mm pitch (Pad 1 = VCC/+, Pad 2 = GND/-)',
    courtyardSizeMm: [11.0, 9.0],
    model3dKind: 'dc_source',
    pads: [
      {
        padNumber: '1',
        shape: 'rect',
        offsetMm: [-2.54, 0],
        sizeMm: [2.5, 2.5],
        drillMm: 1.4,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '2',
        shape: 'circle',
        offsetMm: [2.54, 0],
        sizeMm: [2.5, 2.5],
        drillMm: 1.4,
        layers: ['F_Cu', 'B_Cu'],
      },
    ],
    silkscreenLines: [
      [-5.1, -4.0, 5.1, -4.0],
      [5.1, -4.0, 5.1, 4.0],
      [5.1, 4.0, -5.1, 4.0],
      [-5.1, 4.0, -5.1, -4.0],
      // Plus and Minus label markers
      [-3.8, 2.0, -3.0, 2.0],
      [-3.4, 1.6, -3.4, 2.4],
      [3.0, 2.0, 3.8, 2.0],
    ],
  },

  // 7. Tactile Pushbutton Switch: 6.0x6.0mm, 4.5x6.5mm pin spacing
  'SW_PUSH_6mm_P4.5x6.5mm': {
    id: 'SW_PUSH_6mm_P4.5x6.5mm',
    name: 'SW_PUSH_6mm_P4.5x6.5mm',
    category: 'Button_Switch_THT',
    standardCode: 'TACT_6MM',
    description: '6x6mm tactile button switch, 4-pin THT',
    courtyardSizeMm: [7.5, 7.5],
    model3dKind: 'pushbutton',
    pads: [
      {
        padNumber: '1',
        shape: 'rect',
        offsetMm: [-3.25, -2.25],
        sizeMm: [1.6, 1.6],
        drillMm: 1.0,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '2',
        shape: 'circle',
        offsetMm: [3.25, -2.25],
        sizeMm: [1.6, 1.6],
        drillMm: 1.0,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '3',
        shape: 'circle',
        offsetMm: [-3.25, 2.25],
        sizeMm: [1.6, 1.6],
        drillMm: 1.0,
        layers: ['F_Cu', 'B_Cu'],
      },
      {
        padNumber: '4',
        shape: 'circle',
        offsetMm: [3.25, 2.25],
        sizeMm: [1.6, 1.6],
        drillMm: 1.0,
        layers: ['F_Cu', 'B_Cu'],
      },
    ],
    silkscreenLines: [
      [-3.0, -3.0, 3.0, -3.0],
      [3.0, -3.0, 3.0, 3.0],
      [3.0, 3.0, -3.0, 3.0],
      [-3.0, 3.0, -3.0, -3.0],
    ],
    silkscreenCircles: [
      [0, 0, 1.7],
    ],
  },

  // 8. DIP-8 Dual In-Line Package: 7.62mm row spacing, 2.54mm pitch
  'DIP-8_W7.62mm_P2.54mm': {
    id: 'DIP-8_W7.62mm_P2.54mm',
    name: 'DIP-8_W7.62mm_P2.54mm',
    category: 'Package_DIP',
    standardCode: 'DIP-8',
    description: 'Dual In-line 8-pin package, 7.62mm (0.3") row spacing, 2.54mm pin pitch',
    courtyardSizeMm: [11.0, 10.0],
    pads: [
      { padNumber: '1', shape: 'rect', offsetMm: [-3.81, -3.81], sizeMm: [1.6, 1.6], drillMm: 0.8, layers: ['F_Cu', 'B_Cu'] },
      { padNumber: '2', shape: 'circle', offsetMm: [-3.81, -1.27], sizeMm: [1.6, 1.6], drillMm: 0.8, layers: ['F_Cu', 'B_Cu'] },
      { padNumber: '3', shape: 'circle', offsetMm: [-3.81, 1.27], sizeMm: [1.6, 1.6], drillMm: 0.8, layers: ['F_Cu', 'B_Cu'] },
      { padNumber: '4', shape: 'circle', offsetMm: [-3.81, 3.81], sizeMm: [1.6, 1.6], drillMm: 0.8, layers: ['F_Cu', 'B_Cu'] },
      { padNumber: '5', shape: 'circle', offsetMm: [3.81, 3.81], sizeMm: [1.6, 1.6], drillMm: 0.8, layers: ['F_Cu', 'B_Cu'] },
      { padNumber: '6', shape: 'circle', offsetMm: [3.81, 1.27], sizeMm: [1.6, 1.6], drillMm: 0.8, layers: ['F_Cu', 'B_Cu'] },
      { padNumber: '7', shape: 'circle', offsetMm: [3.81, -1.27], sizeMm: [1.6, 1.6], drillMm: 0.8, layers: ['F_Cu', 'B_Cu'] },
      { padNumber: '8', shape: 'circle', offsetMm: [3.81, -3.81], sizeMm: [1.6, 1.6], drillMm: 0.8, layers: ['F_Cu', 'B_Cu'] },
    ],
    silkscreenLines: [
      [-3.0, -4.5, 3.0, -4.5],
      [3.0, -4.5, 3.0, 4.5],
      [3.0, 4.5, -3.0, 4.5],
      [-3.0, 4.5, -3.0, -4.5],
      // Top orientation notch
      [-1.0, -4.5, 0, -3.5],
      [0, -3.5, 1.0, -4.5],
    ],
  },
};

/**
 * Maps a CircuitComponentKind to the most standard physical footprint ID.
 */
export function mapComponentKindToFootprintId(kind: CircuitComponentKind): string {
  switch (kind) {
    case 'resistor':
    case 'inductor':
      return 'R_Axial_DIN0207_P10.16mm';
    case 'capacitor':
      return 'CP_Radial_D8.0mm_P3.50mm';
    case 'diode':
      return 'D_DO-35_SOD27_P7.62mm';
    case 'led':
      return 'LED_D5.0mm_P2.54mm';
    case 'transistor_npn':
    case 'transistor_mosfet':
      return 'TO-92_Inline_P1.27mm';
    case 'pushbutton':
      return 'SW_PUSH_6mm_P4.5x6.5mm';
    case 'dc_source':
    case 'ground':
    case 'potentiometer':
    default:
      return 'TerminalBlock_bornier-2_P5.08mm';
  }
}

/**
 * Gets a footprint by ID or falls back to standard axial resistor.
 */
export function getFootprint(footprintId: string): PcbFootprint {
  return FOOTPRINT_LIBRARY[footprintId] || FOOTPRINT_LIBRARY['R_Axial_DIN0207_P10.16mm'];
}
