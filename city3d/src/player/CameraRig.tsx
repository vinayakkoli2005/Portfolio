import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../state/useStore';
import { cameraOffset } from './cameraMath';
import * as THREE from 'three';
import type { RefObject } from 'react';

const tmp = new THREE.Vector3();

export function CameraRig({
  targetRef,
  yawRef,
}: {
  targetRef: RefObject<THREE.Object3D | null>;
  yawRef: RefObject<number>;
}) {
  const camera = useThree((s) => s.camera);
  const mode = useStore((s) => s.cameraMode);

  useFrame(() => {
    const target = targetRef.current;
    if (!target) return;
    const yaw = yawRef.current ?? 0;
    const [ox, oy, oz] = cameraOffset(mode, yaw);
    tmp.set(
      target.position.x + ox,
      target.position.y + oy,
      target.position.z + oz
    );
    camera.position.lerp(tmp, 0.15);
    camera.lookAt(target.position.x, target.position.y + 1.4, target.position.z);
  });

  return null;
}
