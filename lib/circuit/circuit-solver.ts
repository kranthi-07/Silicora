/**
 * 3D Lab — MNA Electrical Circuit Solver
 * Solves arbitrary interconnected circuits built from components and wires.
 * Strictly decoupled from Three.js and DOM.
 */

import {
  CircuitElementInstance,
  WireConnection,
  ElectricalNet,
  CircuitDiagnostics,
  CircuitWorkspaceMode,
} from './types';
import { getBreadboardBusId } from './breadboard-topology';

export interface SolvedCircuitState {
  nets: ElectricalNet[];
  nodeVoltages: Record<number, number>; // netId -> Voltage (V)
  pinVoltages: Record<string, number>; // "comp.id:pin.pinId" -> Voltage (V)
  branchCurrents: Record<string, number>; // comp.id -> Current in Amperes
  powerDissipations: Record<string, number>; // comp.id -> Watts
  diagnostics: CircuitDiagnostics;
}

/**
 * Disjoint Set Union (DSU / Union-Find) for resolving electrical nets.
 */
class UnionFind {
  private parent: Map<string, string> = new Map();

  public find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      return x;
    }
    const p = this.parent.get(x)!;
    if (p === x) return x;
    const root = this.find(p);
    this.parent.set(x, root);
    return root;
  }

  public union(a: string, b: string): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent.set(rootB, rootA);
    }
  }

  public getAllGroups(): Map<string, string[]> {
    const groups: Map<string, string[]> = new Map();
    for (const key of this.parent.keys()) {
      const root = this.find(key);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root)!.push(key);
    }
    return groups;
  }
}

/**
 * Solves the circuit using Modified Nodal Analysis (MNA).
 */
