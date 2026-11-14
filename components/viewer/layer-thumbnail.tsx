'use client';

import React from 'react';

interface LayerThumbnailProps {
  layerId: string;
  materialType: string;
  colorHex?: string;
  className?: string;
}

/**
 * High-definition visual vector illustration representing individual physical layers.
 * Replaces long text strings with intuitive, graphic thumbnails.
 */
export function LayerThumbnail({ layerId, materialType, colorHex, className = 'w-6 h-6' }: LayerThumbnailProps) {
  const normalizedId = layerId.toLowerCase();

  // 1. Helical Spiral Film or Winding Coils
  if (normalizedId.includes('spiral') || normalizedId.includes('film') || normalizedId.includes('winding') || normalizedId.includes('coil')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none">
        <rect x="2" y="4" width="28" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        <path
          d="M6 16 C8 10, 12 10, 14 16 C16 22, 20 22, 22 16 C24 10, 26 10, 26 16"
          stroke={colorHex || '#F59E0B'}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="6" cy="16" r="2" fill="#F59E0B" />
        <circle cx="26" cy="16" r="2" fill="#F59E0B" />
      </svg>
    );
  }

  // 2. Semiconductor Die (Silicon / LED / BJT / MOSFET / IC)
  if (normalizedId.includes('die') || normalizedId.includes('silicon')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none">
        <rect x="2" y="4" width="28" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        {/* Silicon Die Substrate */}
        <rect x="7" y="8" width="18" height="16" rx="2" fill="#1E293B" stroke="#0284C7" strokeWidth="1.5" />
        {/* Micro-Circuit Traces & Active Junction */}
        <rect x="11" y="12" width="10" height="8" rx="1" fill="#38BDF8" fillOpacity="0.4" />
        <circle cx="16" cy="16" r="2" fill="#38BDF8" />
        <line x1="7" y1="12" x2="11" y2="12" stroke="#FBBF24" strokeWidth="1" />
        <line x1="21" y1="12" x2="25" y2="12" stroke="#FBBF24" strokeWidth="1" />
      </svg>
    );
  }

  // 3. Gold Wirebonds
  if (normalizedId.includes('wire') || normalizedId.includes('wirebond')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none">
        <rect x="2" y="4" width="28" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        {/* Arched Gold Bond Wires */}
        <path d="M 6 22 C 10 8, 14 8, 16 18" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M 16 18 C 18 10, 22 10, 26 22" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <circle cx="6" cy="22" r="1.5" fill="#F59E0B" />
        <circle cx="16" cy="18" r="1.5" fill="#F59E0B" />
        <circle cx="26" cy="22" r="1.5" fill="#F59E0B" />
      </svg>
    );
  }

  // 4. Ceramic Core / Insulator Rod
  if (normalizedId.includes('core') || normalizedId.includes('ceramic') || normalizedId.includes('base')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none">
        <rect x="2" y="4" width="28" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        {/* Ceramic Alumina Cylinder */}
        <rect x="6" y="9" width="20" height="14" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="12" y1="9" x2="12" y2="23" stroke="#CBD5E1" strokeWidth="1" />
        <line x1="20" y1="9" x2="20" y2="23" stroke="#CBD5E1" strokeWidth="1" />
      </svg>
    );
  }

  // 5. Metal End Caps / Leadframe / Terminals / Anvil
  if (normalizedId.includes('cap') || normalizedId.includes('leadframe') || normalizedId.includes('frame') || normalizedId.includes('cup')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none">
        <rect x="2" y="4" width="28" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        {/* Left Metal Cap & Lead */}
        <line x1="4" y1="16" x2="10" y2="16" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="10" y="8" width="4" height="16" rx="1" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
        {/* Right Metal Cap & Lead */}
        <rect x="18" y="8" width="4" height="16" rx="1" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
        <line x1="22" y1="16" x2="28" y2="16" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 6. Rubber Bung / Sealing Gasket
  if (normalizedId.includes('bung') || normalizedId.includes('seal')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none">
        <rect x="2" y="4" width="28" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        <ellipse cx="16" cy="16" rx="10" ry="7" fill="#1E293B" stroke="#475569" strokeWidth="2" />
        <circle cx="12" cy="16" r="2" fill="#0F172A" />
        <circle cx="20" cy="16" r="2" fill="#0F172A" />
      </svg>
    );
  }

  // 7. Optical LED Epoxy Lens
  if (normalizedId.includes('lens')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none">
        <rect x="2" y="4" width="28" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        {/* Domed Lens Profile with Internal Reflection */}
        <path d="M 9 22 C 9 12, 12 7, 16 7 C 20 7, 23 12, 23 22 Z" fill="#EF4444" fillOpacity="0.4" stroke="#EF4444" strokeWidth="1.5" />
        <path d="M 12 11 Q 14 9 16 9" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }

  // 8. Default Outer Protective Shell / Epoxy Mold Body / PVC Sleeve / Can
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <rect x="2" y="4" width="28" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
      {/* Outer Protective Casing Body */}
      <rect
        x="6"
        y="9"
        width="20"
        height="14"
        rx="3"
        fill={colorHex || '#0284C7'}
        fillOpacity="0.6"
        stroke={colorHex || '#0284C7'}
        strokeWidth="1.5"
      />
      {/* Color stripe or texture indicator */}
      <line x1="12" y1="9" x2="12" y2="23" stroke="#F59E0B" strokeWidth="1.5" />
      <line x1="16" y1="9" x2="16" y2="23" stroke="#DC2626" strokeWidth="1.5" />
      <line x1="20" y1="9" x2="20" y2="23" stroke="#EA580C" strokeWidth="1.5" />
    </svg>
  );
}
