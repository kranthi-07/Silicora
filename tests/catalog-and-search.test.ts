import test from 'node:test';
import assert from 'node:assert/strict';
import { MOCK_COMPONENTS } from '../data/mock-components';

test('Component Schema 3DCS-1 Compliance', () => {
  assert.ok(MOCK_COMPONENTS.length >= 6, 'Must provide at least 6 core engineering components');

  for (const comp of MOCK_COMPONENTS) {
    // 1. Identification
    assert.ok(comp.id, `Component missing ID`);
    assert.ok(comp.slug, `Component ${comp.id} missing slug`);
    assert.ok(comp.name, `Component ${comp.id} missing display name`);
    assert.ok(comp.category, `Component ${comp.id} missing category`);

    // 2. Physical Package
    assert.ok(comp.package.standardCode, `Component ${comp.id} missing package code`);
    assert.ok(
      ['through_hole', 'smd', 'chassis', 'terminal'].includes(comp.package.mounting),
      `Invalid mounting on ${comp.id}`
    );
    assert.ok(comp.package.dimensionsMm.widthMm > 0, `Invalid widthMm on ${comp.id}`);
    assert.ok(comp.package.pins.length > 0, `No pins defined on ${comp.id}`);

    for (const pin of comp.package.pins) {
      assert.ok(typeof pin.pinNumber === 'number', `Pin number invalid on ${comp.id}`);
      assert.ok(pin.name, `Pin name missing on ${comp.id}`);
      assert.ok(pin.positionMm, `Position missing for pin ${pin.name} on ${comp.id}`);
    }

    // 3. Electrical SPICE
    assert.ok(comp.electrical.spicePrefix, `Spice prefix missing on ${comp.id}`);
    assert.ok(comp.electrical.netlistTemplate, `Netlist template missing on ${comp.id}`);
    assert.ok(comp.electrical.ratings.maxVoltageV > 0, `maxVoltageV invalid on ${comp.id}`);
    assert.ok(
      comp.electrical.ratings.maxPowerDissipationW > 0,
      `maxPowerDissipationW invalid on ${comp.id}`
    );
    assert.ok(comp.electrical.rawSpiceModel.length > 0, `rawSpiceModel missing on ${comp.id}`);

    // 4. Cutaway Layers
    assert.ok(
      comp.visual3d.internalLayers.length >= 2,
      `Component ${comp.id} should have >= 2 cutaway layers`
    );
    for (const layer of comp.visual3d.internalLayers) {
      assert.ok(layer.layerId, `Layer missing layerId on ${comp.id}`);
      assert.ok(layer.displayName, `Layer missing displayName on ${comp.id}`);
      assert.ok(layer.meshNodeName, `Layer missing meshNodeName on ${comp.id}`);
    }

    // 5. Pedagogical Data
    assert.ok(comp.educational.tagline, `Tagline missing on ${comp.id}`);
    assert.ok(
      comp.educational.physicalOperatingPrinciple,
      `Physical principle missing on ${comp.id}`
    );
    assert.ok(
      comp.educational.commonFailureModes.length > 0,
      `Failure modes missing on ${comp.id}`
    );
  }
});

test('Category Filtering Logic', () => {
  const passives = MOCK_COMPONENTS.filter((c) => c.category === 'passive');
  assert.ok(passives.length >= 3, 'Must have at least 3 passives (R, C, L)');
  assert.ok(passives.every((c) => c.category === 'passive'));

  const discretes = MOCK_COMPONENTS.filter(
    (c) => c.category === 'discrete_semiconductor'
  );
  assert.ok(
    discretes.some((c) => c.name.includes('2N3904')),
    'Discretes must contain 2N3904 BJT'
  );
  assert.ok(
    discretes.some((c) => c.name.includes('2N7000')),
    'Discretes must contain 2N7000 MOSFET'
  );

  const ics = MOCK_COMPONENTS.filter((c) => c.category === 'integrated_circuit');
  assert.ok(
    ics.some((c) => c.name.includes('NE555')),
    'ICs must contain NE555 Timer'
  );
});

test('Search Query Multi-field Matching', () => {
  const search = (query: string) => {
    const q = query.toLowerCase().trim();
    return MOCK_COMPONENTS.filter((comp) => {
      const matchesName = comp.name.toLowerCase().includes(q);
      const matchesSlug = comp.slug.toLowerCase().includes(q);
      const matchesCode = comp.package.standardCode.toLowerCase().includes(q);
      const matchesTag = comp.tags.some((t) => t.toLowerCase().includes(q));
      const matchesSummary = comp.educational.summary.toLowerCase().includes(q);
      const matchesPrinciple = comp.educational.physicalOperatingPrinciple
        .toLowerCase()
        .includes(q);
      return (
        matchesName ||
        matchesSlug ||
        matchesCode ||
        matchesTag ||
        matchesSummary ||
        matchesPrinciple
      );
    });
  };

  // Search by exact part number
  assert.equal(search('2N3904').length, 1);
  assert.equal(search('2N3904')[0].id, 'semi_bjt_2n3904');

  // Search by package code
  const dip8Parts = search('DIP-8');
  assert.ok(dip8Parts.length >= 2, 'Should find at least 2 DIP-8 parts (NE555, LM358)');

  // Search by physics / tags
  const timerParts = search('oscillator');
  assert.ok(timerParts.some((p) => p.id === 'ic_timer_ne555'));

  const diodeParts = search('photon');
  assert.ok(diodeParts.some((p) => p.id === 'opto_led_red_5mm'));

  // Search non-existent
  assert.equal(search('xyznonexistentpart9999').length, 0);
});

test('Mounting Type Filtering', () => {
  const thtParts = MOCK_COMPONENTS.filter(
    (c) => c.package.mounting === 'through_hole'
  );
  assert.ok(thtParts.length > 0);
  assert.ok(thtParts.every((c) => c.package.mounting === 'through_hole'));
});
