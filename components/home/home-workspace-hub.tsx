'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Layers,
  Activity,
  Cpu,
  Hammer,
  Grid,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Terminal,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface WorkspaceCard {
  id: string;
  slug: string;
  name: string;
  role: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  directUrl: string;
  capabilities: string[];
}

const INDIVIDUAL_WORKSPACES: WorkspaceCard[] = [
  {
    id: 'component_explorer',
    slug: 'component_explorer',
    name: 'Component 3D Explorer & Cutaways',
    role: 'Physical Micro-Architecture',
    badge: '3D CAD Core',
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-800',
    icon: Box,
    description:
      'Inspect discrete electronic packages in full 360° 3D with directional shell cutaway controls. Toggle internal layer visibility for dies, bond-wires, ceramic plates, and copper slugs.',
    directUrl: '/workspace/component_explorer',
    capabilities: [
      'Resistors, Capacitors, Diodes, BJTs, MOSFETs',
      'Honest directional shell separation cutaway',
      'Individual layer visibility inspection',
      'Pinout coordinate definitions & tolerance badges',
    ],
  },
  {
    id: 'electrical_sim_lab',
    slug: 'electrical_sim_lab',
    name: 'Electrical Simulation Lab',
    role: 'Analytical ODE Solver',
    badge: 'Time-Domain Engine',
    badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-800',
    icon: Activity,
    description:
      'Connect non-linear semiconductor models to real-time virtual instruments. Run Shockley diode analysis, dynamic RC/RL charging curves, transistor saturation, and carrier drift vectoring.',
    directUrl: '/workspace/electrical_sim_lab',
    capabilities: [
      'Real-time numerical ODE time-domain solver',
      'Virtual Phosphor Oscilloscope & IV Curve Tracer',
      'Electron drift velocity vs conventional current vectors',
      'ngspice netlist exporter & thermal integrator',
    ],
  },
  {
    id: 'circuit_workspace',
    slug: 'circuit_workspace',
    name: '3D Solderless Breadboard Studio',
    role: 'Virtual Prototyping Canvas',
    badge: 'Kirchhoff Matrix Solver',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
    icon: Cpu,
    description:
      'Build functioning circuits on an 830-point solderless breadboard. Place physical components, route flexible catenary jumper wires, and measure live node voltages with a virtual multimeter.',
    directUrl: '/workspace/circuit_workspace',
    capabilities: [
      '830-point breadboard spring-clip topology',
      'Kirchhoff graph solver computing live node voltages',
      'Real-time short-circuit & reverse LED diagnostics',
      '7 built-in guided experiment circuit presets',
    ],
  },
  {
    id: 'device_explorer',
    slug: 'device_explorer',
    name: 'Hardware Teardowns & Disassembly',
    role: 'Reverse-Engineering CAD',
    badge: 'Hardware Teardown',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800',
    icon: Hammer,
    description:
      'Explore disassembled consumer products through multi-layer exploded 3D views. Inspect smartphone logic boards, ultrabook cooling heatpipes, and refrigerator refrigeration cycles.',
    directUrl: '/workspace/device_explorer',
    capabilities: [
      '5G Smartphone with multi-element lens optical array',
      'Ultrabook Laptop with numbered 1-32 callouts',
      'Inverter Refrigerator, 65W Power Bank, 4K Smart TV',
      'Subsystem signal flow & verified manufacturing facts',
    ],
  },
  {
    id: 'pcb_studio',
    slug: 'pcb_studio',
    name: 'Phase 6: Multi-Layer PCB Studio',
    role: 'Fabrication & Layout',
    badge: 'KiCad & Gerber EDA',
    badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-800',
    icon: Grid,
    description:
      'Convert breadboard circuits into manufacturable 2-layer PCBs. Place IPC footprints, route copper tracks, run design rule checks (DRC), and export KiCad 8.0 and Gerber RS-274X files.',
    directUrl: '/workspace/pcb_studio',
    capabilities: [
      'IPC standard footprints with annular rings and drills',
      '2D copper track editor & 3D board visualizer',
      'Real-time DRC clearance & trace width validation',
      'KiCad 8.0 .kicad_pcb & RS-274X Gerber zip generator',
    ],
  },
  {
    id: 'learning_academy',
    slug: 'learning_academy',
    name: 'Guided Learning Academy',
    role: 'Interactive Curriculum',
    badge: 'Interactive Labs',
    badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-800',
    icon: GraduationCap,
    description:
      'Master core electronics principles through step-by-step interactive lessons. Solve hands-on circuit challenges, verify formulas with live telemetry, and complete knowledge quizzes.',
    directUrl: '/workspace/learning_academy',
    capabilities: [
      'Structured curriculum from fundamentals to semiconductors',
      'Interactive formula derivation with live feedback',
      'Practical circuit tuning challenges with tolerance tests',
      'Knowledge quizzes with detailed explanation breakdowns',
    ],
  },
];

export function HomeWorkspaceHub() {
  return (
    <section id="workspaces" className="w-full py-20 bg-slate-950 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-800">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              CAD Backend Workstations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Individual Engineering Workspaces
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Each environment is an independent, production-grade CAD workspace with its own dedicated state,
              interactive instruments, and export pipeline. Launch any workspace directly or enter the unified suite.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-900/30 transition-all active:scale-95 group"
            >
              <span>Launch Unified CAD Suite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 6 Individual Workspace Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDIVIDUAL_WORKSPACES.map((ws) => {
            const Icon = ws.icon;
            return (
              <div
                key={ws.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all shadow-xl group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-950/60 group-hover:border-cyan-700 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md border font-semibold ${ws.badgeColor}`}>
                      {ws.badge}
                    </span>
                  </div>

                  {/* Title & Role */}
                  <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                    {ws.role}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                    {ws.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {ws.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300 font-mono">
                    {ws.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Launch Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                    <span>Direct Endpoint:</span>
                    <code className="text-slate-400">{ws.directUrl}</code>
                  </div>
                  <Link
                    href={ws.directUrl}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 text-xs font-mono font-semibold transition-all group-hover:border-cyan-500/50 border border-slate-700"
                  >
                    <span>Launch {ws.name.split(' ')[0]} Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CAD Engine Capabilities Footer Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Standalone Workspace Architecture
              </h4>
              <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
                Every workspace runs locally inside your browser via WebGL (Three.js), WebAssembly, and a numerical ODE solver. 
                State is persisted across environment switches with zero cloud dependency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-md transition-all"
            >
              Open Active Workspace →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
