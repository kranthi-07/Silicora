'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CutawayLayer, ComponentItem } from '@/types/component';
import { useWorkspaceStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Box, Sparkles, Layers, Eye } from 'lucide-react';

interface InspectorLayer3DViewProps {
  component: ComponentItem;
}

// 3D Geometry representation for an isolated layer part
function IsolatedPartMesh({
  layer,
  isSimRunning,
}: {
  layer: CutawayLayer;
  isSimRunning: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Gentle auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const getMaterial = () => {
    const isConductive =
      layer.materialType === 'copper_leadframe' ||
      layer.materialType === 'gold_wirebond' ||
      layer.layerId.includes('spiral') ||
      layer.layerId.includes('leads') ||
      layer.layerId.includes('caps') ||
      layer.layerId.includes('die');

    const emissiveColor = isSimRunning && isConductive ? '#00f0ff' : '#000000';
    const emissiveIntensity = isSimRunning && isConductive ? 0.6 : 0;

    switch (layer.materialType) {
      case 'copper_leadframe':
        return (
          <meshStandardMaterial
            color="#D97706"
            metalness={0.85}
            roughness={0.25}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
          />
        );
      case 'gold_wirebond':
        return (
          <meshStandardMaterial
            color="#F59E0B"
            metalness={0.9}
            roughness={0.2}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
          />
        );
      case 'silicon_die':
        return (
          <meshStandardMaterial
            color="#0284C7"
            metalness={0.7}
            roughness={0.3}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
          />
        );
      case 'ceramic':
        return (
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.1}
            roughness={0.5}
          />
        );
      case 'plastic_mold':
        return (
          <meshPhysicalMaterial
            color="#0F172A"
            roughness={0.35}
            metalness={0.1}
            transmission={0.4}
            opacity={0.85}
            transparent
          />
        );
      case 'ferrite':
        return (
          <meshStandardMaterial
            color="#334155"
            metalness={0.4}
            roughness={0.7}
          />
        );
      default:
        return (
          <meshStandardMaterial
            color="#94A3B8"
            metalness={0.5}
            roughness={0.4}
          />
        );
    }
  };

  // Render distinct geometries based on layerId
  const renderGeometry = () => {
    const id = layer.layerId.toLowerCase();

    if (id.includes('core') || id.includes('ceramic')) {
      // Cylinder core
      return (
        <cylinderGeometry args={[1.2, 1.2, 5.0, 32]} />
      );
    }

    if (id.includes('spiral') || id.includes('track') || id.includes('winding')) {
      // Helical spring / spiral ring
      return (
        <torusGeometry args={[1.4, 0.25, 16, 64]} />
      );
    }

    if (id.includes('caps') || id.includes('terminals') || id.includes('leads')) {
      // Two precision caps connected by leads
      return (
        <group>
          <mesh position={[-2.2, 0, 0]}>
            <cylinderGeometry args={[1.35, 1.35, 0.8, 24]} />
            {getMaterial()}
          </mesh>
          <mesh position={[2.2, 0, 0]}>
            <cylinderGeometry args={[1.35, 1.35, 0.8, 24]} />
            {getMaterial()}
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 7.5, 16]} />
            {getMaterial()}
          </mesh>
        </group>
      );
    }

    if (id.includes('die') || id.includes('atmega') || id.includes('rp2040')) {
      // Monolithic silicon wafer / die
      return (
        <boxGeometry args={[2.5, 0.4, 2.5]} />
      );
    }

    if (id.includes('can') || id.includes('housing')) {
      // Protective outer can
      return (
        <cylinderGeometry args={[1.5, 1.5, 4.0, 24]} />
      );
    }

    // Default: Sleek precision component part block
    return (
      <boxGeometry args={[2.2, 1.8, 2.2]} />
    );
  };

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          {renderGeometry()}
          {getMaterial()}
        </mesh>
      </Float>
    </group>
  );
}

