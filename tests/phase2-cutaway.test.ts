import test from 'node:test';
import assert from 'node:assert/strict';
import { MOCK_COMPONENTS } from '../data/mock-components';

test('Phase 2 Initial 5 Components Availability & Schema Integrity', () => {
  const targetIds = [
    'pass_res_10k',
    'pass_cap_elec_470u',
    'opto_led_red_5mm',
    'semi_bjt_2n3904',
    'semi_mosfet_2n7000',
  ];

  for (const id of targetIds) {
    const comp = MOCK_COMPONENTS.find((c) => c.id === id);
    assert.ok(comp, `Target component ${id} must exist in mock database`);

    // Verify 3D Model specification
    assert.ok(comp.visual3d, `Component ${id} must have visual3d configuration`);
    assert.ok(comp.visual3d.internalLayers.length >= 2, `Component ${id} must have at least 2 internal layers`);

    // Verify pins
    assert.ok(comp.package.pins.length >= 2, `Component ${id} must have at least 2 pins`);
  }
});

test('Axial Resistor 3D Physical Cutaway Layers', () => {
  const resistor = MOCK_COMPONENTS.find((c) => c.id === 'pass_res_10k');
  assert.ok(resistor, 'Resistor must exist');

  const layerIds = resistor.visual3d.internalLayers.map((l) => l.layerId);

  // Must contain all physical layers required by spec:
  assert.ok(layerIds.includes('lacquer'), 'Resistor must have lacquer casing layer');
  assert.ok(layerIds.includes('spiral'), 'Resistor must have laser-trimmed resistive spiral thin film layer');
  assert.ok(layerIds.includes('core'), 'Resistor must have alumina ceramic core layer');
  assert.ok(layerIds.includes('caps'), 'Resistor must have nickel end caps layer');

  // Verify clippable layers
  const clippableLayers = resistor.visual3d.internalLayers.filter((l) => l.canClip);
  assert.ok(clippableLayers.length >= 3, 'Resistor must have clippable internal layers for cutaways');
});

test('LED 3D Construction & Semiconductor Active Die', () => {
  const led = MOCK_COMPONENTS.find((c) => c.id === 'opto_led_red_5mm');
  assert.ok(led, 'LED must exist');

  const layerIds = led.visual3d.internalLayers.map((l) => l.layerId);
  assert.ok(layerIds.includes('epoxy_lens'), 'LED must have tinted epoxy dome');
  assert.ok(layerIds.includes('cup'), 'LED must have reflector cup leadframe');
  assert.ok(layerIds.includes('die'), 'LED must have semiconductor active die');
  assert.ok(layerIds.includes('wire'), 'LED must have gold bond wire');
});

test('Semiconductor Transistors (BJT & MOSFET) Die & Bond Wires', () => {
  const bjt = MOCK_COMPONENTS.find((c) => c.id === 'semi_bjt_2n3904');
  const mosfet = MOCK_COMPONENTS.find((c) => c.id === 'semi_mosfet_2n7000');

  assert.ok(bjt && mosfet);
  assert.ok(bjt.visual3d.internalLayers.some((l) => l.layerId === 'die'));
  assert.ok(bjt.visual3d.internalLayers.some((l) => l.layerId === 'wirebonds'));

  assert.ok(mosfet.visual3d.internalLayers.some((l) => l.layerId === 'die'));
  assert.ok(mosfet.visual3d.internalLayers.some((l) => l.layerId === 'wires'));
});
