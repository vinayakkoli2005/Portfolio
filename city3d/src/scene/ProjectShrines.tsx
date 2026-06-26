import { content } from '../data/content';
import { Hologram } from './Hologram';

// Projects district is at [30, 0, -10] — arrange holograms in a pentagon
const DISTRICT_CENTER: [number, number, number] = [30, 0, -10];
const RADIUS = 5;

function shrinePositions(count: number): [number, number, number][] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return [
      DISTRICT_CENTER[0] + Math.cos(angle) * RADIUS,
      DISTRICT_CENTER[1] + 1.5,
      DISTRICT_CENTER[2] + Math.sin(angle) * RADIUS,
    ];
  });
}

export function ProjectShrines() {
  const positions = shrinePositions(content.projects.length);
  return (
    <>
      {content.projects.map((project, i) => (
        <Hologram key={project.id} project={project} position={positions[i]} />
      ))}
    </>
  );
}
