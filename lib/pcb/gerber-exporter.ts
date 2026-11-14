/**
 * 3D Lab — RS-274X Gerber & Excellon Drill Exporter
 * Generates industry-standard manufacturing files ready for fabrication (JLCPCB, PCBWay, OSH Park).
 */

import { PcbProject } from '@/types/pcb';
import { getFootprint } from './footprint-library';

export interface GerberPackage {
  'Top_Copper.gtl': string;
  'Bottom_Copper.gbl': string;
  'Top_Silkscreen.gto': string;
  'Top_Soldermask.gts': string;
  'Bottom_Soldermask.gbs': string;
  'Board_Outline.gko': string;
  'Plated_Drill.drl': string;
}

/**
 * Format mm to Gerber coordinate string (6 decimal digits, integer scaled by 1,000,000)
 */
function toGerberCoord(valMm: number): string {
  const scaled = Math.round(valMm * 1000000);
  return scaled.toString();
}

/**
 * Generates RS-274X Header
 */
function makeGerberHeader(layerName: string): string[] {
  return [
    `G04 Layer: ${layerName}*`,
    'G04 Created by 3D Lab PCB Studio (RS-274X)*',
    '%FSLAX46Y46*%',
    '%MOMM*%',
    '%LPD*%',
  ];
}

/**
 * Generate Top Copper (F.Cu)
 */
export function generateTopCopperGerber(project: PcbProject): string {
  const lines = makeGerberHeader('Top Copper (F.Cu)');

  // Apertures
  lines.push('%ADD10C,0.350000*%'); // Standard trace
  lines.push('%ADD11C,0.600000*%'); // Power trace
  lines.push('%ADD12C,1.800000*%'); // Standard circular pad
  lines.push('%ADD13R,1.800000X1.800000*%'); // Rect pad

  // Flash Pads on F.Cu
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

      const ap = pad.shape === 'rect' ? 'D13' : 'D12';
      lines.push(`${ap}*`);
      lines.push(`X${toGerberCoord(padX)}Y${toGerberCoord(padY)}D03*`);
    });
  });

  // Draw Tracks on F.Cu
  const topTracks = project.tracks.filter((t) => t.layer === 'F_Cu');
  topTracks.forEach((t) => {
    const ap = t.widthMm >= 0.5 ? 'D11' : 'D10';
    lines.push(`${ap}*`);
    lines.push(`X${toGerberCoord(t.startMm[0])}Y${toGerberCoord(t.startMm[1])}D02*`);
    lines.push(`X${toGerberCoord(t.endMm[0])}Y${toGerberCoord(t.endMm[1])}D01*`);
  });

  lines.push('M02*');
  return lines.join('\n');
}

/**
 * Generate Bottom Copper (B.Cu)
 */
