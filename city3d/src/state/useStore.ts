import { create } from 'zustand';

export type CameraMode = 'first' | 'third';
export type QualityTier = 'high' | 'medium' | 'lite';
export const TOTAL_PHASES = 6;

type State = {
  cameraMode: CameraMode;
  toggleCamera: () => void;
  journeyPhase: number;
  advancePhase: () => void;
  setPhase: (n: number) => void;
  activeDistrict: string | null;
  setActiveDistrict: (id: string | null) => void;
  showSkipModal: boolean;
  setShowSkipModal: (b: boolean) => void;
  loaded: boolean;
  setLoaded: (b: boolean) => void;
  qualityTier: QualityTier;
  setQualityTier: (t: QualityTier) => void;
};

export const useStore = create<State>((set) => ({
  cameraMode: 'third',
  toggleCamera: () =>
    set((s) => ({ cameraMode: s.cameraMode === 'third' ? 'first' : 'third' })),
  journeyPhase: 0,
  advancePhase: () =>
    set((s) => ({ journeyPhase: Math.min(s.journeyPhase + 1, TOTAL_PHASES - 1) })),
  setPhase: (n) => set({ journeyPhase: Math.max(0, Math.min(n, TOTAL_PHASES - 1)) }),
  activeDistrict: null,
  setActiveDistrict: (id) => set({ activeDistrict: id }),
  showSkipModal: false,
  setShowSkipModal: (b) => set({ showSkipModal: b }),
  loaded: false,
  setLoaded: (b) => set({ loaded: b }),
  qualityTier: 'high',
  setQualityTier: (t) => set({ qualityTier: t }),
}));
