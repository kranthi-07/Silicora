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

const targetPosTrack = new THREE.Vector3();

export function PhotoresistorModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const trackGroupRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 4.5);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (trackGroupRef.current) {
      targetPosTrack.set(0, separationTarget, 0);
      trackGroupRef.current.position.lerp(targetPosTrack, speed);
    }
  });

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const cdsStyle = getLayerStyle('cds_track', selectedLayerId);
  const baseStyle = getLayerStyle('ceramic_base', selectedLayerId);

  return (
    <group name="PhotoresistorLdrModel" position={[0, 0, 0]}>
      {/* 1. CADMIUM SULFIDE (CdS) SQUIGGLE TRACK & CLEAR EPOXY COATING */}
      {isLayerVisible('cds_track') && (
        <group
          ref={trackGroupRef}
          name="CdsTrackLayer"
          position={[0, 0, 0]}
          onPointerDown={(e) => handlePointerDown(e, 'cds_track')}
        >
          {/* Protective Clear Epoxy Top Coating */}
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[2.45, 2.45, 0.4, 32]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={cdsStyle.isFaded ? 0.08 : 0.45}
            />
            <LayerHighlightEdges isSelected={cdsStyle.isSelected} />
          </mesh>

          {/* Interdigitated CdS Photosensitive Serpentine S-Pattern */}
          {[-1.2, -0.6, 0, 0.6, 1.2].map((z, idx) => (
            <mesh key={idx} position={[0, 1.22, z]}>
              <boxGeometry args={[3.2, 0.08, 0.28]} />
              <meshStandardMaterial
                color="#f97316"
                roughness={0.5}
                opacity={cdsStyle.opacity}
                transparent={cdsStyle.transparent}
              />
              <LayerHighlightEdges isSelected={cdsStyle.isSelected} />
            </mesh>
          ))}
          {/* Interconnecting Side Bridges */}
          <mesh position={[-1.5, 1.22, -0.3]}>
            <boxGeometry args={[0.3, 0.08, 1.5]} />
            <meshStandardMaterial
              color="#f97316"
              roughness={0.5}
              opacity={cdsStyle.opacity}
              transparent={cdsStyle.transparent}
            />
          </mesh>
          <mesh position={[1.5, 1.22, 0.3]}>
            <boxGeometry args={[0.3, 0.08, 1.5]} />
            <meshStandardMaterial
              color="#f97316"
              roughness={0.5}
              opacity={cdsStyle.opacity}
              transparent={cdsStyle.transparent}
            />
          </mesh>
        </group>
      )}

      {/* 2. ALUMINA CERAMIC SUBSTRATE BASE & LEADS */}
      {isLayerVisible('ceramic_base') && (
        <group name="CeramicBaseLayer" onPointerDown={(e) => handlePointerDown(e, 'ceramic_base')}>
          {/* Alumina Disc Base */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 1.0, 32]} />
            <meshStandardMaterial
              color="#e2e8f0"
              roughness={0.8}
              opacity={baseStyle.opacity}
              transparent={baseStyle.transparent}
            />
            <LayerHighlightEdges isSelected={baseStyle.isSelected} />
          </mesh>

          {/* Two Through-hole Copper Leads */}
          {[-1.2, 1.2].map((x, idx) => (
            <mesh key={idx} position={[x, -3.0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 6.0, 16]} />
              <meshStandardMaterial
                color="#cbd5e1"
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
