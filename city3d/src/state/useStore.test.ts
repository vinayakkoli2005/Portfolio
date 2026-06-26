import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, TOTAL_PHASES } from './useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({ cameraMode: 'third', journeyPhase: 0, activeDistrict: null });
  });

  it('toggles camera mode', () => {
    expect(useStore.getState().cameraMode).toBe('third');
    useStore.getState().toggleCamera();
    expect(useStore.getState().cameraMode).toBe('first');
    useStore.getState().toggleCamera();
    expect(useStore.getState().cameraMode).toBe('third');
  });

  it('advances phase but never past the last phase', () => {
    for (let i = 0; i < TOTAL_PHASES + 5; i++) useStore.getState().advancePhase();
    expect(useStore.getState().journeyPhase).toBe(TOTAL_PHASES - 1);
  });

  it('sets active district', () => {
    useStore.getState().setActiveDistrict('temple');
    expect(useStore.getState().activeDistrict).toBe('temple');
  });
});
