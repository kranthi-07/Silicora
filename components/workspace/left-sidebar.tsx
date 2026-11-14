'use client';

import React, { useMemo } from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { ComponentPhysicalIllustration } from '@/components/explorer/component-graphics';
import { MOCK_COMPONENTS } from '@/data/mock-components';
import { Search, FolderKanban, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ComponentCategory } from '@/types/component';

import { ComponentLibraryPanel } from '@/components/circuit/component-library-panel';
import { DeviceCatalogPanel } from '@/components/devices/device-catalog-panel';
import { PcbCatalogPanel } from '@/components/pcb/pcb-catalog-panel';
import { AcademyCatalogPanel } from '@/components/academy/academy-catalog-panel';

function DefaultComponentsCatalogPanel({ onClose }: { onClose: () => void }) {
  const {
    searchQuery,
    setSearchQuery,
    selectedMounting,
    selectedCategory,
    setSelectedCategory,
    selectedComponent,
    setSelectedComponent,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';

  const categories: Array<{ id: ComponentCategory; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'passive', label: 'Passives' },
    { id: 'discrete_semiconductor', label: 'Semis' },
    { id: 'integrated_circuit', label: 'ICs' },
    { id: 'optoelectronics', label: 'Opto' },
    { id: 'sensor', label: 'Sensors' },
    { id: 'power_management', label: 'Power' },
  ];

  const filteredComponents = useMemo(() => {
    return MOCK_COMPONENTS.filter((comp) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && comp.category !== selectedCategory) {
        return false;
      }
      // 2. Mounting Filter
      if (selectedMounting && comp.package.mounting !== selectedMounting) {
        return false;
      }
      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.slug.toLowerCase().includes(q) ||
          comp.package.standardCode.toLowerCase().includes(q) ||
          comp.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedMounting]);

  const handleSelectComponent = (comp: (typeof MOCK_COMPONENTS)[0]) => {
    setSelectedComponent(comp);
  };

  return (
    <>
      {/* 1. Header with live item count */}
      <div
        className={cn(
          'px-3.5 py-2.5 border-b flex items-center justify-between shrink-0 transition-colors',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/70 border-white/[0.08]'
        )}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#F06543]/15 text-[#F06543] border border-[#F06543]/20">
            <FolderKanban className="w-4 h-4" />
          </div>
          <span
            className={cn(
              'text-xs font-bold tracking-tight',
              isLight ? 'text-slate-800' : 'text-[#F0F6FC]'
            )}
          >
            Component Catalog
          </span>
          <span
            className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold',
              isLight
                ? 'bg-slate-200/80 text-[#E05332] border-slate-300'
                : 'bg-white/[0.06] text-[#F06543] border-white/[0.08]'
            )}
          >
            {filteredComponents.length}
          </span>
        </div>
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
          aria-label="Close Catalog"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Search & Category Filters */}
      <div
        className={cn(
          'p-2.5 border-b space-y-2 shrink-0 transition-colors',
          isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#161B22]/40 border-white/[0.08]'
        )}
      >
        <div className="relative">
          <Input
            placeholder="Search all parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            hasClear
            onClear={() => setSearchQuery('')}
            leftIcon={
              <Search
                className={cn('w-3.5 h-3.5', isLight ? 'text-slate-400' : 'text-[#8B949E]')}
              />
            }
            className={cn(
              'font-mono text-xs rounded-xl h-8 py-1 transition-colors',
              isLight
                ? 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-[#F06543]'
                : 'bg-[#090B0E] border-white/[0.1] text-white focus:border-[#F06543]/60'
            )}
          />
        </div>

        {/* Category Filter Carousel */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[10px] font-sans whitespace-nowrap transition-all border cursor-pointer',
                  isActive
                    ? 'bg-[#F06543] text-white border-[#F06543] font-bold shadow-[0_0_10px_rgba(240,101,67,0.4)]'
                    : isLight
                    ? 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                    : 'bg-[#090B0E] text-[#8B949E] border-white/[0.06] hover:text-white hover:bg-[#161B22]'
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BLOCK STYLE GRID: 2-Column Modern Block Cards */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5">
        {filteredComponents.length === 0 ? (
          <div
            className={cn(
              'text-center py-12 text-xs font-mono',
              isLight ? 'text-slate-400' : 'text-[#6E7681]'
            )}
          >
            No matching components found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredComponents.map((comp) => {
              const isSelected = selectedComponent?.id === comp.id;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => handleSelectComponent(comp)}
                  className={cn(
                    'flex flex-col justify-between p-2.5 rounded-xl text-left transition-all border group relative overflow-hidden cursor-pointer h-32',
                    isSelected
                      ? isLight
                        ? 'bg-gradient-to-b from-[#F06543]/15 to-white border-[#F06543] shadow-[0_0_12px_rgba(240,101,67,0.25)] ring-1 ring-[#F06543]/50'
                        : 'bg-gradient-to-b from-[#F06543]/20 to-[#1A1116] border-[#F06543] shadow-[0_0_15px_rgba(240,101,67,0.3)] ring-1 ring-[#F06543]/50'
                      : isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                      : 'bg-[#12141A]/90 hover:bg-[#181C26] border-white/[0.08] hover:border-white/[0.2] hover:shadow-lg'
                  )}
                >
                  {/* Package Chip Top Bar */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={cn(
                        'text-[8px] font-mono px-1.5 py-0.2 rounded font-bold uppercase',
                        comp.package.mounting === 'through_hole'
                          ? isLight
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                          : isLight
                          ? 'bg-sky-100 text-sky-700 border border-sky-300'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                      )}
                    >
                      {comp.package.mounting === 'through_hole' ? 'THT' : 'SMD'}
                    </span>
                    <span
                      className={cn(
                        'text-[8px] font-mono',
                        isLight ? 'text-slate-400' : 'text-[#8B949E]'
                      )}
                    >
                      {comp.package.pins.length}P
                    </span>
                  </div>

                  {/* Component Physical Thumbnail Graphic */}
                  <div className="my-1 h-10 w-full flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
                    <ComponentPhysicalIllustration
                      componentId={comp.id}
                      className="w-full h-full max-h-9 object-contain"
                    />
                  </div>

                  {/* Title & Package Code */}
                  <div className="w-full">
                    <span
                      className={cn(
                        'text-[10px] font-bold block line-clamp-2 leading-tight transition-colors',
                        isSelected
                          ? isLight
                            ? 'text-slate-900 font-extrabold'
                            : 'text-white'
                          : isLight
                          ? 'text-slate-800 group-hover:text-[#F06543]'
                          : 'text-[#E6EDF3] group-hover:text-[#F06543]'
                      )}
                    >
                      {comp.name}
                    </span>
                    <span
                      className={cn(
                        'text-[8px] font-mono block truncate mt-0.5',
                        isLight ? 'text-sky-600' : 'text-cyan-400'
                      )}
                    >
                      {comp.package.standardCode}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export function WorkspaceLeftSidebar() {
  const leftSidebarOpen = useWorkspaceStore((state) => state.leftSidebarOpen);
  const toggleLeftSidebar = useWorkspaceStore((state) => state.toggleLeftSidebar);
  const activeEnvironment = useWorkspaceStore((state) => state.activeEnvironment);
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  if (!leftSidebarOpen) return null;

  return (
    <aside
      id="tutorial-catalog-sidebar"
      className={cn(
        'w-80 h-full border-r backdrop-blur-2xl flex flex-col shrink-0 select-none z-30 transition-all duration-300',
        isLight
          ? 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl'
          : 'bg-[#101318]/95 border-white/[0.1] text-[#F0F6FC] shadow-2xl'
      )}
    >
      {activeEnvironment === 'circuit_workspace' ? (
        <ComponentLibraryPanel embedded onClose={toggleLeftSidebar} />
      ) : activeEnvironment === 'device_explorer' ? (
        <DeviceCatalogPanel onClose={toggleLeftSidebar} />
      ) : activeEnvironment === 'pcb_studio' ? (
        <PcbCatalogPanel onClose={toggleLeftSidebar} />
      ) : activeEnvironment === 'learning_academy' ? (
        <AcademyCatalogPanel onClose={toggleLeftSidebar} />
      ) : (
        <DefaultComponentsCatalogPanel onClose={toggleLeftSidebar} />
      )}
    </aside>
  );
}
