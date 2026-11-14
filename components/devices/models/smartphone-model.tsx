'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import { CalloutBadge3D } from './callout-badge-3d';

interface SmartphoneModelProps {
  explodeFactor: number;
  selectedSubsystemId: string | null;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
  subsystems: DeviceSubsystem[];
}

export function Smartphone3DModel({
  explodeFactor,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
  subsystems,
}: SmartphoneModelProps) {
  const displaySub = subsystems.find((s) => s.id === 'sub_display');
  const logicSub = subsystems.find((s) => s.id === 'sub_logic_board');
  const batterySub = subsystems.find((s) => s.id === 'sub_battery');
  const chassisSub = subsystems.find((s) => s.id === 'sub_chassis');

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 10, Math.PI / 4, 0]}>
      {/* 1. GLASS DISPLAY LAYER (Image 2: Top Floating Beveled Glass with Neon Glow) */}
      {displaySub && (
        <SmartphoneDisplayLayer
          subsystem={displaySub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'sub_display'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}

      {/* 2. LI-ION POLYMER BATTERY PACK (Image 2: Metallic Foil with Laser Markings) */}
      {batterySub && (
        <SmartphoneBatteryLayer
          subsystem={batterySub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'sub_battery'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}

      {/* 3. STACKED LOGIC BOARD & PROCESSOR CHIP (Image 2: Golden Glowing Core) */}
      {logicSub && (
        <SmartphoneLogicBoardLayer
          subsystem={logicSub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'sub_logic_board'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}

      {/* 4. CHASSIS UNIBODY & VAPOR CHAMBER (Image 2: Mirror Polished Rails & Drilled Ports) */}
      {chassisSub && (
        <SmartphoneChassisLayer
          subsystem={chassisSub}
          explodeFactor={explodeFactor}
          isSelected={selectedSubsystemId === 'sub_chassis'}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          onSelectSubsystem={onSelectSubsystem}
        />
      )}
    </group>
  );
}

// -------------------------------------------------------------
// 1. DISPLAY LAYER (Reference Image 2: GLASS DISPLAY)
// -------------------------------------------------------------
function SmartphoneDisplayLayer({
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
  const targetY = 6.2 * explodeFactor;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const ddicPart = subsystem.components.find((c) => c.id === 'oled_ddic');
  const fprintPart = subsystem.components.find((c) => c.id === 'fprint_sensor');

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* Front Protective Cover Glass with curved perimeter chamfer */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[7.4, 0.08, 15.6]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.03}
          metalness={0.2}
          transmission={0.4}
          ior={1.52}
          reflectivity={0.9}
        />
      </mesh>

      {/* Polished Glass Bevel Edge Highlight */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[7.42, 0.01, 15.62]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Active AMOLED Screen with Glowing Violet/Cyan Diagonal Light Beam (Image 2) */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[7.0, 0.01, 15.0]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#312e81"
          emissiveIntensity={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Diagonal Neon Light Streak 1 (Cyan) */}
      <mesh position={[-1.2, 0.11, -1.0]} rotation={[-Math.PI / 2, 0, Math.PI / 5]}>
        <planeGeometry args={[2.5, 12]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Diagonal Neon Light Streak 2 (Vibrant Violet / Magenta) */}
      <mesh position={[1.0, 0.11, 0.5]} rotation={[-Math.PI / 2, 0, Math.PI / 5]}>
        <planeGeometry args={[3.2, 13]} />
        <meshBasicMaterial
          color="#d946ef"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top Earpiece Speaker Slit & Sensor Notch */}
      <mesh position={[0, 0.12, -7.3]}>
        <boxGeometry args={[1.8, 0.02, 0.12]} />
        <meshBasicMaterial color="#020617" />
      </mesh>

      {/* Front Camera Punch-Hole & Lens Reflection */}
      <mesh position={[0, 0.12, -6.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 32]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <mesh position={[0.04, 0.122, -6.64]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* 3D Ultrasonic Under-Display Fingerprint Sensor */}
      {fprintPart && (
        <group
          position={[0, -0.04, 4.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(fprintPart);
          }}
        >
          <mesh>
            <boxGeometry args={[1.6, 0.04, 1.6]} />
            <meshStandardMaterial
              color={selectedPartId === 'fprint_sensor' ? '#38bdf8' : '#0284c7'}
              emissive={selectedPartId === 'fprint_sensor' ? '#00e5ff' : '#000000'}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
        </group>
      )}

      {/* Display Driver IC (DDIC) Chip-on-Film at bottom chin */}
      {ddicPart && (
        <group
          position={[0, -0.05, 6.8]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(ddicPart);
          }}
        >
          <mesh>
            <boxGeometry args={[4.2, 0.04, 1.2]} />
            <meshStandardMaterial color="#ea580c" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[2.4, 0.08, 0.6]} />
            <meshStandardMaterial
              color={selectedPartId === 'oled_ddic' ? '#38bdf8' : '#0f172a'}
              emissive={selectedPartId === 'oled_ddic' ? '#0284c7' : '#000000'}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Floating In-Scene Callout Label (Image 2: GLASS DISPLAY) */}
      {explodeFactor > 0.15 && (
        <CalloutBadge3D
          text="GLASS DISPLAY"
          subtext="Super Retina XDR // 120Hz"
          badgeColor="#0f172a"
          borderColor="#38bdf8"
          textColor="#ffffff"
          position={[-6.2, 0, -2.5]}
          targetPosition={[-3.6, 0.08, -2.5]}
          onClick={() => onSelectSubsystem(subsystem)}
        />
      )}
    </group>
  );
}

// -------------------------------------------------------------
// 2. BATTERY LAYER (Reference Image 2: BATTERY)
// -------------------------------------------------------------
function SmartphoneBatteryLayer({
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
  const targetY = 3.2 * explodeFactor;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const cellPart = subsystem.components.find((c) => c.id === 'batt_cell');
  const bmsPart = subsystem.components.find((c) => c.id === 'bms_fuel_gauge');
  const isPartSelected = selectedPartId === 'batt_cell';

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* 4500mAh Li-Po Pouch Cell (Image 2: Sleek metallic pouch with laser etched specs) */}
      <group
        position={[-0.8, 0, 0.8]}
        onClick={(e) => {
          if (cellPart) {
            e.stopPropagation();
            onSelectPart(cellPart);
          }
        }}
      >
        {/* Main Battery Pouch Body with metallic cyan edge sheen */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.2, 0.42, 9.4]} />
          <meshStandardMaterial
            color={isPartSelected ? '#38bdf8' : '#1e293b'}
            roughness={0.25}
            metalness={0.7}
            emissive={isPartSelected ? '#0284c7' : '#000000'}
          />
        </mesh>

        {/* Cyan Neon Edge Glow Rim (Image 2) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.28, 0.44, 9.48]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.6}
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>

        {/* Matte Black Printed Top Skin */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[4.8, 0.01, 8.8]} />
          <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Laser-Etched Text Stripe 1: Model & Chemistry */}
        <mesh position={[0, 0.23, -2.4]}>
          <planeGeometry args={[3.8, 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>

        {/* Laser-Etched Text Stripe 2: Voltage & Watt-Hours (3.82V === 11.1Wh) */}
        <mesh position={[0, 0.23, -1.2]}>
          <planeGeometry args={[3.2, 0.4]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.65} />
        </mesh>

        {/* Laser-Etched Warning Box & Caution Sign (Image 4) */}
        <mesh position={[0, 0.23, 0.8]}>
          <planeGeometry args={[3.6, 1.2]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.45} />
        </mesh>

        {/* Gold Adhesive Pull Tab at Bottom */}
        <mesh position={[0, 0.24, 4.4]}>
          <boxGeometry args={[2.2, 0.02, 0.8]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* FPC Flex Connector Ribbon */}
        <mesh position={[2.1, 0.26, -4.2]}>
          <boxGeometry args={[1.4, 0.04, 0.7]} />
          <meshStandardMaterial color="#ea580c" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Battery BMS Protection Board */}
        {bmsPart && (
          <group
            position={[1.6, 0.26, -3.2]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart(bmsPart);
            }}
          >
            <mesh>
              <boxGeometry args={[1.2, 0.08, 0.7]} />
              <meshStandardMaterial
                color={selectedPartId === 'bms_fuel_gauge' ? '#38bdf8' : '#16a34a'}
                emissive={selectedPartId === 'bms_fuel_gauge' ? '#0284c7' : '#000000'}
                roughness={0.3}
              />
            </mesh>
          </group>
        )}
      </group>

      {/* Floating In-Scene Callout Label (Image 2: BATTERY) */}
      {explodeFactor > 0.15 && (
        <CalloutBadge3D
          text="BATTERY"
          subtext="4500 mAh // 17.5 Wh"
          badgeColor="#075985"
          borderColor="#38bdf8"
          textColor="#ffffff"
          position={[-6.2, 0, 1.2]}
          targetPosition={[-3.4, 0.2, 1.2]}
          onClick={() => onSelectSubsystem(subsystem)}
        />
      )}
    </group>
  );
}

