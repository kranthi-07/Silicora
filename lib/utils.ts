import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatFrequency(hz: number): string {
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(2)} MHz`;
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(2)} kHz`;
  return `${hz.toFixed(1)} Hz`;
}

export function formatResistance(ohms: number): string {
  if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(2)} MΩ`;
  if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(2)} kΩ`;
  return `${ohms.toFixed(1)} Ω`;
}

export function formatCapacitance(farads: number): string {
  if (farads >= 1e-3) return `${(farads * 1e3).toFixed(1)} mF`;
  if (farads >= 1e-6) return `${(farads * 1e6).toFixed(1)} µF`;
  if (farads >= 1e-9) return `${(farads * 1e9).toFixed(1)} nF`;
  return `${(farads * 1e12).toFixed(1)} pF`;
}
