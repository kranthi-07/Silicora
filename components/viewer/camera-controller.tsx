'use client';

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useWorkspaceStore, CameraPreset } from '@/lib/store';

// Reusable scratch objects outside render loop (AI_RULES.md Rule 3: Zero allocation in useFrame)
const targetPos = new THREE.Vector3();
const lookAtPos = new THREE.Vector3(0, 0, 0);

export function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useWorkspaceStore((state) => state.cameraPreset);
  const cameraTrigger = useWorkspaceStore((state) => state.cameraTrigger);
  const isTransitioningRef = useRef(false);

  // Compute desired target camera position based on preset
  useEffect(() => {
    switch (cameraPreset) {
      case 'iso':
        targetPos.set(16, 14, 20);
        break;
      case 'front':
        targetPos.set(0, 0, 24);
        break;
      case 'top':
        targetPos.set(0, 26, 0.1);
        break;
      case 'side':
        targetPos.set(24, 0, 0);
        break;
    }
    isTransitioningRef.current = true;
  }, [cameraPreset, cameraTrigger]);

  useFrame((_, delta) => {
    if (!isTransitioningRef.current) return;

    // Smooth lerp camera position
    const step = Math.min(delta * 6, 0.15);
    camera.position.lerp(targetPos, step);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookAtPos, step);
      controlsRef.current.update();
    }

    // Stop transitioning when close enough
    if (camera.position.distanceTo(targetPos) < 0.08) {
      camera.position.copy(targetPos);
      isTransitioningRef.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={60}
      target={[0, 0, 0]}
    />
  );
}
