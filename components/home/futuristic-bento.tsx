'use client';

import React from 'react';
import Link from 'next/link';
import { useWorkspaceStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Box,
  Layers,
  Activity,
  Cpu,
  Hammer,
  Grid,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function FuturisticBento() {
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';
  const environments = [
    {
      id: 'component_explorer',
      title: 'Component Explorer',
      tag: '360° 3D CAD',
      badge: 'Package Inspection',
      desc: 'Inspect discrete parts, lead spacing, IPC standard codes, and interactive pinouts with full 360° orbital freedom.',
      href: '/workspace/component_explorer',
      icon: Box,
      accent: 'from-[#F06543]/15 to-transparent',
      border: 'hover:border-[#F06543]/50',
      iconColor: 'text-[#F06543]',
    },
    {
      id: 'internal_cutaway',
      title: 'Internal Structure & Cutaways',
      tag: 'Microscopic Die',
      badge: 'Sub-Surface Anatomy',
      desc: 'Dynamic X/Y/Z cutting planes peeling open epoxy casings to expose active silicon dies, gold wirebonds, and helical film coils.',
      href: '/workspace/internal_cutaway',
      icon: Layers,
      accent: 'from-purple-500/15 to-transparent',
      border: 'hover:border-purple-500/50',
      iconColor: 'text-purple-400',
    },
    {
      id: 'electrical_sim_lab',
      title: 'Electrical Simulation Lab',
      tag: 'WASM ODE Solver',
      badge: 'Bench Instruments',
      desc: 'Interactive 4-channel Oscilloscope, Multimeter, and function generator running non-linear Shockley physics & thermal drift in real-time.',
      href: '/workspace/electrical_sim_lab',
      icon: Activity,
      accent: 'from-[#F59E0B]/15 to-transparent',
      border: 'hover:border-[#F59E0B]/50',
      iconColor: 'text-[#F59E0B]',
    },
    {
      id: 'circuit_workspace',
      title: '3D Breadboard Workspace',
      tag: 'Interactive Wiring',
      badge: 'Live Prototyping',
      desc: 'Construct breadboard circuits with realistic wire catenary physics, live node voltages, and visual electron velocity vectors.',
      href: '/workspace/circuit_workspace',
      icon: Cpu,
      accent: 'from-blue-500/15 to-transparent',
      border: 'hover:border-blue-500/50',
      iconColor: 'text-blue-400',
    },
    {
      id: 'device_explorer',
      title: 'Hardware Teardown Reactor',
      tag: 'Full Assembly',
      badge: 'Consumer Tech',
      desc: 'Dissect real products—smartphones, fast chargers, laptops, and power supplies—in animated multi-stage 3D exploded views.',
      href: '/workspace/device_explorer',
      icon: Hammer,
      accent: 'from-[#E2583E]/15 to-transparent',
      border: 'hover:border-[#E2583E]/50',
      iconColor: 'text-[#E2583E]',
    },
    {
      id: 'pcb_studio',
      title: 'Fabrication PCB Studio',
      tag: 'KiCad 8 & Gerber',
      badge: 'Manufacturing',
      desc: 'Multi-layer stackup inspection, copper trace routing, automated DRC validation, and export to industrial RS-274X Gerbers.',
      href: '/workspace/pcb_studio',
      icon: Grid,
      accent: 'from-emerald-500/15 to-transparent',
      border: 'hover:border-emerald-500/50',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <section
      className={cn(
        'relative py-20 lg:py-28 border-t select-none transition-colors duration-300',
        isLight ? 'bg-white border-slate-200' : 'bg-[#0A090D] border-white/[0.05]'
      )}
    >
      {/* Background Ambient Halo */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[180px] pointer-events-none transition-opacity duration-300',
          isLight ? 'bg-[#F06543]/5 opacity-60' : 'bg-[#F06543]/5'
        )}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-sans text-[#F06543] shadow-sm transition-colors',
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#181520] border-white/[0.08]'
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="font-medium">Unified Engineering Suite</span>
          </div>

          <h2
            className={cn(
              'text-3xl sm:text-4xl font-normal tracking-tight font-sans transition-colors',
              isLight ? 'text-slate-900' : 'text-white'
            )}
          >
            Six Dimensions of Engineering.
          </h2>

          <p
            className={cn(
              'text-sm font-sans leading-relaxed transition-colors',
              isLight ? 'text-slate-600' : 'text-[#8E8899]'
            )}
          >
            Every environment is connected directly into our real-time WebGL physics engine. Jump instantly into any stage of the hardware development cycle.
          </p>
        </div>

        {/* Bento Grid: 6 Spatial Environment Pods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {environments.map((env, index) => {
            const Icon = env.icon;
            return (
              <Link
                key={env.id}
                href={env.href}
                className={cn(
                  'group relative p-6 rounded-3xl bg-gradient-to-b border shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1',
                  env.accent,
                  env.border,
                  isLight
                    ? 'bg-slate-50/80 border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#F06543]/60'
                    : 'bg-[#131119] border-white/[0.07] hover:shadow-[0_8px_32px_rgba(240,101,67,0.18)]'
                )}
              >
                <div className="space-y-4">
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'p-2.5 rounded-2xl border shadow-inner group-hover:scale-105 transition-transform',
                        isLight ? 'bg-white border-slate-200' : 'bg-[#1C1A24] border-white/[0.08]'
                      )}
                    >
                      <Icon className={`w-5 h-5 ${env.iconColor}`} />
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-sans px-2.5 py-0.5 rounded-full border',
                        isLight
                          ? 'bg-white text-slate-500 border-slate-200'
                          : 'bg-[#1C1A24] text-[#8E8899] border-white/[0.06]'
                      )}
                    >
                      0{index + 1} // {env.tag}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3
                      className={cn(
                        'text-base font-semibold group-hover:text-[#F06543] transition-colors tracking-tight',
                        isLight ? 'text-slate-900' : 'text-white'
                      )}
                    >
                      {env.title}
                    </h3>
                    <span className="text-[11px] font-sans text-[#F06543] block mt-0.5 font-medium">
                      {env.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={cn(
                      'text-xs leading-relaxed font-sans',
                      isLight ? 'text-slate-600' : 'text-[#8E8899]'
                    )}
                  >
                    {env.desc}
                  </p>
                </div>

                {/* Bottom Action Arrow */}
                <div
                  className={cn(
                    'pt-5 mt-4 border-t flex items-center justify-between text-xs font-sans transition-colors',
                    isLight
                      ? 'border-slate-200 text-slate-500 group-hover:text-slate-900'
                      : 'border-white/[0.06] text-[#8E8899] group-hover:text-white'
                  )}
                >
                  <span className="font-medium">Launch Environment</span>
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border flex items-center justify-center group-hover:bg-[#F06543] group-hover:text-white transition-all',
                      isLight ? 'bg-white border-slate-200' : 'bg-[#1C1A24] border-white/[0.06]'
                    )}
                  >
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}