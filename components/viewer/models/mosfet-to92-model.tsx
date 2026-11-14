'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useWorkspaceStore } from '@/lib/store';
import {
  getLayerStyle,
  LayerHighlightEdges,
  computeSeparationTarget,
} from './model-layer-helper';

const targetPosFrontCasing = new THREE.Vector3();

export function MosfetTo92Model() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
    themeMode,
    xRayMode,
  } = useWorkspaceStore();

  const frontMoldRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 6.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (frontMoldRef.current) {
      targetPosFrontCasing.set(0, 0, separationTarget);
      frontMoldRef.current.position.lerp(targetPosFrontCasing, speed);
    }
  });

  const gateWireCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.15, 0.5, 0.2),
      new THREE.Vector3(0.1, 1.2, 0.8),
      new THREE.Vector3(0, -0.6, 0.1),
    ]);
  }, []);

  const sourceWireCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0.5, 0.2),
      new THREE.Vector3(-0.6, 1.3, 0.8),
      new THREE.Vector3(-1.27, -0.6, 0.1),
    ]);
  }, []);

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const isLayerVisible = (layerId: string) => layerVisibility[layerId] !== false;

  const moldStyle = getLayerStyle('epoxy_mold', selectedLayerId, 1.0, false, xRayMode, true);
  const dieStyle = getLayerStyle('die', selectedLayerId);
  const leadframeStyle = getLayerStyle('leadframe', selectedLayerId);
  const wirebondsStyle = getLayerStyle('wirebonds', selectedLayerId);

  const epoxyColor = themeMode === 'light' ? '#222834' : '#333b4b';

  return (
    <group name="MOSFET_TO92_2N7000" position={[0, 0, 0]}>
      {/* 1. COPPER LEADFRAME & DRAIN PADDLE */}
      {isLayerVisible('leadframe') && (
        <group name="CopperLeadframe" onPointerDown={(e) => handlePointerDown(e, 'leadframe')}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2.2, 2.6, 0.22]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.88}
              roughness={0.22}
              opacity={leadframeStyle.opacity}
              transparent={leadframeStyle.transparent}
            />
            <LayerHighlightEdges isSelected={leadframeStyle.isSelected} />
          </mesh>

          {/* Source Pin */}
          <mesh position={[-1.27, -3.8, 0]}>
            <boxGeometry args={[0.38, 6.2, 0.25]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.92}
              roughness={0.18}
              opacity={leadframeStyle.opacity}
              transparent={leadframeStyle.transparent}
            />
            <LayerHighlightEdges isSelected={leadframeStyle.isSelected} />
          </mesh>

          {/* Gate Pin */}
          <mesh position={[0, -3.8, 0]}>
            <boxGeometry args={[0.38, 6.2, 0.25]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.92}
              roughness={0.18}
              opacity={leadframeStyle.opacity}
              transparent={leadframeStyle.transparent}
            />
            <LayerHighlightEdges isSelected={leadframeStyle.isSelected} />
          </mesh>

          {/* Drain Pin */}
          <mesh position={[1.27, -3.8, 0]}>
            <boxGeometry args={[0.38, 6.2, 0.25]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.92}
              roughness={0.18}
              opacity={leadframeStyle.opacity}
              transparent={leadframeStyle.transparent}
            />
            <LayerHighlightEdges isSelected={leadframeStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 2. SILICON DIE */}
      {isLayerVisible('die') && (
        <group name="SiliconDie" onPointerDown={(e) => handlePointerDown(e, 'die')}>
          <mesh position={[0, 0.5, 0.16]}>
            <boxGeometry args={[1.0, 1.0, 0.1]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.85}
              roughness={0.15}
              opacity={dieStyle.opacity}
              transparent={dieStyle.transparent}
            />
            <LayerHighlightEdges isSelected={dieStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 3. BOND WIRES */}
      {isLayerVisible('wirebonds') && (
        <group name="BondWires" onPointerDown={(e) => handlePointerDown(e, 'wirebonds')}>
          <mesh>
            <tubeGeometry args={[gateWireCurve, 28, 0.04, 8, false]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.12}
              emissive="#f59e0b"
              emissiveIntensity={0.2}
              opacity={wirebondsStyle.opacity}
              transparent={wirebondsStyle.transparent}
            />
            <LayerHighlightEdges isSelected={wirebondsStyle.isSelected} />
          </mesh>
          <mesh>
            <tubeGeometry args={[sourceWireCurve, 28, 0.04, 8, false]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.12}
              emissive="#f59e0b"
              emissiveIntensity={0.2}
              opacity={wirebondsStyle.opacity}
              transparent={wirebondsStyle.transparent}
            />
            <LayerHighlightEdges isSelected={wirebondsStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 4. TO-92 REALISTIC EPOXY CASING */}
      {isLayerVisible('epoxy_mold') && (
        <group name="EpoxyMoldPackage" onPointerDown={(e) => handlePointerDown(e, 'epoxy_mold')}>
          {/* A. FRONT FLAT D-SHELL (Slides forward cleanly with cutaway separation) */}
          <group ref={frontMoldRef} position={[0, 0, 0]}>
            <mesh position={[0, 0.5, 0.45]}>
              <boxGeometry args={[4.4, 4.8, 0.8]} />
              <meshStandardMaterial
                color={epoxyColor}
                roughness={0.34}
                metalness={0.18}
                opacity={moldStyle.opacity}
                transparent={moldStyle.transparent}
              />
              <LayerHighlightEdges isSelected={moldStyle.isSelected} />
            </mesh>

            {/* Front 2N7000 Silkscreen Laser Marking */}
            <Text
              position={[0, 1.2, 0.87]}
              fontSize={0.42}
              color="#e2e8f0"
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              2N7000
            </Text>

            {/* D G S Pinout Laser Label */}
            <Text
              position={[0, 0.35, 0.87]}
              fontSize={0.24}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              D   G   S
            </Text>
          </group>

          {/* B. REAR SEMI-CYLINDRICAL BARREL SHELL */}
          <group position={[0, 0.5, 0]}>
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[2.2, 2.2, 4.8, 36, 1, false, Math.PI / 2, Math.PI]} />
              <meshStandardMaterial
                color={epoxyColor}
                roughness={0.36}
                metalness={0.18}
                opacity={moldStyle.opacity}
                transparent={moldStyle.transparent}
              />
              <LayerHighlightEdges isSelected={moldStyle.isSelected} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
