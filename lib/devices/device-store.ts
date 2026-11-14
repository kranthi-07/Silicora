import { create } from 'zustand';
import { DEVICES_DATA } from '@/data/devices-data';
import { DeviceItem, DeviceSubsystem, DeviceComponentPart } from '@/types/device';

interface DeviceState {
  selectedDeviceId: string;
  selectedSubsystemId: string | null;
  selectedPartId: string | null;
  viewMode: '3d' | 'blueprint' | 'block_diagram' | 'principles';
  explodePercent: number;

  setSelectedDeviceId: (id: string) => void;
  setSelectedSubsystemId: (id: string | null) => void;
  setSelectedPartId: (id: string | null) => void;
  setViewMode: (mode: '3d' | 'blueprint' | 'block_diagram' | 'principles') => void;
  setExplodePercent: (pct: number) => void;
  selectSubsystem: (sub: DeviceSubsystem) => void;
  selectPart: (part: DeviceComponentPart) => void;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  selectedDeviceId: DEVICES_DATA[0].id,
  selectedSubsystemId: null,
  selectedPartId: null,
  viewMode: '3d',
  explodePercent: 45,

  setSelectedDeviceId: (selectedDeviceId) => {
    set({
      selectedDeviceId,
      selectedSubsystemId: null,
      selectedPartId: null,
    });
  },

  setSelectedSubsystemId: (selectedSubsystemId) => set({ selectedSubsystemId }),
  setSelectedPartId: (selectedPartId) => set({ selectedPartId }),
  setViewMode: (viewMode) => set({ viewMode }),
  setExplodePercent: (explodePercent) => set({ explodePercent }),

  selectSubsystem: (sub) => {
    set({
      selectedSubsystemId: sub.id,
      selectedPartId: sub.components.length > 0 ? sub.components[0].id : null,
    });
  },

  selectPart: (part) => {
    set({
      selectedPartId: part.id,
      selectedSubsystemId: part.subsystemId,
    });
  },
}));
