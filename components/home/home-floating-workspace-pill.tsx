'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWorkspaceStore } from '@/lib/store';
import {
  ArrowRight,
  Box,
  Layers,
  Activity,
  Cpu,
  Hammer,
  Grid,
  GraduationCap,
  ChevronUp,
  X,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/brand/brand-logo';

export function HomeFloatingWorkspacePill() {
  const [open, setOpen] = useState(false);
  const toggleCodeEditor = useWorkspaceStore((state) => state.toggleCodeEditor);
  const setIsTransitioningToWorkspace = useWorkspaceStore((state) => state.setIsTransitioningToWorkspace);

  const workspaces = [
    { label: 'Component Samples', href: '/workspace/component_explorer', icon: Box },
    { label: 'Internal Cutaways', href: '/workspace/internal_cutaway', icon: Layers },
    { label: 'Simulation Lab', href: '/workspace/electrical_sim_lab', icon: Activity },
    { label: 'Circuit Patterns', href: '/workspace/circuit_workspace', icon: Cpu },
    { label: 'Device Teardowns', href: '/workspace/device_explorer', icon: Hammer },
    { label: 'PCB Studio', href: '/workspace/pcb_studio', icon: Grid },
    { label: 'Learning Academy', href: '/workspace/learning_academy', icon: GraduationCap },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Workspace Quick-Menu Flyout */}
      {open && (
        <div className="mb-3 w-72 rounded-3xl bg-[#131119]/95 border border-white/[0.08] p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-sans font-semibold text-white">
              <BrandLogo size="sm" showWordmark={false} />
              <span>Quick Workspaces</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#8E8899] hover:text-white p-0.5 rounded-full hover:bg-white/[0.05]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              return (
                <Link
                  key={ws.href}
                  href={ws.href}
                  onClick={() => {
                    setIsTransitioningToWorkspace(true);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl text-xs font-sans text-[#9691A0] hover:bg-white/[0.05] hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#F06543] group-hover:scale-105 transition-transform" />
                    <span>{ws.label}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#6B6675] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/[0.06] space-y-1.5">
            <button
              type="button"
              onClick={() => {
                toggleCodeEditor();
                setOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs font-sans font-medium transition-colors border border-white/[0.06] group"
            >
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-[#F06543]" />
                <span>Code Platform (Ctrl+D)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8899] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <Link
              href="/workspace"
              onClick={() => {
                setIsTransitioningToWorkspace(true);
                setOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#E2583E] via-[#F06543] to-[#FF7A59] text-white text-xs font-sans font-semibold transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              <span>Launch Studio (Ctrl+L)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Trigger Pill */}
      <div className="flex items-center gap-1 bg-[#14121A]/90 border border-white/[0.08] rounded-full p-1.5 shadow-2xl backdrop-blur-xl">
        <Link
          href="/workspace"
          onClick={() => setIsTransitioningToWorkspace(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#E2583E] via-[#F06543] to-[#FF7A59] text-white text-xs font-sans font-semibold transition-all shadow-md active:scale-95 group"
          title="Launch 3D Lab Studio (Ctrl+L)"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Launch Studio</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full hover:bg-white/[0.05] text-[#8E8899] hover:text-white transition-colors"
          title="Quick switch workspace environment"
          aria-label="Toggle workspace switcher"
        >
          <ChevronUp className={cn('w-4 h-4 transition-transform duration-200', open && 'rotate-180 text-[#F06543]')} />
        </button>
      </div>
    </div>
  );
}