export function generateBottomCopperGerber(project: PcbProject): string {
  const lines = makeGerberHeader('Bottom Copper (B.Cu)');

  lines.push('%ADD10C,0.350000*%');
  lines.push('%ADD11C,0.600000*%');
  lines.push('%ADD12C,1.800000*%');
  lines.push('%ADD13R,1.800000X1.800000*%');

  // Flash THT Pads on B.Cu
  project.placedComponents.forEach((comp) => {
    const footprint = getFootprint(comp.footprintId);
    const rad = (comp.rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    footprint.pads.forEach((pad) => {
      if (pad.drillMm > 0) {
        const rotX = pad.offsetMm[0] * cos - pad.offsetMm[1] * sin;
        const rotY = pad.offsetMm[0] * sin + pad.offsetMm[1] * cos;
        const padX = comp.positionMm[0] + rotX;
        const padY = comp.positionMm[1] + rotY;

        const ap = pad.shape === 'rect' ? 'D13' : 'D12';
        lines.push(`${ap}*`);
        lines.push(`X${toGerberCoord(padX)}Y${toGerberCoord(padY)}D03*`);
      }
    });
  });

  // Draw Tracks on B.Cu
  const botTracks = project.tracks.filter((t) => t.layer === 'B_Cu');
  botTracks.forEach((t) => {
    const ap = t.widthMm >= 0.5 ? 'D11' : 'D10';
    lines.push(`${ap}*`);
    lines.push(`X${toGerberCoord(t.startMm[0])}Y${toGerberCoord(t.startMm[1])}D02*`);
    lines.push(`X${toGerberCoord(t.endMm[0])}Y${toGerberCoord(t.endMm[1])}D01*`);
  });

  lines.push('M02*');
  return lines.join('\n');
}

/**
 * Generate Top Silkscreen (F.SilkS)
 */
export function generateTopSilkscreenGerber(project: PcbProject): string {
  const lines = makeGerberHeader('Top Silkscreen (F.SilkS)');
  lines.push('%ADD10C,0.150000*%'); // Silkscreen line aperture

  project.placedComponents.forEach((comp) => {
    const footprint = getFootprint(comp.footprintId);
    const rad = (comp.rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    footprint.silkscreenLines.forEach(([x1, y1, x2, y2]) => {
      const rx1 = x1 * cos - y1 * sin + comp.positionMm[0];
      const ry1 = x1 * sin + y1 * cos + comp.positionMm[1];
      const rx2 = x2 * cos - y2 * sin + comp.positionMm[0];
      const ry2 = x2 * sin + y2 * cos + comp.positionMm[1];

      lines.push('D10*');
      lines.push(`X${toGerberCoord(rx1)}Y${toGerberCoord(ry1)}D02*`);
      lines.push(`X${toGerberCoord(rx2)}Y${toGerberCoord(ry2)}D01*`);
    });
  });

  lines.push('M02*');
  return lines.join('\n');
}

/**
 * Generate Top Soldermask (F.Mask)
 */
export function generateTopSoldermaskGerber(project: PcbProject): string {
  const lines = makeGerberHeader('Top Soldermask (F.Mask)');
  // Mask openings are typically pad size + 0.1mm (0.05mm expansion)
  lines.push('%ADD12C,1.900000*%');
  lines.push('%ADD13R,1.900000X1.900000*%');

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

      const ap = pad.shape === 'rect' ? 'D13' : 'D12';
      lines.push(`${ap}*`);
      lines.push(`X${toGerberCoord(padX)}Y${toGerberCoord(padY)}D03*`);
    });
  });

  lines.push('M02*');
  return lines.join('\n');
}

/**
 * Generate Bottom Soldermask (B.Mask)
 */
