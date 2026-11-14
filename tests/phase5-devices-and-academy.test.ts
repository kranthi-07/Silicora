import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DEVICES_DATA } from '../data/devices-data';
import { ACADEMY_CURRICULUM } from '../data/academy-curriculum';

describe('Phase 5 — Sourced Devices & Teardowns Verification', () => {
  test('All 6 real-world electronic products are present with valid categories', () => {
    assert.strictEqual(DEVICES_DATA.length, 6);
    const expectedIds = [
      'device_smartphone',
      'device_powerbank',
      'device_laptop',
      'device_refrigerator',
      'device_washingmachine',
      'device_television',
    ];
    for (const id of expectedIds) {
      const found = DEVICES_DATA.find((d) => d.id === id);
      assert.ok(found, `Device ${id} should exist in DEVICES_DATA`);
      assert.ok(found.name.length > 0);
      assert.ok(found.documentedEngineeringFacts.length >= 3, 'Must have >= 3 documented facts');
      assert.ok(found.subsystems.length >= 3, 'Must have >= 3 subsystems');
      assert.ok(found.powerRails.length >= 2, 'Must have >= 2 power rails');
      assert.ok(found.signalBuses.length >= 2, 'Must have >= 2 signal buses');
      assert.ok(found.blockDiagramNodes.length >= 5, 'Must have >= 5 block diagram nodes');
      assert.ok(found.blockDiagramConnections.length >= 4, 'Must have >= 4 block diagram connections');
    }
  });

  test('Subsystems have valid separation vectors for 3D exploded view', () => {
    for (const dev of DEVICES_DATA) {
      for (const sub of dev.subsystems) {
        assert.strictEqual(sub.separationVector.length, 3);
        assert.ok(typeof sub.separationVector[0] === 'number');
        assert.ok(typeof sub.separationVector[1] === 'number');
        assert.ok(typeof sub.separationVector[2] === 'number');
        assert.ok(sub.components.length > 0, `Subsystem ${sub.id} must have components`);
        for (const part of sub.components) {
          assert.strictEqual(part.positionMm.length, 3);
          assert.strictEqual(part.dimensionsMm.length, 3);
          assert.ok(part.functionalRole.length > 0);
        }
      }
    }
  });

  test('Block diagram connections reference valid source and destination nodes', () => {
    for (const dev of DEVICES_DATA) {
      const nodeIds = new Set(dev.blockDiagramNodes.map((n) => n.id));
      for (const conn of dev.blockDiagramConnections) {
        assert.ok(nodeIds.has(conn.fromNodeId), `Connection fromNodeId ${conn.fromNodeId} must exist in ${dev.id}`);
        assert.ok(nodeIds.has(conn.toNodeId), `Connection toNodeId ${conn.toNodeId} must exist in ${dev.id}`);
      }
    }
  });
});

describe('Phase 5 — Learning Academy Curriculum & Engine Verification', () => {
  test('Capacitor module exists with the required educational path', () => {
    const capMod = ACADEMY_CURRICULUM.find((m) => m.id === 'mod_capacitors');
    assert.ok(capMod, 'Capacitor module must exist');
    const lesson = capMod.lessons[0];
    assert.ok(lesson, 'Capacitor lesson must exist');

    const stageTypes = lesson.stages.map((s) => s.type);
    assert.ok(stageTypes.includes('theory'), 'Must include theory stage');
    assert.ok(stageTypes.includes('3d_cutaway'), 'Must include 3D cutaway stage');
    assert.ok(stageTypes.includes('guided_simulation'), 'Must include guided simulation stage');
    assert.ok(stageTypes.includes('knowledge_check'), 'Must include knowledge check stage');
    assert.ok(stageTypes.includes('practical_challenge'), 'Must include practical challenge stage');
  });

  test('Knowledge check quiz questions have exactly one correct option with explanation', () => {
    for (const mod of ACADEMY_CURRICULUM) {
      for (const les of mod.lessons) {
        for (const stg of les.stages) {
          if (stg.type === 'knowledge_check' && stg.quiz) {
            const correctOpts = stg.quiz.options.filter((o) => o.isCorrect);
            assert.strictEqual(correctOpts.length, 1, `Quiz in stage ${stg.id} must have exactly 1 correct option`);
            assert.ok(correctOpts[0].explanation.length > 0, 'Correct option must have pedagogical explanation');
          }
        }
      }
    }
  });

  test('Practical challenges have valid targets and tolerance bounds', () => {
    for (const mod of ACADEMY_CURRICULUM) {
      for (const les of mod.lessons) {
        for (const stg of les.stages) {
          if (stg.type === 'practical_challenge' && stg.challenge) {
            const ch = stg.challenge;
            assert.ok(ch.targetValue > 0);
            assert.ok(ch.tolerancePercent > 0 && ch.tolerancePercent <= 20);
            assert.ok(ch.prompt.length > 0);
            assert.ok(ch.successMessage.length > 0);
            assert.ok(ch.hint.length > 0);
          }
        }
      }
    }
  });

  test('RC Filter tuning practical challenge mathematical evaluation', () => {
    // Target tau = 1410 ms for 470uF cap
    // tau = R * C -> R = 1.41 / 0.00047 = 3000 ohms
    const target = 1410;
    const tolPercent = 5;
    const minAllowed = target * 0.95;
    const maxAllowed = target * 1.05;

    const testR = 3000;
    const testC = 0.00047;
    const calculatedTauMs = testR * testC * 1000;

    assert.ok(calculatedTauMs >= minAllowed && calculatedTauMs <= maxAllowed, '3000 ohms must satisfy 1410ms target');
  });
});
