'use client';

import React, { useState } from 'react';
import { PcbProject } from '@/types/pcb';
import { exportToKiCadPcb, exportToKiCadNetlist } from '@/lib/pcb/kicad-adapter';
import { generateGerberPackage } from '@/lib/pcb/gerber-exporter';
import { Download, FileCode, Layers, Check, X } from 'lucide-react';

interface PcbExportDialogProps {
  isOpen: boolean;
  project: PcbProject;
  onClose: () => void;
}

export function PcbExportDialog({ isOpen, project, onClose }: PcbExportDialogProps) {
  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerDownload = (filename: string, content: string, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadedFile(filename);
    setTimeout(() => setDownloadedFile(null), 3000);
  };

  const handleDownloadKiCadPcb = () => {
    const pcbContent = exportToKiCadPcb(project);
    triggerDownload(`${project.name}.kicad_pcb`, pcbContent);
  };

  const handleDownloadKiCadNetlist = () => {
    const netContent = exportToKiCadNetlist(project);
    triggerDownload(`${project.name}.net`, netContent);
  };

  const gerbers = generateGerberPackage(project);

  const handleDownloadAllGerbers = () => {
    // Sequentially download the gerbers
    Object.entries(gerbers).forEach(([filename, content], idx) => {
      setTimeout(() => {
        triggerDownload(filename, content);
      }, idx * 200);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Export CAD & Manufacturing Files
              </h2>
              <p className="text-xs text-slate-400">
                Generate production-ready KiCad PCB S-expressions and RS-274X Gerbers for fabrication.
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

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* 1. KiCad Integration Section */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  KiCad 7 / 8 Native Files
                </h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                S-Expressions
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Open directly in KiCad Pcbnew. Preserves footprints, designators, pad net mappings, board edge cuts, and copper routing tracks.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleDownloadKiCadPcb}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download {project.name}.kicad_pcb
              </button>
              <button
                onClick={handleDownloadKiCadNetlist}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                Download {project.name}.net Netlist
              </button>
            </div>
          </div>

          {/* 2. RS-274X Gerber & Drill Package Section */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  RS-274X Gerber & Drill Package
                </h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                JLCPCB / PCBWay Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Standard 2:4 metric format with embedded aperture definitions and Excellon drill coordinates.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
              {Object.keys(gerbers).map((filename) => (
                <button
                  key={filename}
                  onClick={() => triggerDownload(filename, (gerbers as any)[filename])}
                  className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-left"
                >
                  <span className="truncate">{filename}</span>
                  <Download className="w-3 h-3 text-slate-500 ml-2 shrink-0" />
                </button>
              ))}
            </div>

            <button
              onClick={handleDownloadAllGerbers}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download All Gerber & Drill Files
            </button>
          </div>

          {downloadedFile && (
            <div className="p-3 bg-sky-950/40 border border-sky-500/40 rounded-lg flex items-center gap-2 text-sky-200 text-xs">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Downloaded <strong>{downloadedFile}</strong> successfully.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
