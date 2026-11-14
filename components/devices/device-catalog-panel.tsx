'use client';

import React, { useState, useMemo } from 'react';
import { DEVICES_DATA } from '@/data/devices-data';
import { DeviceItem, DeviceSubsystem } from '@/types/device';
import { useDeviceStore } from '@/lib/devices/device-store';
import { useWorkspaceStore } from '@/lib/store';
import {
  Smartphone,
  BatteryCharging,
  Laptop,
  Refrigerator,
  Flame,
  Tv,
  Search,
  Box,
  Layers,
  ChevronRight,
  Hammer,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface DeviceCatalogPanelProps {
  onClose?: () => void;
}

export function DeviceCatalogPanel({ onClose }: DeviceCatalogPanelProps) {
  const {
    selectedDeviceId,
    setSelectedDeviceId,
    selectedSubsystemId,
    selectSubsystem,
  } = useDeviceStore();

  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  const [searchQuery, setSearchQuery] = useState('');

  const getDeviceIcon = (id: string) => {
    switch (id) {
      case 'device_smartphone':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'device_powerbank':
        return <BatteryCharging className="w-4 h-4 text-emerald-400" />;
      case 'device_laptop':
        return <Laptop className="w-4 h-4 text-purple-400" />;
      case 'device_refrigerator':
        return <Refrigerator className="w-4 h-4 text-blue-400" />;
      case 'device_washingmachine':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'device_television':
      default:
        return <Tv className="w-4 h-4 text-rose-400" />;
    }
  };

  const filteredDevices = useMemo(() => {
    if (!searchQuery.trim()) return DEVICES_DATA;
    const q = searchQuery.toLowerCase().trim();
    return DEVICES_DATA.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.subsystems.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div
      className={cn(
        'h-full flex flex-col shrink-0 select-none font-mono text-xs w-full bg-transparent',
        isLight ? 'text-slate-800' : 'text-[#F0F6FC]'
      )}
    >
      {/* Header Bar */}
      <div
        className={cn(
          'px-3.5 py-2.5 border-b flex items-center justify-between shrink-0 transition-colors',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/70 border-white/[0.08]'
        )}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#F06543]/15 text-[#F06543] border border-[#F06543]/20">
            <Hammer className="w-4 h-4" />
          </div>
          <span
            className={cn(
              'text-xs font-bold tracking-tight',
              isLight ? 'text-slate-800' : 'text-[#F0F6FC]'
            )}
          >
            Dissection Devices
          </span>
          <span
            className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold',
              isLight
                ? 'bg-slate-200/80 text-[#E05332] border-slate-300'
                : 'bg-white/[0.06] text-[#F06543] border-white/[0.08]'
            )}
          >
            {filteredDevices.length}
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
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div
        className={cn(
          'p-2.5 border-b shrink-0 transition-colors',
          isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#161B22]/40 border-white/[0.08]'
        )}
      >
        <Input
          placeholder="Search devices or modules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          hasClear
          onClear={() => setSearchQuery('')}
          leftIcon={
            <Search className={cn('w-3.5 h-3.5', isLight ? 'text-slate-400' : 'text-[#8B949E]')} />
          }
          className={cn(
            'font-mono text-xs rounded-xl h-8 py-1 transition-colors',
            isLight
              ? 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-[#F06543]'
              : 'bg-[#090B0E] border-white/[0.1] text-white focus:border-[#F06543]/60'
          )}
        />
      </div>

      {/* Devices List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-2">
        {filteredDevices.map((device) => {
          const isSelected = device.id === selectedDeviceId;
          return (
            <div
              key={device.id}
              className={cn(
                'rounded-xl border transition-all overflow-hidden',
                isSelected
                  ? isLight
                    ? 'bg-amber-50/60 border-[#F06543]/60 shadow-[0_0_12px_rgba(240,101,67,0.2)]'
                    : 'bg-[#181522] border-[#F06543]/60 shadow-[0_0_15px_rgba(240,101,67,0.2)]'
                  : isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                  : 'bg-[#12141A]/90 hover:bg-[#181C26] border-white/[0.06]'
              )}
            >
              {/* Device Main Row */}
              <button
                type="button"
                onClick={() => setSelectedDeviceId(device.id)}
                className="w-full p-2.5 flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={cn(
                      'p-2 rounded-xl border group-hover:scale-105 transition-transform',
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/[0.08]'
                    )}
                  >
                    {getDeviceIcon(device.id)}
                  </div>
                  <div className="truncate">
                    <span
                      className={cn(
                        'text-xs font-bold block truncate tracking-tight transition-colors',
                        isSelected
                          ? 'text-[#F06543]'
                          : isLight
                          ? 'text-slate-800 group-hover:text-slate-900'
                          : 'text-[#F0F6FC] group-hover:text-white'
                      )}
                    >
                      {device.name}
                    </span>
                    <div
                      className={cn(
                        'flex items-center gap-1.5 mt-0.5 text-[9px]',
                        isLight ? 'text-slate-500' : 'text-[#8B949E]'
                      )}
                    >
                      <span
                        className={cn(
                          'uppercase font-semibold',
                          isLight ? 'text-sky-600' : 'text-cyan-400'
                        )}
                      >
                        {device.category}
                      </span>
                      <span>•</span>
                      <span>{device.subsystems.length} modules</span>
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={cn(
                    'w-3.5 h-3.5 transition-transform shrink-0',
                    isSelected
                      ? 'text-[#F06543] rotate-90'
                      : isLight
                      ? 'text-slate-400'
                      : 'text-[#6E7681]'
                  )}
                />
              </button>

              {/* Sub-Assemblies List for Selected Device */}
              {isSelected && (
                <div
                  className={cn(
                    'px-2.5 pb-2.5 pt-1 space-y-1 border-t',
                    isLight
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-black/30 border-white/[0.06]'
                  )}
                >
                  <span
                    className={cn(
                      'text-[9px] uppercase font-bold block mb-1',
                      isLight ? 'text-slate-500' : 'text-[#8B949E]'
                    )}
                  >
                    Modules & Subsystems ({device.subsystems.length})
                  </span>
                  {device.subsystems.map((sub) => {
                    const isSubSelected = sub.id === selectedSubsystemId;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => selectSubsystem(sub)}
                        className={cn(
                          'w-full p-1.5 rounded-lg text-left text-[11px] flex items-center justify-between transition-all cursor-pointer border',
                          isSubSelected
                            ? isLight
                              ? 'bg-cyan-100 text-cyan-900 font-bold border-cyan-400'
                              : 'bg-cyan-500/20 text-cyan-300 font-bold border-cyan-500/40'
                            : isLight
                            ? 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                            : 'bg-[#161B22]/60 text-[#8B949E] hover:text-white border-transparent hover:bg-[#21262D]'
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Layers
                            className={cn(
                              'w-3 h-3 shrink-0',
                              isLight ? 'text-sky-600' : 'text-cyan-400'
                            )}
                          />
                          <span className="truncate">{sub.name}</span>
                        </div>
                        <span
                          className={cn(
                            'text-[9px] font-mono shrink-0',
                            isLight ? 'text-slate-400' : 'text-[#6E7681]'
                          )}
                        >
                          {sub.components.length} parts
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
