'use client';

import React, { useState } from 'react';
import { useCircuitStore } from '@/lib/circuit/circuit-store';
import { CircuitComponentKind, CircuitElementInstance } from '@/lib/circuit/types';
import { CIRCUIT_PRESETS } from '@/lib/circuit/circuit-presets';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Box,
  Zap,
  Battery,
  Flame,
  Download,
  Upload,
  RotateCcw,
  BookOpen,
  Sliders,
  ToggleLeft,
  ChevronRight,
  Info,
  Search,
  Star,
  Eye,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/lib/store';

export interface ComponentLibraryPanelProps {
  embedded?: boolean;
  onClose?: () => void;
}

export function ComponentLibraryPanel({ embedded = false, onClose }: ComponentLibraryPanelProps) {
  const { addComponent, loadPreset, activePresetId, exportProjectJson, importProjectJson, components } =
    useCircuitStore();
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  const [activeTab, setActiveTab] = useState<'library' | 'presets' | 'project'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'passive' | 'semi' | 'source' | 'control'>('all');
  const [expandedPinoutId, setExpandedPinoutId] = useState<string | null>(null);
  const [starredKinds, setStarredKinds] = useState<Record<string, boolean>>({});

  const toggleStar = (kind: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredKinds((prev) => ({ ...prev, [kind]: !prev[kind] }));
  };

  // Comprehensive Component templates with accurately arranged pins
  const componentTemplates: Array<{
    kind: CircuitComponentKind;
    title: string;
    description: string;
    category: 'passive' | 'semi' | 'source' | 'control';
    icon: any;
    pinoutSummary: string;
    createInstance: () => CircuitElementInstance;
  }> = [
    {
      kind: 'dc_source',
      title: 'DC Power Source (9V)',
      description: '9V DC Battery / Bench Supply',
      category: 'source',
      icon: Battery,
      pinoutSummary: 'Pin 1: +9V (Red) • Pin 2: GND (Black)',
      createInstance: () => ({
        id: `bat_${Date.now()}`,
        kind: 'dc_source',
        name: '9V DC Supply',
        position: [-30, 0, Math.round((Math.random() - 0.5) * 20)],
        rotation: [0, 0, 0],
        parameters: { voltageVolts: 9.0 },
        pins: [
          { pinId: 'pos', name: '+ (Positive)', pinNumber: 1, type: 'power', offsetMm: [0, 5, -8] },
          { pinId: 'neg', name: '- (Negative)', pinNumber: 2, type: 'ground', offsetMm: [0, 5, 8] },
        ],
      }),
    },
    {
      kind: 'ground',
      title: 'Ground Reference (0V)',
      description: 'Earth Ground chassis reference',
      category: 'source',
      icon: Zap,
      pinoutSummary: 'Pin 1: Solid 0V reference lug',
      createInstance: () => ({
        id: `gnd_${Date.now()}`,
        kind: 'ground',
        name: 'GND (0V)',
        position: [-30, 0, 20],
        rotation: [0, 0, 0],
        parameters: {},
        pins: [{ pinId: 'gnd', name: 'GND', pinNumber: 1, type: 'ground', offsetMm: [0, 0, 0] }],
      }),
    },
    {
      kind: 'resistor',
      title: 'Axial Resistor (1 kΩ)',
      description: '0.25W Metal Film E12 Resistor',
      category: 'passive',
      icon: Box,
      pinoutSummary: 'Pin 1: Terminal A (-10mm) • Pin 2: Terminal B (+10mm)',
      createInstance: () => ({
        id: `res_${Date.now()}`,
        kind: 'resistor',
        name: `R (${components.filter((c) => c.kind === 'resistor').length + 1})`,
        position: [Math.round((Math.random() - 0.5) * 30), 0, Math.round((Math.random() - 0.5) * 20)],
        rotation: [0, 0, 0],
        parameters: { resistanceOhms: 1000 },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-10, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [10, 0, 0] },
        ],
      }),
    },
    {
      kind: 'capacitor',
      title: 'Electrolytic Capacitor (100 µF)',
      description: 'Polarized Radial Can with Rubber Bung',
      category: 'passive',
      icon: Box,
      pinoutSummary: 'Pin 1: Anode (+) Long • Pin 2: Cathode (-) Stripe',
      createInstance: () => ({
        id: `cap_${Date.now()}`,
        kind: 'capacitor',
        name: `C (${components.filter((c) => c.kind === 'capacitor').length + 1})`,
        position: [Math.round((Math.random() - 0.5) * 30), 0, Math.round((Math.random() - 0.5) * 20)],
        rotation: [0, 0, 0],
        parameters: { capacitanceFarads: 0.0001 },
        pins: [
          { pinId: 'pos', name: 'Anode (+)', pinNumber: 1, type: 'passive', offsetMm: [-2.54, 0, 0] },
          { pinId: 'neg', name: 'Cathode (-)', pinNumber: 2, type: 'passive', offsetMm: [2.54, 0, 0] },
        ],
      }),
    },
    {
      kind: 'led',
      title: '5mm Optic Red LED',
      description: '1.85V AlGaAs Photon Emitter',
      category: 'semi',
      icon: Flame,
      pinoutSummary: 'Pin 1: Anode (+) Long • Pin 2: Cathode (-) Flat rim',
      createInstance: () => ({
        id: `led_${Date.now()}`,
        kind: 'led',
        name: `LED (${components.filter((c) => c.kind === 'led').length + 1})`,
        position: [Math.round((Math.random() - 0.5) * 30), 0, Math.round((Math.random() - 0.5) * 20)],
        rotation: [0, 0, 0],
        parameters: { forwardVoltageV: 1.85, ledColor: 'red' },
        pins: [
          { pinId: 'anode', name: 'Anode (+)', pinNumber: 1, type: 'anode', offsetMm: [-1.27, 0, 0] },
          { pinId: 'cathode', name: 'Cathode (-)', pinNumber: 2, type: 'cathode', offsetMm: [1.27, 0, 0] },
        ],
      }),
    },
    {
      kind: 'diode',
      title: '1N4148 Fast Silicon Diode',
      description: 'DO-35 Glass Switching Diode (0.65V knee)',
      category: 'semi',
      icon: Zap,
      pinoutSummary: 'Pin 1: Anode (+) • Pin 2: Cathode (-) Black band',
      createInstance: () => ({
        id: `dio_${Date.now()}`,
        kind: 'diode',
        name: `D (${components.filter((c) => c.kind === 'diode').length + 1})`,
        position: [Math.round((Math.random() - 0.5) * 30), 0, Math.round((Math.random() - 0.5) * 20)],
        rotation: [0, 0, 0],
        parameters: { forwardVoltageV: 0.65 },
        pins: [
          { pinId: 'anode', name: 'Anode (+)', pinNumber: 1, type: 'anode', offsetMm: [-10, 0, 0] },
          { pinId: 'cathode', name: 'Cathode (-)', pinNumber: 2, type: 'cathode', offsetMm: [10, 0, 0] },
        ],
      }),
    },
    {
      kind: 'transistor_npn',
      title: '2N3904 NPN BJT',
      description: 'TO-92 Small-Signal Transistor (E-B-C)',
      category: 'semi',
      icon: Sliders,
      pinoutSummary: 'Pin 1: Emitter (-2.54mm) • Pin 2: Base (Center) • Pin 3: Collector (+2.54mm)',
      createInstance: () => ({
        id: `q_bjt_${Date.now()}`,
        kind: 'transistor_npn',
        name: `Q (NPN BJT)`,
        position: [Math.round((Math.random() - 0.5) * 30), 0, Math.round((Math.random() - 0.5) * 20)],
        rotation: [0, 0, 0],
        parameters: { beta: 150 },
        pins: [
          { pinId: 'emitter', name: 'Emitter (Pin 1)', pinNumber: 1, type: 'passive', offsetMm: [-2.54, 0, 0] },
          { pinId: 'base', name: 'Base (Pin 2)', pinNumber: 2, type: 'passive', offsetMm: [0, 0, 0] },
          { pinId: 'collector', name: 'Collector (Pin 3)', pinNumber: 3, type: 'passive', offsetMm: [2.54, 0, 0] },
        ],
      }),
    },
    {
      kind: 'transistor_mosfet',
      title: '2N7000 N-Channel MOSFET',
      description: 'TO-92 High-Speed Logic FET (S-G-D)',
      category: 'semi',
      icon: Sliders,
      pinoutSummary: 'Pin 1: Source (-2.54mm) • Pin 2: Gate (Center) • Pin 3: Drain (+2.54mm)',
      createInstance: () => ({
        id: `q_fet_${Date.now()}`,
        kind: 'transistor_mosfet',
        name: `Q (N-MOSFET)`,
        position: [Math.round((Math.random() - 0.5) * 30), 0, Math.round((Math.random() - 0.5) * 20)],
        rotation: [0, 0, 0],
        parameters: { vThreshold: 2.1 },
        pins: [
          { pinId: 'source', name: 'Source (Pin 1)', pinNumber: 1, type: 'passive', offsetMm: [-2.54, 0, 0] },
          { pinId: 'gate', name: 'Gate (Pin 2)', pinNumber: 2, type: 'passive', offsetMm: [0, 0, 0] },
          { pinId: 'drain', name: 'Drain (Pin 3)', pinNumber: 3, type: 'passive', offsetMm: [2.54, 0, 0] },
        ],
      }),
    },
    {
      kind: 'pushbutton',
      title: 'Tactile Pushbutton Switch',
      description: 'Normally Open momentary contact',
      category: 'control',
      icon: ToggleLeft,
      pinoutSummary: 'Terminal 1: Left contact • Terminal 2: Right contact',
      createInstance: () => ({
        id: `btn_${Date.now()}`,
        kind: 'pushbutton',
        name: `SW (Button)`,
        position: [Math.round((Math.random() - 0.5) * 30), 0, Math.round((Math.random() - 0.5) * 20)],
        rotation: [0, 0, 0],
        parameters: { switchClosed: false },
        pins: [
          { pinId: 'p1', name: 'Pin 1', pinNumber: 1, type: 'passive', offsetMm: [-6, 0, 0] },
          { pinId: 'p2', name: 'Pin 2', pinNumber: 2, type: 'passive', offsetMm: [6, 0, 0] },
        ],
      }),
    },
  ];

  // Filter templates by search and category
  const filteredTemplates = componentTemplates.filter((t) => {
    const matchesSearch =
      searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = () => {
    const json = exportProjectJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3d-lab-circuit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importProjectJson(content);
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'library', label: 'Components' },
    { id: 'presets', label: 'Experiments' },
    { id: 'project', label: 'Project' },
  ];

  return (
    <div
      className={cn(
        'h-full flex flex-col shrink-0 select-none font-mono text-xs',
        isLight ? 'text-slate-800' : 'text-slate-100',
        embedded ? 'w-full bg-transparent' : isLight ? 'w-80 border-r border-slate-200 bg-white z-10' : 'w-80 border-r border-[#30363D] bg-[#101318] z-10'
      )}
    >
      {/* Catalog Header when embedded */}
      {embedded && (
        <div
          className={cn(
            'px-3.5 py-2.5 border-b flex items-center justify-between shrink-0 transition-colors',
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/70 border-white/[0.08]'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F06543]/15 text-[#F06543] border border-[#F06543]/20">
              <Box className="w-4 h-4" />
            </div>
            <span
              className={cn(
                'text-xs font-bold tracking-tight',
                isLight ? 'text-slate-800' : 'text-[#F0F6FC]'
              )}
            >
              Prototyping Parts
            </span>
            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold',
                isLight
                  ? 'bg-slate-200/80 text-[#E05332] border-slate-300'
                  : 'bg-white/[0.06] text-[#F06543] border-white/[0.08]'
              )}
            >
              {componentTemplates.length}
            </span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'p-1.5 rounded-lg transition-colors cursor-pointer',
                isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/70'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-white/[0.08]'
              )}
              title="Close Catalog"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Top Tabs */}
      <div
        className={cn(
          'px-3 pt-2.5 border-b',
          isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#161B22]/40 border-white/[0.08]'
        )}
      >
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as any)}
          variant="underline"
          size="sm"
        />
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {/* TAB 1: COMPONENT LIBRARY */}
        {activeTab === 'library' && (
          <div className="space-y-2.5">
            {/* Search Input Bar */}
            <div className="relative">
              <Search
                className={cn(
                  'w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2',
                  isLight ? 'text-slate-400' : 'text-slate-500'
                )}
              />
              <input
                type="text"
                placeholder="Search components or pins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none transition-colors border',
                  isLight
                    ? 'bg-white border-slate-300 text-slate-800 focus:border-cyan-600 placeholder:text-slate-400'
                    : 'bg-[#161B22] border-[#21262D] text-slate-200 focus:border-cyan-500'
                )}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'passive', label: 'Passives' },
                { id: 'semi', label: 'Semis' },
                { id: 'source', label: 'Power' },
                { id: 'control', label: 'Switches' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-mono transition-colors border',
                    categoryFilter === cat.id
                      ? isLight
                        ? 'bg-cyan-100 text-cyan-800 border-cyan-400 font-bold'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                      : isLight
                      ? 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                      : 'bg-[#161B22] text-slate-400 border-[#21262D] hover:text-white'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Template List */}
            <div className="space-y-2 pt-1">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                const isExpanded = expandedPinoutId === template.kind;
                const isStarred = starredKinds[template.kind];

                return (
                  <div
                    key={template.kind}
                    className={cn(
                      'p-2.5 rounded-xl border transition-all group',
                      isLight
                        ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-cyan-500 shadow-sm'
                        : 'bg-[#161B22] border-[#21262D] hover:border-[#388bfd] hover:bg-[#1a202c]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        onClick={() => addComponent(template.createInstance())}
                        className="flex items-center gap-2.5 truncate cursor-pointer flex-1"
                        title="Click to place on breadboard"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#21262D] flex items-center justify-center text-[#58A6FF] shrink-0 group-hover:bg-[#388bfd]/20">
                          <Icon className="w-4 h-4 text-current" />
                        </div>
                        <div className="truncate">
                          <span className={cn('font-semibold block truncate', isLight ? 'text-slate-800' : 'text-[#F0F6FC]')}>
                            {template.title}
                          </span>
                          <span className={cn('text-[10px] block truncate', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>
                            {template.description}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Functions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => toggleStar(template.kind, e)}
                          className={`p-1 rounded hover:bg-slate-800 ${
                            isStarred ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Star component"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedPinoutId(isExpanded ? null : template.kind)}
                          className="p-1 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800"
                          title="Toggle pinout info"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => addComponent(template.createInstance())}
                          className="p-1 rounded text-slate-400 hover:text-white bg-slate-800 hover:bg-cyan-600 transition-colors"
                          title="Place on Canvas"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Pinout & Wiring Guide */}
                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono space-y-1 bg-slate-950/60 p-2 rounded-lg">
                        <div className="text-cyan-400 font-bold uppercase tracking-wider">
                          Physical Pinout & Spacing:
                        </div>
                        <div>{template.pinoutSummary}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SUPPORTED EXPERIMENTS PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-2.5">
            <span className="text-[10px] text-[#6E7681] uppercase block">Phase 4 Initial Experiments</span>
            {CIRCUIT_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => loadPreset(preset.id)}
                  className={cn(
                    'p-3 rounded-xl border transition-all cursor-pointer space-y-1.5',
                    isActive
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-glowCyan'
                      : 'bg-[#161B22] border-[#21262D] hover:border-[#30363D] text-[#F0F6FC]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{preset.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-current" />
                  </div>
                  <p className="text-[10px] text-[#8B949E] leading-relaxed">
                    {preset.description}
                  </p>
                  <div className="pt-1 border-t border-[#21262D] flex items-center gap-1 text-[9px] text-cyan-400">
                    <Info className="w-3 h-3 shrink-0" />
                    <span className="truncate">{preset.learningGoal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: PROJECT SAVE / LOAD / EXPORT */}
        {activeTab === 'project' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#161B22] border border-[#21262D] space-y-2">
              <span className="font-semibold text-[#F0F6FC] block">Export Circuit Project</span>
              <p className="text-[10px] text-[#8B949E]">
                Download your current 3D breadboard wiring, component positions, and parameters to a <code className="text-cyan-400">.3dlab.json</code> project file.
              </p>
              <Button
                variant="primary"
                size="xs"
                leftIcon={<Download className="w-3 h-3" />}
                onClick={handleDownload}
                className="w-full"
              >
                Download Project (.json)
              </Button>
            </div>

            <div className="p-3 rounded-xl bg-[#161B22] border border-[#21262D] space-y-2">
              <span className="font-semibold text-[#F0F6FC] block">Import Project File</span>
              <p className="text-[10px] text-[#8B949E]">
                Load an existing 3D Lab circuit file into the workspace.
              </p>
              <label className="block">
                <span className="sr-only">Choose project JSON file</span>
                <input
                  type="file"
                  accept=".json,.3dlab"
                  onChange={handleUpload}
                  className="block w-full text-xs text-[#8B949E] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#21262D] file:text-[#F0F6FC] hover:file:bg-[#30363D] cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
