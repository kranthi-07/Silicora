import { create } from 'zustand';
import { ACADEMY_CURRICULUM } from '@/data/academy-curriculum';
import { AcademyModule, AcademyLesson, AcademyStage } from '@/types/academy';

interface AcademyState {
  activeModuleId: string;
  activeLessonId: string;
  activeStageIndex: number;
  completedStageIds: Set<string>;
  completedLessonIds: Set<string>;
  quizResults: Record<string, { selectedOptionId: string; isCorrect: boolean }>;
  challengeResults: Record<string, boolean>;

  setActiveModule: (moduleId: string) => void;
  setActiveLesson: (lessonId: string) => void;
  setActiveStageIndex: (index: number) => void;
  nextStage: () => void;
  prevStage: () => void;
  markStageComplete: (stageId: string) => void;
  recordQuizAnswer: (stageId: string, optionId: string, isCorrect: boolean) => void;
  recordChallengePass: (challengeId: string) => void;
  resetProgress: () => void;
}

export const useAcademyStore = create<AcademyState>((set, get) => ({
  activeModuleId: ACADEMY_CURRICULUM[0].id,
  activeLessonId: ACADEMY_CURRICULUM[0].lessons[0].id,
  activeStageIndex: 0,
  completedStageIds: new Set<string>(),
  completedLessonIds: new Set<string>(),
  quizResults: {},
  challengeResults: {},

  setActiveModule: (moduleId) => {
    const mod = ACADEMY_CURRICULUM.find((m) => m.id === moduleId) || ACADEMY_CURRICULUM[0];
    set({
      activeModuleId: mod.id,
      activeLessonId: mod.lessons[0].id,
      activeStageIndex: 0,
    });
  },

  setActiveLesson: (lessonId) => {
    set({
      activeLessonId: lessonId,
      activeStageIndex: 0,
    });
  },

  setActiveStageIndex: (index) => {
    set({ activeStageIndex: index });
  },

  nextStage: () => {
    const { activeModuleId, activeLessonId, activeStageIndex, completedStageIds, completedLessonIds } = get();
    const mod = ACADEMY_CURRICULUM.find((m) => m.id === activeModuleId);
    if (!mod) return;
    const lesson = mod.lessons.find((l) => l.id === activeLessonId);
    if (!lesson) return;

    // Mark current stage as complete
    const currentStage = lesson.stages[activeStageIndex];
    if (currentStage) {
      completedStageIds.add(currentStage.id);
    }

    if (activeStageIndex < lesson.stages.length - 1) {
      set({
        activeStageIndex: activeStageIndex + 1,
        completedStageIds: new Set(completedStageIds),
      });
    } else {
      // Completed lesson!
      completedLessonIds.add(lesson.id);
      set({
        completedStageIds: new Set(completedStageIds),
        completedLessonIds: new Set(completedLessonIds),
      });
    }
  },

  prevStage: () => {
    const { activeStageIndex } = get();
    if (activeStageIndex > 0) {
      set({ activeStageIndex: activeStageIndex - 1 });
    }
  },

  markStageComplete: (stageId) => {
    const { completedStageIds } = get();
    completedStageIds.add(stageId);
    set({ completedStageIds: new Set(completedStageIds) });
  },

  recordQuizAnswer: (stageId, optionId, isCorrect) => {
    const { quizResults, completedStageIds } = get();
    quizResults[stageId] = { selectedOptionId: optionId, isCorrect };
    if (isCorrect) {
      completedStageIds.add(stageId);
    }
    set({
      quizResults: { ...quizResults },
      completedStageIds: new Set(completedStageIds),
    });
  },

  recordChallengePass: (challengeId) => {
    const { challengeResults, completedStageIds } = get();
    challengeResults[challengeId] = true;
    completedStageIds.add(challengeId);
    set({
      challengeResults: { ...challengeResults },
      completedStageIds: new Set(completedStageIds),
    });
  },

  resetProgress: () => {
    set({
      completedStageIds: new Set<string>(),
      completedLessonIds: new Set<string>(),
      quizResults: {},
      challengeResults: {},
      activeStageIndex: 0,
    });
  },
}));
