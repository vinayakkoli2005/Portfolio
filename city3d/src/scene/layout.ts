export type Vec3 = [number, number, number];

export const DISTRICTS: { id: string; label: string; position: Vec3; phase: number }[] = [
  { id: 'gateway',     label: 'Grand Gateway',      position: [0, 0, 40],    phase: 0 },
  { id: 'temple',      label: 'Central Temple',      position: [0, 0, 10],    phase: 1 },
  { id: 'artisans',    label: "Artisans' Quarter",   position: [-30, 0, 0],   phase: 2 },
  { id: 'projects',    label: 'Project Shrines',     position: [30, 0, -10],  phase: 3 },
  { id: 'scriptorium', label: 'The Scriptorium',     position: [-25, 0, -40], phase: 4 },
  { id: 'ghats',       label: 'The Ghats',           position: [0, 0, -60],   phase: 4 },
  { id: 'belltower',   label: 'Bell Tower',          position: [25, 0, -75],  phase: 5 },
];

export function getDistrict(id: string) {
  return DISTRICTS.find((d) => d.id === id);
}
