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

const targetPosCasing = new THREE.Vector3();

export function PotentiometerModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const casingGroupRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 5.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (casingGroupRef.current) {
      targetPosCasing.set(0, separationTarget, 0);
      casingGroupRef.current.position.lerp(targetPosCasing, speed);
    }
  });

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const housingStyle = getLayerStyle('housing', selectedLayerId);
  const carbonStyle = getLayerStyle('carbon_track', selectedLayerId);
  const wiperStyle = getLayerStyle('wiper', selectedLayerId);

  return (
    <group name="Potentiometer10kModel" position={[0, 0, 0]}>
      {/* 1. PRESSED METAL CASING & SHAFT (Top Assembly that slides up during cutaway) */}
      {isLayerVisible('housing') && (
        <group
          ref={casingGroupRef}
          name="HousingLayer"
          position={[0, 0, 0]}
          onPointerDown={(e) => handlePointerDown(e, 'housing')}
        >
          {/* Cylindrical Tin Metal Can Top Half */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[4.0, 4.0, 2.2, 32, 1, true]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.85}
              roughness={0.25}
              side={THREE.DoubleSide}
              opacity={housingStyle.opacity}
              transparent={housingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={housingStyle.isSelected} />
          </mesh>

          {/* Top Threaded Brass Bushing */}
          <mesh position={[0, 3.2, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 1.8, 32]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.85}
              roughness={0.25}
              opacity={housingStyle.opacity}
              transparent={housingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={housingStyle.isSelected} />
          </mesh>

          {/* Rotating Fluted Brass Control Shaft */}
          <mesh position={[0, 5.5, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 3.2, 24]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.8}
              roughness={0.25}
              opacity={housingStyle.opacity}
              transparent={housingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={housingStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 2. HORSESHOE RESISTIVE CARBON TRACK (Internal Layer) */}
      {isLayerVisible('carbon_track') && (
        <group name="CarbonTrackLayer" onPointerDown={(e) => handlePointerDown(e, 'carbon_track')}>
          {/* Bakelite Substrate Disc Base */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3.9, 3.9, 0.6, 32]} />
            <meshStandardMaterial
              color="#451a03"
              roughness={0.8}
              opacity={carbonStyle.opacity}
              transparent={carbonStyle.transparent}
            />
            <LayerHighlightEdges isSelected={carbonStyle.isSelected} />
          </mesh>

          {/* Horseshoe Cermet / Carbon Track Ring */}
          <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 3.4, 32, 1, 0.4, Math.PI * 1.6]} />
            <meshStandardMaterial
              color="#18181b"
              roughness={0.9}
              side={THREE.DoubleSide}
              opacity={carbonStyle.opacity}
              transparent={carbonStyle.transparent}
            />
            <LayerHighlightEdges isSelected={carbonStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 3. SPRING METAL SLIDING WIPER CONTACT */}
      {isLayerVisible('wiper') && (
        <group name="WiperLayer" onPointerDown={(e) => handlePointerDown(e, 'wiper')}>
          {/* Wiper Rotor Arm */}
          <mesh position={[0, 0.1, 0]} rotation={[0, 0.8, 0]}>
            <boxGeometry args={[0.6, 0.15, 2.8]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.9}
              roughness={0.2}
              opacity={wiperStyle.opacity}
              transparent={wiperStyle.transparent}
            />
            <LayerHighlightEdges isSelected={wiperStyle.isSelected} />
          </mesh>
          {/* Wiper Tiny Contact Dimple */}
          <mesh position={[0, -0.05, 1.2]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.1}
              opacity={wiperStyle.opacity}
              transparent={wiperStyle.transparent}
            />
          </mesh>

          {/* Three Solder Lug Terminals on Bottom */}
          {[-2.2, 0, 2.2].map((x, i) => (
            <group key={i} position={[x, -2.2, 2.8]}>
              <mesh rotation={[0.3, 0, 0]}>
                <boxGeometry args={[0.9, 2.5, 0.3]} />
                <meshStandardMaterial
                  color="#d1d5db"
                  metalness={0.9}
                  roughness={0.2}
                  opacity={wiperStyle.opacity}
                  transparent={wiperStyle.transparent}
                />
                <LayerHighlightEdges isSelected={wiperStyle.isSelected} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}
