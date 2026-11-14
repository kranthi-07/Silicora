'use client';

import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import {
  BREADBOARD_WIDTH,
  BREADBOARD_DEPTH,
  BREADBOARD_HEIGHT,
  generateBreadboardHoles,
  BreadboardHole,
} from '@/lib/circuit/breadboard-topology';
import { useCircuitStore } from '@/lib/circuit/circuit-store';

export function Breadboard3D() {
  const {
    activeTool,
    setActiveTool,
    wireDraftStart,
    addWire,
    setWireDraftStart,
    attachDmmProbe,
    dmm,
    activeHoveredBusId,
    setActiveHoveredBusId,
  } = useCircuitStore();
  const [hoveredHoleId, setHoveredHoleId] = useState<string | null>(null);

  // Pre-computed tie-point holes
  const holes = useMemo(() => generateBreadboardHoles(), []);

  // Handle clicking a breadboard tie-point hole
  const handleHoleClick = (e: any, hole: BreadboardHole) => {
    e.stopPropagation();

    // 1. DMM Probe Snapping Tool
    if (activeTool === 'probe_dmm_red') {
      attachDmmProbe('red', 'BREADBOARD', hole.busId);
      setActiveTool('select');
      return;
    }
    if (activeTool === 'probe_dmm_black') {
      attachDmmProbe('black', 'BREADBOARD', hole.busId);
      setActiveTool('select');
      return;
    }

    // 2. Wire Drafting Tool
    if (wireDraftStart) {
      addWire(
        wireDraftStart.componentId,
        wireDraftStart.pinId,
        'BREADBOARD',
        hole.busId
      );
    } else {
      setWireDraftStart({
        componentId: 'BREADBOARD',
        pinId: hole.busId,
        worldPosition: [hole.x, hole.y + 1.0, hole.z],
      });
    }
  };

  return (
    <group name="SolderlessBreadboard" position={[0, -BREADBOARD_HEIGHT / 2, 0]}>
      {/* 1. Main Plastic Enclosure Body */}
      <mesh receiveShadow position={[0, BREADBOARD_HEIGHT / 2, 0]}>
        <boxGeometry args={[BREADBOARD_WIDTH, BREADBOARD_HEIGHT, BREADBOARD_DEPTH]} />
        <meshStandardMaterial
          color="#f8fafc" // Off-white / light cream ABS plastic
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Central DIP IC Divider Trough */}
      <mesh position={[0, BREADBOARD_HEIGHT + 0.1, 0]}>
        <boxGeometry args={[BREADBOARD_WIDTH - 4, 0.4, 2.54]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* 3. Power Rail Color Bands */}
      {/* Top Positive (+) Red Line */}
      <mesh position={[0, BREADBOARD_HEIGHT + 0.05, -23.8]}>
        <boxGeometry args={[BREADBOARD_WIDTH - 6, 0.1, 0.6]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Top Negative (-) Blue Line */}
      <mesh position={[0, BREADBOARD_HEIGHT + 0.05, -18.2]}>
        <boxGeometry args={[BREADBOARD_WIDTH - 6, 0.1, 0.6]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      {/* Bottom Positive (+) Red Line */}
      <mesh position={[0, BREADBOARD_HEIGHT + 0.05, 18.2]}>
        <boxGeometry args={[BREADBOARD_WIDTH - 6, 0.1, 0.6]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Bottom Negative (-) Blue Line */}
      <mesh position={[0, BREADBOARD_HEIGHT + 0.05, 23.8]}>
        <boxGeometry args={[BREADBOARD_WIDTH - 6, 0.1, 0.6]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>

      {/* 4. Interactive Tie-Point Contact Holes (Spring Clips) with Net Highlighting */}
      <group name="TiePointHoles" position={[0, BREADBOARD_HEIGHT + 0.1, 0]}>
        {holes.map((hole) => {
          const isDirectlyHovered = hoveredHoleId === hole.id;
          const isBusHighlighted = activeHoveredBusId === hole.busId;
          const isRedAttached = dmm.redProbe.componentId === 'BREADBOARD' && dmm.redProbe.pinId === hole.busId;
          const isBlackAttached = dmm.blackProbe.componentId === 'BREADBOARD' && dmm.blackProbe.pinId === hole.busId;

          let holeColor = '#0f172a';
          if (isRedAttached) {
            holeColor = '#ef4444';
          } else if (isBlackAttached) {
            holeColor = '#10b981';
          } else if (isDirectlyHovered) {
            holeColor = '#00f0ff';
          } else if (isBusHighlighted) {
            holeColor = '#38bdf8';
          }

          return (
            <mesh
              key={hole.id}
              position={[hole.x, 0, hole.z]}
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredHoleId(hole.id);
                setActiveHoveredBusId(hole.busId);
              }}
              onPointerOut={() => {
                setHoveredHoleId(null);
                setActiveHoveredBusId(null);
              }}
              onClick={(e) => handleHoleClick(e, hole)}
            >
              <planeGeometry args={[1.3, 1.3]} />
              <meshBasicMaterial
                color={holeColor}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
