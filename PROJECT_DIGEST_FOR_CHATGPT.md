# 3D Lab — Interactive Electronic Engineering Platform
**Digest for ChatGPT / LLM Code Review**

## 1. Project Overview & Architecture
3D Lab is a modular, high-fidelity browser-based engineering platform for 3D electronics simulation, component cutaways, physical breadboard prototyping, hardware teardowns, PCB design, and interactive academy lessons.

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **3D Graphics**: Three.js, React Three Fiber (@react-three/fiber), React Three Drei (@react-three/drei)
- **Styling**: Tailwind CSS, Lucide React icons
- **State Management**: Zustand
- **Physics & Simulation**: Custom non-linear Shockley, RC/RL dynamic integrators, thermal models, and ngspice netlist adapter.

---

## 2. Directory Tree
``n.\AI_RULES.md
.\ARCHITECTURE.md
.\COMPONENT_SCHEMA.md
.\DESIGN_SYSTEM.md
.\next-env.d.ts
.\next.config.ts
.\package-lock.json
.\package.json
.\postcss.config.mjs
.\PRD.md
.\ROADMAP.md
.\SIMULATION_SPEC.md
.\tailwind.config.ts
.\tsconfig.json
.\tsconfig.tsbuildinfo
.\app\globals.css
.\app\layout.tsx
.\app\not-found.tsx
.\app\page.tsx
.\components\academy\challenge-evaluator.tsx
.\components\academy\learning-academy-view.tsx
.\components\academy\lesson-runner.tsx
.\components\academy\quiz-view.tsx
.\components\circuit\breadboard-3d.tsx
.\components\circuit\circuit-component-3d.tsx
.\components\circuit\circuit-wire-3d.tsx
.\components\circuit\circuit-workspace-view.tsx
.\components\circuit\component-library-panel.tsx
.\components\circuit\drafting-wire-3d.tsx
.\components\circuit\virtual-multimeter-view.tsx
.\components\circuit\virtual-oscilloscope-view.tsx
.\components\devices\component-working-blueprint.tsx
.\components\devices\device-block-diagram.tsx
.\components\devices\device-cad-blueprint.tsx
.\components\devices\device-canvas.tsx
.\components\devices\device-explorer-view.tsx
.\components\devices\device-inspector-panel.tsx
.\components\devices\models\appliance-models.tsx
.\components\devices\models\callout-badge-3d.tsx
.\components\devices\models\device-exploded-model.tsx
.\components\devices\models\laptop-model.tsx
.\components\devices\models\powerbank-model.tsx
.\components\devices\models\smartphone-model.tsx
.\components\explorer\category-nav.tsx
.\components\explorer\component-card.tsx
.\components\explorer\component-detail-dialog.tsx
.\components\explorer\component-graphics.tsx
.\components\explorer\component-grid.tsx
.\components\explorer\search-bar.tsx
.\components\pcb\pcb-2d-canvas.tsx
.\components\pcb\pcb-3d-canvas.tsx
.\components\pcb\pcb-drc-dialog.tsx
.\components\pcb\pcb-export-dialog.tsx
.\components\pcb\pcb-studio-view.tsx
.\components\simulation\iv-curve-chart.tsx
.\components\simulation\scope-waveform.tsx
.\components\simulation\sim-lab-view.tsx
.\components\simulation\simulation-control-hud.tsx
.\components\ui\badge.tsx
.\components\ui\button.tsx
.\components\ui\card.tsx
.\components\ui\dialog.tsx
.\components\ui\input.tsx
.\components\ui\panel.tsx
.\components\ui\state-views.tsx
.\components\ui\tabs.tsx
.\components\viewer\camera-controller.tsx
.\components\viewer\component-canvas.tsx
.\components\viewer\component-renderer.tsx
.\components\viewer\interactive-labels.tsx
.\components\viewer\scene-lighting.tsx
.\components\viewer\viewer-overlay.tsx
.\components\viewer\models\axial-resistor-model.tsx
.\components\viewer\models\bjt-to92-model.tsx
.\components\viewer\models\electrolytic-cap-model.tsx
.\components\viewer\models\led-model.tsx
.\components\viewer\models\mosfet-to92-model.tsx
.\components\workspace\bottom-dock.tsx
.\components\workspace\environment-view.tsx
.\components\workspace\inspector-panel.tsx
.\components\workspace\left-sidebar.tsx
.\components\workspace\status-bar.tsx
.\components\workspace\topbar.tsx
.\components\workspace\workspace-shell.tsx
.\data\academy-curriculum.ts
.\data\devices-data.ts
.\data\environments.ts
.\data\mock-components.ts
.\lib\store.ts
.\lib\utils.ts
.\lib\academy\academy-store.ts
.\lib\circuit\breadboard-topology.ts
.\lib\circuit\circuit-presets.ts
.\lib\circuit\circuit-solver.ts
.\lib\circuit\circuit-store.ts
.\lib\circuit\types.ts
.\lib\pcb\circuit-to-pcb-adapter.ts
.\lib\pcb\footprint-library.ts
.\lib\pcb\gerber-exporter.ts
.\lib\pcb\kicad-adapter.ts
.\lib\pcb\pcb-drc.ts
.\lib\simulation\engine.ts
.\lib\simulation\ngspice-adapter.ts
.\lib\simulation\types.ts
.\lib\simulation\use-simulation.ts
.\lib\simulation\models\base-model.ts
.\lib\simulation\models\bjt-model.ts
.\lib\simulation\models\capacitor-model.ts
.\lib\simulation\models\diode-model.ts
.\lib\simulation\models\inductor-model.ts
.\lib\simulation\models\led-model.ts
.\lib\simulation\models\mosfet-model.ts
.\lib\simulation\models\resistor-model.ts
.\tests\catalog-and-search.test.ts
.\tests\circuit-workspace.test.ts
.\tests\pcb-studio.test.ts
.\tests\phase2-cutaway.test.ts
.\tests\phase5-devices-and-academy.test.ts
.\tests\simulation-engine.test.ts
.\types\academy.ts
.\types\component.ts
.\types\device.ts
.\types\pcb.ts
.\types\workspace.ts
``n
## 3. Core Modules Summary

