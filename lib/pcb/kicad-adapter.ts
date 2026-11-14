/**
 * 3D Lab — KiCad 7 / 8 S-Expression Adapter
 * Exports PcbProject into native .kicad_pcb and .net netlist formats.
 * Directly importable into KiCad Pcbnew and compatible with JLCPCB / PCBWay.
 */

import { PcbProject } from '@/types/pcb';
import { getFootprint } from './footprint-library';

export function exportToKiCadPcb(project: PcbProject): string {
  const { widthMm, heightMm, thicknessMm } = project.boardOutline;

  const lines: string[] = [];

  // Header & General Config
  lines.push('(kicad_pcb (version 20221018) (generator "3D_Lab_PCB_Studio")');
  lines.push('  (general');
  lines.push(`    (thickness ${thicknessMm})`);
  lines.push('  )');
  lines.push('  (paper "A4")');

  // Layers Stackup
  lines.push('  (layers');
  lines.push('    (0 "F.Cu" signal)');
  lines.push('    (31 "B.Cu" signal)');
  lines.push('    (32 "B.Mask" user)');
  lines.push('    (33 "F.Mask" user)');
  lines.push('    (34 "B.SilkS" user)');
  lines.push('    (35 "F.SilkS" user)');
  lines.push('    (44 "Edge.Cuts" user)');
  lines.push('  )');

  lines.push('  (setup');
  lines.push('    (pad_to_mask_clearance 0.05)');
  lines.push('    (pcbplotparams');
  lines.push('      (layerselection 0x00010fc_ffffffff)');
  lines.push('      (usegerberextensions true)');
  lines.push('      (usegerberattributes true)');
  lines.push('      (usegerberadvancedattributes true)');
  lines.push('    )');
  lines.push('  )');

  // Net Definitions (Net 0 is empty unassigned net)
  lines.push('  (net 0 "")');
  project.nets.forEach((net) => {
    lines.push(`  (net ${net.netId} "${net.name}")`);
  });

  // Edge Cuts (Board Boundary)
  lines.push(`  (gr_line (start 0 0) (end ${widthMm} 0) (layer "Edge.Cuts") (width 0.15))`);
  lines.push(`  (gr_line (start ${widthMm} 0) (end ${widthMm} ${heightMm}) (layer "Edge.Cuts") (width 0.15))`);
  lines.push(`  (gr_line (start ${widthMm} ${heightMm}) (end 0 ${heightMm}) (layer "Edge.Cuts") (width 0.15))`);
  lines.push(`  (gr_line (start 0 ${heightMm}) (end 0 0) (layer "Edge.Cuts") (width 0.15))`);

  // Mounting Holes on Edge.Cuts / NPTH
  project.boardOutline.mountingHoles.forEach((hole) => {
    lines.push(`  (gr_circle (center ${hole.x} ${hole.y}) (end ${hole.x + hole.drillDiameterMm / 2} ${hole.y}) (layer "Edge.Cuts") (width 0.15))`);
  });

  // Placed Components & Footprints
  project.placedComponents.forEach((comp) => {
    const footprint = getFootprint(comp.footprintId);
    const sideLayer = comp.side === 'top' ? 'F.Cu' : 'B.Cu';
    const silkLayer = comp.side === 'top' ? 'F.SilkS' : 'B.SilkS';

    lines.push(`  (footprint "${footprint.category}:${footprint.name}" (layer "${sideLayer}")`);
    lines.push(`    (at ${comp.positionMm[0]} ${comp.positionMm[1]} ${comp.rotationDeg})`);
    lines.push(`    (property "Reference" "${comp.designator}" (at 0 -3.0 ${comp.rotationDeg}) (layer "${silkLayer}") (effects (font (size 1 1) (thickness 0.15))))`);
    lines.push(`    (property "Value" "${comp.value}" (at 0 3.0 ${comp.rotationDeg}) (layer "${silkLayer}") (effects (font (size 1 1) (thickness 0.15))))`);

    // Silkscreen Graphic Outlines
    footprint.silkscreenLines.forEach(([x1, y1, x2, y2]) => {
      lines.push(`    (fp_line (start ${x1} ${y1}) (end ${x2} ${y2}) (layer "${silkLayer}") (width 0.12))`);
    });

    if (footprint.silkscreenCircles) {
      footprint.silkscreenCircles.forEach(([cx, cy, r]) => {
        lines.push(`    (fp_circle (center ${cx} ${cy}) (end ${cx + r} ${cy}) (layer "${silkLayer}") (width 0.12))`);
      });
    }

    // Pads
    footprint.pads.forEach((pad) => {
      const netId = comp.padNetMap[pad.padNumber] || 0;
      const netInfo = project.nets.find((n) => n.netId === netId);
      const netName = netInfo?.name || '';

      const padType = pad.drillMm > 0 ? 'thru_hole' : 'smd';
      const shape = pad.shape === 'rect' ? 'rect' : pad.shape === 'roundrect' ? 'roundrect' : 'circle';
      const padLayers = pad.drillMm > 0 ? '"*.Cu" "*.Mask"' : `"${sideLayer}" "${comp.side === 'top' ? 'F.Mask' : 'B.Mask'}"`;

      const drillStr = pad.drillMm > 0 ? ` (drill ${pad.drillMm})` : '';
      const netStr = netId > 0 ? ` (net ${netId} "${netName}")` : '';

      lines.push(
        `    (pad "${pad.padNumber}" ${padType} ${shape} (at ${pad.offsetMm[0]} ${pad.offsetMm[1]}) (size ${pad.sizeMm[0]} ${pad.sizeMm[1]})${drillStr} (layers ${padLayers})${netStr})`
      );
    });

    lines.push('  )');
  });

  // Copper Tracks
  project.tracks.forEach((track) => {
    const layerName = track.layer === 'F_Cu' ? 'F.Cu' : 'B.Cu';
    lines.push(
      `  (segment (start ${track.startMm[0]} ${track.startMm[1]}) (end ${track.endMm[0]} ${track.endMm[1]}) (width ${track.widthMm}) (layer "${layerName}") (net ${track.netId}))`
    );
  });

  // Vias
  project.vias.forEach((via) => {
    lines.push(
      `  (via (at ${via.positionMm[0]} ${via.positionMm[1]}) (size ${via.padDiameterMm}) (drill ${via.drillDiameterMm}) (layers "F.Cu" "B.Cu") (net ${via.netId}))`
    );
  });

  lines.push(')');
  return lines.join('\n');
}

export function exportToKiCadNetlist(project: PcbProject): string {
  const lines: string[] = [];

  lines.push('(export (version D)');
  lines.push('  (design');
  lines.push(`    (source "${project.name}.sch")`);
  lines.push(`    (date "${new Date().toISOString()}")`);
  lines.push('    (tool "3D Lab PCB Studio Netlist Exporter")');
  lines.push('  )');

  lines.push('  (components');
  project.placedComponents.forEach((comp) => {
    lines.push(`    (comp (ref "${comp.designator}")`);
    lines.push(`      (value "${comp.value}")`);
    lines.push(`      (footprint "${comp.footprintId}")`);
    lines.push('    )');
  });
  lines.push('  )');

  lines.push('  (nets');
  project.nets.forEach((net) => {
    lines.push(`    (net (code ${net.netId}) (name "${net.name}")`);
    project.placedComponents.forEach((comp) => {
      Object.entries(comp.padNetMap).forEach(([padNum, assignedNetId]) => {
        if (assignedNetId === net.netId) {
          lines.push(`      (node (ref "${comp.designator}") (pin "${padNum}"))`);
        }
      });
    });
    lines.push('    )');
  });
  lines.push('  )');
  lines.push(')');

  return lines.join('\n');
}
