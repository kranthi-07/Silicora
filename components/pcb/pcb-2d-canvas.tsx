'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PcbProject,
  PcbPlacedComponent,
  PcbTrack,
  PcbLayerId,
  RatsnestAirwire,
} from '@/types/pcb';
import { getFootprint } from '@/lib/pcb/footprint-library';
import { calculateRatsnest } from '@/lib/pcb/circuit-to-pcb-adapter';
import { ZoomIn, ZoomOut, RotateCw, Move, Plus, Trash2 } from 'lucide-react';

interface Pcb2DCanvasProps {
  project: PcbProject;
  activeLayer: 'F_Cu' | 'B_Cu';
  selectedComponentId: string | null;
  selectedNetId: number | null;
  visibleLayers: Record<PcbLayerId, boolean>;
  onSelectComponent: (id: string | null) => void;
  onSelectNet: (netId: number | null) => void;
  onUpdateComponentPosition: (id: string, posMm: [number, number]) => void;
  onRotateComponent: (id: string) => void;
  onAddTrack: (track: PcbTrack) => void;
  onDeleteTrack?: (trackId: string) => void;
}

export function Pcb2DCanvas({
  project,
  activeLayer,
  selectedComponentId,
  selectedNetId,
  visibleLayers,
  onSelectComponent,
  onSelectNet,
  onUpdateComponentPosition,
  onRotateComponent,
  onAddTrack,
  onDeleteTrack,
}: Pcb2DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(6.0); // pixels per mm (default: 6px = 1mm)
  const [pan, setPan] = useState({ x: 60, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Routing state
  const [routingPadStart, setRoutingPadStart] = useState<{
    compId: string;
    padNumber: string;
    netId: number;
    x: number;
    y: number;
  } | null>(null);
  const [mouseBoardPos, setMouseBoardPos] = useState<[number, number]>([0, 0]);

  // Dragging component state
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<[number, number]>([0, 0]);

  const { widthMm, heightMm, cornerRadiusMm, mountingHoles } = project.boardOutline;
  const ratsnestAirwires = calculateRatsnest(project);

  // Convert client mouse coordinates to mm on the board
  const getBoardCoords = (e: React.MouseEvent): [number, number] => {
    if (!containerRef.current) return [0, 0];
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const xMm = (clientX - pan.x) / scale;
    const yMm = (clientY - pan.y) / scale;
    return [Math.round(xMm * 2) / 2, Math.round(yMm * 2) / 2]; // 0.5mm snap grid
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.shiftKey) {
      // Middle click or shift-click to pan
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getBoardCoords(e);
    setMouseBoardPos(coords);

    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (draggingCompId) {
      const comp = project.placedComponents.find((c) => c.id === draggingCompId);
      if (comp) {
        const newX = Math.max(5, Math.min(widthMm - 5, coords[0] - dragOffset[0]));
        const newY = Math.max(5, Math.min(heightMm - 5, coords[1] - dragOffset[1]));
        onUpdateComponentPosition(draggingCompId, [Math.round(newX), Math.round(newY)]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingCompId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((prev) => Math.min(20, Math.max(2, prev * zoomFactor)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none cursor-crosshair font-mono text-xs"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 2D Viewport Controls Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-md p-1 shadow-md backdrop-blur">
        <button
          onClick={() => setScale((s) => Math.min(20, s * 1.2))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(2, s * 0.8))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setScale(6.0);
            setPan({ x: 60, y: 50 });
          }}
          className="px-2 py-1 text-slate-300 hover:text-white text-[11px] rounded hover:bg-slate-800"
          title="Reset Zoom & Pan"
        >
          Fit
        </button>
        <div className="h-4 w-px bg-slate-700" />
        <span className="text-[11px] text-slate-400 px-1">
          X: {mouseBoardPos[0].toFixed(1)}mm Y: {mouseBoardPos[1].toFixed(1)}mm
        </span>
      </div>

      {/* Routing Mode Banner */}
      {routingPadStart && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-amber-500/20 border border-amber-500 text-amber-200 px-3 py-1.5 rounded-md backdrop-blur animate-pulse">
          <span>
            Drawing track on <strong className="text-white">{activeLayer}</strong> (Net {routingPadStart.netId})
          </span>
          <button
            onClick={() => setRoutingPadStart(null)}
            className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded"
          >
            Cancel (Esc)
          </button>
        </div>
      )}

      {/* Main SVG Render Surface */}
      <svg
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        <defs>
          {/* Grid pattern (1mm minor grid, 10mm major grid) */}
          <pattern id="pcb-grid-10" width={10 * scale} height={10 * scale} patternUnits="userSpaceOnUse">
            <path
              d={`M ${10 * scale} 0 L 0 0 0 ${10 * scale}`}
              fill="none"
              stroke="rgba(51, 65, 85, 0.4)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect
          x="-1000"
          y="-1000"
          width="4000"
          height="4000"
          fill="url(#pcb-grid-10)"
          className="pointer-events-none"
        />

        {/* 1. Board Substrate (FR-4 core) & Outline (Edge.Cuts) */}
        {visibleLayers.Edge_Cuts && (
          <g>
            <rect
              x="0"
              y="0"
              width={widthMm * scale}
              height={heightMm * scale}
              rx={cornerRadiusMm * scale}
              fill="#062e1a" // FR-4 Soldermask Green
              stroke="#fbbf24" // Gold edge cut boundary
              strokeWidth="2"
              className="transition-colors"
            />

            {/* Corner Mounting Holes */}
            {mountingHoles.map((hole, idx) => (
              <g key={`hole_${idx}`}>
                {/* Copper annular ring */}
                <circle
                  cx={hole.x * scale}
                  cy={hole.y * scale}
                  r={(hole.padDiameterMm / 2) * scale}
                  fill="#eab308"
                  opacity="0.9"
                />
                {/* Unplated / Plated drill hole */}
                <circle
                  cx={hole.x * scale}
                  cy={hole.y * scale}
                  r={(hole.drillDiameterMm / 2) * scale}
                  fill="#020617" // Hole through
                  stroke="#78350f"
                  strokeWidth="1"
                />
              </g>
            ))}
          </g>
        )}

        {/* 2. Bottom Copper Tracks (B.Cu) — Blue layer */}
        {visibleLayers.B_Cu && (
          <g opacity={activeLayer === 'B_Cu' ? 1.0 : 0.45}>
            {project.tracks
              .filter((t) => t.layer === 'B_Cu')
              .map((track) => {
                const isSelected = selectedNetId === track.netId;
                return (
                  <line
                    key={track.id}
                    x1={track.startMm[0] * scale}
                    y1={track.startMm[1] * scale}
                    x2={track.endMm[0] * scale}
                    y2={track.endMm[1] * scale}
                    stroke={isSelected ? '#38bdf8' : '#2563eb'}
                    strokeWidth={track.widthMm * scale}
                    strokeLinecap="round"
                    className="cursor-pointer hover:stroke-cyan-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNet(track.netId);
                    }}
                  />
                );
              })}
          </g>
        )}

        {/* 3. Top Copper Tracks (F.Cu) — Red/Amber layer */}
        {visibleLayers.F_Cu && (
          <g opacity={activeLayer === 'F_Cu' ? 1.0 : 0.45}>
            {project.tracks
              .filter((t) => t.layer === 'F_Cu')
              .map((track) => {
                const isSelected = selectedNetId === track.netId;
                return (
                  <line
                    key={track.id}
                    x1={track.startMm[0] * scale}
                    y1={track.startMm[1] * scale}
                    x2={track.endMm[0] * scale}
                    y2={track.endMm[1] * scale}
                    stroke={isSelected ? '#38bdf8' : '#ef4444'}
                    strokeWidth={track.widthMm * scale}
                    strokeLinecap="round"
                    className="cursor-pointer hover:stroke-amber-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNet(track.netId);
                    }}
                  />
                );
              })}
          </g>
        )}

        {/* In-Progress Track when drawing */}
        {routingPadStart && (
          <line
            x1={routingPadStart.x * scale}
            y1={routingPadStart.y * scale}
            x2={mouseBoardPos[0] * scale}
            y2={mouseBoardPos[1] * scale}
            stroke={activeLayer === 'F_Cu' ? '#f87171' : '#60a5fa'}
            strokeWidth={0.5 * scale}
            strokeDasharray="4 2"
            strokeLinecap="round"
          />
        )}

        {/* 4. Vias */}
        {project.vias.map((via) => (
          <g key={via.id}>
            <circle
              cx={via.positionMm[0] * scale}
              cy={via.positionMm[1] * scale}
              r={(via.padDiameterMm / 2) * scale}
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="1"
            />
            <circle
              cx={via.positionMm[0] * scale}
              cy={via.positionMm[1] * scale}
              r={(via.drillDiameterMm / 2) * scale}
              fill="#020617"
            />
          </g>
        ))}

        {/* 5. Placed Footprints & Pads */}
        {project.placedComponents.map((comp) => {
          const footprint = getFootprint(comp.footprintId);
          const isSelected = selectedComponentId === comp.id;
          const rad = (comp.rotationDeg * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);

          return (
            <g
              key={comp.id}
              className="cursor-move"
              onMouseDown={(e) => {
                e.stopPropagation();
                onSelectComponent(comp.id);
                setDraggingCompId(comp.id);
                const coords = getBoardCoords(e);
                setDragOffset([coords[0] - comp.positionMm[0], coords[1] - comp.positionMm[1]]);
              }}
            >
              {/* Component Silkscreen lines (F.SilkS) */}
              {visibleLayers.F_SilkS && (
                <g>
                  {footprint.silkscreenLines.map(([x1, y1, x2, y2], lIdx) => {
                    const rx1 = x1 * cos - y1 * sin + comp.positionMm[0];
                    const ry1 = x1 * sin + y1 * cos + comp.positionMm[1];
                    const rx2 = x2 * cos - y2 * sin + comp.positionMm[0];
                    const ry2 = x2 * sin + y2 * cos + comp.positionMm[1];
                    return (
                      <line
                        key={`silk_${lIdx}`}
                        x1={rx1 * scale}
                        y1={ry1 * scale}
                        x2={rx2 * scale}
                        y2={ry2 * scale}
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        opacity={isSelected ? 1.0 : 0.85}
                      />
                    );
                  })}

                  {footprint.silkscreenCircles?.map(([cx, cy, r], cIdx) => {
                    const rcx = cx * cos - cy * sin + comp.positionMm[0];
                    const rcy = cx * sin + cy * cos + comp.positionMm[1];
                    return (
                      <circle
                        key={`silk_circ_${cIdx}`}
                        cx={rcx * scale}
                        cy={rcy * scale}
                        r={r * scale}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        opacity={0.85}
                      />
                    );
                  })}

                  {/* Silkscreen Reference Designator */}
                  <text
                    x={comp.positionMm[0] * scale}
                    y={(comp.positionMm[1] - footprint.courtyardSizeMm[1] / 2 - 1.5) * scale}
                    fill={isSelected ? '#38bdf8' : '#ffffff'}
                    fontSize={Math.max(9, 1.8 * scale)}
                    textAnchor="middle"
                    fontWeight="bold"
                    className="select-none"
                  >
                    {comp.designator}
                  </text>
                </g>
              )}

              {/* Component Pads */}
              {footprint.pads.map((pad) => {
                const rotX = pad.offsetMm[0] * cos - pad.offsetMm[1] * sin;
                const rotY = pad.offsetMm[0] * sin + pad.offsetMm[1] * cos;
                const padAbsX = comp.positionMm[0] + rotX;
                const padAbsY = comp.positionMm[1] + rotY;

                const netId = comp.padNetMap[pad.padNumber];
                const isNetSelected = selectedNetId !== null && netId === selectedNetId;

                return (
                  <g
                    key={`pad_${pad.padNumber}`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (routingPadStart) {
                        // Complete track
                        if (routingPadStart.compId !== comp.id || routingPadStart.padNumber !== pad.padNumber) {
                          onAddTrack({
                            id: `trk_${Date.now()}`,
                            netId: routingPadStart.netId,
                            layer: activeLayer,
                            startMm: [routingPadStart.x, routingPadStart.y],
                            endMm: [padAbsX, padAbsY],
                            widthMm: 0.35,
                          });
                          setRoutingPadStart(null);
                        }
                      } else if (netId) {
                        // Start drawing track from this pad
                        setRoutingPadStart({
                          compId: comp.id,
                          padNumber: pad.padNumber,
                          netId,
                          x: padAbsX,
                          y: padAbsY,
                        });
                        onSelectNet(netId);
                      }
                    }}
                  >
                    {/* Solder Pad Outer Copper */}
                    {pad.shape === 'rect' ? (
                      <rect
                        x={(padAbsX - pad.sizeMm[0] / 2) * scale}
                        y={(padAbsY - pad.sizeMm[1] / 2) * scale}
                        width={pad.sizeMm[0] * scale}
                        height={pad.sizeMm[1] * scale}
                        fill={isNetSelected ? '#38bdf8' : '#f59e0b'} // Golden ENIG / HASL
                        stroke="#b45309"
                        strokeWidth="1"
                      />
                    ) : (
                      <circle
                        cx={padAbsX * scale}
                        cy={padAbsY * scale}
                        r={(pad.sizeMm[0] / 2) * scale}
                        fill={isNetSelected ? '#38bdf8' : '#f59e0b'}
                        stroke="#b45309"
                        strokeWidth="1"
                      />
                    )}

                    {/* Drill Hole */}
                    {pad.drillMm > 0 && (
                      <circle
                        cx={padAbsX * scale}
                        cy={padAbsY * scale}
                        r={(pad.drillMm / 2) * scale}
                        fill="#020617" // Black drill hole through FR-4
                      />
                    )}

                    {/* Pad Number Label */}
                    <text
                      x={padAbsX * scale}
                      y={(padAbsY + 0.3) * scale}
                      fill="#0f172a"
                      fontSize={Math.max(7, 1.2 * scale)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontWeight="bold"
                    >
                      {pad.padNumber}
                    </text>
                  </g>
                );
              })}

              {/* Selection Courtyard Box */}
              {isSelected && (
                <rect
                  x={(comp.positionMm[0] - footprint.courtyardSizeMm[0] / 2) * scale}
                  y={(comp.positionMm[1] - footprint.courtyardSizeMm[1] / 2) * scale}
                  width={footprint.courtyardSizeMm[0] * scale}
                  height={footprint.courtyardSizeMm[1] * scale}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}
            </g>
          );
        })}

        {/* 6. Ratsnest Airwires (Virtual CAD Layer) */}
        {visibleLayers.Ratsnest && (
          <g>
            {ratsnestAirwires.map((air) => (
              <line
                key={air.id}
                x1={air.startMm[0] * scale}
                y1={air.startMm[1] * scale}
                x2={air.endMm[0] * scale}
                y2={air.endMm[1] * scale}
                stroke="#facc15" // Yellow airwire
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.8"
                className="pointer-events-none"
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