### 1. Component Explorer & Internal 3D Cutaways
- 	ypes/component.ts: 3DCS-1 Component Schema with LOD, physics cutaways, pin anchors, absolute maximum ratings.
- data/mock-components.ts: Real component definitions (Axial Resistors, Electrolytic/Ceramic Capacitors, LEDs, Diodes, BJT/MOSFETs, Op-Amps, 555 Timers).
- components/viewer/: Three.js procedural cutaways revealing semiconductor dies, gold bond wires, leadframes, and thermal dissipation heatmaps.

### 2. Electrical Simulation Engine (Phase 3)
- lib/simulation/models/: Non-linear mathematical models for Resistors, Capacitors, Inductors, Diodes, LEDs, BJTs, and MOSFETs.
- lib/simulation/simulation-engine.ts: Dynamic ODE solver, electron drift velocity vs conventional current calculations, thermal inertia integrator, and live waveform generator.
- lib/simulation/ngspice-adapter.ts: Ngspice netlist serialization.

### 3. Circuit Workspace & 3D Breadboard (Phase 4)
- lib/circuit/breadboard-topology.ts: Standard 830-point solderless breadboard coordinate mapping with tie-point spring clips and power distribution buses.
- lib/circuit/circuit-solver.ts: Connectivity graph solver, node voltage calculations, short-circuit diagnostics, and Kirchhoff laws.
- components/circuit/circuit-workspace-view.tsx: 3D interactive breadboard and open circuit space with wire catenary curves.

### 4. Device Teardowns (Phase 5)
- components/devices/models/: Sourced photorealistic teardowns for:
  - 5G Flagship Smartphone (5-layer exploded stack, OLED, battery, A16 chip, titanium chassis, multi-element optical lenses).
  - High-Performance Laptop (display, hinges, motherboard, CPU die, dual heatpipes, RAM, SSD, cooling fans).
  - Inverter Refrigerator (outer inox, insulation, food shelves, freezer, rear condenser grid, compressor dome, receiver dryer).
  - 65W USB-C PD Power Bank, Washing Machine, 4K Smart Television.

### 5. PCB Studio (Phase 6)
- lib/pcb/footprint-library.ts: IPC standard footprints (DIN0207, DO-35, TO-92, DIP-8, etc.).
- lib/pcb/circuit-to-pcb-adapter.ts: Converts schematic to PCB, preserves 1:1 component identity, auto-routes nets, computes ratsnest airwires.
- lib/pcb/pcb-drc.ts: Design Rule Check engine (trace width, net clearance, edge cuts margin, unrouted nets).
- lib/pcb/kicad-adapter.ts: Exports native KiCad 7/8 .kicad_pcb S-expressions and .net netlists.
- lib/pcb/gerber-exporter.ts: RS-274X Gerber & Excellon drill file fabrication package.
- components/pcb/pcb-3d-canvas.tsx: Three.js 3D board view with FR-4 core, 6 soldermask finishes, plated pads, and Layer Exploded Slider.

### 6. Learning Academy
- data/academy-curriculum.ts: Interactive guided curriculum with knowledge checks, formulas, and practical challenges.