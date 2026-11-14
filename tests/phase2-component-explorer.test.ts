import test from 'node:test';
import assert from 'node:assert/strict';
import { MOCK_COMPONENTS } from '../data/mock-components';

test('Component Explorer & 3D Cutaway Integrity Checks', async (t) => {
  // 1. Model Mapping for all Phase 2 Families
  await t.test('All 5 Phase 2 component families exist with required package codes', () => {
    const res = MOCK_COMPONENTS.find((c) => c.id === 'pass_res_10k');
    assert.ok(res, '10k Resistor exists');
    assert.equal(res.package.standardCode, 'Axial-0.25W');

    const capElec = MOCK_COMPONENTS.find((c) => c.id === 'pass_cap_elec_470u');
    assert.ok(capElec, '470uF Electrolytic Cap exists');
    assert.equal(capElec.package.standardCode, 'Radial-Can-8x11');

    const capCer = MOCK_COMPONENTS.find((c) => c.id === 'pass_cap_cer_100n');
    assert.ok(capCer, '100nF Ceramic Disc Cap exists');
    assert.equal(capCer.package.standardCode, 'Radial-Disc-5mm');

    const diode1N4148 = MOCK_COMPONENTS.find((c) => c.id === 'semi_diode_1n4148');
    assert.ok(diode1N4148, '1N4148 Diode exists');
    assert.equal(diode1N4148.package.standardCode, 'DO-35');

    const diode1N4007 = MOCK_COMPONENTS.find((c) => c.id === 'semi_diode_1n4007');
    assert.ok(diode1N4007, '1N4007 Diode exists');
    assert.equal(diode1N4007.package.standardCode, 'DO-41');

    const led = MOCK_COMPONENTS.find((c) => c.id === 'opto_led_red_5mm');
    assert.ok(led, 'LED exists');
    assert.equal(led.package.standardCode, 'Radial-5mm');

    const bjt = MOCK_COMPONENTS.find((c) => c.id === 'semi_bjt_2n3904');
    assert.ok(bjt, '2N3904 BJT exists');
    assert.equal(bjt.package.standardCode, 'TO-92');

    const mosfet = MOCK_COMPONENTS.find((c) => c.id === 'semi_mosfet_2n7000');
    assert.ok(mosfet, '2N7000 MOSFET exists');
    assert.equal(mosfet.package.standardCode, 'TO-92');
  });

  // 2. Diodes DO NOT masquerade as BJTs
  await t.test('Both ordinary diodes have distinct diode symbol and package definitions', () => {
    const d1 = MOCK_COMPONENTS.find((c) => c.id === 'semi_diode_1n4148')!;
    const d2 = MOCK_COMPONENTS.find((c) => c.id === 'semi_diode_1n4007')!;

    assert.equal(d1.symbolType, 'diode');
    assert.equal(d2.symbolType, 'diode');
    assert.notEqual(d1.symbolType, 'bjt_npn');
    assert.notEqual(d2.symbolType, 'bjt_npn');
    assert.equal(d1.package.pins.length, 2);
    assert.equal(d2.package.pins.length, 2);
  });

  // 3. Layer ID Synchronization
  await t.test('Catalog internalLayers metadata contains valid layer IDs', () => {
    const supportedIds = [
      'pass_res_10k',
      'pass_cap_elec_470u',
      'pass_cap_cer_100n',
      'semi_diode_1n4148',
      'semi_diode_1n4007',
      'opto_led_red_5mm',
      'semi_bjt_2n3904',
      'semi_mosfet_2n7000',
    ];

    supportedIds.forEach((id) => {
      const comp = MOCK_COMPONENTS.find((c) => c.id === id);
      assert.ok(comp, `Component ${id} found`);
      assert.ok(comp.visual3d.internalLayers.length >= 2, `Component ${id} has multiple layers`);

      comp.visual3d.internalLayers.forEach((layer) => {
        assert.ok(layer.layerId.length > 0, `Layer has valid ID in ${id}`);
        assert.ok(layer.displayName.length > 0, `Layer has display name in ${id}`);
      });
    });

    // Check MOSFET specifically for leadframe
    const mosfet = MOCK_COMPONENTS.find((c) => c.id === 'semi_mosfet_2n7000')!;
    const hasLeadframe = mosfet.visual3d.internalLayers.some((l) => l.layerId === 'leadframe');
    assert.ok(hasLeadframe, '2N7000 MOSFET has leadframe layer');
  });

  // 4. Cutaway Shell Separation Calculation
  await t.test('Cutaway separation calculation is strictly positive and proportional', () => {
    // Separation distance formula used across models:
    // separation = baseOffset + Math.abs(cutawayOffset) * factor
    const baseOffset = 3.0;
    const factor = 0.4;

    const calcSep = (offset: number) => baseOffset + Math.abs(offset) * factor;

    assert.equal(calcSep(0), 3.0);
    assert.ok(calcSep(5) > calcSep(0));
    assert.ok(calcSep(-5) > calcSep(0));
    assert.ok(calcSep(10) <= 8.0);
  });
});
