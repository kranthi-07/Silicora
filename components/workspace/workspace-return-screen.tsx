'use client';

import React from 'react';
import { BrandLogo } from '@/components/brand/brand-logo';

interface WorkspaceReturnScreenProps {
  title?: string;
  subtitle?: string;
}

export function WorkspaceReturnScreen({
  title = 'Returning to Silicora Hub',
  subtitle = 'Preserving workspace state & telemetry cache...',
}: WorkspaceReturnScreenProps) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A090D]/95 backdrop-blur-2xl text-white select-none overflow-hidden animate-in fade-in duration-300">
      {/* 1. Luminous Warm Coral Ambient Radial Halo */}
      <div className="absolute w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(240,101,67,0.22)_0%,rgba(147,51,234,0.08)_50%,transparent_75%)] blur-[110px] pointer-events-none" />

      {/* 2. Reverse Spatial Warp Inward Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full border border-[#F06543]/20 animate-ping opacity-25" />
        <div className="w-[300px] h-[300px] rounded-full border border-white/[0.08] animate-pulse" />
      </div>

      {/* 3. Center Brand Emblem & Smooth Return Ticker */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-5 max-w-sm px-6">
        {/* Pulsing Silicora Logo */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-[#F06543]/25 blur-xl animate-pulse" />
          <BrandLogo size="lg" showWordmark={false} />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-normal tracking-tight text-white font-sans">
              Silicora
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C1A24] text-[#F06543] font-semibold border border-white/[0.08]">
              SPATIAL CAD
            </span>
          </div>

          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#F06543]">
            {title}
          </h2>

          <p className="text-xs text-[#8E8899] font-sans">
            {subtitle}
          </p>
        </div>

        {/* Dynamic Smooth Animated Exit Bar */}
        <div className="w-48 space-y-1.5">
          <div className="h-1 w-full rounded-full bg-[#1C1A24] border border-white/[0.06] overflow-hidden relative">
            <div className="h-full rounded-full bg-gradient-to-r from-[#FF7A59] via-[#F06543] to-[#E2583E] animate-[shimmer_1s_infinite] shadow-[0_0_10px_#F06543]" />
          </div>
          <span className="text-[10px] text-[#6B6675] font-mono">
            Synchronizing Viewport...
          </span>
        </div>
      </div>
    </div>
  );
}
