import { Environment } from './Environment';
import { DISTRICTS } from './layout';

export function City() {
  return (
    <>
      <Environment />
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#2a2320" />
      </mesh>
      {/* Placeholder boxes for each district */}
      {DISTRICTS.map((d) => (
        <mesh key={d.id} position={[d.position[0], 2, d.position[2]]} castShadow>
          <boxGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
      ))}
    </>
  );
}
