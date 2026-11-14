'use client';

import React from 'react';
import { Edges } from '@react-three/drei';

export interface LayerStyle {
  opacity: number;
  transparent: boolean;
  isFaded: boolean;
  isSelected: boolean;
}

export function getLayerStyle(
  layerId: string,
  selectedLayerId: string | null,
  baseOpacity: number = 1.0,
  baseTransparent: boolean = false,
  xRayMode: boolean = false,
  isOuterShell: boolean = false
): LayerStyle {
  if (xRayMode && isOuterShell && selectedLayerId !== layerId) {
    return {
      opacity: 0.28,
      transparent: true,
      isFaded: false,
      isSelected: false,
    };
  }

  if (!selectedLayerId) {
    return {
      opacity: baseOpacity,
      transparent: baseTransparent,
      isFaded: false,
      isSelected: false,
    };
  }

  const isSelected = selectedLayerId === layerId;
  if (isSelected) {
    return {
      opacity: baseOpacity,
      transparent: baseTransparent,
      isFaded: false,
      isSelected: true,
    };
  }

  // Non-selected layers fade into a translucent ghost silhouette (0.18 opacity)
  return {
    opacity: 0.18,
    transparent: true,
    isFaded: true,
    isSelected: false,
  };
}

/**
 * Subtle, clean border outline highlight where user can barely see it (#38bdf8 sky blue)
 * Rendered on the selected layer without blinding neon emissive glow.
 */
export function LayerHighlightEdges({
  isSelected,
  threshold = 15,
  color = '#38bdf8',
}: {
  isSelected: boolean;
  threshold?: number;
  color?: string;
}) {
  if (!isSelected) return null;
  return <Edges color={color} threshold={threshold} renderOrder={10} />;
}

/**
 * Computes exact separation distance.
 * When cutawayOffset <= 0 and explodePercent === 0, returns EXACTLY 0 (fully closed & solid).
 */
export function computeSeparationTarget(
  cutawayActive: boolean,
  cutawayOffset: number,
  explodePercent: number,
  factor: number = 0.8,
  maxExplode: number = 6.0
): number {
  let sep = 0;
  if (cutawayActive && cutawayOffset > 0) {
    sep += cutawayOffset * factor;
  }
  if (explodePercent > 0) {
    sep += (explodePercent / 100) * maxExplode;
  }
  return sep;
}
