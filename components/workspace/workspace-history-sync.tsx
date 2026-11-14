'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
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

export function WorkspaceHistorySync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeEnvironment, setActiveEnvironment } = useWorkspaceStore();

  // 1. Sync on Next.js pathname / searchParams change
  useEffect(() => {
    if (!pathname) return;

    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'workspace' && segments[1]) {
      const slug = segments[1];
      if (VALID_ENVS[slug] && VALID_ENVS[slug] !== activeEnvironment) {
        setActiveEnvironment(VALID_ENVS[slug]);
        return;
      }
    }

    const queryEnv = searchParams?.get('env');
    if (queryEnv && VALID_ENVS[queryEnv] && VALID_ENVS[queryEnv] !== activeEnvironment) {
      setActiveEnvironment(VALID_ENVS[queryEnv]);
    }
  }, [pathname, searchParams, activeEnvironment, setActiveEnvironment]);

  // 2. Listen to browser Back / Forward (popstate) events
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const segments = currentPath.split('/').filter(Boolean);

      if (segments[0] === 'workspace' && segments[1]) {
        const slug = segments[1];
        if (VALID_ENVS[slug]) {
          setActiveEnvironment(VALID_ENVS[slug]);
        }
      } else if (segments[0] === 'workspace' || segments[0] === 'lab') {
        const params = new URLSearchParams(window.location.search);
        const env = params.get('env');
        if (env && VALID_ENVS[env]) {
          setActiveEnvironment(VALID_ENVS[env]);
        } else {
          setActiveEnvironment('component_explorer');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveEnvironment]);

  return null;
}
