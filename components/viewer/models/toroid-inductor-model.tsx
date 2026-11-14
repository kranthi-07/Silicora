'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useWorkspaceStore } from '@/lib/store';
import {
  getLayerStyle,
  LayerHighlightEdges,
  computeSeparationTarget,
} from './model-layer-helper';

export function ToroidInductorModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 4.5);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const coreStyle = getLayerStyle('ferrite_core', selectedLayerId);
  const windingStyle = getLayerStyle('enamelled_winding', selectedLayerId);

  // 18 wound coils around the donut
  const coilAngles = useMemo(() => {
    const angles: number[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      angles.push((i / count) * Math.PI * 2);
    }
    return angles;
  }, []);

  return (
    <group name="ToroidInductorModel" position={[0, 0, 0]}>
      {/* 1. TOROIDAL FERRITE CORE */}
      {isLayerVisible('ferrite_core') && (
        <group name="CoreLayer" onPointerDown={(e) => handlePointerDown(e, 'ferrite_core')}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[3.2, 1.1, 24, 48]} />
            <meshStandardMaterial
              color="#047857"
              roughness={0.6}
              metalness={0.2}
              opacity={coreStyle.opacity}
              transparent={coreStyle.transparent}
            />
            <LayerHighlightEdges isSelected={coreStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 2. ENAMELLED COPPER WIRE WINDING COILS */}
      {isLayerVisible('enamelled_winding') && (
        <group name="WindingLayer" onPointerDown={(e) => handlePointerDown(e, 'enamelled_winding')}>
          {coilAngles.map((angle, idx) => {
            const rad = 3.2 + separationTarget * 0.4;
            const x = Math.cos(angle) * rad;
            const y = Math.sin(angle) * rad;

            return (
              <group key={idx} position={[x, y, 0]} rotation={[0, 0, angle]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[1.25, 0.22, 16, 24]} />
                  <meshStandardMaterial
                    color="#b45309"
                    metalness={0.9}
                    roughness={0.2}
                    opacity={windingStyle.opacity}
                    transparent={windingStyle.transparent}
                  />
                  <LayerHighlightEdges isSelected={windingStyle.isSelected} />
                </mesh>
              </group>
            );
          })}

          {/* Two Lead Wires Coming Down */}
          <mesh position={[-1.2, -4.2, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 3.2, 16]} />
            <meshStandardMaterial
              color="#b45309"
              metalness={0.9}
              roughness={0.2}
              opacity={windingStyle.opacity}
              transparent={windingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={windingStyle.isSelected} />
          </mesh>
          <mesh position={[1.2, -4.2, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 3.2, 16]} />
            <meshStandardMaterial
              color="#b45309"
              metalness={0.9}
              roughness={0.2}
              opacity={windingStyle.opacity}
              transparent={windingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={windingStyle.isSelected} />
          </mesh>
        </group>
      )}
    </group>
  );
}
