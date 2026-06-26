import { describe, it, expect } from 'vitest';
import { nearestDistrict } from './proximity';
import { DISTRICTS } from '../scene/layout';

describe('nearestDistrict', () => {
  it('returns null when player is far from all districts', () => {
    const result = nearestDistrict([0, 0, 200], DISTRICTS, 8);
    expect(result).toBeNull();
  });

  it('returns district id when player is within radius', () => {
    const gateway = DISTRICTS.find((d) => d.id === 'gateway')!;
    const [gx, , gz] = gateway.position;
    const result = nearestDistrict([gx + 2, 0, gz + 2], DISTRICTS, 8);
    expect(result).toBe('gateway');
  });

  it('returns the closest district when inside multiple radii', () => {
    // Put player exactly between gateway and temple, but closer to temple
    const temple = DISTRICTS.find((d) => d.id === 'temple')!;
    const [tx, , tz] = temple.position;
    const result = nearestDistrict([tx + 1, 0, tz + 1], DISTRICTS, 20);
    expect(result).toBe('temple');
  });

  it('returns null when player is exactly at radius boundary (exclusive)', () => {
    const gateway = DISTRICTS.find((d) => d.id === 'gateway')!;
    const [gx, , gz] = gateway.position;
    // Distance = sqrt(8^2 + 0^2) = 8, which is NOT less than radius 8
    const result = nearestDistrict([gx + 8, 0, gz], DISTRICTS, 8);
    expect(result).toBeNull();
  });

  it('uses XZ plane distance only (ignores Y)', () => {
    const gateway = DISTRICTS.find((d) => d.id === 'gateway')!;
    const [gx, , gz] = gateway.position;
    const result = nearestDistrict([gx, 100, gz], DISTRICTS, 8);
    expect(result).toBe('gateway');
  });
});
