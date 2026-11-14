'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/lib/store';

interface CinematicIntroAnimationProps {
  onComplete?: () => void;
}

// Exact physical start offsets (in pixels) so each letter starts directly behind the icon center:
// As each letter triggers, it slides to the right from behind the icon into its final position in "Silicora"
const LETTER_START_OFFSETS = [
  { mobile: 54, desktop: 74 },   // S
  { mobile: 84, desktop: 114 },  // i
  { mobile: 102, desktop: 140 }, // l
  { mobile: 120, desktop: 166 }, // i
  { mobile: 148, desktop: 204 }, // c
  { mobile: 180, desktop: 248 }, // o
  { mobile: 212, desktop: 292 }, // r
  { mobile: 244, desktop: 336 }, // a
];

export function CinematicIntroAnimation({ onComplete }: CinematicIntroAnimationProps) {
  // Mode:
  // - 'full': First visit / intro replay
  // - 'reload': Reload in session -> cleanly shows website name & dissolves
  // - 'hidden': Finished & unmounted
  const [mode, setMode] = useState<'full' | 'reload' | 'hidden'>('full');

  // Stages:
  // 0: Initial black screen (0 - 200ms)
  // 1: Icon faced in center, bigger than usual (200ms - 900ms)
  // 2: Letters slide in smoothly like S -> i -> l in a continuous slide-right wave (900ms - 2200ms)
  // 3: Icon slowly arrives at start after final letter opens (2200ms - 3250ms)
  // 4: Smoothly slides to top-left where navbar logo is appearing (3250ms - 4250ms)
  // 5: Complete & unmount (4300ms)
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [revealedLettersCount, setRevealedLettersCount] = useState<number>(0);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  const brandName = ['S', 'i', 'l', 'i', 'c', 'o', 'r', 'a'];
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // DOM refs
  const lockupRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Docking coordinates for sliding to top-left navbar logo
  const [dockCoords, setDockCoords] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 0.55,
  });

  const isTransitioningToHome = useWorkspaceStore((state) => state.isTransitioningToHome);
  const setIsTransitioningToHome = useWorkspaceStore((state) => state.setIsTransitioningToHome);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const handleFinish = () => {
    clearAllTimers();
    setIsDismissing(true);
    setTimeout(() => {
      setMode('hidden');
      onComplete?.();
    }, 450);
  };

  // Measure delta to the top-left navbar brand logo
  const measureDock = () => {
    if (!lockupRef.current) return;
    const lockupRect = lockupRef.current.getBoundingClientRect();
    const navLogo = document.getElementById('navbar-brand-logo');

    if (navLogo) {
      const navRect = navLogo.getBoundingClientRect();
      const deltaX = navRect.left - lockupRect.left;
      const deltaY = navRect.top - lockupRect.top;
      const targetScale = Math.min(0.65, Math.max(0.45, navRect.height / lockupRect.height));
      setDockCoords({ x: deltaX, y: deltaY, scale: targetScale });
    } else {
      // Fallback top-left position
      setDockCoords({
        x: -(window.innerWidth / 2) + 80,
        y: -(window.innerHeight / 2) + 36,
        scale: 0.55,
      });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDesktop = () => setIsDesktop(window.innerWidth >= 640);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    // If user returned from workspace, skip intro completely with zero loading animation
    const returnedFromWorkspace = sessionStorage.getItem('silicora_returned_from_workspace');
    if (returnedFromWorkspace) {
      sessionStorage.removeItem('silicora_returned_from_workspace');
      setMode('hidden');
      onComplete?.();
      return () => window.removeEventListener('resize', checkDesktop);
    }

    // Check if reload
    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        isReload = true;
      }
    } catch {
      // fallback
    }

    const hasSeenFullIntro = sessionStorage.getItem('silicora_has_seen_full_intro');

    if (isReload || hasSeenFullIntro === 'true') {
      // ==========================================
      // RELOAD MODE: "on reload Just show our website name"
      // ==========================================
      setMode('reload');
      setStage(1);

      const t1 = setTimeout(() => setIsDismissing(true), 1050);
      const t2 = setTimeout(() => {
        setStage(5);
        setMode('hidden');
        onComplete?.();
      }, 1550);

      timersRef.current.push(t1, t2);

      return () => {
        window.removeEventListener('resize', checkDesktop);
        clearAllTimers();
      };
    } else {
      // =========================================================================
      // FULL INTRO:
      // 1. Icon faced in center, bigger than usual
      // 2. Letters slide right smoothly: S slides first, i follows immediately, l follows i...
      // 3. Icon slowly arrives at start after final letter in Silicora opens
      // 4. Slide to top-left where navbar logo is appearing
      // =========================================================================
      setMode('full');
      sessionStorage.setItem('silicora_has_seen_full_intro', 'true');

      // Stage 1: Icon appears in center, bigger than usual
      const t1 = setTimeout(() => setStage(1), 180);

      // Stage 2: S slides first, i immediately follows, l follows i... (continuous smooth wave)
      // Stagger is 75ms: tight and fluid so each letter immediately follows the previous one!
      const t2 = setTimeout(() => {
        setStage(2);
        brandName.forEach((_, idx) => {
          const letterTimer = setTimeout(() => {
            setRevealedLettersCount(idx + 1);
          }, 75 * idx);
          timersRef.current.push(letterTimer);
        });
      }, 920);

      // Stage 3: After final letter 'a' has opened, icon slowly arrives at start!
      // (920ms + 75ms * 7 + ~650ms slide duration = ~2100ms; starts docking at 2250ms)
      const t3 = setTimeout(() => {
        setStage(3);
      }, 2250);

      // Stage 4: Slide smoothly to top-left where navbar logo is appearing
      const t4 = setTimeout(() => {
        measureDock();
        setStage(4);
      }, 3300);

      // Stage 5: Finished docking, cleanly unmount
      const t5 = setTimeout(() => {
        setStage(5);
        setMode('hidden');
        onComplete?.();
      }, 4300);

      timersRef.current.push(t1, t2, t3, t4, t5);

      return () => {
        window.removeEventListener('resize', checkDesktop);
        clearAllTimers();
      };
    }
  }, [isTransitioningToHome, setIsTransitioningToHome, onComplete]);

  // Replay intro listener
  useEffect(() => {
    const handleReplay = () => {
      clearAllTimers();
      setIsDismissing(false);
      setRevealedLettersCount(0);
      setStage(0);
      setMode('full');

      const t1 = setTimeout(() => setStage(1), 180);
      const t2 = setTimeout(() => {
        setStage(2);
        brandName.forEach((_, idx) => {
          const letterTimer = setTimeout(() => {
            setRevealedLettersCount(idx + 1);
          }, 75 * idx);
          timersRef.current.push(letterTimer);
        });
      }, 920);
      const t3 = setTimeout(() => setStage(3), 2250);
      const t4 = setTimeout(() => {
        measureDock();
        setStage(4);
      }, 3300);
      const t5 = setTimeout(() => {
        setStage(5);
        setMode('hidden');
        onComplete?.();
      }, 4300);

      timersRef.current.push(t1, t2, t3, t4, t5);
    };

    window.addEventListener('silicora:replay-intro', handleReplay);
    return () => window.removeEventListener('silicora:replay-intro', handleReplay);
  }, [onComplete]);

  // Keyboard shortcut to skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (mode === 'hidden' || stage === 5) return null;

  return (
    <div
      onClick={handleFinish}
      className={cn(
        'fixed inset-0 z-[250] flex items-center justify-center bg-[#0A090D] select-none overflow-hidden cursor-pointer',
        // In Stage 4, dark background smoothly dissolves as the logo docks into the navbar
        'transition-opacity duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)]',
        isDismissing || stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
      title="Click or press Esc to enter immediately"
    >
      {/* 1. Volumetric Warm Lighting in Background */}
      <div
        className={cn(
          'absolute w-[700px] h-[700px] rounded-full pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'bg-[radial-gradient(circle,rgba(240,101,67,0.18)_0%,rgba(226,88,62,0.07)_35%,rgba(147,51,234,0.03)_60%,transparent_75%)] blur-[100px]',
          stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
          stage === 4 && 'opacity-0 scale-125'
        )}
      />

      {/* Subtle Spatial Dust Grid */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none transition-opacity duration-1000',
          stage >= 1 && stage < 4 ? 'opacity-15' : 'opacity-0'
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#F06543_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* Skip Button (Top-Right) */}
      <div className="absolute top-6 right-6 z-30">
        <span className="text-[10px] font-mono text-[#8E8899] bg-[#14121A]/80 border border-white/[0.08] px-3 py-1.5 rounded-full backdrop-blur-md hover:border-[#F06543]/40 hover:text-white transition-colors">
          Click or Esc to enter
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHOREOGRAPHED FULL INTRO LOCKUP                                        */}
      {/* ========================================================================= */}
      {mode === 'full' ? (
        <div
          ref={lockupRef}
          className={cn(
            'relative z-20 flex items-center justify-center transform-gpu',
            // Transition timing for sliding to the top-left in Stage 4:
            stage === 4
              ? 'transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]'
              : 'transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]'
          )}
          style={
            stage === 4
              ? {
                  transform: `translate3d(${dockCoords.x}px, ${dockCoords.y}px, 0) scale(${dockCoords.scale})`,
                  transformOrigin: 'top left',
                }
              : undefined
          }
        >
          {/* THE MASTER ANIMATED ROW:
              - In Stage 1 & 2: Shifted so the ICON is dead-center of the entire viewport!
              - In Stage 3+: Translates smoothly to 0 so the whole lockup [Icon + Silicora]
                is centered, meaning the icon has "slowly arrived at the start"!
          */}
          <div
            className={cn(
              'relative flex items-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
              // Offset by ~half text width so the icon starts dead-center:
              stage < 3
                ? 'translate-x-[52px] sm:translate-x-[92px]'
                : 'translate-x-0'
            )}
          >
            {/* ------------------------------------------------------------- */}
            {/* ICON EMBLEM:                                                  */}
            {/* - Centered and bigger than usual (Stage 1 & 2)                */}
            {/* - Solid opaque crystal body (z-20) so letters emerge          */}
            {/*   physically from underneath/behind the icon!                 */}
            {/* - Slowly arrives at start & scales down (Stage 3+)            */}
            {/* ------------------------------------------------------------- */}
            <div
              ref={iconRef}
              className={cn(
                'relative z-20 flex items-center justify-center shrink-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
                // Stage 0: Hidden
                stage === 0 && 'scale-75 opacity-0',
                // Stage 1 & 2: "First icon is faced in center bigger than usual"
                stage >= 1 && stage < 3 && 'scale-[1.4] sm:scale-[1.5] opacity-100',
                // Stage 3+: Icon slowly arrives at the start and scales into balanced lockup
                stage >= 3 && 'scale-100 opacity-100'
              )}
            >
              {/* Soft ambient halo behind icon */}
              <div className="absolute inset-0 rounded-full bg-[#F06543]/25 blur-xl pointer-events-none" />

              {/* Bespoke Silicon Die Vector Emblem (Solid opaque facet background) */}
              <svg
                className="w-20 h-20 sm:w-24 sm:h-24 relative z-10 drop-shadow-[0_0_25px_rgba(240,101,67,0.55)]"
                viewBox="0 0 48 48"
                fill="none"
              >
                <defs>
                  <linearGradient id="realisticLogoGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FF7A59" />
                    <stop offset="50%" stopColor="#F06543" />
                    <stop offset="100%" stopColor="#C93B2B" />
                  </linearGradient>
                  <linearGradient id="realisticFacetBg" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#221820" />
                    <stop offset="100%" stopColor="#120E16" />
                  </linearGradient>
                </defs>

                {/* Solid Hexagonal Crystal Die Frame (Opaque so letters slide cleanly from behind!) */}
                <path
                  d="M24 3 L41 12.8 V32.2 L24 42 L7 32.2 V12.8 Z"
                  stroke="url(#realisticLogoGrad)"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                  fill="url(#realisticFacetBg)"
                />

                {/* Planar Diffusion Internal Leadlines */}
                <line x1="24" y1="3" x2="24" y2="18" stroke="#FF7A59" strokeWidth="1.6" strokeOpacity="0.85" />
                <line x1="41" y1="32.2" x2="29" y2="26" stroke="#FF7A59" strokeWidth="1.6" strokeOpacity="0.85" />
                <line x1="7" y1="32.2" x2="19" y2="26" stroke="#FF7A59" strokeWidth="1.6" strokeOpacity="0.85" />

                {/* Active Semiconductor Crystal Die */}
                <polygon
                  points="24,18 30,24 24,30 18,24"
                  fill="url(#realisticLogoGrad)"
                  className="drop-shadow-[0_0_10px_#F06543]"
                />

                {/* Central Quantum Emitter Point */}
                <circle cx="24" cy="24" r="2.8" fill="#FFF9C4" />

                {/* Orbital Satellite Beads */}
                <circle cx="24" cy="9" r="2" fill="#FFB74D" />
                <circle cx="34" cy="28" r="2" fill="#FF7A59" />
                <circle cx="14" cy="28" r="2" fill="#FF7A59" />

                {/* Micro Corner Bond Pads */}
                <circle cx="24" cy="3" r="1.3" fill="#FFE082" />
                <circle cx="41" cy="12.8" r="1.3" fill="#FF7A59" />
                <circle cx="41" cy="32.2" r="1.3" fill="#FF7A59" />
                <circle cx="24" cy="42" r="1.3" fill="#FF7A59" />
                <circle cx="7" cy="32.2" r="1.3" fill="#FF7A59" />
                <circle cx="7" cy="12.8" r="1.3" fill="#FF7A59" />
              </svg>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* LETTERS CONTAINER:                                            */}
            {/* - Behind the icon (z-10)                                      */}
            {/* - Smooth rightward slide wave:                                */}
            {/*   S slides in first, then i follows immediately, then l...    */}
            {/* ------------------------------------------------------------- */}
            <div className="relative z-10 flex items-center pl-2 sm:pl-3 select-none overflow-visible">
              {brandName.map((letter, index) => {
                const isRevealed = stage >= 2 && index < revealedLettersCount;
                const offset = LETTER_START_OFFSETS[index] || { mobile: 150, desktop: 200 };
                const hiddenDistance = isDesktop ? offset.desktop : offset.mobile;

                return (
                  <span
                    key={index}
                    className="inline-block text-4xl sm:text-6xl font-normal font-sans text-white tracking-tight transform-gpu"
                    style={{
                      // Each letter smoothly slides to the right from behind the icon:
                      // Duration: 720ms, with a smooth cubic-bezier curve
                      transform: isRevealed
                        ? 'translate3d(0, 0, 0)'
                        : `translate3d(-${hiddenDistance}px, 0, 0)`,
                      opacity: isRevealed ? 1 : 0,
                      transition: isRevealed
                        ? 'transform 720ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)'
                        : 'none',
                      textShadow: isRevealed
                        ? '0 0 24px rgba(240,101,67,0.45)'
                        : 'none',
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Subtitle Badge (appears gently once lockup arrives at start) */}
          {stage === 3 && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 animate-in fade-in duration-700 pointer-events-none whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F06543]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#9691A0]">
                Spatial Semiconductor Workstation
              </span>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* 3. RELOAD MODE: "on reload Just show our website name"                    */
        /* ========================================================================= */
        <div
          className={cn(
            'relative z-20 flex flex-col items-center gap-3.5 transition-all duration-500 ease-out',
            isDismissing ? 'scale-105 opacity-0 blur-md' : 'scale-100 opacity-100'
          )}
        >
          <div className="flex items-center gap-4">
            {/* Logo Emblem */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#F06543]/25 blur-lg pointer-events-none" />
              <svg className="w-12 h-12 sm:w-14 sm:h-14 relative z-10 drop-shadow-[0_0_15px_rgba(240,101,67,0.5)]" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 3 L41 12.8 V32.2 L24 42 L7 32.2 V12.8 Z"
                  stroke="#F06543"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                  fill="#1C1420"
                />
                <line x1="24" y1="3" x2="24" y2="18" stroke="#FF7A59" strokeWidth="1.5" strokeOpacity="0.8" />
                <line x1="41" y1="32.2" x2="29" y2="26" stroke="#FF7A59" strokeWidth="1.5" strokeOpacity="0.8" />
                <line x1="7" y1="32.2" x2="19" y2="26" stroke="#FF7A59" strokeWidth="1.5" strokeOpacity="0.8" />
                <polygon points="24,18 30,24 24,30 18,24" fill="#F06543" />
                <circle cx="24" cy="24" r="2.8" fill="#FFF9C4" />
                <circle cx="24" cy="9" r="1.8" fill="#FFB74D" />
                <circle cx="34" cy="28" r="1.8" fill="#FF7A59" />
                <circle cx="14" cy="28" r="1.8" fill="#FF7A59" />
              </svg>
            </div>

            {/* Clean Website Name */}
            <h1
              className="text-4xl sm:text-6xl font-normal font-sans text-white tracking-tight"
              style={{ textShadow: '0 0 28px rgba(240,101,67,0.45)' }}
            >
              Silicora
            </h1>
          </div>

          <div className="flex items-center gap-2 animate-in fade-in duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F06543]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#9691A0]">
              Spatial Electronics Workstation
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
