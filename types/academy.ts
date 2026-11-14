/**
 * 3D Lab — Phase 5: Learning Academy Domain Types
 * Content-driven interactive lesson engine types.
 */

export type StageType =
  | 'theory'
  | '3d_cutaway'
  | 'guided_simulation'
  | 'knowledge_check'
  | 'practical_challenge';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  conceptualHint?: string;
}

export interface PracticalChallengeConfig {
  id: string;
  prompt: string;
  targetParameter: 'current_mA' | 'voltage_drop_V' | 'power_mW' | 'time_constant_ms';
  targetValue: number;
  tolerancePercent: number;
  initialComponentId: string;
  initialVoltage: number;
  initialResistance?: number;
  initialCapacitance?: number;
  successMessage: string;
  hint: string;
}

export interface AcademyStage {
  id: string;
  title: string;
  type: StageType;
  content: string;
  /** Component ID to load into 3D viewer or simulation if applicable */
  targetComponentId?: string;
  /** Initial cutaway settings */
  cutawaySettings?: {
    axis: 'x' | 'y' | 'z';
    offsetMm: number;
    highlightLayerId?: string;
  };
  /** Guided simulation parameters */
  simulationPreset?: {
    voltage: number;
    resistance?: number;
    capacitance?: number;
    frequencyHz?: number;
  };
  /** Knowledge check question if type === 'knowledge_check' */
  quiz?: QuizQuestion;
  /** Practical challenge config if type === 'practical_challenge' */
  challenge?: PracticalChallengeConfig;
}

export interface AcademyLesson {
  id: string;
  moduleId: string;
  title: string;
  tagline: string;
  objectives: string[];
  stages: AcademyStage[];
}

export interface AcademyModule {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  category: 'passive' | 'semiconductor' | 'circuit_analysis' | 'power';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  lessons: AcademyLesson[];
}
