'use client';

import React from 'react';
import { HomeNavbar } from '@/components/home/home-navbar';
import { FuturisticHero } from '@/components/home/futuristic-hero';
import { AutoscrollComponentsTicker } from '@/components/home/autoscroll-components-ticker';
import { FuturisticBento } from '@/components/home/futuristic-bento';
import { FuturisticFooter } from '@/components/home/futuristic-footer';
import { HomeFloatingWorkspacePill } from '@/components/home/home-floating-workspace-pill';
import { GlobalHotkeys } from '@/components/workspace/global-hotkeys';
import { CodeEditorModal } from '@/components/code-editor/code-editor-modal';
import { HomeTutorialsModal } from '@/components/home/home-tutorials-modal';
import { WorkspaceLoadingScreen } from '@/components/workspace/workspace-loading-screen';
import { CinematicIntroAnimation } from '@/components/intro/cinematic-intro-animation';
import { useWorkspaceStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const isTransitioningToWorkspace = useWorkspaceStore((state) => state.isTransitioningToWorkspace);
  const tutorialsModalOpen = useWorkspaceStore((state) => state.tutorialsModalOpen);
  const setTutorialsModalOpen = useWorkspaceStore((state) => state.setTutorialsModalOpen);
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  return (
    <div
      className={cn(
        'min-h-screen w-full flex flex-col font-sans selection:bg-[#F06543] selection:text-white relative transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#0A090D] text-slate-100'
      )}
    >
      {/* 0. Cinematic Spatial Hardware Intro Animation */}
      <CinematicIntroAnimation />

      {/* Global Hotkeys: Ctrl+L (Workspace), Ctrl+D (Code Editor), etc. */}
      <GlobalHotkeys />

      {/* 1. Global Futuristic Navigation Bar */}
      <HomeNavbar />

      <main className="flex-1 w-full flex flex-col">
        {/* 2. Futuristic Quantum Holographic Hero with Interactive 3D X-Ray Chamber */}
        <FuturisticHero />

        {/* 2.5 Infinite Auto-Scrolling 3D Component Stream */}
        <AutoscrollComponentsTicker />

        {/* 3. The 6 Dimensions of Engineering (Spatial Bento Grid & Performance Invariants) */}
        <FuturisticBento />
      </main>

      {/* 4. Minimal High-Tech Footer */}
      <FuturisticFooter />

      {/* 5. Floating Quick-Launch Workspace Pill */}
      <HomeFloatingWorkspacePill />

      {/* 6. Embedded MCU Coding Platform & Inbuilt Serial Monitor */}
      <CodeEditorModal />

      {/* 6.5 Interactive Hardware Engineering Tutorials Modal */}
      <HomeTutorialsModal
        isOpen={tutorialsModalOpen}
        onClose={() => setTutorialsModalOpen(false)}
      />

      {/* 7. Full-Screen Cinematic Transition Loader to Workspace */}
      {isTransitioningToWorkspace && <WorkspaceLoadingScreen />}
    </div>
  );
}
