import { useFrame } from '@react-three/fiber';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { DISTRICTS } from './layout';
import { phaseForPosition } from './journey';
import { useStore } from '../state/useStore';

const JOURNEY_RADIUS = 12;
const _pos = new THREE.Vector3();

export function JourneySystem({
  playerRef,
}: {
  playerRef: RefObject<THREE.Object3D | null>;
}) {
  const journeyPhase = useStore((s) => s.journeyPhase);
  const advancePhase = useStore((s) => s.advancePhase);

  useFrame(() => {
    const obj = playerRef.current;
    if (!obj) return;
    obj.getWorldPosition(_pos);
    const phase = phaseForPosition([_pos.x, _pos.y, _pos.z], DISTRICTS, JOURNEY_RADIUS);
    if (phase !== null && phase > journeyPhase) {
      advancePhase();
    }
  });

  return null;
}
