/**
 * 3D Lab — Phase 5: Learning Academy Curriculum
 * Content-driven interactive courses featuring 3D cutaway demos, live simulations, quizzes & practical challenges.
 */

import { AcademyModule } from '@/types/academy';

export const ACADEMY_CURRICULUM: AcademyModule[] = [
  // MODULE 1: Capacitors & Energy Storage (The explicit required path)
  {
    id: 'mod_capacitors',
    title: 'Capacitors & Electrostatic Energy Storage',
    shortTitle: 'Capacitors',
    tagline: 'Master electrostatic fields, dielectric polarization, and dynamic RC charge/discharge curves.',
    description: 'Explore how electric fields store potential energy between parallel conductors, observe dielectric breakdown in 3D, and interactively calculate RC time constants tau = R * C.',
    category: 'passive',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    lessons: [
      {
        id: 'les_cap_foundations',
        moduleId: 'mod_capacitors',
        title: 'Understanding Capacitors & Electrostatic Fields',
        tagline: 'Physical operating principles of electric charge accumulation on conductive plates.',
        objectives: [
          'Define capacitance C = Q / V in farads.',
          'Understand how dielectric permittivity epsilon increases charge storage capability.',
          'Distinguish electrostatic potential energy from chemical battery energy.',
        ],
        stages: [
          {
            id: 'cap_stg_theory',
            title: '1. Theoretical Fundamentals: Electric Fields & Capacitance',
            type: 'theory',
            content: `### Capacitance Fundamentals

A capacitor consists of two electrical conductors separated by an insulating dielectric medium. When a potential difference $V$ is applied across the conductors, an electric field develops across the dielectric, causing net positive charge $+Q$ to accumulate on one conductor and equal negative charge $-Q$ on the other.

The fundamental relationship governing any capacitor is:
$$Q = C \\times V$$

Where:
- $Q$ is the accumulated charge in Coulombs (C)
- $C$ is the capacitance in Farads (F)
- $V$ is the potential difference in Volts (V)

The physical capacitance of a parallel-plate structure is defined by its geometry:
$$C = \\varepsilon_r \\varepsilon_0 \\frac{A}{d}$$

Where $\\varepsilon_r$ is the relative permittivity (dielectric constant) of the insulator, $\\varepsilon_0 \\approx 8.854 \\times 10^{-12} \\text{ F/m}$ is the vacuum permittivity, $A$ is the plate surface area, and $d$ is the dielectric separation thickness.

The energy stored electrostatically inside the dielectric field is:
$$E = \\frac{1}{2} C V^2$$
`,
          },
          {
            id: 'cap_stg_cutaway',
            title: '2. Internal Construction & Electrolytic Dielectric Layer',
            type: '3d_cutaway',
            targetComponentId: 'pass_cap_elec_470u',
            cutawaySettings: {
              axis: 'y',
              offsetMm: 2.0,
              highlightLayerId: 'cap_dielectric_oxide',
            },
            content: `### Physical Construction: Aluminum Electrolytic Capacitor

In this interactive 3D model, observe the jelly-roll winding structure. An aluminum electrolytic capacitor achieves immense capacitance in a compact volume by:

1. **Etched Aluminum Foil**: Microscopic chemical etching increases the effective surface area $A$ by up to 100-fold compared to flat foil.
2. **Nanoscale Aluminum Oxide Layer ($Al_2O_3$)**: The insulating dielectric is formed electrochemically with a thickness of only a few tens of nanometers, making $d$ extraordinarily small.
3. **Liquid Electrolyte Paper Spacer**: Conducts charge from the cathode foil directly to the outer surface of the oxide dielectric.

**Interactive Tasks:**
- Rotate the 3D model to inspect the outer aluminum protective can and rubber bung seal.
- Switch cutaway layers to observe how the anode foil, oxide layer, and electrolyte paper are wound together.
`,
          },
          {
            id: 'cap_stg_charging',
            title: '3. Guided Simulation: Charging Dynamics ($V_C(t)$)',
            type: 'guided_simulation',
            targetComponentId: 'pass_cap_elec_470u',
            simulationPreset: {
              voltage: 10.0,
              resistance: 1000.0,
              capacitance: 0.00047,
            },
            content: `### RC Charging Transient

When a DC step voltage $V_S$ is connected across a series resistor $R$ and uncharged capacitor $C$, current initially surges to $I_0 = V_S / R$ because the uncharged plates present zero opposing voltage ($V_C(0) = 0\\text{ V}$).

As charge builds on the plates, the opposing electric field increases, exponentially decreasing the charging current according to:

$$V_C(t) = V_S \\left(1 - e^{-t / \\tau}\\right)$$
$$I(t) = \\frac{V_S}{R} e^{-t / \\tau}$$

Where the characteristic **RC Time Constant** $\\tau$ (tau) is:
$$\\tau = R \\times C$$

After exactly $1\\tau$, the capacitor charges to $63.2\\%$ of $V_S$.
After $5\\tau$, the capacitor reaches $99.3\\%$ of $V_S$, practically considered fully charged.
`,
          },
          {
            id: 'cap_stg_discharging',
            title: '4. Guided Simulation: Discharging Dynamics',
            type: 'guided_simulation',
            targetComponentId: 'pass_cap_elec_470u',
            simulationPreset: {
              voltage: 0.0,
              resistance: 1000.0,
              capacitance: 0.00047,
            },
            content: `### RC Discharging Decay

When a fully charged capacitor with initial voltage $V_0$ is discharged through a resistor $R$, the stored electric field drives current in the opposite direction out of the positive plate.

The governing equations for discharging are:
$$V_C(t) = V_0 \\times e^{-t / \\tau}$$
$$I(t) = -\\frac{V_0}{R} \\times e^{-t / \\tau}$$

Notice that during discharge, voltage decays to:
- $36.8\\%$ of initial voltage after $1\\tau$
- Less than $1\\%$ after $5\\tau$

All stored electrostatic energy $E = \\frac{1}{2} C V^2$ is converted into thermal heat dissipation within the resistor:
$$P(t) = I(t)^2 \\times R$$
`,
          },
          {
            id: 'cap_stg_quiz',
            title: '5. Knowledge Check: Capacitive Principles',
            type: 'knowledge_check',
            content: 'Test your understanding of capacitor physics and RC dynamics.',
            quiz: {
              id: 'quiz_cap_1',
              question: 'A circuit has a 10 kΩ resistor in series with a 470 µF capacitor connected to a 12V supply. What is the circuit time constant tau, and what is the capacitor voltage after 1 time constant?',
              options: [
                {
                  id: 'opt_a',
                  text: 'tau = 4.7 s; V_C = 7.58 V (63.2% of 12V)',
                  isCorrect: true,
                  explanation: 'Correct! tau = R * C = 10,000 ohms * 0.000470 F = 4.70 seconds. At t = 1 tau, V_C = 12V * (1 - e^-1) = 12 * 0.6321 = 7.585 V.',
                },
                {
                  id: 'opt_b',
                  text: 'tau = 0.47 s; V_C = 6.00 V (50% of 12V)',
                  isCorrect: false,
                  explanation: 'Incorrect. 10,000 * 0.00047 = 4.7s, not 0.47s. Furthermore, capacitor charging is non-linear; at 1 tau it reaches 63.2%, not 50%.',
                },
                {
                  id: 'opt_c',
                  text: 'tau = 47 s; V_C = 11.9 V (99% of 12V)',
                  isCorrect: false,
                  explanation: 'Incorrect. Reaching 99% requires 5 time constants (~23.5 seconds), not 1 tau.',
                },
              ],
            },
          },
          {
            id: 'cap_stg_challenge',
            title: '6. Practical Challenge: RC Filter Sizing',
            type: 'practical_challenge',
            content: 'Calculate and tune the resistance to achieve a precise target time constant for an audio debounce filter.',
            challenge: {
              id: 'ch_rc_tuning',
              prompt: 'Adjust the resistance in an RC circuit with a 470 µF capacitor so that the circuit time constant tau is exactly 1410 ms (1.41 s) within +/- 5% tolerance.',
              targetParameter: 'time_constant_ms',
              targetValue: 1410,
              tolerancePercent: 5,
              initialComponentId: 'pass_cap_elec_470u',
              initialVoltage: 10.0,
              initialResistance: 1000.0,
              initialCapacitance: 0.00047,
              successMessage: 'Outstanding engineering! R = 3000 ohms with C = 470 uF produces tau = 3000 * 0.00047 = 1.41 seconds (1410 ms).',
              hint: 'Recall that tau = R * C. Therefore, R = tau / C = 1.41 s / 0.00047 F = 3000 ohms (3.0 kΩ).',
            },
          },
        ],
      },
    ],
  },

  // MODULE 2: Resistors, Ohm's Law & Thermal Dissipation
  {
    id: 'mod_resistors',
    title: "Resistors, Ohm's Law & Thermal Limits",
    shortTitle: 'Resistors',
    tagline: 'Physical origins of electrical resistance, Joule heating, and absolute maximum ratings.',
    description: 'Learn why electrons scatter inside conductive materials, evaluate color codes, and calculate power dissipation P = I^2 * R to avoid catastrophic component burnout.',
    category: 'passive',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    lessons: [
      {
        id: 'les_res_fundamentals',
        moduleId: 'mod_resistors',
        title: "Ohm's Law & Internal Construction",
        tagline: 'From microscopic electron lattice collisions to axial carbon-film spiraling.',
        objectives: [
          'Master V = I * R and P = V * I.',
          'Understand how laser helical grooving trims exact resistance values.',
          'Calculate junction thermal rise using thermal resistance R_theta_JA.',
        ],
        stages: [
          {
            id: 'res_stg_theory',
            title: "1. Scientific Theory: Resistivity & Joule's Heating",
            type: 'theory',
            content: `### Microscopic Basis of Resistance

When an electric potential gradient $\\vec{E}$ is applied across a solid conductor, conduction electrons accelerate in the direction opposite to $\\vec{E}$, but continuously collide with vibrating lattice ions (phonons) and structural impurities.

This microscopic scattering limits the net **electron drift velocity** $v_d$ to only a fraction of a millimeter per second:
$$v_d = -\\mu_e E$$

The macroscopic resistance $R$ of a uniform conductor is:
$$R = \\rho \\frac{L}{A}$$

Where:
- $\\rho$ is the material resistivity in $\\Omega \\cdot \\text{m}$
- $L$ is length in meters
- $A$ is cross-sectional area in $\\text{m}^2$

Every collision transfers kinetic energy from drifting electrons to the crystal lattice, manifesting macroscopically as **Joule heating**:
$$P = V \\times I = I^2 R = \\frac{V^2}{R}$$
`,
          },
          {
            id: 'res_stg_cutaway',
            title: '2. 3D Cutaway Inspection: Axial Helical Trimming',
            type: '3d_cutaway',
            targetComponentId: 'pass_res_10k',
            cutawaySettings: {
              axis: 'y',
              offsetMm: 1.5,
              highlightLayerId: 'res_film',
            },
            content: `### Construction of a Carbon/Metal Film Resistor

Observe the precision cylindrical construction of this standard axial through-hole resistor:

1. **Alumina Ceramic Core**: Provides rigid mechanical support and high dielectric insulation (>1000V).
2. **Thin Conductive Film**: A pyrolytic carbon or metal-oxide layer sputtered onto the ceramic rod.
3. **Helical Spiral Groove**: A laser cuts a continuous spiral groove through the conductive film. By varying the pitch and length of this spiral helix, manufacturers multiply the effective conductive path length $L$ and narrow the width $A$, trimming resistance to within $\\pm 1\\%$ tolerance.
4. **Protective Epoxy Lacquer**: Seals against moisture and atmospheric oxidation.
`,
          },
          {
            id: 'res_stg_quiz',
            title: '3. Knowledge Check: Resistor Power Ratings',
            type: 'knowledge_check',
            content: 'Verify your understanding of electrical power envelopes.',
            quiz: {
              id: 'quiz_res_1',
              question: 'A 0.25W (1/4 Watt) axial resistor with 100 ohms resistance is connected across a 10V DC power supply. What will happen to the resistor?',
              options: [
                {
                  id: 'opt_a',
                  text: 'It will dissipate 1.0W, exceeding its 0.25W rating by 400% and rapidly burn out.',
                  isCorrect: true,
                  explanation: 'Correct! P = V^2 / R = (10V)^2 / 100 ohms = 100 / 100 = 1.0 Watt. Since 1.0W > 0.25W max rating, the resistor will severely overheat and suffer catastrophic thermal failure.',
                },
                {
                  id: 'opt_b',
                  text: 'It will operate normally because 10V is well below its 250V maximum voltage rating.',
                  isCorrect: false,
                  explanation: 'Incorrect. While voltage rating is satisfied, the power rating P = V^2/R = 1.0W far exceeds the component 0.25W thermal dissipation capability.',
                },
                {
                  id: 'opt_c',
                  text: 'It will draw 10mA and dissipate only 0.1W.',
                  isCorrect: false,
                  explanation: 'Incorrect. Current is I = V / R = 10V / 100 ohms = 0.1A (100mA), leading to 1.0W dissipation.',
                },
              ],
            },
          },
        ],
      },
    ],
  },

  // MODULE 3: Semiconductor Diodes & LEDs
  {
    id: 'mod_diodes',
    title: 'Semiconductor Diodes & LEDs',
    shortTitle: 'Diodes & LEDs',
    tagline: 'PN junctions, forward threshold voltage, and direct bandgap photon emission.',
    description: 'Explore the non-linear Shockley diode equation, reverse breakdown envelopes, and calculate current-limiting resistors for optoelectronic emitters.',
    category: 'semiconductor',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    lessons: [
      {
        id: 'les_diode_foundations',
        moduleId: 'mod_diodes',
        title: 'PN Junctions & Solid-State Lighting',
        tagline: 'Understanding forward bias, depletion zones, and current limiting.',
        objectives: [
          'Explain the Shockley diode equation I = I_S * (e^(V / (n*V_T)) - 1).',
          'Calculate current-limiting resistors R = (V_supply - V_F) / I_target.',
          'Understand direct bandgap recombination and photon generation.',
        ],
        stages: [
          {
            id: 'diode_stg_theory',
            title: '1. Theoretical Principles: The PN Junction',
            type: 'theory',
            content: `### Semiconductor PN Junction

When p-type and n-type semiconductor regions contact, majority carriers diffuse across the junction: electrons move from the n-side to the p-side, while holes diffuse from the p-side to the n-side.

This leaves uncompensated ionized donor ($N_D^+$) and acceptor ($N_A^-$) atoms, forming a **depletion region** that creates a built-in contact potential $V_{bi}$ (typically $\\sim 0.7\\text{ V}$ for silicon, $\\sim 1.8\\text{ V} - 3.2\\text{ V}$ for LEDs).

Under forward bias ($V > V_{threshold}$), the barrier is overcome, and current surges exponentially according to the **Shockley equation**:
$$I_D = I_S \\left(e^{\\frac{V_D}{n V_T}} - 1\\right)$$

Where:
- $I_S$ is the reverse saturation current (typically $10^{-14} \\text{ A}$)
- $n$ is the ideality factor ($1 \\le n \\le 2$)
- $V_T = \\frac{k_B T}{q} \\approx 25.85\\text{ mV}$ at $300\\text{ K}$ (thermal voltage)
`,
          },
          {
            id: 'diode_stg_cutaway',
            title: '2. 3D LED Cutaway: Anvil, Post & Epoxy Lens',
            type: '3d_cutaway',
            targetComponentId: 'opto_led_red_5mm',
            cutawaySettings: {
              axis: 'y',
              offsetMm: 2.0,
              highlightLayerId: 'led_die',
            },
            content: `### Anatomy of a 5mm Radial Indicator LED

Observe the internal mechanical and optical construction:

1. **Reflector Cup Anvil (Cathode Lead)**: The larger lead frame post features a cup-shaped indent that seats the microscopic semiconductor die and reflects emitted photons forward into a focused beam.
2. **Semiconductor Die (AlGaAs / GaInN)**: A microscopic cube ($\sim 250\\,\\mu\\text{m}$) where electron-hole pairs recombine across the direct energy bandgap $E_g$, emitting photons with wavelength $\\lambda = \\frac{hc}{E_g}$.
3. **Gold Wire Bond**: A 25-micron gold whisker wire connecting the top anode contact of the die to the smaller lead post.
4. **Epoxy Dome Lens**: Acts both as a protective hermetic encapsulation and a optical collimator lens.
`,
          },
          {
            id: 'diode_stg_challenge',
            title: '3. Practical Challenge: Current-Limiting Resistor',
            type: 'practical_challenge',
            content: 'Calculate and set the exact ballast resistance to achieve safe 20mA forward current for a red LED from a 5V rail.',
            challenge: {
              id: 'ch_led_ballast',
              prompt: 'A red LED has a forward voltage drop V_F = 2.0 V. Calculate the resistance needed to set forward current to exactly 20.0 mA (+/- 5%) from a 5.0 V power supply.',
              targetParameter: 'current_mA',
              targetValue: 20.0,
              tolerancePercent: 5,
              initialComponentId: 'opto_led_red_5mm',
              initialVoltage: 5.0,
              initialResistance: 330.0,
              successMessage: 'Perfect current regulation! R = (5.0V - 2.0V) / 0.020A = 150 ohms. The LED shines brightly without exceeding continuous current envelopes.',
              hint: 'Apply Kirchhoff\'s Voltage Law: V_supply - V_F - (I * R) = 0. Solving for R: R = (V_supply - V_F) / I = (5.0 - 2.0) / 0.020 = 150 ohms.',
            },
          },
        ],
      },
    ],
  },
];
