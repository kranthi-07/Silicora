'use client';

import React, { useMemo } from 'react';
import { useWorkspaceStore } from '@/lib/store';
import {
  getLayerStyle,
  LayerHighlightEdges,
  computeSeparationTarget,
} from './model-layer-helper';

export function ComputeBoardModel({ variant = 'pico' }: { variant?: 'pico' | 'arduino' }) {
  const {
    cutawayActive,
    explodePercent,
    cutawayOffset,
    selectedLayerId,
    setSelectedLayerId,
    layerVisibility,
  } = useWorkspaceStore();

  const separationTarget = useMemo(() => {
    return computeSeparationTarget(cutawayActive, cutawayOffset, explodePercent, 0.8, 5.0);
  }, [cutawayActive, cutawayOffset, explodePercent]);

  const isLayerVisible = (id: string) => layerVisibility[id] !== false;

  const handlePointerDown = (e: any, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(selectedLayerId === layerId ? null : layerId);
  };

  // --- ARDUINO UNO R3 VARIANT ---
  if (variant === 'arduino') {
    const boardStyle = getLayerStyle('board', selectedLayerId);
    const atmegaStyle = getLayerStyle('atmega', selectedLayerId);
    const regulatorStyle = getLayerStyle('regulator', selectedLayerId);

    return (
      <group name="ArduinoUnoModel" position={[0, 0, 0]}>
        {/* 1. Classic Italian Blue FR-4 PCB */}
        {isLayerVisible('board') && (
          <group name="BoardLayer" onPointerDown={(e) => handlePointerDown(e, 'board')}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[10, 0.4, 7]} />
              <meshStandardMaterial
                color="#0284c7"
                roughness={0.5}
                opacity={boardStyle.opacity}
                transparent={boardStyle.transparent}
              />
              <LayerHighlightEdges isSelected={boardStyle.isSelected} />
            </mesh>

            {/* Silkscreen White Labeling */}
            <mesh position={[0.5, 0.22, -0.6]}>
              <planeGeometry args={[3.2, 0.6]} />
              <meshStandardMaterial
                color="#f8fafc"
                roughness={0.4}
                opacity={boardStyle.opacity}
                transparent={boardStyle.transparent}
              />
            </mesh>

            {/* USB Type-B Metal Jack */}
            <mesh position={[-4.2, 0.9, -1.8]}>
              <boxGeometry args={[2.4, 1.4, 1.8]} />
              <meshStandardMaterial
                color="#d1d5db"
                metalness={0.9}
                roughness={0.2}
                opacity={boardStyle.opacity}
                transparent={boardStyle.transparent}
              />
              <LayerHighlightEdges isSelected={boardStyle.isSelected} />
            </mesh>

            {/* DC Barrel Jack */}
            <mesh position={[-4.0, 1.0, 2.0]}>
              <boxGeometry args={[2.6, 1.6, 1.8]} />
              <meshStandardMaterial
                color="#1e293b"
                roughness={0.8}
                opacity={boardStyle.opacity}
                transparent={boardStyle.transparent}
              />
              <LayerHighlightEdges isSelected={boardStyle.isSelected} />
            </mesh>

            {/* Female Header Strips (Top & Bottom) */}
            <mesh position={[0.2, 0.8, -3.1 - separationTarget * 0.4]}>
              <boxGeometry args={[8.2, 1.2, 0.6]} />
              <meshStandardMaterial
                color="#1e293b"
                roughness={0.9}
                opacity={boardStyle.opacity}
                transparent={boardStyle.transparent}
              />
            </mesh>
            <mesh position={[0.2, 0.8, 3.1 + separationTarget * 0.4]}>
              <boxGeometry args={[8.2, 1.2, 0.6]} />
              <meshStandardMaterial
                color="#1e293b"
                roughness={0.9}
                opacity={boardStyle.opacity}
                transparent={boardStyle.transparent}
              />
            </mesh>
          </group>
        )}

        {/* 2. ATmega328P DIP-28 8-bit Microcontroller */}
        {isLayerVisible('atmega') && (
          <group
            name="AtmegaLayer"
            position={[1.2, 0.6 + separationTarget, 0.5]}
            onPointerDown={(e) => handlePointerDown(e, 'atmega')}
          >
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[4.2, 0.8, 1.4]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.75}
                opacity={atmegaStyle.opacity}
                transparent={atmegaStyle.transparent}
              />
              <LayerHighlightEdges isSelected={atmegaStyle.isSelected} />
            </mesh>
            {/* 28 Dual-In-Line Tinned Pins */}
            {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((x, i) => (
              <React.Fragment key={i}>
                <mesh position={[x, -0.4, -0.75]}>
                  <boxGeometry args={[0.15, 0.8, 0.15]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[x, -0.4, 0.75]}>
                  <boxGeometry args={[0.15, 0.8, 0.15]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        )}

        {/* 3. 5V LDO Onboard Voltage Regulator */}
        {isLayerVisible('regulator') && (
          <group
            name="RegulatorLayer"
            position={[-2.4, 0.6 + separationTarget * 0.7, -0.5]}
            onPointerDown={(e) => handlePointerDown(e, 'regulator')}
          >
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.4, 0.6, 1.2]} />
              <meshStandardMaterial
                color="#1e1b24"
                roughness={0.7}
                opacity={regulatorStyle.opacity}
                transparent={regulatorStyle.transparent}
              />
              <LayerHighlightEdges isSelected={regulatorStyle.isSelected} />
            </mesh>
            {/* Heat tab */}
            <mesh position={[0, 0.05, 0.7]}>
              <boxGeometry args={[1.2, 0.1, 0.5]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  // --- RASPBERRY PI PICO (RP2040) VARIANT ---
  const pcbStyle = getLayerStyle('pcb', selectedLayerId);
  const rp2040Style = getLayerStyle('rp2040', selectedLayerId);
  const flashStyle = getLayerStyle('flash', selectedLayerId);

  return (
    <group name="RaspberryPiPicoModel" position={[0, 0, 0]}>
      {/* 1. Green FR-4 Multi-Layer Substrate */}
      {isLayerVisible('pcb') && (
        <group name="PcbLayer" onPointerDown={(e) => handlePointerDown(e, 'pcb')}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[5.1, 0.35, 10.2]} />
            <meshStandardMaterial
              color="#047857"
              roughness={0.6}
              opacity={pcbStyle.opacity}
              transparent={pcbStyle.transparent}
            />
            <LayerHighlightEdges isSelected={pcbStyle.isSelected} />
          </mesh>

          {/* Micro-USB Port */}
          <mesh position={[0, 0.5, -4.9]}>
            <boxGeometry args={[1.5, 0.6, 1.4]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.85}
              roughness={0.25}
              opacity={pcbStyle.opacity}
              transparent={pcbStyle.transparent}
            />
            <LayerHighlightEdges isSelected={pcbStyle.isSelected} />
          </mesh>

          {/* BOOTSEL Button */}
          <mesh position={[-1.2, 0.4, -2.4]}>
            <boxGeometry args={[0.7, 0.4, 0.7]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.5}
              opacity={pcbStyle.opacity}
              transparent={pcbStyle.transparent}
            />
          </mesh>

          {/* Castellated Edge Pads on Left & Right */}
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((z, i) => (
            <React.Fragment key={i}>
              <mesh position={[-2.45, 0.18, z]}>
                <boxGeometry args={[0.3, 0.05, 0.5]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[2.45, 0.18, z]}>
                <boxGeometry args={[0.3, 0.05, 0.5]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      )}

      {/* 2. RP2040 Dual ARM Core Processor (Center QFN-56) */}
      {isLayerVisible('rp2040') && (
        <group
          name="Rp2040Layer"
          position={[0, 0.35 + separationTarget, -0.8]}
          onPointerDown={(e) => handlePointerDown(e, 'rp2040')}
        >
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 0.3, 1.8]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.85}
              roughness={0.25}
              opacity={rp2040Style.opacity}
              transparent={rp2040Style.transparent}
            />
            <LayerHighlightEdges isSelected={rp2040Style.isSelected} />
          </mesh>
          {/* Raspberry Pi Logo Silk Pad */}
          <mesh position={[0, 0.16, 0]}>
            <planeGeometry args={[1.0, 1.0]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.3}
              opacity={rp2040Style.opacity}
              transparent={rp2040Style.transparent}
            />
          </mesh>
        </group>
      )}

      {/* 3. 2MB QSPI NOR Flash Storage */}
      {isLayerVisible('flash') && (
        <group
          name="FlashLayer"
          position={[0, 0.35 + separationTarget * 0.7, 1.6]}
          onPointerDown={(e) => handlePointerDown(e, 'flash')}
        >
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.3, 0.25, 1.3]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.75}
              opacity={flashStyle.opacity}
              transparent={flashStyle.transparent}
            />
            <LayerHighlightEdges isSelected={flashStyle.isSelected} />
          </mesh>
        </group>
      )}
    </group>
  );
}
