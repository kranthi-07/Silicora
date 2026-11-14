import React from 'react';
import { WorkspaceLoadingScreen } from '@/components/workspace/workspace-loading-screen';

export default function EnvironmentLoading() {
  return <WorkspaceLoadingScreen title="Switching Environment" subtitle="Preparing spatial 3D models and live telemetry..." />;
}