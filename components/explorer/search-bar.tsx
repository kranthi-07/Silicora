'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MountingType } from '@/types/component';
import { cn } from '@/lib/utils';

export function ComponentSearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    selectedMounting,
    setSelectedMounting,
  } = useWorkspaceStore();

  const mountings: Array<{ id: string | null; label: string }> = [
    { id: null, label: 'All Packages' },
    { id: 'through_hole', label: 'THT (Through-Hole)' },
    { id: 'smd', label: 'SMD (Surface Mount)' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-lab-surface-1 border-b border-lab-border-subtle shrink-0">
      <div className="relative flex-1">
        <Input
          placeholder="Search components by part number, tag, package or physics (e.g. 2N3904, DIP-8, BJT, LED)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          hasClear
          onClear={() => setSearchQuery('')}
          leftIcon={<Search className="w-3.5 h-3.5" />}
          className="font-mono text-xs"
        />
      </div>

      <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
        {mountings.map((m) => {
          const isActive = selectedMounting === m.id;
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => setSelectedMounting(m.id)}
              className={cn(
                'px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap border select-none',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-glow'
                  : 'bg-lab-surface-0 text-lab-text-secondary border-lab-border-default hover:text-lab-text-primary hover:bg-lab-surface-2'
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
