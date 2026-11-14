'use client';

import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CalloutBadge3DProps {
  text: string;
  badgeColor?: string;
  borderColor?: string;
  textColor?: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  onClick?: () => void;
  scale?: number;
  subtext?: string;
}

export function CalloutBadge3D({
  text,
  badgeColor = '#161b22',
  borderColor = '#38bdf8',
  textColor = '#ffffff',
  position,
  targetPosition,
  onClick,
  scale = 1,
  subtext,
}: CalloutBadge3DProps) {
  const [hovered, setHovered] = useState(false);

  // Line points connecting badge to target
  const linePoints = React.useMemo(() => {
    return [new THREE.Vector3(...position), new THREE.Vector3(...targetPosition)];
  }, [position, targetPosition]);

  const lineGeometry = React.useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  const width = Math.max(2.4, text.length * 0.28) * scale;
  const height = (subtext ? 0.95 : 0.65) * scale;

  return (
    <group>
      {/* 1. Fine glowing leader line */}
      <primitive object={new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({
          color: hovered ? '#ffffff' : borderColor,
          transparent: true,
          opacity: hovered ? 1 : 0.75,
          linewidth: 1,
        })
      )} />

      {/* 2. Target anchor point dot */}
      <mesh position={targetPosition}>
        <sphereGeometry args={[0.09 * scale, 16, 16]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
      <mesh position={targetPosition}>
        <ringGeometry args={[0.12 * scale, 0.18 * scale, 16]} />
        <meshBasicMaterial color={borderColor} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Floating 3D Badge Pill */}
      <group
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* Background rounded plate */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            color={hovered ? '#ffffff' : badgeColor}
            transparent
            opacity={hovered ? 0.95 : 0.88}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outline border wireframe */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(width * 1.02, height * 1.02)]} />
          <lineBasicMaterial
            color={hovered ? '#ffffff' : borderColor}
            linewidth={2}
          />
        </lineSegments>

        {/* Text Label */}
        <Text
          position={[0, subtext ? 0.14 * scale : 0, 0.05]}
          fontSize={0.24 * scale}
          color={hovered ? '#000000' : textColor}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          letterSpacing={0.05}
        >
          {text}
        </Text>

        {/* Optional Subtext */}
        {subtext && (
          <Text
            position={[0, -0.2 * scale, 0.05]}
            fontSize={0.16 * scale}
            color={hovered ? '#1e293b' : '#94a3b8'}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.02}
          >
            {subtext}
          </Text>
        )}
      </group>
    </group>
  );
}
