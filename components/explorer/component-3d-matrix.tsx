'use client';

import React, { useState, useMemo, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useWorkspaceStore } from '@/lib/store';
import { MOCK_COMPONENTS } from '@/data/mock-components';
import { ComponentItem, ComponentCategory } from '@/types/component';
import {
  Search,
  Sparkles,
  Box,
  Layers,
  ArrowRight,
  Cpu,
  Activity,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AxialResistorModel } from '@/components/viewer/models/axial-resistor-model';
import { ElectrolyticCapModel } from '@/components/viewer/models/electrolytic-cap-model';
import { CeramicCapModel } from '@/components/viewer/models/ceramic-cap-model';
import { LedModel } from '@/components/viewer/models/led-model';
import { DiodeModel } from '@/components/viewer/models/diode-model';
import { BjtTo92Model } from '@/components/viewer/models/bjt-to92-model';
import { MosfetTo92Model } from '@/components/viewer/models/mosfet-to92-model';
import { IcDipModel } from '@/components/viewer/models/ic-dip-model';
import { PhotoresistorModel } from '@/components/viewer/models/photoresistor-model';
import { PotentiometerModel } from '@/components/viewer/models/potentiometer-model';
import { TactileSwitchModel } from '@/components/viewer/models/tactile-switch-model';
import { ToroidInductorModel } from '@/components/viewer/models/toroid-inductor-model';
import { PiezoBuzzerModel } from '@/components/viewer/models/piezo-buzzer-model';
import { TemperatureSensorModel } from '@/components/viewer/models/temperature-sensor-model';
import { ComputeBoardModel } from '@/components/viewer/models/compute-board-model';
import { BatteryCellModel } from '@/components/viewer/models/battery-cell-model';
import { UnsupportedModel } from '@/components/viewer/models/unsupported-model';

