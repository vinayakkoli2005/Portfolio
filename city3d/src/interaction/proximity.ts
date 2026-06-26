import type { District } from '../scene/layout';

type Vec3 = [number, number, number];

export function nearestDistrict(
  playerPos: Vec3,
  districts: District[],
  radius: number
): string | null {
  let closest: string | null = null;
  let closestDist = Infinity;

  for (const d of districts) {
    const dx = playerPos[0] - d.position[0];
    const dz = playerPos[2] - d.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < radius && dist < closestDist) {
      closestDist = dist;
      closest = d.id;
    }
  }

  return closest;
}
