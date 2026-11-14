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

const targetPosHousing = new THREE.Vector3();

export function PiezoBuzzerModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const housingGroupRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 5.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (housingGroupRef.current) {
      targetPosHousing.set(0, separationTarget, 0);
      housingGroupRef.current.position.lerp(targetPosHousing, speed);
    }
  });

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const housingStyle = getLayerStyle('housing', selectedLayerId);
  const piezoStyle = getLayerStyle('piezo_disc', selectedLayerId);

  return (
    <group name="PiezoBuzzerModel" position={[0, 0, 0]}>
      {/* 1. PBT ACOUSTIC RESONANCE CHAMBER (Top Shell that lifts up) */}
      {isLayerVisible('housing') && (
        <group
          ref={housingGroupRef}
          name="HousingLayer"
          position={[0, 0, 0]}
          onPointerDown={(e) => handlePointerDown(e, 'housing')}
        >
          {/* Main Cylindrical Shell */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[4.2, 4.2, 2.8, 36, 1, true]} />
            <meshStandardMaterial
              color="#14121a"
              roughness={0.7}
              side={THREE.DoubleSide}
              opacity={housingStyle.opacity}
              transparent={housingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={housingStyle.isSelected} />
          </mesh>

          {/* Top Cap with Sound Hole */}
          <mesh position={[0, 3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 4.2, 36]} />
            <meshStandardMaterial
              color="#14121a"
              roughness={0.7}
              side={THREE.DoubleSide}
              opacity={housingStyle.opacity}
              transparent={housingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={housingStyle.isSelected} />
          </mesh>

          {/* Polarity (+) Indicator Mark */}
          <mesh position={[2.6, 3.22, 0]}>
            <planeGeometry args={[0.6, 0.6]} />
            <meshStandardMaterial
              color="#ef4444"
              opacity={housingStyle.opacity}
              transparent={housingStyle.transparent}
            />
          </mesh>
        </group>
      )}

      {/* 2. PIEZOELECTRIC CERAMIC BRASS DISC (Internal Layer) */}
      {isLayerVisible('piezo_disc') && (
        <group
          name="PiezoDiscLayer"
          position={[0, 0.4 + separationTarget * 0.3, 0]}
          onPointerDown={(e) => handlePointerDown(e, 'piezo_disc')}
        >
          {/* Brass Substrate Resonator Disc */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[3.8, 3.8, 0.15, 36]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.85}
              roughness={0.25}
              opacity={piezoStyle.opacity}
              transparent={piezoStyle.transparent}
            />
            <LayerHighlightEdges isSelected={piezoStyle.isSelected} />
          </mesh>

          {/* Lead Zirconate Titanate (PZT) Silver/Ceramic Patch */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 0.08, 32]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.7}
              roughness={0.3}
              opacity={piezoStyle.opacity}
              transparent={piezoStyle.transparent}
            />
            <LayerHighlightEdges isSelected={piezoStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 3. Base Plate & Pins */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[4.2, 4.2, 0.25, 36]} />
          <meshStandardMaterial
            color="#0f0e14"
            roughness={0.8}
            opacity={housingStyle.opacity}
            transparent={housingStyle.transparent}
          />
        </mesh>

        {/* Through-Hole Tinned Lead Pins */}
        {[-1.8, 1.8].map((x, idx) => (
          <mesh key={idx} position={[x, -2.6, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 5.0, 16]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.9}
              roughness={0.2}
              opacity={housingStyle.opacity}
              transparent={housingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={housingStyle.isSelected} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
