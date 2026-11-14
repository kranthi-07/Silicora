'use client';

import React from 'react';
import { ContactShadows } from '@react-three/drei';
import { useWorkspaceStore } from '@/lib/store';

export function SceneLighting() {
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  return (
    <>
      {/* 1. Global Ambient Fill */}
      <ambientLight intensity={isLight ? 1.4 : 1.15} />

      {/* 2. Main Studio Key Light (Angled from front-top-right) */}
      <directionalLight
        position={[12, 18, 16]}
        intensity={isLight ? 2.5 : 2.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      {/* 3. Front Fill Light (Directly illuminates the front face and markings of dark packages) */}
      <directionalLight
        position={[0, 8, 16]}
        intensity={isLight ? 1.2 : 1.4}
        color={isLight ? '#ffffff' : '#f1f5f9'}
      />

      {/* 4. Left Secondary Fill Light */}
      <directionalLight
        position={[-15, 12, 8]}
        intensity={isLight ? 1.3 : 1.1}
        color={isLight ? '#f8fafc' : '#93c5fd'}
      />

      {/* 5. Powerful Dual Back Rim Lights (Outlines dark components against dark backgrounds) */}
      <directionalLight
        position={[0, 12, -18]}
        intensity={isLight ? 1.4 : 2.4}
        color={isLight ? '#ffffff' : '#e0f2fe'}
      />
      <directionalLight
        position={[-14, 16, -16]}
        intensity={isLight ? 1.2 : 2.0}
        color={isLight ? '#ffffff' : '#93c5fd'}
      />

      {/* 6. Subtle Bottom Bounce Light */}
      <directionalLight
        position={[0, -12, 6]}
        intensity={isLight ? 0.6 : 0.75}
        color={isLight ? '#e2e8f0' : '#38bdf8'}
      />

      {/* 7. Close Point Light for Specular Metallic Pins */}
      <pointLight
        position={[0, 6, 8]}
        intensity={isLight ? 0.8 : 0.9}
        distance={30}
      />

      {/* 8. Realistic Ground Contact Shadows */}
      <ContactShadows
        position={[0, -7.98, 0]}
        opacity={isLight ? 0.35 : 0.45}
        scale={45}
        blur={2.2}
        far={18}
        color={isLight ? '#334155' : '#020617'}
      />
    </>
  );
}
