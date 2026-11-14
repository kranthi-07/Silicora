'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { ComponentCategory } from '@/types/component';
import { MOCK_COMPONENTS } from '@/data/mock-components';
import {
  Layers,
  Cpu,
  Zap,
  Activity,
  Flame,
  Gauge,
  Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryConfig {
  id: ComponentCategory;
  label: string;
  icon: React.ReactNode;
}

export function ComponentCategoryNav() {
  const { selectedCategory, setSelectedCategory } = useWorkspaceStore();

  const categories: CategoryConfig[] = [
    { id: 'all', label: 'All Parts', icon: <Layers className="w-3 h-3 text-cyan-400" /> },
    { id: 'passive', label: 'Passives', icon: <Sliders className="w-3 h-3 text-amber-400" /> },
    { id: 'discrete_semiconductor', label: 'Semiconductors', icon: <Cpu className="w-3 h-3 text-blue-400" /> },
    { id: 'integrated_circuit', label: 'ICs & Logic', icon: <Zap className="w-3 h-3 text-purple-400" /> },
    { id: 'opamp_linear', label: 'Op-Amps', icon: <Activity className="w-3 h-3 text-emerald-400" /> },
    { id: 'optoelectronics', label: 'Opto & LEDs', icon: <Flame className="w-3 h-3 text-red-400" /> },
    { id: 'sensor', label: 'Sensors', icon: <Gauge className="w-3 h-3 text-teal-400" /> },
  ];

  const getCount = (catId: ComponentCategory) => {
    if (catId === 'all') return MOCK_COMPONENTS.length;
    return MOCK_COMPONENTS.filter((c) => c.category === catId).length;
  };

  return (
    <nav className="flex flex-col gap-0.5 p-1" aria-label="Component Categories">
      <div className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#6E7681] font-mono">
        Categories
      </div>
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        const count = getCount(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'flex items-center justify-between px-2 py-1 rounded-md text-[11px] font-medium transition-all select-none text-left border',
              isActive
                ? 'bg-cyan-500/15 text-cyan-300 font-bold border-cyan-500/40 shadow-sm'
                : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22] border-transparent'
            )}
          >
            <div className="flex items-center gap-1.5 truncate">
              {cat.icon}
              <span className="truncate">{cat.label}</span>
            </div>
            <span className="font-mono text-[9px] px-1 rounded bg-[#101318] text-[#6E7681]">
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
