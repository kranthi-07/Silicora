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

const targetPosFront = new THREE.Vector3();
const targetPosBack = new THREE.Vector3();
const targetPosTop = new THREE.Vector3();

export function BatteryCellModel({ variant = '9v' }: { variant?: '9v' | 'aa' }) {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const frontCasingRef = useRef<THREE.Group>(null);
  const backCasingRef = useRef<THREE.Group>(null);
  const topTerminalsRef = useRef<THREE.Group>(null);

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 6.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  useFrame((_, delta) => {
    const speed = Math.min(delta * 9, 0.25);
    if (frontCasingRef.current) {
      targetPosFront.set(0, 0, separationTarget);
      frontCasingRef.current.position.lerp(targetPosFront, speed);
    }
    if (backCasingRef.current) {
      targetPosBack.set(0, 0, -separationTarget);
      backCasingRef.current.position.lerp(targetPosBack, speed);
    }
    if (topTerminalsRef.current) {
      targetPosTop.set(0, 4.0 + separationTarget * 0.5, 0);
      topTerminalsRef.current.position.lerp(targetPosTop, speed);
    }
  });

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  // --- AA / AAA BATTERY HOLDER VARIANT ---
  if (variant === 'aa') {
    const housingStyle = getLayerStyle('housing', selectedLayerId);
    const switchStyle = getLayerStyle('switch', selectedLayerId);
    const springsStyle = getLayerStyle('springs', selectedLayerId);

    return (
      <group name="AaBatteryModel" position={[0, 0, 0]}>
        {/* 1. ABS Heavy-Duty Battery Holder Case */}
        {isLayerVisible('housing') && (
          <group
            name="HousingLayer"
            position={[0, 0, -separationTarget * 0.5]}
            onPointerDown={(e) => handlePointerDown(e, 'housing')}
          >
            <mesh position={[0, -0.2, -1.0]}>
              <boxGeometry args={[5.2, 8.8, 1.2]} />
              <meshStandardMaterial
                color="#18151f"
                roughness={0.75}
                opacity={housingStyle.opacity}
                transparent={housingStyle.transparent}
              />
              <LayerHighlightEdges isSelected={housingStyle.isSelected} />
            </mesh>
            <mesh position={[-2.4, -0.2, 0.2]}>
              <boxGeometry args={[0.4, 8.8, 1.6]} />
              <meshStandardMaterial
                color="#18151f"
                roughness={0.75}
                opacity={housingStyle.opacity}
                transparent={housingStyle.transparent}
              />
              <LayerHighlightEdges isSelected={housingStyle.isSelected} />
            </mesh>
            <mesh position={[2.4, -0.2, 0.2]}>
              <boxGeometry args={[0.4, 8.8, 1.6]} />
              <meshStandardMaterial
                color="#18151f"
                roughness={0.75}
                opacity={housingStyle.opacity}
                transparent={housingStyle.transparent}
              />
              <LayerHighlightEdges isSelected={housingStyle.isSelected} />
            </mesh>
          </group>
        )}

        {/* 2. Integrated Slide Safety Power Switch */}
        {isLayerVisible('switch') && (
          <group
            name="SwitchLayer"
            position={[3.0 + separationTarget * 0.4, 2.2, 0]}
            onPointerDown={(e) => handlePointerDown(e, 'switch')}
          >
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.8, 1.8, 0.8]} />
              <meshStandardMaterial
                color="#dc2626"
                roughness={0.35}
                opacity={switchStyle.opacity}
                transparent={switchStyle.transparent}
              />
              <LayerHighlightEdges isSelected={switchStyle.isSelected} />
            </mesh>
            <mesh position={[0.2, 0.3, 0]}>
              <boxGeometry args={[0.5, 0.6, 0.5]} />
              <meshStandardMaterial
                color="#f87171"
                roughness={0.3}
                opacity={switchStyle.opacity}
                transparent={switchStyle.transparent}
              />
              <LayerHighlightEdges isSelected={switchStyle.isSelected} />
            </mesh>
          </group>
        )}

        {/* 3. Springs, Contacts & Cylindrical Battery Cells */}
        {isLayerVisible('springs') && (
          <group
            name="SpringsLayer"
            position={[0, 0, separationTarget * 0.3]}
            onPointerDown={(e) => handlePointerDown(e, 'springs')}
          >
            {/* Cell 1: Left AA Cell */}
            <group position={[-1.2, 0, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1.0, 1.0, 7.2, 32]} />
                <meshStandardMaterial
                  color="#b45309"
                  metalness={0.5}
                  roughness={0.3}
                  opacity={springsStyle.opacity}
                  transparent={springsStyle.transparent}
                />
                <LayerHighlightEdges isSelected={springsStyle.isSelected} />
              </mesh>
              {/* Gold Positive Pip (+) */}
              <mesh position={[0, 3.8, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.5, 20]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  metalness={0.9}
                  roughness={0.2}
                  opacity={springsStyle.opacity}
                  transparent={springsStyle.transparent}
                />
              </mesh>
              {/* Bottom Flat Base */}
              <mesh position={[0, -3.65, 0]}>
                <cylinderGeometry args={[0.95, 0.95, 0.15, 24]} />
                <meshStandardMaterial
                  color="#cbd5e1"
                  metalness={0.8}
                  roughness={0.25}
                  opacity={springsStyle.opacity}
                  transparent={springsStyle.transparent}
                />
              </mesh>
            </group>

            {/* Cell 2: Right AA Cell */}
            <group position={[1.2, 0, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1.0, 1.0, 7.2, 32]} />
                <meshStandardMaterial
                  color="#b45309"
                  metalness={0.5}
                  roughness={0.3}
                  opacity={springsStyle.opacity}
                  transparent={springsStyle.transparent}
                />
                <LayerHighlightEdges isSelected={springsStyle.isSelected} />
              </mesh>
              {/* Gold Positive Pip (+) */}
              <mesh position={[0, -3.8, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.5, 20]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  metalness={0.9}
                  roughness={0.2}
                  opacity={springsStyle.opacity}
                  transparent={springsStyle.transparent}
                />
              </mesh>
              {/* Nickel Base */}
              <mesh position={[0, 3.65, 0]}>
                <cylinderGeometry args={[0.95, 0.95, 0.15, 24]} />
                <meshStandardMaterial
                  color="#cbd5e1"
                  metalness={0.8}
                  roughness={0.25}
                  opacity={springsStyle.opacity}
                  transparent={springsStyle.transparent}
                />
              </mesh>
            </group>

            {/* Coiled Contact Springs */}
            <mesh position={[-1.2, -3.9, 0]}>
              <cylinderGeometry args={[0.5, 0.3, 0.6, 16]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.95}
                roughness={0.15}
                opacity={springsStyle.opacity}
                transparent={springsStyle.transparent}
              />
            </mesh>
            <mesh position={[1.2, 3.9, 0]}>
              <cylinderGeometry args={[0.5, 0.3, 0.6, 16]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.95}
                roughness={0.15}
                opacity={springsStyle.opacity}
                transparent={springsStyle.transparent}
              />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  // --- 9V ALKALINE PRISMATIC BATTERY (6F22 / PP3) ---
  const jacketStyle = getLayerStyle('jacket', selectedLayerId);
  const cellsStyle = getLayerStyle('cells', selectedLayerId);
  const terminalsStyle = getLayerStyle('terminals', selectedLayerId);

  // Six cylindrical series AAAA cells coordinates [x, y, z]
  const cellPositions: [number, number, number][] = [
    [-1.2, 0, -0.75],
    [0.0, 0, -0.75],
    [1.2, 0, -0.75],
    [-1.2, 0, 0.75],
    [0.0, 0, 0.75],
    [1.2, 0, 0.75],
  ];

  return (
    <group name="9vBatteryModel" position={[0, 0, 0]}>
      {/* 1. STEEL CASING & INSULATING JACKET */}
      {isLayerVisible('jacket') && (
        <group name="JacketLayer" onPointerDown={(e) => handlePointerDown(e, 'jacket')}>
          {/* Front Shell Half */}
          <group ref={frontCasingRef} position={[0, 0, 0]}>
            <mesh position={[0, 0, 0.8]}>
              <boxGeometry args={[4.8, 7.8, 1.6]} />
              <meshStandardMaterial
                color="#28303f"
                roughness={0.35}
                metalness={0.35}
                opacity={jacketStyle.opacity}
                transparent={jacketStyle.transparent}
              />
              <LayerHighlightEdges isSelected={jacketStyle.isSelected} />
            </mesh>
            {/* Front Amber Graphic Stripe */}
            <mesh position={[0, 2.2, 1.62]}>
              <planeGeometry args={[4.6, 1.4]} />
              <meshStandardMaterial
                color="#d97706"
                roughness={0.5}
                metalness={0.2}
                opacity={jacketStyle.opacity}
                transparent={jacketStyle.transparent}
              />
            </mesh>
          </group>

          {/* Back Shell Half */}
          <group ref={backCasingRef} position={[0, 0, 0]}>
            <mesh position={[0, 0, -0.8]}>
              <boxGeometry args={[4.8, 7.8, 1.6]} />
              <meshStandardMaterial
                color="#242b38"
                roughness={0.35}
                metalness={0.35}
                opacity={jacketStyle.opacity}
                transparent={jacketStyle.transparent}
              />
              <LayerHighlightEdges isSelected={jacketStyle.isSelected} />
            </mesh>
          </group>

          {/* Bottom Casing Plate */}
          <mesh position={[0, -3.95, 0]}>
            <boxGeometry args={[4.7, 0.2, 3.1]} />
            <meshStandardMaterial
              color="#1e2430"
              roughness={0.4}
              opacity={jacketStyle.opacity}
              transparent={jacketStyle.transparent}
            />
          </mesh>
        </group>
      )}

      {/* 2. SIX 1.5V ALKALINE SERIES CYLINDRICAL CELLS (Internal Layer) */}
      {isLayerVisible('cells') && (
        <group name="InternalCellsLayer" onPointerDown={(e) => handlePointerDown(e, 'cells')}>
          {cellPositions.map((pos, idx) => {
            // Slight explode spread along X and Z when explodePercent > 0
            const spreadX = pos[0] * (1 + (explodePercent / 100) * 0.8);
            const spreadZ = pos[2] * (1 + (explodePercent / 100) * 0.8);

            return (
              <group key={idx} position={[spreadX, pos[1], spreadZ]}>
                {/* Zinc / Manganese Alkaline Can Body */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.52, 0.52, 6.8, 24]} />
                  <meshStandardMaterial
                    color="#475569"
                    metalness={0.8}
                    roughness={0.25}
                    opacity={cellsStyle.opacity}
                    transparent={cellsStyle.transparent}
                  />
                  <LayerHighlightEdges isSelected={cellsStyle.isSelected} />
                </mesh>
                {/* Brass / Copper Positive Contact Pip */}
                <mesh position={[0, 3.48, 0]}>
                  <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
                  <meshStandardMaterial
                    color="#f59e0b"
                    metalness={0.9}
                    roughness={0.2}
                    opacity={cellsStyle.opacity}
                    transparent={cellsStyle.transparent}
                  />
                </mesh>
                {/* Bottom Nickel Disc */}
                <mesh position={[0, -3.45, 0]}>
                  <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
                  <meshStandardMaterial
                    color="#cbd5e1"
                    metalness={0.9}
                    roughness={0.2}
                    opacity={cellsStyle.opacity}
                    transparent={cellsStyle.transparent}
                  />
                </mesh>
              </group>
            );
          })}

          {/* Series Interconnect Nickel Strips Linking the 6 Cells */}
          <mesh position={[0, 3.52, 0]}>
            <boxGeometry args={[3.2, 0.05, 1.8]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.9}
              roughness={0.2}
              opacity={cellsStyle.opacity}
              transparent={cellsStyle.transparent}
            />
            <LayerHighlightEdges isSelected={cellsStyle.isSelected} />
          </mesh>
        </group>
      )}

      {/* 3. TOP TERMINAL PLATE & MINIATURE SNAP FASTENER CONTACTS */}
      {isLayerVisible('terminals') && (
        <group
          ref={topTerminalsRef}
          name="TerminalsLayer"
          position={[0, 4.0, 0]}
          onPointerDown={(e) => handlePointerDown(e, 'terminals')}
        >
          {/* Top Insulator Terminal Plate */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.6, 0.35, 3.0]} />
            <meshStandardMaterial
              color="#b45309"
              roughness={0.5}
              opacity={terminalsStyle.opacity}
              transparent={terminalsStyle.transparent}
            />
            <LayerHighlightEdges isSelected={terminalsStyle.isSelected} />
          </mesh>

          {/* Negative Female Snap Terminal Socket (Octagonal Socket) */}
          <mesh position={[-1.2, 0.45, 0]}>
            <cylinderGeometry args={[0.85, 0.85, 0.65, 8]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.15}
              opacity={terminalsStyle.opacity}
              transparent={terminalsStyle.transparent}
            />
            <LayerHighlightEdges isSelected={terminalsStyle.isSelected} />
          </mesh>
          {/* Inner Socket Hollow Hole */}
          <mesh position={[-1.2, 0.65, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.3, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          {/* Positive Male Stud Terminal (Round Riveted Stud) */}
          <mesh position={[1.2, 0.45, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 0.7, 24]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.15}
              opacity={terminalsStyle.opacity}
              transparent={terminalsStyle.transparent}
            />
            <LayerHighlightEdges isSelected={terminalsStyle.isSelected} />
          </mesh>
        </group>
      )}
    </group>
  );
}
