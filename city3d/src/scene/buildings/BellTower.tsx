// Bell Tower — a tall dhvajastambha (flag pillar) with a domed pavilion and hanging bell
export function BellTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Octagonal base */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3, 3.5, 1.2, 8]} />
        <meshStandardMaterial color="#5a3e28" roughness={0.95} />
      </mesh>
      {/* Second plinth */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[2.5, 3, 0.8, 8]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.9} />
      </mesh>

      {/* Main tower shaft */}
      <mesh position={[0, 7, 0]} castShadow>
        <cylinderGeometry args={[1.0, 1.6, 10, 8]} />
        <meshStandardMaterial color="#8B5e3c" roughness={0.85} />
      </mesh>

      {/* Pavilion ring */}
      <mesh position={[0, 12.4, 0]} castShadow>
        <cylinderGeometry args={[2.2, 1.5, 0.9, 12]} />
        <meshStandardMaterial color="#7a3b1e" roughness={0.8} />
      </mesh>
      {/* Dome */}
      <mesh position={[0, 13.5, 0]} castShadow>
        <sphereGeometry args={[1.8, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#a0522d" roughness={0.75} />
      </mesh>

      {/* Spire */}
      <mesh position={[0, 15.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.35, 3.5, 6]} />
        <meshStandardMaterial color="#d4a017" emissive="#7a5500" emissiveIntensity={0.5} roughness={0.5} />
      </mesh>
      {/* Gold top */}
      <mesh position={[0, 17.1, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#b8860b" emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hanging bell */}
      <mesh position={[0, 11.5, 0]}>
        <cylinderGeometry args={[0.5, 0.3, 0.8, 10, 1, true]} />
        <meshStandardMaterial color="#c8a060" emissive="#6a4000" emissiveIntensity={0.4} roughness={0.4} metalness={0.6} side={2} />
      </mesh>
      <mesh position={[0, 11.1, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#c8a060" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Bell glow light */}
      <pointLight position={[0, 13, 0]} color="#ffd080" intensity={1.5} distance={20} />

      {/* 4 corner torches */}
      {[[-2.5, -2.5], [-2.5, 2.5], [2.5, -2.5], [2.5, 2.5]].map(([x, z], i) => (
        <group key={i} position={[x, 1.8, z]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.12, 1.5, 6]} />
            <meshStandardMaterial color="#5a3e28" roughness={0.95} />
          </mesh>
          <pointLight position={[0, 1.0, 0]} color="#ff6600" intensity={0.8} distance={8} />
        </group>
      ))}
    </group>
  );
}
