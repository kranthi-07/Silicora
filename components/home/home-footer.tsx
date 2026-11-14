'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Box, Cpu, Grid, Activity, Hammer, GraduationCap } from 'lucide-react';

export function HomeFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 font-sans text-xs">
      {/* Pre-footer Call to Action */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900/40 to-slate-950 py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Ready to Explore Electronics from the Inside Out?
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
            Launch the workstation immediately in your browser. No downloads, account walls, or plugin installations required.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 hover:from-cyan-500 hover:to-blue-500 transition-all font-mono active:scale-95"
            >
              <span>Open 3D Lab Workstation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-tr from-cyan-500 to-blue-600">
                <span className="font-mono text-xs font-bold text-white">3D</span>
              </div>
              <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                3D LAB
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Interactive browser-native 3D electronics simulation, component cutaways, virtual breadboarding, and PCB engineering.
            </p>
          </div>

          {/* Col 2: Exploration Environments */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold uppercase text-slate-200 tracking-wider">
              Exploration
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <Link href="/workspace/component_explorer" className="hover:text-cyan-400 transition-colors">
                  Component Explorer
                </Link>
              </li>
              <li>
                <Link href="/workspace/internal_cutaway" className="hover:text-cyan-400 transition-colors">
                  3D Cutaway Layers
                </Link>
              </li>
              <li>
                <Link href="/workspace/device_explorer" className="hover:text-cyan-400 transition-colors">
                  Device Teardowns
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering Environments */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold uppercase text-slate-200 tracking-wider">
              Engineering & CAD
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <Link href="/workspace/electrical_sim_lab" className="hover:text-cyan-400 transition-colors">
                  Electrical Sim Lab
                </Link>
              </li>
              <li>
                <Link href="/workspace/circuit_workspace" className="hover:text-cyan-400 transition-colors">
                  3D Breadboard Workspace
                </Link>
              </li>
              <li>
                <Link href="/workspace/pcb_studio" className="hover:text-cyan-400 transition-colors">
                  PCB Studio & KiCad
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Curriculum & Architecture */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold uppercase text-slate-200 tracking-wider">
              Learning & Specs
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <Link href="/workspace/learning_academy" className="hover:text-cyan-400 transition-colors">
                  Learning Academy
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Next.js 15 & React 19</span>
              </li>
              <li>
                <span className="text-slate-500">Three.js & R3F WebGL</span>
              </li>
              <li>
                <span className="text-slate-500">KiCad 7/8 & RS-274X</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & integrity notice */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <span>© 2026 3D Lab Engineering Workstation. All rights reserved.</span>
          <span>Scientific models clearly distinguish analytical educational logic from SPICE solvers.</span>
        </div>
      </div>
    </footer>
  );
}
