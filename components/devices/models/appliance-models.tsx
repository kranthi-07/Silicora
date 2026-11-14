'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import { CalloutBadge3D } from './callout-badge-3d';

interface ApplianceModelProps {
  explodeFactor: number;
  selectedSubsystemId: string | null;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
  subsystems: DeviceSubsystem[];
}

// =============================================================
// 1. REFRIGERATOR MODEL (Reference Image 1: Cutaway Architecture)
// =============================================================
export function Refrigerator3DModel({
  explodeFactor,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
  subsystems,
}: ApplianceModelProps) {
  const invSub = subsystems.find((s) => s.id === 'ref_inverter_board');
  const compSub = subsystems.find((s) => s.id === 'ref_compressor');
  const mcuSub = subsystems.find((s) => s.id === 'ref_mcu_board');

  const compGroup = useRef<THREE.Group>(null);
  const doorGroup = useRef<THREE.Group>(null);
  const condenserGroup = useRef<THREE.Group>(null);

  // Separation animation on explode
  useFrame((_, delta) => {
    const f = Math.min(1, delta * 12);
    if (doorGroup.current) {
      doorGroup.current.position.x = THREE.MathUtils.lerp(doorGroup.current.position.x, 3.5 * explodeFactor, f);
      doorGroup.current.position.z = THREE.MathUtils.lerp(doorGroup.current.position.z, 2.5 * explodeFactor, f);
    }
    if (condenserGroup.current) {
      condenserGroup.current.position.z = THREE.MathUtils.lerp(condenserGroup.current.position.z, -3.0 * explodeFactor, f);
    }
    if (compGroup.current) {
      compGroup.current.position.y = THREE.MathUtils.lerp(compGroup.current.position.y, -1.5 * explodeFactor, f);
    }
  });

  const greenBadge = '#65a30d';
  const greenBorder = '#84cc16';

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 16, Math.PI / 4, 0]}>
      {/* 1. OUTER CABINET WITH CUTAWAY & INSULATION (Reference Image 1) */}
      <group position={[0, 0, 0]}>
        {/* Right & Rear Outer White Inox Skin */}
        <mesh position={[2.5, 0, 0]}>
          <boxGeometry args={[5, 17, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh position={[-2.5, 0, -2.5]}>
          <boxGeometry args={[5, 17, 3]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.4} />
        </mesh>

        {/* Top Outer Cap */}
        <mesh position={[0, 8.5, 0]}>
          <boxGeometry args={[10, 0.6, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        {/* Cutaway Wall Edge: Yellow Polyurethane Foam Insulation (Image 1: Inox Insulation) */}
        <mesh position={[-4.7, 0, 1.0]}>
          <boxGeometry args={[0.6, 16.4, 6.0]} />
          <meshStandardMaterial color="#facc15" roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[0, 8.1, 0]}>
          <boxGeometry args={[9.4, 0.4, 7.4]} />
          <meshStandardMaterial color="#facc15" roughness={0.7} metalness={0.1} />
        </mesh>

        {/* White Molded Plastic Food Compartment Liner (Image 1: Plastic) */}
        <mesh position={[-0.8, -0.5, 0.5]}>
          <boxGeometry args={[6.6, 15.2, 6.6]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Interior Horizontal Shelves (3 Food Racks) */}
        {[-3.2, -0.6, 2.0].map((y, idx) => (
          <group key={idx} position={[-0.8, y, 0.6]}>
            <mesh>
              <boxGeometry args={[6.2, 0.12, 6.2]} />
              <meshPhysicalMaterial
                color="#38bdf8"
                roughness={0.1}
                transmission={0.8}
                ior={1.5}
                reflectivity={0.8}
              />
            </mesh>
            {/* Front Shelf White Trim */}
            <mesh position={[0, 0, 3.1]}>
              <boxGeometry args={[6.2, 0.2, 0.15]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Bottom Food Storage Crisper Bins */}
        <mesh position={[-0.8, -5.8, 0.6]}>
          <boxGeometry args={[6.0, 3.2, 6.0]} />
          <meshPhysicalMaterial
            color="#93c5fd"
            roughness={0.15}
            transmission={0.65}
            ior={1.4}
          />
        </mesh>
      </group>

      {/* 2. TOP FREEZER COMPARTMENT & EVAPORATOR (Image 1: Defrost Heater) */}
      <group position={[-0.8, 5.2, 0.6]}>
        {/* Aluminum Evaporator Box Shell */}
        <mesh>
          <boxGeometry args={[6.0, 3.2, 5.8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Horizontal Cooling Fins */}
        {[-1.0, -0.5, 0, 0.5, 1.0].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <boxGeometry args={[5.8, 0.04, 5.6]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>
        ))}

        {/* Red Defrost Heater Serpentine Tube Loop (Image 1: Defrost Heater) */}
        <group position={[0, -0.8, 2.0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 5.2, 16]} />
            <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 5.2, 16]} />
            <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Temperature Controls Module (Image 1: Temperature Controls) */}
        <group position={[2.4, -0.8, 2.2]}>
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Rotary Dial Knob */}
          <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 24]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* 3. REAR CONDENSER WIRE-GRID (Image 1: Condensator) */}
      <group ref={condenserGroup} position={[0, 0, -4.2]}>
        {/* Black Grid Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[9.2, 16, 0.15]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Serpentine Copper/Steel Refrigerant Coil */}
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={i} position={[0, -7 + i * 1.1, 0.12]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 8.6, 12]} />
            <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* 4. BOTTOM COMPRESSOR & REFRIGERANT LOOP (Image 1: Compressor & Receiver Dryer) */}
      <group
        ref={compGroup}
        position={[0, -6.8, -1.0]}
        onClick={(e) => {
          e.stopPropagation();
          if (compSub) onSelectSubsystem(compSub);
        }}
      >
        {/* Black Hermetic Welded Dome Compressor (Image 1: Compressor) */}
        <group position={[-1.2, 0, 0]}>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[1.5, 32, 24]} />
            <meshStandardMaterial color="#0a0e17" roughness={0.2} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.48, 1.48, 1.4, 32]} />
            <meshStandardMaterial color="#0a0e17" roughness={0.2} metalness={0.85} />
          </mesh>

          {/* Compressor Welded Middle Flange Seam */}
          <mesh position={[0, 0.6, 0]}>
            <torusGeometry args={[1.52, 0.06, 16, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>

          {/* Metal Mounting Feet & Rubber Dampers */}
          {[-1.2, 1.2].map((x, i) => (
            <mesh key={i} position={[x, -0.7, 0]}>
              <boxGeometry args={[0.8, 0.2, 2.2]} />
              <meshStandardMaterial color="#020617" roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Copper Receiver Dryer Filter Canister (Image 1: Receiver Dryer) */}
        <group position={[1.8, 0.4, 0.2]} rotation={[0, 0, -Math.PI / 6]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.28, 1.8, 24]} />
            <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>

        {/* Copper Tubing Loop with Directional Flow Arrows */}
        {/* Hot High-Pressure Discharge Line (Red Flow) */}
        <mesh position={[0.2, 0.8, -0.6]} rotation={[0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.1, 0.1, 2.2, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.4} />
        </mesh>

        {/* Cold Low-Pressure Return Suction Line (Blue Flow) */}
        <mesh position={[-0.2, 1.4, 0.6]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.12, 0.12, 2.8, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* 5. CUTAWAY FRONT DOOR & MAGNETIC GASKET (Image 1: Door & Seal Magnetic) */}
      <group ref={doorGroup} position={[0, 0, 4.2]}>
        {/* Right Half Front Door Panel */}
        <mesh position={[2.5, 0, 0]}>
          <boxGeometry args={[4.8, 17, 0.6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
        </mesh>

        {/* Door Handle */}
        <mesh position={[0.6, 0, 0.5]}>
          <boxGeometry args={[0.3, 5.0, 0.4]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* Dark Magnetic Rubber Seal Gasket (Image 1: Seal Magnetic) */}
        <mesh position={[2.5, 0, -0.32]}>
          <boxGeometry args={[4.7, 16.8, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* 6. BOTTOM LEVELING SCREW LEGS (Image 1: Legs) */}
      {[-4.2, 4.2].map((x, idx) => (
        <group key={idx} position={[x, -8.7, 3.2]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.6, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.15, 24]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* ============================================================= */}
      {/* 7. IN-SCENE GREEN BADGE CALLOUTS (Exact Match for Reference Image 1) */}
      {/* ============================================================= */}
      {/* Inox */}
      <CalloutBadge3D
        text="Inox"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-5.8, 9.2, 0]}
        targetPosition={[-2.5, 8.6, 0]}
      />

      {/* Insulation */}
      <CalloutBadge3D
        text="Insulation"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-6.2, 7.8, 1.2]}
        targetPosition={[-4.7, 7.2, 1.2]}
      />

      {/* Defrost Heater */}
      <CalloutBadge3D
        text="Defrost Heater"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-6.2, 5.6, 2.5]}
        targetPosition={[-1.2, 4.4, 2.6]}
      />

      {/* Temperature Controls */}
      <CalloutBadge3D
        text="Temperature Controls"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-6.5, 4.0, 2.8]}
        targetPosition={[1.6, 4.4, 2.8]}
      />

      {/* Condensator */}
      <CalloutBadge3D
        text="Condensator"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-6.2, 2.0, -3.8]}
        targetPosition={[-4.5, 1.0, -4.1]}
      />

      {/* Door */}
      <CalloutBadge3D
        text="Door"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[6.5, 0.5, 4.5]}
        targetPosition={[4.8, 0, 4.5]}
      />

      {/* Plastic */}
      <CalloutBadge3D
        text="Plastic"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-3.8, -4.2, 3.8]}
        targetPosition={[-0.8, -4.2, 3.8]}
      />

      {/* Receiver Dryer */}
      <CalloutBadge3D
        text="Receiver Dryer"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-5.8, -5.8, 0.5]}
        targetPosition={[1.8, -6.4, -0.8]}
      />

      {/* Compressor */}
      <CalloutBadge3D
        text="Compressor"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-5.8, -7.2, -0.5]}
        targetPosition={[-1.2, -6.8, -1.0]}
        onClick={() => {
          if (compSub) onSelectSubsystem(compSub);
        }}
      />

      {/* Seal Magnetic */}
      <CalloutBadge3D
        text="Seal Magnetic"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[0.5, -8.2, 4.6]}
        targetPosition={[0.8, -7.5, 4.1]}
      />

      {/* Legs */}
      <CalloutBadge3D
        text="Legs"
        badgeColor={greenBadge}
        borderColor={greenBorder}
        position={[-5.5, -9.4, 3.5]}
        targetPosition={[-4.2, -8.8, 3.2]}
      />
    </group>
  );
}

