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

const targetPosCan = new THREE.Vector3();

export function ElectrolyticCapModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const outerCanRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 8.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (outerCanRef.current) {
      targetPosCan.set(0, separationTarget, 0);
      outerCanRef.current.position.lerp(targetPosCan, speed);
    }
  });

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  const isLayerVisible = (layerId: string) => layerVisibility[layerId] !== false;

  const sleeveStyle = getLayerStyle('pvc_sleeve', selectedLayerId);
  const canStyle = getLayerStyle('can', selectedLayerId);
  const windingStyle = getLayerStyle('winding', selectedLayerId);
  const bungStyle = getLayerStyle('bung', selectedLayerId);

  return (
    <group name="ElectrolyticCap_470u" position={[0, -2, 0]}>
      {/* 1. INTERNAL COILED JELLY-ROLL WINDING */}
      {isLayerVisible('winding') && (
        <group name="JellyRollWinding" onPointerDown={(e) => handlePointerDown(e, 'winding')}>
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[3.4, 3.4, 8.5, 32]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.6}
              metalness={0.3}
              opacity={windingStyle.opacity}
              transparent={windingStyle.transparent}
            />
            <LayerHighlightEdges isSelected={windingStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 2. RUBBER SEALING BUNG BASE & LEADS */}
      {isLayerVisible('bung') && (
        <group name="RubberBungBase" onPointerDown={(e) => handlePointerDown(e, 'bung')}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[3.8, 3.8, 0.8, 32]} />
            <meshStandardMaterial
              color="#0f172a"
              roughness={0.9}
              opacity={bungStyle.opacity}
              transparent={bungStyle.transparent}
            />
            <LayerHighlightEdges isSelected={bungStyle.isSelected} />
          </mesh>

          {/* Long Positive Lead (Anode) */}
          <mesh position={[-1.25, -2.8, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 5.5, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              opacity={bungStyle.opacity}
              transparent={bungStyle.transparent}
            />
            <LayerHighlightEdges isSelected={bungStyle.isSelected} />
          </mesh>

          {/* Shorter Negative Lead (Cathode) */}
          <mesh position={[1.25, -2.2, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 4.2, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              opacity={bungStyle.opacity}
              transparent={bungStyle.transparent}
            />
            <LayerHighlightEdges isSelected={bungStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 3. ALUMINUM CAN & PVC SLEEVE ASSEMBLY (Lifts up with separation) */}
      <group ref={outerCanRef} position={[0, 0, 0]}>
        {/* Aluminum Pressure Can */}
        {isLayerVisible('can') && (
          <group name="AluCan" onPointerDown={(e) => handlePointerDown(e, 'can')}>
            <mesh position={[0, 5.0, 0]}>
              <cylinderGeometry args={[3.9, 3.9, 9.6, 32, 1, true]} />
              <meshStandardMaterial
                color="#94a3b8"
                metalness={0.9}
                roughness={0.25}
                side={THREE.DoubleSide}
                opacity={canStyle.opacity}
                transparent={canStyle.transparent}
              />
              <LayerHighlightEdges isSelected={canStyle.isSelected} />
            </mesh>
            {/* Top Safety Vent Cross Score Lines */}
            <mesh position={[0, 9.8, 0]}>
              <cylinderGeometry args={[3.9, 3.9, 0.1, 32]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.2}
                opacity={canStyle.opacity}
                transparent={canStyle.transparent}
              />
              <LayerHighlightEdges isSelected={canStyle.isSelected} />
            </mesh>
          </group>
        )}

        {/* PVC Insulating Sleeve */}
        {isLayerVisible('pvc_sleeve') && (
          <group name="PvcSleeve" onPointerDown={(e) => handlePointerDown(e, 'pvc_sleeve')}>
            <mesh position={[0, 4.8, 0]}>
              <cylinderGeometry args={[4.05, 4.05, 9.2, 32, 1, true]} />
              <meshStandardMaterial
                color="#1e3a8a"
                roughness={0.4}
                side={THREE.DoubleSide}
                opacity={sleeveStyle.opacity}
                transparent={sleeveStyle.transparent}
              />
              <LayerHighlightEdges isSelected={sleeveStyle.isSelected} />
            </mesh>
            {/* Negative Polarity Stripe */}
            <mesh position={[2.8, 4.8, 2.8]} rotation={[0, -Math.PI / 4, 0]}>
              <planeGeometry args={[1.6, 9.2]} />
              <meshStandardMaterial
                color="#f8fafc"
                roughness={0.4}
                opacity={sleeveStyle.opacity}
                transparent={sleeveStyle.transparent}
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
