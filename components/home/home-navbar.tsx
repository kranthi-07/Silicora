'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Box,
  Layers,
  Activity,
  Cpu,
  Hammer,
  Grid,
  GraduationCap,
  Code,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/brand/brand-logo';

export function HomeNavbar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const toggleCodeEditor = useWorkspaceStore((state) => state.toggleCodeEditor);
  const setIsTransitioningToWorkspace = useWorkspaceStore((state) => state.setIsTransitioningToWorkspace);
  const setTutorialsModalOpen = useWorkspaceStore((state) => state.setTutorialsModalOpen);
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const toggleThemeMode = useWorkspaceStore((state) => state.toggleThemeMode);
  const isLight = themeMode === 'light';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems = [
    { id: 'overview', label: 'Overview', href: '/', icon: Sparkles },
    { id: 'samples', label: 'Components', href: '/workspace/component_explorer', icon: Box },
    { id: 'research', label: 'Architecture', href: '/workspace/internal_cutaway', icon: Layers },
    { id: 'patterns', label: 'Prototyping', href: '/workspace/circuit_workspace', icon: Cpu },
    { id: 'reports', label: 'Simulation', href: '/workspace/electrical_sim_lab', icon: Activity },
  ];

  const extendedSuites = [
    {
      label: 'Systems Dissection',
      desc: 'Exploded multi-stage physical teardown of commercial hardware',
      href: '/workspace/device_explorer',
      icon: Hammer,
      badge: 'Dissection',
    },
    {
      label: 'PCB Foundry',
      desc: 'Layer stackup, DRC verification & KiCad/Gerber export',
      href: '/workspace/pcb_studio',
      icon: Grid,
      badge: 'Gerber/KiCad',
    },
    {
      label: 'Engineering Academy',
      desc: 'Interactive guided electronics mastery curriculum',
      href: '/workspace/learning_academy',
      icon: GraduationCap,
      badge: 'Interactive',
    },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full backdrop-blur-2xl border-b transition-all duration-200',
        isLight
          ? 'bg-white/90 border-slate-200/80 shadow-sm'
          : 'bg-[#0A090D]/90 border-white/[0.05]'
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* 1. Left: Bespoke Silicora Emblem & Brand */}
        <div id="navbar-brand-logo" className="flex items-center">
          <BrandLogo href="/" size="md" tagline="Spatial Studio" />
        </div>

        {/* 2. Center: Sleek Floating Pill Navigation Bar with High-Tech Symbols */}
        <nav
          className={cn(
            'hidden md:flex items-center gap-0.5 px-3 py-1.5 rounded-full border text-xs font-sans relative transition-colors duration-200',
            isLight
              ? 'bg-slate-100/90 border-slate-200/90 shadow-sm'
              : 'bg-[#14121A] border-white/[0.06] shadow-inner'
          )}
        >
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200',
                  isActive
                    ? isLight
                      ? 'text-slate-900 font-bold bg-white shadow-sm'
                      : 'text-white font-semibold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#9691A0] hover:text-white'
                )}
              >
                <ItemIcon
                  className={cn(
                    'w-3.5 h-3.5 transition-colors',
                    isActive ? 'text-[#F06543]' : isLight ? 'text-slate-400' : 'text-[#7B7685]'
                  )}
                />
                <span>{item.label}</span>
                {isActive && !isLight && (
                  <span className="absolute bottom-0.5 inset-x-3 h-[2px] rounded-full bg-[#F06543] shadow-[0_0_8px_#F06543]" />
                )}
              </Link>
            );
          })}

          {/* "+ More" Dropdown for Teardowns, PCB & Academy */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                moreMenuOpen
                  ? isLight
                    ? 'text-slate-900 bg-white shadow-sm'
                    : 'text-white bg-white/[0.06]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#9691A0] hover:text-white'
              )}
            >
              <Grid className="w-3.5 h-3.5 text-[#F06543]" />
              <span>Suites</span>
              <ChevronDown
                className={cn('w-3.5 h-3.5 transition-transform duration-200', moreMenuOpen && 'rotate-180 text-[#F06543]')}
              />
            </button>

            {/* Dropdown Floating Menu */}
            {moreMenuOpen && (
              <div
                className={cn(
                  'absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl backdrop-blur-2xl border p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200',
                  isLight
                    ? 'bg-white/98 border-slate-200 shadow-xl'
                    : 'bg-[#131119]/95 border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
                )}
              >
                {extendedSuites.map((suite) => {
                  const Icon = suite.icon;
                  return (
                    <Link
                      key={suite.label}
                      href={suite.href}
                      onClick={() => setMoreMenuOpen(false)}
                      className={cn(
                        'flex items-start gap-3 p-2.5 rounded-xl transition-colors group',
                        isLight ? 'hover:bg-slate-100/80' : 'hover:bg-white/[0.06]'
                      )}
                    >
                      <div
                        className={cn(
                          'p-2 rounded-lg border shrink-0 transition-colors',
                          isLight
                            ? 'bg-slate-100 border-slate-200 text-slate-700 group-hover:border-[#F06543]/40'
                            : 'bg-white/[0.03] border-white/[0.08] text-slate-300 group-hover:border-[#F06543]/40 group-hover:bg-[#F06543]/10'
                        )}
                      >
                        <Icon className="w-4 h-4 text-[#F06543]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'text-xs font-semibold group-hover:text-[#F06543] transition-colors',
                              isLight ? 'text-slate-900' : 'text-white'
                            )}
                          >
                            {suite.label}
                          </span>
                          <span
                            className={cn(
                              'text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold',
                              isLight
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : 'bg-white/[0.05] text-[#8E8899] border-white/[0.08]'
                            )}
                          >
                            {suite.badge}
                          </span>
                        </div>
                        <p
                          className={cn(
                            'text-[10px] leading-tight mt-0.5 truncate',
                            isLight ? 'text-slate-500' : 'text-[#8E8899]'
                          )}
                        >
                          {suite.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* 3. Right: Theme Toggle, Tutorials, Code Editor & Coral Capsule Button [ Start Analysis → ] */}
        <div className="flex items-center gap-2">
          {/* Visual Theme Toggle (Dark Lab Mode vs Light Studio Mode) */}
          <button
            type="button"
            onClick={toggleThemeMode}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all border cursor-pointer',
              isLight
                ? 'bg-amber-400/15 text-amber-600 border-amber-400/40 shadow-sm hover:bg-amber-400/25 font-semibold'
                : 'bg-[#14121A] text-[#9691A0] hover:text-white hover:bg-[#1C1A24] border-white/[0.08]'
            )}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Studio Mode'}
            aria-label="Toggle theme mode"
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium text-[11px] hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium text-[11px] hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Tutorials Modal Trigger */}
          <button
            type="button"
            onClick={() => setTutorialsModalOpen(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all cursor-pointer group border',
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-amber-400/50'
                : 'bg-[#14121A] hover:bg-[#1C1A24] text-[#9691A0] hover:text-white border-white/[0.08] hover:border-amber-400/40'
            )}
            title="Interactive Engineering Tutorials"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Tutorials</span>
          </button>

          <button
            type="button"
            onClick={toggleCodeEditor}
            className={cn(
              'hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all',
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                : 'bg-[#14121A] text-[#9691A0] hover:text-white hover:bg-white/[0.05] border-white/[0.06] hover:border-white/[0.15]'
            )}
            title="Launch Inbuilt MCU Code Platform & Serial Monitor (Ctrl+D)"
          >
            <Code className="w-3.5 h-3.5 text-[#F06543]" />
            <span>Code (Ctrl+D)</span>
          </button>

          <Link
            href="/workspace"
            onClick={() => setIsTransitioningToWorkspace(true)}
            className="relative flex items-center gap-2.5 pl-5 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-[#E2583E] via-[#F06543] to-[#FF7A59] text-white text-xs font-medium shadow-[0_4px_20px_rgba(240,101,67,0.35)] hover:shadow-[0_6px_28px_rgba(240,101,67,0.55)] hover:scale-102 active:scale-98 transition-all group"
          >
            <span>Start Analysis</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'p-2 rounded-full border',
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                  : 'bg-[#14121A] border-white/[0.06] text-slate-300 hover:text-white'
              )}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with ALL environments */}
      {mobileMenuOpen && (
        <div
          className={cn(
            'md:hidden border-b p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200',
            isLight ? 'bg-white border-slate-200' : 'bg-[#0E0D14] border-white/[0.08]'
          )}
        >
          <div className="grid grid-cols-2 gap-2">
            {[...primaryNavItems, ...extendedSuites].map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors',
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                  )}
                >
                  <ItemIcon className="w-3.5 h-3.5 text-[#F06543]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
