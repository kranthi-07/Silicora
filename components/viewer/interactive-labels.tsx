'use client';

import React, { useState } from 'react';
import { PinAnchor } from '@/types/component';

export interface InteractivePinLabelsProps {
  pins: PinAnchor[];
  visible?: boolean;
}

export function InteractivePinLabels({ pins, visible = true }: InteractivePinLabelsProps) {
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  if (!visible || !pins || pins.length === 0) return null;

  return (
    <group name="PinAnchors3D">
      {pins.map((pin) => {
        const isHovered = hoveredPinId === pin.pinId;
        const isPower = pin.type === 'power';
        const isGround = pin.type === 'ground';
        const isInput = pin.type === 'input';

        const color = isHovered
          ? '#00f0ff'
          : isPower
          ? '#ef4444'
          : isGround
          ? '#10b981'
          : isInput
          ? '#38bdf8'
          : '#94a3b8';

        return (
          <group
            key={pin.pinId}
            position={[pin.positionMm.x, pin.positionMm.y, pin.positionMm.z]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredPinId(pin.pinId);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredPinId(null);
            }}
          >
            {/* Contact Dot: Only subtle when idle, crisp on hover */}
            <mesh>
              <sphereGeometry args={[isHovered ? 0.28 : 0.16, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isHovered ? 0.9 : 0.2}
                roughness={0.25}
                metalness={0.8}
                transparent={!isHovered}
                opacity={isHovered ? 1.0 : 0.5}
              />
            </mesh>

            {/* Glowing Anchor Ring: Only rendered when user hovers over the pin */}
            {isHovered && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.35, 0.48, 24]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.85}
                  side={2}
                />
              </mesh>
            )}

            {/* Pulsing Aura on Hover */}
            {isHovered && (
              <mesh>
                <sphereGeometry args={[0.55, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.2} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
