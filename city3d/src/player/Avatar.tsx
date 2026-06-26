import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AVATAR_URL = '/city3d/assets/avatar.gltf';

export function Avatar({ moving, hidden }: { moving: boolean; hidden: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(AVATAR_URL);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const next = moving ? actions['Walk'] : actions['Idle'];
    next?.reset().fadeIn(0.2).play();
    return () => void next?.fadeOut(0.2);
  }, [moving, actions]);

  return (
    <group ref={group} visible={!hidden}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(AVATAR_URL);