// Helper to render the appropriate 3D model inside the matrix card canvas with calibrated optical scale & centering
function ModelThumbnail({ component }: { component: ComponentItem }) {
  const { id, symbolType, package: pkg } = component;

  // 1. Axial Resistors
  if (id === 'pass_res_10k' || symbolType === 'resistor' || pkg.standardCode.startsWith('Axial')) {
    return (
      <group scale={0.17} position={[0, 0, 0]} rotation={[0.2, 0.4, 0.1]}>
        <AxialResistorModel />
      </group>
    );
  }

  // 2. Potentiometers
  if (id === 'pass_pot_10k' || symbolType === 'potentiometer') {
    return (
      <group scale={0.20} position={[0, -0.3, 0]} rotation={[0.2, 0.3, 0]}>
        <PotentiometerModel />
      </group>
    );
  }

  // 3. Capacitors
  if (id === 'pass_cap_elec_470u' || symbolType === 'polarized_capacitor' || pkg.standardCode.includes('Radial-Can')) {
    return (
      <group scale={0.20} position={[0, -0.3, 0]} rotation={[0.1, 0.2, 0]}>
        <ElectrolyticCapModel />
      </group>
    );
  }
  if (id === 'pass_cap_cer_100n' || symbolType === 'capacitor' || pkg.standardCode.includes('Disc')) {
    return (
      <group scale={0.22} position={[0, 0.2, 0]} rotation={[0.1, 0.3, 0]}>
        <CeramicCapModel />
      </group>
    );
  }

  // 4. Optoelectronics & LEDs
  if (id === 'opto_led_red_5mm' || symbolType === 'led') {
    return (
      <group scale={0.18} position={[0, 0.5, 0]} rotation={[0.1, 0.2, 0]}>
        <LedModel />
      </group>
    );
  }

  // 5. Diodes
  if (
    id === 'semi_diode_1n4148' ||
    id === 'semi_diode_1n4007' ||
    symbolType === 'diode' ||
    pkg.standardCode === 'DO-35' ||
    pkg.standardCode === 'DO-41'
  ) {
    return (
      <group scale={0.17} position={[0, 0, 0]} rotation={[0.2, 0.4, 0.1]}>
        <DiodeModel variant={pkg.standardCode === 'DO-41' ? 'do41' : 'do35'} />
      </group>
    );
  }

  // 6. Transistors (BJT / MOSFET)
  if (id === 'semi_bjt_2n3904' || symbolType === 'bjt_npn') {
    return (
      <group scale={0.24} position={[0, 0.6, 0]} rotation={[0.1, -0.3, 0]}>
        <BjtTo92Model />
      </group>
    );
  }
  if (id === 'semi_mosfet_2n7000' || symbolType === 'mosfet_n') {
    return (
      <group scale={0.24} position={[0, 0.6, 0]} rotation={[0.1, -0.3, 0]}>
        <MosfetTo92Model />
      </group>
    );
  }

  // 7. Temperature Sensors
  if (id === 'sensor_temp_lm35' || symbolType === 'temperature_sensor' || id.includes('lm35')) {
    return (
      <group scale={0.24} position={[0, 0.6, 0]} rotation={[0.1, -0.3, 0]}>
        <TemperatureSensorModel />
      </group>
    );
  }

  // 8. DIP-8 ICs
  if (id === 'ic_timer_ne555' || id === 'opamp_lm358' || pkg.standardCode.includes('DIP')) {
    return (
      <group scale={0.35} position={[0, -0.2, 0]} rotation={[0.3, -0.4, 0]}>
        <IcDipModel />
      </group>
    );
  }

  // 9. Photoresistors
  if (id === 'sensor_ldr_5mm' || symbolType === 'photoresistor') {
    return (
      <group scale={0.24} position={[0, 0.4, 0]} rotation={[0.2, 0.2, 0]}>
        <PhotoresistorModel />
      </group>
    );
  }

  // 10. Switches
  if (id === 'sw_tact_6mm' || symbolType === 'switch') {
    return (
      <group scale={0.30} position={[0, -0.1, 0]} rotation={[0.3, 0.4, 0]}>
        <TactileSwitchModel />
      </group>
    );
  }

  // 11. Inductors
  if (id === 'pass_ind_toroid_100u' || symbolType === 'inductor') {
    return (
      <group scale={0.24} position={[0, 0, 0]} rotation={[0.3, 0.3, 0]}>
        <ToroidInductorModel />
      </group>
    );
  }

  // 12. Buzzers
  if (id === 'out_buzzer_5v' || symbolType === 'buzzer') {
    return (
      <group scale={0.22} position={[0, -0.2, 0]} rotation={[0.2, 0.3, 0]}>
        <PiezoBuzzerModel />
      </group>
    );
  }

  // 13. Microcontroller Boards
  if (id.includes('pico') || id.includes('arduino') || symbolType === 'microcontroller') {
    return (
      <group scale={0.17} position={[0, 0, 0]} rotation={[0.3, -0.4, 0]}>
        <ComputeBoardModel variant={id.includes('arduino') ? 'arduino' : 'pico'} />
      </group>
    );
  }

  // 14. Batteries & Power Packs
  if (id.includes('battery') || symbolType === 'battery') {
    return (
      <group scale={0.20} position={[0, -0.1, 0]} rotation={[0.2, -0.3, 0]}>
        <BatteryCellModel variant={id.includes('aa') ? 'aa' : '9v'} />
      </group>
    );
  }

  return (
    <group scale={0.3} position={[0, 0, 0]}>
      <UnsupportedModel />
    </group>
  );
}

// High-Tech Cyber Loading Animation for 3D Component Cards (No 2D images)
function ComponentCardLoadingAnimation({ isLight = false }: { isLight?: boolean }) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden transition-colors',
        isLight ? 'bg-slate-100' : 'bg-[#09080E]'
      )}
    >
      {/* Background Engineering Perspective Grid */}
      <div
        className={cn(
          'absolute inset-0 bg-[size:14px_14px]',
          isLight
            ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)]'
        )}
      />

      {/* Subtle Ambient Radial Pulse */}
      <div className="absolute w-24 h-24 rounded-full bg-[#F06543]/10 blur-xl animate-pulse" />

      {/* Futuristic Orbiting Wireframe Spinner */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer Pulsing Radar Ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-30" />
        {/* Rotating Dual-Color Cyber Ring */}
        <div className="w-9 h-9 rounded-full border-2 border-t-[#F06543] border-r-cyan-400 border-b-transparent border-l-transparent animate-spin" />
        {/* Core Spatial Box Icon */}
        <Box className="w-3.5 h-3.5 text-[#F06543] absolute animate-pulse" />
      </div>

      {/* Clean Status Pill */}
      <div
        className={cn(
          'mt-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border backdrop-blur-md shadow-lg z-10',
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-600'
            : 'bg-[#14121A]/90 border-white/[0.08] text-[#8E8899]'
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F06543] animate-ping" />
        <span className={cn('text-[9px] font-mono', isLight ? 'text-slate-600' : 'text-[#8E8899]')}>
          Loading 3D Twin...
        </span>
      </div>
    </div>
  );
}

