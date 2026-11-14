'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_COMPONENTS } from '@/data/mock-components';
import { ComponentPhysicalIllustration } from '@/components/explorer/component-graphics';
import { ArrowUpRight } from 'lucide-react';

export function AutoscrollComponentsTicker() {
  // Duplicate array so marquee seamlessly loops infinitely
  const componentsList = [...MOCK_COMPONENTS, ...MOCK_COMPONENTS];

  return (
    <section className="relative py-12 bg-[#0A090D] overflow-hidden border-y border-white/[0.05] select-none">
      {/* Background Subtle Gradient Fades */}
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#0A090D] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#0A090D] to-transparent z-10 pointer-events-none" />

      {/* Header Label */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="w-2 h-2 rounded-full bg-[#F06543] animate-pulse" />
          <span className="text-[#9A95A4] font-medium tracking-wide">
            Curated Physical Samples // Real-time 3D Catalog
          </span>
        </div>
        <Link
          href="/workspace/component_explorer"
          className="text-xs font-sans text-[#F06543] hover:text-[#FF7A59] flex items-center gap-1 group font-medium transition-colors"
        >
          <span>Explore All 15 Samples</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Continuous Auto-Scrolling Marquee Track */}
      <div className="overflow-hidden flex">
        <div className="animate-marquee flex gap-4">
          {componentsList.map((comp, idx) => {
            const isTht = comp.package.mounting === 'through_hole';
            return (
              <Link
                key={`${comp.id}-${idx}`}
                href={`/workspace/component_explorer`}
                className="group relative w-64 p-3.5 rounded-2xl bg-[#131119]/80 border border-white/[0.06] hover:border-[#F06543]/40 hover:shadow-[0_4px_24px_rgba(240,101,67,0.2)] transition-all duration-300 shrink-0 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Visual Illustration Showcase */}
                <div className="h-20 w-full rounded-xl bg-[#0E0D14] border border-white/[0.06] p-2 flex items-center justify-center relative overflow-hidden group-hover:border-[#F06543]/20 transition-colors shadow-inner">
                  {/* Subtle Grid Backdrop */}
                  <div className="absolute inset-0 bg-[radial-gradient(#F06543_1px,transparent_1px)] [background-size:10px_10px] opacity-10" />
                  <ComponentPhysicalIllustration componentId={comp.id} className="w-full h-full relative z-10" />
                </div>

                {/* Info & Badges */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-sans">
                    <span className="px-1.5 py-0.2 rounded bg-[#1C1A24] text-[#F06543] border border-white/[0.06] font-semibold">
                      {comp.package.standardCode}
                    </span>
                    <span className="text-[#8E8899] font-medium">
                      {comp.package.pins.length} leads
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-white truncate group-hover:text-[#F06543] transition-colors">
                    {comp.name}
                  </h3>

                  <p className="text-[10px] text-[#8E8899] truncate font-sans">
                    {comp.educational.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}