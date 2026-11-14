'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useCircuitStore } from '@/lib/circuit/circuit-store';

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const raycaster = new THREE.Raycaster();
const mousePos = new THREE.Vector2();
const targetIntersection = new THREE.Vector3();

export function DraftingWire3D() {
  const { wireDraftStart, activeWireColor } = useCircuitStore();
  const lineRef = useRef<THREE.Line>(null);
  const { camera, pointer } = useThree();

  useFrame(() => {
    if (!wireDraftStart || !lineRef.current) return;

    mousePos.set(pointer.x, pointer.y);
    raycaster.setFromCamera(mousePos, camera);
    const intersects = raycaster.ray.intersectPlane(plane, targetIntersection);

    if (intersects) {
      const positions = lineRef.current.geometry.attributes.position.array as Float32Array;
      // Start point
      positions[0] = wireDraftStart.worldPosition[0];
      positions[1] = wireDraftStart.worldPosition[1];
      positions[2] = wireDraftStart.worldPosition[2];

      // Mid point arch
      const midX = (wireDraftStart.worldPosition[0] + targetIntersection.x) / 2;
      const midZ = (wireDraftStart.worldPosition[2] + targetIntersection.z) / 2;
      positions[3] = midX;
      positions[4] = Math.max(wireDraftStart.worldPosition[1], 1.0) + 6.0;
      positions[5] = midZ;

      // End point (cursor)
      positions[6] = targetIntersection.x;
      positions[7] = targetIntersection.y + 1.0;
      positions[8] = targetIntersection.z;

      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!wireDraftStart) return null;

  const initialPoints = new Float32Array(9);

  return (
    <line ref={lineRef as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPoints, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={activeWireColor} linewidth={3} />
    </line>
  );
}
