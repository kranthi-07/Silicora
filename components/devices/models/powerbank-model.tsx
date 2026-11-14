'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceSubsystem, DeviceComponentPart } from '@/types/device';

interface PowerbankModelProps {
  explodeFactor: number;
  selectedSubsystemId: string | null;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
  subsystems: DeviceSubsystem[];
}

export function Powerbank3DModel({
  explodeFactor,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
  subsystems,
}: PowerbankModelProps) {
  const pcbSub = subsystems.find((s) => s.id === 'pb_mainboard');
  const cellsSub = subsystems.find((s) => s.id === 'pb_cells');
  const encSub = subsystems.find((s) => s.id === 'pb_enclosure');

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 10, Math.PI / 5, 0]}>
      {/* 1. BUCK-BOOST POWER PCB */}
      {pcbSub && (
        <PowerbankPcbLayer
          subsystem={pcbSub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'pb_mainboard'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}

      {/* 2. 4S 21700 CYLINDRICAL LI-ION CELLS */}
      {cellsSub && (
        <PowerbankCellsLayer
          subsystem={cellsSub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'pb_cells'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}

      {/* 3. EXTRUDED ALUMINUM CHASSIS */}
      {encSub && (
        <PowerbankEnclosureLayer
          subsystem={encSub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'pb_enclosure'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}
    </group>
  );
}

function PowerbankPcbLayer({
  subsystem,
  explodeFactor,
  isSelected,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
}: {
  subsystem: DeviceSubsystem;
  explodeFactor: number;
  isSelected: boolean;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetY = 3.5 * explodeFactor;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const buckBoostPart = subsystem.components.find((c) => c.id === 'buck_boost_controller');
  const inductorPart = subsystem.components.find((c) => c.id === 'power_inductor');
  const pdMcuPart = subsystem.components.find((c) => c.id === 'pd_phy_mcu');

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* 4-Layer Power PCB Base */}
      <mesh position={[0, 0, -3.5]}>
        <boxGeometry args={[8.2, 0.14, 4.5]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* High-Current Molded Shielded Inductor (4.7uH) */}
      {inductorPart && (
        <group
          position={[1.5, 0.45, -3.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(inductorPart);
          }}
        >
          <mesh>
            <boxGeometry args={[1.6, 0.8, 1.6]} />
            <meshStandardMaterial
              color={selectedPartId === 'power_inductor' ? '#38bdf8' : '#334155'}
              emissive={selectedPartId === 'power_inductor' ? '#0284c7' : '#000000'}
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
          <mesh position={[0, 0.41, 0]}>
            <boxGeometry args={[1.2, 0.02, 1.2]} />
            <meshStandardMaterial color="#475569" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* Synchronous Buck-Boost Controller IC */}
      {buckBoostPart && (
        <group
          position={[0, 0.16, -3.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(buckBoostPart);
          }}
        >
          <mesh>
            <boxGeometry args={[0.9, 0.14, 0.9]} />
            <meshStandardMaterial
              color={selectedPartId === 'buck_boost_controller' ? '#38bdf8' : '#0f172a'}
              emissive={selectedPartId === 'buck_boost_controller' ? '#0284c7' : '#000000'}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* USB-PD MCU Controller */}
      {pdMcuPart && (
        <group
          position={[-1.8, 0.16, -3.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(pdMcuPart);
          }}
        >
          <mesh>
            <boxGeometry args={[0.8, 0.12, 0.8]} />
            <meshStandardMaterial
              color={selectedPartId === 'pd_phy_mcu' ? '#38bdf8' : '#1e293b'}
              emissive={selectedPartId === 'pd_phy_mcu' ? '#0284c7' : '#000000'}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Front Dual USB-C & USB-A Receptacles */}
      <mesh position={[-2.2, 0.25, -5.8]}>
        <boxGeometry args={[1.6, 0.5, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.25, -5.8]}>
        <boxGeometry args={[1.6, 0.5, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[2.2, 0.35, -5.8]}>
        <boxGeometry args={[2.0, 0.7, 1.4]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.95} />
      </mesh>
    </group>
  );
}

function PowerbankCellsLayer({
  subsystem,
  explodeFactor,
  isSelected,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
}: {
  subsystem: DeviceSubsystem;
  explodeFactor: number;
  isSelected: boolean;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetY = 0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const cellPart = subsystem.components.find((c) => c.id === 'cell_quad');
  const isPartSelected = selectedPartId === 'cell_quad';

  // 4 Cylindrical 21700 Lithium Cells (approx 21mm dia x 70mm len = 2.1 x 7.0 units)
  const cellPositions = [-3.15, -1.05, 1.05, 3.15];

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        if (cellPart) {
          e.stopPropagation();
          onSelectPart(cellPart);
        } else {
          e.stopPropagation();
          onSelectSubsystem(subsystem);
        }
      }}
    >
      {cellPositions.map((x, idx) => (
        <group key={idx} position={[x, 0, 2.0]} rotation={[Math.PI / 2, 0, 0]}>
          {/* Green PVC Shrink Wrapped Cylindrical 21700 Can */}
          <mesh>
            <cylinderGeometry args={[0.98, 0.98, 7.0, 32]} />
            <meshStandardMaterial
              color={isPartSelected ? '#38bdf8' : '#059669'}
              emissive={isPartSelected ? '#0284c7' : '#000000'}
              roughness={0.3}
              metalness={0.3}
            />
          </mesh>
          {/* Metallic Positive Button Terminal */}
          <mesh position={[0, -3.55, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.15, 24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.95} />
          </mesh>
          {/* Metallic Negative Flat Base */}
          <mesh position={[0, 3.55, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.1, 24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Spot-Welded Pure Nickel Bus Bars Bridging the 4S Cells */}
      <mesh position={[0, 0, -1.5]}>
        <boxGeometry args={[7.2, 0.04, 0.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0, 5.5]}>
        <boxGeometry args={[7.2, 0.04, 0.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.95} />
      </mesh>
    </group>
  );
}

function PowerbankEnclosureLayer({
  subsystem,
  explodeFactor,
  isSelected,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
}: {
  subsystem: DeviceSubsystem;
  explodeFactor: number;
  isSelected: boolean;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetY = -3.5 * explodeFactor;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const thermalPart = subsystem.components.find((c) => c.id === 'thermal_pad');

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* Blue Thermal Interface Pad */}
      {thermalPart && (
        <group
          position={[0, 0.8, -3.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(thermalPart);
          }}
        >
          <mesh>
            <boxGeometry args={[4.0, 0.15, 3.0]} />
            <meshStandardMaterial color="#60a5fa" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* Anodized 6063 Aluminum Extruded Sleeve Enclosure */}
      <mesh position={[0, 0, 0.5]}>
        <boxGeometry args={[8.8, 2.5, 13.5]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.25}
          metalness={0.85}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}