// -------------------------------------------------------------
// 3. LOGIC BOARD & PROCESSOR (Reference Image 2: PROCESSOR CHIP & CAMERA MODULE)
// -------------------------------------------------------------
function SmartphoneLogicBoardLayer({
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
  const targetY = 0; // Reference plane

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const socPart = subsystem.components.find((c) => c.id === 'soc_ap');
  const storagePart = subsystem.components.find((c) => c.id === 'storage_ufs');
  const pmicPart = subsystem.components.find((c) => c.id === 'main_pmic');
  const modemPart = subsystem.components.find((c) => c.id === 'modem_rf');
  const wifiPart = subsystem.components.find((c) => c.id === 'wifi_bt');
  const camPart = subsystem.components.find((c) => c.id === 'cam_module');

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* L-Shaped Substrate-Like PCB (Motherboard Main Upper Section) */}
      <mesh position={[0, 0, -4.5]}>
        <boxGeometry args={[7.0, 0.12, 6.0]} />
        <meshStandardMaterial color="#064e3b" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Right Edge Spine Section */}
      <mesh position={[2.6, 0, 0.5]}>
        <boxGeometry args={[1.8, 0.12, 4.0]} />
        <meshStandardMaterial color="#064e3b" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Bottom Sub-board */}
      <mesh position={[0, 0, 6.4]}>
        <boxGeometry args={[7.0, 0.12, 2.0]} />
        <meshStandardMaterial color="#064e3b" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Gold-Plated Perimeter Ground Ring */}
      <mesh position={[-3.45, 0.02, -4.5]}>
        <boxGeometry args={[0.08, 0.14, 5.8]} />
        <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Stamped Silver EMI Shielding Cans with Micro-Ventilation Holes */}
      <mesh position={[0.2, 0.12, -4.6]}>
        <boxGeometry args={[4.2, 0.16, 4.4]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.88} />
      </mesh>
      <mesh position={[-2.3, 0.12, -3.2]}>
        <boxGeometry args={[1.8, 0.16, 2.8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.88} />
      </mesh>

      {/* 3nm PROCESSOR CHIP (Image 2: Radiant Glowing Core with Warm Volumetric Light) */}
      {socPart && (
        <group
          position={[0.2, 0.22, -4.6]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(socPart);
          }}
        >
          {/* Main Silicon Chip Carrier */}
          <mesh>
            <boxGeometry args={[1.6, 0.16, 1.6]} />
            <meshStandardMaterial
              color={selectedPartId === 'soc_ap' ? '#38bdf8' : '#0f172a'}
              emissive={selectedPartId === 'soc_ap' ? '#0284c7' : '#000000'}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>

          {/* Glowing Processor Core Die (Image 2: Amber/Gold Radiance) */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1.2, 0.04, 1.2]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={2.5}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          {/* Active Warm Point Light illuminating surrounding circuits */}
          <pointLight position={[0, 0.5, 0]} color="#f59e0b" intensity={3.5} distance={7} />

          {/* Concentric Gold Circuit Traces on Die Face */}
          <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshBasicMaterial color="#ffffff" wireframe />
          </mesh>
        </group>
      )}

      {/* Floating In-Scene Callout Label (Image 2: PROCESSOR CHIP) */}
      {explodeFactor > 0.15 && (
        <CalloutBadge3D
          text="PROCESSOR CHIP"
          subtext="3nm Octa-Core // 45 TOPS NPU"
          badgeColor="#78350f"
          borderColor="#f59e0b"
          textColor="#ffffff"
          position={[-6.2, 0.2, -3.8]}
          targetPosition={[-0.8, 0.24, -4.6]}
          onClick={() => {
            if (socPart) onSelectPart(socPart);
          }}
        />
      )}

      {/* 512GB UFS 4.0 Storage */}
      {storagePart && (
        <group
          position={[-0.4, 0.22, -2.8]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(storagePart);
          }}
        >
          <mesh>
            <boxGeometry args={[1.2, 0.12, 1.4]} />
            <meshStandardMaterial
              color={selectedPartId === 'storage_ufs' ? '#38bdf8' : '#1e293b'}
              emissive={selectedPartId === 'storage_ufs' ? '#0284c7' : '#000000'}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Primary PMIC Power Management IC */}
      {pmicPart && (
        <group
          position={[-1.2, 0.22, -3.6]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(pmicPart);
          }}
        >
          <mesh>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial
              color={selectedPartId === 'main_pmic' ? '#38bdf8' : '#334155'}
              emissive={selectedPartId === 'main_pmic' ? '#0284c7' : '#000000'}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
        </group>
      )}

      {/* 5G Baseband Modem */}
      {modemPart && (
        <group
          position={[1.6, 0.22, -3.6]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(modemPart);
          }}
        >
          <mesh>
            <boxGeometry args={[1.2, 0.1, 1.2]} />
            <meshStandardMaterial
              color={selectedPartId === 'modem_rf' ? '#38bdf8' : '#1e293b'}
              emissive={selectedPartId === 'modem_rf' ? '#0284c7' : '#000000'}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
        </group>
      )}

      {/* Wi-Fi 7 + BT 5.4 Module */}
      {wifiPart && (
        <group
          position={[2.4, 0.22, -2.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(wifiPart);
          }}
        >
          <mesh>
            <boxGeometry args={[0.8, 0.1, 0.8]} />
            <meshStandardMaterial
              color={selectedPartId === 'wifi_bt' ? '#38bdf8' : '#334155'}
              emissive={selectedPartId === 'wifi_bt' ? '#0284c7' : '#000000'}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* ======================================================= */}
      {/* 4. CAMERA MODULE & EXPLODED OPTICAL LENSES (Images 2 & 4) */}
      {/* ======================================================= */}
      <group
        position={[-2.2, 0.35, -5.5]}
        onClick={(e) => {
          if (camPart) {
            e.stopPropagation();
            onSelectPart(camPart);
          }
        }}
      >
        {/* Raised Camera Island Housing */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.45, 3.2]} />
          <meshStandardMaterial
            color={selectedPartId === 'cam_module' ? '#38bdf8' : '#0f172a'}
            emissive={selectedPartId === 'cam_module' ? '#0284c7' : '#000000'}
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Primary 50MP Wide Camera Exploded Lens Stack (Reference Image 4) */}
        <group position={[0, 0.25, -0.7]}>
          {/* Lens Element 1: Sapphire Front Protection Disc */}
          <mesh
            position={[0, 0.2 + 2.2 * explodeFactor, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              roughness={0.05}
              transmission={0.85}
              ior={1.77}
              reflectivity={0.9}
            />
          </mesh>

          {/* Lens Element 2: Convex Glass Lens */}
          <mesh
            position={[0, 0.2 + 1.7 * explodeFactor, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <sphereGeometry args={[0.48, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial
              color="#93c5fd"
              roughness={0.05}
              transmission={0.85}
              ior={1.62}
            />
          </mesh>

          {/* Lens Element 3: Golden Voice Coil Motor (VCM) Copper Wire Ring (Image 4) */}
          <mesh
            position={[0, 0.2 + 1.3 * explodeFactor, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.46, 0.06, 16, 32]} />
            <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Lens Element 4: Black Aperture Diaphragm Spacer Ring */}
          <mesh
            position={[0, 0.2 + 0.9 * explodeFactor, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.25, 0.5, 32]} />
            <meshStandardMaterial color="#020617" roughness={0.4} side={THREE.DoubleSide} />
          </mesh>

          {/* Lens Element 5: Secondary Glass Meniscus Lens */}
          <mesh
            position={[0, 0.2 + 0.5 * explodeFactor, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.45, 0.45, 0.06, 32]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              roughness={0.05}
              transmission={0.85}
              ior={1.55}
            />
          </mesh>

          {/* CMOS Active Pixel Sensor Silicon Die at Base */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.9, 0.08, 0.9]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.85} />
          </mesh>
        </group>

        {/* Secondary Ultra-Wide Camera Ring */}
        <group position={[0, 0.25, 0.7]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.46, 0.46, 0.16, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.1 + 0.8 * explodeFactor, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.34, 32]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.05} metalness={0.5} />
          </mesh>
        </group>

        {/* True-Tone LED Flash */}
        <mesh position={[0.7, 0.25, 0]}>
          <boxGeometry args={[0.35, 0.1, 0.35]} />
          <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.6} />
        </mesh>

        {/* Floating In-Scene Callout Label (Image 2: CAMERA MODULE) */}
        {explodeFactor > 0.15 && (
          <CalloutBadge3D
            text="CAMERA MODULE"
            subtext="50MP 1-inch // 5x Periscope"
            badgeColor="#581c87"
            borderColor="#c084fc"
            textColor="#ffffff"
            position={[-4.0, 0.8 + 2.0 * explodeFactor, -0.7]}
            targetPosition={[0, 0.2 + 1.7 * explodeFactor, -0.7]}
            onClick={() => {
              if (camPart) onSelectPart(camPart);
            }}
          />
        )}
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 4. CHASSIS LAYER (Reference Image 2: CHASSIS)
// -------------------------------------------------------------
function SmartphoneChassisLayer({
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
  const targetY = -4.5 * explodeFactor;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1, delta * 12)
    );
  });

  const vcPart = subsystem.components.find((c) => c.id === 'vapor_chamber');
  const tapticPart = subsystem.components.find((c) => c.id === 'taptic_engine');
  const spkPart = subsystem.components.find((c) => c.id === 'stereo_speakers');
  const qiPart = subsystem.components.find((c) => c.id === 'qi_coil');
  const usbPart = subsystem.components.find((c) => c.id === 'usbc_port');

  const isVcSelected = selectedPartId === 'vapor_chamber';

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSubsystem(subsystem);
      }}
    >
      {/* Sintered Copper Vapor Chamber Heat Pipe Spreader */}
      {vcPart && (
        <group
          position={[0, 0.2, -1.5]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(vcPart);
          }}
        >
          <mesh>
            <boxGeometry args={[4.8, 0.06, 8.5]} />
            <meshStandardMaterial
              color={isVcSelected ? '#38bdf8' : '#b45309'}
              roughness={0.25}
              metalness={0.9}
              emissive={isVcSelected ? '#0284c7' : '#000000'}
            />
          </mesh>
          <mesh position={[0, 0.04, -2.8]}>
            <boxGeometry args={[2.2, 0.04, 2.2]} />
            <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      )}

      {/* Qi2 / MagSafe Magnetic Induction Coil */}
      {qiPart && (
        <group
          position={[0, 0.15, 0.8]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(qiPart);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2.4, 32]} />
            <meshStandardMaterial
              color={selectedPartId === 'qi_coil' ? '#38bdf8' : '#b45309'}
              emissive={selectedPartId === 'qi_coil' ? '#0284c7' : '#000000'}
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.5, 32]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
          </mesh>
        </group>
      )}

      {/* Taptic Linear Resonant Actuator (Bottom Right) */}
      {tapticPart && (
        <group
          position={[2.0, 0.2, 6.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(tapticPart);
          }}
        >
          <mesh>
            <boxGeometry args={[1.6, 0.35, 1.2]} />
            <meshStandardMaterial
              color={selectedPartId === 'taptic_engine' ? '#38bdf8' : '#475569'}
              emissive={selectedPartId === 'taptic_engine' ? '#0284c7' : '#000000'}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
        </group>
      )}

      {/* Stereo Loudspeaker Acoustic Box (Bottom Left) */}
      {spkPart && (
        <group
          position={[-2.0, 0.2, 6.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(spkPart);
          }}
        >
          <mesh>
            <boxGeometry args={[1.8, 0.38, 1.4]} />
            <meshStandardMaterial
              color={selectedPartId === 'stereo_speakers' ? '#38bdf8' : '#1e293b'}
              emissive={selectedPartId === 'stereo_speakers' ? '#0284c7' : '#000000'}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
        </group>
      )}

      {/* Titanium Outer Perimeter Midframe Rails (Image 2: Polished Chamfers) */}
      {/* Left Rail with Volume Buttons */}
      <mesh position={[-3.65, 0, 0]}>
        <boxGeometry args={[0.2, 0.75, 15.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.95} />
      </mesh>
      {/* Volume Up/Down Buttons */}
      <mesh position={[-3.8, 0, -2.5]}>
        <boxGeometry args={[0.12, 0.16, 1.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.95} />
      </mesh>

      {/* Right Rail with Power / Action Button */}
      <mesh position={[3.65, 0, 0]}>
        <boxGeometry args={[0.2, 0.75, 15.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.95} />
      </mesh>
      <mesh position={[3.8, 0, -1.8]}>
        <boxGeometry args={[0.12, 0.16, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.95} />
      </mesh>

      {/* Top Cap */}
      <mesh position={[0, 0, -7.75]}>
        <boxGeometry args={[7.4, 0.75, 0.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Bottom Cap with Drilled Speaker Holes & USB-C (Image 2) */}
      <mesh position={[0, 0, 7.75]}>
        <boxGeometry args={[7.4, 0.75, 0.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Bottom Drilled Speaker Hole Grille Array */}
      {[-2.2, -1.9, -1.6, 1.6, 1.9, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 0, 7.86]}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      ))}

      {/* Center USB-C Receptacle */}
      {usbPart && (
        <group
          position={[0, 0, 7.82]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(usbPart);
          }}
        >
          <mesh>
            <boxGeometry args={[1.5, 0.36, 0.1]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[1.0, 0.1, 0.02]} />
            <meshStandardMaterial color="#eab308" metalness={0.95} />
          </mesh>
        </group>
      )}

      {/* Rear Matte Frosted Glass Backplate */}
      <mesh position={[0, -0.38, 0]}>
        <boxGeometry args={[7.3, 0.08, 15.5]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.3}
          metalness={0.5}
          reflectivity={0.8}
          clearcoat={0.9}
        />
      </mesh>

      {/* Floating In-Scene Callout Label (Image 2: CHASSIS) */}
      {explodeFactor > 0.15 && (
        <CalloutBadge3D
          text="CHASSIS"
          subtext="Titanium Grade 5 // CNC Machined"
          badgeColor="#1e293b"
          borderColor="#94a3b8"
          textColor="#ffffff"
          position={[-6.2, 0, 4.2]}
          targetPosition={[-3.65, 0, 4.2]}
          onClick={() => onSelectSubsystem(subsystem)}
        />
      )}
    </group>
  );
}
