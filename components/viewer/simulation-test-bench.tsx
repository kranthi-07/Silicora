'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorkspaceStore } from '@/lib/store';

const NUM_TOTAL_DOTS = 64;
const tempDummy = new THREE.Object3D();
const tempVec = new THREE.Vector3();

interface FlowPathConfig {
  sourcePosRed: THREE.Vector3;
  sourcePosBlack: THREE.Vector3;
  clampPos: THREE.Vector3;
  clampNeg: THREE.Vector3;
  clampPosRot: [number, number, number];
  clampNegRot: [number, number, number];
  fullPathPoints: THREE.Vector3[];
  redCablePoints: THREE.Vector3[];
  blackCablePoints: THREE.Vector3[];
}

export function SimulationTestBench() {
  const {
    isSimRunning,
    isSimLoading,
    selectedComponent,
  } = useWorkspaceStore();

  const isBenchActive = isSimRunning || isSimLoading;

  // Resolve 3D test bench geometry and continuous current path through component
  const pathConfig: FlowPathConfig = useMemo(() => {
    const id = selectedComponent?.id || '';
    const pkg = selectedComponent?.package;
    const code = pkg?.standardCode || '';

    // =========================================================================
    // CASE 1: AXIAL RESISTOR (Lead rods extend from x = -14.1 to +14.1)
    // =========================================================================
    if (id === 'pass_res_10k' || code.startsWith('Axial')) {
      const sourcePosRed = new THREE.Vector3(-21, 0, 1.5);
      const sourcePosBlack = new THREE.Vector3(21, 0, 1.5);
      const clampPos = new THREE.Vector3(-14.1, 0, 0);
      const clampNeg = new THREE.Vector3(14.1, 0, 0);

      // Red cable curve from side terminal into left rod tip
      const redCablePoints = [
        sourcePosRed,
        new THREE.Vector3(-18.5, 0.6, 1.0),
        new THREE.Vector3(-16.0, 0.2, 0.3),
        clampPos,
      ];

      // Black cable curve from right rod tip into right side terminal
      const blackCablePoints = [
        clampNeg,
        new THREE.Vector3(16.0, 0.2, 0.3),
        new THREE.Vector3(18.5, 0.6, 1.0),
        sourcePosBlack,
      ];

      // Continuous closed-circuit path through cables, rods, end caps & spiral core:
      const fullPathPoints = [
        sourcePosRed,
        new THREE.Vector3(-18.5, 0.6, 1.0),
        new THREE.Vector3(-16.0, 0.2, 0.3),
        clampPos, // Outer tip of left rod (-14.1)
        new THREE.Vector3(-11.5, 0, 0), // Streaming along left rod
        new THREE.Vector3(-8.5, 0, 0),
        new THREE.Vector3(-5.5, 0, 0),
        new THREE.Vector3(-3.2, 0, 0), // Into left steel end cap
        // Spiraling through resistive thin film across ceramic core:
        new THREE.Vector3(-2.2, 0.9, 0),
        new THREE.Vector3(-1.4, 0, 0.9),
        new THREE.Vector3(-0.7, -0.9, 0),
        new THREE.Vector3(0.0, 0, -0.9),
        new THREE.Vector3(0.7, 0.9, 0),
        new THREE.Vector3(1.4, 0, 0.9),
        new THREE.Vector3(2.2, -0.9, 0),
        new THREE.Vector3(3.2, 0, 0), // Into right steel end cap
        new THREE.Vector3(5.5, 0, 0), // Streaming along right rod
        new THREE.Vector3(8.5, 0, 0),
        new THREE.Vector3(11.5, 0, 0),
        clampNeg, // Outer tip of right rod (+14.1)
        new THREE.Vector3(16.0, 0.2, 0.3),
        new THREE.Vector3(18.5, 0.6, 1.0),
        sourcePosBlack,
      ];

      return {
        sourcePosRed,
        sourcePosBlack,
        clampPos,
        clampNeg,
        clampPosRot: [0, 0, -Math.PI / 2], // Facing along +X
        clampNegRot: [0, 0, Math.PI / 2],  // Facing along -X
        fullPathPoints,
        redCablePoints,
        blackCablePoints,
      };
    }

    // =========================================================================
    // CASE 2: ORDINARY DIODES (1N4148 / 1N4007 DO-35 / DO-41 Axial Glass/Plastic)
    // =========================================================================
    if (id.includes('diode') || code === 'DO-35' || code === 'DO-41') {
      const sourcePosRed = new THREE.Vector3(-21, 0, 1.5);
      const sourcePosBlack = new THREE.Vector3(21, 0, 1.5);
      const clampPos = new THREE.Vector3(-14.1, 0, 0);
      const clampNeg = new THREE.Vector3(14.1, 0, 0);

      const redCablePoints = [
        sourcePosRed,
        new THREE.Vector3(-18.5, 0.5, 1.0),
        new THREE.Vector3(-16.0, 0.2, 0.3),
        clampPos,
      ];
      const blackCablePoints = [
        clampNeg,
        new THREE.Vector3(16.0, 0.2, 0.3),
        new THREE.Vector3(18.5, 0.5, 1.0),
        sourcePosBlack,
      ];

      const fullPathPoints = [
        sourcePosRed,
        new THREE.Vector3(-18.5, 0.5, 1.0),
        new THREE.Vector3(-16.0, 0.2, 0.3),
        clampPos,
        new THREE.Vector3(-10.0, 0, 0),
        new THREE.Vector3(-5.0, 0, 0),
        new THREE.Vector3(-2.0, 0, 0), // Anode stud
        new THREE.Vector3(-0.6, 0.3, 0), // Cat whisker
        new THREE.Vector3(0, 0, 0), // Silicon PN die
        new THREE.Vector3(2.0, 0, 0), // Cathode stud
        new THREE.Vector3(5.0, 0, 0),
        new THREE.Vector3(10.0, 0, 0),
        clampNeg,
        new THREE.Vector3(16.0, 0.2, 0.3),
        new THREE.Vector3(18.5, 0.5, 1.0),
        sourcePosBlack,
      ];

      return {
        sourcePosRed,
        sourcePosBlack,
        clampPos,
        clampNeg,
        clampPosRot: [0, 0, -Math.PI / 2],
        clampNegRot: [0, 0, Math.PI / 2],
        fullPathPoints,
        redCablePoints,
        blackCablePoints,
      };
    }

    // =========================================================================
    // CASE 3: 5mm LED (Radial Through-Hole Leads)
    // =========================================================================
    if (id.includes('led')) {
      const sourcePosRed = new THREE.Vector3(-15, -4.5, 2.5);
      const sourcePosBlack = new THREE.Vector3(15, -4.5, 2.5);
      const clampPos = new THREE.Vector3(-0.7, -6.0, 0); // Anode tip
      const clampNeg = new THREE.Vector3(0.7, -5.2, 0);  // Cathode tip

      const redCablePoints = [
        sourcePosRed,
        new THREE.Vector3(-10, -5.0, 1.5),
        new THREE.Vector3(-4.5, -5.8, 0.8),
        clampPos,
      ];
      const blackCablePoints = [
        clampNeg,
        new THREE.Vector3(4.5, -5.4, 0.8),
        new THREE.Vector3(10, -4.8, 1.5),
        sourcePosBlack,
      ];

      const fullPathPoints = [
        sourcePosRed,
        new THREE.Vector3(-10, -5.0, 1.5),
        new THREE.Vector3(-4.5, -5.8, 0.8),
        clampPos,
        new THREE.Vector3(-0.7, -3.0, 0), // Up anode lead
        new THREE.Vector3(-0.7, 0.5, 0),
        new THREE.Vector3(-0.6, 2.0, 0), // Into reflector cup & die
        new THREE.Vector3(-0.1, 3.1, 0.3), // Gold bond wire arch
        new THREE.Vector3(0.7, 2.0, 0), // Onto cathode post
        new THREE.Vector3(0.7, 0.5, 0),
        new THREE.Vector3(0.7, -2.5, 0), // Down cathode lead
        clampNeg,
        new THREE.Vector3(4.5, -5.4, 0.8),
        new THREE.Vector3(10, -4.8, 1.5),
        sourcePosBlack,
      ];

      return {
        sourcePosRed,
        sourcePosBlack,
        clampPos,
        clampNeg,
        clampPosRot: [0, 0, 0], // Clamping upward onto lead tip
        clampNegRot: [0, 0, 0],
        fullPathPoints,
        redCablePoints,
        blackCablePoints,
      };
    }

    // =========================================================================
    // CASE 4: ELECTROLYTIC & CERAMIC CAPACITORS
    // =========================================================================
    if (id.includes('cap')) {
      const sourcePosRed = new THREE.Vector3(-15, -4.5, 2.5);
      const sourcePosBlack = new THREE.Vector3(15, -4.5, 2.5);
      const clampPos = new THREE.Vector3(-1.25, -5.5, 0);
      const clampNeg = new THREE.Vector3(1.25, -4.8, 0);

      const redCablePoints = [
        sourcePosRed,
        new THREE.Vector3(-10, -4.8, 1.5),
        new THREE.Vector3(-5, -5.2, 0.8),
        clampPos,
      ];
      const blackCablePoints = [
        clampNeg,
        new THREE.Vector3(5, -4.8, 0.8),
        new THREE.Vector3(10, -4.6, 1.5),
        sourcePosBlack,
      ];

      const fullPathPoints = [
        sourcePosRed,
        new THREE.Vector3(-10, -4.8, 1.5),
        new THREE.Vector3(-5, -5.2, 0.8),
        clampPos,
        new THREE.Vector3(-1.25, -2.0, 0),
        new THREE.Vector3(-1.25, 1.5, 0),
        new THREE.Vector3(0, 3.5, 0), // Foil winding / ceramic disc core
        new THREE.Vector3(1.25, 1.5, 0),
        new THREE.Vector3(1.25, -2.0, 0),
        clampNeg,
        new THREE.Vector3(5, -4.8, 0.8),
        new THREE.Vector3(10, -4.6, 1.5),
        sourcePosBlack,
      ];

      return {
        sourcePosRed,
        sourcePosBlack,
        clampPos,
        clampNeg,
        clampPosRot: [0, 0, 0],
        clampNegRot: [0, 0, 0],
        fullPathPoints,
        redCablePoints,
        blackCablePoints,
      };
    }

    // =========================================================================
    // CASE 5: TRANSISTORS & TEMP SENSOR (TO-92 3-Pin)
    // =========================================================================
    if (id.includes('bjt') || id.includes('mosfet') || id.includes('temp') || code.includes('TO-92')) {
      const sourcePosRed = new THREE.Vector3(-15, -4.5, 2.5);
      const sourcePosBlack = new THREE.Vector3(15, -4.5, 2.5);
      const clampPos = new THREE.Vector3(-1.27, -5.8, 0);
      const clampNeg = new THREE.Vector3(1.27, -5.8, 0);

      const redCablePoints = [
        sourcePosRed,
        new THREE.Vector3(-10, -5.0, 1.5),
        new THREE.Vector3(-5, -5.5, 0.8),
        clampPos,
      ];
      const blackCablePoints = [
        clampNeg,
        new THREE.Vector3(5, -5.5, 0.8),
        new THREE.Vector3(10, -5.0, 1.5),
        sourcePosBlack,
      ];

      const fullPathPoints = [
        sourcePosRed,
        new THREE.Vector3(-10, -5.0, 1.5),
        new THREE.Vector3(-5, -5.5, 0.8),
        clampPos,
        new THREE.Vector3(-1.27, -2.0, 0),
        new THREE.Vector3(-0.5, 0.2, 0.2), // Bond wire to silicon die
        new THREE.Vector3(0, 0.4, 0.16),
        new THREE.Vector3(0.5, 0.2, 0.2),
        new THREE.Vector3(1.27, -2.0, 0),
        clampNeg,
        new THREE.Vector3(5, -5.5, 0.8),
        new THREE.Vector3(10, -5.0, 1.5),
        sourcePosBlack,
      ];

      return {
        sourcePosRed,
        sourcePosBlack,
        clampPos,
        clampNeg,
        clampPosRot: [0, 0, 0],
        clampNegRot: [0, 0, 0],
        fullPathPoints,
        redCablePoints,
        blackCablePoints,
      };
    }

    // =========================================================================
    // CASE 6: 9V ALKALINE PRISMATIC BATTERY
    // =========================================================================
    if (id.includes('battery')) {
      const sourcePosRed = new THREE.Vector3(14, 3.8, 2.0);
      const sourcePosBlack = new THREE.Vector3(-14, 3.8, 2.0);
      const clampPos = new THREE.Vector3(1.2, 4.8, 0);  // Positive Stud
      const clampNeg = new THREE.Vector3(-1.2, 4.8, 0); // Negative Socket

      const redCablePoints = [
        sourcePosRed,
        new THREE.Vector3(9.5, 4.4, 1.5),
        new THREE.Vector3(4.5, 5.0, 0.8),
        clampPos,
      ];
      const blackCablePoints = [
        clampNeg,
        new THREE.Vector3(-4.5, 5.0, 0.8),
        new THREE.Vector3(-9.5, 4.4, 1.5),
        sourcePosBlack,
      ];

      const fullPathPoints = [
        sourcePosRed,
        new THREE.Vector3(9.5, 4.4, 1.5),
        new THREE.Vector3(4.5, 5.0, 0.8),
        clampPos,
        new THREE.Vector3(1.2, 2.0, 0), // Through series cells
        new THREE.Vector3(1.2, -2.0, 0),
        new THREE.Vector3(0, -2.5, 0),
        new THREE.Vector3(-1.2, -2.0, 0),
        new THREE.Vector3(-1.2, 2.0, 0),
        clampNeg,
        new THREE.Vector3(-4.5, 5.0, 0.8),
        new THREE.Vector3(-9.5, 4.4, 1.5),
        sourcePosBlack,
      ];

      return {
        sourcePosRed,
        sourcePosBlack,
        clampPos,
        clampNeg,
        clampPosRot: [Math.PI, 0, 0], // Clamping down from above onto terminal
        clampNegRot: [Math.PI, 0, 0],
        fullPathPoints,
        redCablePoints,
        blackCablePoints,
      };
    }

    // =========================================================================
    // CASE 7: DEFAULT / GENERAL COMPONENTS (Placed beside on left & right)
    // =========================================================================
    const sourcePosRed = new THREE.Vector3(-16, -1, 2.0);
    const sourcePosBlack = new THREE.Vector3(16, -1, 2.0);
    const clampPos = new THREE.Vector3(-2.5, 0, 0);
    const clampNeg = new THREE.Vector3(2.5, 0, 0);

    const redCablePoints = [
      sourcePosRed,
      new THREE.Vector3(-11, 0, 1.2),
      new THREE.Vector3(-6, 0.2, 0.6),
      clampPos,
    ];
    const blackCablePoints = [
      clampNeg,
      new THREE.Vector3(6, 0.2, 0.6),
      new THREE.Vector3(11, 0, 1.2),
      sourcePosBlack,
    ];

    const fullPathPoints = [
      sourcePosRed,
      new THREE.Vector3(-11, 0, 1.2),
      new THREE.Vector3(-6, 0.2, 0.6),
      clampPos,
      new THREE.Vector3(0, 0.5, 0), // Through component core
      clampNeg,
      new THREE.Vector3(6, 0.2, 0.6),
      new THREE.Vector3(11, 0, 1.2),
      sourcePosBlack,
    ];

    return {
      sourcePosRed,
      sourcePosBlack,
      clampPos,
      clampNeg,
      clampPosRot: [0, 0, -Math.PI / 4],
      clampNegRot: [0, 0, Math.PI / 4],
      fullPathPoints,
      redCablePoints,
      blackCablePoints,
    };
  }, [selectedComponent]);

  // Construct smooth parametric CatmullRom curves
  const redCableCurve = useMemo(() => new THREE.CatmullRomCurve3(pathConfig.redCablePoints), [pathConfig.redCablePoints]);
  const blackCableCurve = useMemo(() => new THREE.CatmullRomCurve3(pathConfig.blackCablePoints), [pathConfig.blackCablePoints]);
  const fullCircuitCurve = useMemo(() => new THREE.CatmullRomCurve3(pathConfig.fullPathPoints), [pathConfig.fullPathPoints]);

  // Cable tube geometries
  const redTubeGeom = useMemo(() => new THREE.TubeGeometry(redCableCurve, 32, 0.16, 8, false), [redCableCurve]);
  const blackTubeGeom = useMemo(() => new THREE.TubeGeometry(blackCableCurve, 32, 0.16, 8, false), [blackCableCurve]);

  // Instanced mesh reference for continuous current dots
  const dotsMeshRef = useRef<THREE.InstancedMesh>(null);
  const flowPhaseRef = useRef<number>(0);

  // Animate flowing dotted current animation in useFrame
  useFrame((_, delta) => {
    if (!isSimRunning || !dotsMeshRef.current) return;

    // Advance flow phase along the complete continuous circuit
    flowPhaseRef.current = (flowPhaseRef.current + delta * 0.55) % 1.0;

    for (let i = 0; i < NUM_TOTAL_DOTS; i++) {
      const u = (flowPhaseRef.current + i / NUM_TOTAL_DOTS) % 1.0;
      fullCircuitCurve.getPointAt(u, tempVec);

      tempDummy.position.copy(tempVec);
      tempDummy.scale.set(0.18, 0.18, 0.18);
      tempDummy.updateMatrix();

      dotsMeshRef.current.setMatrixAt(i, tempDummy.matrix);
    }

    dotsMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!isBenchActive) return null;

  return (
    <group name="SimulationTestBenchAssembly">
      {/* 1. BENCHTOP POWER SOURCE BINDING POSTS (Placed beside the component, NOT upside) */}
      {/* Left Binding Post (+ VCC Red Terminal) */}
      <group position={pathConfig.sourcePosRed.toArray()}>
        {/* Steel Bench Mount Flange Foot */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[1.2, 1.4, 0.4, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.5} />
        </mesh>
        {/* Brass Post Shaft */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 1.4, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Anodized Red Knurled Thumbscrew Head */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.8, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.3} />
        </mesh>
        {/* Gold Banana Jack Receptacle Hole facing inward */}
        <mesh position={[0.4, -0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* Right Binding Post (- GND Black Terminal) */}
      <group position={pathConfig.sourcePosBlack.toArray()}>
        {/* Steel Bench Mount Flange Foot */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[1.2, 1.4, 0.4, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.5} />
        </mesh>
        {/* Brass Post Shaft */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 1.4, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Anodized Black Knurled Thumbscrew Head */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.8, 24]} />
          <meshStandardMaterial color="#18151f" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Gold Banana Jack Receptacle Hole facing inward */}
        <mesh position={[-0.4, -0.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* 2. HEAVY-GAUGE SILICONE TEST LEADS */}
      {/* Red Heavy-Gauge Positive Lead Wire */}
      <mesh geometry={redTubeGeom}>
        <meshStandardMaterial color="#ef4444" roughness={0.45} metalness={0.1} />
      </mesh>

      {/* Black Heavy-Gauge Negative Return Wire */}
      <mesh geometry={blackTubeGeom}>
        <meshStandardMaterial color="#1e293b" roughness={0.55} metalness={0.1} />
      </mesh>

      {/* 3. PRECISION ALLIGATOR PROBE CLAMPS (Clamping firmly to outer tips of pins/rods) */}
      {/* Positive Red Clamp Head */}
      <group position={pathConfig.clampPos.toArray()} rotation={pathConfig.clampPosRot}>
        {/* Insulating Rubber Handle Boot */}
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.55, 1.1, 0.45]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Serrated Steel Alligator Jaws */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.24, 0.12, 0.6, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* Negative Black Clamp Head */}
      <group position={pathConfig.clampNeg.toArray()} rotation={pathConfig.clampNegRot}>
        {/* Insulating Rubber Handle Boot */}
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.55, 1.1, 0.45]} />
          <meshStandardMaterial color="#18151f" roughness={0.4} />
        </mesh>
        {/* Serrated Steel Alligator Jaws */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.24, 0.12, 0.6, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* 4. CONTINUOUS DOTTED CURRENT FLOW ANIMATION (Flows through cables, rods & internal active structure!) */}
      {isSimRunning && (
        <instancedMesh
          ref={dotsMeshRef}
          args={[undefined, undefined, NUM_TOTAL_DOTS]}
        >
          <sphereGeometry args={[1, 14, 14]} />
          <meshBasicMaterial color="#38bdf8" />
        </instancedMesh>
      )}
    </group>
  );
}
