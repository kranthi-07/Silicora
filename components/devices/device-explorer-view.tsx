'use client';

import React, { useState } from 'react';
import { DEVICES_DATA } from '@/data/devices-data';
import { DeviceItem, DeviceSubsystem, DeviceComponentPart } from '@/types/device';
import { DeviceCanvas } from './device-canvas';
import { DeviceBlockDiagram } from './device-block-diagram';
import { DeviceCadBlueprint } from './device-cad-blueprint';
import { DeviceInspectorPanel } from './device-inspector-panel';
import { useDeviceStore } from '@/lib/devices/device-store';
import { useWorkspaceStore } from '@/lib/store';
import {
  Box,
  Layers,
  Network,
  BookOpen,
  Compass,
  Smartphone,
  BatteryCharging,
  Laptop,
  Refrigerator,
  Flame,
  Tv,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DeviceExplorerView() {
  const {
    selectedDeviceId,
    setSelectedDeviceId,
    viewMode,
    setViewMode,
    explodePercent,
    setExplodePercent,
    selectedSubsystemId,
    setSelectedSubsystemId,
    selectedPartId,
    setSelectedPartId,
    selectSubsystem,
    selectPart,
  } = useDeviceStore();

  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  const activeDevice = DEVICES_DATA.find((d) => d.id === selectedDeviceId) || DEVICES_DATA[0];

  const selectedSubsystem =
    activeDevice.subsystems.find((s) => s.id === selectedSubsystemId) || null;

  const selectedPart =
    (selectedSubsystem?.components.find((c) => c.id === selectedPartId) ||
      activeDevice.subsystems
        .flatMap((s) => s.components)
        .find((c) => c.id === selectedPartId)) ||
    null;

  const handleSelectSubsystem = (sub: DeviceSubsystem) => {
    selectSubsystem(sub);
  };

  const handleSelectPart = (part: DeviceComponentPart) => {
    selectPart(part);
  };

  const getDeviceIcon = (id: string) => {
    switch (id) {
      case 'device_smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'device_powerbank':
        return <BatteryCharging className="w-4 h-4" />;
      case 'device_laptop':
        return <Laptop className="w-4 h-4" />;
      case 'device_refrigerator':
        return <Refrigerator className="w-4 h-4" />;
      case 'device_washingmachine':
        return <Flame className="w-4 h-4" />;
      case 'device_television':
      default:
        return <Tv className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={cn(
        'flex-1 flex flex-col h-full select-none overflow-hidden transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#090B0E] text-slate-100'
      )}
    >
      {/* 1. Device Selection & Sub-Header */}
      <div
        className={cn(
          'px-5 py-2.5 border-b flex items-center justify-between shrink-0 z-20 transition-colors',
          isLight ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm' : 'bg-[#101318] border-[#21262D]'
        )}
      >
        {/* Device Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] uppercase font-mono text-[#6E7681] hidden sm:inline mr-1">
            Device:
          </span>
          {DEVICES_DATA.map((device) => {
            const isSelected = device.id === activeDevice.id;
            return (
              <button
                key={device.id}
                type="button"
                onClick={() => {
                  setSelectedDeviceId(device.id);
                  setSelectedSubsystemId(null);
                  setSelectedPartId(null);
                }}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0',
                  isSelected
                    ? 'bg-[#21262D] text-[#F0F6FC] border border-[#58A6FF]/60 shadow-sm font-semibold'
                    : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22] border border-transparent'
                )}
              >
                <span className={isSelected ? 'text-[#58A6FF]' : 'text-[#6E7681]'}>
                  {getDeviceIcon(device.id)}
                </span>
                <span>{device.name}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: 3D Stage vs Block Diagram vs Principles */}
        <div className="flex items-center gap-1.5 bg-[#161B22] p-1 rounded-lg border border-[#30363D] shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5',
              viewMode === '3d'
                ? 'bg-[#21262D] text-[#58A6FF] font-bold shadow-sm'
                : 'text-[#8B949E] hover:text-[#F0F6FC]'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">3D Exploded</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('blueprint')}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5',
              viewMode === 'blueprint'
                ? 'bg-[#00e5ff] text-[#040c16] font-bold shadow-[0_0_12px_#00e5ff]'
                : 'text-[#00e5ff]/80 hover:text-white'
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CAD Blueprint</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('block_diagram')}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5',
              viewMode === 'block_diagram'
                ? 'bg-[#21262D] text-[#58A6FF] font-bold shadow-sm'
                : 'text-[#8B949E] hover:text-[#F0F6FC]'
            )}
          >
            <Network className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Block Diagram</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('principles')}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5',
              viewMode === 'principles'
                ? 'bg-[#21262D] text-[#58A6FF] font-bold shadow-sm'
                : 'text-[#8B949E] hover:text-[#F0F6FC]'
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Physics & Principles</span>
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Body: Viewport + Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* VIEW 1: 3D EXPLODED CANVAS */}
        {viewMode === '3d' && (
          <div className="flex-1 h-full relative">
            <DeviceCanvas
              device={activeDevice}
              explodePercent={explodePercent}
              onExplodeChange={setExplodePercent}
              selectedSubsystemId={selectedSubsystemId}
              selectedPartId={selectedPartId}
              onSelectPart={handleSelectPart}
              onSelectSubsystem={handleSelectSubsystem}
            />
          </div>
        )}

        {/* VIEW 2: CAD SCHEMATIC BLUEPRINT */}
        {viewMode === 'blueprint' && (
          <div className="flex-1 h-full overflow-hidden">
            <DeviceCadBlueprint
              device={activeDevice}
              selectedSubsystemId={selectedSubsystemId}
              selectedPartId={selectedPartId}
              onSelectPart={handleSelectPart}
              onSelectSubsystem={handleSelectSubsystem}
            />
          </div>
        )}

        {/* VIEW 2: FUNCTIONAL BLOCK DIAGRAM */}
        {viewMode === 'block_diagram' && (
          <div className="flex-1 h-full overflow-hidden">
            <DeviceBlockDiagram
              device={activeDevice}
              selectedSubsystemId={selectedSubsystemId}
              onSelectSubsystemId={(subId) => {
                setSelectedSubsystemId(subId);
                const sub = activeDevice.subsystems.find((s) => s.id === subId);
                if (sub && sub.components.length > 0) {
                  setSelectedPartId(sub.components[0].id);
                }
              }}
            />
          </div>
        )}

        {/* VIEW 3: WORKING PRINCIPLES & PHYSICS DOSSIER */}
        {viewMode === 'principles' && (
          <div
            className={cn(
              'flex-1 h-full overflow-y-auto p-8 custom-scrollbar transition-colors',
              isLight ? 'bg-[#F8FAFC]' : 'bg-[#090B0E]'
            )}
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <div
                className={cn(
                  'p-6 rounded-2xl border space-y-3 transition-colors shadow-sm',
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-[#161B22] border-[#30363D] text-[#F0F6FC]'
                )}
              >
                <span className="text-xs font-mono uppercase text-[#58A6FF] font-semibold">
                  System Architecture & Operating Principle
                </span>
                <h2
                  className={cn(
                    'text-lg font-bold',
                    isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
                  )}
                >
                  {activeDevice.name}
                </h2>
                <p
                  className={cn(
                    'text-sm leading-relaxed',
                    isLight ? 'text-slate-600' : 'text-[#C9D1D9]'
                  )}
                >
                  {activeDevice.workingPrinciples}
                </p>
              </div>

              <div
                className={cn(
                  'p-6 rounded-2xl border space-y-3 transition-colors shadow-sm',
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-[#161B22] border-[#30363D] text-[#F0F6FC]'
                )}
              >
                <span className="text-xs font-mono uppercase text-emerald-500 font-semibold">
                  Documented Industrial Facts
                </span>
                <ul
                  className={cn(
                    'space-y-3 text-xs',
                    isLight ? 'text-slate-600' : 'text-[#8B949E]'
                  )}
                >
                  {activeDevice.documentedEngineeringFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-500 font-mono font-bold">#{idx + 1}</span>
                      <span
                        className={cn(
                          'leading-relaxed',
                          isLight ? 'text-slate-700' : 'text-[#C9D1D9]'
                        )}
                      >
                        {fact}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Right Inspector Panel */}
        <DeviceInspectorPanel
          device={activeDevice}
          selectedSubsystem={selectedSubsystem}
          selectedPart={selectedPart}
          onSelectSubsystem={handleSelectSubsystem}
          onSelectPart={handleSelectPart}
        />
      </div>
    </div>
  );
}
