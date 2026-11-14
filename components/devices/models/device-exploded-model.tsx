'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceItem, DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import { Smartphone3DModel } from './smartphone-model';
import { Powerbank3DModel } from './powerbank-model';
import { Laptop3DModel } from './laptop-model';
import { Refrigerator3DModel, WashingMachine3DModel, Television3DModel } from './appliance-models';

interface DeviceExplodedModelProps {
  device: DeviceItem;
  explodePercent: number; // 0 to 100
  selectedSubsystemId: string | null;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
}

export function DeviceExplodedModel({
  device,
  explodePercent,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
}: DeviceExplodedModelProps) {
  const explodeFactor = explodePercent / 100;

  // 1. 5G Flagship Smartphone
  if (device.id === 'device_smartphone') {
    return (
      <Smartphone3DModel
        explodeFactor={explodeFactor}
        selectedSubsystemId={selectedSubsystemId}
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        onSelectSubsystem={onSelectSubsystem}
        subsystems={device.subsystems}
      />
    );
  }

  // 2. 65W Fast-Charge Power Bank
  if (device.id === 'device_powerbank') {
    return (
      <Powerbank3DModel
        explodeFactor={explodeFactor}
        selectedSubsystemId={selectedSubsystemId}
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        onSelectSubsystem={onSelectSubsystem}
        subsystems={device.subsystems}
      />
    );
  }

  // 3. High-Performance Ultrabook Laptop
  if (device.id === 'device_laptop') {
    return (
      <Laptop3DModel
        explodeFactor={explodeFactor}
        selectedSubsystemId={selectedSubsystemId}
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        onSelectSubsystem={onSelectSubsystem}
        subsystems={device.subsystems}
      />
    );
  }

  // 4. Inverter Refrigerator
  if (device.id === 'device_refrigerator') {
    return (
      <Refrigerator3DModel
        explodeFactor={explodeFactor}
        selectedSubsystemId={selectedSubsystemId}
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        onSelectSubsystem={onSelectSubsystem}
        subsystems={device.subsystems}
      />
    );
  }

  // 5. Direct-Drive Washing Machine
  if (device.id === 'device_washingmachine') {
    return (
      <WashingMachine3DModel
        explodeFactor={explodeFactor}
        selectedSubsystemId={selectedSubsystemId}
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        onSelectSubsystem={onSelectSubsystem}
        subsystems={device.subsystems}
      />
    );
  }

  // 6. 55" 4K Smart Television
  if (device.id === 'device_television') {
    return (
      <Television3DModel
        explodeFactor={explodeFactor}
        selectedSubsystemId={selectedSubsystemId}
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        onSelectSubsystem={onSelectSubsystem}
        subsystems={device.subsystems}
      />
    );
  }

  // Generic Fallback
  return (
    <group position={[0, 0, 0]}>
      {device.subsystems.map((subsystem) => (
        <SubsystemMeshGroup
          key={subsystem.id}
          subsystem={subsystem}
          explodeFactor={explodeFactor}
          isSelectedSubsystem={selectedSubsystemId === subsystem.id}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      ))}
    </group>
  );
}

function SubsystemMeshGroup({
  subsystem,
  explodeFactor,
  isSelectedSubsystem,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
}: {
  subsystem: DeviceSubsystem;
  explodeFactor: number;
  isSelectedSubsystem: boolean;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Target translation from separationVector
  const targetX = (subsystem.separationVector[0] / 10) * explodeFactor;
  const targetY = (subsystem.separationVector[1] / 10) * explodeFactor;
  const targetZ = (subsystem.separationVector[2] / 10) * explodeFactor;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const factor = Math.min(1, delta * 12);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, factor);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, factor);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, factor);
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* Subsystem Base Plate Carrier */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 0.15, 8]} />
        <meshStandardMaterial
          color={subsystem.color}
          roughness={0.4}
          metalness={0.6}
          transparent
          opacity={isSelectedSubsystem ? 0.9 : 0.45}
        />
      </mesh>

      {/* Subsystem Component Chips & ICs */}
      {subsystem.components.map((part) => {
        const isPartSelected = selectedPartId === part.id;
        const posX = part.positionMm[0] / 10;
        const posY = 0.15 + part.dimensionsMm[2] / 20;
        const posZ = part.positionMm[1] / 10;

        const dimX = Math.max(0.6, part.dimensionsMm[0] / 10);
        const dimY = Math.max(0.2, part.dimensionsMm[2] / 10);
        const dimZ = Math.max(0.6, part.dimensionsMm[1] / 10);

        return (
          <group
            key={part.id}
            position={[posX, posY, posZ]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart(part);
            }}
          >
            <mesh>
              <boxGeometry args={[dimX, dimY, dimZ]} />
              <meshStandardMaterial
                color={isPartSelected ? '#38BDF8' : part.color}
                roughness={0.25}
                metalness={0.7}
                emissive={isPartSelected ? '#0284C7' : '#000000'}
                emissiveIntensity={isPartSelected ? 0.6 : 0}
              />
            </mesh>

            {/* Selection Wireframe Glow */}
            {isPartSelected && (
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(dimX * 1.05, dimY * 1.05, dimZ * 1.05)]} />
                <lineBasicMaterial color="#38BDF8" linewidth={2} />
              </lineSegments>
            )}
          </group>
        );
      })}
    </group>
  );
}
