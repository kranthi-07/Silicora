'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspaceStore } from '@/lib/store';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  FolderKanban,
  Cpu,
  Layers,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TutorialStep {
  id: string;
  targetId: string;
  title: string;
  message: string;
  position: 'bottom' | 'top' | 'left' | 'right';
  icon: React.ReactNode;
}

export function WorkspaceTutorialTour() {
  const { activeEnvironment } = useWorkspaceStore();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  // Define steps per environment
  const getStepsForEnvironment = useCallback((): TutorialStep[] => {
    const hasSeenGlobal =
      typeof window !== 'undefined' &&
      localStorage.getItem('silicora_tour_nav_seen') === 'true';

    const steps: TutorialStep[] = [];

    // Global navigation elements (Catalog & Inspector) - only show once across the website
    if (!hasSeenGlobal) {
      steps.push(
        {
          id: 'catalog',
          targetId: 'tutorial-catalog-button',
          title: 'Component Catalog',
          message:
            'This bar contains all electronic components in the library. Click here to open the catalog and easily switch between parts at any time.',
          position: 'bottom',
          icon: <FolderKanban className="w-4 h-4 text-[#F06543]" />,
        },
        {
          id: 'inspector',
          targetId: 'tutorial-inspector-button',
          title: 'Physical & 3D Inspector',
          message:
            'Inspect sub-surface physical layers and 3D sub-elements of the component, with isolated 3D viewing when simulation is on or off.',
          position: 'bottom',
          icon: <Cpu className="w-4 h-4 text-cyan-400" />,
        }
      );
    }

    // Page-specific important highlights
    if (activeEnvironment === 'internal_cutaway') {
      steps.push(
        {
          id: 'cutaway_dock',
          targetId: 'tutorial-bottom-dock',
          title: '3D Layer Cutaway & Explode',
          message:
            'Peel back protective casings or explode sub-surface structures in 3D. Click on any layer to open an informative pop-up card about that layer.',
          position: 'top',
          icon: <Layers className="w-4 h-4 text-cyan-400" />,
        },
        {
          id: 'sim_toggle',
          targetId: 'tutorial-sim-toggle',
          title: 'Interactive Simulation Bar',
          message:
            'Give yourself free hands to adjust Voltage, Current, and Resistance in real time. Start simulation to observe live dotted current flow across the terminals.',
          position: 'bottom',
          icon: <Zap className="w-4 h-4 text-emerald-400" />,
        }
      );
    }

    return steps;
  }, [activeEnvironment]);

  // Check if this page's tutorial has been shown before
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pageKey = `silicora_tutorial_done_${activeEnvironment}`;
    const alreadySeen = localStorage.getItem(pageKey) === 'true';

    if (!alreadySeen) {
      const steps = getStepsForEnvironment();
      if (steps.length > 0) {
        // Small delay to allow DOM elements to mount
        const timer = setTimeout(() => {
          setIsTourActive(true);
          setActiveStepIndex(0);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [activeEnvironment, getStepsForEnvironment]);

  // Update target bounding box when step changes
  useEffect(() => {
    if (!isTourActive || activeStepIndex < 0) {
      setTargetRect(null);
      return;
    }

    const steps = getStepsForEnvironment();
    const currentStep = steps[activeStepIndex];
    if (!currentStep) return;

    const updateRect = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [isTourActive, activeStepIndex, getStepsForEnvironment]);

  const steps = getStepsForEnvironment();
  const currentStep = steps[activeStepIndex];

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleComplete = () => {
    setIsTourActive(false);
    setActiveStepIndex(-1);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`silicora_tutorial_done_${activeEnvironment}`, 'true');
      localStorage.setItem('silicora_tour_nav_seen', 'true');
    }
  };

  const handleRestartTour = () => {
    setIsTourActive(true);
    setActiveStepIndex(0);
  };

  if (!isTourActive || !currentStep) {
    // Subtle help button to re-trigger tutorial if desired
    return (
      <button
        type="button"
        onClick={handleRestartTour}
        className="fixed bottom-3 right-3 z-30 p-2 rounded-full bg-[#161B22]/80 backdrop-blur-md border border-white/[0.1] text-[#8B949E] hover:text-white hover:border-[#F06543]/40 transition-all shadow-md group"
        title="Start Page Tutorial"
      >
        <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  // Calculate tooltip pop-up position
  const getTooltipStyle = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const margin = 16;
    if (currentStep.position === 'bottom') {
      return {
        top: `${Math.min(window.innerHeight - 220, targetRect.bottom + margin)}px`,
        left: `${Math.max(20, Math.min(window.innerWidth - 380, targetRect.left))}px`,
      };
    }

    if (currentStep.position === 'top') {
      return {
        bottom: `${window.innerHeight - targetRect.top + margin}px`,
        left: `${Math.max(20, Math.min(window.innerWidth - 380, targetRect.left))}px`,
      };
    }

    return {
      top: `${targetRect.bottom + margin}px`,
      left: `${Math.max(20, targetRect.left)}px`,
    };
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto overflow-hidden animate-in fade-in duration-200">
      {/* 1. Full Screen Darkened Backdrop with Spotlight Cutout */}
      {targetRect ? (
        <div
          className="absolute rounded-2xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: `${targetRect.top - 6}px`,
            left: `${targetRect.left - 6}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.78), 0 0 25px rgba(240, 101, 67, 0.65)',
            border: '2px solid rgba(240, 101, 67, 0.9)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      )}

      {/* 2. Floating Guidance Tooltip Card */}
      <div
        className="absolute w-88 max-w-[calc(100vw-2.5rem)] z-50 pointer-events-auto transition-all duration-300 ease-out"
        style={getTooltipStyle()}
      >
        <div className="bg-[#12141C] border border-[#F06543]/40 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-[#F0F6FC] font-sans relative overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#F06543]/15 border border-[#F06543]/30">
                {currentStep.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#F06543] font-bold block uppercase tracking-wider">
                  QUICK TOUR · STEP {activeStepIndex + 1} OF {steps.length}
                </span>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {currentStep.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={handleComplete}
              className="p-1 rounded-lg text-[#8B949E] hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Skip Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-[#C9D1D9] leading-relaxed mt-1">
            {currentStep.message}
          </p>

          {/* Navigation Controls */}
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleComplete}
              className="text-[#8B949E] hover:text-white font-mono text-[11px] hover:underline"
            >
              Skip
            </button>

            <div className="flex items-center gap-2">
              {activeStepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-2.5 py-1 rounded-lg bg-[#161B22] text-[#C9D1D9] hover:text-white border border-white/[0.08] text-[11px] font-semibold flex items-center gap-1 transition-all"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#F06543] to-amber-500 hover:from-[#f15631] hover:to-amber-400 text-white font-bold text-[11px] shadow-[0_0_12px_rgba(240,101,67,0.4)] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{activeStepIndex === steps.length - 1 ? 'Got It' : 'Next'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
