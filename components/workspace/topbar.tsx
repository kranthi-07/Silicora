'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/lib/store';
import { ENVIRONMENTS } from '@/data/environments';
import { LabEnvironment } from '@/types/workspace';
import {
  ArrowLeft,
  Box,
  Layers,
  Activity,
  Cpu,
  Hammer,
  Grid,
  GraduationCap,
  PanelLeft,
  PanelRight,
  Code,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationsPopover } from '@/components/notifications/notifications-popover';

export function WorkspaceTopbar() {
  const router = useRouter();
  const {
    activeEnvironment,
    setActiveEnvironment,
    leftSidebarOpen,
    toggleLeftSidebar,
    rightInspectorOpen,
    toggleRightInspector,
    codeEditorOpen,
    toggleCodeEditor,
    themeMode,
    toggleThemeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';

  const handleGoBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('silicora_returned_from_workspace', 'true');
    }
    router.push('/');
  };

  const handleSelectEnv = (envId: LabEnvironment) => {
    setActiveEnvironment(envId);
    if (typeof window !== 'undefined') {
      window.history.pushState({ env: envId }, '', `/workspace/${envId}`);
    }
  };

  const getEnvIcon = (id: LabEnvironment) => {
    switch (id) {
      case 'component_explorer':
        return <Box className="w-3.5 h-3.5" />;
      case 'internal_cutaway':
        return <Layers className="w-3.5 h-3.5" />;
      case 'electrical_sim_lab':
        return <Activity className="w-3.5 h-3.5" />;
      case 'circuit_workspace':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'device_explorer':
        return <Hammer className="w-3.5 h-3.5" />;
      case 'pcb_studio':
        return <Grid className="w-3.5 h-3.5" />;
      case 'learning_academy':
        return <GraduationCap className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header
      className={cn(
        'h-12 border-b backdrop-blur-2xl px-3 sm:px-4 flex items-center justify-between shrink-0 select-none z-30 transition-colors duration-200',
        isLight
          ? 'bg-white/95 border-slate-200/90 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#0A090D]/95 border-white/[0.06] text-white shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
      )}
    >
      {/* 1. Left Section: Back & Catalog Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleGoBack}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all border shadow-sm group cursor-pointer',
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
              : 'bg-[#14121A] hover:bg-[#1C1A24] text-[#9691A0] hover:text-white border-white/[0.08]'
          )}
          title="Back to Homepage"
          aria-label="Back to Homepage"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F06543] group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium text-[11px]">Home</span>
        </button>

        <button
          id="tutorial-catalog-button"
          type="button"
          onClick={toggleLeftSidebar}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all border cursor-pointer',
            leftSidebarOpen
              ? isLight
                ? 'bg-[#F06543]/15 text-[#E05332] border-[#F06543]/40 font-semibold shadow-sm'
                : 'bg-[#F06543]/20 text-white border-[#F06543]/50 shadow-[0_0_12px_rgba(240,101,67,0.3)] font-semibold'
              : isLight
              ? 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
              : 'bg-[#14121A] text-[#9691A0] hover:text-white hover:bg-[#1C1A24] border-white/[0.08] hover:border-white/[0.2]'
          )}
          title="Toggle Component Catalog (Ctrl+B)"
          aria-label="Toggle Component Catalog"
        >
          <PanelLeft className="w-3.5 h-3.5 text-[#F06543]" />
          <span className="font-medium text-[11px]">Catalog</span>
        </button>
      </div>

      {/* 2. Center Section: Sleek Segmented Environment Switcher */}
      <nav
        className={cn(
          'hidden md:flex items-center p-0.5 rounded-full border transition-colors',
          isLight
            ? 'bg-slate-100/90 border-slate-200/90 shadow-sm'
            : 'bg-[#14121A] border-white/[0.06] shadow-inner'
        )}
        aria-label="Core Environments"
      >
        {ENVIRONMENTS.map((env) => {
          const isActive = activeEnvironment === env.id;
          return (
            <button
              key={env.id}
              type="button"
              onClick={() => handleSelectEnv(env.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans transition-all duration-200',
                isActive
                  ? isLight
                    ? 'bg-white text-slate-900 border border-slate-300 shadow-sm font-semibold'
                    : 'bg-gradient-to-r from-[#E2583E]/25 via-[#F06543]/25 to-[#FF7A59]/25 text-white border border-[#F06543]/50 shadow-[0_0_12px_rgba(240,101,67,0.3)] font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent'
                  : 'text-[#8E8899] hover:text-white hover:bg-white/[0.04] border border-transparent'
              )}
            >
              <span
                className={cn(
                  'transition-colors',
                  isActive ? 'text-[#F06543]' : isLight ? 'text-slate-400' : 'text-[#6B6675]'
                )}
              >
                {getEnvIcon(env.id)}
              </span>
              <span className="text-[11px]">{env.shortName || env.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Right Section: Code Editor, Notifications, Inspector Toggle */}
      <div className="flex items-center gap-2">
        {/* Coding Platform Modal Trigger */}
        <button
          type="button"
          onClick={toggleCodeEditor}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all border cursor-pointer',
            codeEditorOpen
              ? isLight
                ? 'bg-[#F06543]/15 text-[#E05332] border-[#F06543]/40 font-semibold shadow-sm'
                : 'bg-[#F06543]/20 text-white border-[#F06543]/50 shadow-[0_0_12px_rgba(240,101,67,0.3)] font-semibold'
              : isLight
              ? 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
              : 'bg-[#14121A] text-[#8E8899] hover:text-white hover:bg-[#1C1A24] border-white/[0.06] hover:border-white/[0.15]'
          )}
          title="Launch Coding Platform & Serial Monitor (Ctrl+D)"
        >
          <Code className="w-3.5 h-3.5 text-[#F06543]" />
          <span className="font-medium hidden sm:inline">Code</span>
          <span className="text-[9px] text-[#6B6675] hidden lg:inline">(Ctrl+D)</span>
        </button>

        {/* Notifications Popover with red unread dot */}
        <NotificationsPopover />

        {/* Visual Theme Toggle (Dark Mode vs Light Studio Mode) */}
        <button
          type="button"
          onClick={toggleThemeMode}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all border cursor-pointer',
            isLight
              ? 'bg-amber-400/20 text-amber-700 border-amber-400/40 shadow-sm font-semibold'
              : 'bg-[#14121A] text-[#9691A0] hover:text-white hover:bg-[#1C1A24] border-white/[0.08]'
          )}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Studio Mode'}
          aria-label="Toggle theme mode"
        >
          {isLight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-medium text-[11px]">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium text-[11px]">Dark</span>
            </>
          )}
        </button>

        {/* Inspector Panel Toggle Button */}
        <button
          id="tutorial-inspector-button"
          type="button"
          onClick={toggleRightInspector}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all border cursor-pointer',
            rightInspectorOpen
              ? isLight
                ? 'bg-[#F06543]/15 text-[#E05332] border-[#F06543]/40 font-semibold shadow-sm'
                : 'bg-[#F06543]/20 text-white border-[#F06543]/50 shadow-[0_0_12px_rgba(240,101,67,0.3)] font-semibold'
              : isLight
              ? 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
              : 'bg-[#14121A] text-[#9691A0] hover:text-white hover:bg-[#1C1A24] border-white/[0.08] hover:border-white/[0.2]'
          )}
          title="Toggle Visual Inspector (Ctrl+I)"
          aria-label="Toggle Visual Inspector"
        >
          <PanelRight className="w-3.5 h-3.5 text-[#F06543]" />
          <span className="font-medium text-[11px]">Inspector</span>
        </button>
      </div>
    </header>
  );
}
