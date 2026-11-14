'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { WireConnection } from '@/lib/circuit/types';
import { useCircuitStore } from '@/lib/circuit/circuit-store';
import { getHolePositionMm } from '@/lib/circuit/breadboard-topology';

interface CircuitWire3DProps {
  wire: WireConnection;
}

const tempDummy = new THREE.Object3D();
const NUM_WIRE_ELECTRONS = 8;

export function CircuitWire3D({ wire }: CircuitWire3DProps) {
  const { components, selectedId, selectedType, setSelected, removeWire, solvedState } =
    useCircuitStore();

  const electronsRef = useRef<THREE.InstancedMesh>(null);
  const particleOffsets = useRef<number[]>(
    Array.from({ length: NUM_WIRE_ELECTRONS }, (_, i) => i / NUM_WIRE_ELECTRONS)
  );

  const isSelected = selectedId === wire.id && selectedType === 'wire';

  // Compute world coordinates of the two endpoints
  const { startPos, endPos } = useMemo(() => {
    let p1 = new THREE.Vector3(0, 0, 0);
    let p2 = new THREE.Vector3(10, 0, 0);

    // 1. Resolve start endpoint
    if (wire.fromComponentId === 'BREADBOARD') {
      // Breadboard spring clip bus
      p1.set(0, 1.0, 0);
    } else {
      const comp1 = components.find((c) => c.id === wire.fromComponentId);
      if (comp1) {
        const pin1 = comp1.pins.find((p) => p.pinId === wire.fromPinId);
        const offset = pin1 ? pin1.offsetMm : [0, 0, 0];
        // Apply component rotation around Y
        const rotY = comp1.rotation[1];
        const rotX = offset[0] * Math.cos(rotY) - offset[2] * Math.sin(rotY);
        const rotZ = offset[0] * Math.sin(rotY) + offset[2] * Math.cos(rotY);
        p1.set(comp1.position[0] + rotX, comp1.position[1] + offset[1], comp1.position[2] + rotZ);
      }
    }

    // 2. Resolve end endpoint
    if (wire.toComponentId === 'BREADBOARD') {
      p2.set(10, 1.0, 0);
    } else {
      const comp2 = components.find((c) => c.id === wire.toComponentId);
      if (comp2) {
        const pin2 = comp2.pins.find((p) => p.pinId === wire.toPinId);
        const offset = pin2 ? pin2.offsetMm : [0, 0, 0];
        const rotY = comp2.rotation[1];
        const rotX = offset[0] * Math.cos(rotY) - offset[2] * Math.sin(rotY);
        const rotZ = offset[0] * Math.sin(rotY) + offset[2] * Math.cos(rotY);
        p2.set(comp2.position[0] + rotX, comp2.position[1] + offset[1], comp2.position[2] + rotZ);
      }
    }

    return { startPos: p1, endPos: p2 };
  }, [components, wire]);

  // Generate 3D curved wire geometry (Catenary spline)
  const { tubeGeometry, curve } = useMemo(() => {
    const dist = startPos.distanceTo(endPos);
    const midX = (startPos.x + endPos.x) / 2;
    const midZ = (startPos.z + endPos.z) / 2;
    // Arch upward or sag naturally
    const archY = Math.max(startPos.y, endPos.y) + Math.min(15, Math.max(4, dist * 0.28));

    const ctrl1 = new THREE.Vector3(
      startPos.x + (midX - startPos.x) * 0.5,
      archY,
      startPos.z + (midZ - startPos.z) * 0.5
    );
    const ctrl2 = new THREE.Vector3(
      endPos.x + (midX - endPos.x) * 0.5,
      archY,
      endPos.z + (midZ - endPos.z) * 0.5
    );

    const c = new THREE.CubicBezierCurve3(startPos, ctrl1, ctrl2, endPos);
    const geo = new THREE.TubeGeometry(c, 36, 0.45, 8, false);
    return { tubeGeometry: geo, curve: c };
  }, [startPos, endPos]);

  // Branch current for flowing electrons
  const current = solvedState.branchCurrents[wire.fromComponentId] || 0;

  // Frame loop: animate electron drift along wire curve
  useFrame((_, delta) => {
    if (Math.abs(current) > 1e-4 && electronsRef.current && curve) {
      const speed = Math.min(2.0, Math.abs(current) * 80) * delta;
      for (let i = 0; i < NUM_WIRE_ELECTRONS; i++) {
        let p = (particleOffsets.current[i] + speed) % 1.0;
        particleOffsets.current[i] = p;

        const pt = curve.getPoint(p);
        tempDummy.position.copy(pt);
        tempDummy.scale.set(0.18, 0.18, 0.18);
        tempDummy.updateMatrix();
        electronsRef.current.setMatrixAt(i, tempDummy.matrix);
      }
      electronsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group
      name={`Wire_${wire.id}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(wire.id, 'wire');
      }}
    >
      {/* Insulated Flexible Wire Mesh */}
      <mesh geometry={tubeGeometry} castShadow>
        <meshStandardMaterial
          color={wire.color}
          roughness={0.35}
          metalness={0.1}
          emissive={isSelected ? '#00f0ff' : '#000000'}
          emissiveIntensity={isSelected ? 0.7 : 0}
        />
      </mesh>

      {/* Tinned Stripped Metal Core End Ferrules */}
      <mesh position={[startPos.x, startPos.y, startPos.z]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[endPos.x, endPos.y, endPos.z]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Electron Flow Particles along Wire */}
      {Math.abs(current) > 1e-4 && (
        <instancedMesh
          ref={electronsRef}
          args={[undefined, undefined, NUM_WIRE_ELECTRONS]}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color="#00f0ff" />
        </instancedMesh>
      )}
    </group>
  );
}
