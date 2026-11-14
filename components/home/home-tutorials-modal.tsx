'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/lib/store';
import {
  GraduationCap,
  X,
  Layers,
  Activity,
  Cpu,
  Sparkles,
  ArrowRight,
  BookOpen,
  Play,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeTutorialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HomeTutorialsModal({ isOpen, onClose }: HomeTutorialsModalProps) {
  const router = useRouter();
  const setIsTransitioningToWorkspace = useWorkspaceStore(
    (state) => state.setIsTransitioningToWorkspace
  );
  const setActiveEnvironment = useWorkspaceStore((state) => state.setActiveEnvironment);
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLaunchTour = (envId: 'internal_cutaway' | 'electrical_sim_lab' | 'circuit_workspace' | 'learning_academy') => {
    // Reset the tutorial seen flag so the interactive tour triggers
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`silicora_tutorial_done_${envId}`);
      localStorage.removeItem('silicora_tour_nav_seen');
    }
    setActiveEnvironment(envId);
    setIsTransitioningToWorkspace(true);
    onClose();
    router.push(`/workspace/${envId}`);
  };

  const tutorials = [
    {
      id: 'cutaway',
      title: '3D Layer Architecture & Cutaways',
      category: 'Internal Inspection',
      desc: 'Learn how to peel back outer protective coatings, explode sub-assemblies in 3D, and inspect microscopic silicon dies and wirebonds.',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      badge: 'Interactive 3D',
      envId: 'internal_cutaway' as const,
      color: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      btnColor: 'bg-cyan-500 hover:bg-cyan-400',
    },
    {
      id: 'simulation',
      title: 'Free-Hands SPICE Electrical Simulation',
      category: 'Physics & Ohm\'s Law',
      desc: 'Master the live test bench: attach digital alligator clips, freely adjust Voltage, Current, and Resistance, and observe live dotted current flow.',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      badge: 'Live SPICE',
      envId: 'electrical_sim_lab' as const,
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400',
    },
    {
      id: 'breadboard',
      title: 'Virtual 3D Breadboard Prototyping',
      category: 'Hands-On Circuits',
      desc: 'Step-by-step circuit assembly on solderless breadboards: place tie-point leads, wire flexible jumpers, and detect short-circuits safely.',
      icon: <Cpu className="w-5 h-5 text-[#F06543]" />,
      badge: 'Prototyping',
      envId: 'circuit_workspace' as const,
      color: 'from-[#F06543]/20 to-[#F06543]/5',
      borderColor: 'border-[#F06543]/30',
      btnColor: 'bg-[#F06543] hover:bg-[#ff7a59]',
    },
    {
      id: 'academy',
      title: 'Structured Engineering Academy',
      category: 'Mastery Curriculum',
      desc: 'Comprehensive multi-stage modules covering discrete passives, active semiconductors, logic families, and frequency domain filters.',
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      badge: 'Curriculum',
      envId: 'learning_academy' as const,
      color: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      btnColor: 'bg-amber-500 hover:bg-amber-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={cn(
          'relative w-full max-w-3xl rounded-3xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors',
          isLight
            ? 'bg-white border-slate-200 text-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.15)]'
            : 'bg-[#12141D] border-white/[0.12] text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
        )}
      >
        {/* Glow Accent Header Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#F06543] via-amber-400 to-cyan-400" />

        {/* Modal Topbar */}
        <div
          className={cn(
            'px-6 py-5 border-b flex items-center justify-between shrink-0 transition-colors',
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161924]/60 border-white/[0.08]'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#F06543]/15 text-[#F06543] border border-[#F06543]/25 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#F06543] font-bold uppercase tracking-wider">
                  Interactive Learning Hub
                </span>
                <span
                  className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                    isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-white/[0.06] text-[#8B949E] border-white/[0.08]'
                  )}
                >
                  4 Guided Modules
                </span>
              </div>
              <h3
                className={cn(
                  'text-lg font-bold tracking-tight mt-0.5',
                  isLight ? 'text-slate-900' : 'text-white'
                )}
              >
                Hardware Engineering Tutorials
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-2 rounded-xl transition-colors cursor-pointer',
              isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-[#8B949E] hover:text-white hover:bg-white/[0.08]'
            )}
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <p className={cn('text-xs leading-relaxed', isLight ? 'text-slate-600' : 'text-[#9A95A4]')}>
            Choose a guided interactive tutorial to launch into our 3D hardware studio. Each module provides tactile hands-on controls, live physics models, and spotlight explanations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {tutorials.map((t) => (
              <div
                key={t.id}
                className={cn(
                  'p-4 rounded-2xl bg-gradient-to-br border flex flex-col justify-between transition-all group hover:scale-[1.01] hover:shadow-lg',
                  t.color,
                  t.borderColor,
                  isLight ? 'shadow-sm' : ''
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={cn('p-2 rounded-xl border', isLight ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/[0.06]')}>
                      {t.icon}
                    </div>
                    <span className={cn('text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border', isLight ? 'bg-white/90 text-slate-800 border-slate-200' : 'bg-black/40 text-white/90 border-white/[0.08]')}>
                      {t.badge}
                    </span>
                  </div>

                  <div>
                    <span className={cn('text-[10px] font-mono uppercase block font-semibold', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>
                      {t.category}
                    </span>
                    <h4 className={cn('text-sm font-bold transition-colors mt-0.5', isLight ? 'text-slate-900 group-hover:text-amber-600' : 'text-white group-hover:text-amber-200')}>
                      {t.title}
                    </h4>
                  </div>

                  <p className={cn('text-[11px] leading-relaxed', isLight ? 'text-slate-600' : 'text-[#A5A0AF]')}>
                    {t.desc}
                  </p>
                </div>

                <div className={cn('pt-4 mt-2 border-t flex items-center justify-end', isLight ? 'border-slate-200' : 'border-white/[0.06]')}>
                  <button
                    type="button"
                    onClick={() => handleLaunchTour(t.envId)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer',
                      t.btnColor
                    )}
                  >
                    <span>Start Tutorial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={cn(
            'px-6 py-4 border-t flex items-center justify-between text-xs font-mono shrink-0 transition-colors',
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#161924]/60 border-white/[0.08] text-[#8B949E]'
          )}
        >
          <span>Press Esc or click outside to dismiss.</span>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'px-4 py-1.5 rounded-xl font-semibold transition-all cursor-pointer',
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-white/[0.06] hover:bg-white/[0.1] text-white'
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
