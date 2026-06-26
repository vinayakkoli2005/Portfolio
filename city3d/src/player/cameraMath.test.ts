import { describe, it, expect } from 'vitest';
import { cameraOffset } from './cameraMath';

describe('cameraOffset', () => {
  it('first-person offset is near head height and close in', () => {
    const [x, y, z] = cameraOffset('first', 0);
    expect(y).toBeCloseTo(1.6, 1);
    expect(Math.hypot(x, z)).toBeLessThan(0.5);
  });

  it('third-person offset sits behind and above', () => {
    const [, y, z] = cameraOffset('third', 0);
    expect(y).toBeGreaterThan(2);
    expect(z).toBeGreaterThan(2);
  });
});