// =============================================================
// 2. WASHING MACHINE MODEL (Cabinet, Drum, Direct Drive Motor)
// =============================================================
export function WashingMachine3DModel({
  explodeFactor,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
  subsystems,
}: ApplianceModelProps) {
  const pwrSub = subsystems.find((s) => s.id === 'wm_power_board');
  const motorSub = subsystems.find((s) => s.id === 'wm_dd_motor');
  const sensSub = subsystems.find((s) => s.id === 'wm_sensors');

  const pwrGroup = useRef<THREE.Group>(null);
  const motorGroup = useRef<THREE.Group>(null);
  const sensGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const f = Math.min(1, delta * 12);
    if (pwrGroup.current) pwrGroup.current.position.y = THREE.MathUtils.lerp(pwrGroup.current.position.y, 4.0 * explodeFactor, f);
    if (sensGroup.current) sensGroup.current.position.y = THREE.MathUtils.lerp(sensGroup.current.position.y, -4.0 * explodeFactor, f);
  });

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 10, Math.PI / 5, 0]}>
      {/* Outer Steel Cabinet & Front Circular Porthole Door */}
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[11, 13, 11]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} transparent opacity={0.25} />
        </mesh>
        {/* Front Circular Porthole Glass Door */}
        <mesh position={[0, 0, 5.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[3.4, 3.4, 0.5, 32]} />
          <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Tempered Glass Window */}
        <mesh position={[0, 0, 5.85]}>
          <circleGeometry args={[2.5, 32]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.7} roughness={0.1} />
        </mesh>

        {/* Stainless Steel Perforated Drum Inside */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[4.2, 4.2, 6.5, 32]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* 36-Pole Outer-Rotor Direct Drive Motor (Rear) */}
      <group
        ref={motorGroup}
        position={[0, 0, -4.5]}
        onClick={(e) => {
          e.stopPropagation();
          if (motorSub) onSelectSubsystem(motorSub);
        }}
      >
        {/* 36-Pole Copper-Wound Stator Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 4.2, 36]} />
          <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Rotating Permanent Magnet Outer Bell Rotor */}
        <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[4.4, 4.4, 0.8, 36]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Top Inverter Power PCB */}
      <group
        ref={pwrGroup}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (pwrSub) onSelectSubsystem(pwrSub);
        }}
      >
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[8.5, 0.16, 5.5]} />
          <meshStandardMaterial color="#1e40af" roughness={0.3} />
        </mesh>
      </group>

      {/* Bottom Sensors & Drain Pump */}
      <group
        ref={sensGroup}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (sensSub) onSelectSubsystem(sensSub);
        }}
      >
        <mesh position={[0, -4.5, 0]}>
          <boxGeometry args={[7.5, 0.14, 4.5]} />
          <meshStandardMaterial color="#6b21a8" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// =============================================================
