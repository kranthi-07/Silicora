# 3D Lab — Product & Engineering Roadmap

**Document Version:** 1.0.0  
**Status:** Approved  
**Lifecycle Horizon:** 18 Months (Phases 0 through 5)

---

## 1. Roadmap Overview & Phasing Strategy

The development of 3D Lab follows a risk-mitigated, engine-first methodology. Core rendering, asset optimization pipelines, and WebAssembly simulation loops are proven and stabilized before scaling UI surfaces and curriculum content.

```mermaid
gantt
    title 3D Lab Master Engineering Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 0: Core Foundation
    Monorepo Setup & Tooling             :done, 2026-11-01, 2026-12-01
    R3F Scene & Stencil Cutaway POC      :done, 2026-11-15, 2026-12-15
    ngspice-WASM Worker Bridge POC       :active, 2026-12-01, 2027-01-15
    section Phase 1: Exploration MVP
    Component Explorer Engine            :2027-01-16, 2027-03-01
    Internal Cutaway Shaders & Layers    :2027-02-15, 2027-04-01
    Electrical Simulation Lab (Virtual DSO):2027-03-15, 2027-05-01
    Alpha Release (Milestone M1)         :milestone, 2027-05-01, 0d
    section Phase 2: Circuit Prototyping
    3D Breadboard & Wire Physics Engine  :2027-05-01, 2027-07-01
    2D Schematic Sync Engine             :2027-06-15, 2027-08-15
    Real-time MNA Interactive Solver     :2027-07-15, 2027-09-15
    Beta Release (Milestone M2)          :milestone, 2027-09-15, 0d
    section Phase 3: Systems & Teardowns
    Device Explorer Teardowns (5 Units)  :2027-09-15, 2027-11-15
    PCB Studio Layer Stackup Viewer      :2027-10-15, 2027-12-15
    section Phase 4: Learning Academy
    Curriculum Engine & Fault Injection  :2027-12-01, 2028-02-01
    Interactive Guided Lessons (20 Modules):2028-01-15, 2028-03-15
    Release Candidate (Milestone M3)     :milestone, 2028-03-15, 0d
    section Phase 5: Desktop & GA
    Tauri Desktop App Packaging          :2028-03-15, 2028-04-15
    Performance Hardening & Security Audit:2028-04-01, 2028-05-01
    General Availability (v1.0 GA)       :milestone, 2028-05-01, 0d
```

---

## 2. Milestone Details & Deliverables

### Phase 0: Architectural Spike & Core Engine Foundation (Weeks 1–8)
- **Objective:** De-risk the two hardest technical bottlenecks: WebAssembly SPICE simulation speed and GPU stencil cutaway performance.
- **Key Deliverables:**
  - Modern TypeScript monorepo setup (Turborepo + Next.js + R3F + Tailwind).
  - Web Worker-hosted `ngspice.wasm` compiled with Emscripten, executing transient analysis and streaming back $100{,}000$ points within $<50\text{ ms}$.
  - Three.js stencil-buffered multi-plane cutting POC displaying solid caps without geometric mesh degradation.
  - Core component schema definition (JSON Schema + TypeScript validation with Zod).

### Phase 1: MVP — Component Explorer, Cutaways & Simulation Lab (Weeks 9–20)
- **Objective:** Deliver standalone value for inspecting discrete components and testing them with virtual instruments.
- **Key Deliverables:**
  - **Component Explorer:** 360-degree orbit viewer, pinout HUD, dynamic exploded-view slider.
  - **Internal Structure Explorer:** X/Y/Z cutting planes, microscopic semiconductor layer views (die, wirebonds, depletion regions).
  - **Electrical Simulation Lab:** Virtual 4-channel DSO, DC Power Supply, DMM, and automated I-V curve tracer for diodes/transistors.
  - Initial catalog of 25 core components (Resistors, Capacitors, Inductors, Diodes, LEDs, NPN/PNP Transistors, N-MOSFETs, Op-Amps, 555 Timer).
- **Exit Gate (Milestone M1 — Private Alpha):** Tested across Chrome, Edge, Safari, and Firefox achieving sustained 60 FPS on integrated GPUs.

