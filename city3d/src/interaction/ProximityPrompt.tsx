import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { DISTRICTS } from '../scene/layout';
import { useStore } from '../state/useStore';
import { nearestDistrict } from './proximity';

const RADIUS = 10;
const _pos = new THREE.Vector3();

export function ProximityPrompt({
  playerRef,
}: {
  playerRef: React.RefObject<THREE.Object3D | null>;
}) {
  const setActiveDistrict = useStore((s) => s.setActiveDistrict);
  const lastId = useRef<string | null>(null);

  useFrame(() => {
    const obj = playerRef.current;
    if (!obj) return;
    obj.getWorldPosition(_pos);
    const id = nearestDistrict([_pos.x, _pos.y, _pos.z], DISTRICTS, RADIUS);
    if (id !== lastId.current) {
      lastId.current = id;
      setActiveDistrict(id);
    }
  });

  return null;
}
