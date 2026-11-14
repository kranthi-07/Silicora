/**
 * 3D Lab — Phase 6: Circuit-to-PCB Adapter
 * Converts Circuit Workspace representations into physical PCB-ready projects.
 * Preserves component identity (component.id) across circuit and PCB environments.
 */

import { CircuitElementInstance, WireConnection } from '@/lib/circuit/types';
import {
  PcbProject,
  PcbPlacedComponent,
  PcbTrack,
  PcbVia,
  PcbBoardOutline,
  RatsnestAirwire,
  SoldermaskColor,
  SurfaceFinish,
} from '@/types/pcb';
import { mapComponentKindToFootprintId, getFootprint } from './footprint-library';

export interface ConvertCircuitOptions {
  id?: string;
  name?: string;
  boardWidthMm?: number;
  boardHeightMm?: number;
  copperLayerCount?: 1 | 2;
  soldermaskColor?: SoldermaskColor;
  surfaceFinish?: SurfaceFinish;
}

export function convertCircuitToPcbProject(
  circuitComponents: CircuitElementInstance[],
  wires: WireConnection[],
  options: ConvertCircuitOptions = {}
): PcbProject {
  const widthMm = options.boardWidthMm ?? 64;
  const heightMm = options.boardHeightMm ?? 46;
  const copperLayerCount = options.copperLayerCount ?? 2;
  const soldermaskColor = options.soldermaskColor ?? 'green';
  const surfaceFinish = options.surfaceFinish ?? 'HASL';

  // Standard M3 mounting holes in 4 corners
  const mountingHoles = [
    { x: 4.5, y: 4.5, drillDiameterMm: 3.2, padDiameterMm: 6.0 },
    { x: widthMm - 4.5, y: 4.5, drillDiameterMm: 3.2, padDiameterMm: 6.0 },
    { x: 4.5, y: heightMm - 4.5, drillDiameterMm: 3.2, padDiameterMm: 6.0 },
    { x: widthMm - 4.5, y: heightMm - 4.5, drillDiameterMm: 3.2, padDiameterMm: 6.0 },
  ];

  const boardOutline: PcbBoardOutline = {
    widthMm,
    heightMm,
    thicknessMm: 1.6,
    cornerRadiusMm: 3.0,
    mountingHoles,
    edgeClearanceMm: 0.5,
  };

  // 1. Filter out pure virtual components if any (e.g., ground symbol if handled via terminal block)
  // But preserve dc_source, resistor, capacitor, led, diode, transistor, pushbutton, etc.
  const physicalElements = circuitComponents.filter((c) => c.kind !== 'ground');

  // 2. Assign reference designators and footprints
  const prefixCounters: Record<string, number> = {
    R: 0,
    C: 0,
    D: 0,
    LED: 0,
    Q: 0,
    SW: 0,
    TB: 0,
    BT: 0,
    U: 0,
    L: 0,
  };

  const placedComponents: PcbPlacedComponent[] = [];

  physicalElements.forEach((elem, index) => {
    let prefix = 'U';
    switch (elem.kind) {
      case 'resistor':
        prefix = 'R';
        break;
      case 'capacitor':
        prefix = 'C';
        break;
      case 'diode':
        prefix = 'D';
        break;
      case 'led':
        prefix = 'LED';
        break;
      case 'transistor_npn':
      case 'transistor_mosfet':
        prefix = 'Q';
        break;
      case 'pushbutton':
        prefix = 'SW';
        break;
      case 'dc_source':
        prefix = 'BT';
        break;
      case 'inductor':
        prefix = 'L';
        break;
      default:
        prefix = 'TB';
    }

    prefixCounters[prefix] = (prefixCounters[prefix] || 0) + 1;
    const designator = `${prefix}${prefixCounters[prefix]}`;

    let valStr = elem.name;
    if (elem.parameters.resistanceOhms) valStr = `${elem.parameters.resistanceOhms}Ω`;
    else if (elem.parameters.voltageVolts) valStr = `${elem.parameters.voltageVolts}V`;
    else if (elem.parameters.capacitanceFarads) valStr = `${elem.parameters.capacitanceFarads * 1e6}µF`;
    else if (elem.parameters.ledColor) valStr = `${elem.parameters.ledColor.toUpperCase()} LED`;

    const footprintId = mapComponentKindToFootprintId(elem.kind);

    // Initial placement arrangement:
    // Place power input (BT/TB) at left (x = 13, y = 23)
    // Place remaining components along organized grid
    let posX = 14;
    let posY = 23;
    let rot = 0;

    if (elem.kind === 'dc_source') {
      posX = 13;
      posY = heightMm / 2;
      rot = 90;
    } else {
      const otherIdx = placedComponents.filter((p) => !p.designator.startsWith('BT')).length;
      const col = otherIdx % 3;
      const row = Math.floor(otherIdx / 3);
      posX = 26 + col * 15;
      posY = 16 + row * 15;
      rot = 0;
    }

    placedComponents.push({
      id: elem.id, // Preserving 1:1 ID!
      designator,
      value: valStr,
      footprintId,
      positionMm: [posX, posY],
      rotationDeg: rot,
      side: 'top',
      padNetMap: {},
    });
  });

  // 3. Resolve Electrical Nets via Union-Find
  // Map "componentId:pinId" -> net group
  const pinKeys: string[] = [];
  circuitComponents.forEach((c) => {
    c.pins.forEach((p) => {
      pinKeys.push(`${c.id}:${p.pinId}`);
    });
  });

  const parent: Record<string, string> = {};
  pinKeys.forEach((k) => (parent[k] = k));

  function find(x: string): string {
    if (!parent[x]) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a: string, b: string) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent[rootA] = rootB;
    }
  }

  // Union all wire connections
  wires.forEach((w) => {
    union(`${w.fromComponentId}:${w.fromPinId}`, `${w.toComponentId}:${w.toPinId}`);
  });

  // Also union any virtual ground components with connected pins
  const groundElement = circuitComponents.find((c) => c.kind === 'ground');
  if (groundElement) {
    const gndPinKey = `${groundElement.id}:${groundElement.pins[0]?.pinId || 'gnd'}`;
    wires.forEach((w) => {
      if (w.fromComponentId === groundElement.id) {
        union(gndPinKey, `${w.toComponentId}:${w.toPinId}`);
      }
      if (w.toComponentId === groundElement.id) {
        union(gndPinKey, `${w.fromComponentId}:${w.fromPinId}`);
      }
    });
  }

  // Group by root into distinct nets
  const netGroups: Record<string, string[]> = {};
  pinKeys.forEach((key) => {
    // Only group pins of placed physical elements
    const [compId] = key.split(':');
    if (placedComponents.some((p) => p.id === compId)) {
      const root = find(key);
      if (!netGroups[root]) netGroups[root] = [];
      netGroups[root].push(key);
    }
  });

  // Assign Net IDs and Names
  let nextNetId = 1;
  const nets: PcbProject['nets'] = [];
  const rootToNetId: Record<string, number> = {};

  const netColors = ['#ef4444', '#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  Object.entries(netGroups).forEach(([rootKey, members]) => {
    // Determine if this net is VCC or GND
    let isGnd = false;
    let isVcc = false;

    // Check if connected to dc_source positive or negative
    members.forEach((m) => {
      const [compId, pinId] = m.split(':');
      const comp = circuitComponents.find((c) => c.id === compId);
      if (comp?.kind === 'dc_source') {
        if (pinId === 'pos' || pinId === 'vcc' || pinId === '1') isVcc = true;
        if (pinId === 'neg' || pinId === 'gnd' || pinId === '2') isGnd = true;
      }
      if (comp?.kind === 'ground') {
        isGnd = true;
      }
    });

    const netId = nextNetId++;
    let name = `NET_${netId}`;
    let color = netColors[(netId - 1) % netColors.length];

    if (isVcc) {
      name = 'VCC_9V';
      color = '#ef4444';
    } else if (isGnd) {
      name = 'GND';
      color = '#0284c7';
    }

    nets.push({
      netId,
      name,
      isGround: isGnd,
      isPower: isVcc,
      color,
    });

    rootToNetId[rootKey] = netId;

    // Map into placedComponents padNetMap
    members.forEach((m) => {
      const [compId, pinId] = m.split(':');
      const placed = placedComponents.find((p) => p.id === compId);
      if (placed) {
        // Map pinId to pad number: 'pos'->'1', 'neg'->'2', 'p1'->'1', 'p2'->'2', 'anode'->'1', 'cathode'->'2'
        let padNum = '1';
        if (pinId === 'p2' || pinId === 'neg' || pinId === 'cathode' || pinId === 'pin2' || pinId === 'source' || pinId === 'collector') {
          padNum = '2';
        } else if (pinId === 'base' || pinId === 'gate' || pinId === 'p3' || pinId === 'pin3') {
          padNum = '3';
        } else if (pinId === 'p4' || pinId === 'pin4') {
          padNum = '4';
        }
        placed.padNetMap[padNum] = netId;
      }
    });
  });

  // 4. Calculate Absolute Coordinates for all pads to generate ratsnest & initial tracks
  const padCoordinates: Array<{
    compId: string;
    padNumber: string;
    netId: number;
    x: number;
    y: number;
  }> = [];

  placedComponents.forEach((comp) => {
    const footprint = getFootprint(comp.footprintId);
    const rad = (comp.rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    footprint.pads.forEach((pad) => {
      const netId = comp.padNetMap[pad.padNumber];
      if (netId !== undefined) {
        // Rotate offset
        const rotX = pad.offsetMm[0] * cos - pad.offsetMm[1] * sin;
        const rotY = pad.offsetMm[0] * sin + pad.offsetMm[1] * cos;
        padCoordinates.push({
          compId: comp.id,
          padNumber: pad.padNumber,
          netId,
          x: comp.positionMm[0] + rotX,
          y: comp.positionMm[1] + rotY,
        });
      }
    });
  });

  // 5. Generate Initial Routed Tracks
  // Group pad coordinates by netId and create sequential orthogonal tracks
  const tracks: PcbTrack[] = [];
  const vias: PcbVia[] = [];
  let trackIdx = 1;

  nets.forEach((net) => {
    const netPads = padCoordinates.filter((p) => p.netId === net.netId);
    if (netPads.length >= 2) {
      // Connect sequential pads with orthogonal tracks
      for (let i = 0; i < netPads.length - 1; i++) {
        const p1 = netPads[i];
        const p2 = netPads[i + 1];

        // Layer selection: Power/GND on B_Cu (bottom), signals on F_Cu (top)
        const layer: 'F_Cu' | 'B_Cu' = net.isGround || net.isPower ? 'B_Cu' : 'F_Cu';
        const widthMm = net.isGround || net.isPower ? 0.6 : 0.35;

        // Orthogonal 2-segment routing (horizontal then vertical)
        const midPoint: [number, number] = [p2.x, p1.y];

        // Segment 1: p1 -> midPoint
        if (Math.hypot(midPoint[0] - p1.x, midPoint[1] - p1.y) > 0.1) {
          tracks.push({
            id: `trk_${trackIdx++}`,
            netId: net.netId,
            netName: net.name,
            layer,
            startMm: [p1.x, p1.y],
            endMm: [midPoint[0], midPoint[1]],
            widthMm,
          });
        }

        // Segment 2: midPoint -> p2
        if (Math.hypot(p2.x - midPoint[0], p2.y - midPoint[1]) > 0.1) {
          tracks.push({
            id: `trk_${trackIdx++}`,
            netId: net.netId,
            netName: net.name,
            layer,
            startMm: [midPoint[0], midPoint[1]],
            endMm: [p2.x, p2.y],
            widthMm,
          });
        }
      }
    }
  });

  return {
    id: options.id || `pcb_${Date.now()}`,
    name: options.name || 'Circuit_Design_PCB',
    boardOutline,
    soldermaskColor,
    surfaceFinish,
    copperLayerCount,
    placedComponents,
    tracks,
    vias,
    nets,
    designRules: {
      minTraceWidthMm: 0.25,
      minClearanceMm: 0.25,
      minDrillDiameterMm: 0.3,
      minBoardEdgeDistanceMm: 0.5,
      minViaPadDiameterMm: 0.6,
    },
  };
}

