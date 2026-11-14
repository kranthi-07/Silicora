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

const targetPosFrontDip = new THREE.Vector3();
const targetPosBackDip = new THREE.Vector3();

export function CeramicCapModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const frontDipRef = useRef<THREE.Group>(null);
  const backDipRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 5.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (frontDipRef.current) {
      targetPosFrontDip.set(0, 0, separationTarget);
      frontDipRef.current.position.lerp(targetPosFrontDip, speed);
    }
    if (backDipRef.current) {
      targetPosBackDip.set(0, 0, -separationTarget);
      backDipRef.current.position.lerp(targetPosBackDip, speed);
    }
  });

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const isLayerVisible = (layerId: string) => layerVisibility[layerId] !== false;

  const coatingStyle = getLayerStyle('ceramic_coating', selectedLayerId);
  const electrodesStyle = getLayerStyle('electrodes', selectedLayerId);

  return (
    <group name="CeramicCap_100n" position={[0, -1, 0]}>
      {/* 1. INTERNAL SILVER ELECTRODE DISCS & HIGH-K CERAMIC DIELECTRIC */}
      {isLayerVisible('electrodes') && (
        <group name="SilverElectrodes" onPointerDown={(e) => handlePointerDown(e, 'electrodes')}>
          {/* Ceramic Dielectric Disc Core */}
          <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.4, 2.4, 0.45, 32]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.7}
              opacity={electrodesStyle.opacity}
              transparent={electrodesStyle.transparent}
            />
            <LayerHighlightEdges isSelected={electrodesStyle.isSelected} />
          </mesh>

          {/* Front Silver Metallization Plate */}
          <mesh position={[0, 2.5, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 0.05, 32]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              opacity={electrodesStyle.opacity}
              transparent={electrodesStyle.transparent}
            />
            <LayerHighlightEdges isSelected={electrodesStyle.isSelected} />
          </mesh>

          {/* Back Silver Metallization Plate */}
          <mesh position={[0, 2.5, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 0.05, 32]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              opacity={electrodesStyle.opacity}
              transparent={electrodesStyle.transparent}
            />
            <LayerHighlightEdges isSelected={electrodesStyle.isSelected} />
          </mesh>

          {/* Two Through-Hole Copper Tinned Leads */}
          <mesh position={[-1.25, -0.8, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 5.5, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              opacity={electrodesStyle.opacity}
              transparent={electrodesStyle.transparent}
            />
            <LayerHighlightEdges isSelected={electrodesStyle.isSelected} />
          </mesh>
          <mesh position={[1.25, -0.8, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 5.5, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              opacity={electrodesStyle.opacity}
              transparent={electrodesStyle.transparent}
            />
            <LayerHighlightEdges isSelected={electrodesStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 2. PHENOLIC RESIN PROTECTIVE DIP COATING (Splits into front & back halves) */}
      {isLayerVisible('ceramic_coating') && (
        <group name="PhenolicDipCoating" onPointerDown={(e) => handlePointerDown(e, 'ceramic_coating')}>
          {/* Front Coating Shell */}
          <group ref={frontDipRef} position={[0, 0, 0]}>
            <mesh position={[0, 2.5, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.65, 2.65, 0.45, 32]} />
              <meshStandardMaterial
                color="#b45309"
                roughness={0.6}
                opacity={coatingStyle.opacity}
                transparent={coatingStyle.transparent}
              />
              <LayerHighlightEdges isSelected={coatingStyle.isSelected} />
            </mesh>
            {/* 104 Silk Value Marking */}
            <mesh position={[0, 2.5, 0.54]}>
              <planeGeometry args={[1.6, 0.8]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.8}
                opacity={coatingStyle.opacity}
                transparent={coatingStyle.transparent}
              />
            </mesh>
          </group>

          {/* Back Coating Shell */}
          <group ref={backDipRef} position={[0, 0, 0]}>
            <mesh position={[0, 2.5, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.65, 2.65, 0.45, 32]} />
              <meshStandardMaterial
                color="#b45309"
                roughness={0.6}
                opacity={coatingStyle.opacity}
                transparent={coatingStyle.transparent}
              />
              <LayerHighlightEdges isSelected={coatingStyle.isSelected} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
