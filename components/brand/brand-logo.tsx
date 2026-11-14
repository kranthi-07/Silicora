'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/lib/store';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  tagline?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function BrandLogo({
  size = 'md',
  showWordmark = true,
  tagline = 'Spatial Studio',
  href,
  onClick,
  className,
}: BrandLogoProps) {
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  // Dimensions based on size
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const tagSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
    xl: 'text-xs',
  };

  const Content = (
    <div className={cn('flex items-center gap-3 group select-none', className)}>
      {/* 1. Bespoke Silicon Nexus Emblem (Isometric Crystal Die + Quantum Core + Orbital Traces) */}
      <div className={cn('relative flex items-center justify-center shrink-0', iconSizes[size])}>
        {/* Subtle Ambient Glow Behind Logo */}
        <div className="absolute inset-0 rounded-full bg-[#F06543]/20 blur-md group-hover:bg-[#F06543]/40 transition-all duration-500 pointer-events-none" />

        <svg
          className="w-full h-full relative z-10 transition-transform duration-700 ease-out group-hover:scale-105"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Coral Gradient */}
            <linearGradient id="silicoraPrimary" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF7A59" />
              <stop offset="50%" stopColor="#F06543" />
              <stop offset="100%" stopColor="#C93B2B" />
            </linearGradient>

            {/* Inner Silicon Wafer Facet Gradient */}
            <linearGradient id="siliconFacet" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2A1B24" />
              <stop offset="100%" stopColor="#141018" />
            </linearGradient>

            {/* Golden Core Glow */}
            <radialGradient id="quantumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#FF7A59" />
              <stop offset="100%" stopColor="#F06543" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Rounded Hexagonal Crystal Die Frame */}
          <path
            d="M24 3 L41 12.8 V32.2 L24 42 L7 32.2 V12.8 Z"
            stroke="url(#silicoraPrimary)"
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill="url(#siliconFacet)"
            className="drop-shadow-[0_0_8px_rgba(240,101,67,0.4)]"
          />

          {/* Three Internal Planar Diffusion Leadlines */}
          <line x1="24" y1="3" x2="24" y2="18" stroke="#FF7A59" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="41" y1="32.2" x2="29" y2="26" stroke="#FF7A59" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="7" y1="32.2" x2="19" y2="26" stroke="#FF7A59" strokeWidth="1.5" strokeOpacity="0.7" />

          {/* Central Active Semiconductor Die (Rhombus/Diamond) */}
          <polygon
            points="24,18 30,24 24,30 18,24"
            fill="url(#silicoraPrimary)"
            className="drop-shadow-[0_0_6px_#F06543]"
          />

          {/* Core Quantum Emitter Point */}
          <circle cx="24" cy="24" r="2.5" fill="#FFF9C4" />

          {/* Orbital Electron Satellite Beads */}
          <circle cx="24" cy="9" r="1.8" fill="#FFB74D" />
          <circle cx="34" cy="28" r="1.8" fill="#FF7A59" />
          <circle cx="14" cy="28" r="1.8" fill="#FF7A59" />

          {/* Micro Corner Bond Pads */}
          <circle cx="24" cy="3" r="1.2" fill="#FFE082" />
          <circle cx="41" cy="12.8" r="1.2" fill="#FF7A59" opacity="0.8" />
          <circle cx="41" cy="32.2" r="1.2" fill="#FF7A59" opacity="0.8" />
          <circle cx="24" cy="42" r="1.2" fill="#FF7A59" opacity="0.8" />
          <circle cx="7" cy="32.2" r="1.2" fill="#FF7A59" opacity="0.8" />
          <circle cx="7" cy="12.8" r="1.2" fill="#FF7A59" opacity="0.8" />
        </svg>
      </div>

      {/* 2. Brand Wordmark & Tagline */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={cn(
                'font-normal tracking-tight font-sans transition-colors',
                isLight ? 'text-slate-900 group-hover:text-[#F06543]' : 'text-white group-hover:text-[#F06543]',
                textSizes[size]
              )}
            >
              Silicora
            </span>
          </div>

          {tagline && (
            <span
              className={cn(
                'font-mono tracking-widest uppercase transition-colors font-medium mt-0.5',
                isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-[#8E8899] group-hover:text-[#A5A0AF]',
                tagSizes[size]
              )}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="inline-flex"
      >
        {Content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex text-left cursor-pointer bg-transparent border-0 p-0"
      >
        {Content}
      </button>
    );
  }

  return Content;
}