'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorkspaceStore } from '@/lib/store';
import { useSimulation } from '@/lib/simulation/use-simulation';

// Scratch variables (AI_RULES.md Rule 3: Zero allocations inside useFrame)
const targetVecTop = new THREE.Vector3();
const targetVecBottom = new THREE.Vector3();
const tempDummy = new THREE.Object3D();
const tempColor = new THREE.Color();
const thermalColor = new THREE.Color();

import {
  getLayerStyle,
  LayerHighlightEdges,
  computeSeparationTarget,
} from './model-layer-helper';
const NUM_ELECTRONS_PER_LEAD = 14;
const LEAD_MIN_X_LEFT = -14.0;
const LEAD_MAX_X_LEFT = -3.2;
const LEAD_MIN_X_RIGHT = 3.2;
const LEAD_MAX_X_RIGHT = 14.0;
const LEAD_SPAN = LEAD_MAX_X_LEFT - LEAD_MIN_X_LEFT; // 10.8mm

export function AxialResistorModel() {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
    xRayMode,
  } = useWorkspaceStore();

  const {
    outputs,
    showCurrentFlow,
    showElectronDrift,
    showThermalHeatmap,
  } = useSimulation();

  const topShellRef = useRef<THREE.Group>(null);
  const bottomShellRef = useRef<THREE.Group>(null);
  const spiralMeshRef = useRef<THREE.Mesh>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const casingMaterialTopRef = useRef<THREE.MeshStandardMaterial>(null);
  const casingMaterialBottomRef = useRef<THREE.MeshStandardMaterial>(null);
  const spiralMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Instanced meshes for electron drift particles along leads
  const leftElectronsRef = useRef<THREE.InstancedMesh>(null);
  const rightElectronsRef = useRef<THREE.InstancedMesh>(null);

  // Internal persistent particle positions along the lead length [0, 1]
  const particleOffsets = useMemo(() => {
    const left: number[] = [];
    const right: number[] = [];
    for (let i = 0; i < NUM_ELECTRONS_PER_LEAD; i++) {
      left.push(i / NUM_ELECTRONS_PER_LEAD);
      right.push(i / NUM_ELECTRONS_PER_LEAD);
    }
    return { left, right };
  }, []);

  // Compute smooth separation distance based on cutaway mode and explode sliders
  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 5.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  // Procedural spiral resistive film track geometry (laser cut helix around core)
  const spiralMesh = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const turns = 8;
    const length = 4.2;
    const radius = 0.88;
    const segments = 160;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * turns * Math.PI * 2;
      const x = -length / 2 + t * length;
      const y = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 120, 0.08, 8, false);
  }, []);

  // Frame loop for smooth cutaway separation, electron drift, and thermal emissive update
  useFrame((_, delta) => {
    const speed = Math.min(delta * 8, 0.2);

    // 1. Cutaway separation lerp
    if (topShellRef.current) {
      targetVecTop.set(0, separationTarget, 0);
      topShellRef.current.position.lerp(targetVecTop, speed);
    }
    if (bottomShellRef.current) {
      targetVecBottom.set(0, -separationTarget, 0);
      bottomShellRef.current.position.lerp(targetVecBottom, speed);
    }

    // 2. Dynamic Thermal Glow Update
    const isBurnt = outputs.limits.burnoutTriggered;
    const tempC = outputs.thermal.junctionTempC;
    // Map temperature rise (25°C to 180°C+) to heat color
    const thermalT = Math.max(0, Math.min(1, (tempC - 25) / 140));

    if (showThermalHeatmap && spiralMaterialRef.current) {
      if (isBurnt) {
        // Burnt out: charred black body, low dull ember
        spiralMaterialRef.current.color.set('#0f172a');
        spiralMaterialRef.current.emissive.set('#450a0a');
        spiralMaterialRef.current.emissiveIntensity = 0.3;
      } else if (thermalT > 0.05) {
        // Blackbody radiation curve approximation: Dark red -> Orange -> Bright Incandescent Yellow
        if (thermalT < 0.4) {
          thermalColor.setRGB(0.5 * (thermalT / 0.4), 0.02, 0.0);
        } else if (thermalT < 0.8) {
          const factor = (thermalT - 0.4) / 0.4;
          thermalColor.setRGB(0.5 + 0.5 * factor, 0.02 + 0.3 * factor, 0.0);
        } else {
          const factor = (thermalT - 0.8) / 0.2;
          thermalColor.setRGB(1.0, 0.32 + 0.6 * factor, 0.2 * factor);
        }
        spiralMaterialRef.current.emissive.copy(thermalColor);
        spiralMaterialRef.current.emissiveIntensity = thermalT * 2.5;
      } else {
        spiralMaterialRef.current.emissive.set(selectedLayerId === 'spiral' ? '#00f0ff' : '#000000');
        spiralMaterialRef.current.emissiveIntensity = selectedLayerId === 'spiral' ? 0.6 : 0;
      }
    }

    // 3. Electron Drift Particles Animation along leads
    // CRITICAL SCIENTIFIC INVARIANT:
    // Electron drift velocity has the OPPOSITE direction to conventional current.
    // outputs.electronDriftVelocity is already signed in mm/s!
    if (showElectronDrift && leftElectronsRef.current && rightElectronsRef.current) {
      const vDrift = outputs.electronDriftVelocity; // mm/s
      // Speed multiplier for educational visibility (normalized to lead length)
      const moveDelta = (vDrift * delta * 0.15) / LEAD_SPAN;

      // Left lead electrons
      for (let i = 0; i < NUM_ELECTRONS_PER_LEAD; i++) {
        let p = (particleOffsets.left[i] + moveDelta) % 1.0;
        if (p < 0) p += 1.0;
        particleOffsets.left[i] = p;

        const posX = LEAD_MIN_X_LEFT + p * LEAD_SPAN;
        tempDummy.position.set(posX, 0, 0);
        tempDummy.scale.set(0.12, 0.12, 0.12);
        tempDummy.updateMatrix();
        leftElectronsRef.current.setMatrixAt(i, tempDummy.matrix);
      }
      leftElectronsRef.current.instanceMatrix.needsUpdate = true;

      // Right lead electrons
      for (let i = 0; i < NUM_ELECTRONS_PER_LEAD; i++) {
        let p = (particleOffsets.right[i] + moveDelta) % 1.0;
        if (p < 0) p += 1.0;
        particleOffsets.right[i] = p;

        const posX = LEAD_MIN_X_RIGHT + p * LEAD_SPAN;
        tempDummy.position.set(posX, 0, 0);
        tempDummy.scale.set(0.12, 0.12, 0.12);
        tempDummy.updateMatrix();
        rightElectronsRef.current.setMatrixAt(i, tempDummy.matrix);
      }
      rightElectronsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Layer selection helper
  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(layerId);
  };

  const isLayerVisible = (layerId: string) => layerVisibility[layerId] !== false;
  const isSelected = (layerId: string) => selectedLayerId === layerId;

  // Material helpers with selection emissive highlight
  const getHighlightColor = (layerId: string, defaultEmissive = '#000000') => {
    return isSelected(layerId) ? '#00f0ff' : defaultEmissive;
  };
  const getHighlightIntensity = (layerId: string) => {
    return isSelected(layerId) ? 0.6 : 0;
  };

  // Conventional current direction (+1 for left-to-right, -1 for right-to-left, 0 for idle)
  const currentDirection = Math.abs(outputs.branchCurrent) > 1e-7 ? Math.sign(outputs.branchCurrent) : 0;

  return (
    <group name="AxialResistor_10k" position={[0, 0, 0]}>
      {/* -------------------------------------------------------------
       * 1. ALUMINA CERAMIC SUBSTRATE CORE (Insulative Rod)
       * ------------------------------------------------------------- */}
      {isLayerVisible('core') && (
        <mesh
          ref={coreMeshRef}
          name="CeramicCore"
          rotation={[0, 0, Math.PI / 2]}
          onPointerDown={(e) => handlePointerDown(e, 'core')}
        >
          <cylinderGeometry args={[0.85, 0.85, 6.2, 32]} />
          <meshStandardMaterial
            color={outputs.limits.burnoutTriggered ? '#1e293b' : '#f1f5f9'}
            roughness={0.7}
            metalness={0.05}
            emissive={getHighlightColor('core')}
            emissiveIntensity={getHighlightIntensity('core')}
          />
        </mesh>
      )}

      {/* -------------------------------------------------------------
       * 2. LASER-TRIMMED HELICAL RESISTIVE THIN FILM
       * ------------------------------------------------------------- */}
      {isLayerVisible('spiral') && (
        <mesh
          ref={spiralMeshRef}
          name="ResistiveSpiralFilm"
          geometry={spiralMesh}
          onPointerDown={(e) => handlePointerDown(e, 'spiral')}
        >
          <meshStandardMaterial
            ref={spiralMaterialRef}
            color={outputs.limits.burnoutTriggered ? '#09090b' : '#1e293b'}
            roughness={0.3}
            metalness={0.8}
            emissive={getHighlightColor('spiral')}
            emissiveIntensity={getHighlightIntensity('spiral')}
          />
        </mesh>
      )}

      {/* -------------------------------------------------------------
       * 3. NICKEL-PLATED STEEL END CAPS
       * ------------------------------------------------------------- */}
      {isLayerVisible('caps') && (
        <group name="EndCaps" onPointerDown={(e) => handlePointerDown(e, 'caps')}>
          <mesh position={[-2.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.96, 0.96, 1.2, 32]} />
            <meshStandardMaterial
              color="#cbd5e1"
              roughness={0.2}
              metalness={0.9}
              emissive={getHighlightColor('caps')}
              emissiveIntensity={getHighlightIntensity('caps')}
            />
          </mesh>
          <mesh position={[2.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.96, 0.96, 1.2, 32]} />
            <meshStandardMaterial
              color="#cbd5e1"
              roughness={0.2}
              metalness={0.9}
              emissive={getHighlightColor('caps')}
              emissiveIntensity={getHighlightIntensity('caps')}
            />
          </mesh>
        </group>
      )}

      {/* -------------------------------------------------------------
       * 4. TINNED COPPER LEADS (PINS)
       * ------------------------------------------------------------- */}
      {isLayerVisible('leads') && (
        <group name="Leads" onPointerDown={(e) => handlePointerDown(e, 'leads')}>
          <mesh position={[-8.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 11.0, 24]} />
            <meshStandardMaterial
              color="#e2e8f0"
              roughness={0.25}
              metalness={0.95}
              emissive={getHighlightColor('leads')}
              emissiveIntensity={getHighlightIntensity('leads')}
            />
          </mesh>
          <mesh position={[8.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 11.0, 24]} />
            <meshStandardMaterial
              color="#e2e8f0"
              roughness={0.25}
              metalness={0.95}
              emissive={getHighlightColor('leads')}
              emissiveIntensity={getHighlightIntensity('leads')}
            />
          </mesh>
        </group>
      )}

      {/* -------------------------------------------------------------
       * 5. PROTECTIVE EPOXY CASING WITH HORIZONTAL CUTAWAY SEPARATION
       * ------------------------------------------------------------- */}
      {isLayerVisible('lacquer') && (
        <>
          {/* TOP CASING HALF (Separates in +Y) */}
          <group ref={topShellRef} name="Casing_TopHalf" onPointerDown={(e) => handlePointerDown(e, 'lacquer')}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.25, 1.25, 6.5, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial
                ref={casingMaterialTopRef}
                color={outputs.limits.burnoutTriggered ? '#1c1917' : '#0284c7'}
                roughness={xRayMode ? 0.15 : 0.4}
                metalness={0.1}
                side={THREE.DoubleSide}
                transparent={xRayMode}
                opacity={xRayMode ? 0.32 : 1.0}
                emissive={getHighlightColor('lacquer')}
                emissiveIntensity={getHighlightIntensity('lacquer')}
              />
            </mesh>

            {/* 10k 4-Band Resistor Color Codes on Top Half */}
            <mesh position={[-1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.26, 1.26, 0.45, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color={outputs.limits.burnoutTriggered ? '#292524' : '#854d0e'} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.26, 1.26, 0.45, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#09090b" roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.26, 1.26, 0.45, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color={outputs.limits.burnoutTriggered ? '#44403c' : '#ea580c'} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.26, 1.26, 0.45, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color={outputs.limits.burnoutTriggered ? '#78716c' : '#eab308'} roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* BOTTOM CASING HALF (Separates in -Y) */}
          <group ref={bottomShellRef} name="Casing_BottomHalf" onPointerDown={(e) => handlePointerDown(e, 'lacquer')}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.25, 1.25, 6.5, 32, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial
                ref={casingMaterialBottomRef}
                color={outputs.limits.burnoutTriggered ? '#1c1917' : '#0284c7'}
                roughness={xRayMode ? 0.15 : 0.4}
                metalness={0.1}
                side={THREE.DoubleSide}
                transparent={xRayMode}
                opacity={xRayMode ? 0.32 : 1.0}
                emissive={getHighlightColor('lacquer')}
                emissiveIntensity={getHighlightIntensity('lacquer')}
              />
            </mesh>

            {/* Color Bands on Bottom Half */}
            <mesh position={[-1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.26, 1.26, 0.45, 32, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial color={outputs.limits.burnoutTriggered ? '#292524' : '#854d0e'} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.26, 1.26, 0.45, 32, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial color="#09090b" roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.26, 1.26, 0.45, 32, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial color={outputs.limits.burnoutTriggered ? '#44403c' : '#ea580c'} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.26, 1.26, 0.45, 32, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial color={outputs.limits.burnoutTriggered ? '#78716c' : '#eab308'} roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </>
      )}

      {/* -------------------------------------------------------------
       * 6. ELECTRON DRIFT VELOCITY VISUALIZER (Opposite Direction to Current!)
       * ------------------------------------------------------------- */}
      {showElectronDrift && (
        <group name="ElectronDriftParticles">
          {/* Left Lead Electrons */}
          <instancedMesh
            ref={leftElectronsRef}
            args={[undefined, undefined, NUM_ELECTRONS_PER_LEAD]}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.9}
              roughness={0.2}
            />
          </instancedMesh>

          {/* Right Lead Electrons */}
          <instancedMesh
            ref={rightElectronsRef}
            args={[undefined, undefined, NUM_ELECTRONS_PER_LEAD]}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.9}
              roughness={0.2}
            />
          </instancedMesh>
        </group>
      )}
    </group>
  );
}
