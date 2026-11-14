'use client';

import React from 'react';
import { DeviceItem, DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import { useWorkspaceStore } from '@/lib/store';
import { MOCK_COMPONENTS } from '@/data/mock-components';
import {
  Cpu,
  Layers,
  Zap,
  Radio,
  FileCheck2,
  ExternalLink,
  Info,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComponentWorkingBlueprint } from './component-working-blueprint';

interface DeviceInspectorPanelProps {
  device: DeviceItem;
  selectedSubsystem: DeviceSubsystem | null;
  selectedPart: DeviceComponentPart | null;
  onSelectSubsystem: (subsystem: DeviceSubsystem) => void;
  onSelectPart: (part: DeviceComponentPart) => void;
}

export function DeviceInspectorPanel({
  device,
  selectedSubsystem,
  selectedPart,
  onSelectSubsystem,
  onSelectPart,
}: DeviceInspectorPanelProps) {
  const { setActiveEnvironment, setSelectedComponent } = useWorkspaceStore();

  const handleOpenCatalogPart = (catalogId: string) => {
    const comp = MOCK_COMPONENTS.find((c) => c.id === catalogId);
    if (comp) {
      setSelectedComponent(comp);
      setActiveEnvironment('component_explorer');
    }
  };

  return (
    <aside className="w-96 h-full border-l border-[#30363D] bg-[#101318] flex flex-col shrink-0 select-none overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#21262D] bg-[#161B22]/60 shrink-0">
        <div className="flex items-center justify-between">
          <Badge variant="accent" size="xs">
            {device.category.toUpperCase()}
          </Badge>
          <span className="text-[10px] font-mono text-[#8B949E]">{device.modelYear}</span>
        </div>
        <h2 className="text-sm font-bold text-[#F0F6FC] tracking-tight mt-1 truncate">
          {device.name}
        </h2>
        <p className="text-[11px] text-[#8B949E] mt-0.5 line-clamp-2">
          {device.tagline}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* 1. Selected Part Inspection Card */}
        {selectedPart ? (
          <div className="p-4 rounded-xl bg-[#161B22] border border-[#58A6FF]/40 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#58A6FF] font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Active Component Part {selectedPart.calloutNumber ? `(#${selectedPart.calloutNumber})` : ''}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#21262D] text-[#F0F6FC]">
                {selectedPart.packageType}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#F0F6FC]">{selectedPart.name}</h4>
              <p className="text-xs text-[#8B949E] mt-1">{selectedPart.functionalRole}</p>
            </div>

            {/* Real Component Photograph, Silicon Die & Working Blueprint Engine */}
            <ComponentWorkingBlueprint
              part={selectedPart}
              onOpenCatalogPart={handleOpenCatalogPart}
            />

            {/* Part Specs Matrix */}
            <div className="bg-[#101318] rounded-lg p-2.5 border border-[#21262D] space-y-1.5 font-mono text-[11px]">
              <span className="text-[9px] uppercase tracking-wider text-[#6E7681] block font-bold">
                ELECTRICAL & SILICON PARAMETERS
              </span>
              {Object.entries(selectedPart.keySpecs).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-[#6E7681]">{key}:</span>
                  <span className="text-[#F0F6FC] font-semibold">{val}</span>
                </div>
              ))}
            </div>

            {/* Link to Component Explorer Catalog */}
            {selectedPart.relatedCatalogComponentId && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs flex items-center justify-center gap-1.5 text-[#58A6FF] border-[#58A6FF]/30 hover:bg-[#58A6FF]/10"
                onClick={() => handleOpenCatalogPart(selectedPart.relatedCatalogComponentId!)}
              >
                <span>Inspect in Component Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#161B22]/50 border border-[#21262D] space-y-3">
            <div className="text-center text-xs text-[#8B949E]">
              <Info className="w-5 h-5 text-[#58A6FF] mx-auto mb-1.5" />
              <span>Click any physical component or blueprint node to inspect real images and operational mechanics.</span>
            </div>

            {/* Quick Component Selection Shortcuts */}
            <div className="space-y-1.5 pt-2 border-t border-[#21262D]">
              <span className="text-[10px] font-mono uppercase text-[#6E7681] block">
                Quick Component Inspector
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {device.subsystems.flatMap((s) => s.components).slice(0, 6).map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => onSelectPart(part)}
                    className="p-1.5 rounded bg-[#101318] hover:bg-[#21262D] border border-[#21262D] text-left text-[10px] text-[#C9D1D9] truncate transition-colors flex items-center gap-1"
                  >
                    <span className="text-[#58A6FF] font-mono font-bold">#{part.calloutNumber || '•'}</span>
                    <span className="truncate">{part.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Subsystems Directory */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-[#F0F6FC] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#58A6FF]" />
            Subsystem Assemblies ({device.subsystems.length})
          </h4>
          <div className="space-y-1.5">
            {device.subsystems.map((sub) => {
              const isSelected = selectedSubsystem?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSelectSubsystem(sub)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#21262D] border-[#58A6FF] text-[#F0F6FC]'
                      : 'bg-[#161B22] border-[#21262D] text-[#8B949E] hover:border-[#30363D] hover:text-[#F0F6FC]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: sub.color }}
                    />
                    <span className="font-medium truncate">{sub.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#6E7681] shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Documented Engineering Facts (Distinguishing facts from illustrative models) */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-[#F0F6FC] uppercase tracking-wider font-mono">
              Documented Engineering Facts
            </h4>
          </div>
          <p className="text-[10px] text-[#6E7681]">
            Verified industry manufacturing specifications, standards, and packaging limits.
          </p>
          <div className="space-y-2">
            {device.documentedEngineeringFacts.map((fact, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#161B22] border border-[#21262D] text-xs text-[#C9D1D9] leading-relaxed flex items-start gap-2"
              >
                <span className="text-emerald-400 font-mono text-[11px] shrink-0 font-bold mt-0.5">
                  #{idx + 1}
                </span>
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Power Rails & Voltage Distribution */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-[#F0F6FC] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Power Rail Architecture
          </h4>
          <div className="space-y-2 font-mono text-xs">
            {device.powerRails.map((rail, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#161B22] border border-[#21262D] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#F0F6FC] font-bold">{rail.name}</span>
                  <span className="text-amber-400 font-semibold">{rail.nominalVoltageV} V / {rail.maxCurrentA} A</span>
                </div>
                <div className="text-[10px] text-[#8B949E] font-sans">{rail.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
