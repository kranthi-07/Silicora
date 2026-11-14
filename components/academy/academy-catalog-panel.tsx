'use client';

import React from 'react';
import { ACADEMY_CURRICULUM } from '@/data/academy-curriculum';
import { useAcademyStore } from '@/lib/academy/academy-store';
import { useWorkspaceStore } from '@/lib/store';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AcademyCatalogPanelProps {
  onClose?: () => void;
}

export function AcademyCatalogPanel({ onClose }: AcademyCatalogPanelProps) {
  const {
    activeModuleId,
    activeLessonId,
    setActiveModule,
    setActiveLesson,
    completedLessonIds,
  } = useAcademyStore();

  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';

  const activeModule =
    ACADEMY_CURRICULUM.find((m) => m.id === activeModuleId) || ACADEMY_CURRICULUM[0];

  const activeLesson =
    activeModule.lessons.find((l) => l.id === activeLessonId) || activeModule.lessons[0];

  const totalLessons = ACADEMY_CURRICULUM.flatMap((m) => m.lessons).length;
  const completedCount = completedLessonIds.size;
  const overallProgressPercent = Math.round((completedCount / Math.max(1, totalLessons)) * 100);

  return (
    <div
      className={cn(
        'flex flex-col h-full select-none transition-colors duration-200',
        isLight ? 'bg-white text-slate-800' : 'bg-[#101318] text-[#F0F6FC]'
      )}
    >
      {/* Header with Title and Close Button */}
      <div
        className={cn(
          'p-3.5 border-b space-y-3 shrink-0 transition-colors',
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161B22]/70 border-[#21262D]'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#58A6FF]" />
            </div>
            <div>
              <span
                className={cn(
                  'text-xs font-bold block',
                  isLight ? 'text-slate-800' : 'text-[#F0F6FC]'
                )}
              >
                Academy Curriculum
              </span>
              <span className={cn('text-[10px]', isLight ? 'text-slate-500' : 'text-[#8B949E]')}>
                {totalLessons} Interactive Modules
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'p-1 rounded-md transition-colors',
                isLight
                  ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                  : 'text-[#8B949E] hover:text-white hover:bg-white/10'
              )}
              title="Close Catalog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Curriculum Progress Meter */}
        <div
          className={cn(
            'space-y-1.5 p-2.5 rounded-lg border transition-colors',
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#161B22]/60 border-[#21262D]'
          )}
        >
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className={isLight ? 'text-slate-500' : 'text-[#8B949E]'}>
              Curriculum Progress:
            </span>
            <span className="text-blue-600 font-bold">{overallProgressPercent}%</span>
          </div>
          <div
            className={cn(
              'w-full h-1.5 rounded-full overflow-hidden',
              isLight ? 'bg-slate-200' : 'bg-[#21262D]'
            )}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules & Lessons List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {ACADEMY_CURRICULUM.map((mod) => {
          const isModActive = mod.id === activeModule.id;
          return (
            <div key={mod.id} className="space-y-1.5">
              <button
                type="button"
                onClick={() => setActiveModule(mod.id)}
                className={cn(
                  'w-full text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer',
                  isModActive
                    ? isLight
                      ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-sm'
                      : 'bg-[#161B22] border-[#58A6FF]/50 text-[#F0F6FC] shadow-sm'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    : 'bg-[#101318] border-[#21262D] text-[#8B949E] hover:border-[#30363D] hover:text-[#F0F6FC]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold tracking-tight">{mod.title}</span>
                  <Badge variant={isModActive ? 'accent' : 'outline'} size="xs">
                    {mod.difficulty}
                  </Badge>
                </div>
                <div
                  className={cn(
                    'flex items-center gap-2 mt-1 text-[10px]',
                    isLight ? 'text-slate-400' : 'text-[#6E7681]'
                  )}
                >
                  <Clock className="w-3 h-3" />
                  <span>{mod.estimatedMinutes} mins</span>
                  <span>•</span>
                  <span>
                    {mod.lessons.length} {mod.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>
              </button>

              {/* Lessons Sub-List */}
              {isModActive && (
                <div className="pl-2 space-y-1">
                  {mod.lessons.map((les) => {
                    const isLesActive = les.id === activeLesson.id;
                    const isLesCompleted = completedLessonIds.has(les.id);
                    return (
                      <button
                        key={les.id}
                        type="button"
                        onClick={() => setActiveLesson(les.id)}
                        className={cn(
                          'w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer',
                          isLesActive
                            ? isLight
                              ? 'bg-sky-100 border-sky-400 text-sky-900 font-bold'
                              : 'bg-[#21262D] border-[#58A6FF] text-[#F0F6FC] font-semibold'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            : 'bg-[#161B22]/50 border-transparent text-[#8B949E] hover:text-[#F0F6FC]'
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isLesCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <div
                              className={cn(
                                'w-3.5 h-3.5 rounded-full border shrink-0',
                                isLight ? 'border-slate-300' : 'border-[#484F58]'
                              )}
                            />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-3.5 h-3.5 shrink-0',
                            isLight ? 'text-slate-400' : 'text-[#6E7681]'
                          )}
                        />
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
