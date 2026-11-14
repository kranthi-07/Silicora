'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useCircuitStore } from '@/lib/circuit/circuit-store';
import { generateBreadboardHoles } from '@/lib/circuit/breadboard-topology';

function SingleProbe3D({
  color,
  position,
  label,
}: {
  color: string;
  position: [number, number, number];
  label: string;
}) {
  return (
    <group position={position}>
      {/* 1. Metallic Needle Contact Tip (resting on contact point) */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.3, 2.4, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 2. Insulated Fluke-Style Probe Body (angled up for realistic probe stance) */}
      <mesh position={[0, 5.0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 5.5, 24]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* 3. Ergonomic Textured Finger Grip Guard */}
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.6, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* 4. Flexible Cable Tail exiting top */}
      <mesh position={[0, 8.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 1.8, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* 5. Glowing Contact Point Indicator */}
      <mesh position={[0, 0.1, 0]}>
        <ringGeometry args={[0.4, 0.8, 24]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function CircuitMultimeterProbes3D() {
  const { dmm, components } = useCircuitStore();
  const holes = useMemo(() => generateBreadboardHoles(), []);

  // Compute 3D target for a probe target (component pin or breadboard bus)
  const getProbePosition = (
    compId?: string,
    pinId?: string
  ): [number, number, number] | null => {
    if (!compId) return null;

    if (compId === 'BREADBOARD' && pinId) {
      // Find representative hole for this busId
      const hole = holes.find((h) => h.busId === pinId);
      if (hole) {
        return [hole.x, 0.2, hole.z];
      }
    } else {
      // Attached to a circuit component pin
      const comp = components.find((c) => c.id === compId);
      if (comp) {
        const pin = comp.pins.find((p) => p.pinId === pinId) || comp.pins[0];
        if (pin) {
          return [
            comp.position[0] + pin.offsetMm[0],
            comp.position[1] + pin.offsetMm[1] + 0.5,
            comp.position[2] + pin.offsetMm[2],
          ];
        }
        return [comp.position[0], comp.position[1] + 1.0, comp.position[2]];
      }
    }
    return null;
  };

  const redPos = getProbePosition(dmm.redProbe.componentId, dmm.redProbe.pinId);
  const blackPos = getProbePosition(dmm.blackProbe.componentId, dmm.blackProbe.pinId);

  return (
    <group name="3D_Multimeter_Probes">
      {redPos && (
        <SingleProbe3D
          color="#ef4444"
          position={redPos}
          label="+"
        />
      )}
      {blackPos && (
        <SingleProbe3D
          color="#1e293b"
          position={blackPos}
          label="COM"
        />
      )}
    </group>
  );
}
