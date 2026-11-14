'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWorkspaceStore } from '@/lib/store';
import { SceneLighting } from './scene-lighting';
import { CameraController } from './camera-controller';
import { ComponentRenderer } from './component-renderer';
import { ViewerOverlay } from './viewer-overlay';
import { SimulationTestBench } from './simulation-test-bench';
import { SimulationLoadingModal } from '@/components/simulation/simulation-loading-modal';
import { LoadingState, ErrorState } from '@/components/ui/state-views';
import { cn } from '@/lib/utils';

interface ComponentCanvasProps {
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center p-6 bg-[#090B0E]">
          <ErrorState
            title="WebGL 3D Context Error"
            description="The 3D graphics hardware could not initialize the Three.js viewport."
            errorDetails={this.state.error?.message}
            onRetry={() => this.setState({ hasError: false })}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export function ComponentCanvas({ className }: ComponentCanvasProps) {
  // Ensure WebGL initializes only on the client to avoid SSR canvas mismatches
  const [mounted, setMounted] = useState(false);
  const setSelectedLayerId = useWorkspaceStore((state) => state.setSelectedLayerId);
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('w-full h-full flex items-center justify-center', isLight ? 'bg-[#F8FAFC]' : 'bg-[#090B0E]')}>
        <LoadingState
          title="Initializing 3D Lab Engine..."
          description="Mounting Three.js WebGL context and compiling shader materials"
        />
      </div>
    );
  }

  return (
    <CanvasErrorBoundary>
      <div
        className={cn(
          'relative w-full h-full overflow-hidden select-none transition-colors duration-300',
          isLight
            ? 'bg-[radial-gradient(ellipse_at_50%_35%,_#FFFFFF_0%,_#F1F5F9_55%,_#E2E8F0_100%)]'
            : 'bg-[radial-gradient(ellipse_at_50%_40%,_#1E2533_0%,_#11151F_50%,_#090B0E_100%)]',
          className
        )}
      >
        {/* HTML HUD Overlays (Camera controls, Cutaway pill, layer toggles) */}
        <ViewerOverlay />

        {/* Foreground Simulation Loading Animation Modal */}
        <SimulationLoadingModal />

        {/* 3D WebGL Canvas */}
        <Canvas
          shadows
          camera={{ position: [16, 14, 20], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onPointerMissed={() => setSelectedLayerId(null)}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <SceneLighting />
            <CameraController />
            <ComponentRenderer />
            <SimulationTestBench />

            {/* Empty space raycast catcher plane: clicking here deselects all layers */}
            <mesh
              position={[0, -7.99, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerDown={(e) => {
                e.stopPropagation();
                setSelectedLayerId(null);
              }}
            >
              <planeGeometry args={[200, 200]} />
              <meshBasicMaterial visible={false} />
            </mesh>

            {/* Subtle Engineering Ground Grid */}
            <gridHelper
              args={[50, 50, isLight ? '#94a3b8' : '#1e293b', isLight ? '#cbd5e1' : '#0f172a']}
              position={[0, -7.98, 0]}
            />
          </Suspense>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
