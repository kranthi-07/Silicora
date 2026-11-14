import React from 'react';
import { WorkspaceShellWrapper } from './workspace-shell-wrapper';

const VALID_SLUGS = [
  'component_explorer',
  'internal_cutaway',
  'electrical_sim_lab',
  'circuit_workspace',
  'device_explorer',
  'pcb_studio',
  'learning_academy',
  'explorer',
  'components',
  'cutaway',
  'cutaways',
  'simulation',
  'sim',
  'simulate',
  'circuit',
  'circuits',
  'breadboard',
  'device',
  'devices',
  'teardown',
  'teardowns',
  'pcb',
  'academy',
  'learn',
];

export function generateStaticParams() {
  return VALID_SLUGS.map((env) => ({ env }));
}

export default async function IndividualWorkspacePage({
  params,
}: {
  params: Promise<{ env: string }>;
}) {
  const { env } = await params;
  return <WorkspaceShellWrapper envSlug={env} />;
}