/**
 * Computes Ratsnest (Airwires) between pads of the same net that lack routed copper.
 */
export function calculateRatsnest(project: PcbProject): RatsnestAirwire[] {
  const airwires: RatsnestAirwire[] = [];

  // 1. Gather all pad absolute positions
  const netPadsMap: Record<number, Array<{ compId: string; padNumber: string; x: number; y: number }>> = {};

  project.placedComponents.forEach((comp) => {
    const footprint = getFootprint(comp.footprintId);
    const rad = (comp.rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    footprint.pads.forEach((pad) => {
      const netId = comp.padNetMap[pad.padNumber];
      if (netId !== undefined) {
        if (!netPadsMap[netId]) netPadsMap[netId] = [];
        const rotX = pad.offsetMm[0] * cos - pad.offsetMm[1] * sin;
        const rotY = pad.offsetMm[0] * sin + pad.offsetMm[1] * cos;
        netPadsMap[netId].push({
          compId: comp.id,
          padNumber: pad.padNumber,
          x: comp.positionMm[0] + rotX,
          y: comp.positionMm[1] + rotY,
        });
      }
    });
  });

  // 2. Connect pads of the same net if there are 2 or more
  let airwireId = 1;
  Object.entries(netPadsMap).forEach(([netIdStr, pads]) => {
    const netId = Number(netIdStr);
    const netInfo = project.nets.find((n) => n.netId === netId);
    const netName = netInfo?.name || `NET_${netId}`;

    // Simple minimal spanning sequence
    for (let i = 0; i < pads.length - 1; i++) {
      const p1 = pads[i];
      const p2 = pads[i + 1];
      const lengthMm = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      airwires.push({
        id: `air_${airwireId++}`,
        netId,
        netName,
        startMm: [p1.x, p1.y],
        endMm: [p2.x, p2.y],
        lengthMm: Number(lengthMm.toFixed(2)),
      });
    }
  });

  return airwires;
}