export function solveCircuit(
  components: CircuitElementInstance[],
  wires: WireConnection[],
  mode: CircuitWorkspaceMode = 'open_3d',
  dtSeconds: number = 0.016
): SolvedCircuitState {
  const dsu = new UnionFind();

  // 1. Register all component pins into the DSU
  for (const comp of components) {
    for (const pin of comp.pins) {
      const pinKey = `${comp.id}:${pin.pinId}`;
      dsu.find(pinKey); // register

      // If in breadboard mode, union pins that share the exact same breadboard spring clip bus
      if (mode === 'breadboard' && pin.breadboardTiePoint) {
        const busKey = `BB_BUS:${getBreadboardBusId(
          pin.breadboardTiePoint.section,
          pin.breadboardTiePoint.column,
          pin.breadboardTiePoint.row
        )}`;
        dsu.union(pinKey, busKey);
      }
    }
  }

  // 2. Union pins connected by wires
  for (const wire of wires) {
    const keyA = `${wire.fromComponentId}:${wire.fromPinId}`;
    const keyB = `${wire.toComponentId}:${wire.toPinId}`;
    dsu.union(keyA, keyB);
  }

  // 3. Form electrical nets from DSU groups
  const groups = dsu.getAllGroups();
  const nets: ElectricalNet[] = [];
  let groundRoot: string | null = null;
  let nextNetId = 1;

  // Identify ground reference (explicit Ground component or negative terminal of DC source)
  for (const comp of components) {
    if (comp.kind === 'ground') {
      groundRoot = dsu.find(`${comp.id}:gnd`);
      break;
    }
  }

  // Fallback to battery/DC source negative terminal if no explicit ground
  if (!groundRoot) {
    for (const comp of components) {
      if (comp.kind === 'dc_source') {
        groundRoot = dsu.find(`${comp.id}:neg`);
        break;
      }
    }
  }

  // Map each group to an electrical Net
  const rootToNetId = new Map<string, number>();

  if (groundRoot) {
    rootToNetId.set(groundRoot, 0); // Ground is always Net 0
  }

  for (const root of groups.keys()) {
    if (!rootToNetId.has(root)) {
      rootToNetId.set(root, nextNetId++);
    }
  }

  // Construct nets data
  for (const [root, members] of groups.entries()) {
    const netId = rootToNetId.get(root)!;
    const connectedPins: Array<{ componentId: string; pinId: string }> = [];

    for (const m of members) {
      if (!m.startsWith('BB_BUS:')) {
        const [componentId, pinId] = m.split(':');
        connectedPins.push({ componentId, pinId });
      }
    }

    nets.push({
      netId,
      name: netId === 0 ? 'GND (0V)' : `Net_${netId}`,
      isGround: netId === 0,
      isPower: false,
      voltage: 0,
      connectedPins,
    });
  }

  // Fast-lookup: pinKey -> netId
  const pinToNetId: Record<string, number> = {};
  for (const comp of components) {
    for (const pin of comp.pins) {
      const pinKey = `${comp.id}:${pin.pinId}`;
      const root = dsu.find(pinKey);
      const netId = rootToNetId.get(root) ?? 0;
      pinToNetId[pinKey] = netId;
      pin.netId = netId;
    }
  }

  // 4. Formulate MNA Matrix equations: A * x = z
  // Unknowns: Node voltages for all non-ground nets (N = numNets - 1)
  // Plus branch currents for independent voltage sources (M sources)
  const nonGroundNets = nets.filter((n) => n.netId !== 0).map((n) => n.netId);
  const netIndexMap = new Map<number, number>();
  nonGroundNets.forEach((id, idx) => netIndexMap.set(id, idx));

  const dcSources = components.filter((c) => c.kind === 'dc_source');
  const matrixSize = nonGroundNets.length + dcSources.length;

  const A: number[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
  const z: number[] = Array(matrixSize).fill(0);

  // Helper to add conductance G between net1 and net2
  const addConductance = (net1: number, net2: number, G: number) => {
    if (isNaN(G) || !isFinite(G) || G <= 0) return;
    const idx1 = netIndexMap.get(net1);
    const idx2 = netIndexMap.get(net2);

    if (idx1 !== undefined) A[idx1][idx1] += G;
    if (idx2 !== undefined) A[idx2][idx2] += G;
    if (idx1 !== undefined && idx2 !== undefined) {
      A[idx1][idx2] -= G;
      A[idx2][idx1] -= G;
    }
  };

  // Helper to add Norton current source injection from net1 into net2
  const addCurrentInjection = (fromNet: number, toNet: number, currentA: number) => {
    const fromIdx = netIndexMap.get(fromNet);
    const toIdx = netIndexMap.get(toNet);
    if (fromIdx !== undefined) z[fromIdx] += currentA;
    if (toIdx !== undefined) z[toIdx] -= currentA;
  };

  // Add passive resistors, potentiometers, and closed switches
  for (const comp of components) {
    if (comp.kind === 'resistor') {
      const net1 = pinToNetId[`${comp.id}:p1`] ?? 0;
      const net2 = pinToNetId[`${comp.id}:p2`] ?? 0;
      const r = Math.max(0.01, comp.parameters.resistanceOhms || 1000);
      addConductance(net1, net2, 1.0 / r);
    } else if (comp.kind === 'pushbutton') {
      const net1 = pinToNetId[`${comp.id}:p1`] ?? 0;
      const net2 = pinToNetId[`${comp.id}:p2`] ?? 0;
      const isClosed = comp.parameters.switchClosed ?? false;
      const r = isClosed ? 0.05 : 1e8; // 0.05 ohm closed, 100 M-ohm open
      addConductance(net1, net2, 1.0 / r);
    } else if (comp.kind === 'potentiometer') {
      const net1 = pinToNetId[`${comp.id}:t1`] ?? 0;
      const netWiper = pinToNetId[`${comp.id}:wiper`] ?? 0;
      const net2 = pinToNetId[`${comp.id}:t2`] ?? 0;
      const rTotal = Math.max(10, comp.parameters.resistanceOhms || 10000);
      const wiper = Math.max(0.01, Math.min(0.99, comp.parameters.potWiperPosition ?? 0.5));
      addConductance(net1, netWiper, 1.0 / (rTotal * wiper));
      addConductance(netWiper, net2, 1.0 / (rTotal * (1 - wiper)));
    } else if (comp.kind === 'inductor') {
      const net1 = pinToNetId[`${comp.id}:p1`] ?? 0;
      const net2 = pinToNetId[`${comp.id}:p2`] ?? 0;
      const dcr = 0.5; // typical inductor DCR
      addConductance(net1, net2, 1.0 / dcr);
    } else if (comp.kind === 'capacitor') {
      const net1 = pinToNetId[`${comp.id}:pos`] ?? 0;
      const net2 = pinToNetId[`${comp.id}:neg`] ?? 0;
      const cap = Math.max(1e-9, comp.parameters.capacitanceFarads || 100e-6);
      const rEq = Math.max(0.1, dtSeconds / cap); // companion model Norton equivalent
      addConductance(net1, net2, 1.0 / rEq);
    }
  }

  // Iterative non-linear handling for Diodes, LEDs, and Transistors
  // Norton companion model with knee voltage injection
  for (const comp of components) {
    if (comp.kind === 'diode') {
      const netA = pinToNetId[`${comp.id}:anode`] ?? 0;
      const netK = pinToNetId[`${comp.id}:cathode`] ?? 0;
      const vKnee = 0.65;
      const gD = 1.0 / 10.0; // 10 ohm slope
      addConductance(netA, netK, gD);
      addCurrentInjection(netA, netK, vKnee * gD);
    } else if (comp.kind === 'led') {
      const netA = pinToNetId[`${comp.id}:anode`] ?? 0;
      const netK = pinToNetId[`${comp.id}:cathode`] ?? 0;
      const vKnee = comp.parameters.forwardVoltageV || 1.85;
      const gD = 1.0 / 15.0; // 15 ohm slope
      addConductance(netA, netK, gD);
      addCurrentInjection(netA, netK, vKnee * gD);
    } else if (comp.kind === 'transistor_npn') {
      const netC = pinToNetId[`${comp.id}:collector`] ?? 0;
      const netB = pinToNetId[`${comp.id}:base`] ?? 0;
      const netE = pinToNetId[`${comp.id}:emitter`] ?? 0;
      addConductance(netB, netE, 1.0 / 1000.0); // Base-emitter diode
      addConductance(netC, netE, 1.0 / 50.0); // Collector-emitter active channel
    } else if (comp.kind === 'transistor_mosfet') {
      const netD = pinToNetId[`${comp.id}:drain`] ?? 0;
      const netG = pinToNetId[`${comp.id}:gate`] ?? 0;
      const netS = pinToNetId[`${comp.id}:source`] ?? 0;
      addConductance(netG, netS, 1.0 / 1e8); // Gate insulator
      addConductance(netD, netS, 1.0 / 5.0); // Drain-source channel
    }
  }

  // Add Independent Voltage Sources (DC Sources / Battery)
  dcSources.forEach((src, srcIdx) => {
    const netPos = pinToNetId[`${src.id}:pos`] ?? 0;
    const netNeg = pinToNetId[`${src.id}:neg`] ?? 0;
    const vVal = src.parameters.voltageVolts ?? 9.0;
    const eqRow = nonGroundNets.length + srcIdx;

    const posIdx = netIndexMap.get(netPos);
    const negIdx = netIndexMap.get(netNeg);

    if (posIdx !== undefined) {
      A[posIdx][eqRow] += 1;
      A[eqRow][posIdx] += 1;
    }
    if (negIdx !== undefined) {
      A[negIdx][eqRow] -= 1;
      A[eqRow][negIdx] -= 1;
    }

    z[eqRow] = vVal;
  });

  // Solve linear system: Gaussian elimination with partial pivoting
  const solution = gaussianElimination(A, z);

  // Extract solved node voltages
  const nodeVoltages: Record<number, number> = { 0: 0.0 }; // Ground is 0V

  nonGroundNets.forEach((netId, idx) => {
    const v = solution ? solution[idx] : 0.0;
    nodeVoltages[netId] = isNaN(v) || !isFinite(v) ? 0.0 : Number(v.toFixed(3));
  });

  // Assign voltages to nets
  nets.forEach((n) => {
    n.voltage = nodeVoltages[n.netId] ?? 0.0;
  });

  // Extract pin voltages
  const pinVoltages: Record<string, number> = {};
  for (const comp of components) {
    for (const pin of comp.pins) {
      const pinKey = `${comp.id}:${pin.pinId}`;
      const netId = pinToNetId[pinKey] ?? 0;
      pinVoltages[pinKey] = nodeVoltages[netId] ?? 0.0;
    }
  }

  // Calculate branch currents & power dissipations
  const branchCurrents: Record<string, number> = {};
  const powerDissipations: Record<string, number> = {};
  let totalPower = 0.0;

  for (const comp of components) {
    let current = 0.0;
    let power = 0.0;

    if (comp.kind === 'resistor') {
      const v1 = pinVoltages[`${comp.id}:p1`] ?? 0;
      const v2 = pinVoltages[`${comp.id}:p2`] ?? 0;
      const r = Math.max(0.01, comp.parameters.resistanceOhms || 1000);
      const vDrop = v1 - v2;
      current = Math.abs(vDrop / r);
      power = current * Math.abs(vDrop);
    } else if (comp.kind === 'led') {
      const vA = pinVoltages[`${comp.id}:anode`] ?? 0;
      const vK = pinVoltages[`${comp.id}:cathode`] ?? 0;
      const vDrop = vA - vK;
      const vKnee = comp.parameters.forwardVoltageV || 1.85;

      if (vDrop > vKnee) {
        current = Math.max(0, (vDrop - vKnee) / 15.0);
        power = vDrop * current;
      } else {
        current = 0;
        power = 0;
      }
    } else if (comp.kind === 'diode') {
      const vA = pinVoltages[`${comp.id}:anode`] ?? 0;
      const vK = pinVoltages[`${comp.id}:cathode`] ?? 0;
      const vDrop = vA - vK;
      if (vDrop > 0.65) {
        current = Math.max(0, (vDrop - 0.65) / 10.0);
        power = vDrop * current;
      } else {
        current = 0;
        power = 0;
      }
    } else if (comp.kind === 'dc_source') {
      // Source current equals total current supplied to external circuit
      const vPos = pinVoltages[`${comp.id}:pos`] ?? 0;
      const vNeg = pinVoltages[`${comp.id}:neg`] ?? 0;
      const vDiff = vPos - vNeg;

      // Source index in MNA solution vector
      const srcIdx = dcSources.findIndex((s) => s.id === comp.id);
      if (srcIdx >= 0 && solution) {
        const iSrc = Math.abs(solution[nonGroundNets.length + srcIdx] || 0);
        current = iSrc;
        power = vDiff * current;
      }
    } else if (comp.kind === 'transistor_npn') {
      const vC = pinVoltages[`${comp.id}:collector`] ?? 0;
      const vB = pinVoltages[`${comp.id}:base`] ?? 0;
      const vE = pinVoltages[`${comp.id}:emitter`] ?? 0;
      const vBE = vB - vE;
      if (vBE > 0.65) {
        const iB = (vBE - 0.65) / 1000.0;
        const beta = comp.parameters.beta || 100;
        current = Math.max(0, Math.min(0.5, iB * beta));
        power = Math.max(0, (vC - vE) * current);
      }
    } else if (comp.kind === 'transistor_mosfet') {
      const vD = pinVoltages[`${comp.id}:drain`] ?? 0;
      const vG = pinVoltages[`${comp.id}:gate`] ?? 0;
      const vS = pinVoltages[`${comp.id}:source`] ?? 0;
      const vGS = vG - vS;
      const vTh = comp.parameters.vThreshold || 2.0;
      if (vGS > vTh) {
        const rOn = 5.0;
        current = Math.max(0, (vD - vS) / rOn);
        power = (vD - vS) * current;
      }
    }

    branchCurrents[comp.id] = Number(current.toFixed(5));
    powerDissipations[comp.id] = Number(power.toFixed(4));
    totalPower += power;
  }

  // 5. Diagnostics: Short circuits, open loops, burned components
  const diagnostics: CircuitDiagnostics = {
    hasShortCircuit: false,
    hasOpenCircuit: false,
    floatingNodes: [],
    reversedLeds: [],
    burnedComponents: [],
    validationErrors: [],
    solvedNodeVoltages: nodeVoltages,
    branchCurrents,
    totalPowerWatts: Number(totalPower.toFixed(3)),
  };

  // Check short circuit across DC voltage sources
  for (const src of dcSources) {
    const netPos = pinToNetId[`${src.id}:pos`];
    const netNeg = pinToNetId[`${src.id}:neg`];
    if (netPos !== undefined && netNeg !== undefined && netPos === netNeg) {
      diagnostics.hasShortCircuit = true;
      diagnostics.shortCircuitReason = `Direct short circuit across power supply terminals of ${src.name}!`;
    }
    const current = branchCurrents[src.id] || 0;
    if (current > 5.0) {
      // Overcurrent alert (> 5A on standard low voltage bench)
      diagnostics.hasShortCircuit = true;
      diagnostics.shortCircuitReason = `Excessive current (${current.toFixed(1)}A) detected across ${src.name}! Short circuit loop detected.`;
    }
  }

  // Check LED polarity
  for (const comp of components.filter((c) => c.kind === 'led')) {
    const vA = pinVoltages[`${comp.id}:anode`] ?? 0;
    const vK = pinVoltages[`${comp.id}:cathode`] ?? 0;
    if (vK > vA + 0.5) {
      diagnostics.reversedLeds.push(comp.id);
      diagnostics.validationErrors.push(`${comp.name} is reverse biased (Cathode voltage > Anode).`);
    }
  }

  // Check resistor power ratings (overstress > 0.5W for typical quarter-watt part)
  for (const comp of components.filter((c) => c.kind === 'resistor')) {
    const p = powerDissipations[comp.id] || 0;
    if (p > 0.5) {
      diagnostics.burnedComponents.push(comp.id);
      diagnostics.validationErrors.push(`${comp.name} power dissipation (${p.toFixed(2)}W) exceeds 0.25W rating!`);
    }
  }

  // Check for floating / unconnected pins
  for (const comp of components) {
    if (comp.kind !== 'ground') {
      const connectedCount = comp.pins.filter((p) => {
        const netId = pinToNetId[`${comp.id}:${p.pinId}`];
        const net = nets.find((n) => n.netId === netId);
        return net && net.connectedPins.length > 1;
      }).length;

      if (connectedCount < comp.pins.length) {
        diagnostics.hasOpenCircuit = true;
      }
    }
  }

  return {
    nets,
    nodeVoltages,
    pinVoltages,
    branchCurrents,
    powerDissipations,
    diagnostics,
  };
}

/**
 * Standard Gaussian elimination with partial pivoting.
 */
function gaussianElimination(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  if (n === 0) return [];

  // Deep copy to prevent mutation
  const M = A.map((row) => [...row]);
  const x = [...b];

  for (let p = 0; p < n; p++) {
    // Find pivot row
    let maxRow = p;
    for (let i = p + 1; i < n; i++) {
      if (Math.abs(M[i][p]) > Math.abs(M[maxRow][p])) {
        maxRow = i;
      }
    }

    // Swap pivot row
    const tempRow = M[p];
    M[p] = M[maxRow];
    M[maxRow] = tempRow;

    const tempB = x[p];
    x[p] = x[maxRow];
    x[maxRow] = tempB;

    // Singular check (tolerance 1e-12)
    if (Math.abs(M[p][p]) <= 1e-12) {
      // Regularize singular diagonal element
      M[p][p] = 1e-10;
    }

    // Eliminate below pivot
    for (let i = p + 1; i < n; i++) {
      const alpha = M[i][p] / M[p][p];
      x[i] -= alpha * x[p];
      for (let j = p; j < n; j++) {
        M[i][j] -= alpha * M[p][j];
      }
    }
  }

  // Back substitution
  const result = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0.0;
    for (let j = i + 1; j < n; j++) {
      sum += M[i][j] * result[j];
    }
    result[i] = (x[i] - sum) / M[i][i];
  }

  return result;
}
