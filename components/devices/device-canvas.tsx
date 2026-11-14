'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { DeviceItem, DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import { DeviceExplodedModel } from './models/device-exploded-model';
import { Layers, RotateCcw, Sliders } from 'lucide-react';

interface DeviceCanvasProps {
  device: DeviceItem;
  explodePercent: number;
  onExplodeChange: (val: number) => void;
  selectedSubsystemId: string | null;
  selectedPartId: string | null;
  onSelectPart: (part: DeviceComponentPart) => void;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
}

export function DeviceCanvas({
  device,
  explodePercent,
  onExplodeChange,
  selectedSubsystemId,
  selectedPartId,
  onSelectPart,
  onSelectSubsystem,
}: DeviceCanvasProps) {
  return (
    <div className="w-full h-full relative select-none bg-[#090B0E]">
      <Canvas
        camera={{ position: [14, 16, 20], fov: 42, near: 0.1, far: 1000 }}
        className="w-full h-full"
      >
        <color attach="background" args={['#090B0E']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[20, 30, 20]} intensity={1.5} castShadow />
        <directionalLight position={[-20, 15, -20]} intensity={0.8} color="#93C5FD" />
        <pointLight position={[0, -10, 0]} intensity={0.5} />

        <Suspense fallback={null}>
          <DeviceExplodedModel
            device={device}
            explodePercent={explodePercent}
            selectedSubsystemId={selectedSubsystemId}
            selectedPartId={selectedPartId}
            onSelectPart={onSelectPart}
            onSelectSubsystem={onSelectSubsystem}
          />
        </Suspense>

        <Grid
          position={[0, -6, 0]}
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.8}
          cellColor="#21262D"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#30363D"
          fadeDistance={50}
        />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={70}
        />
      </Canvas>

      {/* Exploded View Control HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-[#101318]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#30363D] shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-[#F0F6FC]">
          <Layers className="w-4 h-4 text-[#58A6FF]" />
          <span>Exploded View:</span>
          <span className="text-[#58A6FF] font-bold w-10 text-right">{explodePercent}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={explodePercent}
          onChange={(e) => onExplodeChange(Number(e.target.value))}
          className="w-36 h-1.5 bg-[#21262D] rounded-lg appearance-none cursor-pointer accent-[#58A6FF]"
        />

        <button
          type="button"
          onClick={() => onExplodeChange(explodePercent > 0 ? 0 : 75)}
          className="p-1 rounded text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors"
          title={explodePercent > 0 ? 'Collapse Assembly' : 'Quick Explode'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3D Viewport Controls Hint */}
      <div className="absolute bottom-4 left-4 z-10 text-[10px] font-mono text-[#6E7681] bg-[#101318]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#21262D]">
        <span>Left-Click: Orbit | Right-Click: Pan | Scroll: Zoom</span>
      </div>
    </div>
  );
}
