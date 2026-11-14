'use client';

import React from 'react';
import { PcbDrcResult } from '@/types/pcb';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

interface PcbDrcDialogProps {
  isOpen: boolean;
  result: PcbDrcResult | null;
  onClose: () => void;
  onNavigateToViolation: (posMm: [number, number]) => void;
}

export function PcbDrcDialog({
  isOpen,
  result,
  onClose,
  onNavigateToViolation,
}: PcbDrcDialogProps) {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            {result.passed ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-500" />
            )}
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Design Rule Check (DRC) Report
              </h2>
              <p className="text-xs text-slate-400">
                {result.passed
                  ? 'All manufacturing design rules satisfied. Board is ready for fabrication.'
                  : `${result.errorCount} Error(s), ${result.warningCount} Warning(s) detected.`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Violations List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 font-mono text-xs">
          {result.violations.length === 0 ? (
            <div className="p-8 text-center bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="font-sans text-sm font-medium">Zero DRC Violations Found</p>
              <p className="text-xs text-emerald-400/80 font-sans mt-1">
                Trace widths, net clearances, edge cuts clearances, and drill rules conform to standard PCB fabrication specs (10mil / 10mil).
              </p>
            </div>
          ) : (
            result.violations.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  onNavigateToViolation(v.positionMm);
                  onClose();
                }}
                className={`p-3 rounded-lg border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                  v.severity === 'error'
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60 text-rose-200'
                    : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60 text-amber-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {v.severity === 'error' ? (
                    <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 mr-2">
                      {v.rule.replace('_', ' ')}
                    </span>
                    <span className="font-sans text-xs">{v.message}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400">
                    [{v.positionMm[0].toFixed(1)}, {v.positionMm[1].toFixed(1)}] mm
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Evaluated at {new Date(result.timestamp).toLocaleTimeString()}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
