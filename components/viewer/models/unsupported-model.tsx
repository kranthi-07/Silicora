'use client';

import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useWorkspaceStore } from '@/lib/store';

export function UnsupportedModel() {
  const selectedComponent = useWorkspaceStore((state) => state.selectedComponent);

  const dim = selectedComponent?.package.dimensionsMm || { widthMm: 8, heightMm: 5, depthMm: 8 };
  const w = Math.max(4, dim.widthMm);
  const h = Math.max(3, dim.heightMm);
  const d = Math.max(4, dim.depthMm);

  return (
    <group name="UnsupportedComponentFallback" position={[0, 0, 0]}>
      {/* Engineering Wireframe Bounding Box */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      <lineSegments position={[0, h / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color="#38bdf8" linewidth={1.5} />
      </lineSegments>

      {/* Floating 3D Text Badge */}
      <group position={[0, h + 2.5, 0]}>
        <Text
          fontSize={0.8}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {selectedComponent?.package.standardCode || 'STANDARD PACKAGE'}
        </Text>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.5}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Procedural 3D Cutaway in Development
        </Text>
      </group>
    </group>
  );
}
