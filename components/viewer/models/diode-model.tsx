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

const targetPosTopHalf = new THREE.Vector3();
const targetPosBottomHalf = new THREE.Vector3();

interface DiodeModelProps {
  variant?: 'do35' | 'do41';
}

export function DiodeModel({ variant }: DiodeModelProps) {
  const {
    selectedComponent,
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const isDo41 = variant === 'do41' || selectedComponent?.package.standardCode === 'DO-41';

  const topShellRef = useRef<THREE.Group>(null);
  const bottomShellRef = useRef<THREE.Group>(null);

  // Separation distance based on cutaway mode and explode slider
  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 5.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  // S-shaped tungsten cat-whisker contact curve for DO-35
  const catWhiskerCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 0, 0),    // Anode lead stud
      new THREE.Vector3(-1.0, 0.45, 0), // Top spring arch
      new THREE.Vector3(-0.3, -0.3, 0), // Bottom spring counter-arch
      new THREE.Vector3(0.5, 0, 0),     // Die surface contact
    ]);
  }, []);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 8, 0.2);
    if (topShellRef.current) {
      targetPosTopHalf.set(0, separationTarget, 0);
      topShellRef.current.position.lerp(targetPosTopHalf, speed);
    }
    if (bottomShellRef.current) {
      targetPosBottomHalf.set(0, -separationTarget, 0);
      bottomShellRef.current.position.lerp(targetPosBottomHalf, speed);
    }
  });

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

  // -------------------------------------------------------------
  // VARIANT 1: DO-35 Small Signal Glass Diode (1N4148)
  // -------------------------------------------------------------
  if (!isDo41) {
    return (
      <group name="Diode_DO35_1N4148" position={[0, 0, 0]}>
        {/* 1. SILICON PN JUNCTION DIE (Mounted on Cathode Stud) */}
        {isLayerVisible('die') && (
          <group name="SiliconDieAssembly" onPointerDown={(e) => handlePointerDown(e, 'die')}>
            {/* Silicon epitaxial chip */}
            <mesh position={[0.6, 0, 0]}>
              <boxGeometry args={[0.25, 0.5, 0.5]} />
              <meshStandardMaterial
                color="#334155"
                metalness={0.9}
                roughness={0.2}
                emissive={getHighlightColor('die')}
                emissiveIntensity={getHighlightIntensity('die')}
              />
            </mesh>
            {/* PN Depletion boundary indicator */}
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[0.06, 0.48, 0.48]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* 2. S-SHAPED TUNGSTEN CAT-WHISKER SPRING */}
        {isLayerVisible('cat_whisker') && (
          <mesh
            name="CatWhiskerContact"
            onPointerDown={(e) => handlePointerDown(e, 'cat_whisker')}
          >
            <tubeGeometry args={[catWhiskerCurve, 32, 0.045, 8, false]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.9}
              roughness={0.2}
              emissive={getHighlightColor('cat_whisker')}
              emissiveIntensity={getHighlightIntensity('cat_whisker')}
            />
          </mesh>
        )}

        {/* 3. AXIAL DUMET / COPPER-CLAD LEADS */}
        {isLayerVisible('leads') && (
          <group name="AxialLeads" onPointerDown={(e) => handlePointerDown(e, 'leads')}>
            {/* Anode Lead (Left) with internal stub */}
            <mesh position={[-7.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.25, 0.25, 11.0, 16]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.25}
                emissive={getHighlightColor('leads')}
                emissiveIntensity={getHighlightIntensity('leads')}
              />
            </mesh>
            {/* Anode internal contact stub */}
            <mesh position={[-1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 0.6, 16]} />
              <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Cathode Lead (Right) with internal die pedestal */}
            <mesh position={[7.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.25, 0.25, 11.0, 16]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.25}
                emissive={getHighlightColor('leads')}
                emissiveIntensity={getHighlightIntensity('leads')}
              />
            </mesh>
            {/* Cathode internal pedestal */}
            <mesh position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.45, 0.45, 0.8, 16]} />
              <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* 4. HERMETIC GLASS BEAD CASING (Separates top/bottom in cutaway mode) */}
        {isLayerVisible('glass') && (
          <>
            {/* Top Half Glass Envelope */}
            <group ref={topShellRef} name="GlassEnvelope_Top" onPointerDown={(e) => handlePointerDown(e, 'glass')}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.9, 0.9, 3.8, 32, 1, false, 0, Math.PI]} />
                <meshPhysicalMaterial
                  color="#fb923c"
                  transmission={0.85}
                  opacity={0.8}
                  transparent
                  roughness={0.15}
                  ior={1.5}
                  side={THREE.DoubleSide}
                  emissive={getHighlightColor('glass')}
                  emissiveIntensity={getHighlightIntensity('glass')}
                />
              </mesh>
              {/* Cathode Black Marking Ring (Top Half) */}
              <mesh position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.91, 0.91, 0.4, 32, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#09090b" roughness={0.3} side={THREE.DoubleSide} />
              </mesh>
            </group>

            {/* Bottom Half Glass Envelope */}
            <group ref={bottomShellRef} name="GlassEnvelope_Bottom" onPointerDown={(e) => handlePointerDown(e, 'glass')}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.9, 0.9, 3.8, 32, 1, false, Math.PI, Math.PI]} />
                <meshPhysicalMaterial
                  color="#fb923c"
                  transmission={0.85}
                  opacity={0.8}
                  transparent
                  roughness={0.15}
                  ior={1.5}
                  side={THREE.DoubleSide}
                  emissive={getHighlightColor('glass')}
                  emissiveIntensity={getHighlightIntensity('glass')}
                />
              </mesh>
              {/* Cathode Black Marking Ring (Bottom Half) */}
              <mesh position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.91, 0.91, 0.4, 32, 1, false, Math.PI, Math.PI]} />
                <meshStandardMaterial color="#09090b" roughness={0.3} side={THREE.DoubleSide} />
              </mesh>
            </group>
          </>
        )}
      </group>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 2: DO-41 Power Rectifier Diode (1N4007)
  // -------------------------------------------------------------
  return (
    <group name="Diode_DO41_1N4007" position={[0, 0, 0]}>
      {/* 1. HIGH-VOLTAGE SILICON DIFFUSED JUNCTION WAFER */}
      {isLayerVisible('die') && (
        <group name="SiliconDiffusedDie" onPointerDown={(e) => handlePointerDown(e, 'die')}>
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.8, 0.8, 0.25, 24]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.9}
              roughness={0.2}
              emissive={getHighlightColor('die')}
              emissiveIntensity={getHighlightIntensity('die')}
            />
          </mesh>
          {/* Internal copper heat sink slugs */}
          <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.85, 0.85, 0.8, 24]} />
            <meshStandardMaterial color="#b45309" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.85, 0.85, 0.8, 24]} />
            <meshStandardMaterial color="#b45309" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>
      )}

      {/* 2. COPPER AXIAL LEADS */}
      {isLayerVisible('leads') && (
        <group name="AxialLeads" onPointerDown={(e) => handlePointerDown(e, 'leads')}>
          {/* Anode Lead (-) */}
          <mesh position={[-7.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 11.0, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              emissive={getHighlightColor('leads')}
              emissiveIntensity={getHighlightIntensity('leads')}
            />
          </mesh>
          {/* Cathode Lead (+) */}
          <mesh position={[7.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 11.0, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              emissive={getHighlightColor('leads')}
              emissiveIntensity={getHighlightIntensity('leads')}
            />
          </mesh>
        </group>
      )}

      {/* 3. FLAME-RETARDANT EPOXY MOLDED BODY (DO-41) */}
      {isLayerVisible('mold') && (
        <>
          {/* Top Half Shell */}
          <group ref={topShellRef} name="EpoxyMold_Top" onPointerDown={(e) => handlePointerDown(e, 'mold')}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.35, 1.35, 5.2, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.45}
                metalness={0.1}
                side={THREE.DoubleSide}
                emissive={getHighlightColor('mold')}
                emissiveIntensity={getHighlightIntensity('mold')}
              />
            </mesh>
            {/* Silver Cathode Polarity Band */}
            <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.36, 1.36, 0.6, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Bottom Half Shell */}
          <group ref={bottomShellRef} name="EpoxyMold_Bottom" onPointerDown={(e) => handlePointerDown(e, 'mold')}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.35, 1.35, 5.2, 32, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.45}
                metalness={0.1}
                side={THREE.DoubleSide}
                emissive={getHighlightColor('mold')}
                emissiveIntensity={getHighlightIntensity('mold')}
              />
            </mesh>
            {/* Silver Cathode Polarity Band */}
            <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.36, 1.36, 0.6, 32, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}
