# 3D Lab — Design System & UI/UX Specification

**Document Version:** 1.0.0  
**Status:** Approved  
**Aesthetic Theme:** Dark Technical CAD & Precision Laboratory Workspace

---

## 1. Aesthetic Vision & Design Principles

3D Lab is a professional engineering and scientific learning environment. Its design language blends the precision of modern electronic CAD tools (Altium, KiCad) with the tactile immersion of physical test benches and modern high-end creative software.

### Core Principles
1. **Viewport Dominance:** The 3D and 2D canvas is the protagonist. UI controls, sidebars, and docks are lightweight, low-contrast, and semi-transparent (glassmorphic) to maximize visual immersion.
2. **Instant Legibility Under Cognitive Load:** Technical data (voltages, frequencies, tolerances) must be instantly readable. Monospaced tabular numerals are mandatory for all measurement readouts.
3. **Physical-Digital Parity:** Virtual instruments (multimeter, oscilloscope) mimic their physical counterparts in ergonomics and tactile feedback (knobs with haptic sound cues, phosphor CRT graticules), but provide digital superpowers (searchable waveform logs, mathematical math channels).
4. **Color as Scientific Semantic:** Colors are not decorative; they encode physical meaning (positive rail, ground, signal path, thermal hotspots, electrical hazards).

---

## 2. Design Tokens

### 2.1 Color Palette

#### Base Workspace Neutrals (Dark Mode Default)
```css
--lab-bg-canvas: #090B0E;        /* Deep space background for 3D rendering */
--lab-bg-surface-0: #101318;     /* Underlying dock and viewport background */
--lab-bg-surface-1: #161B22;     /* Sidebars, topbars, floating panels */
--lab-bg-surface-2: #21262D;     /* Cards, dropdowns, input fields */
--lab-bg-surface-3: #30363D;     /* Hover states, modal dialogs */
--lab-border-subtle: #21262D;    /* Panel separators, inactive outlines */
--lab-border-default: #30363D;   /* Standard card borders, grid dividers */
--lab-border-focus: #58A6FF;     /* Active focus rings */
```

#### Physical & Electrical Semantic Palette
```css
/* Electrical Polarities & Rails */
--elec-vcc: #F85149;             /* +Vcc / Positive Rail / Hot (Safety Crimson) */
--elec-gnd: #238636;             /* GND / Ground / Earth Return (Chassis Green) */
--elec-vneg: #1F6FEB;            /* -Vee / Negative Supply Rail (Polar Blue) */
--elec-signal: #E3B341;          /* AC / Analog / Digital Signal Paths (Amber) */
--elec-clock: #A371F7;           /* Bus / Clock / Synchronous Lines (Violet) */

/* Instrument Screen Phosphors */
--scope-trace-1: #39FF14;        /* Channel 1: Neon Phosphor Green */
--scope-trace-2: #00F0FF;        /* Channel 2: Laser Cyan */
--scope-trace-3: #FF007F;        /* Channel 3: Hot Magenta */
--scope-trace-4: #FFB000;        /* Channel 4: Solar Amber */
--scope-grid: #1A3626;           /* Oscilloscope Reticle / Graticule lines */

/* Status & Physical Alerts */
--status-nominal: #3FB950;       /* Safe operating bounds */
--status-warning: #D29922;       /* Near maximum thermal/voltage limits */
--status-critical: #F85149;      /* Dielectric breakdown / Component burnout */
```

