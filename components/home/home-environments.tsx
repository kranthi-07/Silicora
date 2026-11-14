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
  CheckCircle2,
  Sliders,
  FileCode,
  Zap,
} from 'lucide-react';

export function HomeEnvironments() {
  const environments = [
    {
      id: 'component_explorer',
      title: 'Component Explorer & 3D Cutaways',
      badge: 'Core 3D',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      icon: Box,
      description:
        'Inspect discrete electronic parts in 360° 3D. Part outer casings with directional shell separation to study microscopic silicon dies, tungsten cat-whiskers, AlGaAs photon emitters, and wirebonds.',
      features: [
        'Resistors, Capacitors, Diodes, LEDs, BJTs, MOSFETs',
        'Independent internal layer visibility toggling',
        'Physical pinout anchors and tolerance markings',
        'Beginner analogies and polarity reversal warnings',
      ],
      link: '/workspace/component_explorer',
      linkText: 'Explore Components',
    },
    {
      id: 'electrical_sim_lab',
      title: 'Electrical Simulation Lab',
      badge: 'Analytical Solver',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      icon: Activity,
      description:
        'Connect virtual bench instruments to non-linear semiconductor models. Observe dynamic Shockley diode knees, RC charging curves, transistor saturation, and signed electron drift velocity.',
      features: [
        'Real-time numerical ODE time-domain solver',
        'Dual-channel Virtual Oscilloscope & IV Curve Tracer',
        'Scientific direction: Electron drift vs conventional current',
        'ngspice netlist generation & export',
      ],
      link: '/workspace/electrical_sim_lab',
      linkText: 'Enter Simulation Lab',
    },
    {
      id: 'circuit_workspace',
      title: '3D Breadboard Workspace',
      badge: 'Virtual Prototyping',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Cpu,
      description:
        'Build circuits on an authentic 830-point solderless breadboard. Place realistic components, wire catenary jumper cables, and probe live node voltages and branch currents with a virtual DMM.',
      features: [
        '830-point breadboard spring-clip topology',
        'Kirchhoff graph solver calculating real-time node voltages',
        'Live short-circuit and reverse-biased LED diagnostics',
        '7 built-in guided experiment circuit presets',
      ],
      link: '/workspace/circuit_workspace',
      linkText: 'Open Breadboard',
    },
    {
      id: 'device_explorer',
      title: 'Device Teardowns & Disassembly',
      badge: 'Hardware Teardowns',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: Hammer,
      description:
        'Disassemble consumer electronics through multi-layer exploded 3D stacks. Inspect internal logic boards, battery chemistry, cooling chambers, and subsystem signal pathways.',
      features: [
        '5G Flagship Smartphone with multi-element lens stack',
        'High-Performance Laptop with dual heatpipes and CPU die',
        'Inverter Refrigerator, Power Bank, Appliances, 4K TV',
        'Functional block diagrams and documented engineering facts',
      ],
      link: '/workspace/device_explorer',
      linkText: 'Inspect Teardowns',
    },
    {
      id: 'pcb_studio',
      title: 'PCB Studio & CAD Export',
      badge: 'Fabrication Ready',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: Grid,
      description:
        'Convert schematic circuits into 2-layer PCBs. Route copper tracks, configure soldermasks, run manufacturing Design Rule Checks (DRC), and export KiCad 7/8 files and RS-274X Gerbers.',
      features: [
        'IPC footprints with annular rings and through-hole drills',
        '2D track editor & 3D board preview with 6 soldermask colors',
        'Automated DRC: trace width, net clearance, edge violations',
        'One-click export: KiCad (.kicad_pcb) & RS-274X Gerber bundle',
      ],
      link: '/workspace/pcb_studio',
      linkText: 'Launch PCB Studio',
    },
    {
      id: 'learning_academy',
      title: 'Learning Academy & Curriculum',
      badge: 'Interactive Lessons',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: GraduationCap,
      description:
        'Master electronics through structured hands-on modules combining theoretical physics, 3D demonstrations, knowledge check quizzes, and gamified "Fix the Fault" tuning scenarios.',
      features: [
        'Structured modular learning paths',
        'Interactive 3D stages integrated into lessons',
        'Knowledge checks with clear explanations',
        'Practical challenges with tolerance validation',
      ],
      link: '/workspace/learning_academy',
      linkText: 'Start Learning',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950/70 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-700/80 px-3 py-1 text-xs font-mono text-slate-300 mb-3">
            <span>Unified Engineering Suite</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans">
            Six Specialized Environments. One Connected Platform.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans">
            Every environment is fully interactive in your browser, sharing the same underlying component models, simulation math, and physical coordinate systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {environments.map((env) => {
            const Icon = env.icon;
            return (
              <div
                key={env.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-all shadow-card hover:shadow-cyan-500/5 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${env.badgeColor}`}>
                      {env.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-sans mb-2">
                    {env.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                    {env.description}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-800/80 pt-3 mb-6">
                    {env.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400/80 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={env.link}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all text-xs font-mono font-medium group-hover:border-cyan-500/30"
                >
                  <span>{env.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
