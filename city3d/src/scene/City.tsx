import { Physics, RigidBody } from '@react-three/rapier';
import { Environment } from './Environment';
import { PlayerController } from '../player/PlayerController';
import { ProjectShrines } from './ProjectShrines';
import { PostFX } from './PostFX';
import { Gateway } from './buildings/Gateway';
import { Temple } from './buildings/Temple';
import { ArtisansQuarter } from './buildings/ArtisansQuarter';
import { Scriptorium } from './buildings/Scriptorium';
import { Ghats } from './buildings/Ghats';
import { BellTower } from './buildings/BellTower';

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

        {/* Invisible collision for each building district */}
        {[
          { id: 'gateway',     pos: [0,   1.5, 40]   as [number,number,number] },
          { id: 'temple',      pos: [0,   1.5, 10]   as [number,number,number] },
          { id: 'artisans',    pos: [-30, 1.5, 0]    as [number,number,number] },
          { id: 'scriptorium', pos: [-25, 1.5, -40]  as [number,number,number] },
          { id: 'ghats',       pos: [0,   1.5, -60]  as [number,number,number] },
          { id: 'belltower',   pos: [25,  1.5, -75]  as [number,number,number] },
        ].map((d) => (
          <RigidBody key={d.id} type="fixed" colliders="cuboid" position={d.pos}>
            <mesh visible={false}>
              <boxGeometry args={[10, 3, 10]} />
              <meshStandardMaterial />
            </mesh>
          </RigidBody>
        ))}

        <PlayerController />

        {/* Decorative buildings (visual only — collision handled above) */}
        <Gateway     position={[0,   0, 40]}  />
        <Temple      position={[0,   0, 10]}  />
        <ArtisansQuarter position={[-30, 0, 0]}   />
        <Scriptorium position={[-25, 0, -40]} />
        <Ghats       position={[0,   0, -60]} />
        <BellTower   position={[25,  0, -75]} />

        {/* Project Shrines — holograms (own collision not needed, passthrough) */}
        <ProjectShrines />
      </Physics>
      <PostFX />
    </>
  );
}