// 3. 55" 4K HDR TELEVISION MODEL (Screen, SMPS, Mainboard, T-CON)
// =============================================================
export function Television3DModel({
  explodeFactor,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
  subsystems,
}: ApplianceModelProps) {
  const smpsSub = subsystems.find((s) => s.id === 'tv_smps');
  const mbSub = subsystems.find((s) => s.id === 'tv_mainboard');
  const tconSub = subsystems.find((s) => s.id === 'tv_tcon');
  const panelSub = subsystems.find((s) => s.id === 'tv_panel');

  const smpsGroup = useRef<THREE.Group>(null);
  const mbGroup = useRef<THREE.Group>(null);
  const tconGroup = useRef<THREE.Group>(null);
  const panelGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const f = Math.min(1, delta * 12);
    if (smpsGroup.current) smpsGroup.current.position.y = THREE.MathUtils.lerp(smpsGroup.current.position.y, 3.5 * explodeFactor, f);
    if (mbGroup.current) mbGroup.current.position.y = THREE.MathUtils.lerp(mbGroup.current.position.y, -3.5 * explodeFactor, f);
  });

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 12, Math.PI / 6, 0]}>
      {/* 55" 16:9 4K Liquid Crystal Display Glass Panel & Frame */}
      <group position={[0, 0, 1.5]}>
        {/* Outer Frame with Razor-Thin Bezels */}
        <mesh>
          <boxGeometry args={[22, 12.5, 0.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Glowing 4K HDR Liquid Crystal Active Surface */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[21.4, 11.9, 0.02]} />
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#312e81"
            emissiveIntensity={0.6}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Direct-Lit LED Backlight Grid (behind LCD panel) */}
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[21.5, 12.0, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* LED Backlight Emitter Diodes Array */}
        {[-8, -4, 0, 4, 8].map((x) =>
          [-4, 0, 4].map((y) => (
            <mesh key={`${x}_${y}`} position={[x, y, 0.25]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* High-Voltage SMPS Power Supply Board (Left Rear) */}
      <group
        ref={smpsGroup}
        position={[-5.5, 0, -2.5]}
        onClick={(e) => {
          e.stopPropagation();
          if (smpsSub) onSelectSubsystem(smpsSub);
        }}
      >
        <mesh>
          <boxGeometry args={[7.5, 0.16, 8.5]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} />
        </mesh>
        {/* Resonant LLC High-Voltage Transformer (Yellow Ferrite) */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[2.5, 1.8, 2.5]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Aluminum Heatsinks for PFC/LLC MOSFETs */}
        <mesh position={[-2.2, 0.8, 0]}>
          <boxGeometry args={[1.0, 1.4, 6.0]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* 4K Smart Video Mainboard (Right Rear) */}
      <group
        ref={mbGroup}
        position={[5.5, 0, -2.5]}
        onClick={(e) => {
          e.stopPropagation();
          if (mbSub) onSelectSubsystem(mbSub);
        }}
      >
        <mesh>
          <boxGeometry args={[7.0, 0.16, 8.5]} />
          <meshStandardMaterial color="#1e40af" roughness={0.3} />
        </mesh>
        {/* 4K Video Processor SoC with Aluminum Heatsink */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[2.0, 0.8, 2.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* 4x HDMI 2.1 Receptacles on side edge */}
        <mesh position={[3.6, 0.3, 0]}>
          <boxGeometry args={[0.5, 0.4, 5.0]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
      </group>

      {/* T-CON (Timing Controller) Board (Center Top/Bottom) */}
      <group
        ref={tconGroup}
        position={[0, 0, -1.8]}
        onClick={(e) => {
          e.stopPropagation();
          if (tconSub) onSelectSubsystem(tconSub);
        }}
      >
        <mesh position={[0, -4.5, 0]}>
          <boxGeometry args={[6.5, 0.12, 1.8]} />
          <meshStandardMaterial color="#047857" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
