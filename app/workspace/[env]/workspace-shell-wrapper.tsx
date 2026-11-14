'use client';

import React, { useEffect, Suspense } from 'react';
import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { WorkspaceLoadingScreen } from '@/components/workspace/workspace-loading-screen';
import { useWorkspaceStore } from '@/lib/store';
import { LabEnvironment } from '@/types/workspace';

const VALID_ENVS: Record<string, LabEnvironment> = {
  component_explorer: 'component_explorer',
  internal_cutaway: 'internal_cutaway',
  electrical_sim_lab: 'electrical_sim_lab',
  circuit_workspace: 'circuit_workspace',
  device_explorer: 'device_explorer',
  pcb_studio: 'pcb_studio',
  learning_academy: 'learning_academy',
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

export function WorkspaceShellWrapper({ envSlug }: { envSlug: string }) {
  const setActiveEnvironment = useWorkspaceStore((state) => state.setActiveEnvironment);

  useEffect(() => {
    if (envSlug && VALID_ENVS[envSlug]) {
      setActiveEnvironment(VALID_ENVS[envSlug]);
    }
  }, [envSlug, setActiveEnvironment]);

  return (
    <Suspense fallback={<WorkspaceLoadingScreen />}>
      <WorkspaceShell />
    </Suspense>
  );
}
