'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PcbProject, SoldermaskColor, SurfaceFinish } from '@/types/pcb';
import { getFootprint } from '@/lib/pcb/footprint-library';

interface Pcb3DCanvasProps {
  project: PcbProject;
  explodeStackPercent: number; // 0 to 100%
  showComponents: boolean;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
}

const SOLDERMASK_COLORS: Record<SoldermaskColor, { hex: string; roughness: number; metalness: number }> = {
  green: { hex: '#0f5132', roughness: 0.35, metalness: 0.1 },
  black: { hex: '#18181b', roughness: 0.4, metalness: 0.2 },
  blue: { hex: '#1d4ed8', roughness: 0.35, metalness: 0.1 },
  purple: { hex: '#6b21a8', roughness: 0.35, metalness: 0.1 },
  red: { hex: '#991b1b', roughness: 0.35, metalness: 0.1 },
  white: { hex: '#f1f5f9', roughness: 0.45, metalness: 0.05 },
};

export function Pcb3DCanvas({
  project,
  explodeStackPercent,
  showComponents,
  selectedComponentId,
  onSelectComponent,
}: Pcb3DCanvasProps) {
  const explodeFactor = explodeStackPercent / 100;

  return (
    <div className="relative w-full h-full bg-slate-950">
      <Canvas
        camera={{ position: [0, 45, 60], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#030712']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[30, 60, 40]} intensity={1.5} castShadow />
        <directionalLight position={[-30, -30, -20]} intensity={0.5} />
        <pointLight position={[0, 20, 0]} intensity={1.0} color="#ffffff" />

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2 + 0.1} />

        <PcbBoardModel
          project={project}
          explodeFactor={explodeFactor}
          showComponents={showComponents}
          selectedComponentId={selectedComponentId}
          onSelectComponent={onSelectComponent}
        />

        <ContactShadows
          position={[0, -project.boardOutline.heightMm / 2 - 2, 0]}
          opacity={0.6}
          scale={120}
          blur={2.5}
          far={30}
        />
      </Canvas>
    </div>
  );
}

function PcbBoardModel({
  project,
  explodeFactor,
  showComponents,
  selectedComponentId,
  onSelectComponent,
}: {
  project: PcbProject;
  explodeFactor: number;
  showComponents: boolean;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
}) {
  const { widthMm, heightMm, thicknessMm, mountingHoles } = project.boardOutline;
  const maskStyle = SOLDERMASK_COLORS[project.soldermaskColor] || SOLDERMASK_COLORS.green;
  const finishColor = project.surfaceFinish === 'ENIG' ? '#fbbf24' : '#cbd5e1';

  // Centering offsets
  const cx = widthMm / 2;
  const cz = heightMm / 2;

  // Layer stack explosion separation heights in mm
  const sepF_Silk = explodeFactor * 12;
  const sepF_Mask = explodeFactor * 8;
  const sepF_Cu = explodeFactor * 4;
  const sepB_Cu = -explodeFactor * 4;
  const sepB_Mask = -explodeFactor * 8;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. FR-4 Dielectric Core Substrate */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[widthMm, thicknessMm, heightMm]} />
        <meshStandardMaterial
          color={maskStyle.hex}
          roughness={maskStyle.roughness}
          metalness={maskStyle.metalness}
        />
      </mesh>

      {/* Corner Mounting Holes Through-Board */}
      {mountingHoles.map((hole, i) => (
        <group key={`mhole_${i}`} position={[hole.x - cx, 0, hole.y - cz]}>
          {/* Top annular ring */}
          <mesh position={[0, thicknessMm / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[hole.drillDiameterMm / 2, hole.padDiameterMm / 2, 32]} />
            <meshStandardMaterial color={finishColor} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Bottom annular ring */}
          <mesh position={[0, -thicknessMm / 2 - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[hole.drillDiameterMm / 2, hole.padDiameterMm / 2, 32]} />
            <meshStandardMaterial color={finishColor} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Inner drill cylinder (hollow feel) */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[hole.drillDiameterMm / 2, hole.drillDiameterMm / 2, thicknessMm + 0.1, 24]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 2. Top Copper (F.Cu) Layer */}
      <group position={[0, thicknessMm / 2 + 0.05 + sepF_Cu, 0]}>
        {project.tracks
          .filter((t) => t.layer === 'F_Cu')
          .map((track) => {
            const startX = track.startMm[0] - cx;
            const startZ = track.startMm[1] - cz;
            const endX = track.endMm[0] - cx;
            const endZ = track.endMm[1] - cz;

            const length = Math.hypot(endX - startX, endZ - startZ);
            if (length < 0.05) return null;

            const midX = (startX + endX) / 2;
            const midZ = (startZ + endZ) / 2;
            const angle = Math.atan2(endZ - startZ, endX - startX);

            return (
              <mesh
                key={track.id}
                position={[midX, 0.02, midZ]}
                rotation={[-Math.PI / 2, 0, -angle]}
              >
                <planeGeometry args={[length, track.widthMm]} />
                <meshStandardMaterial
                  color="#dc2626" // Rich copper red on top
                  metalness={0.85}
                  roughness={0.2}
                />
              </mesh>
            );
          })}
      </group>

      {/* 3. Bottom Copper (B.Cu) Layer */}
      <group position={[0, -thicknessMm / 2 - 0.05 + sepB_Cu, 0]}>
        {project.tracks
          .filter((t) => t.layer === 'B_Cu')
          .map((track) => {
            const startX = track.startMm[0] - cx;
            const startZ = track.startMm[1] - cz;
            const endX = track.endMm[0] - cx;
            const endZ = track.endMm[1] - cz;

            const length = Math.hypot(endX - startX, endZ - startZ);
            if (length < 0.05) return null;

            const midX = (startX + endX) / 2;
            const midZ = (startZ + endZ) / 2;
            const angle = Math.atan2(endZ - startZ, endX - startX);

            return (
              <mesh
                key={track.id}
                position={[midX, -0.02, midZ]}
                rotation={[Math.PI / 2, 0, angle]}
              >
                <planeGeometry args={[length, track.widthMm]} />
                <meshStandardMaterial
                  color="#2563eb" // Blue bottom copper
                  metalness={0.85}
                  roughness={0.2}
                />
              </mesh>
            );
          })}
      </group>

      {/* 4. Exposed Solder Pads (Plated ENIG / HASL) */}
      {project.placedComponents.map((comp) => {
        const footprint = getFootprint(comp.footprintId);
        const rad = (comp.rotationDeg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        return footprint.pads.map((pad, pIdx) => {
          const rotX = pad.offsetMm[0] * cos - pad.offsetMm[1] * sin;
          const rotZ = pad.offsetMm[0] * sin + pad.offsetMm[1] * cos;
          const px = comp.positionMm[0] + rotX - cx;
          const pz = comp.positionMm[1] + rotZ - cz;

          return (
            <group key={`${comp.id}_p_${pIdx}`}>
              {/* Top Pad */}
              <mesh position={[px, thicknessMm / 2 + 0.07 + sepF_Cu, pz]} rotation={[-Math.PI / 2, 0, 0]}>
                {pad.shape === 'rect' ? (
                  <planeGeometry args={[pad.sizeMm[0], pad.sizeMm[1]]} />
                ) : (
                  <circleGeometry args={[pad.sizeMm[0] / 2, 24]} />
                )}
                <meshStandardMaterial color={finishColor} roughness={0.15} metalness={0.95} />
              </mesh>

              {/* Bottom Pad if THT */}
              {pad.drillMm > 0 && (
                <mesh position={[px, -thicknessMm / 2 - 0.07 + sepB_Cu, pz]} rotation={[Math.PI / 2, 0, 0]}>
                  {pad.shape === 'rect' ? (
                    <planeGeometry args={[pad.sizeMm[0], pad.sizeMm[1]]} />
                  ) : (
                    <circleGeometry args={[pad.sizeMm[0] / 2, 24]} />
                  )}
                  <meshStandardMaterial color={finishColor} roughness={0.15} metalness={0.95} />
                </mesh>
              )}

              {/* Drill Hole */}
              {pad.drillMm > 0 && (
                <mesh position={[px, 0, pz]}>
                  <cylinderGeometry args={[pad.drillMm / 2, pad.drillMm / 2, thicknessMm + 0.2, 16]} />
                  <meshStandardMaterial color="#020617" roughness={0.9} />
                </mesh>
              )}
            </group>
          );
        });
      })}

      {/* 5. Top Silkscreen (F.SilkS) Reference Designators */}
      <group position={[0, thicknessMm / 2 + 0.12 + sepF_Silk, 0]}>
        {project.placedComponents.map((comp) => {
          const px = comp.positionMm[0] - cx;
          const pz = comp.positionMm[1] - cz;

          return (
            <group key={`text_${comp.id}`} position={[px, 0, pz - 4]} rotation={[-Math.PI / 2, 0, 0]}>
              <Text
                fontSize={1.4}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Inter-Bold.ttf"
              >
                {comp.designator}
              </Text>
            </group>
          );
        })}
      </group>

      {/* 6. Physical 3D Components Mounted on Board */}
      {showComponents && (
        <group position={[0, thicknessMm / 2 + sepF_Cu, 0]}>
          {project.placedComponents.map((comp) => {
            const isSelected = selectedComponentId === comp.id;
            const px = comp.positionMm[0] - cx;
            const pz = comp.positionMm[1] - cz;
            const rotY = -(comp.rotationDeg * Math.PI) / 180;

            return (
              <group
                key={`comp3d_${comp.id}`}
                position={[px, 0, pz]}
                rotation={[0, rotY, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectComponent(comp.id);
                }}
              >
                <Render3DComponentBody
                  footprintId={comp.footprintId}
                  value={comp.value}
                  isSelected={isSelected}
                />
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}

/**
 * Procedural 3D physical models for standard components
 */
function Render3DComponentBody({
  footprintId,
  value,
  isSelected,
}: {
  footprintId: string;
  value: string;
  isSelected: boolean;
}) {
  // 1. Resistor: Cylindrical body with bent lead wires
  if (footprintId.includes('DIN0207') || footprintId.includes('Axial')) {
    return (
      <group position={[0, 2.5, 0]}>
        {/* Main Body */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.25, 1.25, 6.5, 24]} />
          <meshStandardMaterial
            color={isSelected ? '#38bdf8' : '#e2d9c8'}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Color Bands */}
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.27, 1.27, 0.45, 24]} />
          <meshStandardMaterial color="#92400e" roughness={0.3} />
        </mesh>
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.27, 1.27, 0.45, 24]} />
          <meshStandardMaterial color="#000000" roughness={0.3} />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.27, 1.27, 0.45, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.27, 1.27, 0.45, 24]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} />
        </mesh>
        {/* Bent Metal Leads entering through-holes */}
        <mesh position={[-4.2, -1.25, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 2.5, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[4.2, -1.25, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 2.5, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  // 2. LED: 5mm Epoxy Dome with cathode flat & leadframe
  if (footprintId.includes('LED')) {
    return (
      <group position={[0, 4.0, 0]}>
        {/* Transparent colored dome */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[2.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color={isSelected ? '#38bdf8' : '#ef4444'}
            transmission={0.8}
            opacity={1.0}
            transparent
            roughness={0.1}
            ior={1.5}
            emissive={isSelected ? '#0284c7' : '#7f1d1d'}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[2.5, 2.8, 2.4, 24]} />
          <meshPhysicalMaterial
            color={isSelected ? '#38bdf8' : '#ef4444'}
            transmission={0.7}
            roughness={0.15}
            ior={1.5}
          />
        </mesh>
        {/* Metal Leads */}
        <mesh position={[-1.27, -3.0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 4.0, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[1.27, -3.0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 4.0, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  // 3. Electrolytic Capacitor: Aluminum can with vinyl sleeve
  if (footprintId.includes('CP_Radial') || footprintId.includes('Capacitor')) {
    return (
      <group position={[0, 5.5, 0]}>
        {/* Can body */}
        <mesh>
          <cylinderGeometry args={[4.0, 4.0, 11.0, 24]} />
          <meshStandardMaterial
            color={isSelected ? '#38bdf8' : '#1e293b'}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        {/* Top Aluminum Vent cross */}
        <mesh position={[0, 5.51, 0]}>
          <cylinderGeometry args={[3.8, 3.8, 0.1, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Polarity White Stripe */}
        <mesh position={[2.8, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.4, 10.8, 2.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>
    );
  }

  // 4. TO-92 Transistor
  if (footprintId.includes('TO-92')) {
    return (
      <group position={[0, 3.0, 0]}>
        {/* D-shaped epoxy molding */}
        <mesh>
          <cylinderGeometry args={[2.2, 2.2, 5.0, 24, 1, false, 0, Math.PI * 1.3]} />
          <meshStandardMaterial
            color={isSelected ? '#38bdf8' : '#18181b'}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        {/* 3 Leads */}
        <mesh position={[-1.27, -2.5, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 3.0, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -2.5, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 3.0, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[1.27, -2.5, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 3.0, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  // 5. Terminal Block 2-Pin
  if (footprintId.includes('TerminalBlock')) {
    return (
      <group position={[0, 4.5, 0]}>
        {/* Green Plastic Housing */}
        <mesh>
          <boxGeometry args={[10.0, 9.0, 8.0]} />
          <meshStandardMaterial
            color={isSelected ? '#38bdf8' : '#15803d'}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Screw Terminals */}
        <mesh position={[-2.54, 4.55, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.2, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[2.54, 4.55, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.2, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  // 6. Pushbutton Switch
  if (footprintId.includes('SW_PUSH') || footprintId.includes('TACT')) {
    return (
      <group position={[0, 2.0, 0]}>
        {/* Silver metal top bracket */}
        <mesh>
          <boxGeometry args={[6.0, 3.5, 6.0]} />
          <meshStandardMaterial
            color={isSelected ? '#38bdf8' : '#94a3b8'}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        {/* Black central actuator plunger */}
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[1.6, 1.6, 1.2, 24]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>
      </group>
    );
  }

  // Fallback IC or Block
  return (
    <group position={[0, 2.0, 0]}>
      <mesh>
        <boxGeometry args={[8.0, 3.5, 6.0]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : '#1e293b'}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}
