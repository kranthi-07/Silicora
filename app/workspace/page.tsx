'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { useWorkspaceStore } from '@/lib/store';
import { LabEnvironment } from '@/types/workspace';

import { WorkspaceLoadingScreen } from '@/components/workspace/workspace-loading-screen';

const VALID_ENVS: Record<string, LabEnvironment> = {
  component_explorer: 'component_explorer',
  internal_cutaway: 'internal_cutaway',
  electrical_sim_lab: 'electrical_sim_lab',
  circuit_workspace: 'circuit_workspace',
  device_explorer: 'device_explorer',
  pcb_studio: 'pcb_studio',
  learning_academy: 'learning_academy',
  // Short slugs
  explorer: 'component_explorer',
  components: 'component_explorer',
  cutaway: 'internal_cutaway',
  cutaways: 'internal_cutaway',
  simulation: 'electrical_sim_lab',
  sim: 'electrical_sim_lab',
  simulate: 'electrical_sim_lab',
  circuit: 'circuit_workspace',
  circuits: 'circuit_workspace',
  breadboard: 'circuit_workspace',
  device: 'device_explorer',
  devices: 'device_explorer',
  teardown: 'device_explorer',
  teardowns: 'device_explorer',
  pcb: 'pcb_studio',
  academy: 'learning_academy',
  learn: 'learning_academy',
};

function WorkspaceEnvironmentHandler() {
  const searchParams = useSearchParams();
  const setActiveEnvironment = useWorkspaceStore((state) => state.setActiveEnvironment);

  useEffect(() => {
    const envParam = searchParams.get('env');
    if (envParam && VALID_ENVS[envParam]) {
      setActiveEnvironment(VALID_ENVS[envParam]);
    }
  }, [searchParams, setActiveEnvironment]);

  return null;
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<WorkspaceLoadingScreen />}>
      <WorkspaceEnvironmentHandler />
      <WorkspaceShell />
    </Suspense>
  );
}
