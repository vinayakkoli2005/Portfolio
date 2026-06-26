import { describe, it, expect } from 'vitest';
import { phaseForPosition } from './journey';
import { DISTRICTS } from './layout';

describe('phaseForPosition', () => {
  it('returns null when far from all districts', () => {
    expect(phaseForPosition([0, 0, 200], DISTRICTS, 10)).toBeNull();
  });

  it('returns the phase of the nearest district within radius', () => {
    // gateway is at [0,0,40], phase 0
    expect(phaseForPosition([0, 0, 40], DISTRICTS, 10)).toBe(0);
  });

  it('returns the phase of a later district (temple phase 1)', () => {
    // temple is at [0,0,10], phase 1
    expect(phaseForPosition([1, 0, 10], DISTRICTS, 10)).toBe(1);
  });

  it('returns the highest-phase district when multiple are in range', () => {
    // scriptorium [−25,0,−40] phase 4, ghats [0,0,−60] phase 4
    // Player very close to scriptorium → should get phase 4
    expect(phaseForPosition([-25, 0, -40], DISTRICTS, 10)).toBe(4);
  });

  it('ignores Y axis', () => {
    // belltower at [25,0,−75], phase 5
    expect(phaseForPosition([25, 999, -75], DISTRICTS, 10)).toBe(5);
  });
});
