import { ComponentItem } from '../types/component';

export const MOCK_COMPONENTS: ComponentItem[] = [
  // 1. AXIAL RESISTOR 10k
  {
    id: 'pass_res_10k',
    slug: '10k-ohm-metal-film-resistor',
    name: '10kΩ 0.25W Metal Film Resistor',
    category: 'passive',
    featured: true,
    symbolType: 'resistor',
    tags: ['resistor', '10k', 'axial', 'passive', 'color-code', 'pull-up', 'divider'],
    package: {
      standardCode: 'Axial-0.25W',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 6.5, heightMm: 2.3, depthMm: 2.3 },
      pitchMm: 10.16,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Lead 1', type: 'passive', positionMm: { x: -5.08, y: 0, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Lead 2', type: 'passive', positionMm: { x: 5.08, y: 0, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/resistor/resistor_lod0.glb',
        lod1GlbUrl: '/assets/components/resistor/resistor_lod1.glb',
        lod2GlbUrl: '/assets/components/resistor/resistor_internal_lod2.glb',
      },
      previewColor: '#d97706',
      internalLayers: [
        { layerId: 'lacquer', displayName: 'Protective Epoxy Lacquer & Color Bands', meshNodeName: 'Mesh_Coating', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'spiral', displayName: 'Laser-Trimmed Helical Thin Film', meshNodeName: 'Mesh_MetalFilm', materialType: 'copper_leadframe', defaultVisible: true, canClip: true, colorRampTarget: 'thermal' },
        { layerId: 'core', displayName: 'Alumina Ceramic Insulator Core', meshNodeName: 'Mesh_CeramicCore', materialType: 'ceramic', defaultVisible: true, canClip: true },
        { layerId: 'caps', displayName: 'Tinned Steel End Caps & Welded Leads', meshNodeName: 'Mesh_EndCaps', materialType: 'copper_leadframe', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'R',
      netlistTemplate: 'R{NAME} {P1} {P2} 10k',
      pinMap: [
        { pinNumber: 1, pinName: 'Lead 1', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Lead 2', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 250,
        maxCurrentContinuousA: 0.005,
        maxCurrentPeakA: 0.015,
        maxPowerDissipationW: 0.25,
        maxJunctionTempC: 155,
        minOperatingTempC: -55,
      },
      thermal: { rThetaJA: 300, rThetaJC: 120, thermalTimeConstantSec: 10 },
      rawSpiceModel: 'R{NAME} {P1} {P2} 10k TC1=0.0001 TC2=0',
    },
    educational: {
      tagline: 'Fundamental passive component that opposes current flow and creates voltage drops.',
      summary: 'Essential building block used in every circuit for current limiting, pull-up/pull-down logic, and analog voltage dividers.',
      physicalOperatingPrinciple: 'Thin nickel-chromium metal film sputtered onto an alumina ceramic rod. A laser cuts a continuous helical spiral groove through the film, extending the path length to calibrate resistance to within 1%.',
      microscopicMechanism: 'Conduction electrons collide with vibrating lattice ions (phonons), converting kinetic electrical energy directly into thermal Joule dissipation.',
      commonFailureModes: [
        { trigger: 'Excessive continuous power (P > 0.25W)', consequence: 'Thermal discoloration, cracking of epoxy lacquer, and permanent open-circuit burnout.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://www.vishay.com/docs/28724/mbf.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Think of a resistor like a narrow constriction in a water pipe: it resists water flow to protect fragile downstream parts from high pressure.',
        howToIdentify: 'A small cylindrical beige/blue component with 4 or 5 colored stripes and silver wire legs extending from both ends. For 10kΩ, the bands are Brown (1), Black (0), Orange (×1,000), Gold (±5% tolerance).',
        polarityGuide: {
          isPolarized: false,
          pinIdentificationRule: 'Resistors have NO polarity! You can insert them in either direction into a breadboard and they will work identically.',
        },
        realWorldExample: 'Inside every flashlight or Arduino circuit, a resistor protects the LED from receiving too much current and burning out instantly.',
        beginnerMistakesToAvoid: [
          'Connecting an LED directly to a battery without a resistor (the LED will blow in 1 second).',
          'Using a 1/4W resistor in a circuit that requires 1W or more (it will get scalding hot and smoke).',
        ],
      },
    },
  },

  // 2. 10k ROTARY POTENTIOMETER
  {
    id: 'pass_pot_10k',
    slug: '10k-rotary-potentiometer',
    name: '10kΩ Rotary Potentiometer (Volume Control)',
    category: 'passive',
    featured: true,
    symbolType: 'potentiometer',
    tags: ['potentiometer', 'variable-resistor', 'volume', 'analog-input', 'dial', 'knob'],
    package: {
      standardCode: 'Rotary-16mm',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 16.0, heightMm: 24.0, depthMm: 12.0 },
      pitchMm: 5.0,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Terminal 1 (CW)', type: 'passive', positionMm: { x: -5, y: -6, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Wiper (Output)', type: 'output', positionMm: { x: 0, y: -6, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p3', pinNumber: 3, name: 'Terminal 3 (CCW)', type: 'passive', positionMm: { x: 5, y: -6, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/pot/pot_lod0.glb',
        lod1GlbUrl: '/assets/components/pot/pot_lod1.glb',
        lod2GlbUrl: '/assets/components/pot/pot_lod2.glb',
      },
      previewColor: '#64748b',
      internalLayers: [
        { layerId: 'housing', displayName: 'Pressed Metal Casing', meshNodeName: 'Mesh_Case', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
        { layerId: 'carbon_track', displayName: 'Horseshoe Resistive Carbon Track', meshNodeName: 'Mesh_Track', materialType: 'ceramic', defaultVisible: true, canClip: true },
        { layerId: 'wiper', displayName: 'Spring Metal Sliding Wiper Contact', meshNodeName: 'Mesh_Wiper', materialType: 'copper_leadframe', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'R',
      netlistTemplate: 'R{NAME}_1 {P1} {P2} 5k\nR{NAME}_2 {P2} {P3} 5k',
      pinMap: [
        { pinNumber: 1, pinName: 'Terminal 1', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Wiper', spiceNodeOrder: 2 },
        { pinNumber: 3, pinName: 'Terminal 3', spiceNodeOrder: 3 },
      ],
      ratings: {
        maxVoltageV: 50,
        maxCurrentContinuousA: 0.05,
        maxCurrentPeakA: 0.1,
        maxPowerDissipationW: 0.2,
        maxJunctionTempC: 100,
        minOperatingTempC: -20,
      },
      thermal: { rThetaJA: 250, rThetaJC: 100, thermalTimeConstantSec: 15 },
      rawSpiceModel: 'R{NAME} {P1} {P3} 10k',
    },
    educational: {
      tagline: 'Manually adjustable three-terminal resistor used as a variable voltage divider.',
      summary: 'Turning the shaft rotates a spring-metal wiper along a horseshoe carbon track, providing continuous variable output voltage from 0V to VCC.',
      physicalOperatingPrinciple: 'A sliding contact divides the total 10k resistance into two complementary segments: R1 between Pin 1 & 2, and R2 between Pin 2 & 3. As Pin 1 resistance increases, Pin 3 resistance decreases.',
      microscopicMechanism: 'Mechanical wiper sweeps across a compacted carbon-graphite track, altering the effective conductive length L seen at the center terminal.',
      commonFailureModes: [
        { trigger: 'Dust intrusion or track wear', consequence: 'Scratchy audio noise and intermittent open-circuit wiper contact.', visualEffect: 'no_visible_change' },
      ],
      datasheetUrl: 'https://www.bourns.com/docs/Product-Datasheets/PDB18.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like the volume knob on a guitar or stereo: turn it one way to let more signal through, turn it the other way to quiet it down.',
        howToIdentify: 'A round metal body with a rotating notched metal shaft on top and three metal prongs protruding downwards.',
        polarityGuide: {
          isPolarized: false,
          pinIdentificationRule: 'Center pin (Pin 2) is ALWAYS the variable Wiper output. The two outer pins (Pin 1 and 3) connect across your power rail (e.g. 5V and GND).',
        },
        realWorldExample: 'Volume dials, dimmers, game controller analog thumbsticks, and radio tuning dials.',
        beginnerMistakesToAvoid: [
          'Accidentally connecting power and ground between Pin 1 and Pin 2 (turning the knob all the way will create a dead short circuit).',
        ],
      },
    },
  },

  // 3. ELECTROLYTIC CAPACITOR 470uF 25V
  {
    id: 'pass_cap_elec_470u',
    slug: '470uf-25v-electrolytic-capacitor',
    name: '470µF 25V Electrolytic Capacitor',
    category: 'passive',
    featured: true,
    symbolType: 'polarized_capacitor',
    tags: ['capacitor', 'electrolytic', 'bulk', 'filtering', 'decoupling', 'smoothing', 'radial'],
    package: {
      standardCode: 'Radial-Can-8x11',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 8.0, heightMm: 11.5, depthMm: 8.0 },
      pitchMm: 3.5,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Anode (+)', type: 'passive', positionMm: { x: -1.75, y: -5, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Cathode (-)', type: 'passive', positionMm: { x: 1.75, y: -5, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/cap_can/cap_lod0.glb',
        lod1GlbUrl: '/assets/components/cap_can/cap_lod1.glb',
        lod2GlbUrl: '/assets/components/cap_can/cap_internal_lod2.glb',
      },
      previewColor: '#1e3a8a',
      internalLayers: [
        { layerId: 'pvc_sleeve', displayName: 'Insulating PVC Sleeve & Polarity Stripe', meshNodeName: 'Mesh_Sleeve', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'can', displayName: 'Aluminum Protective Pressure Can', meshNodeName: 'Mesh_AluCan', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
        { layerId: 'winding', displayName: 'Etched Foil & Paper Electrolyte Winding', meshNodeName: 'Mesh_JellyRoll', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
        { layerId: 'bung', displayName: 'Rubber Sealing Bung & Lead Rivets', meshNodeName: 'Mesh_RubberBung', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'C',
      netlistTemplate: 'C{NAME} {ANODE} {CATHODE} 470u',
      pinMap: [
        { pinNumber: 1, pinName: 'Anode (+)', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Cathode (-)', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 25,
        maxCurrentContinuousA: 0.85,
        maxCurrentPeakA: 3.5,
        maxPowerDissipationW: 0.35,
        maxJunctionTempC: 105,
        minOperatingTempC: -40,
      },
      thermal: { rThetaJA: 90, rThetaJC: 35, thermalTimeConstantSec: 45 },
      rawSpiceModel: 'C{NAME} {ANODE} {CATHODE} 470u IC=0 RSER=0.12',
    },
    educational: {
      tagline: 'High-capacitance polarized storage element for DC power rail smoothing and bulk decoupling.',
      summary: 'Absorbs electrical noise and supplies instant bursts of charge to keep voltages stable when components switch on.',
      physicalOperatingPrinciple: 'Micro-etched aluminum foil provides vast surface area. A nanometer-thin insulating aluminum oxide (Al2O3) dielectric yields high capacitance C = ε × A / d.',
      microscopicMechanism: 'Electric potential drives dipole polarization and electrolyte ion drift, establishing an electrostatic field that stores energy E = 0.5 × C × V².',
      commonFailureModes: [
        { trigger: 'Reverse voltage or overvoltage (V > 25V)', consequence: 'Electrolyte boiling, gas pressure buildup, and safety vent rupture ("popping").', visualEffect: 'pop_split' },
      ],
      datasheetUrl: 'https://industrial.panasonic.com/cdvis/browse/PE/EEU-FC1E471.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a water storage tower: when the pump surges, it stores water; when pressure dips, it supplies water instantly to keep pressure steady.',
        howToIdentify: 'A small blue or black cylindrical metal "can" with two wire legs coming out of the rubber bottom. Look for the white vertical stripe printed along the side.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'POLARIZED! 1) The LONGER leg is ALWAYS Positive (+). 2) The side with the white stripe and minus "-" signs marks the NEGATIVE (-) cathode leg.',
          warningIfReversed: 'DANGER: Connecting backwards causes reverse electrolysis, creating internal hydrogen gas that will make the capacitor pop and spray electrolyte.',
        },
        realWorldExample: 'Found in every phone charger, PC power supply, and audio speaker amplifier to remove 50Hz/60Hz AC humming noise.',
        beginnerMistakesToAvoid: [
          'Exceeding the 25V voltage limit (always leave a 20% safety margin; e.g. use a 25V cap for a 12V circuit, not a 16V cap for a 15V circuit).',
          'Cutting the leads to the same length before checking which one had the negative stripe!',
        ],
      },
    },
  },

  // 4. CERAMIC DISC CAPACITOR 100nF (0.1uF)
  {
    id: 'pass_cap_cer_100n',
    slug: '100nf-50v-ceramic-disc-capacitor',
    name: '100nF (0.1µF) 50V Ceramic Disc Capacitor',
    category: 'passive',
    featured: true,
    symbolType: 'capacitor',
    tags: ['capacitor', 'ceramic', '0.1uf', '104', 'decoupling', 'bypass', 'noise-filter'],
    package: {
      standardCode: 'Radial-Disc-5mm',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 5.0, heightMm: 7.0, depthMm: 2.5 },
      pitchMm: 2.54,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Lead 1', type: 'passive', positionMm: { x: -1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Lead 2', type: 'passive', positionMm: { x: 1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/ceramic/cer_lod0.glb',
        lod1GlbUrl: '/assets/components/ceramic/cer_lod1.glb',
        lod2GlbUrl: '/assets/components/ceramic/cer_lod2.glb',
      },
      previewColor: '#d97706',
      internalLayers: [
        { layerId: 'ceramic_coating', displayName: 'Phenolic Resin Dip Coating', meshNodeName: 'Mesh_Dip', materialType: 'ceramic', defaultVisible: true, canClip: true },
        { layerId: 'electrodes', displayName: 'Silver Electrode Discs & Leads', meshNodeName: 'Mesh_Plates', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'C',
      netlistTemplate: 'C{NAME} {P1} {P2} 100n',
      pinMap: [
        { pinNumber: 1, pinName: 'Lead 1', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Lead 2', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 50,
        maxCurrentContinuousA: 0.1,
        maxCurrentPeakA: 1.0,
        maxPowerDissipationW: 0.1,
        maxJunctionTempC: 125,
        minOperatingTempC: -55,
      },
      thermal: { rThetaJA: 350, rThetaJC: 150, thermalTimeConstantSec: 5 },
      rawSpiceModel: 'C{NAME} {P1} {P2} 100n RSER=0.05',
    },
    educational: {
      tagline: 'High-frequency bypass capacitor placed right next to microchips to kill digital noise.',
      summary: 'The single most common capacitor in electronics. Filters high-frequency digital spikes and glitches.',
      physicalOperatingPrinciple: 'Thin disc of high-dielectric ceramic coated on both faces with conductive silver paste.',
      microscopicMechanism: 'Electric dipole displacement in barium titanate ceramic matrix.',
      commonFailureModes: [
        { trigger: 'Mechanical flexure or cracking', consequence: 'Internal short circuit.', visualEffect: 'no_visible_change' },
      ],
      datasheetUrl: 'https://www.vishay.com/docs/28514/disc.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a shock absorber for digital electricity: it smooths out tiny rapid voltage bumps before they confuse your microcontroller.',
        howToIdentify: 'A flat, round, yellow-orange coin or disc on two thin wire legs. Printed with the number "104" (10 followed by 4 zeros = 100,000 pF = 0.1 µF = 100 nF).',
        polarityGuide: {
          isPolarized: false,
          pinIdentificationRule: 'NON-POLARIZED! Ceramic capacitors can be plugged in either way. Both pins are identical.',
        },
        realWorldExample: 'Found right beside every microchip and sensor on Arduino, Raspberry Pi, and computer motherboards.',
        beginnerMistakesToAvoid: [
          'Placing it far away from the chip on a breadboard. High-frequency bypass caps must be placed as close to the IC power pins as possible!',
        ],
      },
    },
  },

  // 5. 5mm RED DIFFUSED LED
  {
    id: 'opto_led_red_5mm',
    slug: '5mm-red-diffused-led',
    name: '5mm Red Diffused Indicator LED',
    category: 'optoelectronics',
    featured: true,
    symbolType: 'led',
    tags: ['led', 'diode', 'light', 'indicator', 'red', '5mm', 'optical', 'opto'],
    package: {
      standardCode: 'Radial-5mm',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 5.8, heightMm: 8.6, depthMm: 5.8 },
      pitchMm: 2.54,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Anode (+)', type: 'passive', positionMm: { x: -1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Cathode (-)', type: 'passive', positionMm: { x: 1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/led/led_lod0.glb',
        lod1GlbUrl: '/assets/components/led/led_lod1.glb',
        lod2GlbUrl: '/assets/components/led/led_internal_lod2.glb',
      },
      previewColor: '#ef4444',
      internalLayers: [
        { layerId: 'epoxy_lens', displayName: 'Tinted Diffused Epoxy Lens', meshNodeName: 'Mesh_EpoxyLens', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'cup', displayName: 'Reflector Anvil & Post Leadframe', meshNodeName: 'Mesh_LeadFrame', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
        { layerId: 'die', displayName: 'AlGaAs Semiconductor Die (250µm)', meshNodeName: 'Mesh_LEDOpticDie', materialType: 'silicon_die', defaultVisible: true, canClip: false, colorRampTarget: 'current_density' },
        { layerId: 'wire', displayName: 'Gold Bond Wire (25µm)', meshNodeName: 'Mesh_GoldWire', materialType: 'gold_wirebond', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'D',
      netlistTemplate: 'D{NAME} {ANODE} {CATHODE} LED_RED',
      pinMap: [
        { pinNumber: 1, pinName: 'Anode (+)', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Cathode (-)', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 5.0,
        maxCurrentContinuousA: 0.03,
        maxCurrentPeakA: 0.1,
        maxPowerDissipationW: 0.075,
        maxJunctionTempC: 100,
        minOperatingTempC: -40,
      },
      thermal: { rThetaJA: 300, rThetaJC: 110, thermalTimeConstantSec: 8 },
      rawSpiceModel: '.MODEL LED_RED D(IS=1E-20 N=1.8 RS=4.5 BV=5 IBV=10U)',
    },
    educational: {
      tagline: 'Standard forward-biased solid-state light emitting diode.',
      summary: 'Converts electrical energy directly into visible light via quantum radiative recombination.',
      physicalOperatingPrinciple: 'Direct bandgap semiconductor recombination: injected electrons from the conduction band drop into valence holes, emitting energetic photons equal to bandgap energy hc/λ (~630nm red).',
      microscopicMechanism: 'Electrons inject across forward-biased PN junction into the active quantum region.',
      commonFailureModes: [
        { trigger: 'Excessive forward current (no resistor)', consequence: 'Thermal runaway melting the gold wirebond, producing permanent dark open circuit.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'A microscopic semiconductor light bulb that only lets current flow in one direction and glows bright red when turned on.',
        howToIdentify: 'A dome-shaped colored plastic capsule with two wire legs. Inside the clear plastic you can see two metal parts: a small post and a wider triangular "anvil".',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'POLARIZED! 1) The LONGER leg is the ANODE (+) positive lead. 2) The SHORTER leg is the CATHODE (-) negative lead. 3) Look at the plastic rim: the side with the FLAT edge is the CATHODE (-).',
          warningIfReversed: 'If connected backwards, the LED simply will not light up (it safely blocks reverse current up to 5V).',
        },
        realWorldExample: 'Power lights on televisions, computer status indicators, car tail lights, and traffic signals.',
        beginnerMistakesToAvoid: [
          'NEVER connect an LED directly to a 5V or 9V battery without a current-limiting resistor (e.g. 220Ω to 1kΩ)! Without a resistor, it draws infinite current and pops in a flash.',
        ],
      },
    },
  },

  // 6. 1N4148 FAST SWITCHING SIGNAL DIODE
  {
    id: 'semi_diode_1n4148',
    slug: '1n4148-switching-diode',
    name: '1N4148 Fast Switching Diode',
    category: 'discrete_semiconductor',
    featured: true,
    symbolType: 'diode',
    tags: ['diode', 'signal', 'high-speed', 'switching', 'do-35', 'clamping', 'flyback'],
    package: {
      standardCode: 'DO-35',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 4.0, heightMm: 1.8, depthMm: 1.8 },
      pitchMm: 7.62,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Anode (+)', type: 'passive', positionMm: { x: -3.81, y: 0, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Cathode (-)', type: 'passive', positionMm: { x: 3.81, y: 0, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/do35/do35_lod0.glb',
        lod1GlbUrl: '/assets/components/do35/do35_lod1.glb',
        lod2GlbUrl: '/assets/components/do35/1n4148_internal_lod2.glb',
      },
      previewColor: '#fb923c',
      internalLayers: [
        { layerId: 'glass', displayName: 'Hermetic Glass Bead Envelope', meshNodeName: 'Mesh_Glass', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'die', displayName: 'Silicon Epitaxial Planar PN Die', meshNodeName: 'Mesh_Die', materialType: 'silicon_die', defaultVisible: true, canClip: true, colorRampTarget: 'depletion_zone' },
        { layerId: 'cat_whisker', displayName: 'S-shaped Spring Tungsten Contact', meshNodeName: 'Mesh_Whisker', materialType: 'copper_leadframe', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'D',
      netlistTemplate: 'D{NAME} {ANODE} {CATHODE} 1N4148',
      pinMap: [
        { pinNumber: 1, pinName: 'Anode (+)', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Cathode (-)', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 100,
        maxCurrentContinuousA: 0.3,
        maxCurrentPeakA: 1.0,
        maxPowerDissipationW: 0.5,
        maxJunctionTempC: 175,
        minOperatingTempC: -65,
      },
      thermal: { rThetaJA: 300, rThetaJC: 120, thermalTimeConstantSec: 6 },
      rawSpiceModel: '.MODEL 1N4148 D(IS=2.682N RS=0.5664 N=1.752 BV=100 IBV=100U CJO=4P VJ=0.5 M=0.333 TT=5.76N)',
    },
    educational: {
      tagline: 'High-speed silicon epitaxial planar diode with 4ns reverse recovery time.',
      summary: 'Acts as an electronic one-way valve for low-current signals and protects inputs against inductive spikes.',
      physicalOperatingPrinciple: 'Allows current to flow freely from Anode to Cathode (forward biased with ~0.7V drop) while blocking current in the reverse direction.',
      microscopicMechanism: 'Forward bias narrows the PN depletion barrier; reverse bias widens it to block charge transfer.',
      commonFailureModes: [
        { trigger: 'Excessive forward current', consequence: 'Semiconductor die junction melts into a permanent short circuit.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://www.vishay.com/docs/81857/1n4148.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'A one-way turnstile for electricity: current can walk through in the forward direction, but cannot back up.',
        howToIdentify: 'A tiny orange/red transparent glass bead with two wire leads and a crisp black ring printed near one end.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'POLARIZED! The BLACK STRIPE marks the CATHODE (-) terminal. Current can only flow TOWARDS the stripe (from Anode to Cathode).',
          warningIfReversed: 'If plugged in backwards, it acts like an open switch and stops all current flow.',
        },
        realWorldExample: 'Relay coil flyback protection, radio signal detectors, and audio clipper distortion pedals.',
        beginnerMistakesToAvoid: [
          'Confusing it with a 1/4W resistor because of its small axial size. Always look for the clear glass body and single black ring!',
        ],
      },
    },
  },

  // 7. 1N4007 POWER RECTIFIER DIODE 1000V 1A
  {
    id: 'semi_diode_1n4007',
    slug: '1n4007-power-rectifier-diode',
    name: '1N4007 1000V 1A Power Rectifier Diode',
    category: 'discrete_semiconductor',
    featured: true,
    symbolType: 'diode',
    tags: ['diode', 'rectifier', 'power', '1a', '1000v', 'mains', 'ac-to-dc', 'do-41'],
    package: {
      standardCode: 'DO-41',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 5.2, heightMm: 2.7, depthMm: 2.7 },
      pitchMm: 10.16,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Anode (+)', type: 'passive', positionMm: { x: -5.08, y: 0, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Cathode (-)', type: 'passive', positionMm: { x: 5.08, y: 0, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/do41/do41_lod0.glb',
        lod1GlbUrl: '/assets/components/do41/do41_lod1.glb',
        lod2GlbUrl: '/assets/components/do41/do41_lod2.glb',
      },
      previewColor: '#1e293b',
      internalLayers: [
        { layerId: 'mold', displayName: 'Flame-Retardant Epoxy Mold Body', meshNodeName: 'Mesh_Case', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'die', displayName: 'High-Voltage Silicon Diffused Junction', meshNodeName: 'Mesh_Die', materialType: 'silicon_die', defaultVisible: true, canClip: true },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'D',
      netlistTemplate: 'D{NAME} {ANODE} {CATHODE} 1N4007',
      pinMap: [
        { pinNumber: 1, pinName: 'Anode (+)', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Cathode (-)', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 1000,
        maxCurrentContinuousA: 1.0,
        maxCurrentPeakA: 30.0,
        maxPowerDissipationW: 1.5,
        maxJunctionTempC: 175,
        minOperatingTempC: -65,
      },
      thermal: { rThetaJA: 100, rThetaJC: 30, thermalTimeConstantSec: 18 },
      rawSpiceModel: '.MODEL 1N4007 D(IS=7.027N RS=0.03415 N=1.8 BV=1000 IBV=0.05U CJO=10P TT=4.5U)',
    },
    educational: {
      tagline: 'Standard 1-Ampere power rectifier diode rated up to 1,000 Volts.',
      summary: 'Workhorse component used in bridge rectifiers to convert AC wall power into clean DC power.',
      physicalOperatingPrinciple: 'Converts alternating bidirectional AC sinusoidal current into unidirectional pulsed DC current by blocking the negative half-cycles.',
      microscopicMechanism: 'Heavy P-I-N semiconductor diffusion handles large forward surges up to 30A.',
      commonFailureModes: [
        { trigger: 'Thermal overcurrent (I > 1A continuous without heatsinking)', consequence: 'Junction short circuit.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://www.diodes.com/assets/Datasheets/ds28002.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'A heavy-duty one-way valve for power circuits: keeps electricity moving forward into your battery and prevents it from flowing backwards.',
        howToIdentify: 'A black plastic cylinder (larger than 1N4148) with two thick wire legs and a painted SILVER band near one end.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'POLARIZED! The SILVER BAND marks the CATHODE (-) terminal.',
          warningIfReversed: 'Blocks all power from reaching the circuit.',
        },
        realWorldExample: 'Found in every plug-in power adapter, microwave power board, and motor driver.',
        beginnerMistakesToAvoid: [
          'Using the tiny glass 1N4148 for high power instead of the 1N4007 (the 1N4148 will burn out above 300mA).',
        ],
      },
    },
  },

  // 8. 2N3904 NPN BJT
  {
    id: 'semi_bjt_2n3904',
    slug: '2n3904-npn-transistor',
    name: '2N3904 NPN BJT (Transistor Switch & Amp)',
    category: 'discrete_semiconductor',
    featured: true,
    symbolType: 'bjt_npn',
    tags: ['transistor', 'npn', 'bjt', 'switch', 'amplifier', 'to-92'],
    package: {
      standardCode: 'TO-92',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 4.58, heightMm: 4.82, depthMm: 3.86 },
      pitchMm: 1.27,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Emitter', type: 'passive', positionMm: { x: -1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Base', type: 'input', positionMm: { x: 0, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p3', pinNumber: 3, name: 'Collector', type: 'passive', positionMm: { x: 1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/to92/to92_lod0.glb',
        lod1GlbUrl: '/assets/components/to92/to92_lod1.glb',
        lod2GlbUrl: '/assets/components/to92/2n3904_internal_lod2.glb',
      },
      previewColor: '#1e293b',
      internalLayers: [
        { layerId: 'epoxy', displayName: 'Epoxy Mold Compound', meshNodeName: 'Mesh_Epoxy', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'die', displayName: 'Silicon NPN Die', meshNodeName: 'Mesh_Die', materialType: 'silicon_die', defaultVisible: true, canClip: true, colorRampTarget: 'depletion_zone' },
        { layerId: 'leadframe', displayName: 'Copper Leadframe', meshNodeName: 'Mesh_Leadframe', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
        { layerId: 'wirebonds', displayName: 'Gold Bond Wires (25µm)', meshNodeName: 'Mesh_Wirebonds', materialType: 'gold_wirebond', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'Q',
      netlistTemplate: 'Q{NAME} {COLLECTOR} {BASE} {EMITTER} Q2N3904',
      pinMap: [
        { pinNumber: 3, pinName: 'Collector', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Base', spiceNodeOrder: 2 },
        { pinNumber: 1, pinName: 'Emitter', spiceNodeOrder: 3 },
      ],
      ratings: {
        maxVoltageV: 40,
        maxCurrentContinuousA: 0.2,
        maxCurrentPeakA: 0.5,
        maxPowerDissipationW: 0.625,
        maxJunctionTempC: 150,
        minOperatingTempC: -55,
      },
      thermal: { rThetaJA: 200, rThetaJC: 83.3, thermalTimeConstantSec: 12 },
      rawSpiceModel: '.MODEL Q2N3904 NPN(IS=1E-14 VAF=100 BF=300 IKF=0.4 XTB=1.5 BR=4 CJC=4E-12 CJE=8E-12 RB=10 RC=1 RE=0.1 TR=239E-9 TF=400E-12)',
    },
    educational: {
      tagline: 'Ubiquitous small-signal NPN general purpose amplifier and switch.',
      summary: 'Used for low-power amplification and high-speed digital switching up to 100 MHz.',
      physicalOperatingPrinciple: 'Base current injects minority carriers into the ultra-thin base region, modulating heavy collector-emitter current flow through reverse-biased depletion regions.',
      microscopicMechanism: 'Thermal diffusion of electrons across the forward-biased Base-Emitter PN junction sweeps into the reverse-biased Base-Collector depletion layer with low recombination losses.',
      commonFailureModes: [
        { trigger: 'Thermal overload (P > 625mW)', consequence: 'Melting of internal aluminum-silicon metalization and thermal runaway.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://www.onsemi.com/pdf/datasheet/2n3903-d.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'An electrically controlled water faucet: a tiny trickle of water into the Base handle opens the main valve wide, allowing huge water flow from Collector to Emitter.',
        howToIdentify: 'A small black plastic semi-cylinder (D-shaped) with one flat side and one rounded back, having 3 wire legs.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'Hold the transistor with the FLAT FACE towards you and pins pointing DOWN: Pin 1 (Left) is EMITTER, Pin 2 (Center) is BASE, Pin 3 (Right) is COLLECTOR (mnemonic: "E-B-C").',
          warningIfReversed: 'Swapping Collector and Emitter will reduce gain from 300 to around 5, causing the circuit to barely switch.',
        },
        realWorldExample: 'Turning motors or buzzers on/off with tiny signals from an Arduino microcontroller pin.',
        beginnerMistakesToAvoid: [
          'Connecting the Base pin directly to 5V without a current-limiting resistor (e.g. 1kΩ to 10kΩ). The Base-Emitter junction is a diode and will burn out without a resistor!',
        ],
      },
    },
  },

  // 9. 2N7000 N-CHANNEL MOSFET
  {
    id: 'semi_mosfet_2n7000',
    slug: '2n7000-n-channel-mosfet',
    name: '2N7000 N-Channel Small-Signal MOSFET',
    category: 'discrete_semiconductor',
    featured: true,
    symbolType: 'mosfet_n',
    tags: ['mosfet', 'fet', 'transistor', 'switch', 'voltage-controlled', 'to-92', 'n-channel'],
    package: {
      standardCode: 'TO-92',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 4.58, heightMm: 4.82, depthMm: 3.86 },
      pitchMm: 1.27,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Source', type: 'passive', positionMm: { x: -1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Gate', type: 'input', positionMm: { x: 0, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p3', pinNumber: 3, name: 'Drain', type: 'passive', positionMm: { x: 1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/to92/to92_lod0.glb',
        lod1GlbUrl: '/assets/components/to92/to92_lod1.glb',
        lod2GlbUrl: '/assets/components/to92/2n7000_internal_lod2.glb',
      },
      previewColor: '#0f172a',
      internalLayers: [
        { layerId: 'epoxy', displayName: 'Molded Epoxy Body', meshNodeName: 'Mesh_Epoxy', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'die', displayName: 'Silicon Trench Gate Die', meshNodeName: 'Mesh_Die', materialType: 'silicon_die', defaultVisible: true, canClip: true },
        { layerId: 'leadframe', displayName: 'Copper Drain Paddle', meshNodeName: 'Mesh_Leadframe', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
        { layerId: 'wires', displayName: 'Bond Wires', meshNodeName: 'Mesh_Wires', materialType: 'gold_wirebond', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'M',
      netlistTemplate: 'M{NAME} {DRAIN} {GATE} {SOURCE} {SOURCE} 2N7000',
      pinMap: [
        { pinNumber: 3, pinName: 'Drain', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Gate', spiceNodeOrder: 2 },
        { pinNumber: 1, pinName: 'Source', spiceNodeOrder: 3 },
      ],
      ratings: {
        maxVoltageV: 60,
        maxCurrentContinuousA: 0.2,
        maxCurrentPeakA: 0.5,
        maxPowerDissipationW: 0.4,
        maxJunctionTempC: 150,
        minOperatingTempC: -55,
      },
      thermal: { rThetaJA: 312, rThetaJC: 125, thermalTimeConstantSec: 10 },
      rawSpiceModel: '.MODEL 2N7000 NMOS(VTO=2.1 KP=0.12 RD=1.2 RS=1.2 CBD=20P CBS=20P CGSO=30P CGDO=10P)',
    },
    educational: {
      tagline: 'Voltage-controlled solid-state switch with virtually zero gate drive current.',
      summary: 'Ideal for driving relays, LEDs, and logic level translation directly from microcontroller outputs.',
      physicalOperatingPrinciple: 'An electric field generated across a thin silicon-dioxide gate oxide layer attracts electrons, inverting the p-substrate into a conductive n-channel between Drain and Source.',
      microscopicMechanism: 'Field-effect electrostatic carrier modulation without DC gate current conduction.',
      commonFailureModes: [
        { trigger: 'Electrostatic discharge (ESD) exceeding ±20V on Gate', consequence: 'Puncture of the microscopic 20nm gate oxide insulation, permanently locking the MOSFET on or shorted.', visualEffect: 'no_visible_change' },
      ],
      datasheetUrl: 'https://www.onsemi.com/pdf/datasheet/2n7000-d.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a touch-sensitive electric light switch: you do NOT need to push current into it, just applying voltage to the Gate turns the switch ON.',
        howToIdentify: 'Black D-shaped TO-92 plastic body with "2N7000" printed on the flat face.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'With flat face pointing at you and pins pointing down: Pin 1 (Left) is SOURCE, Pin 2 (Center) is GATE, Pin 3 (Right) is DRAIN (mnemonic: "S-G-D").',
        },
        realWorldExample: 'Modern computer CPUs contain billions of MOSFETs acting as 1s and 0s.',
        beginnerMistakesToAvoid: [
          'Leaving the Gate pin unconnected ("floating"). A floating gate acts like an antenna and randomly turns ON and OFF from static electricity in the air! Always use a 10kΩ pull-down resistor.',
        ],
      },
    },
  },

  // 10. NE555 PRECISION TIMER IC
  {
    id: 'ic_timer_ne555',
    slug: 'ne555-precision-timer',
    name: 'NE555 Precision Timer IC',
    category: 'integrated_circuit',
    featured: true,
    symbolType: 'ic_timer',
    tags: ['ic', 'timer', 'oscillator', 'pwm', 'dip-8', 'clock', 'bistable', 'astable'],
    package: {
      standardCode: 'DIP-8',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 9.8, heightMm: 7.2, depthMm: 3.4 },
      pitchMm: 2.54,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'GND', type: 'ground', positionMm: { x: -3.81, y: -3.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'TRIG', type: 'input', positionMm: { x: -1.27, y: -3.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p3', pinNumber: 3, name: 'OUT', type: 'output', positionMm: { x: 1.27, y: -3.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p4', pinNumber: 4, name: 'RESET', type: 'input', positionMm: { x: 3.81, y: -3.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p5', pinNumber: 5, name: 'CTRL', type: 'passive', positionMm: { x: 3.81, y: 3.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p6', pinNumber: 6, name: 'THRES', type: 'input', positionMm: { x: 1.27, y: 3.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p7', pinNumber: 7, name: 'DISCH', type: 'passive', positionMm: { x: -1.27, y: 3.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p8', pinNumber: 8, name: 'VCC', type: 'power', positionMm: { x: -3.81, y: 3.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/dip8/dip8_lod0.glb',
        lod1GlbUrl: '/assets/components/dip8/dip8_lod1.glb',
        lod2GlbUrl: '/assets/components/dip8/ne555_internal_lod2.glb',
      },
      previewColor: '#0f172a',
      internalLayers: [
        { layerId: 'mold', displayName: 'Plastic Encapsulation', meshNodeName: 'Mesh_Case', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'silicon', displayName: 'Bipolar Integrated Die (23 Transistors)', meshNodeName: 'Mesh_IC_Die', materialType: 'silicon_die', defaultVisible: true, canClip: true },
        { layerId: 'wires', displayName: 'Bond Wires (8x)', meshNodeName: 'Mesh_BondWires', materialType: 'gold_wirebond', defaultVisible: true, canClip: false },
        { layerId: 'frame', displayName: 'Internal Leadframe & Paddle', meshNodeName: 'Mesh_Leadframe', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
      ],
    },
    electrical: {
      kind: 'subcircuit',
      spicePrefix: 'X',
      subcircuitName: 'NE555',
      netlistTemplate: 'X{NAME} {GND} {TRIG} {OUT} {RESET} {CTRL} {THRES} {DISCH} {VCC} NE555',
      pinMap: [
        { pinNumber: 1, pinName: 'GND', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'TRIG', spiceNodeOrder: 2 },
        { pinNumber: 3, pinName: 'OUT', spiceNodeOrder: 3 },
        { pinNumber: 4, pinName: 'RESET', spiceNodeOrder: 4 },
        { pinNumber: 5, pinName: 'CTRL', spiceNodeOrder: 5 },
        { pinNumber: 6, pinName: 'THRES', spiceNodeOrder: 6 },
        { pinNumber: 7, pinName: 'DISCH', spiceNodeOrder: 7 },
        { pinNumber: 8, pinName: 'VCC', spiceNodeOrder: 8 },
      ],
      ratings: {
        maxVoltageV: 18,
        maxCurrentContinuousA: 0.2,
        maxCurrentPeakA: 0.225,
        maxPowerDissipationW: 0.6,
        maxJunctionTempC: 150,
        minOperatingTempC: 0,
      },
      thermal: { rThetaJA: 110, rThetaJC: 45, thermalTimeConstantSec: 20 },
      rawSpiceModel: '.SUBCKT NE555 1 2 3 4 5 6 7 8\n* Simplified 555 Macro Model\nR1 8 5 5k\nR2 5 6 5k\nR3 6 1 5k\n.ENDS NE555',
    },
    educational: {
      tagline: 'The most popular integrated circuit in electronic history, creating timing delays and oscillations.',
      summary: 'Internally packs 25 transistors, 2 diodes, and 15 precision resistors to create pulses from microseconds to hours.',
      physicalOperatingPrinciple: 'Three internal 5kΩ resistors divide VCC into 2/3 VCC and 1/3 VCC reference trip thresholds, monitored by dual analog comparators triggering an RS flip-flop.',
      microscopicMechanism: 'Bipolar monolithic silicon integration forming comparators, an SR latch, and a high-current discharge transistor.',
      commonFailureModes: [
        { trigger: 'Supply overvoltage (VCC > 18V)', consequence: 'Internal transistor punch-through.', visualEffect: 'smoke_cloud' },
      ],
      datasheetUrl: 'https://www.ti.com/lit/ds/symlink/ne555.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'The heartbeat chip of electronics: it can click on and off rhythmically like a metronome, or act as an egg timer that waits before buzzing.',
        howToIdentify: 'A black rectangular chip with 8 legs (4 on each side). Look for the half-moon notch or dimple dot at one end.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'Look at the NOTCH on top: Pin 1 is immediately to the LEFT of the notch. Pin numbers count COUNTER-CLOCKWISE: 1 to 4 down the left, then 5 to 8 up the right (Pin 8 is top-right VCC).',
          warningIfReversed: 'Plugging in backwards connects VCC to ground and fries the internal comparators.',
        },
        realWorldExample: 'Blinking bike safety lights, sirens, servo motor controllers, and frequency generators.',
        beginnerMistakesToAvoid: [
          'Leaving Pin 4 (RESET) unconnected. In normal operation, Pin 4 must be tied to VCC (+), otherwise noise will reset the timer randomly!',
        ],
      },
    },
  },

  // 11. LM358 DUAL OPERATIONAL AMPLIFIER
  {
    id: 'opamp_lm358',
    slug: 'lm358-dual-opamp',
    name: 'LM358 Dual Operational Amplifier',
    category: 'opamp_linear',
    featured: true,
    symbolType: 'opamp',
    tags: ['opamp', 'amplifier', 'linear', 'analog', 'dual', 'dip-8', 'comparator', 'sensor-amp'],
    package: {
      standardCode: 'DIP-8',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 9.8, heightMm: 7.2, depthMm: 3.4 },
      pitchMm: 2.54,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: '1OUT', type: 'output', positionMm: { x: -3.81, y: -3.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: '1IN-', type: 'input', positionMm: { x: -1.27, y: -3.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p3', pinNumber: 3, name: '1IN+', type: 'input', positionMm: { x: 1.27, y: -3.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p4', pinNumber: 4, name: 'GND', type: 'ground', positionMm: { x: 3.81, y: -3.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p5', pinNumber: 5, name: '2IN+', type: 'input', positionMm: { x: 3.81, y: 3.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p6', pinNumber: 6, name: '2IN-', type: 'input', positionMm: { x: 1.27, y: 3.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p7', pinNumber: 7, name: '2OUT', type: 'output', positionMm: { x: -1.27, y: 3.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p8', pinNumber: 8, name: 'VCC', type: 'power', positionMm: { x: -3.81, y: 3.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/dip8/dip8_lod0.glb',
        lod1GlbUrl: '/assets/components/dip8/dip8_lod1.glb',
        lod2GlbUrl: '/assets/components/dip8/lm358_internal_lod2.glb',
      },
      previewColor: '#0f172a',
      internalLayers: [
        { layerId: 'mold', displayName: 'Plastic Encapsulation', meshNodeName: 'Mesh_Case', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'die', displayName: 'Dual Silicon Op-Amp Die', meshNodeName: 'Mesh_Die', materialType: 'silicon_die', defaultVisible: true, canClip: true },
        { layerId: 'wires', displayName: 'Bond Wires', meshNodeName: 'Mesh_Wires', materialType: 'gold_wirebond', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'subcircuit',
      spicePrefix: 'X',
      subcircuitName: 'LM358',
      netlistTemplate: 'X{NAME} {1IN+} {1IN-} {VCC} {GND} {1OUT} LM358',
      pinMap: [
        { pinNumber: 3, pinName: '1IN+', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: '1IN-', spiceNodeOrder: 2 },
        { pinNumber: 8, pinName: 'VCC', spiceNodeOrder: 3 },
        { pinNumber: 4, pinName: 'GND', spiceNodeOrder: 4 },
        { pinNumber: 1, pinName: '1OUT', spiceNodeOrder: 5 },
      ],
      ratings: {
        maxVoltageV: 32,
        maxCurrentContinuousA: 0.04,
        maxCurrentPeakA: 0.06,
        maxPowerDissipationW: 0.5,
        maxJunctionTempC: 150,
        minOperatingTempC: 0,
      },
      thermal: { rThetaJA: 130, rThetaJC: 50, thermalTimeConstantSec: 15 },
      rawSpiceModel: '.SUBCKT LM358 1 2 3 4 5\n* High-gain differential opamp model\nE1 5 4 1 2 100000\n.ENDS LM358',
    },
    educational: {
      tagline: 'Workhorse single-supply dual operational amplifier for analog signal conditioning.',
      summary: 'Amplifies tiny sensor signals (microphones, temperature probes) so microcontrollers can read them.',
      physicalOperatingPrinciple: 'High-gain differential amplifier with negative feedback: output adjusts until the voltage difference between inverting and non-inverting inputs is zero.',
      microscopicMechanism: 'Differential pair input stage feeding high-gain voltage amplifier and push-pull output driver.',
      commonFailureModes: [
        { trigger: 'Exceeding supply voltage (>32V)', consequence: 'Internal transistor breakdown.', visualEffect: 'no_visible_change' },
      ],
      datasheetUrl: 'https://www.ti.com/lit/ds/symlink/lm358.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a magnifying glass for tiny electrical voltages: it takes a microscopic millivolt signal from a sensor and magnifies it into a full 0-5V signal.',
        howToIdentify: 'Black DIP-8 rectangular chip with "LM358" stamped in white or silver on top.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'Notch at top: Pin 1 is top-left (Output 1), Pin 4 is bottom-left (GND), Pin 8 is top-right (VCC+).',
        },
        realWorldExample: 'Pre-amplifiers for microphones, sensor interfaces, and comparator decision circuits.',
        beginnerMistakesToAvoid: [
          'Forgetting that op-amp outputs cannot output more voltage than their supply voltage (e.g. on a 5V supply, output maxes out around 3.8V).',
        ],
      },
    },
  },

  // 12. 100uH TOROIDAL INDUCTOR
  {
    id: 'pass_ind_toroid_100u',
    slug: '100uh-toroid-power-inductor',
    name: '100µH Toroidal Power Inductor',
    category: 'passive',
    featured: true,
    symbolType: 'inductor',
    tags: ['inductor', 'coil', 'toroid', 'choke', 'magnetic', 'filter', '100uh'],
    package: {
      standardCode: 'Radial-Toroid-12mm',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 13.0, heightMm: 13.0, depthMm: 6.0 },
      pitchMm: 5.08,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Lead 1', type: 'passive', positionMm: { x: -2.54, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Lead 2', type: 'passive', positionMm: { x: 2.54, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/toroid/toroid_lod0.glb',
        lod1GlbUrl: '/assets/components/toroid/toroid_lod1.glb',
        lod2GlbUrl: '/assets/components/toroid/toroid_internal_lod2.glb',
      },
      previewColor: '#78350f',
      internalLayers: [
        { layerId: 'ferrite', displayName: 'Iron Powder / Ferrite Toroid Ring', meshNodeName: 'Mesh_Ferrite', materialType: 'ferrite', defaultVisible: true, canClip: true },
        { layerId: 'copper_winding', displayName: 'Enamelled Copper Magnet Wire (38 Turns)', meshNodeName: 'Mesh_Coil', materialType: 'copper_leadframe', defaultVisible: true, canClip: true },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'L',
      netlistTemplate: 'L{NAME} {P1} {P2} 100u',
      pinMap: [
        { pinNumber: 1, pinName: 'Lead 1', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Lead 2', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 100,
        maxCurrentContinuousA: 2.5,
        maxCurrentPeakA: 4.0,
        maxPowerDissipationW: 1.2,
        maxJunctionTempC: 125,
        minOperatingTempC: -40,
      },
      thermal: { rThetaJA: 65, rThetaJC: 25, thermalTimeConstantSec: 25 },
      rawSpiceModel: 'L{NAME} {P1} {P2} 100u RSER=0.08',
    },
    educational: {
      tagline: 'Magnetic energy storage for switching power supplies and filters.',
      summary: 'Opposes rapid changes in current via Faraday’s Law of Electromagnetic Induction (V = L × dI/dt).',
      physicalOperatingPrinciple: 'Time-varying electric current generates an internal circular magnetic flux confined entirely within the high-permeability closed toroid geometry.',
      microscopicMechanism: 'Magnetic dipole domains inside the iron-powder matrix align with the applied coil current vector, storing energy in the concentrated B-field.',
      commonFailureModes: [
        { trigger: 'Excessive DC bias current causing core saturation', consequence: 'Permeability collapse, inductance dropping to air-core values (~5µH).', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://www.we-online.com/catalog/datasheet/7447012.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a heavy mechanical flywheel: it takes effort to get current rolling, but once flowing, it resists stopping and keeps pushing current forward.',
        howToIdentify: 'A donut-shaped green or yellow iron ring wound with gleaming copper wire coils, with two copper wire ends poking down.',
        polarityGuide: {
          isPolarized: false,
          pinIdentificationRule: 'NON-POLARIZED! Inductors work in either direction.',
        },
        realWorldExample: 'Found in buck/boost switching converters inside laptops and fast chargers to step voltage down without wasting power as heat.',
        beginnerMistakesToAvoid: [
          'Disconnecting an active inductor suddenly without a flyback diode: the collapsing magnetic field creates a huge reverse high-voltage spike that can zap nearby microcontrollers!',
        ],
      },
    },
  },

  // 13. TACTILE PUSH BUTTON SWITCH
  {
    id: 'sw_tact_6mm',
    slug: '6mm-tactile-push-button-switch',
    name: '6x6mm Tactile Momentary Push Button',
    category: 'electromechanical',
    featured: true,
    symbolType: 'switch',
    tags: ['switch', 'button', 'tactile', 'momentary', 'input', 'trigger', '6mm'],
    package: {
      standardCode: 'Tact-6x6mm',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 6.0, heightMm: 5.0, depthMm: 6.0 },
      pitchMm: 4.5,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Term 1A', type: 'passive', positionMm: { x: -2.25, y: -3, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Term 1B', type: 'passive', positionMm: { x: 2.25, y: -3, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p3', pinNumber: 3, name: 'Term 2A', type: 'passive', positionMm: { x: -2.25, y: 3, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p4', pinNumber: 4, name: 'Term 2B', type: 'passive', positionMm: { x: 2.25, y: 3, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/tact/tact_lod0.glb',
        lod1GlbUrl: '/assets/components/tact/tact_lod1.glb',
        lod2GlbUrl: '/assets/components/tact/tact_lod2.glb',
      },
      previewColor: '#475569',
      internalLayers: [
        { layerId: 'housing', displayName: 'Flame-Retardant Nylon Housing', meshNodeName: 'Mesh_Case', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'dome', displayName: 'Stainless Steel Clicky Snap Dome', meshNodeName: 'Mesh_Dome', materialType: 'copper_leadframe', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'S',
      netlistTemplate: 'S{NAME} {P1} {P3} 0 0 SW_TACT',
      pinMap: [
        { pinNumber: 1, pinName: 'Term 1A', spiceNodeOrder: 1 },
        { pinNumber: 3, pinName: 'Term 2A', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 12,
        maxCurrentContinuousA: 0.05,
        maxCurrentPeakA: 0.1,
        maxPowerDissipationW: 0.1,
        maxJunctionTempC: 85,
        minOperatingTempC: -20,
      },
      thermal: { rThetaJA: 200, rThetaJC: 80, thermalTimeConstantSec: 5 },
      rawSpiceModel: '.MODEL SW_TACT VSWITCH(RON=0.05 ROFF=1E9 VON=1 VOFF=0)',
    },
    educational: {
      tagline: 'Standard 4-pin momentary contact switch with tactile click feedback.',
      summary: 'Used for user input buttons, reset keys, and mode selection.',
      physicalOperatingPrinciple: 'Pressing the actuator snaps a curved metal dome downward, bridging internal contacts with tactile tactile sensation.',
      microscopicMechanism: 'Spring steel disc deformation bridging gold-plated contact pads.',
      commonFailureModes: [
        { trigger: 'Mechanical fatigue over 100,000 cycles', consequence: 'High contact resistance or contact bounce.', visualEffect: 'no_visible_change' },
      ],
      datasheetUrl: 'https://www.e-switch.com/system/asset/product_line/data_sheet/119/TL1105.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a doorbell: press it down to complete the circuit and ring the bell, release it and it springs back open.',
        howToIdentify: 'A small square black button with a silver metal plate on top and a round button in the center, with 4 curved metal legs.',
        polarityGuide: {
          isPolarized: false,
          pinIdentificationRule: 'NON-POLARIZED! But notice: the 4 legs are paired internally! Pins on opposite sides (across the center gap) are the switch contacts. When you push the button, it connects the top pair to the bottom pair.',
        },
        realWorldExample: 'Reset buttons on electronic gadgets, keyboard keys, microwave controls.',
        beginnerMistakesToAvoid: [
          'Wiring across the two pins on the same side that are already permanently connected internally (making the circuit always ON!).',
        ],
      },
    },
  },

  // 14. LDR PHOTORESISTOR (CdS)
  {
    id: 'sensor_ldr_5mm',
    slug: '5mm-cds-photoresistor-ldr',
    name: '5mm LDR Light Dependent Resistor',
    category: 'sensor',
    featured: true,
    symbolType: 'photoresistor',
    tags: ['sensor', 'ldr', 'light', 'photoresistor', 'cds', 'optical', 'lux'],
    package: {
      standardCode: 'Radial-5mm',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 5.0, heightMm: 4.0, depthMm: 2.0 },
      pitchMm: 3.5,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Lead 1', type: 'passive', positionMm: { x: -1.75, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Lead 2', type: 'passive', positionMm: { x: 1.75, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/ldr/ldr_lod0.glb',
        lod1GlbUrl: '/assets/components/ldr/ldr_lod1.glb',
        lod2GlbUrl: '/assets/components/ldr/ldr_lod2.glb',
      },
      previewColor: '#eab308',
      internalLayers: [
        { layerId: 'cds_track', displayName: 'Cadmium Sulfide (CdS) Squiggle Track', meshNodeName: 'Mesh_Track', materialType: 'ceramic', defaultVisible: true, canClip: true },
        { layerId: 'ceramic_base', displayName: 'Alumina Ceramic Substrate Base', meshNodeName: 'Mesh_Base', materialType: 'ceramic', defaultVisible: true, canClip: true },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'R',
      netlistTemplate: 'R{NAME} {P1} {P2} 10k',
      pinMap: [
        { pinNumber: 1, pinName: 'Lead 1', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Lead 2', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 150,
        maxCurrentContinuousA: 0.02,
        maxCurrentPeakA: 0.05,
        maxPowerDissipationW: 0.1,
        maxJunctionTempC: 75,
        minOperatingTempC: -30,
      },
      thermal: { rThetaJA: 350, rThetaJC: 140, thermalTimeConstantSec: 8 },
      rawSpiceModel: 'R{NAME} {P1} {P2} 10k',
    },
    educational: {
      tagline: 'Analog optical sensor whose electrical resistance drops dramatically in bright light.',
      summary: 'Measures ambient light levels: high resistance in the dark (1MΩ+), drops to low resistance in sunlight (1kΩ).',
      physicalOperatingPrinciple: 'Photoconductivity: incident photons with energy greater than the bandgap liberate valence electrons into the conduction band, increasing conductivity.',
      microscopicMechanism: 'Photon-induced electron-hole pair generation in semiconductor cadmium sulfide crystals.',
      commonFailureModes: [
        { trigger: 'Excessive environmental humidity without conformal coating', consequence: 'Oxidation of CdS tracks.', visualEffect: 'no_visible_change' },
      ],
      datasheetUrl: 'https://components101.com/sensors/ldr-datasheet.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a window blind that opens wider when sunlight hits it, letting electricity flow through easily.',
        howToIdentify: 'A round ceramic disc with two wires, featuring a red or orange squiggly wave line on its clear face.',
        polarityGuide: {
          isPolarized: false,
          pinIdentificationRule: 'NON-POLARIZED! Works in either direction.',
        },
        realWorldExample: 'Street lights that turn on automatically at dusk, solar garden lights, nightlights.',
        beginnerMistakesToAvoid: [
          'Trying to read it with a microcontroller pin without a 10kΩ resistor! You must combine it with a resistor to form a voltage divider to measure changing voltage.',
        ],
      },
    },
  },

  // 15. ACTIVE PIEZO BUZZER 5V
  {
    id: 'out_buzzer_5v',
    slug: '5v-active-piezo-buzzer',
    name: '5V Active Piezoelectric Sound Buzzer',
    category: 'electromechanical',
    featured: true,
    symbolType: 'buzzer',
    tags: ['buzzer', 'audio', 'piezo', 'sound', 'beeper', 'alarm', '5v', 'output'],
    package: {
      standardCode: 'Radial-Cylindrical-12mm',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 12.0, heightMm: 9.5, depthMm: 12.0 },
      pitchMm: 7.62,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'Positive (+)', type: 'power', positionMm: { x: -3.81, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Negative (-)', type: 'ground', positionMm: { x: 3.81, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/buzzer/buzzer_lod0.glb',
        lod1GlbUrl: '/assets/components/buzzer/buzzer_lod1.glb',
        lod2GlbUrl: '/assets/components/buzzer/buzzer_lod2.glb',
      },
      previewColor: '#0f172a',
      internalLayers: [
        { layerId: 'housing', displayName: 'PBT Acoustic Resonance Chamber', meshNodeName: 'Mesh_Case', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'piezo_disc', displayName: 'Piezoelectric Ceramic Brass Disc', meshNodeName: 'Mesh_Disc', materialType: 'ceramic', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'R',
      netlistTemplate: 'R{NAME} {P1} {P2} 160',
      pinMap: [
        { pinNumber: 1, pinName: 'Positive (+)', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Negative (-)', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 12,
        maxCurrentContinuousA: 0.03,
        maxCurrentPeakA: 0.05,
        maxPowerDissipationW: 0.35,
        maxJunctionTempC: 85,
        minOperatingTempC: -20,
      },
      thermal: { rThetaJA: 200, rThetaJC: 70, thermalTimeConstantSec: 10 },
      rawSpiceModel: 'R{NAME} {P1} {P2} 160',
    },
    educational: {
      tagline: 'Self-oscillating acoustic transducer producing a piercing 2.3 kHz audible alert tone.',
      summary: 'Contains an internal transistor oscillator: simply apply 5V DC and it emits a loud 85dB beep.',
      physicalOperatingPrinciple: 'Inverse piezoelectric effect: electric voltage across a lead zirconate titanate (PZT) ceramic crystal induces physical mechanical strain, vibrating a brass diaphragm.',
      microscopicMechanism: 'Perovskite unit cell asymmetric ion shift generating macroscopic mechanical acoustic waves.',
      commonFailureModes: [
        { trigger: 'Sustained overvoltage (>12V)', consequence: 'Internal oscillator transistor breakdown.', visualEffect: 'no_visible_change' },
      ],
      datasheetUrl: 'https://www.cui.com/product/resource/cpe-242.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like an electric whistle: connect it to a 5V battery, and it instantly emits a loud high-pitched BEEP!',
        howToIdentify: 'A black plastic cylinder with a small sound hole in the top and a red sticker or stamped "+" sign marking the positive terminal.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'POLARIZED! 1) The LONGER leg is Positive (+). 2) The side marked with the "+" sign or red sticker is Positive (+).',
          warningIfReversed: 'Connecting backwards will not make sound and can damage the internal oscillator transistor.',
        },
        realWorldExample: 'Microwave oven beepers, smoke alarms, alarm clocks, cash register chimes.',
        beginnerMistakesToAvoid: [
          'Confusing Active vs Passive buzzers! An Active buzzer only needs plain 5V DC to beep. A Passive buzzer requires a complex AC frequency signal from software.',
        ],
      },
    },
  },

  // 16. LM35 PRECISION TEMPERATURE SENSOR
  {
    id: 'sensor_temp_lm35',
    slug: 'lm35-precision-centigrade-temperature-sensor',
    name: 'LM35 Precision Analog Centigrade Temperature Sensor',
    category: 'sensor',
    featured: true,
    symbolType: 'temperature_sensor',
    tags: ['sensor', 'temperature', 'analog', 'to-92', 'celsius', 'lm35', 'thermometer'],
    package: {
      standardCode: 'TO-92-3',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 4.8, heightMm: 5.2, depthMm: 3.8 },
      pitchMm: 1.27,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: '+Vs (Supply)', type: 'power', positionMm: { x: -1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'Vout (Analog)', type: 'output', positionMm: { x: 0, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p3', pinNumber: 3, name: 'GND (Ground)', type: 'ground', positionMm: { x: 1.27, y: -4, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/lm35/lm35_lod0.glb',
        lod1GlbUrl: '/assets/components/lm35/lm35_lod1.glb',
        lod2GlbUrl: '/assets/components/lm35/lm35_lod2.glb',
      },
      previewColor: '#1e293b',
      internalLayers: [
        { layerId: 'mold', displayName: 'Epoxy Resin Package Body', meshNodeName: 'Mesh_Case', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'die', displayName: 'Bandgap Reference Silicon Die', meshNodeName: 'Mesh_Die', materialType: 'silicon_die', defaultVisible: true, canClip: false },
        { layerId: 'leads', displayName: 'Copper Leadframe Fingers', meshNodeName: 'Mesh_Leads', materialType: 'copper_leadframe', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'subcircuit',
      spicePrefix: 'X',
      netlistTemplate: 'X{NAME} {P1} {P2} {P3} LM35DZ',
      pinMap: [
        { pinNumber: 1, pinName: '+Vs', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Vout', spiceNodeOrder: 2 },
        { pinNumber: 3, pinName: 'GND', spiceNodeOrder: 3 },
      ],
      ratings: {
        maxVoltageV: 35,
        maxCurrentContinuousA: 0.01,
        maxCurrentPeakA: 0.02,
        maxPowerDissipationW: 0.4,
        maxJunctionTempC: 150,
        minOperatingTempC: -55,
      },
      thermal: { rThetaJA: 180, rThetaJC: 65, thermalTimeConstantSec: 3 },
      rawSpiceModel: '.SUBCKT LM35DZ 1 2 3\nB1 2 3 V=TEMP*0.01\n.ENDS',
    },
    educational: {
      tagline: 'Linear Celsius temperature sensor outputting exactly 10 millivolts per degree Celsius (10 mV/°C).',
      summary: 'Precision analog sensor calibrated directly in Celsius: at 25°C room temp, output is 250mV.',
      physicalOperatingPrinciple: 'PTAT (Proportional To Absolute Temperature) bandgap core using difference in base-emitter voltages (ΔVbe) of two transistors operated at different current densities.',
      microscopicMechanism: 'Thermal kinetic energy increases carrier diffusion over p-n junctions, producing a mathematically linear voltage proportional to absolute temperature.',
      commonFailureModes: [
        { trigger: 'Reversed supply voltage (connecting +Vs to GND)', consequence: 'Rapid thermal destruction of internal silicon bandgap circuit.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://www.ti.com/lit/ds/symlink/lm35.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a high-precision thermometer with a built-in translator: every 1 degree warmer produces an extra 10 millivolts on its output pin.',
        howToIdentify: 'Black D-shaped TO-92 plastic transistor casing printed with "LM35DZ". Looking at the flat face from left to right: Pin 1 (+Vs), Pin 2 (Vout), Pin 3 (GND).',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'POLARIZED! Face the FLAT side toward you: Left leg is +Vs (4V to 20V), Middle leg is Analog Output, Right leg is Ground (0V).',
          warningIfReversed: 'Reversing +Vs and GND will overheat the sensor in seconds and permanently burn out the internal silicon die.',
        },
        realWorldExample: 'Digital room thermometers, 3D printer enclosure monitors, battery thermal protection circuits.',
        beginnerMistakesToAvoid: [
          'Confusing the pinout with a 2N3904 transistor! The pins are totally different: feeding 5V to the wrong pin will destroy the chip.',
        ],
      },
    },
  },

  // 17. RASPBERRY PI PICO (RP2040)
  {
    id: 'board_raspberry_pi_pico',
    slug: 'raspberry-pi-pico-rp2040-microcontroller',
    name: 'Raspberry Pi Pico (Dual ARM Cortex-M0+ RP2040)',
    category: 'integrated_circuit',
    featured: true,
    symbolType: 'microcontroller',
    tags: ['mcu', 'raspberry-pi', 'pico', 'rp2040', 'arm', 'cortex-m0+', 'micropython', 'c++', 'board'],
    package: {
      standardCode: 'DIP-40-Castellated',
      mounting: 'through_hole',
      dimensionsMm: { widthMm: 21.0, heightMm: 51.0, depthMm: 4.0 },
      pitchMm: 2.54,
      pins: [
        { pinId: 'p1', pinNumber: 1, name: 'GP0 (UART0 TX)', type: 'tri_state', positionMm: { x: -10, y: 22, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p2', pinNumber: 2, name: 'GP1 (UART0 RX)', type: 'tri_state', positionMm: { x: -10, y: 19.5, z: 0 }, leadDirection: { x: -1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p36', pinNumber: 36, name: '3V3(OUT)', type: 'power', positionMm: { x: 10, y: 17, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p38', pinNumber: 38, name: 'GND', type: 'ground', positionMm: { x: 10, y: 22, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
        { pinId: 'p40', pinNumber: 40, name: 'VBUS (5V USB)', type: 'power', positionMm: { x: 10, y: 24.5, z: 0 }, leadDirection: { x: 1, y: 0, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/pico/pico_lod0.glb',
        lod1GlbUrl: '/assets/components/pico/pico_lod1.glb',
        lod2GlbUrl: '/assets/components/pico/pico_lod2.glb',
      },
      previewColor: '#059669',
      internalLayers: [
        { layerId: 'pcb', displayName: 'FR-4 Multi-Layer Green Matte Substrate', meshNodeName: 'Mesh_PCB', materialType: 'ceramic', defaultVisible: true, canClip: true },
        { layerId: 'rp2040', displayName: 'RP2040 Dual ARM Core Processor', meshNodeName: 'Mesh_MCU', materialType: 'silicon_die', defaultVisible: true, canClip: false },
        { layerId: 'flash', displayName: '2MB QSPI NOR Flash Storage', meshNodeName: 'Mesh_Flash', materialType: 'silicon_die', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'subcircuit',
      spicePrefix: 'U',
      netlistTemplate: 'U{NAME} 5V 3V3 GND PICO_RP2040',
      pinMap: [
        { pinNumber: 40, pinName: 'VBUS', spiceNodeOrder: 1 },
        { pinNumber: 36, pinName: '3V3', spiceNodeOrder: 2 },
        { pinNumber: 38, pinName: 'GND', spiceNodeOrder: 3 },
      ],
      ratings: {
        maxVoltageV: 5.5,
        maxCurrentContinuousA: 0.3,
        maxCurrentPeakA: 0.5,
        maxPowerDissipationW: 1.5,
        maxJunctionTempC: 85,
        minOperatingTempC: -20,
      },
      thermal: { rThetaJA: 60, rThetaJC: 25, thermalTimeConstantSec: 5 },
      rawSpiceModel: '.SUBCKT PICO_RP2040 1 2 3\n* RP2040 Microcontroller Emulation Model\n.ENDS',
    },
    educational: {
      tagline: 'High-performance microcontroller board powered by the Raspberry Pi RP2040 dual-core silicon chip.',
      summary: 'Features dual Cortex-M0+ cores @ 133MHz, 264KB SRAM, 2MB Flash, programmable I/O (PIO), and USB 1.1 support.',
      physicalOperatingPrinciple: '32-bit Harvard architecture with concurrent bus fabric allowing DMA, CPU cores, and PIO state machines to access memory without stalling.',
      microscopicMechanism: 'TSMC 40nm LP CMOS transistors toggling at 133 MHz clock frequencies with low static leakage.',
      commonFailureModes: [
        { trigger: 'Feeding >3.6V directly into 3.3V GPIO pins', consequence: 'Internal ESD protection diode burnout and pin permanent latch-up.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'A powerful pocket-sized computer brain capable of controlling motors, reading sensors, and executing code thousands of times per second.',
        howToIdentify: 'A sleek green rectangular board with castellations along both edges and an RP2040 chip in the middle.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'Power via micro-USB port (5V) or connect 5V to VBUS (Pin 40) and Ground to GND (Pin 38). GPIO pins operate at 3.3V strictly.',
          warningIfReversed: 'GPIO pins are NOT 5V tolerant! Applying 5V to any GPIO pin will permanently damage the RP2040.',
        },
        realWorldExample: 'Robotics controllers, DIY USB macro keyboards, smart home weather stations.',
        beginnerMistakesToAvoid: [
          'Supplying 5V logic signals to 3.3V Pico pins without a logic-level converter.',
        ],
      },
    },
  },

  // 18. ARDUINO UNO R3
  {
    id: 'board_arduino_uno',
    slug: 'arduino-uno-r3-atmega328p',
    name: 'Arduino Uno R3 Microcontroller Board (ATmega328P)',
    category: 'integrated_circuit',
    featured: true,
    symbolType: 'microcontroller',
    tags: ['arduino', 'uno', 'atmega328p', 'mcu', 'robotics', 'prototyping', '5v-logic'],
    package: {
      standardCode: 'DevBoard-Uno-R3',
      mounting: 'chassis',
      dimensionsMm: { widthMm: 53.4, heightMm: 68.6, depthMm: 15.0 },
      pitchMm: 2.54,
      pins: [
        { pinId: 'p_vin', pinNumber: 1, name: 'VIN (7-12V)', type: 'power', positionMm: { x: -20, y: -25, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: false },
        { pinId: 'p_5v', pinNumber: 2, name: '5V (Regulated)', type: 'power', positionMm: { x: -17.5, y: -25, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: false },
        { pinId: 'p_gnd', pinNumber: 3, name: 'GND', type: 'ground', positionMm: { x: -15, y: -25, z: 0 }, leadDirection: { x: 0, y: -1, z: 0 }, breadboardCompatible: false },
        { pinId: 'p_d13', pinNumber: 13, name: 'D13 (LED)', type: 'tri_state', positionMm: { x: 15, y: 25, z: 0 }, leadDirection: { x: 0, y: 1, z: 0 }, breadboardCompatible: false },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/arduino/arduino_lod0.glb',
        lod1GlbUrl: '/assets/components/arduino/arduino_lod1.glb',
        lod2GlbUrl: '/assets/components/arduino/arduino_lod2.glb',
      },
      previewColor: '#0284c7',
      internalLayers: [
        { layerId: 'board', displayName: 'Classic Italian Blue FR-4 PCB', meshNodeName: 'Mesh_Board', materialType: 'ceramic', defaultVisible: true, canClip: true },
        { layerId: 'atmega', displayName: 'ATmega328P DIP-28 8-bit Microcontroller', meshNodeName: 'Mesh_MCU', materialType: 'plastic_mold', defaultVisible: true, canClip: false },
        { layerId: 'regulator', displayName: '5V LDO Onboard Voltage Regulator', meshNodeName: 'Mesh_Regulator', materialType: 'plastic_mold', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'subcircuit',
      spicePrefix: 'U',
      netlistTemplate: 'U{NAME} 5V GND ARDUINO_UNO',
      pinMap: [
        { pinNumber: 2, pinName: '5V', spiceNodeOrder: 1 },
        { pinNumber: 3, pinName: 'GND', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 12,
        maxCurrentContinuousA: 0.5,
        maxCurrentPeakA: 1.0,
        maxPowerDissipationW: 2.5,
        maxJunctionTempC: 85,
        minOperatingTempC: -40,
      },
      thermal: { rThetaJA: 50, rThetaJC: 20, thermalTimeConstantSec: 8 },
      rawSpiceModel: '.SUBCKT ARDUINO_UNO 1 2\n* Arduino Uno Emulation Model\n.ENDS',
    },
    educational: {
      tagline: 'The world benchmark open-source physical computing board for rapid electronics prototyping.',
      summary: 'Equipped with 14 digital I/O pins, 6 analog inputs, 16MHz ceramic resonator, USB-B interface, and DC barrel jack.',
      physicalOperatingPrinciple: 'AVR 8-bit RISC microprocessor with single-cycle execution of most instructions at 16 MIPS.',
      microscopicMechanism: 'Silicon gate CMOS process with non-volatile flash memory cells storing machine instructions.',
      commonFailureModes: [
        { trigger: 'Drawing >40mA from an individual GPIO pin or >200mA total', consequence: 'Internal pin output driver transistor failure.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'The classic electronics brain for hobbyists and students: plug in a USB cable, write code in the Arduino IDE, and watch LEDs blink and motors move.',
        howToIdentify: 'Distinctive blue board with a silver USB-B port, black DC barrel jack, and a large black 28-pin chip in the center.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'Power via USB cable, DC barrel jack (7-12V Center-Positive), or 5V pin. Female header pins are clearly labelled.',
          warningIfReversed: 'Connecting reversed voltage to the 5V pin bypasses the regulator and will instantly destroy the ATmega328P.',
        },
        realWorldExample: 'Line-following robots, automated plant watering systems, home automation relays.',
        beginnerMistakesToAvoid: [
          'Powering heavy motors directly from Arduino 5V pin without an external motor driver or battery.',
        ],
      },
    },
  },

  // 19. 9V ALKALINE BATTERY
  {
    id: 'power_battery_9v',
    slug: '9v-alkaline-transistor-battery-6f22',
    name: '9V Alkaline Transistor Battery (6F22 / PP3)',
    category: 'power_management',
    featured: true,
    symbolType: 'battery',
    tags: ['battery', '9v', 'power', 'dc-voltage', 'alkaline', 'transistor-battery', 'source'],
    package: {
      standardCode: '6F22-Prismatic-9V',
      mounting: 'terminal',
      dimensionsMm: { widthMm: 26.5, heightMm: 48.5, depthMm: 17.5 },
      pitchMm: 12.7,
      pins: [
        { pinId: 'p_pos', pinNumber: 1, name: 'Positive Snap (+9V)', type: 'power', positionMm: { x: -6.35, y: 25, z: 0 }, leadDirection: { x: 0, y: 1, z: 0 }, breadboardCompatible: false },
        { pinId: 'p_neg', pinNumber: 2, name: 'Negative Snap (GND)', type: 'ground', positionMm: { x: 6.35, y: 25, z: 0 }, leadDirection: { x: 0, y: 1, z: 0 }, breadboardCompatible: false },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/battery/battery9v_lod0.glb',
        lod1GlbUrl: '/assets/components/battery/battery9v_lod1.glb',
        lod2GlbUrl: '/assets/components/battery/battery9v_lod2.glb',
      },
      previewColor: '#1e1b24',
      internalLayers: [
        { layerId: 'jacket', displayName: 'Steel Casing & Insulating Label', meshNodeName: 'Mesh_Case', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'cells', displayName: 'Six 1.5V Alkaline Series Cylindrical Cells', meshNodeName: 'Mesh_Cells', materialType: 'copper_leadframe', defaultVisible: true, canClip: false },
        { layerId: 'terminals', displayName: 'Miniature Snap Fastener Contacts', meshNodeName: 'Mesh_Terminals', materialType: 'copper_leadframe', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'V',
      netlistTemplate: 'V{NAME} {P1} {P2} DC 9V',
      pinMap: [
        { pinNumber: 1, pinName: 'Positive (+)', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Negative (-)', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 9.6,
        maxCurrentContinuousA: 0.5,
        maxCurrentPeakA: 1.2,
        maxPowerDissipationW: 4.5,
        maxJunctionTempC: 55,
        minOperatingTempC: -10,
      },
      thermal: { rThetaJA: 30, rThetaJC: 10, thermalTimeConstantSec: 60 },
      rawSpiceModel: 'V{NAME} {P1} {P2} DC 9V RS=1.5',
    },
    educational: {
      tagline: 'Standard 9-volt portable electro-chemical power source for standalone devices.',
      summary: 'Internally constructed of six 1.5V LR61 cylindrical cells connected in series, delivering 9.0V nominal DC potential with ~550mAh energy.',
      physicalOperatingPrinciple: 'Zinc-manganese dioxide (Zn/MnO2) redox electrochemical reactions driving spontaneous electron flow through the external load.',
      microscopicMechanism: 'Zinc oxidation at the anode releasing electrons: Zn + 2OH- -> ZnO + H2O + 2e-, paired with manganese reduction at the cathode.',
      commonFailureModes: [
        { trigger: 'Direct terminal short-circuit (connecting positive to negative with a wire)', consequence: 'Extreme internal ohmic self-heating, electrolyte boiling, and vent rupture.', visualEffect: 'smoke_cloud' },
      ],
      datasheetUrl: 'https://data.energizer.com/pdfs/522.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'A portable DC power station inside a rectangular metal box that provides clean 9V battery power for portable circuits.',
        howToIdentify: 'Rectangular prismatic metal body with two distinctive snap connectors on top: one male circular stud and one female hexagonal socket.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'POLARIZED! The SMALL circular male stud is Positive (+9V). The LARGER octagonal/hexagonal socket is Negative (-/GND).',
          warningIfReversed: 'Reversed connection to electronics without reverse-polarity protection can permanently destroy ICs and transistors.',
        },
        realWorldExample: 'Smoke detectors, guitar pedals, wireless microphones, multimeters.',
        beginnerMistakesToAvoid: [
          'Storing loose in a drawer with coins or keys: metal objects can short the terminals and start a fire!',
        ],
      },
    },
  },

  // 20. AA / AAA BATTERY PACK WITH USER SWITCH
  {
    id: 'power_battery_aa_pack',
    slug: 'aa-battery-holder-pack-with-switch',
    name: 'AA / AAA Battery Cell Holder with User Power Switch',
    category: 'power_management',
    featured: true,
    symbolType: 'battery',
    tags: ['battery', 'aa', 'aaa', 'battery-pack', 'holder', 'switch', 'power-source', '3v', '4.5v'],
    package: {
      standardCode: 'BatteryHolder-AA-Pack',
      mounting: 'terminal',
      dimensionsMm: { widthMm: 32.0, heightMm: 58.0, depthMm: 16.0 },
      pitchMm: 15.0,
      pins: [
        { pinId: 'p_vcc', pinNumber: 1, name: 'VCC Red Wire (+)', type: 'power', positionMm: { x: -8, y: 28, z: 0 }, leadDirection: { x: 0, y: 1, z: 0 }, breadboardCompatible: true },
        { pinId: 'p_gnd', pinNumber: 2, name: 'GND Black Wire (-)', type: 'ground', positionMm: { x: 8, y: 28, z: 0 }, leadDirection: { x: 0, y: 1, z: 0 }, breadboardCompatible: true },
      ],
    },
    visual3d: {
      lods: {
        lod0GlbUrl: '/assets/components/battery/battery_aa_lod0.glb',
        lod1GlbUrl: '/assets/components/battery/battery_aa_lod1.glb',
        lod2GlbUrl: '/assets/components/battery/battery_aa_lod2.glb',
      },
      previewColor: '#b45309',
      internalLayers: [
        { layerId: 'housing', displayName: 'Heavy-Duty ABS Plastic Enclosure', meshNodeName: 'Mesh_Case', materialType: 'plastic_mold', defaultVisible: true, canClip: true },
        { layerId: 'switch', displayName: 'Integrated Slide ON/OFF Safety Power Switch', meshNodeName: 'Mesh_Switch', materialType: 'plastic_mold', defaultVisible: true, canClip: false },
        { layerId: 'springs', displayName: 'Nickel-Plated Steel Contact Springs', meshNodeName: 'Mesh_Springs', materialType: 'copper_leadframe', defaultVisible: true, canClip: false },
      ],
    },
    electrical: {
      kind: 'primitive',
      spicePrefix: 'V',
      netlistTemplate: 'V{NAME} {P1} {P2} DC 3V',
      pinMap: [
        { pinNumber: 1, pinName: 'Positive (+)', spiceNodeOrder: 1 },
        { pinNumber: 2, pinName: 'Negative (-)', spiceNodeOrder: 2 },
      ],
      ratings: {
        maxVoltageV: 4.8,
        maxCurrentContinuousA: 1.5,
        maxCurrentPeakA: 2.5,
        maxPowerDissipationW: 5.0,
        maxJunctionTempC: 60,
        minOperatingTempC: -15,
      },
      thermal: { rThetaJA: 25, rThetaJC: 8, thermalTimeConstantSec: 45 },
      rawSpiceModel: 'V{NAME} {P1} {P2} DC 3V RS=0.5',
    },
    educational: {
      tagline: 'Molded cell carrier with user-controlled power switch and standardized breadboard flyleads.',
      summary: 'Holds 2 to 3 standard AA or AAA alkaline/rechargeable batteries in series. Equipped with a dedicated mechanical ON/OFF switch allowing manual circuit power control without disconnecting wires.',
      physicalOperatingPrinciple: 'Series addition of electrochemical cell potentials with mechanical physical circuit break via SPST slide contact.',
      microscopicMechanism: 'Slide switch separates metal wiper leaf from stator pad, creating infinite ohmic impedance across circuit supply.',
      commonFailureModes: [
        { trigger: 'Corrosion from expired leaking alkaline cells', consequence: 'High contact resistance on steel spring terminals.', visualEffect: 'burn_mark' },
      ],
      datasheetUrl: 'https://data.energizer.com/pdfs/e91.pdf',
      beginnerGuide: {
        plainEnglishAnalogy: 'Like a secure garage for your AA batteries with a handy built-in light switch: turn your entire circuit on or off with a simple thumb flick!',
        howToIdentify: 'Black molded plastic box holding cylindrical AA/AAA cells, featuring a red or black slide switch on the side and red (+) and black (-) wire leads.',
        polarityGuide: {
          isPolarized: true,
          pinIdentificationRule: 'POLARIZED! The RED wire is Positive (+3V/+4.5V). The BLACK wire is Negative (GND). In the tray, the FLAT end of each cell pushes against the spring (Negative).',
          warningIfReversed: 'Inserting batteries backwards will cause short-circuits in polarized circuits.',
        },
        realWorldExample: 'Toy cars, remote controls, portable sensor loggers, DIY robotics kits.',
        beginnerMistakesToAvoid: [
          'Leaving the power switch turned ON when rewiring your breadboard: always switch OFF before changing connections!',
        ],
      },
    },
  },
];
