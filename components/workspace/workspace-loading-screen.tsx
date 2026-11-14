'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/brand/brand-logo';

interface WorkspaceLoadingScreenProps {
  title?: string;
  subtitle?: string;
}

export function WorkspaceLoadingScreen({
  title = 'Initializing Spatial CAD Engine',
  subtitle = 'Loading 3D component cutaways & SPICE solver...',
}: WorkspaceLoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Allocating WebGL 2.0 Hardware Canvas',
    'Compiling Physical Sub-surface Shaders',
    'Starting ngspice ODE Dynamic Solver',
    'Resolving IPC-7351 Footprint Pins',
    'Workspace Stage Ready',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A090D] text-white select-none overflow-hidden animate-in fade-in duration-300">
      {/* 1. Warm Ambient Luminous Coral/Amber Glow in Background */}
      <div className="absolute w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(240,101,67,0.18)_0%,rgba(147,51,234,0.06)_50%,transparent_75%)] blur-[100px] pointer-events-none" />

      {/* 2. Centerpiece: Animated Dotted Orbital Logo & Shimmer Pulse */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm px-6">
        
        {/* Orbital Silicon Nexus Emblem with Expanding Pulse Halo */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Expanding Wave Rings */}
          <div className="absolute inset-0 rounded-full border border-[#F06543]/20 animate-ping opacity-30 pointer-events-none" />
          <div className="absolute -inset-2 rounded-full border border-[#F06543]/15 pointer-events-none" />
          
          <BrandLogo size="xl" showWordmark={false} />
        </div>

        {/* Title & Brand */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-normal tracking-tight text-white font-sans">
              Silicora
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C1A24] text-[#F06543] font-semibold border border-white/[0.08]">
              STUDIO
            </span>
          </div>

          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#F06543]">
            {title}
          </h2>

          <p className="text-xs text-[#8E8899] font-sans">
            {subtitle}
          </p>
        </div>

        {/* 3. Fluid Animated Shimmer Progress Bar */}
        <div className="w-56 space-y-2">
          <div className="h-1.5 w-full rounded-full bg-[#1C1A24] border border-white/[0.06] overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E2583E] via-[#F06543] to-[#FF7A59] transition-all duration-300 ease-out shadow-[0_0_12px_#F06543]"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Dynamic Active Subsystem Step Ticker */}
          <div className="h-5 flex items-center justify-center">
            <span className="text-[11px] font-sans text-[#A5A0AF] flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F06543]" />
              <span>{steps[stepIndex]}</span>
            </span>
          </div>
        </div>

        {/* 4. Bottom Specs Telemetry */}
        <div className="pt-4 flex items-center justify-center gap-3 text-[10px] text-[#6B6675] font-sans border-t border-white/[0.06] w-full">
          <span>60 FPS Target</span>
          <span>•</span>
          <span>SPICE ODE Ready</span>
          <span>•</span>
          <span>Zero Latency</span>
        </div>

      </div>
    </div>
  );
}