export function InspectorLayer3DView({ component }: InspectorLayer3DViewProps) {
  const { selectedLayerId, setSelectedLayerId, isSimRunning, themeMode } = useWorkspaceStore();
  const isLight = themeMode === 'light';

  const layers = component.visual3d.internalLayers;
  const activeLayer =
    layers.find((l: CutawayLayer) => l.layerId === selectedLayerId) || layers[0];

  return (
    <div className="space-y-2">
      {/* 3D Viewport Box */}
      <div
        className={cn(
          'relative w-full h-36 rounded-xl border overflow-hidden shadow-inner group transition-colors',
          isLight
            ? 'bg-gradient-to-b from-slate-100 to-slate-200/80 border-slate-300'
            : 'bg-gradient-to-b from-[#0B0E14] to-[#12161F] border-cyan-500/30'
        )}
      >
        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
          <span
            className={cn(
              'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm',
              isLight
                ? 'bg-sky-100 text-sky-800 border-sky-300'
                : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
            )}
          >
            3D PART INSPECTOR
          </span>
          <span
            className={cn(
              'text-[8px] font-mono px-1.5 py-0.2 rounded-full border',
              isSimRunning
                ? isLight
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold animate-pulse'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 animate-pulse'
                : isLight
                ? 'bg-slate-200/80 text-slate-600 border-slate-300'
                : 'bg-white/[0.08] text-[#8B949E] border-white/[0.08]'
            )}
          >
            {isSimRunning ? 'SIM ACTIVE' : '3D STUDIO'}
          </span>
        </div>

        {/* 3D Canvas Viewport */}
        <Canvas camera={{ position: [0, 2, 5.5], fov: 45 }}>
          <ambientLight intensity={isLight ? 1.6 : 1.2} />
          <directionalLight position={[5, 8, 5]} intensity={isLight ? 2.2 : 1.8} />
          <pointLight position={[-4, -2, -3]} intensity={0.8} color={isLight ? '#38bdf8' : '#00f0ff'} />
          <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#ffffff" />
          <Suspense fallback={null}>
            <Center>
              <IsolatedPartMesh layer={activeLayer} isSimRunning={isSimRunning} />
            </Center>
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            rotateSpeed={0.8}
          />
        </Canvas>

        {/* Bottom Part Info Ribbon */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 px-2.5 py-1.5 border-t flex items-center justify-between backdrop-blur-md transition-colors',
            isLight
              ? 'bg-white/90 border-slate-200 text-slate-800'
              : 'bg-[#161B22]/90 border-white/[0.08] text-white'
          )}
        >
          <div className="truncate">
            <span
              className={cn(
                'text-[10px] font-bold block truncate',
                isLight ? 'text-slate-900' : 'text-white'
              )}
            >
              {activeLayer.displayName}
            </span>
            <span
              className={cn(
                'text-[8px] font-mono block truncate',
                isLight ? 'text-sky-600' : 'text-cyan-400'
              )}
            >
              {activeLayer.materialType.replace(/_/g, ' ')}
            </span>
          </div>
          <span
            className={cn(
              'text-[8px] font-mono shrink-0',
              isLight ? 'text-slate-400' : 'text-[#8B949E]'
            )}
          >
            Drag to orbit
          </span>
        </div>
      </div>

      {/* Part Selection Buttons */}
      <div className="space-y-1">
        <span
          className={cn(
            'text-[9px] uppercase font-mono font-bold flex items-center justify-between px-0.5',
            isLight ? 'text-slate-500' : 'text-[#8B949E]'
          )}
        >
          <span>Component Parts ({layers.length})</span>
          {selectedLayerId && (
            <button
              type="button"
              onClick={() => setSelectedLayerId(null)}
              className={cn(
                'hover:underline cursor-pointer lowercase',
                isLight ? 'text-sky-600 font-semibold' : 'text-cyan-400'
              )}
            >
              clear selection
            </button>
          )}
        </span>

        <div className="grid grid-cols-1 gap-1">
          {layers.map((layer: CutawayLayer, idx: number) => {
            const isSelected = selectedLayerId === layer.layerId;
            return (
              <button
                key={layer.layerId}
                type="button"
                onClick={() => setSelectedLayerId(isSelected ? null : layer.layerId)}
                className={cn(
                  'w-full p-1.5 rounded-lg text-left transition-all flex items-center justify-between gap-2 border text-xs cursor-pointer',
                  isSelected
                    ? isLight
                      ? 'bg-sky-100 text-sky-950 font-bold border-sky-400 shadow-sm'
                      : 'bg-cyan-500/20 text-white font-bold border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.25)]'
                    : isLight
                    ? 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
                    : 'bg-[#12161F]/80 text-[#8B949E] hover:text-white hover:bg-[#161B22] border-white/[0.06]'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/[0.08] text-cyan-300 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate text-[10px]">{layer.displayName}</span>
                </div>
                <Eye
                  className={cn(
                    'w-3 h-3 shrink-0',
                    isSelected ? 'text-cyan-400' : 'text-[#6E7681]'
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
