import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '../data/content';

const HOLOGRAM_COLOR = '#00d4ff';

export function Hologram({
  project,
  position,
}: {
  project: Project;
  position: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group position={position}>
      {/* Rotating hologram crystal */}
      <group ref={group}>
        {/* Glow core */}
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color={HOLOGRAM_COLOR}
            emissive={HOLOGRAM_COLOR}
            emissiveIntensity={1.2}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Wireframe cage */}
        <mesh>
          <octahedronGeometry args={[0.75, 0]} />
          <meshBasicMaterial
            color={HOLOGRAM_COLOR}
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Pedestal */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 0.15, 8]} />
        <meshStandardMaterial color="#1a1008" emissive="#8B0000" emissiveIntensity={0.4} />
      </mesh>

      {/* Label in screen-space */}
      <Html
        position={[0, 1.6, 0]}
        center
        style={{
          pointerEvents: 'none',
          color: '#00d4ff',
          fontFamily: 'monospace',
          fontSize: '11px',
          fontWeight: 700,
          textShadow: '0 0 8px #00d4ff',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {project.title}
      </Html>
    </group>
  );
}
