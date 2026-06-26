import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { Avatar } from './Avatar';
import { useStore } from '../state/useStore';

const SPEED = 6;
const keys: Record<string, boolean> = {};

export function PlayerController() {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const yaw = useRef(0);
  const movingRef = useRef(false);
  const [moving, setMoving] = useState(false);
  const { gl } = useThree();
  const toggleCamera = useStore((s) => s.toggleCamera);
  const cameraMode = useStore((s) => s.cameraMode);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === 'KeyV') toggleCamera();
    };
    const up = (e: KeyboardEvent) => { keys[e.code] = false; };
    const move = (e: MouseEvent) => {
      if (document.pointerLockElement === gl.domElement) {
        yaw.current -= e.movementX * 0.002;
      }
    };
    const click = () => gl.domElement.requestPointerLock?.();

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('mousemove', move);
    gl.domElement.addEventListener('click', click);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('mousemove', move);
      gl.domElement.removeEventListener('click', click);
    };
  }, [gl, toggleCamera]);

  useFrame(() => {
    const b = body.current;
    if (!b) return;

    const dir = new THREE.Vector3();
    if (keys['KeyW'] || keys['ArrowUp']) dir.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) dir.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) dir.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dir.x += 1;
    dir.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    const v = b.linvel();
    b.setLinvel({ x: dir.x * SPEED, y: v.y, z: dir.z * SPEED }, true);

    const isMoving = dir.lengthSq() > 0;
    if (isMoving !== movingRef.current) {
      movingRef.current = isMoving;
      setMoving(isMoving);
    }

    const t = b.translation();
    if (visual.current) {
      visual.current.position.set(t.x, t.y, t.z);
      if (isMoving) {
        visual.current.rotation.y = Math.atan2(dir.x, dir.z);
      }
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders={false}
        mass={1}
        enabledRotations={[false, false, false]}
        position={[0, 2, 50]}
      >
        <CapsuleCollider args={[0.6, 0.4]} />
      </RigidBody>
      <group ref={visual}>
        <Suspense
          fallback={
            <mesh castShadow position={[0, 1, 0]}>
              <capsuleGeometry args={[0.4, 1.2, 4, 8]} />
              <meshStandardMaterial color="#cfc3a0" />
            </mesh>
          }
        >
          {/* Avatar feet sit at the capsule bottom (capsule center is ~1 unit up) */}
          <group position={[0, -1, 0]}>
            <Avatar moving={moving} hidden={cameraMode === 'first'} />
          </group>
        </Suspense>
      </group>
      <CameraRig targetRef={visual} yawRef={yaw} />
    </>
  );
}
