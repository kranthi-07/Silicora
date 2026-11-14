'use client';

import React from 'react';
import { AcademyLesson, AcademyStage } from '@/types/academy';
import { useAcademyStore } from '@/lib/academy/academy-store';
import { QuizView } from './quiz-view';
import { ChallengeEvaluator } from './challenge-evaluator';
import { ComponentCanvas } from '@/components/viewer/component-canvas';
import { useWorkspaceStore } from '@/lib/store';
import { MOCK_COMPONENTS } from '@/data/mock-components';
import {
  BookOpen,
  Layers,
  Activity,
  HelpCircle,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LessonRunnerProps {
  lesson: AcademyLesson;
}

export function LessonRunner({ lesson }: LessonRunnerProps) {
  const {
    activeStageIndex,
    nextStage,
    prevStage,
    completedStageIds,
    markStageComplete,
  } = useAcademyStore();

  const { setSelectedComponent, setCutawayActive, themeMode } = useWorkspaceStore();
  const isLight = themeMode === 'light';

  const currentStage: AcademyStage = lesson.stages[activeStageIndex] || lesson.stages[0];
  const isFirst = activeStageIndex === 0;
  const isLast = activeStageIndex === lesson.stages.length - 1;
  const isCompleted = completedStageIds.has(currentStage.id);

  // If stage targets a 3D component, ensure it's selected in the workspace store
  React.useEffect(() => {
    if (currentStage.targetComponentId) {
      const comp = MOCK_COMPONENTS.find((c) => c.id === currentStage.targetComponentId);
      if (comp) {
        setSelectedComponent(comp);
        if (currentStage.type === '3d_cutaway') {
          setCutawayActive(true);
        }
      }
    }
  }, [currentStage, setSelectedComponent, setCutawayActive]);

  const getStageIcon = (type: AcademyStage['type']) => {
    switch (type) {
      case 'theory':
        return <BookOpen className="w-3.5 h-3.5" />;
      case '3d_cutaway':
        return <Layers className="w-3.5 h-3.5" />;
      case 'guided_simulation':
        return <Activity className="w-3.5 h-3.5" />;
      case 'knowledge_check':
        return <HelpCircle className="w-3.5 h-3.5" />;
      case 'practical_challenge':
        return <Target className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className={cn(
        'flex-1 flex flex-col h-full overflow-hidden select-none transition-colors duration-200',
        isLight ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#090B0E] text-slate-100'
      )}
    >
      {/* 1. Stage Progress Header */}
      <div
        className={cn(
          'px-6 py-3 border-b flex items-center justify-between shrink-0 transition-colors',
          isLight
            ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
            : 'bg-[#101318] border-[#21262D]'
        )}
      >
        <div>
          <span
            className={cn(
              'text-[10px] font-mono uppercase font-semibold',
              isLight ? 'text-sky-600' : 'text-[#58A6FF]'
            )}
          >
            Stage {activeStageIndex + 1} of {lesson.stages.length}
          </span>
          <h2
            className={cn(
              'text-sm font-bold tracking-tight',
              isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
            )}
          >
            {currentStage.title}
          </h2>
        </div>

        {/* Stepper Dots */}
        <div className="flex items-center gap-1.5">
          {lesson.stages.map((stg, idx) => {
            const isDone = completedStageIds.has(stg.id);
            const isCurrent = idx === activeStageIndex;
            return (
              <div
                key={stg.id}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  isCurrent
                    ? 'bg-[#58A6FF] ring-2 ring-[#58A6FF]/40'
                    : isDone
                    ? 'bg-emerald-400'
                    : isLight
                    ? 'bg-slate-300'
                    : 'bg-[#21262D]'
                )}
                title={stg.title}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Stage Workspace */}
      <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
        {/* Left / Top: Interactive Demonstration Canvas (if 3D or Simulation) */}
        {(currentStage.type === '3d_cutaway' || currentStage.type === 'guided_simulation') && (
          <div
            className={cn(
              'flex-1 h-full min-h-[350px] relative border-b md:border-b-0 md:border-r',
              isLight ? 'border-slate-200' : 'border-[#21262D]'
            )}
          >
            <ComponentCanvas />
          </div>
        )}

        {/* Right / Content Area */}
        <div
          className={cn(
            'w-full md:w-[480px] lg:w-[540px] h-full overflow-y-auto p-6 custom-scrollbar flex flex-col justify-between shrink-0 space-y-6 transition-colors',
            isLight ? 'bg-[#F8FAFC]' : 'bg-[#090B0E]'
          )}
        >
          <div className="space-y-6">
            {/* Stage Description & Theory Text */}
            <div
              className={cn(
                'p-6 rounded-2xl border space-y-4 transition-colors',
                isLight
                  ? 'bg-white border-slate-200 shadow-md text-slate-800'
                  : 'bg-[#161B22] border-[#30363D]'
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-2 text-xs font-mono',
                  isLight ? 'text-sky-600' : 'text-[#58A6FF]'
                )}
              >
                {getStageIcon(currentStage.type)}
                <span className="uppercase font-semibold tracking-wider">
                  {currentStage.type.replace('_', ' ')}
                </span>
              </div>

              <div
                className={cn(
                  'text-xs leading-relaxed whitespace-pre-line font-sans',
                  isLight ? 'text-slate-600' : 'text-[#C9D1D9]'
                )}
              >
                {currentStage.content}
              </div>
            </div>

            {/* Knowledge Check Quiz Embed */}
            {currentStage.type === 'knowledge_check' && currentStage.quiz && (
              <QuizView
                stageId={currentStage.id}
                quiz={currentStage.quiz}
                onPass={() => markStageComplete(currentStage.id)}
              />
            )}

            {/* Practical Challenge Embed */}
            {currentStage.type === 'practical_challenge' && currentStage.challenge && (
              <ChallengeEvaluator
                challenge={currentStage.challenge}
                onPass={() => markStageComplete(currentStage.id)}
              />
            )}
          </div>

          {/* Navigation Controls Footer */}
          <div
            className={cn(
              'pt-4 border-t flex items-center justify-between shrink-0 transition-colors',
              isLight ? 'border-slate-200' : 'border-[#21262D]'
            )}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={isFirst}
              onClick={prevStage}
              className="text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={nextStage}
              className="text-xs flex items-center gap-1.5 font-bold"
            >
              <span>{isLast ? 'Complete Lesson' : 'Next Stage'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
