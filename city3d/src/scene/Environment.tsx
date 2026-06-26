import { Sky } from '@react-three/drei';

export function Environment() {
  return (
    <>
      <color attach="background" args={['#0D0D0D']} />
      <fog attach="fog" args={['#0D0D0D', 25, 120]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} color="#ffd9a0" castShadow />
      <Sky sunPosition={[10, 2, 8]} turbidity={8} rayleigh={2} />
    </>
  );
}
