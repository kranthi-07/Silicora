/**
 * 3D Lab — Phase 6: PCB Design Rule Checking (DRC) Engine
 * Evaluates physical layout against manufacturing constraints.
 */

import { PcbProject, PcbDrcResult, PcbDrcViolation } from '@/types/pcb';
import { getFootprint } from './footprint-library';
import { calculateRatsnest } from './circuit-to-pcb-adapter';

export function runDesignRuleCheck(project: PcbProject): PcbDrcResult {
  const violations: PcbDrcViolation[] = [];
  const rules = project.designRules;
  const { widthMm, heightMm } = project.boardOutline;
  let violationId = 1;

  // 1. Trace Width Check
  project.tracks.forEach((track) => {
    if (track.widthMm < rules.minTraceWidthMm - 0.001) {
      violations.push({
        id: `drc_${violationId++}`,
        severity: 'error',
        rule: 'trace_width',
        message: `Track width ${track.widthMm}mm violates min constraint ${rules.minTraceWidthMm}mm on layer ${track.layer}`,
        positionMm: [track.startMm[0], track.startMm[1]],
        relatedNetIds: [track.netId],
      });
    }
  });

  // 2. Board Edge Violations (Clearance to Edge.Cuts)
  // Check tracks
  project.tracks.forEach((track) => {
    const minX = Math.min(track.startMm[0], track.endMm[0]);
    const maxX = Math.max(track.startMm[0], track.endMm[0]);
    const minY = Math.min(track.startMm[1], track.endMm[1]);
    const maxY = Math.max(track.startMm[1], track.endMm[1]);

    if (
      minX < rules.minBoardEdgeDistanceMm ||
      minY < rules.minBoardEdgeDistanceMm ||
      maxX > widthMm - rules.minBoardEdgeDistanceMm ||
      maxY > heightMm - rules.minBoardEdgeDistanceMm
    ) {
      violations.push({
        id: `drc_${violationId++}`,
        severity: 'error',
        rule: 'edge_violation',
        message: `Track is too close to board edge (< ${rules.minBoardEdgeDistanceMm}mm)`,
        positionMm: [track.startMm[0], track.startMm[1]],
        relatedNetIds: [track.netId],
      });
    }
  });

  // Check pads and component positions
  project.placedComponents.forEach((comp) => {
    const footprint = getFootprint(comp.footprintId);
    const rad = (comp.rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    footprint.pads.forEach((pad) => {
      const rotX = pad.offsetMm[0] * cos - pad.offsetMm[1] * sin;
      const rotY = pad.offsetMm[0] * sin + pad.offsetMm[1] * cos;
      const padX = comp.positionMm[0] + rotX;
      const padY = comp.positionMm[1] + rotY;

      if (
        padX < rules.minBoardEdgeDistanceMm ||
        padY < rules.minBoardEdgeDistanceMm ||
        padX > widthMm - rules.minBoardEdgeDistanceMm ||
        padY > heightMm - rules.minBoardEdgeDistanceMm
      ) {
        violations.push({
          id: `drc_${violationId++}`,
          severity: 'error',
          rule: 'edge_violation',
          message: `${comp.designator} Pad ${pad.padNumber} encroaches on board edge safe zone`,
          positionMm: [padX, padY],
          relatedComponentIds: [comp.id],
        });
      }
    });
  });

  // 3. Track-to-Track Clearance Check on Same Layer
  for (let i = 0; i < project.tracks.length; i++) {
    for (let j = i + 1; j < project.tracks.length; j++) {
      const t1 = project.tracks[i];
      const t2 = project.tracks[j];

      // Only check if on the same layer and belonging to DIFFERENT nets
      if (t1.layer === t2.layer && t1.netId !== t2.netId) {
        const dist = segmentToSegmentDistance(t1.startMm, t1.endMm, t2.startMm, t2.endMm);
        const clearance = dist - (t1.widthMm / 2 + t2.widthMm / 2);

        if (clearance < rules.minClearanceMm - 0.001) {
          violations.push({
            id: `drc_${violationId++}`,
            severity: 'error',
            rule: 'clearance',
            message: `Clearance violation (${clearance.toFixed(2)}mm < ${rules.minClearanceMm}mm) between Net ${t1.netId} and Net ${t2.netId} on ${t1.layer}`,
            positionMm: [t1.startMm[0], t1.startMm[1]],
            relatedNetIds: [t1.netId, t2.netId],
          });
        }
      }
    }
  }

  // 4. Unrouted Net (Airwires) Check
  // Check if any net has 2+ pads but 0 tracks connecting it
  project.nets.forEach((net) => {
    const netTracks = project.tracks.filter((t) => t.netId === net.netId);
    let padCount = 0;
    project.placedComponents.forEach((comp) => {
      Object.values(comp.padNetMap).forEach((nId) => {
        if (nId === net.netId) padCount++;
      });
    });

    if (padCount >= 2 && netTracks.length === 0) {
      violations.push({
        id: `drc_${violationId++}`,
        severity: 'warning',
        rule: 'unrouted_net',
        message: `Net ${net.name} has ${padCount} connected pads but no routed copper tracks`,
        positionMm: [widthMm / 2, heightMm / 2],
        relatedNetIds: [net.netId],
      });
    }
  });

  const errorCount = violations.filter((v) => v.severity === 'error').length;
  const warningCount = violations.filter((v) => v.severity === 'warning').length;

  return {
    passed: errorCount === 0,
    timestamp: new Date().toISOString(),
    errorCount,
    warningCount,
    violations,
  };
}

/**
 * Geometric distance between two 2D line segments
 */
function segmentToSegmentDistance(
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  p4: [number, number]
): number {
  function distSq(a: [number, number], b: [number, number]) {
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  }

  function distToSegmentSq(p: [number, number], v: [number, number], w: [number, number]) {
    const l2 = distSq(v, w);
    if (l2 === 0) return distSq(p, v);
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return distSq(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
  }

  // Minimum of distances from endpoints of each segment to the other
  const d1 = distToSegmentSq(p1, p3, p4);
  const d2 = distToSegmentSq(p2, p3, p4);
  const d3 = distToSegmentSq(p3, p1, p2);
  const d4 = distToSegmentSq(p4, p1, p2);

  return Math.sqrt(Math.min(d1, d2, d3, d4));
}
