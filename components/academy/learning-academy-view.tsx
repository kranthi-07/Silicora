'use client';

import React from 'react';
import { ACADEMY_CURRICULUM } from '@/data/academy-curriculum';
import { useAcademyStore } from '@/lib/academy/academy-store';
import { useWorkspaceStore } from '@/lib/store';
import { LessonRunner } from './lesson-runner';
import { cn } from '@/lib/utils';

export function LearningAcademyView() {
  const {
    activeModuleId,
    activeLessonId,
  } = useAcademyStore();

  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  const activeModule =
    ACADEMY_CURRICULUM.find((m) => m.id === activeModuleId) || ACADEMY_CURRICULUM[0];

  const activeLesson =
    activeModule.lessons.find((l) => l.id === activeLessonId) || activeModule.lessons[0];

  return (
    <div
      className={cn(
        'flex-1 flex h-full select-none overflow-hidden transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#090B0E] text-slate-100'
      )}
    >
      {/* Main Lesson Runner (Sidebar is now integrated into unified Catalog) */}
      <main className="flex-1 h-full overflow-hidden">
        <LessonRunner lesson={activeLesson} />
      </main>
    </div>
  );
}
