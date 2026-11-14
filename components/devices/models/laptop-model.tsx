'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import { CalloutBadge3D } from './callout-badge-3d';

interface LaptopModelProps {
  explodeFactor: number;
  selectedSubsystemId: string | null;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
  subsystems: DeviceSubsystem[];
}

export function Laptop3DModel({
  explodeFactor,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
  subsystems,
}: LaptopModelProps) {
  const mbSub = subsystems.find((s) => s.id === 'lp_motherboard');
  const thermalSub = subsystems.find((s) => s.id === 'lp_thermal');
  const battSub = subsystems.find((s) => s.id === 'lp_battery');

  const displayGroup = useRef<THREE.Group>(null);
  const keyboardGroup = useRef<THREE.Group>(null);
  const bottomGroup = useRef<THREE.Group>(null);

  // Smooth exploded view translation
  useFrame((_, delta) => {
    const f = Math.min(1, delta * 12);
    if (displayGroup.current) {
      displayGroup.current.position.y = THREE.MathUtils.lerp(displayGroup.current.position.y, 6.5 * explodeFactor, f);
      displayGroup.current.position.z = THREE.MathUtils.lerp(displayGroup.current.position.z, -5.0 * explodeFactor, f);
    }
    if (keyboardGroup.current) {
      keyboardGroup.current.position.y = THREE.MathUtils.lerp(keyboardGroup.current.position.y, 3.2 * explodeFactor, f);
    }
    if (bottomGroup.current) {
      bottomGroup.current.position.y = THREE.MathUtils.lerp(bottomGroup.current.position.y, -3.8 * explodeFactor, f);
    }
  });

  const redBadge = '#991b1b';
  const redBorder = '#ef4444';

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 10, Math.PI / 5, 0]}>
      {/* ======================================================= */}
      {/* 1. DISPLAY SUBASSEMBLY (Reference Image 3: 1, 2, 3, 4, 5, 6) */}
      {/* ======================================================= */}
      <group ref={displayGroup} position={[0, 0, -7.5]} rotation={[-Math.PI / 3, 0, 0]}>
        {/* 3: LCD BACK COVER (Outer Aluminum Lid) */}
        <mesh position={[0, 7.5, -0.6 * explodeFactor]}>
          <boxGeometry args={[22, 15, 0.35]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* 4: HINGES (Left & Right Metal Pivot Brackets) */}
        {[-9.5, 9.5].map((x, i) => (
          <group key={i} position={[x, 0.8, 0]}>
            <mesh>
              <boxGeometry args={[1.4, 1.2, 0.4]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0, 0.3]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 1.4, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
            </mesh>
          </group>
        ))}

        {/* 2: LCD SCREEN (16:10 Active Display Panel) */}
        <mesh position={[0, 7.5, 0.1]}>
          <boxGeometry args={[20.5, 13.5, 0.08]} />
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#312e81"
            emissiveIntensity={0.6}
            roughness={0.1}
          />
        </mesh>

        {/* 1: BEZEL (Front Display Trim with Webcam) */}
        <mesh position={[0, 7.5, 0.25 + 0.8 * explodeFactor]}>
          <boxGeometry args={[21.8, 14.8, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>

        {/* WEBCAM MODULE at top of bezel */}
        <mesh position={[0, 14.4, 0.32 + 0.8 * explodeFactor]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* 5: INVERTER / eDP DISPLAY CONTROLLER BOARD */}
        <mesh position={[0, 0.6, 0.2]}>
          <boxGeometry args={[8.0, 0.6, 0.12]} />
          <meshStandardMaterial color="#15803d" roughness={0.3} />
        </mesh>

        {/* Callout: BEZEL [1] */}
        {explodeFactor > 0.15 && (
          <CalloutBadge3D
            text="BEZEL [1]"
            badgeColor={redBadge}
            borderColor={redBorder}
            position={[13, 14, 0]}
            targetPosition={[10, 14, 0.3]}
          />
        )}

        {/* Callout: LCD SCREEN [2] */}
        {explodeFactor > 0.15 && (
          <CalloutBadge3D
            text="LCD SCREEN [2]"
            badgeColor={redBadge}
            borderColor={redBorder}
            position={[13, 8, 0]}
            targetPosition={[10, 8, 0.1]}
          />
        )}

        {/* Callout: HINGES [4] */}
        {explodeFactor > 0.15 && (
          <CalloutBadge3D
            text="HINGES [4]"
            badgeColor={redBadge}
            borderColor={redBorder}
            position={[13, 1.5, 0]}
            targetPosition={[9.5, 0.8, 0]}
          />
        )}
      </group>

      {/* ======================================================= */}
      {/* 2. KEYBOARD & PALMREST ASSEMBLY (Image 3: 10, 12, 13, 9) */}
      {/* ======================================================= */}
      <group ref={keyboardGroup} position={[0, 0, 0]}>
        {/* 12: PALMREST (Upper Aluminum Chassis Deck) */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[22, 0.25, 15]} />
          <meshStandardMaterial color="#475569" roughness={0.25} metalness={0.8} />
        </mesh>

        {/* 10: KEYBOARD MATRIX (Individual Chiclet Keycaps) */}
        <group position={[0, 0.05, -2.5]}>
          {/* Keyboard Backplate */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[18, 0.08, 7.5]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          {/* Key Rows */}
          {[-2.8, -1.4, 0, 1.4, 2.8].map((z, rowIdx) => (
            <mesh key={rowIdx} position={[0, 0.04, z]}>
              <boxGeometry args={[17.5, 0.08, 1.1]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* 13: PRECISION TOUCHPAD BOARD */}
        <mesh position={[0, 0.02, 4.2]}>
          <boxGeometry args={[8.5, 0.06, 5.2]} />
          <meshStandardMaterial color="#334155" roughness={0.1} metalness={0.3} />
        </mesh>

        {/* 9: STEREO SPEAKERS (Left & Right Acoustic Enclosures) */}
        {[-8.5, 8.5].map((x, idx) => (
          <group key={idx} position={[x, -0.1, 1.0]}>
            <mesh>
              <boxGeometry args={[2.0, 0.35, 4.0]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Callout: KEYBOARD [10] */}
        {explodeFactor > 0.15 && (
          <CalloutBadge3D
            text="KEYBOARD [10]"
            badgeColor={redBadge}
            borderColor={redBorder}
            position={[-14, 0.5, -2.5]}
            targetPosition={[-9, 0.1, -2.5]}
          />
        )}

        {/* Callout: TOUCHPAD [13] */}
        {explodeFactor > 0.15 && (
          <CalloutBadge3D
            text="TOUCHPAD [13]"
            badgeColor={redBadge}
            borderColor={redBorder}
            position={[-14, 0.5, 4.2]}
            targetPosition={[-4.5, 0.1, 4.2]}
          />
        )}
      </group>

      {/* ======================================================= */}
      {/* 3. HEATSINK & CENTRIFUGAL FAN (Image 3: 15) */}
      {/* ======================================================= */}
      {thermalSub && (
        <LaptopThermalLayer
          subsystem={thermalSub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'lp_thermal'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}

      {/* ======================================================= */}
      {/* 4. MAINBOARD & HARDWARE (Image 3: 18, 23, 24, 25, 29) */}
      {/* ======================================================= */}
      {mbSub && (
        <LaptopMotherboardLayer
          subsystem={mbSub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'lp_motherboard'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}

      {/* ======================================================= */}
      {/* 5. BATTERY & BOTTOM COVER (Image 3: 17, 20, 32) */}
      {/* ======================================================= */}
      <group ref={bottomGroup} position={[0, -0.8, 0]}>
        {/* 17: BATTERY PACK */}
        {battSub && (
          <LaptopBatteryLayer
            subsystem={battSub}
            explodeFactor={explodeFactor}
            isSelected={selectedSubsystemId === 'lp_battery'}
            selectedPartId={selectedPartId}
            onSelectPart={onSelectPart}
            onSelectSubsystem={onSelectSubsystem}
          />
        )}

        {/* 20: BOTTOM COVER (Unibody Base Plate with Ventilation Slits) */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[22, 0.35, 15]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Cooling Intake Grille Slats */}
        {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((z, i) => (
          <mesh key={i} position={[0, -0.58, z - 2]}>
            <boxGeometry args={[14, 0.05, 0.3]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
        ))}

        {/* 32: RUBBER FEET (Corner Grip Pads) */}
        {[
          [-9.5, -6.0],
          [9.5, -6.0],
          [-9.5, 6.0],
          [9.5, 6.0],
        ].map(([x, z], idx) => (
          <mesh key={idx} position={[x, -0.62, z]}>
            <cylinderGeometry args={[0.5, 0.5, 0.15, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        ))}

        {/* Callout: BATTERY [17] */}
        {explodeFactor > 0.15 && (
          <CalloutBadge3D
            text="BATTERY [17]"
            badgeColor={redBadge}
            borderColor={redBorder}
            position={[-14, 0, 3.8]}
            targetPosition={[-9.0, 0, 3.8]}
          />
        )}

        {/* Callout: BOTTOM COVER [20] */}
        {explodeFactor > 0.15 && (
          <CalloutBadge3D
            text="BOTTOM COVER [20]"
            badgeColor={redBadge}
            borderColor={redBorder}
            position={[14, -0.4, 0]}
            targetPosition={[11, -0.4, 0]}
          />
        )}
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// HEATSINK & CENTRIFUGAL FAN LAYER (Image 3: 15)
// -------------------------------------------------------------
function LaptopThermalLayer({
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
  const targetY = 1.8 * explodeFactor;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const fanPart = subsystem.components.find((c) => c.id === 'lp_fan');

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* 15: Sintered Copper Dual Heat Pipes */}
      <mesh position={[-1.5, 0.4, -4.5]}>
        <boxGeometry args={[11, 0.25, 1.2]} />
        <meshStandardMaterial color="#b45309" roughness={0.2} metalness={0.95} />
      </mesh>
      {/* Copper Cold Plate CPU Contact Block */}
      <mesh position={[-2.5, 0.35, -3.2]}>
        <boxGeometry args={[3.2, 0.15, 3.2]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* Aluminum Heat Exchanger Fin Stacks at rear vents */}
      <mesh position={[-7.5, 0.45, -6.2]}>
        <boxGeometry args={[3.5, 0.6, 1.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[4.5, 0.45, -6.2]}>
        <boxGeometry args={[3.5, 0.6, 1.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Centrifugal Blower Fan with curved impeller housing */}
      {fanPart && (
        <group
          position={[-7.5, 0.3, -4.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(fanPart);
          }}
        >
          <mesh>
            <cylinderGeometry args={[2.0, 2.0, 0.6, 32]} />
            <meshStandardMaterial
              color={selectedPartId === 'lp_fan' ? '#38bdf8' : '#0f172a'}
              emissive={selectedPartId === 'lp_fan' ? '#0284c7' : '#000000'}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        </group>
      )}

      {/* Right Fan */}
      <group position={[4.5, 0.3, -4.2]}>
        <mesh>
          <cylinderGeometry args={[2.0, 2.0, 0.6, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>

      {/* Callout: HEATSINK & FAN [15] */}
      {explodeFactor > 0.15 && (
        <CalloutBadge3D
          text="HEATSINK & FAN [15]"
          badgeColor="#991b1b"
          borderColor="#ef4444"
          position={[-14, 0.8, -4.5]}
          targetPosition={[-7.5, 0.4, -4.5]}
          onClick={() => {
            if (fanPart) onSelectPart(fanPart);
          }}
        />
      )}
    </group>
  );
}

// -------------------------------------------------------------
// MAINBOARD & PROCESSOR LAYER (Image 3: 18, 23, 24, 25, 29)
// -------------------------------------------------------------
function LaptopMotherboardLayer({
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
  const targetY = 0; // Reference motherboard plane

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const socPart = subsystem.components.find((c) => c.id === 'lp_soc');
  const ssdPart = subsystem.components.find((c) => c.id === 'lp_ssd');

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* 18: MAINBOARD (High-Density Green FR-4 Multi-Layer PCB) */}
      <mesh position={[0, 0, -3.2]}>
        <boxGeometry args={[19.5, 0.15, 6.8]} />
        <meshStandardMaterial color="#15803d" roughness={0.35} metalness={0.3} />
      </mesh>

      {/* 23: CPU / GPU Silicon Processor Die */}
      {socPart && (
        <group
          position={[-2.5, 0.18, -3.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(socPart);
          }}
        >
          <mesh>
            <boxGeometry args={[2.8, 0.18, 3.8]} />
            <meshStandardMaterial
              color={selectedPartId === 'lp_soc' ? '#38bdf8' : '#0f172a'}
              emissive={selectedPartId === 'lp_soc' ? '#0284c7' : '#000000'}
              roughness={0.15}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1.8, 0.05, 2.5]} />
            <meshStandardMaterial color="#1e293b" roughness={0.05} metalness={0.95} />
          </mesh>
        </group>
      )}

      {/* 24: RAM (Dual SO-DIMM Angled Memory Sticks) */}
      <group position={[2.0, 0.16, -3.2]}>
        {[-0.6, 0.6].map((z, i) => (
          <group key={i} position={[0, 0, z]}>
            <mesh>
              <boxGeometry args={[3.2, 0.08, 0.9]} />
              <meshStandardMaterial color="#166534" roughness={0.3} />
            </mesh>
            {/* Memory IC chips on RAM stick */}
            {[-1.0, -0.3, 0.3, 1.0].map((x, j) => (
              <mesh key={j} position={[x, 0.06, 0]}>
                <boxGeometry args={[0.5, 0.06, 0.6]} />
                <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 29: PCIe Gen4 x4 M.2 2280 NVMe SSD Stick */}
      {ssdPart && (
        <group
          position={[6.5, 0.18, -3.0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(ssdPart);
          }}
        >
          <mesh>
            <boxGeometry args={[2.2, 0.12, 5.5]} />
            <meshStandardMaterial
              color={selectedPartId === 'lp_ssd' ? '#38bdf8' : '#166534'}
              emissive={selectedPartId === 'lp_ssd' ? '#0284c7' : '#000000'}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.1, 0.8]}>
            <boxGeometry args={[1.6, 0.1, 1.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
          </mesh>
        </group>
      )}

      {/* 25: MINI PCI WIRELESS BOARD (Wi-Fi 7) */}
      <group position={[-6.0, 0.16, -1.8]}>
        <mesh>
          <boxGeometry args={[1.8, 0.1, 1.8]} />
          <meshStandardMaterial color="#15803d" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[1.4, 0.06, 1.4]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* Callout: MAINBOARD [18] */}
      {explodeFactor > 0.15 && (
        <CalloutBadge3D
          text="MAINBOARD [18]"
          badgeColor="#991b1b"
          borderColor="#ef4444"
          position={[14, 0.2, -5.5]}
          targetPosition={[9.5, 0.1, -4.5]}
        />
      )}

      {/* Callout: CPU [23] */}
      {explodeFactor > 0.15 && (
        <CalloutBadge3D
          text="CPU [23]"
          badgeColor="#991b1b"
          borderColor="#ef4444"
          position={[-14, 0.2, -1.0]}
          targetPosition={[-2.5, 0.2, -3.2]}
          onClick={() => {
            if (socPart) onSelectPart(socPart);
          }}
        />
      )}

      {/* Callout: RAM [24] */}
      {explodeFactor > 0.15 && (
        <CalloutBadge3D
          text="RAM [24]"
          badgeColor="#991b1b"
          borderColor="#ef4444"
          position={[14, 0.2, -2.5]}
          targetPosition={[2.0, 0.2, -3.2]}
        />
      )}
    </group>
  );
}

// -------------------------------------------------------------
// BATTERY PACK LAYER (Image 3: 17)
// -------------------------------------------------------------
function LaptopBatteryLayer({
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
  const cellsPart = subsystem.components.find((c) => c.id === 'lp_cells');
  const isPartSelected = selectedPartId === 'lp_cells';

  return (
    <group
      position={[0, 0.4, 4.0]}
      onClick={(e) => {
        if (cellsPart) {
          e.stopPropagation();
          onSelectPart(cellsPart);
        } else {
          e.stopPropagation();
          onSelectSubsystem(subsystem);
        }
      }}
    >
      {/* 17: BATTERY (75Wh 4-Cell Flat Pouch Array) */}
      <mesh>
        <boxGeometry args={[18.5, 0.4, 5.8]} />
        <meshStandardMaterial
          color={isPartSelected ? '#38bdf8' : '#0f172a'}
          emissive={isPartSelected ? '#0284c7' : '#000000'}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* 4 Cell Division Lines */}
      {[-4.5, 0, 4.5].map((x, i) => (
        <mesh key={i} position={[x, 0.22, 0]}>
          <boxGeometry args={[0.1, 0.04, 5.5]} />
          <meshBasicMaterial color="#334155" />
        </mesh>
      ))}

      {/* Laser Specs Label */}
      <mesh position={[0, 0.22, -1.2]}>
        <planeGeometry args={[10, 1.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
