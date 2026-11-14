'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '@/lib/simulation/use-simulation';
import { WorkbenchAudio } from '@/lib/audio/workbench-sounds';

const NUM_PARTICLES = 28;

export function BurnoutSmokeEffect({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const { outputs } = useSimulation();
  const isBurnt = outputs.limits.burnoutTriggered;
  const prevBurntRef = useRef(false);

  // Play audio pop when burnout transitions from false to true
  useEffect(() => {
    if (isBurnt && !prevBurntRef.current) {
      WorkbenchAudio.playBurnoutPop();
    }
    prevBurntRef.current = isBurnt;
  }, [isBurnt]);

  const groupRef = useRef<THREE.Group>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  // Particle simulation state
  const particles = useMemo(() => {
    return Array.from({ length: NUM_PARTICLES }, () => ({
      x: (Math.random() - 0.5) * 1.2,
      y: Math.random() * 3.5,
      z: (Math.random() - 0.5) * 1.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 1.2 + Math.random() * 1.5,
      vz: (Math.random() - 0.5) * 0.4,
      scale: 0.15 + Math.random() * 0.35,
      alpha: Math.random(),
      life: Math.random(),
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!isBurnt || !instancedMeshRef.current) return;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const p = particles[i];
      p.life += delta * 0.7;
      if (p.life > 1.0) {
        // Reset particle at base
        p.life = 0;
        p.x = (Math.random() - 0.5) * 0.8;
        p.y = 0;
        p.z = (Math.random() - 0.5) * 0.8;
        p.scale = 0.15 + Math.random() * 0.25;
      } else {
        // Rise and disperse
        p.y += p.vy * delta;
        p.x += p.vx * delta + Math.sin(p.life * Math.PI * 2) * 0.05;
        p.z += p.vz * delta;
        p.scale += delta * 0.35; // Expands as it cools
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.rotation.set(p.life * 2, p.life * 3, 0);
      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!isBurnt) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Charred Glowing Ember Core */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial
          color="#18181b"
          emissive="#ef4444"
          emissiveIntensity={1.8}
          roughness={0.9}
        />
      </mesh>

      {/* 2. Billowing Smoke Plume Instanced Particles */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, NUM_PARTICLES]}
      >
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#3f3f46"
          transparent
          opacity={0.35}
          roughness={1.0}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
