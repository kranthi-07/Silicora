'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { Dialog } from '@/components/ui/dialog';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComponentPhysicalIllustration, ComponentSchematicSymbol } from './component-graphics';
import {
  FileText,
  Pin,
  Terminal,
  Layers,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  GraduationCap,
  Lightbulb,
  ShieldAlert,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export function ComponentDetailDialog() {
  const {
    detailModalOpen,
    setDetailModalOpen,
    selectedComponent,
    activeDetailTab,
    setActiveDetailTab,
  } = useWorkspaceStore();

  const [copiedSpice, setCopiedSpice] = React.useState(false);

  if (!selectedComponent || !detailModalOpen) return null;

  const guide = selectedComponent.educational.beginnerGuide;

  const tabs = [
    { id: 'newbie', label: 'Newbie Guide & Polarity', icon: <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'overview', label: 'Datasheet & Ratings', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'pinout', label: `Pinout & Package (${selectedComponent.package.pins.length})`, icon: <Pin className="w-3.5 h-3.5" /> },
    { id: 'spice', label: 'SPICE Netlist Model', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'layers', label: `Cutaway Layers (${selectedComponent.visual3d.internalLayers.length})`, icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'failure', label: 'Physics & Failure Modes', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  ];

  const handleCopySpice = () => {
    navigator.clipboard.writeText(selectedComponent.electrical.rawSpiceModel);
    setCopiedSpice(true);
    setTimeout(() => setCopiedSpice(false), 2000);
  };

  return (
    <Dialog
      isOpen={detailModalOpen}
      onClose={() => setDetailModalOpen(false)}
      title={selectedComponent.name}
      description={`${selectedComponent.package.standardCode} Package · ${selectedComponent.package.mounting === 'through_hole' ? 'Through-Hole Technology (THT)' : 'Surface Mount Device (SMD)'}`}
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-5">
        {/* Visual Hero Header: Real Physical Illustration vs Schematic Symbol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#101318] border border-[#21262D]">
          {/* Physical Packaging Preview */}
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#161B22] border border-[#21262D]">
            <span className="text-[10px] font-mono uppercase text-[#8B949E] mb-2 font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#58A6FF]" />
              Real Physical Component
            </span>
            <div className="w-full h-24 flex items-center justify-center">
              <ComponentPhysicalIllustration componentId={selectedComponent.id} className="w-full h-full max-h-20" />
            </div>
            <span className="text-[10px] font-mono text-[#F0F6FC] mt-1">
              Package: {selectedComponent.package.standardCode} ({selectedComponent.package.pins.length} Pins)
            </span>
          </div>

          {/* IEEE Schematic Symbol */}
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#161B22] border border-[#21262D]">
            <span className="text-[10px] font-mono uppercase text-[#8B949E] mb-2 font-semibold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              IEEE Schematic Circuit Symbol
            </span>
            <div className="w-full h-24 flex items-center justify-center">
              <ComponentSchematicSymbol symbolType={selectedComponent.symbolType} className="w-full h-full max-h-20" />
            </div>
            <span className="text-[10px] font-mono text-[#F0F6FC] mt-1">
              Circuit Prefix: {selectedComponent.electrical.spicePrefix}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-[#30363D] pb-1">
          <Tabs
            tabs={tabs}
            activeTab={activeDetailTab}
            onChange={(id) => setActiveDetailTab(id as any)}
            variant="underline"
          />
        </div>

        {/* TAB 0: COMPLETE NEWBIE GUIDE & POLARITY */}
        {activeDetailTab === 'newbie' && guide && (
          <div className="space-y-4">
            {/* Plain English Analogy Banner */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 text-xs text-blue-200 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-blue-100 block text-sm mb-1">
                  What is this component in plain English?
                </strong>
                <p className="leading-relaxed text-blue-100/90">{guide.plainEnglishAnalogy}</p>
              </div>
            </div>

            {/* Polarity & Pin Identification Guide */}
            <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
              guide.polarityGuide.isPolarized
                ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider font-mono flex items-center gap-2 text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  {guide.polarityGuide.isPolarized ? '⚠️ POLARITY MATTERS (DIRECTIONAL COMPONENT)' : '✓ NON-POLARIZED (EITHER DIRECTION)'}
                </span>
                <Badge variant={guide.polarityGuide.isPolarized ? 'warning' : 'nominal'} size="xs">
                  {guide.polarityGuide.isPolarized ? 'MUST ORIENT CAREFULLY' : 'SAFE ANY WAY'}
                </Badge>
              </div>
              <p className="leading-relaxed text-[#F0F6FC] font-medium">
                {guide.polarityGuide.pinIdentificationRule}
              </p>
              {guide.polarityGuide.warningIfReversed && (
                <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                  <strong>What happens if plugged backwards:</strong> {guide.polarityGuide.warningIfReversed}
                </div>
              )}
            </div>

            {/* How to Spot It & Real-World Everyday Use */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#101318] border border-[#21262D] space-y-2">
                <h5 className="text-xs font-semibold text-[#F0F6FC] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#58A6FF]" />
                  How to Identify in Your Hand
                </h5>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  {guide.howToIdentify}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101318] border border-[#21262D] space-y-2">
                <h5 className="text-xs font-semibold text-[#F0F6FC] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Where It's Used in Everyday Gadgets
                </h5>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  {guide.realWorldExample}
                </p>
              </div>
            </div>

            {/* Beginner Mistakes to Avoid */}
            {guide.beginnerMistakesToAvoid && guide.beginnerMistakesToAvoid.length > 0 && (
              <div className="p-4 rounded-xl bg-[#161B22] border border-rose-900/40 space-y-2.5">
                <h5 className="text-xs font-semibold text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Top Beginner Mistakes to Avoid
                </h5>
                <ul className="space-y-1.5 text-xs text-[#C9D1D9]">
                  {guide.beginnerMistakesToAvoid.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: OVERVIEW & RATINGS */}
        {activeDetailTab === 'overview' && (
          <div className="space-y-5">
            {/* Tagline Banner */}
            <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs text-blue-200">
              <strong className="font-semibold block text-blue-100 mb-1">Physical Synopsis:</strong>
              {selectedComponent.educational.tagline}
            </div>

            {/* Absolute Maximum Ratings Matrix */}
            <div>
              <h4 className="text-xs font-semibold text-[#F0F6FC] uppercase tracking-wider font-mono mb-2.5">
                Absolute Maximum Ratings (Stress Envelopes)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 font-mono text-center">
                <div className="p-2.5 rounded-lg bg-[#101318] border border-[#21262D]">
                  <span className="text-[10px] text-[#6E7681] block">V_MAX</span>
                  <span className="text-sm font-bold text-[#F0F6FC] mt-0.5 block">
                    {selectedComponent.electrical.ratings.maxVoltageV} V
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#101318] border border-[#21262D]">
                  <span className="text-[10px] text-[#6E7681] block">I_MAX_CONT</span>
                  <span className="text-sm font-bold text-[#F0F6FC] mt-0.5 block">
                    {selectedComponent.electrical.ratings.maxCurrentContinuousA < 1
                      ? `${(selectedComponent.electrical.ratings.maxCurrentContinuousA * 1000).toFixed(0)} mA`
                      : `${selectedComponent.electrical.ratings.maxCurrentContinuousA} A`}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#101318] border border-[#21262D]">
                  <span className="text-[10px] text-[#6E7681] block">I_MAX_PEAK</span>
                  <span className="text-sm font-bold text-[#F0F6FC] mt-0.5 block">
                    {selectedComponent.electrical.ratings.maxCurrentPeakA} A
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#101318] border border-[#21262D]">
                  <span className="text-[10px] text-[#6E7681] block">P_DISS</span>
                  <span className="text-sm font-bold text-[#F0F6FC] mt-0.5 block">
                    {selectedComponent.electrical.ratings.maxPowerDissipationW} W
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#101318] border border-[#21262D]">
                  <span className="text-[10px] text-[#6E7681] block">T_J_MAX</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                    +{selectedComponent.electrical.ratings.maxJunctionTempC} °C
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#101318] border border-[#21262D]">
                  <span className="text-[10px] text-[#6E7681] block">R_TH_JA</span>
                  <span className="text-sm font-bold text-[#8B949E] mt-0.5 block">
                    {selectedComponent.electrical.thermal.rThetaJA} °C/W
                  </span>
                </div>
              </div>
            </div>

            {/* Physical Dimensions & Operating Principle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#101318] border border-[#21262D] space-y-2.5">
                <h5 className="text-xs font-semibold text-[#F0F6FC] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#58A6FF]" />
                  Mechanical Dimensions (Metric mm)
                </h5>
                <ul className="text-xs space-y-1.5 font-mono text-[#8B949E]">
                  <li>Width: <strong className="text-[#F0F6FC]">{selectedComponent.package.dimensionsMm.widthMm} mm</strong></li>
                  <li>Height: <strong className="text-[#F0F6FC]">{selectedComponent.package.dimensionsMm.heightMm} mm</strong></li>
                  <li>Depth: <strong className="text-[#F0F6FC]">{selectedComponent.package.dimensionsMm.depthMm} mm</strong></li>
                  <li>Lead Pitch: <strong className="text-[#F0F6FC]">{selectedComponent.package.pitchMm ?? 'N/A'} mm</strong></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#101318] border border-[#21262D] space-y-2">
                <h5 className="text-xs font-semibold text-[#F0F6FC]">
                  Semiconductor Operating Principle
                </h5>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  {selectedComponent.educational.physicalOperatingPrinciple}
                </p>
              </div>
            </div>

            {/* PDF Datasheet Link */}
            {selectedComponent.educational.datasheetUrl && (
              <div className="pt-2">
                <a
                  href={selectedComponent.educational.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#58A6FF] hover:underline font-mono"
                >
                  <span>Official Manufacturer PDF Datasheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PINOUT */}
        {activeDetailTab === 'pinout' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#30363D] overflow-hidden bg-[#101318] font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#161B22] border-b border-[#30363D] text-[#8B949E] text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Pin #</th>
                    <th className="p-3">Pin Name</th>
                    <th className="p-3">Electrical Type</th>
                    <th className="p-3">Position [X, Y, Z] mm</th>
                    <th className="p-3">Breadboard Grid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262D]">
                  {selectedComponent.package.pins.map((pin) => (
                    <tr key={pin.pinId} className="hover:bg-[#161B22]/50">
                      <td className="p-3 font-bold text-[#58A6FF]">{pin.pinNumber}</td>
                      <td className="p-3 font-semibold text-[#F0F6FC]">{pin.name}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            pin.type === 'power'
                              ? 'critical'
                              : pin.type === 'ground'
                              ? 'nominal'
                              : pin.type === 'output'
                              ? 'accent'
                              : 'outline'
                          }
                          size="xs"
                        >
                          {pin.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 text-[#8B949E]">
                        [{pin.positionMm.x}, {pin.positionMm.y}, {pin.positionMm.z}]
                      </td>
                      <td className="p-3">
                        {pin.breadboardCompatible ? (
                          <span className="text-emerald-400">Standard 2.54mm Grid</span>
                        ) : (
                          <span className="text-[#8B949E]">Custom Pitch</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SPICE MODEL */}
        {activeDetailTab === 'spice' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8B949E] font-mono">
                SPICE Prefix: <strong className="text-[#F0F6FC]">{selectedComponent.electrical.spicePrefix}</strong> · Class: <strong className="text-[#F0F6FC]">{selectedComponent.electrical.kind}</strong>
              </span>
              <Button
                variant="outline"
                size="xs"
                leftIcon={copiedSpice ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                onClick={handleCopySpice}
              >
                {copiedSpice ? 'Copied to Clipboard' : 'Copy SPICE Model'}
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-[#101318] border border-[#30363D] font-mono text-xs space-y-3">
              <div>
                <div className="text-[10px] text-[#8B949E] uppercase mb-1">Netlist Instantiation Template:</div>
                <code className="text-emerald-400 block bg-[#161B22] p-2.5 rounded-lg border border-[#21262D]">
                  {selectedComponent.electrical.netlistTemplate}
                </code>
              </div>

              <div>
                <div className="text-[10px] text-[#8B949E] uppercase mb-1">ngspice Mathematical Definition:</div>
                <pre className="text-blue-300 bg-[#161B22] p-3 rounded-lg border border-[#21262D] overflow-x-auto whitespace-pre-wrap leading-relaxed text-[11px]">
                  {selectedComponent.electrical.rawSpiceModel}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUTAWAY LAYERS */}
        {activeDetailTab === 'layers' && (
          <div className="space-y-3">
            <p className="text-xs text-[#8B949E]">
              Internal mechanical, semiconductor and metallurgy sub-assemblies exposed during 3D cutaway slicing:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {selectedComponent.visual3d.internalLayers.map((layer) => (
                <div
                  key={layer.layerId}
                  className="p-3.5 rounded-xl bg-[#101318] border border-[#21262D] flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="font-semibold text-[#F0F6FC]">{layer.displayName}</span>
                    </div>
                    <span className="text-[10px] text-[#6E7681] block mt-1">
                      Material: <span className="text-[#8B949E]">{layer.materialType.replace('_', ' ')}</span>
                    </span>
                    <span className="text-[10px] text-[#6E7681] block">
                      Scene Mesh: <span className="text-[#8B949E]">{layer.meshNodeName}</span>
                    </span>
                  </div>
                  <Badge variant={layer.canClip ? 'accent' : 'outline'} size="xs">
                    {layer.canClip ? 'CLIPPABLE' : 'RIGID'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FAILURE MODES */}
        {activeDetailTab === 'failure' && (
          <div className="space-y-3">
            <p className="text-xs text-[#8B949E]">
              Physical semiconductor failure mechanisms modeled during electrical overstress:
            </p>

            <div className="space-y-3">
              {selectedComponent.educational.commonFailureModes.map((failure, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      Trigger: {failure.trigger}
                    </span>
                    <Badge variant="critical" size="xs">
                      {failure.visualEffect.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[#8B949E]">
                    <strong className="text-[#F0F6FC] font-medium">Physical Consequence:</strong>{' '}
                    {failure.consequence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