### Phase 2: Circuit Workspace & Interactive Prototyping (Weeks 21–34)
- **Objective:** Enable users to assemble live circuits on a virtual 3D breadboard and observe real-time simulation.
- **Key Deliverables:**
  - 3D Breadboard with spring-contact snap grid and catenary wire physics.
  - Synchronous 2D Schematic generator with automatic component symbol mapping.
  - Interactive MNA real-time simulation engine calculating live node voltages and currents at 60 Hz.
  - Visual simulation bridges: electron drift animation, LED emissivity, resistor thermal dissipation, component blowouts on overstress.
  - Undo/Redo temporal transaction system and `.3dlab` project export/import.
- **Exit Gate (Milestone M2 — Public Beta):** Ability to assemble complex analog circuits (e.g., multivibrator, 555 PWM generator, active audio filter) with real-time feedback.

### Phase 3: Device Explorer & PCB Studio (Weeks 35–44)
- **Objective:** Provide macroscopic system perspective through virtual teardowns and PCB layer stackup inspection.
- **Key Deliverables:**
  - **Device Explorer:** 5 interactive teardown models:
    1. Regulated Linear DC Bench Power Supply.
    2. Dynamic Cardioid Microphone.
    3. Digital Multimeter.
    4. Brushless DC Motor & ESC.
    5. Smartphone Sub-chassis.
  - Disassembly step player with interactive screw extraction and cable unseating.
  - **PCB Studio:** 2-to-6 layer stackup inspector with copper net highlighting, Gerber/KiCad netlist parser, and surface mount component population.

### Phase 4: Learning Academy & Curriculum Engine (Weeks 45–54)
- **Objective:** Transform the tool into a complete pedagogical learning platform with structured courses and fault diagnostics.
- **Key Deliverables:**
  - 20 interactive guided courses covering DC basics, AC reactance, active semiconductors, and analog signal conditioning.
  - Gamified "Fix the Fault" challenges with stochastic component faults (dry solder joints, burnt resistors, shorted capacitors).
  - In-app progress tracking, mastery checkpoints, and guided interactive tooltips.
- **Exit Gate (Milestone M3 — Release Candidate):** Pedagogical review and verification by university electrical engineering educators.

### Phase 5: Desktop Packaging, Polish & General Availability (Weeks 55–60)
- **Objective:** Cross-platform native releases, end-to-end performance optimization, and v1.0 launch.
- **Key Deliverables:**
  - Native standalone desktop application built with Tauri for Windows, macOS (Universal), and Linux.
  - Full offline capability with local asset bundle hydration.
  - Comprehensive memory leak audit, shader warm-up optimizations, and WebGPU fallback pipeline.
  - Final documentation, user manual, and developer SDK for custom component authoring.
- **Exit Gate (Milestone M4 — v1.0 GA):** General public release.

---

## 3. Technical Risks, Dependencies & Mitigation Matrix

| Risk Category | Specific Risk Description | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Performance** | WebGL context loss or VRAM exhaustion with multiple complex models. | Critical | Medium | Strict asset budgets ($<2\text{ MB}$ per model), aggressive LOD switching, shared geometry/material instancing, and automatic texture downscaling on mobile/low-end GPUs. |
| **Simulation** | ngspice-wasm convergence failures (`Timestep too small` / singular matrix) crashing worker. | High | High | Wrap SPICE solver in watchdog process; implement automatic fallback to conservative convergence settings (`reltol=0.01`, `gmin=1e-10`); provide friendly user guidance on floating nodes. |
| **Math / Physics** | Stiff differential equations in switching circuits (e.g. buck converters) causing severe lag. | High | Medium | Adaptive time-stepping with fixed maximum solver time per frame ($5\text{ ms}$ budget); drop visual particle density during transient spikes. |
| **Tooling** | Complex 3D CAD to Web-ready glTF manual conversion overhead. | Medium | High | Build an automated Node.js asset pipeline tool using `@gltf-transform` to batch-compress, generate LODs, and optimize materials directly from Blender/CAD exports. |
| **Platform** | Safari WebGL2/WebAssembly memory quirks and iOS Safari audio/context limits. | Medium | Medium | Automated multi-browser Playwright/WebKit test suite; polyfills for WebAssembly SharedArrayBuffer headers (`COOP`/`COEP`). |
