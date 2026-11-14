/**
 * 3D Lab — Phase 6: PCB Studio Domain Types
 * Independent of Three.js and DOM APIs.
 */

export type PcbLayerId =
  | 'F_Cu'      // Front / Top Copper
  | 'B_Cu'      // Back / Bottom Copper
  | 'F_SilkS'   // Front Silkscreen (Reference designators, outlines)
  | 'B_SilkS'   // Back Silkscreen
  | 'F_Mask'    // Front Soldermask (Openings over pads)
  | 'B_Mask'    // Back Soldermask
  | 'Edge_Cuts' // Board mechanical outline
  | 'Ratsnest'; // Unrouted airwires (virtual CAD layer)

export interface PcbLayerDef {
  id: PcbLayerId;
  name: string;
  color: string;
  visible: boolean;
  opacity: number;
  isCopper: boolean;
}

export type PadShape = 'circle' | 'rect' | 'roundrect' | 'oval';

export interface PcbPad {
  padNumber: string;
  shape: PadShape;
  /** Relative offset in mm from component origin [x, y] */
  offsetMm: [number, number];
  /** Pad dimensions [widthMm, heightMm] */
  sizeMm: [number, number];
  /** Drill diameter in mm (0 for SMD pads) */
  drillMm: number;
  /** Layer set this pad exists on */
  layers: PcbLayerId[];
  /** Assigned electrical net ID */
  netId?: number;
  netName?: string;
}

export interface PcbFootprint {
  id: string;
  name: string;
  category: string;
  standardCode: string; // e.g. "R_Axial_DIN0207", "LED_D5.0mm", "TO-92_Inline"
  description: string;
  pads: PcbPad[];
  /** Graphic outline lines on silkscreen [[x1, y1, x2, y2], ...] in mm relative to origin */
  silkscreenLines: Array<[number, number, number, number]>;
  /** Silkscreen circles [[cx, cy, radius], ...] */
  silkscreenCircles?: Array<[number, number, number]>;
  /** Courtyard boundary bounding box [widthMm, heightMm] */
  courtyardSizeMm: [number, number];
  /** Associated 3D component model kind for 3D board rendering */
  model3dKind?: string;
}

export interface PcbPlacedComponent {
  /** Preserved 1:1 ID from CircuitElementInstance */
  id: string;
  /** Silkscreen reference designator (e.g. "R1", "C1", "LED1", "Q1", "U1") */
  designator: string;
  value: string;
  footprintId: string;
  /** 2D board position [x, y] in mm (origin at board top-left or center) */
  positionMm: [number, number];
  /** Rotation in degrees: 0, 90, 180, 270 */
  rotationDeg: number;
  /** Layer side: 'top' | 'bottom' */
  side: 'top' | 'bottom';
  /** Resolved pad network bindings */
  padNetMap: Record<string, number>; // padNumber -> netId
}

export interface PcbTrack {
  id: string;
  netId: number;
  netName?: string;
  layer: 'F_Cu' | 'B_Cu';
  startMm: [number, number];
  endMm: [number, number];
  widthMm: number; // e.g. 0.254 (10mil), 0.5 (20mil), 0.8 (power)
}

export interface PcbVia {
  id: string;
  netId: number;
  netName?: string;
  positionMm: [number, number];
  drillDiameterMm: number; // e.g. 0.4mm
  padDiameterMm: number;   // e.g. 0.8mm
}

export interface PcbBoardOutline {
  widthMm: number;
  heightMm: number;
  thicknessMm: number; // standard 1.6mm
  cornerRadiusMm: number; // e.g. 3mm
  mountingHoles: Array<{
    x: number;
    y: number;
    drillDiameterMm: number; // e.g. 3.2mm for M3
    padDiameterMm: number;   // e.g. 6.0mm
  }>;
  edgeClearanceMm: number; // e.g. 0.5mm safe margin
}

export type SoldermaskColor =
  | 'green'   // Classic matte / gloss green
  | 'black'   // Stealth black
  | 'blue'    // Royal blue
  | 'purple'  // OSH Park purple
  | 'red'     // Industrial red
  | 'white';  // Clean white

export type SurfaceFinish = 'HASL' | 'ENIG'; // Lead-free HASL or Electroless Nickel Immersion Gold

export interface PcbDesignRules {
  minTraceWidthMm: number; // default 0.25mm (~10 mil)
  minClearanceMm: number;  // default 0.25mm (~10 mil)
  minDrillDiameterMm: number; // default 0.3mm
  minBoardEdgeDistanceMm: number; // default 0.5mm
  minViaPadDiameterMm: number; // default 0.6mm
}

export type DrcSeverity = 'error' | 'warning';

export interface PcbDrcViolation {
  id: string;
  severity: DrcSeverity;
  rule: 'trace_width' | 'clearance' | 'edge_violation' | 'unrouted_net' | 'drill_size' | 'pad_overlap';
  message: string;
  positionMm: [number, number];
  relatedNetIds?: number[];
  relatedComponentIds?: string[];
}

export interface PcbDrcResult {
  passed: boolean;
  timestamp: string;
  errorCount: number;
  warningCount: number;
  violations: PcbDrcViolation[];
}

export interface RatsnestAirwire {
  id: string;
  netId: number;
  netName: string;
  startMm: [number, number];
  endMm: [number, number];
  lengthMm: number;
}

export interface PcbProject {
  id: string;
  name: string;
  sourceCircuitId?: string;
  boardOutline: PcbBoardOutline;
  soldermaskColor: SoldermaskColor;
  surfaceFinish: SurfaceFinish;
  copperLayerCount: 1 | 2;
  placedComponents: PcbPlacedComponent[];
  tracks: PcbTrack[];
  vias: PcbVia[];
  nets: Array<{
    netId: number;
    name: string;
    isGround: boolean;
    isPower: boolean;
    color: string;
  }>;
  designRules: PcbDesignRules;
}
