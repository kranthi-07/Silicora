'use client';

import React from 'react';
import {
  Layers,
  Activity,
  Cpu,
  Grid,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function HomeWorkflow() {
  const steps = [
    {
      step: '01',
      title: 'Inspect Inside Out',
      subtitle: '3D Cutaway Exploration',
      icon: Layers,
      color: 'text-cyan-400',
      description:
        'Part protective epoxy and glass shells to expose silicon PN dies, tungsten whiskers, and internal foil windings in real-time 3D.',
    },
    {
      step: '02',
      title: 'Simulate Dynamics',
      subtitle: 'Non-Linear ODE Solver',
      icon: Activity,
      color: 'text-sky-400',
      description:
        'Observe how applied voltages govern carrier drift velocity, junction depletion widths, and thermal dissipation before building.',
    },
    {
      step: '03',
      title: 'Assemble on Breadboard',
      subtitle: '3D Virtual Prototyping',
      icon: Cpu,
      color: 'text-emerald-400',
      description:
        'Place through-hole components onto an 830-point solderless breadboard. Route jumper wires and probe live circuit voltages.',
    },
    {
      step: '04',
      title: 'Layout & Fabricate',
      subtitle: 'KiCad & Gerber Export',
      icon: Grid,
      color: 'text-purple-400',
      description:
        'Transform circuit schematics into 2-layer PCBs. Check manufacturing clearances with DRC and download ready-to-order Gerbers.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-700/80 px-3 py-1 text-xs font-mono text-cyan-400 mb-3">
            <span>Engineering Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans">
            From Silicon Physics to Physical Circuit Boards
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans">
            How 3D Lab connects micro-scale semiconductor physics with practical bench engineering.
          </p>
        </div>

        {/* Workflow Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      STEP {st.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${st.color}`} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-sans mb-1">
                    {st.title}
                  </h3>
                  <div className={`text-[11px] font-mono font-medium ${st.color} mb-3`}>
                    {st.subtitle}
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
