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

const targetPosFrontMold = new THREE.Vector3();

export function TemperatureSensorModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const frontMoldRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 5.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (frontMoldRef.current) {
      targetPosFrontMold.set(0, 0, separationTarget);
      frontMoldRef.current.position.lerp(targetPosFrontMold, speed);
    }
  });

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const moldStyle = getLayerStyle('mold', selectedLayerId);
  const dieStyle = getLayerStyle('die', selectedLayerId);
  const leadsStyle = getLayerStyle('leads', selectedLayerId);

  return (
    <group name="TemperatureSensorLm35Model" position={[0, 0, 0]}>
      {/* 1. EPOXY RESIN PACKAGE BODY (Front Flat Shell that splits open) */}
      {isLayerVisible('mold') && (
        <group name="MoldLayer" onPointerDown={(e) => handlePointerDown(e, 'mold')}>
          {/* Front Shell Half */}
          <group ref={frontMoldRef} position={[0, 0, 0]}>
            <mesh position={[0, 2.5, 0.2]}>
              <boxGeometry args={[4.4, 4.2, 0.4]} />
              <meshStandardMaterial
                color="#181620"
                roughness={0.75}
                opacity={moldStyle.opacity}
                transparent={moldStyle.transparent}
              />
              <LayerHighlightEdges isSelected={moldStyle.isSelected} />
            </mesh>
            {/* LM35 Laser Text Silk Label */}
            <mesh position={[0, 3.2, 0.42]}>
              <planeGeometry args={[2.8, 0.8]} />
              <meshStandardMaterial
                color="#94a3b8"
                roughness={0.5}
                opacity={moldStyle.opacity}
                transparent={moldStyle.transparent}
              />
            </mesh>
          </group>

          {/* Rear Curved Barrel Half */}
          <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 4.2, 32, 1, false, 0, Math.PI]} />
            <meshStandardMaterial
              color="#1c1a24"
              roughness={0.7}
              opacity={moldStyle.opacity}
              transparent={moldStyle.transparent}
            />
            <LayerHighlightEdges isSelected={moldStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 2. BANDGAP REFERENCE SILICON DIE */}
      {isLayerVisible('die') && (
        <group
          name="DieLayer"
          position={[0, 2.4, 0.1]}
          onPointerDown={(e) => handlePointerDown(e, 'die')}
        >
          {/* Silicon Microchip Die */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 1.2, 0.12]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.9}
              roughness={0.2}
              opacity={dieStyle.opacity}
              transparent={dieStyle.transparent}
            />
            <LayerHighlightEdges isSelected={dieStyle.isSelected} />
          </mesh>
          {/* Aluminum Sensor Bandgap Pattern */}
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.7, 0.7, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              metalness={0.8}
              roughness={0.2}
              opacity={dieStyle.opacity}
              transparent={dieStyle.transparent}
            />
          </mesh>
        </group>
      )}

      {/* 3. COPPER LEADFRAME FINGERS & 3 PINS */}
      {isLayerVisible('leads') && (
        <group name="LeadsLayer" onPointerDown={(e) => handlePointerDown(e, 'leads')}>
          {/* Center Collector/Mounting Paddle */}
          <mesh position={[0, 2.4, -0.05]}>
            <boxGeometry args={[2.4, 2.6, 0.2]} />
            <meshStandardMaterial
              color="#b45309"
              metalness={0.85}
              roughness={0.25}
              opacity={leadsStyle.opacity}
              transparent={leadsStyle.transparent}
            />
            <LayerHighlightEdges isSelected={leadsStyle.isSelected} />
          </mesh>

          {/* Three Tinned Pins: Pin 1 (+Vs), Pin 2 (Vout), Pin 3 (GND) */}
          {[-1.27, 0, 1.27].map((x, idx) => (
            <mesh key={idx} position={[x, -2.5, 0]}>
              <boxGeometry args={[0.35, 6.0, 0.25]} />
              <meshStandardMaterial
                color="#e2e8f0"
                metalness={0.9}
                roughness={0.2}
                opacity={leadsStyle.opacity}
                transparent={leadsStyle.transparent}
              />
              <LayerHighlightEdges isSelected={leadsStyle.isSelected} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