export function generateBottomSoldermaskGerber(project: PcbProject): string {
  const lines = makeGerberHeader('Bottom Soldermask (B.Mask)');
  lines.push('%ADD12C,1.900000*%');
  lines.push('%ADD13R,1.900000X1.900000*%');

  project.placedComponents.forEach((comp) => {
    const footprint = getFootprint(comp.footprintId);
    const rad = (comp.rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    footprint.pads.forEach((pad) => {
      if (pad.drillMm > 0) {
        const rotX = pad.offsetMm[0] * cos - pad.offsetMm[1] * sin;
        const rotY = pad.offsetMm[0] * sin + pad.offsetMm[1] * cos;
        const padX = comp.positionMm[0] + rotX;
        const padY = comp.positionMm[1] + rotY;

        const ap = pad.shape === 'rect' ? 'D13' : 'D12';
        lines.push(`${ap}*`);
        lines.push(`X${toGerberCoord(padX)}Y${toGerberCoord(padY)}D03*`);
      }
    });
  });

  lines.push('M02*');
  return lines.join('\n');
}

/**
 * Generate Board Outline (Edge.Cuts)
 */
export function generateEdgeCutsGerber(project: PcbProject): string {
  const { widthMm, heightMm } = project.boardOutline;
  const lines = makeGerberHeader('Board Outline (Edge.Cuts)');
  lines.push('%ADD10C,0.150000*%');

  lines.push('D10*');
  lines.push(`X${toGerberCoord(0)}Y${toGerberCoord(0)}D02*`);
  lines.push(`X${toGerberCoord(widthMm)}Y${toGerberCoord(0)}D01*`);
  lines.push(`X${toGerberCoord(widthMm)}Y${toGerberCoord(heightMm)}D01*`);
  lines.push(`X${toGerberCoord(0)}Y${toGerberCoord(heightMm)}D01*`);
  lines.push(`X${toGerberCoord(0)}Y${toGerberCoord(0)}D01*`);

  lines.push('M02*');
  return lines.join('\n');
}

/**
 * Generate Excellon NC Drill File (.drl)
 */
export function generateExcellonDrill(project: PcbProject): string {
  const lines: string[] = [];
  lines.push('M48');
  lines.push('METRIC,TZ');
  lines.push('; Created by 3D Lab PCB Studio');

  // Collect drill sizes
  const toolSizes = new Map<number, string>();
  let toolIndex = 1;

  // Tool 1: Mounting holes 3.2mm
  toolSizes.set(3.2, `T0${toolIndex++}`);

  // Collect pad drills
  project.placedComponents.forEach((comp) => {
    const footprint = getFootprint(comp.footprintId);
    footprint.pads.forEach((p) => {
      if (p.drillMm > 0 && !toolSizes.has(p.drillMm)) {
        toolSizes.set(p.drillMm, `T0${toolIndex++}`);
      }
    });
  });

  // Vias 0.4mm
  if (project.vias.length > 0 && !toolSizes.has(0.4)) {
    toolSizes.set(0.4, `T0${toolIndex++}`);
  }

  // Header tool list
  toolSizes.forEach((toolCode, dia) => {
    lines.push(`${toolCode}C${dia.toFixed(3)}`);
  });

  lines.push('%');
  lines.push('G05');

  // Drill Mounting Holes
  const tM3 = toolSizes.get(3.2);
  if (tM3) {
    lines.push(tM3);
    project.boardOutline.mountingHoles.forEach((hole) => {
      lines.push(`X${Math.round(hole.x * 1000)}Y${Math.round(hole.y * 1000)}`);
    });
  }

  // Drill Pads grouped by tool
  toolSizes.forEach((toolCode, dia) => {
    if (dia === 3.2) return; // already done

    const drillCoords: Array<[number, number]> = [];

    // Pads
    project.placedComponents.forEach((comp) => {
      const footprint = getFootprint(comp.footprintId);
      const rad = (comp.rotationDeg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      footprint.pads.forEach((pad) => {
        if (Math.abs(pad.drillMm - dia) < 0.01) {
          const rotX = pad.offsetMm[0] * cos - pad.offsetMm[1] * sin;
          const rotY = pad.offsetMm[0] * sin + pad.offsetMm[1] * cos;
          drillCoords.push([comp.positionMm[0] + rotX, comp.positionMm[1] + rotY]);
        }
      });
    });

    // Vias
    if (dia === 0.4) {
      project.vias.forEach((v) => {
        drillCoords.push([v.positionMm[0], v.positionMm[1]]);
      });
    }

    if (drillCoords.length > 0) {
      lines.push(toolCode);
      drillCoords.forEach(([x, y]) => {
        lines.push(`X${Math.round(x * 1000)}Y${Math.round(y * 1000)}`);
      });
    }
  });

  lines.push('M30');
  return lines.join('\n');
}

/**
 * Generates the full set of fabrication files
 */
export function generateGerberPackage(project: PcbProject): GerberPackage {
  return {
    'Top_Copper.gtl': generateTopCopperGerber(project),
    'Bottom_Copper.gbl': generateBottomCopperGerber(project),
    'Top_Silkscreen.gto': generateTopSilkscreenGerber(project),
    'Top_Soldermask.gts': generateTopSoldermaskGerber(project),
    'Bottom_Soldermask.gbs': generateBottomSoldermaskGerber(project),
    'Board_Outline.gko': generateEdgeCutsGerber(project),
    'Plated_Drill.drl': generateExcellonDrill(project),
  };
}
