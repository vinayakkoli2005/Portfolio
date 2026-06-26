import { Physics, RigidBody } from '@react-three/rapier';
import { Environment } from './Environment';
import { DISTRICTS } from './layout';
import { PlayerController } from '../player/PlayerController';
import { ProjectShrines } from './ProjectShrines';
import { PostFX } from './PostFX';

export function City() {
  return (
    <>
      <Physics gravity={[0, -20, 0]}>
        <Environment />
        {/* Physics ground */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[400, 0.2, 400]} />
            <meshStandardMaterial color="#2a2320" />
          </mesh>
        </RigidBody>
        {/* Placeholder district boxes with collision */}
        {DISTRICTS.map((d) => (
          <RigidBody key={d.id} type="fixed" colliders="cuboid" position={[d.position[0], 2, d.position[2]]}>
            <mesh castShadow>
              <boxGeometry args={[6, 4, 6]} />
              <meshStandardMaterial color="#8B0000" />
            </mesh>
          </RigidBody>
        ))}
        <PlayerController />
        <ProjectShrines />
      </Physics>
      <PostFX />
    </>
  );
}
