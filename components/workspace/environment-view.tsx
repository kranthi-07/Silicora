'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { ENVIRONMENTS } from '@/data/environments';
import { Component3DMatrix } from '@/components/explorer/component-3d-matrix';
import { ComponentGrid } from '@/components/explorer/component-grid';
import { ComponentCanvas } from '@/components/viewer/component-canvas';
import { SimLabView } from '@/components/simulation/sim-lab-view';
import { CircuitWorkspaceView } from '@/components/circuit/circuit-workspace-view';
import { DeviceExplorerView } from '@/components/devices/device-explorer-view';
import { PcbStudioView } from '@/components/pcb/pcb-studio-view';
import { LearningAcademyView } from '@/components/academy/learning-academy-view';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EnvironmentView() {
  const {
    activeEnvironment,
    setActiveEnvironment,
    selectedComponent,
    setDetailModalOpen,
    setActiveDetailTab,
    catalogViewMode,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';

  // Environment 1: 3D Spatial Component Matrix (Interactive 3D Motion Gallery)
  if (activeEnvironment === 'component_explorer') {
    return <Component3DMatrix />;
  }

  // Environment 2: Physical Architecture & Cross-Section Cutaway Studio
  if (activeEnvironment === 'internal_cutaway') {
    if (catalogViewMode === 'grid' || catalogViewMode === 'table') {
      return <ComponentGrid />;
    }
    return (
      <div className="flex-1 w-full h-full relative flex flex-col overflow-hidden">
        {/* Floating Quick Return to 3D Matrix */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveEnvironment('component_explorer');
              if (typeof window !== 'undefined') {
                window.history.pushState({ env: 'component_explorer' }, '', '/workspace/component_explorer');
              }
            }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg text-xs font-sans transition-all group cursor-pointer',
              isLight
                ? 'bg-white/95 border-slate-200 text-slate-700 hover:text-slate-900 shadow-md hover:border-[#F06543]/40'
                : 'bg-[#14121A]/85 border-white/[0.08] text-[#8E8899] hover:text-white hover:border-[#F06543]/40'
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F06543] group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Back to 3D Component Matrix</span>
          </button>
        </div>
        <ComponentCanvas />
      </div>
    );
  }

  // Environment 3: Electrical Simulation Lab
  if (activeEnvironment === 'electrical_sim_lab') {
    return <SimLabView />;
  }

  // Environment 4: 3D Circuit Workspace (Breadboard & Open Circuit)
  if (activeEnvironment === 'circuit_workspace') {
    return <CircuitWorkspaceView />;
  }

  // Environment 5: Device Explorer & Teardowns
  if (activeEnvironment === 'device_explorer') {
    return <DeviceExplorerView />;
  }

  // Environment 6: PCB Studio
  if (activeEnvironment === 'pcb_studio') {
    return <PcbStudioView />;
  }

  // Environment 7: Learning Academy
  if (activeEnvironment === 'learning_academy') {
    return <LearningAcademyView />;
  }

  const currentEnv =
    ENVIRONMENTS.find((e) => e.id === activeEnvironment) || ENVIRONMENTS[0];

  // Other Environments: Professional Foundation Views
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#090B0E] text-center overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl w-full p-8 rounded-2xl bg-[#161B22] border border-[#30363D] shadow-card text-left space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="accent" size="sm">
            ENVIRONMENT BLUEPRINT
          </Badge>
          <Badge
            variant={currentEnv.status === 'ready' ? 'nominal' : 'warning'}
            size="sm"
          >
            {currentEnv.status.toUpperCase()}
          </Badge>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#F0F6FC] tracking-tight">
            {currentEnv.title}
          </h2>
          <p className="text-xs text-[#58A6FF] font-mono mt-0.5">
            {currentEnv.tagline}
          </p>
          <p className="text-xs text-[#8B949E] mt-2 leading-relaxed">
            {currentEnv.description}
          </p>
        </div>

        {/* Feature Highlights for this environment */}
        <div className="p-4 rounded-xl bg-[#101318] border border-[#21262D] space-y-3">
          <h4 className="text-xs font-semibold text-[#F0F6FC] uppercase tracking-wider font-mono">
            Architectural Invariants & Capabilities:
          </h4>
          <ul className="text-xs space-y-2 text-[#8B949E]">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Multi-Layer Stackup Viewer:</strong> Solder mask, copper planes, prepreg, core, and silkscreen layer inspection.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Interactive Net Tracing:</strong> Illuminates complete 3D copper paths through microvias and blind vias.</span>
            </li>
          </ul>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveEnvironment('component_explorer')}
          >
            ← Return to Component Explorer
          </Button>

          {selectedComponent && (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => {
                setActiveDetailTab('overview');
                setDetailModalOpen(true);
              }}
            >
              Inspect {selectedComponent.name}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
