import { describe, it, expect } from 'vitest';
import { DISTRICTS, getDistrict } from './layout';

describe('layout', () => {
  it('defines exactly 7 districts with unique ids', () => {
    expect(DISTRICTS.length).toBe(7);
    const ids = new Set(DISTRICTS.map((d) => d.id));
    expect(ids.size).toBe(7);
  });

  it('every district has a finite 3D position', () => {
    for (const d of DISTRICTS) {
      expect(d.position).toHaveLength(3);
      d.position.forEach((c) => expect(Number.isFinite(c)).toBe(true));
    }
  });

  it('getDistrict returns the matching district', () => {
    expect(getDistrict('temple')?.label).toContain('Temple');
  });
});
