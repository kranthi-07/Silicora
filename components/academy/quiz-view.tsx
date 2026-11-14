'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/types/academy';
import { useAcademyStore } from '@/lib/academy/academy-store';
import { useWorkspaceStore } from '@/lib/store';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuizViewProps {
  stageId: string;
  quiz: QuizQuestion;
  onPass: () => void;
}

export function QuizView({ stageId, quiz, onPass }: QuizViewProps) {
  const { quizResults, recordQuizAnswer } = useAcademyStore();
  const themeMode = useWorkspaceStore((state) => state.themeMode);
  const isLight = themeMode === 'light';
  const existingResult = quizResults[stageId];
  const [selectedOptId, setSelectedOptId] = useState<string | null>(
    existingResult?.selectedOptionId || null
  );

  const handleSelect = (optionId: string) => {
    setSelectedOptId(optionId);
    const opt = quiz.options.find((o) => o.id === optionId);
    if (opt) {
      recordQuizAnswer(stageId, optionId, opt.isCorrect);
      if (opt.isCorrect) {
        onPass();
      }
    }
  };

  const selectedOpt = quiz.options.find((o) => o.id === selectedOptId);

  return (
    <div
      className={cn(
        'p-6 rounded-2xl border space-y-5 transition-colors',
        isLight
          ? 'bg-white border-slate-200 shadow-md text-slate-800'
          : 'bg-[#161B22] border-[#30363D]'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 text-xs font-mono',
          isLight ? 'text-purple-600' : 'text-purple-400'
        )}
      >
        <HelpCircle className="w-4 h-4" />
        <span className="uppercase tracking-wider font-semibold">Knowledge Check</span>
      </div>

      <h3
        className={cn(
          'text-base font-bold leading-snug',
          isLight ? 'text-slate-900' : 'text-[#F0F6FC]'
        )}
      >
        {quiz.question}
      </h3>

      {/* Options List */}
      <div className="space-y-3">
        {quiz.options.map((opt) => {
          const isChosen = selectedOptId === opt.id;
          let borderClasses = isLight
            ? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
            : 'border-[#21262D] hover:border-[#30363D] bg-[#101318] text-slate-200';
          if (isChosen) {
            borderClasses = opt.isCorrect
              ? isLight
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                : 'border-emerald-500 bg-emerald-950/20 text-[#F0F6FC]'
              : isLight
              ? 'border-rose-500 bg-rose-50 text-rose-950'
              : 'border-rose-500 bg-rose-950/20 text-[#F0F6FC]';
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 select-none ${borderClasses}`}
            >
              <div className="mt-0.5">
                {isChosen ? (
                  opt.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )
                ) : (
                  <div className={cn('w-4 h-4 rounded-full border shrink-0', isLight ? 'border-slate-300' : 'border-[#484F58]')} />
                )}
              </div>
              <span className="font-medium leading-relaxed">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Scientific Explanation & Feedback */}
      {selectedOpt && (
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
            selectedOpt.isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            {selectedOpt.isCorrect ? 'Correct Solution!' : 'Not Quite — Review Physics Insight:'}
          </div>
          <div>{selectedOpt.explanation}</div>
        </div>
      )}
    </div>
  );
}