// Interactive 3D Thumbnail with Viewport Virtualization & Dedicated Loading Animation
function ComponentCardThumbnail({ component, isLight = false }: { component: ComponentItem; isLight?: boolean }) {
  const [inView, setInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: '120px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative w-full h-44 rounded-xl border overflow-hidden group-hover:border-[#F06543]/40 transition-colors flex items-center justify-center',
        isLight
          ? 'bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/80 border-slate-200'
          : 'bg-[#09080E] border-white/[0.04]'
      )}
    >
      {/* 1. Loading Animation shown while mounting or when off-screen */}
      {(!inView || !isLoaded) && <ComponentCardLoadingAnimation isLight={isLight} />}

      {/* 2. When in view, mount the calibrated 3D Three.js canvas */}
      {inView && (
        <Canvas
          camera={{ position: [6, 4.5, 7.5], fov: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          dpr={[1, 1.2]}
          onCreated={() => setIsLoaded(true)}
          className="w-full h-full"
        >
          <ambientLight intensity={isLight ? 1.2 : 0.9} />
          <directionalLight position={[6, 12, 6]} intensity={isLight ? 2.2 : 1.8} color="#FF7A59" />
          <directionalLight position={[-6, -6, -6]} intensity={0.7} color="#9333EA" />
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={2.2}
            enablePan={false}
          />
          <Suspense fallback={null}>
            <ModelThumbnail component={component} />
          </Suspense>
        </Canvas>
      )}

      {/* Top Badge: Package Code */}
      <div
        className={cn(
          'absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full backdrop-blur-md border text-[10px] font-mono font-semibold z-10 pointer-events-none',
          isLight
            ? 'bg-white/90 border-slate-200 text-[#E05332] shadow-sm'
            : 'bg-[#181420]/80 border-white/[0.08] text-[#F06543]'
        )}
      >
        {component.package.standardCode}
      </div>

      {/* 360° Orbit Indicator */}
      <div
        className={cn(
          'absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full backdrop-blur-md border text-[9px] font-mono z-10 pointer-events-none',
          isLight
            ? 'bg-white/90 border-slate-200 text-slate-500 shadow-sm'
            : 'bg-[#100F17]/70 border-white/[0.06] text-[#8E8899]'
        )}
      >
        360° Live
      </div>
    </div>
  );
}

