import type { CameraMode } from '../state/useStore';
export type Vec3 = [number, number, number];

const THIRD_DIST = 6;
const THIRD_HEIGHT = 3;
const HEAD_HEIGHT = 1.6;

export function cameraOffset(mode: CameraMode, yaw: number): Vec3 {
  if (mode === 'first') {
    return [Math.sin(yaw) * 0.1, HEAD_HEIGHT, Math.cos(yaw) * 0.1];
  }
  return [Math.sin(yaw) * THIRD_DIST, THIRD_HEIGHT, Math.cos(yaw) * THIRD_DIST];
}
