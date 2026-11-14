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

const targetPosDome = new THREE.Vector3();

export function LedModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const domeRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 8.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 8, 0.2);
    if (domeRef.current) {
      targetPosDome.set(0, separationTarget, 0);
      domeRef.current.position.lerp(targetPosDome, speed);
    }
  });

  // Smooth gold bond wire curve
  const wireCurve = useMemo(() => {
    const p1 = new THREE.Vector3(-0.6, 2.2, 0); // Die center inside cup
    const p2 = new THREE.Vector3(-0.1, 3.2, 0.4); // Wire apex arch
    const p3 = new THREE.Vector3(0.8, 2.0, 0); // Post contact
    return new THREE.CatmullRomCurve3([p1, p2, p3]);
  }, []);

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(layerId);
  };

  const isLayerVisible = (layerId: string) => layerVisibility[layerId] !== false;
  const isSelected = (layerId: string) => selectedLayerId === layerId;

  const getHighlightColor = (layerId: string, defaultEmissive = '#000000') => {
    return isSelected(layerId) ? '#00f0ff' : defaultEmissive;
  };
  const getHighlightIntensity = (layerId: string) => (isSelected(layerId) ? 0.6 : 0);

  return (
    <group name="LED_5mm_Red" position={[0, -2, 0]}>
      {/* 1. INTERNAL ANVIL LEADFRAME & REFLECTOR CUP */}
      {isLayerVisible('cup') && (
        <group name="AnvilLeadframe" onPointerDown={(e) => handlePointerDown(e, 'cup')}>
          {/* Anvil Flat Plate */}
          <mesh position={[-0.8, 1.2, 0]}>
            <boxGeometry args={[1.2, 2.2, 0.4]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              emissive={getHighlightColor('cup')}
              emissiveIntensity={getHighlightIntensity('cup')}
            />
          </mesh>
          {/* Parabolic Reflector Cup Indentation */}
          <mesh position={[-0.6, 2.1, 0]}>
            <coneGeometry args={[0.6, 0.5, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Post Leadframe (Adjacent contact) */}
          <mesh position={[0.8, 1.2, 0]}>
            <boxGeometry args={[0.7, 2.2, 0.4]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              emissive={getHighlightColor('cup')}
              emissiveIntensity={getHighlightIntensity('cup')}
            />
          </mesh>
        </group>
      )}

      {/* 2. MICROSCOPIC GaAsP SEMICONDUCTOR DIE WITH GLOW */}
      {isLayerVisible('die') && (
        <group name="SemiconductorDie" onPointerDown={(e) => handlePointerDown(e, 'die')}>
          <mesh position={[-0.6, 2.2, 0]}>
            <boxGeometry args={[0.3, 0.15, 0.3]} />
            <meshStandardMaterial
              color="#dc2626"
              emissive="#ff1e1e"
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          {/* Microscopic active photon emission glow light */}
          <pointLight position={[-0.6, 2.3, 0]} color="#ef4444" intensity={1.5} distance={8} />
        </group>
      )}

      {/* 3. GOLD BOND WIRE (25µm) */}
      {isLayerVisible('wire') && (
        <mesh name="BondWire" onPointerDown={(e) => handlePointerDown(e, 'wire')}>
          <tubeGeometry args={[wireCurve, 32, 0.04, 8, false]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.15}
            emissive={getHighlightColor('wire')}
            emissiveIntensity={getHighlightIntensity('wire')}
          />
        </mesh>
      )}

      {/* 4. THROUGH-HOLE LEADS (Anode + longer, Cathode - shorter) */}
      <group name="LED_Leads">
        {/* Anode Lead (+) */}
        <mesh position={[-1.27, -4.0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 8.5, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Cathode Lead (-) with flat edge flag */}
        <mesh position={[1.27, -4.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 7.5, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {/* 5. TINTED DIFFUSED EPOXY RESIN DOME (Lifts in Cutaway mode) */}
      {isLayerVisible('epoxy_lens') && (
        <group ref={domeRef} name="EpoxyDome" onPointerDown={(e) => handlePointerDown(e, 'epoxy_lens')}>
          {/* Cylindrical Base with Rim Rim Lip */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 3.6, 32]} />
            <meshPhysicalMaterial
              color="#dc2626"
              transmission={0.85}
              opacity={0.85}
              transparent
              roughness={0.2}
              ior={1.52}
              thickness={2.5}
              emissive={getHighlightColor('epoxy_lens')}
              emissiveIntensity={getHighlightIntensity('epoxy_lens')}
            />
          </mesh>
          {/* Hemispherical Top Dome */}
          <mesh position={[0, 3.6, 0]}>
            <sphereGeometry args={[2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial
              color="#dc2626"
              transmission={0.85}
              opacity={0.85}
              transparent
              roughness={0.2}
              ior={1.52}
              thickness={2.5}
            />
          </mesh>
          {/* Base Rim Flange (Cathode Flat Indicator) */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[2.85, 2.85, 0.6, 32]} />
            <meshPhysicalMaterial
              color="#b91c1c"
              transmission={0.8}
              opacity={0.9}
              transparent
              roughness={0.3}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
