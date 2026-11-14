'use client';

import React, { useMemo } from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { MOCK_COMPONENTS } from '@/data/mock-components';
import { ComponentCard } from './component-card';
import { EmptyState, LoadingState } from '@/components/ui/state-views';
import { ComponentCanvas } from '@/components/viewer/component-canvas';
import { ComponentPhysicalIllustration } from './component-graphics';
import { LayoutGrid, Table, Box, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComponentGridProps {
  isLoading?: boolean;
}

export function ComponentGrid({ isLoading = false }: ComponentGridProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMounting,
    setSelectedMounting,
    selectedComponent,
    setSelectedComponent,
    setDetailModalOpen,
    setActiveDetailTab,
    catalogViewMode,
    setCatalogViewMode,
    themeMode,
  } = useWorkspaceStore();

  const isLight = themeMode === 'light';

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
        const matchesName = comp.name.toLowerCase().includes(q);
        const matchesSlug = comp.slug.toLowerCase().includes(q);
        const matchesCode = comp.package.standardCode.toLowerCase().includes(q);
        const matchesTag = comp.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSummary = comp.educational.summary.toLowerCase().includes(q);
        const matchesPrinciple = comp.educational.physicalOperatingPrinciple
          .toLowerCase()
          .includes(q);

        return (
          matchesName ||
          matchesSlug ||
          matchesCode ||
          matchesTag ||
          matchesSummary ||
          matchesPrinciple
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedMounting]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMounting(null);
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'passive':
        return 'Passive Components (R, C, L)';
      case 'discrete_semiconductor':
        return 'Discrete Semiconductors (BJTs, FETs, Diodes)';
      case 'integrated_circuit':
        return 'Integrated Circuits (ICs & Timers)';
      case 'opamp_linear':
        return 'Operational Amplifiers & Linear ICs';
      case 'optoelectronics':
        return 'Optoelectronics & Indicator LEDs';
      case 'sensor':
        return 'Sensors & Transducers';
      default:
        return 'All Electronic Components';
    }
  };

  if (isLoading) {
    return <LoadingState className="my-8" />;
  }

  return (
    <div
      className={cn(
        'flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#090B0E] text-slate-100'
      )}
    >
      {/* Sub-Header: Only shown when in Grid or Table mode to allow switching back to 3D and searching */}
      {catalogViewMode !== '3d' && (
        <div
          className={cn(
            'px-5 py-3 border-b backdrop-blur-md flex items-center justify-between shrink-0 select-none z-10 transition-colors',
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
              : 'bg-[#101318]/90 border-[#21262D]'
          )}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCatalogViewMode('3d')}
              className={cn(
                'flex items-center gap-1.5 text-xs font-mono transition-colors px-3 py-1.5 rounded-lg border',
                isLight
                  ? 'bg-slate-100 border-slate-200 text-sky-600 hover:bg-slate-200'
                  : 'text-cyan-400 hover:text-cyan-300 bg-[#161B22] border-[#30363D]'
              )}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to 3D Stage</span>
            </button>
            <div className={cn('w-px h-4', isLight ? 'bg-slate-200' : 'bg-[#21262D]')} />
            <h2 className={cn('text-sm font-bold tracking-tight', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>
              {getCategoryTitle()}
            </h2>
            <span
              className={cn(
                'font-mono text-[10px] px-2 py-0.5 rounded-full border',
                isLight
                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                  : 'bg-[#161B22] text-[#8B949E] border-[#30363D]'
              )}
            >
              {filteredComponents.length} {filteredComponents.length === 1 ? 'part' : 'parts'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(searchQuery || selectedCategory !== 'all' || selectedMounting) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-sky-600 dark:text-cyan-400 hover:underline cursor-pointer font-medium mr-2"
              >
                Reset Filters
              </button>
            )}

            {/* View Mode Switcher in Grid/Table Header */}
            <div
              className={cn(
                'inline-flex rounded-full p-1 border',
                isLight
                  ? 'bg-slate-100 border-slate-200'
                  : 'bg-[#161B22] border-[#30363D]'
              )}
            >
              <button
                type="button"
                onClick={() => setCatalogViewMode('3d')}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-colors',
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#8B949E] hover:text-[#F0F6FC]'
                )}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Stage</span>
              </button>
              <button
                type="button"
                onClick={() => setCatalogViewMode('grid')}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-colors',
                  catalogViewMode === 'grid'
                    ? isLight
                      ? 'bg-white text-sky-700 font-bold shadow-sm'
                      : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Catalog</span>
              </button>
              <button
                type="button"
                onClick={() => setCatalogViewMode('table')}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-colors',
                  catalogViewMode === 'table'
                    ? isLight
                      ? 'bg-white text-sky-700 font-bold shadow-sm'
                      : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                )}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Spec Table</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex-1 overflow-hidden relative">
        {/* VIEW 1: 3D INTERACTIVE VIEWPORT (Full-Bleed, Symmetrical, Zero Overlap) */}
        {catalogViewMode === '3d' && (
          <div className="w-full h-full relative">
            <ComponentCanvas />
          </div>
        )}

        {/* VIEW 2: CARDS GRID */}
        {catalogViewMode === 'grid' && (
          <div className="w-full h-full overflow-y-auto p-6 custom-scrollbar">
            {filteredComponents.length === 0 ? (
              <EmptyState
                title="No Matching Electronic Parts"
                description={`No components found matching your current filters. Try searching for generic terms like "BJT", "DIP-8", "Capacitor", or reset all filters.`}
                actionText="Reset All Filters"
                onAction={handleResetFilters}
                className="my-12 max-w-lg mx-auto"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredComponents.map((component) => (
                  <div
                    key={component.id}
                    onClick={() => {
                      setSelectedComponent(component);
                      setCatalogViewMode('3d');
                    }}
                    className="cursor-pointer transition-transform hover:-translate-y-1"
                  >
                    <ComponentCard component={component} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: TABLE MATRIX */}
        {catalogViewMode === 'table' && (
          <div className="w-full h-full overflow-y-auto p-6 custom-scrollbar">
            {filteredComponents.length === 0 ? (
              <EmptyState
                title="No Matching Electronic Parts"
                description={`No components found matching your current filters.`}
                actionText="Reset All Filters"
                onAction={handleResetFilters}
                className="my-12 max-w-lg mx-auto"
              />
            ) : (
              <div
                className={cn(
                  'rounded-2xl border overflow-hidden font-mono text-xs transition-colors',
                  isLight
                    ? 'bg-white border-slate-200 shadow-md text-slate-800'
                    : 'bg-[#161B22] border-[#30363D] shadow-card text-[#F0F6FC]'
                )}
              >
                <table className="w-full text-left border-collapse">
                  <thead
                    className={cn(
                      'border-b text-[10px] uppercase tracking-wider',
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#101318] border-[#30363D] text-[#8B949E]'
                    )}
                  >
                    <tr>
                      <th className="p-3.5">Part Name</th>
                      <th className="p-3.5">Package</th>
                      <th className="p-3.5">Mount</th>
                      <th className="p-3.5">Pins</th>
                      <th className="p-3.5">Vmax</th>
                      <th className="p-3.5">Imax</th>
                      <th className="p-3.5">Pdiss</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={cn('divide-y', isLight ? 'divide-slate-200' : 'divide-[#21262D]')}>
                    {filteredComponents.map((comp) => {
                      const isSelected = selectedComponent?.id === comp.id;
                      return (
                        <tr
                          key={comp.id}
                          className={cn(
                            'transition-colors',
                            isLight
                              ? isSelected ? 'bg-sky-50' : 'hover:bg-slate-50'
                              : isSelected ? 'bg-[#1f2937]/50' : 'hover:bg-[#21262D]/50'
                          )}
                        >
                          <td className="p-3.5 font-sans font-medium flex items-center gap-2">
                            <div
                              className={cn(
                                'w-6 h-5 rounded border p-0.5 shrink-0 flex items-center justify-center',
                                isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#101318] border-[#21262D]'
                              )}
                            >
                              <ComponentPhysicalIllustration componentId={comp.id} className="w-full h-full" />
                            </div>
                            <span className={cn('truncate', isLight ? 'text-slate-900' : 'text-[#F0F6FC]')}>{comp.name}</span>
                          </td>
                          <td className={cn('p-3.5 font-mono font-semibold', isLight ? 'text-sky-700' : 'text-cyan-400')}>{comp.package.standardCode}</td>
                          <td className={cn('p-3.5 capitalize', isLight ? 'text-slate-600' : 'text-[#8B949E]')}>
                            {comp.package.mounting.replace('_', ' ')}
                          </td>
                          <td className={cn('p-3.5', isLight ? 'text-slate-600' : 'text-[#8B949E]')}>{comp.package.pins.length}</td>
                          <td className={cn('p-3.5', isLight ? 'text-slate-600' : 'text-[#8B949E]')}>
                            {comp.electrical?.ratings?.maxVoltageV ? `${comp.electrical.ratings.maxVoltageV} V` : '—'}
                          </td>
                          <td className={cn('p-3.5', isLight ? 'text-slate-600' : 'text-[#8B949E]')}>
                            {comp.electrical?.ratings?.maxCurrentContinuousA ? `${comp.electrical.ratings.maxCurrentContinuousA} A` : '—'}
                          </td>
                          <td className={cn('p-3.5', isLight ? 'text-slate-600' : 'text-[#8B949E]')}>
                            {comp.electrical?.ratings?.maxPowerDissipationW
                              ? `${comp.electrical.ratings.maxPowerDissipationW * 1000} mW`
                              : '—'}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedComponent(comp);
                                setCatalogViewMode('3d');
                              }}
                              className={cn('font-bold hover:underline', isLight ? 'text-sky-600 hover:text-sky-700' : 'text-cyan-400 hover:text-cyan-300')}
                            >
                              3D Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedComponent(comp);
                                setActiveDetailTab('overview');
                                setDetailModalOpen(true);
                              }}
                              className={isLight ? 'text-slate-500 hover:text-slate-800' : 'text-[#8B949E] hover:text-[#F0F6FC]'}
                            >
                              Datasheet
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
