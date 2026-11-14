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

const targetPosTopMold = new THREE.Vector3();

export function IcDipModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
    themeMode,
  } = useWorkspaceStore();

  const topMoldRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 5.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (topMoldRef.current) {
      targetPosTopMold.set(0, separationTarget, 0);
      topMoldRef.current.position.lerp(targetPosTopMold, speed);
    }
  });

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const moldStyle = getLayerStyle('mold', selectedLayerId);
  const dieStyle = getLayerStyle('die', selectedLayerId);
  const leadframeStyle = getLayerStyle('leadframe', selectedLayerId);
  const wirebondsStyle = getLayerStyle('wirebonds', selectedLayerId);

  const epoxyColor = themeMode === 'light' ? '#222834' : '#333b4b';

  return (
    <group name="IcDipModel" position={[0, 0, 0]}>
      {/* 1. EPOXY NOVOLAC MOLD COMPOUND (Top Half that lifts up) */}
      {isLayerVisible('mold') && (
        <group name="MoldLayer" onPointerDown={(e) => handlePointerDown(e, 'mold')}>
          {/* Top Half of Body */}
          <group ref={topMoldRef} position={[0, 0, 0]}>
            <mesh position={[0, 1.0, 0]}>
              <boxGeometry args={[4.8, 1.2, 3.6]} />
              <meshStandardMaterial
                color={epoxyColor}
                roughness={0.38}
                metalness={0.15}
                opacity={moldStyle.opacity}
                transparent={moldStyle.transparent}
              />
              <LayerHighlightEdges isSelected={moldStyle.isSelected} />
            </mesh>
            {/* Pin 1 Index Notch */}
            <mesh position={[-2.4, 1.0, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 1.25, 16, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#0f0e14" roughness={0.8} />
            </mesh>
          </group>

          {/* Bottom Half of Body */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[4.8, 1.2, 3.6]} />
            <meshStandardMaterial
              color={epoxyColor}
              roughness={0.4}
              metalness={0.15}
              opacity={moldStyle.opacity}
              transparent={moldStyle.transparent}
            />
            <LayerHighlightEdges isSelected={moldStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 2. SILICON DIE (Internal Layer) */}
      {isLayerVisible('die') && (
        <group
          name="DieLayer"
          position={[0, 0.45, 0]}
          onPointerDown={(e) => handlePointerDown(e, 'die')}
        >
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.6, 0.15, 1.4]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.9}
              roughness={0.2}
              opacity={dieStyle.opacity}
              transparent={dieStyle.transparent}
            />
            <LayerHighlightEdges isSelected={dieStyle.isSelected} />
          </mesh>
          {/* Internal Circuit Mask Pattern */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[1.2, 0.02, 1.0]} />
            <meshStandardMaterial
              color="#38bdf8"
              metalness={0.8}
              roughness={0.3}
              opacity={dieStyle.opacity}
              transparent={dieStyle.transparent}
            />
          </mesh>
        </group>
      )}

      {/* 3. COPPER LEADFRAME & PINS */}
      {isLayerVisible('leadframe') && (
        <group name="LeadframeLayer" onPointerDown={(e) => handlePointerDown(e, 'leadframe')}>
          {/* Central Die Flag Paddle */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[2.2, 0.1, 2.0]} />
            <meshStandardMaterial
              color="#b45309"
              metalness={0.9}
              roughness={0.25}
              opacity={leadframeStyle.opacity}
              transparent={leadframeStyle.transparent}
            />
            <LayerHighlightEdges isSelected={leadframeStyle.isSelected} />
          </mesh>

          {/* 8 Dual In-Line Tinned Through-Hole Pins */}
          {[-1.8, -0.6, 0.6, 1.8].map((x, idx) => (
            <React.Fragment key={idx}>
              {/* Left Pin Row (Pins 1-4) */}
              <group position={[x, -0.6, 2.0]}>
                <mesh>
                  <boxGeometry args={[0.35, 2.4, 0.25]} />
                  <meshStandardMaterial
                    color="#cbd5e1"
                    metalness={0.9}
                    roughness={0.2}
                    opacity={leadframeStyle.opacity}
                    transparent={leadframeStyle.transparent}
                  />
                  <LayerHighlightEdges isSelected={leadframeStyle.isSelected} />
                </mesh>
              </group>

              {/* Right Pin Row (Pins 5-8) */}
              <group position={[x, -0.6, -2.0]}>
                <mesh>
                  <boxGeometry args={[0.35, 2.4, 0.25]} />
                  <meshStandardMaterial
                    color="#cbd5e1"
                    metalness={0.9}
                    roughness={0.2}
                    opacity={leadframeStyle.opacity}
                    transparent={leadframeStyle.transparent}
                  />
                  <LayerHighlightEdges isSelected={leadframeStyle.isSelected} />
                </mesh>
              </group>
            </React.Fragment>
          ))}
        </group>
      )}

      {/* 4. GOLD WIREBONDS (25µm) */}
      {isLayerVisible('wirebonds') && (
        <group name="WirebondsLayer" onPointerDown={(e) => handlePointerDown(e, 'wirebonds')}>
          {[-0.6, 0.6].map((x, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[x, 0.5, 1.0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  metalness={0.95}
                  roughness={0.1}
                  opacity={wirebondsStyle.opacity}
                  transparent={wirebondsStyle.transparent}
                />
                <LayerHighlightEdges isSelected={wirebondsStyle.isSelected} />
              </mesh>
              <mesh position={[x, 0.5, -1.0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  metalness={0.95}
                  roughness={0.1}
                  opacity={wirebondsStyle.opacity}
                  transparent={wirebondsStyle.transparent}
                />
                <LayerHighlightEdges isSelected={wirebondsStyle.isSelected} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      )}
    </group>
  );
}