export function Component3DMatrix() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [transitioningId, setTransitioningId] = useState<string | null>(null);

  const {
    setSelectedComponent,
    setActiveEnvironment,
    setCutawayActive,
    setExplodePercent,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';

  const categories = [
    { id: 'all', label: 'All Components' },
    { id: 'semiconductor', label: 'Semiconductors' },
    { id: 'passive', label: 'Passives' },
    { id: 'integrated_circuit', label: 'ICs & Logic' },
    { id: 'optoelectronics', label: 'Optoelectronics' },
    { id: 'electromechanical', label: 'Switches & Sensors' },
    { id: 'power_management', label: 'Power & Sources' },
  ];

  const filtered = useMemo(() => {
    return MOCK_COMPONENTS.filter((comp) => {
      if (selectedCat !== 'all') {
        if (selectedCat === 'semiconductor') {
          if (comp.category !== 'discrete_semiconductor') return false;
        } else if (selectedCat === 'electromechanical') {
          if (comp.category !== 'electromechanical' && comp.category !== 'sensor') return false;
        } else if (comp.category !== selectedCat) {
          return false;
        }
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.slug.toLowerCase().includes(q) ||
          comp.package.standardCode.toLowerCase().includes(q) ||
          comp.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCat, search]);

  const handleOpenCutaway = (comp: ComponentItem) => {
    setTransitioningId(comp.id);
    setSelectedComponent(comp);
    setCutawayActive(true);
    setExplodePercent(0);

    // Smooth transition into physical architecture cutaway
    setTimeout(() => {
      setActiveEnvironment('internal_cutaway');
      if (typeof window !== 'undefined') {
        window.history.pushState({ env: 'internal_cutaway' }, '', '/workspace/internal_cutaway');
      }
    }, 350);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex-1 flex flex-col h-full overflow-hidden select-none relative transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#0A090D] text-white'
      )}
    >
      {/* 1. Header & Filters Bar */}
      <div
        className={cn(
          'relative z-30 p-4 sm:p-6 border-b backdrop-blur-xl shrink-0 space-y-4 transition-colors',
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
            : 'bg-[#0E0D14]/90 border-white/[0.06] text-white'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F06543] animate-pulse" />
              <h1
                className={cn(
                  'text-lg font-normal tracking-tight font-sans',
                  isLight ? 'text-slate-900' : 'text-white'
                )}
              >
                3D Spatial Component Matrix
              </h1>
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-mono border',
                  isLight
                    ? 'bg-slate-100 text-[#E05332] border-slate-200'
                    : 'bg-[#1C1A24] text-[#F06543] border-white/[0.08]'
                )}
              >
                {filtered.length} Live Parts
              </span>
            </div>
            <p
              className={cn(
                'text-xs font-sans mt-0.5',
                isLight ? 'text-slate-500' : 'text-[#8E8899]'
              )}
            >
              Interactive real-time 3D motion models. Click any component to open full sub-surface layer architecture & cutaway.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5',
                isLight ? 'text-slate-400' : 'text-[#8E8899]'
              )}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search components or packages..."
              className={cn(
                'w-full pl-9 pr-3 py-1.5 rounded-full border text-xs outline-none transition-all',
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#F06543] focus:bg-white'
                  : 'bg-[#14121A] border-white/[0.08] focus:border-[#F06543]/50 text-white placeholder-[#6B6675]'
              )}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-200 border',
                  isActive
                    ? 'bg-[#F06543] text-white border-[#F06543] font-semibold shadow-[0_0_12px_rgba(240,101,67,0.4)]'
                    : isLight
                    ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-200/70'
                    : 'bg-[#14121A] text-[#8E8899] hover:text-white border-white/[0.06] hover:bg-white/[0.04]'
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Scrollable 3D Motion Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((comp) => {
            const isSelected = transitioningId === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => handleOpenCutaway(comp)}
                className={cn(
                  'group relative rounded-2xl border p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1',
                  isLight
                    ? 'bg-white border-slate-200/90 hover:border-[#F06543]/60 text-slate-800 shadow-md hover:shadow-xl'
                    : 'bg-[#121019] border-white/[0.06] hover:border-[#F06543]/50 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(240,101,67,0.18)]',
                  isSelected && 'scale-95 border-[#F06543] shadow-[0_0_25px_rgba(240,101,67,0.5)]'
                )}
              >
                {/* 3D Motion Live Canvas Thumbnail (Lazy IntersectionObserver 3D with Instant Vector Fallback) */}
                <ComponentCardThumbnail component={comp} isLight={isLight} />

                {/* Details Section */}
                <div className="pt-3 pb-1 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h2
                        className={cn(
                          'text-xs font-semibold group-hover:text-[#F06543] transition-colors truncate',
                          isLight ? 'text-slate-900' : 'text-white'
                        )}
                      >
                        {comp.name}
                      </h2>
                      <span
                        className={cn(
                          'text-[10px] font-mono shrink-0 capitalize',
                          isLight ? 'text-slate-500' : 'text-[#8E8899]'
                        )}
                      >
                        {comp.category}
                      </span>
                    </div>

                    <p
                      className={cn(
                        'text-[11px] line-clamp-2 mt-0.5 font-sans leading-relaxed',
                        isLight ? 'text-slate-600' : 'text-[#8E8899]'
                      )}
                    >
                      {comp.educational.summary}
                    </p>
                  </div>

                  {/* Footer Action Button */}
                  <div
                    className={cn(
                      'pt-2.5 border-t flex items-center justify-between',
                      isLight ? 'border-slate-100' : 'border-white/[0.05]'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px] font-mono',
                        isLight ? 'text-slate-400' : 'text-[#6B6675]'
                      )}
                    >
                      {comp.package.pins.length} Pins • Sub-surface
                    </span>

                    <button
                      type="button"
                      className="flex items-center gap-1 text-[11px] font-sans font-medium text-[#F06543] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Architecture</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
