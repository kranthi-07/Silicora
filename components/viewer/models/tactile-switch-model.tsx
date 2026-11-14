'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorkspaceStore } from '@/lib/store';
import {
  getLayerStyle,
  LayerHighlightEdges,
  computeSeparationTarget,
} from './model-layer-helper';

const targetPosTop = new THREE.Vector3();

export function TactileSwitchModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const topCoverGroupRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 4.5);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (topCoverGroupRef.current) {
      targetPosTop.set(0, separationTarget, 0);
      topCoverGroupRef.current.position.lerp(targetPosTop, speed);
    }
  });

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const actuatorStyle = getLayerStyle('actuator', selectedLayerId);
  const domeStyle = getLayerStyle('contact_dome', selectedLayerId);
  const baseStyle = getLayerStyle('base', selectedLayerId);

  return (
    <group name="TactileSwitch6mmModel" position={[0, 0, 0]}>
      {/* 1. BLACK POM PLUNGER ACTUATOR & STAINLESS STEEL TOP COVER */}
      {isLayerVisible('actuator') && (
        <group
          ref={topCoverGroupRef}
          name="ActuatorLayer"
          position={[0, 0, 0]}
          onPointerDown={(e) => handlePointerDown(e, 'actuator')}
        >
          {/* Top Stainless Steel Retention Cover Plate */}
          <mesh position={[0, 2.0, 0]}>
            <boxGeometry args={[4.6, 0.2, 4.6]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.85}
              roughness={0.25}
              opacity={actuatorStyle.opacity}
              transparent={actuatorStyle.transparent}
            />
            <LayerHighlightEdges isSelected={actuatorStyle.isSelected} />
          </mesh>

          {/* Center Clicky Actuator Button (Black Round Stem) */}
          <mesh position={[0, 2.8, 0]}>
            <cylinderGeometry args={[1.3, 1.3, 1.6, 24]} />
            <meshStandardMaterial
              color="#0f0e14"
              roughness={0.7}
              opacity={actuatorStyle.opacity}
              transparent={actuatorStyle.transparent}
            />
            <LayerHighlightEdges isSelected={actuatorStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 2. STAINLESS STEEL SNAP DOME CONTACT (Internal Layer) */}
      {isLayerVisible('contact_dome') && (
        <group
          name="ContactDomeLayer"
          position={[0, 1.0 + separationTarget * 0.4, 0]}
          onPointerDown={(e) => handlePointerDown(e, 'contact_dome')}
        >
          {/* Clicky Snap Spring Metal Disc */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[1.6, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.15}
              side={THREE.DoubleSide}
              opacity={domeStyle.opacity}
              transparent={domeStyle.transparent}
            />
            <LayerHighlightEdges isSelected={domeStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 3. HEAT-RESISTANT POLYAMIDE BASE & TERMINALS */}
      {isLayerVisible('base') && (
        <group name="BaseLayer" onPointerDown={(e) => handlePointerDown(e, 'base')}>
          {/* Square Black Nylon Housing Body */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[4.8, 2.2, 4.8]} />
            <meshStandardMaterial
              color="#1e1b24"
              roughness={0.8}
              opacity={baseStyle.opacity}
              transparent={baseStyle.transparent}
            />
            <LayerHighlightEdges isSelected={baseStyle.isSelected} />
          </mesh>

          {/* Four Gull-wing Through-hole Terminals */}
          {[
            [-2.7, 0, -1.8],
            [-2.7, 0, 1.8],
            [2.7, 0, -1.8],
            [2.7, 0, 1.8],
          ].map((pos, idx) => (
            <mesh key={idx} position={[pos[0], -0.8, pos[2]]}>
              <boxGeometry args={[0.8, 2.2, 0.4]} />
              <meshStandardMaterial
                color="#e2e8f0"
                metalness={0.9}
                roughness={0.2}
                opacity={baseStyle.opacity}
                transparent={baseStyle.transparent}
              />
              <LayerHighlightEdges isSelected={baseStyle.isSelected} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
