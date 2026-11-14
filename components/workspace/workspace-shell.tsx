'use client';

import React, { Suspense, useEffect } from 'react';
import { WorkspaceTopbar } from '@/components/workspace/topbar';
import { WorkspaceStatusBar } from '@/components/workspace/status-bar';
import { WorkspaceLeftSidebar } from '@/components/workspace/left-sidebar';
import { WorkspaceInspectorPanel } from '@/components/workspace/inspector-panel';
import { WorkspaceBottomDock } from '@/components/workspace/bottom-dock';
import { EnvironmentView } from '@/components/workspace/environment-view';
import { ComponentDetailDialog } from '@/components/explorer/component-detail-dialog';
import { WorkspaceHistorySync } from '@/components/workspace/workspace-history-sync';
import { GlobalHotkeys } from '@/components/workspace/global-hotkeys';
import { CodeEditorModal } from '@/components/code-editor/code-editor-modal';
import { WorkspaceTutorialTour } from '@/components/tutorial/workspace-tutorial-tour';
import { useWorkspaceStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { FolderKanban, Cpu } from 'lucide-react';

export function WorkspaceShell() {
  const {
    leftSidebarOpen,
    toggleLeftSidebar,
    rightInspectorOpen,
    toggleRightInspector,
    setIsTransitioningToWorkspace,
    themeMode,
  } = useWorkspaceStore();

  useEffect(() => {
    setIsTransitioningToWorkspace(false);
  }, [setIsTransitioningToWorkspace]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (themeMode === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }
  }, [themeMode]);

  const isLight = themeMode === 'light';

  return (
    <div
      className={cn(
        'flex flex-col h-screen w-screen overflow-hidden font-sans antialiased select-none transition-colors duration-300',
        isLight ? 'bg-[#F1F5F9] text-slate-800' : 'bg-lab-canvas text-lab-text-primary'
      )}
    >
      {/* Global Hotkeys: Ctrl+L (Workspace), Ctrl+D (Code Editor), etc. */}
      <GlobalHotkeys />

      {/* 0. History & Browser Back/Forward Synchronization */}
      <Suspense fallback={null}>
        <WorkspaceHistorySync />
      </Suspense>

      {/* 1. Primary Top Navigation & Environment Switcher */}
      <WorkspaceTopbar />

      {/* 2. Main Workspace Body (Sidebar | Viewport | Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Component Catalog Sidebar */}
        <WorkspaceLeftSidebar />

        {/* Main 3D Stage / Environment Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          <EnvironmentView />
        </main>

        {/* Right Visual Inspector Panel */}
        <WorkspaceInspectorPanel />
      </div>

      {/* 3. Bottom Instrument Dock (Oscilloscope, SPICE Engine Log) */}
      <WorkspaceBottomDock />

      {/* 4. Lower Engineering Status & Telemetry Bar */}
      <WorkspaceStatusBar />

      {/* 5. Component Datasheet & Physics Inspection Dialog */}
      <ComponentDetailDialog />

      {/* 6. Embedded MCU Coding Platform & Inbuilt Serial Monitor */}
      <CodeEditorModal />

      {/* 7. Guided Onboarding Tutorial Tour (First Time Visitors) */}
      <WorkspaceTutorialTour />
    </div>
  );
}
