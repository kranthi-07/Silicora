'use client';

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CircuitElementInstance, LogicalPin } from '@/lib/circuit/types';
import { useCircuitStore } from '@/lib/circuit/circuit-store';
import { cn } from '@/lib/utils';

interface CircuitComponent3DProps {
  element: CircuitElementInstance;
}

export function CircuitComponent3D({ element }: CircuitComponent3DProps) {
  const {
    activeTool,
    selectedId,
    setSelected,
    rotateComponent,
    updateComponentParameters,
    removeComponent,
    wireDraftStart,
    setWireDraftStart,
    addWire,
    attachDmmProbe,
    attachScopeProbe,
    solvedState,
  } = useCircuitStore();

  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  const isSelected = selectedId === element.id;

  // Branch current and power for this element
  const branchCurrent = solvedState.branchCurrents[element.id] || 0;
  const powerWatts = solvedState.powerDissipations[element.id] || 0;

  // Pin click handler (Wiring & Probing)
  const handlePinClick = (e: any, pin: LogicalPin) => {
    e.stopPropagation();

    if (activeTool === 'probe_dmm_red') {
      attachDmmProbe('red', element.id, pin.pinId);
      return;
    }
    if (activeTool === 'probe_dmm_black') {
      attachDmmProbe('black', element.id, pin.pinId);
      return;
    }
    if (activeTool === 'probe_scope_ch1') {
      attachScopeProbe('ch1', element.id, pin.pinId);
      return;
    }
    if (activeTool === 'probe_scope_ch2') {
      attachScopeProbe('ch2', element.id, pin.pinId);
      return;
    }

    // Default to wiring
    if (wireDraftStart) {
      // Complete wire
      addWire(
        wireDraftStart.componentId,
        wireDraftStart.pinId,
        element.id,
        pin.pinId
      );
    } else {
      // Start wire drafting
      const pinWorldPos: [number, number, number] = [
        element.position[0] + pin.offsetMm[0],
        element.position[1] + pin.offsetMm[1],
        element.position[2] + pin.offsetMm[2],
      ];
      setWireDraftStart({
        componentId: element.id,
        pinId: pin.pinId,
        worldPosition: pinWorldPos,
      });
    }
  };

  // Pushbutton click toggle
  const handlePushbuttonClick = (e: any) => {
    e.stopPropagation();
    if (element.kind === 'pushbutton') {
      const isClosed = element.parameters.switchClosed ?? false;
      updateComponentParameters(element.id, { switchClosed: !isClosed });
    }
  };

  return (
    <group
      ref={groupRef}
      name={`Component_${element.id}`}
      position={[element.position[0], element.position[1], element.position[2]]}
      rotation={[element.rotation[0], element.rotation[1], element.rotation[2]]}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(element.id, 'component');
      }}
    >
      {/* -------------------------------------------------------------
       * COMPONENT SPECIFIC 3D MESHES
       * ------------------------------------------------------------- */}

      {/* 1. DC VOLTAGE SOURCE (9V Battery / Bench Supply) */}
      {element.kind === 'dc_source' && (
        <group name="DC_Source">
          {/* Main Battery Rectangular Body */}
          <mesh castShadow receiveShadow position={[0, 10, 0]}>
            <boxGeometry args={[14, 20, 24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Top Label */}
          <mesh position={[0, 20.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 20]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          {/* Positive Octagonal Snap Terminal */}
          <mesh position={[0, 21.5, -6]}>
            <cylinderGeometry args={[2.0, 2.0, 3, 8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Negative Circular Snap Terminal */}
          <mesh position={[0, 21.5, 6]}>
            <cylinderGeometry args={[2.5, 2.5, 3, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* 2. GROUND REFERENCE */}
      {element.kind === 'ground' && (
        <group name="GroundLug" position={[0, 2, 0]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[2, 2, 4, 16]} />
            <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Ground horizontal stripes symbol */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[6, 0.4, 0.4]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, -1.2, 0]}>
            <boxGeometry args={[4, 0.4, 0.4]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, -2.4, 0]}>
            <boxGeometry args={[2, 0.4, 0.4]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      )}

      {/* 3. AXIAL RESISTOR */}
      {element.kind === 'resistor' && (
        <group name="AxialResistor" position={[0, 3, 0]}>
          {/* Cylindrical beige ceramic lacquer body */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.5, 1.5, 8.0, 24]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
          </mesh>
          {/* Color Bands (4-band representation) */}
          <mesh position={[-2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.52, 1.52, 0.6, 24]} />
            <meshBasicMaterial color="#854d0e" />
          </mesh>
          <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.52, 1.52, 0.6, 24]} />
            <meshBasicMaterial color="#09090b" />
          </mesh>
          <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.52, 1.52, 0.6, 24]} />
            <meshBasicMaterial color="#ea580c" />
          </mesh>
          <mesh position={[2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.52, 1.52, 0.6, 24]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          {/* Tinned Copper Leads: Horizontal spans then 90-deg downward pins */}
          <mesh position={[-7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 6, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[-10, -3.2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 6.5, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 6, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[10, -3.2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 6.5, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* 4. 5MM LED (WITH DYNAMIC EMISSIVE ILLUMINATION) */}
      {element.kind === 'led' && (
        <group name="LED_5mm" position={[0, 3, 0]}>
          {/* Colored Diffused Dome Lens */}
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[2.5, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={element.parameters.ledColor === 'blue' ? '#3b82f6' : element.parameters.ledColor === 'green' ? '#10b981' : '#ef4444'}
              roughness={0.2}
              transparent
              opacity={0.85}
              emissive={element.parameters.ledColor === 'blue' ? '#3b82f6' : element.parameters.ledColor === 'green' ? '#10b981' : '#ef4444'}
              emissiveIntensity={branchCurrent > 0.001 ? Math.min(3.0, branchCurrent * 150) : 0}
            />
          </mesh>
          {/* Cylindrical Base with Rim */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[2.5, 2.7, 3, 24]} />
            <meshStandardMaterial
              color={element.parameters.ledColor === 'blue' ? '#3b82f6' : element.parameters.ledColor === 'green' ? '#10b981' : '#ef4444'}
              roughness={0.2}
              transparent
              opacity={0.85}
              emissive={element.parameters.ledColor === 'blue' ? '#3b82f6' : element.parameters.ledColor === 'green' ? '#10b981' : '#ef4444'}
              emissiveIntensity={branchCurrent > 0.001 ? Math.min(2.5, branchCurrent * 120) : 0}
            />
          </mesh>
          {/* Anode (+) Longer Lead */}
          <mesh position={[-1.27, -3.0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 6.5, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Cathode (-) Shorter Lead */}
          <mesh position={[1.27, -3.0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 5.0, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Dynamic Light Source when conducting */}
          {branchCurrent > 0.002 && (
            <pointLight
              color={element.parameters.ledColor === 'blue' ? '#3b82f6' : element.parameters.ledColor === 'green' ? '#10b981' : '#ef4444'}
              intensity={Math.min(20, branchCurrent * 800)}
              distance={40}
              decay={2}
              position={[0, 5, 0]}
            />
          )}
        </group>
      )}

      {/* 5. ELECTROLYTIC CAPACITOR (REALISTIC ARRANGED PINS & RUBBER BUNG) */}
      {element.kind === 'capacitor' && (
        <group name="ElectrolyticCap" position={[0, 4, 0]}>
          {/* Aluminum Can Body */}
          <mesh castShadow position={[0, 5, 0]}>
            <cylinderGeometry args={[3.5, 3.5, 10, 24]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.4} />
          </mesh>
          {/* Negative Polarity White Stripe (with '-' marks) */}
          <mesh position={[2.6, 5, 0]}>
            <boxGeometry args={[1.2, 9.8, 1.8]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
          {/* Top Safety Vent Cross Emboss */}
          <mesh position={[0, 10.05, 0]}>
            <cylinderGeometry args={[3.4, 3.4, 0.15, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Rubber Bung Sealing Base at bottom of can */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[3.4, 3.4, 0.8, 24]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          {/* Positive Lead (Anode +) Long Tinned Lead descending into breadboard hole */}
          <mesh position={[-2.54, -3.5, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 7.5, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Negative Lead (Cathode -) Shorter Tinned Lead descending into breadboard hole */}
          <mesh position={[2.54, -3.5, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 6.0, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* 6. TO-92 TRANSISTOR (BJT / MOSFET - ACCURATELY ARRANGED 3 PINS) */}
      {(element.kind === 'transistor_npn' || element.kind === 'transistor_mosfet') && (
        <group name="TO92_Package" position={[0, 4, 0]}>
          {/* Curved Back Half-Cylinder */}
          <mesh castShadow position={[0, 2.8, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 5.2, 24, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          {/* Flat Molded Face */}
          <mesh position={[0, 2.8, 0]}>
            <boxGeometry args={[5, 5.2, 0.5]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Pin 1: Emitter (BJT) / Source (MOSFET) Lead extending into breadboard hole */}
          <mesh position={[-2.54, -3.2, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 7.0, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Pin 2: Base (BJT) / Gate (MOSFET) Lead extending into breadboard hole */}
          <mesh position={[0, -3.2, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 7.0, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Pin 3: Collector (BJT) / Drain (MOSFET) Lead extending into breadboard hole */}
          <mesh position={[2.54, -3.2, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 7.0, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* 7. PUSHBUTTON (CLICKABLE IN 3D SCENE) */}
      {element.kind === 'pushbutton' && (
        <group name="Pushbutton" position={[0, 2, 0]}>
          {/* Metal housing */}
          <mesh castShadow position={[0, 1.5, 0]}>
            <boxGeometry args={[6, 3, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Round Black Actuator Plunger */}
          <mesh
            position={[0, element.parameters.switchClosed ? 3.0 : 3.8, 0]}
            onClick={handlePushbuttonClick}
          >
            <cylinderGeometry args={[1.6, 1.6, 1.6, 24]} />
            <meshStandardMaterial
              color={element.parameters.switchClosed ? '#10b981' : '#09090b'}
              roughness={0.4}
            />
          </mesh>
        </group>
      )}

      {/* -------------------------------------------------------------
       * INTERACTIVE PIN ANCHORS (Terminal Rings)
       * ------------------------------------------------------------- */}
      {element.pins.map((pin) => {
        const isHovered = hoveredPinId === pin.pinId;
        const pinVoltage = solvedState.pinVoltages[`${element.id}:${pin.pinId}`] ?? 0;

        return (
          <group
            key={pin.pinId}
            position={[pin.offsetMm[0], pin.offsetMm[1], pin.offsetMm[2]]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredPinId(pin.pinId);
            }}
            onPointerOut={() => setHoveredPinId(null)}
            onClick={(e) => handlePinClick(e, pin)}
          >
            {/* Glowing Anchor Sphere */}
            <mesh>
              <sphereGeometry args={[isHovered ? 1.0 : 0.65, 16, 16]} />
              <meshStandardMaterial
                color={isHovered ? '#00f0ff' : '#58a6ff'}
                emissive={isHovered ? '#00f0ff' : '#1e3a8a'}
                emissiveIntensity={isHovered ? 1.2 : 0.4}
              />
            </mesh>

            {/* Target Reticle Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.0, 1.4, 24]} />
              <meshBasicMaterial
                color={isHovered ? '#00f0ff' : '#38bdf8'}
                side={THREE.DoubleSide}
                transparent
                opacity={isHovered ? 1.0 : 0.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* -------------------------------------------------------------
       * SELECTION OUTLINE BOX
       * ------------------------------------------------------------- */}
      {isSelected && (
        <lineSegments position={[0, 4, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(22, 14, 22)]} />
          <lineBasicMaterial color="#00f0ff" linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
}