### 2.2 Typography
- **Primary Interface Font:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif` (Crisp, modern, high legibility at 11–13px).
- **Technical & Numeric Readouts:** `JetBrains Mono`, `Fira Code`, `ui-monospace` with OpenType `tabular-nums` enabled. All voltages, frequencies, coordinates, and SPICE netlists use monospace.

| Type Scale | Size / Line Height | Tracking | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 24px / 32px | -0.02em | SemiBold (600) | Main Environment Titles, Modal Headings |
| **Heading** | 16px / 24px | -0.01em | Medium (500) | Inspector Panel Section Titles |
| **Body** | 13px / 18px | 0.0em | Regular (400) | Standard UI Labels, Explanatory Guides |
| **Micro** | 11px / 14px | +0.02em | Medium (500) | Pinout labels, Badges, Tag pills |
| **Mono Metric** | 12px / 16px | 0.0em | Medium (500) | Oscilloscope scales, DMM digits, Coordinate readouts |

### 2.3 Surface Elevations & Glassmorphism
- **Floating HUD Glass:** `backdrop-filter: blur(12px); background: rgba(22, 27, 34, 0.75); border: 1px solid rgba(48, 54, 61, 0.6);`
- **Modal Elevation:** `box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);`
- **Active Glow:** Interactive pins and highlighted nodes feature an additive glow: `box-shadow: 0 0 12px rgba(88, 166, 255, 0.4);`

---

## 3. Viewport UI & Workspace Layout Anatomy

The 3D Lab workspace layout provides an unobstructed multi-panel engineering dashboard:

```
+-------------------------------------------------------------------------------+
|  [Logo]  3D Lab  |  [Env Switcher: Component | Cutaway | Circuit | ...]  | [Save] [Share] [Settings] |
+-------------------------------------------------------------------------------+
| [Tool] |                                                        | [Inspector] |
| [Bar]  |                                                        | Component:  |
| Select |                                                        | 2N3904 NPN  |
| Wire   |                       3D VIEWPORT                      | ----------- |
| Probe  |                                                        | Package:    |
| Cut    |              [ 3D Orbit & Cutaway Scene ]              | TO-92       |
| Explode|                                                        | hFE: 100-300|
| Zoom   |                                                        | Vce(max):40V|
|        |                                                        |             |
|        |                                                        | [Layers]    |
|        |                                                        | [x] Mold    |
|        |  [Floating Telemetry HUD: Ch1: 3.32V | 48.2 mA ]       | [x] Silicon |
|        |  [Timeline / Disassembly Scrubber]                     | [x] Wirebond|
+-------------------------------------------------------------------------------+
|  [v] DOCK TRAY: [Virtual Oscilloscope]  [DC Power Supply]  [DMM]  [Waveform Log]  |
+-------------------------------------------------------------------------------+
```

### 3.1 3D Viewport Overlays
- **3D Navigation Gizmo (Top Right):** Interactive orientation cube allowing instant snapping to Top, Front, Right, and Isometric views.
- **Dynamic 3D Lead Anchors (Screen-Space Projections):** Hovering over any component lead displays a sleek HTML/SVG pin badge tethered to the 3D coordinate via Drei `<Html>` with leader lines.
- **Cutting Plane Widget:** Direct 3D transform gizmo (translate/rotate) allowing intuitive visual manipulation of the active sectioning plane directly on the component.
- **Explode Slider:** A floating pill slider ($0\% - 100\%$) positioned centrally at the bottom of the viewport when in Component Explorer mode.

---

## 4. Virtual Instrument Faceplates

### 4.1 Digital Storage Oscilloscope (DSO)
- **Visual Style:** Modeled after modern digital bench oscilloscopes (e.g., Keysight InfiniiVision / Rigol).
- **Controls:**
  - Dual rotary knobs for Volts/Div and Time/Div with continuous drag-to-turn gestures.
  - Channel toggles (CH1, CH2, CH3, CH4) matching the phosphor color palette.
  - Trigger configuration panel (Edge, Level, Auto/Normal/Single).
  - High-performance 2D Canvas / WebGL rendering layer for $60\text{ FPS}$ jitter-free waveform rendering with persistence glow.

### 4.2 Digital Multimeter (DMM)
- **Visual Style:** Precision 6.5-digit benchtop multimeter.
- **Controls:**
  - Large 7-segment / high-contrast LCD readout with units ($V_{\text{DC}}$, $V_{\text{RMS}}$, $A$, $\Omega$, $Hz$).
  - Function selection keys with physical sound click feedback.
  - Dual probe lead attachment points with visual clip cables running into the 3D scene.

---

## 5. Keyboard Navigation & Interaction Shortcuts

| Key Combination | Scope | Action |
| :--- | :--- | :--- |
| `Space` | Global | Pause / Resume Real-Time Simulation |
| `W` | Circuit Workspace | Activate Wire Tool |
| `S` | Circuit Workspace | Activate Selection / Move Tool |
| `P` | Circuit Workspace | Place Probe on selected node |
| `R` | Circuit Workspace | Rotate selected component by $90^\circ$ |
| `Delete` / `Backspace` | Workspace | Delete selected component or wire |
| `C` | Component / Cutaway | Toggle Sectional Cutaway Plane |
| `E` | Component Explorer | Toggle Exploded View |
| `1` - `4` | Viewport | Snap Camera: 1=Iso, 2=Top, 3=Front, 4=Side |
| `Ctrl + Z` / `Cmd + Z` | Workspace | Undo last action |
| `Ctrl + Y` / `Cmd + Shift + Z` | Workspace | Redo action |
| `F` | Viewport | Frame / Focus camera on selected object |
| `Escape` | Global | Deselect all / Exit active tool |
