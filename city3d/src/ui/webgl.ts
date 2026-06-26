import type { QualityTier } from '../state/useStore';

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function detectTier(): QualityTier {
  const cores = (navigator as any).hardwareConcurrency ?? 4;
  const mem = (navigator as any).deviceMemory ?? 4;
  const mobile = /Mobi|Android/i.test(navigator.userAgent);
  if (mobile && cores <= 4) return 'lite';
  if (mobile || cores <= 4 || mem <= 4) return 'medium';
  return 'high';
}
