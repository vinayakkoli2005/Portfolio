import type { District } from './layout';

type Vec3 = [number, number, number];

export function phaseForPosition(
  playerPos: Vec3,
  districts: District[],
  radius: number
): number | null {
  let result: number | null = null;

  for (const d of districts) {
    const dx = playerPos[0] - d.position[0];
    const dz = playerPos[2] - d.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < radius) {
      if (result === null || d.phase > result) {
        result = d.phase;
      }
    }
  }

  return result;
}

export const JOURNEY_CAPTIONS: Record<number, string> = {
  0: 'You enter the Grand Gateway — the city begins to breathe.',
  1: 'The Central Temple stands tall. Knowledge was built here.',
  2: "The Artisans' Quarter hums with craft and code.",
  3: 'Project Shrines glow. Each one a problem solved.',
  4: 'Words carved in stone. The Scriptorium and the Ghats.',
  5: 'The Bell Tower. You have seen the whole city.',
};
