import test from 'node:test';
import assert from 'node:assert/strict';
import { CIRCUIT_PRESETS } from '../lib/circuit/circuit-presets';
import { convertCircuitToPcbProject, calculateRatsnest } from '../lib/pcb/circuit-to-pcb-adapter';
import { FOOTPRINT_LIBRARY, getFootprint, mapComponentKindToFootprintId } from '../lib/pcb/footprint-library';
import { runDesignRuleCheck } from '../lib/pcb/pcb-drc';
import { exportToKiCadPcb, exportToKiCadNetlist } from '../lib/pcb/kicad-adapter';
import { generateGerberPackage } from '../lib/pcb/gerber-exporter';
import { PcbProject } from '../types/pcb';

test('Phase 6: PCB Studio — Comprehensive Integration Tests', async (t) => {
  // 1. Footprint Library Integrity
  await t.test('Footprint library contains standard IPC footprints with drill and silkscreen data', () => {
    const rFootprint = FOOTPRINT_LIBRARY['R_Axial_DIN0207_P10.16mm'];
    assert.ok(rFootprint, 'Axial resistor footprint exists');
    assert.equal(rFootprint.pads.length, 2);
    assert.equal(rFootprint.pads[0].drillMm, 0.8);
    assert.equal(rFootprint.pads[0].offsetMm[0], -5.08);
    assert.equal(rFootprint.pads[1].offsetMm[0], 5.08);

    const ledFootprint = FOOTPRINT_LIBRARY['LED_D5.0mm_P2.54mm'];
    assert.ok(ledFootprint, '5mm LED footprint exists');
    assert.equal(ledFootprint.pads.length, 2);
    assert.equal(ledFootprint.pads[0].offsetMm[0], -1.27);
    assert.equal(ledFootprint.pads[1].offsetMm[0], 1.27);

    const to92Footprint = FOOTPRINT_LIBRARY['TO-92_Inline_P1.27mm'];
    assert.ok(to92Footprint, 'TO-92 footprint exists');
    assert.equal(to92Footprint.pads.length, 3);
  });

  // 2. Circuit-to-PCB Conversion & Component Identity Preservation
  await t.test('Preserves component identity and resolves electrical nets', () => {
    const ledPreset = CIRCUIT_PRESETS.find((p) => p.id === 'exp_led_resistor');
    assert.ok(ledPreset, 'LED resistor preset found');

    const pcbProject = convertCircuitToPcbProject(ledPreset.components, ledPreset.wires, {
      name: 'LED_Driver_Board',
      boardWidthMm: 60,
      boardHeightMm: 45,
    });

    assert.equal(pcbProject.name, 'LED_Driver_Board');
    assert.equal(pcbProject.boardOutline.widthMm, 60);
    assert.equal(pcbProject.boardOutline.heightMm, 45);

    // Check component identity preservation
    ledPreset.components
      .filter((c) => c.kind !== 'ground')
      .forEach((circuitComp) => {
        const placed = pcbProject.placedComponents.find((p) => p.id === circuitComp.id);
        assert.ok(placed, `Component identity preserved for ${circuitComp.id}`);
        assert.ok(placed.designator.length > 0, 'Has valid reference designator');
        assert.ok(Object.keys(placed.padNetMap).length > 0, 'Pads are mapped to nets');
      });

    // Check nets resolution: Should have VCC and GND
    const vccNet = pcbProject.nets.find((n) => n.isPower || n.name.includes('VCC'));
    const gndNet = pcbProject.nets.find((n) => n.isGround || n.name.includes('GND'));
    assert.ok(vccNet, 'VCC net resolved');
    assert.ok(gndNet, 'GND net resolved');

    // Check initial routed tracks
    assert.ok(pcbProject.tracks.length > 0, 'Auto-generates initial routed tracks');
  });

  // 3. Ratsnest Calculation
  await t.test('Calculates ratsnest airwires correctly', () => {
    const preset = CIRCUIT_PRESETS.find((p) => p.id === 'exp_series_resistors') || CIRCUIT_PRESETS[0];
    const pcbProject = convertCircuitToPcbProject(preset.components, preset.wires);

    const airwires = calculateRatsnest(pcbProject);
    assert.ok(Array.isArray(airwires));
    airwires.forEach((air) => {
      assert.ok(air.netId > 0);
      assert.ok(air.lengthMm >= 0);
      assert.equal(air.startMm.length, 2);
      assert.equal(air.endMm.length, 2);
    });
  });

  // 4. Design Rule Checking (DRC)
  await t.test('DRC validates trace widths, edge clearances, and flags violations', () => {
    const preset = CIRCUIT_PRESETS[0];
    const pcbProject = convertCircuitToPcbProject(preset.components, preset.wires);

    // Initial project should pass or have only warnings
    const initialDrc = runDesignRuleCheck(pcbProject);
    assert.equal(initialDrc.errorCount, 0, 'Clean generated board has 0 DRC errors');

    // Inject narrow trace violation (< 0.25mm)
    const corruptedProject: PcbProject = {
      ...pcbProject,
      tracks: [
        ...pcbProject.tracks,
        {
          id: 'bad_track',
          netId: 1,
          layer: 'F_Cu',
          startMm: [10, 10],
          endMm: [20, 10],
          widthMm: 0.15, // Violates 0.25mm min
        },
      ],
    };

    const violatedDrc = runDesignRuleCheck(corruptedProject);
    assert.equal(violatedDrc.passed, false, 'DRC fails on narrow trace');
    assert.ok(violatedDrc.violations.some((v) => v.rule === 'trace_width'));

    // Inject edge violation (< 0.5mm from board edge)
    const edgeViolationProject: PcbProject = {
      ...pcbProject,
      tracks: [
        ...pcbProject.tracks,
        {
          id: 'edge_track',
          netId: 1,
          layer: 'F_Cu',
          startMm: [0.1, 10], // Near left edge (0.1mm < 0.5mm)
          endMm: [0.1, 20],
          widthMm: 0.35,
        },
      ],
    };

    const edgeDrc = runDesignRuleCheck(edgeViolationProject);
    assert.equal(edgeDrc.passed, false, 'DRC fails on edge violation');
    assert.ok(edgeDrc.violations.some((v) => v.rule === 'edge_violation'));
  });

  // 5. KiCad S-Expression Adapter
  await t.test('Exports valid KiCad 7/8 .kicad_pcb S-expressions and .net netlist', () => {
    const preset = CIRCUIT_PRESETS[1];
    const pcbProject = convertCircuitToPcbProject(preset.components, preset.wires, {
      name: 'KiCad_Test_Board',
    });

    const kicadPcb = exportToKiCadPcb(pcbProject);
    assert.ok(kicadPcb.startsWith('(kicad_pcb (version 20221018)'));
    assert.ok(kicadPcb.includes('(layers'));
    assert.ok(kicadPcb.includes('(net 1 '));
    assert.ok(kicadPcb.includes('(gr_line (start 0 0)'));
    assert.ok(kicadPcb.includes('(footprint '));
    assert.ok(kicadPcb.includes('(segment '));
    assert.ok(kicadPcb.endsWith(')'));

    const netlist = exportToKiCadNetlist(pcbProject);
    assert.ok(netlist.startsWith('(export (version D)'));
    assert.ok(netlist.includes('(components'));
    assert.ok(netlist.includes('(nets'));
  });

  // 6. RS-274X Gerber & Excellon Drill Package
  await t.test('Generates full RS-274X Gerber and Excellon drill package', () => {
    const preset = CIRCUIT_PRESETS[0];
    const pcbProject = convertCircuitToPcbProject(preset.components, preset.wires);

    const packageFiles = generateGerberPackage(pcbProject);

    // Verify all 7 standard manufacturing files are present
    assert.ok(packageFiles['Top_Copper.gtl'], 'Top copper exists');
    assert.ok(packageFiles['Bottom_Copper.gbl'], 'Bottom copper exists');
    assert.ok(packageFiles['Top_Silkscreen.gto'], 'Top silkscreen exists');
    assert.ok(packageFiles['Top_Soldermask.gts'], 'Top soldermask exists');
    assert.ok(packageFiles['Bottom_Soldermask.gbs'], 'Bottom soldermask exists');
    assert.ok(packageFiles['Board_Outline.gko'], 'Edge cuts exists');
    assert.ok(packageFiles['Plated_Drill.drl'], 'Excellon drill exists');

    // Verify RS-274X compliance headers
    assert.ok(packageFiles['Top_Copper.gtl'].includes('%FSLAX46Y46*%'));
    assert.ok(packageFiles['Top_Copper.gtl'].includes('%MOMM*%'));
    assert.ok(packageFiles['Top_Copper.gtl'].includes('%ADD10C,'));
    assert.ok(packageFiles['Top_Copper.gtl'].includes('M02*'));

    // Verify Excellon drill header
    assert.ok(packageFiles['Plated_Drill.drl'].includes('M48'));
    assert.ok(packageFiles['Plated_Drill.drl'].includes('METRIC,TZ'));
    assert.ok(packageFiles['Plated_Drill.drl'].includes('M30'));
  });
});
