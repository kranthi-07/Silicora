'use client';

import React from 'react';
import { DeviceItem, BlockDiagramNode } from '@/types/device';
import { cn } from '@/lib/utils';
import { Cpu, Zap, Activity, Radio, HardDrive, Eye } from 'lucide-react';

interface DeviceBlockDiagramProps {
  device: DeviceItem;
  selectedSubsystemId: string | null;
  onSelectSubsystemId: (subsystemId: string) => void;
}

export function DeviceBlockDiagram({
  device,
  selectedSubsystemId,
  onSelectSubsystemId,
}: DeviceBlockDiagramProps) {
  const getNodeCategoryColor = (cat: BlockDiagramNode['category']) => {
    switch (cat) {
      case 'power':
        return { border: '#EAB308', bg: 'rgba(234, 179, 8, 0.1)', text: '#FDE047' };
      case 'processor':
        return { border: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', text: '#93C5FD' };
      case 'memory':
        return { border: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', text: '#6EE7B7' };
      case 'rf':
        return { border: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)', text: '#D8B4FE' };
      case 'sensor':
        return { border: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)', text: '#F472B6' };
      case 'actuator':
        return { border: '#F97316', bg: 'rgba(249, 115, 22, 0.1)', text: '#FDBA74' };
      case 'io':
      default:
        return { border: '#64748B', bg: 'rgba(100, 116, 139, 0.1)', text: '#CBD5E1' };
    }
  };

  const getNodeIcon = (cat: BlockDiagramNode['category']) => {
    switch (cat) {
      case 'power':
        return <Zap className="w-3.5 h-3.5" />;
      case 'processor':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'memory':
        return <HardDrive className="w-3.5 h-3.5" />;
      case 'rf':
        return <Radio className="w-3.5 h-3.5" />;
      case 'actuator':
        return <Activity className="w-3.5 h-3.5" />;
      case 'io':
      default:
        return <Eye className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#090B0E] p-6 overflow-y-auto custom-scrollbar select-none">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#F0F6FC] tracking-tight">
          System Functional Block Diagram: {device.name}
        </h3>
        <p className="text-xs text-[#8B949E] mt-0.5">
          Interactive topology of primary power stages, data buses, and peripheral controllers. Click any block to isolate its physical subsystem.
        </p>
      </div>

      {/* SVG Canvas Container */}
      <div className="flex-1 min-h-[480px] relative rounded-2xl bg-[#101318] border border-[#30363D] overflow-hidden p-6">
        <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker
              id="arrow-power"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#EAB308" />
            </marker>
            <marker
              id="arrow-data"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
            </marker>
            <marker
              id="arrow-control"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#A855F7" />
            </marker>
          </defs>

          {/* Bus Connection Lines */}
          {device.blockDiagramConnections.map((conn, idx) => {
            const fromNode = device.blockDiagramNodes.find((n) => n.id === conn.fromNodeId);
            const toNode = device.blockDiagramNodes.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x * 10;
            const y1 = fromNode.y * 6;
            const x2 = toNode.x * 10;
            const y2 = toNode.y * 6;

            const strokeColor =
              conn.busType === 'power'
                ? '#EAB308'
                : conn.busType === 'control'
                ? '#A855F7'
                : conn.busType === 'analog'
                ? '#EC4899'
                : '#38BDF8';

            const markerId =
              conn.busType === 'power'
                ? 'url(#arrow-power)'
                : conn.busType === 'control'
                ? 'url(#arrow-control)'
                : 'url(#arrow-data)';

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={idx}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeDasharray={conn.busType === 'control' ? '4 4' : undefined}
                  markerEnd={markerId}
                  opacity="0.85"
                />
                {conn.label && (
                  <text
                    x={midX}
                    y={midY - 8}
                    fill={strokeColor}
                    fontSize="11"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none font-semibold"
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Diagram Nodes */}
          {device.blockDiagramNodes.map((node) => {
            const colors = getNodeCategoryColor(node.category);
            const cx = node.x * 10;
            const cy = node.y * 6;
            const isSelected = selectedSubsystemId === node.subsystemId;

            return (
              <g
                key={node.id}
                onClick={() => onSelectSubsystemId(node.subsystemId)}
                className="cursor-pointer transition-transform duration-150 hover:scale-105"
                transform={`translate(${cx}, ${cy})`}
              >
                <rect
                  x="-75"
                  y="-32"
                  width="150"
                  height="64"
                  rx="10"
                  fill={isSelected ? '#1E293B' : colors.bg}
                  stroke={isSelected ? '#38BDF8' : colors.border}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />
                <text
                  x="0"
                  y="4"
                  fill={colors.text}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {node.label}
                </text>
                <text
                  x="0"
                  y="20"
                  fill="#8B949E"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="uppercase tracking-wider"
                >
                  {node.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
