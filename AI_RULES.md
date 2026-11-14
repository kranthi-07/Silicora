# 3D Lab — AI & Engineering Rules of Engagement

**Document Version:** 1.0.0  
**Scope:** Universal Engineering Standards, Architecture Boundaries & AI Agent Guidelines

---

## 1. Prime Invariants & Architectural Boundaries

Any engineer or AI agent implementing features in this codebase MUST abide by these seven inviolable rules:

1. **Strict Thread Separation:**  
   The main UI thread is reserved exclusively for DOM updates and 3D rendering. **Never run electrical simulation solving or heavy matrix math on the main thread.** All SPICE and MNA solving must occur inside the `@3d-lab/simulation-engine` Web Worker.

2. **No Three.js Objects in React/Zustand State:**  
   Never store `THREE.Mesh`, `THREE.Material`, `THREE.BufferGeometry`, or `THREE.Scene` instances in Zustand stores, React state, or context. Stores may only hold serializable primitives, IDs, arrays, and pure mathematical vectors (`{x, y, z}`). Storing Three.js objects causes memory leaks and destroys React rendering performance.

3. **No Allocation Inside the 60 FPS Render Loop (`useFrame`):**  
   Never allocate objects, vectors, matrices, or materials inside a `useFrame` hook:
   ```typescript
   // ❌ STRICTLY FORBIDDEN: Allocating in render loop
   useFrame(() => {
     const pos = new THREE.Vector3(); // Triggers GC churn & frame drops!
     meshRef.current.position.add(pos);
   });

   // ✅ MANDATORY PATTERN: Reusable scratch objects outside loop
   const scratchVec = new THREE.Vector3();
   useFrame((state, delta) => {
     scratchVec.set(0, delta, 0);
     meshRef.current.position.add(scratchVec);
   });
   ```

4. **World Coordinate Space Convention:**  
   The entire 3D ecosystem standardizes on **Metric Millimeters ($1.0\text{ unit} = 1.0\text{ mm}$)**.
   - Standard breadboard pitch = $2.54\text{ units}$ ($0.1\text{ inch}$).
   - Pin leads, component dimensions, and tolerances are modeled in millimeters.
   - Do NOT mix meters, centimeters, or inches in the scene graph.

5. **Memory Disposal is Mandatory:**  
   Three.js does not garbage collect GPU memory automatically. When any 3D component unmounts, all created geometries, textures, materials, and render targets must be explicitly disposed of:
   ```typescript
   useEffect(() => {
     return () => {
       geometry.dispose();
       material.dispose();
       texture?.dispose();
     };
   }, [geometry, material, texture]);
   ```

6. **Zod Validation at System Boundaries:**  
   All external data (user project files `.3dlab`, catalog JSON manifests, SPICE netlist imports, worker message payloads) must be strictly validated with Zod schemas before consumption.

7. **Zero Tolerance for `any`:**  
   TypeScript `strict: true` is non-negotiable. Use discriminated unions, generics, and strict types.

---

## 2. Directory & Module Placement Conventions

```
packages/
├── core-model/        # ONLY pure TypeScript interfaces, Zod schemas, math routines.
│                      # NO Three.js, NO React, NO DOM.
├── 3d-engine/         # Three.js, React Three Fiber, GLSL shaders, camera controllers.
│                      # NO direct SPICE calls; reads from simulation telemetry buffers.
├── simulation-engine/ # Web Worker, WASM loaders, netlist AST parser, MNA solver.
│                      # NO DOM, NO Canvas, runs in worker/Node environment.
├── ui-system/         # Tailwind styles, Radix primitives, HUD overlays, knobs, docks.
└── catalog-data/      # JSON component definitions, GLB models, SPICE subcircuits.
```

- When creating a new component definition: Place it in `packages/catalog-data/components/<category>/<slug>.json`.
- When creating a new shader: Place it in `packages/3d-engine/shaders/<shader-name>.vert.glsl` and `.frag.glsl`.
- When adding a virtual instrument: Create the visual faceplate in `packages/ui-system/instruments/` and the DSP logic in `packages/simulation-engine/dsp/`.

---

## 3. React Three Fiber & Performance Rules

### 3.1 Instanced Meshes for Repetitive Geometry
Whenever rendering multiple identical items (breadboard tie-point clips, LED indicator arrays, jumper wire particles), use `THREE.InstancedMesh` or `@react-three/drei` `<Instances>`. Never spawn hundreds of individual `<mesh>` elements.

### 3.2 Transient Updates for Telemetry
Do not re-render React components at 60 Hz to update measurement values (e.g. oscilloscope probes or pin voltage tags). Use **transient subscriptions** or mutate DOM/ref nodes directly:
```typescript
// ✅ Good: Direct DOM text update via subscription
useEffect(() => {
  return useSimStore.subscribe(
    (state) => state.probeVoltage,
    (voltage) => {
      if (voltageRef.current) {
        voltageRef.current.textContent = `${voltage.toFixed(2)} V`;
      }
    }
  );
}, []);
```

### 3.3 Shader Compilation Warm-Up
All custom shaders (cutaway stencil caps, electron particle glow, thermal gradient ramps) must be pre-compiled during the initial workspace load screen using `renderer.compile(scene, camera)` to eliminate in-flight stutter when activating tools.

---

## 4. Simulation Engine Standards

1. **Determinism:** The MNA solver and ngspice runs must yield deterministic results given the same circuit topology and seed.
2. **Graceful Degradation:** If a simulation diverges or experiences numerical instability:
   - Catch the error cleanly in the worker.
   - Do NOT throw an uncaught exception.
   - Emit a structured `SIMULATION_ERROR` event containing the offending node or component ID.
   - Return the last known stable state to prevent 3D rendering NaN explosions.
3. **Data Transfer Strategy:**
   - High-frequency data (60 Hz telemetry for electron drift) must use `SharedArrayBuffer` when cross-origin isolation is active, or `Transferable ArrayBuffer` objects. Never serialize millions of float numbers over JSON `postMessage`.

---

## 5. Automated Testing & Verification Expectations

Every pull request or automated code generation task must satisfy:
1. **Unit Tests (`vitest`):**
   - Circuit netlist generation from topology graphs.
   - Mathematical solver accuracy against known analytical benchmarks (RC charging curve, diode forward drop, voltage divider ratio).
   - Component schema validation tests.
2. **3D Snapshot & Visual Regression (`playwright`):**
   - Verify that 3D canvas renders without WebGL errors or missing shader uniforms.
   - Component cutaway stencil pass produces zero geometric artifacts.
3. **Linting & Types:**
   - Clean `tsc --noEmit` pass with zero errors.
   - Clean ESLint pass with zero warnings.

---

## 6. Review Checklist for AI-Generated Code

Before marking any task complete, verify against this self-audit checklist:
- [ ] Are all new files placed in their designated package boundary?
- [ ] Did I avoid allocating objects inside `useFrame`?
- [ ] Are all geometries and materials disposed of when unmounted?
- [ ] Is all heavy computation delegated to the worker thread?
- [ ] Are all dimensions specified in metric millimeters?
- [ ] Does the new component adhere to `COMPONENT_SCHEMA.md`?
- [ ] Did I test both dark and light UI contrast compliance?
