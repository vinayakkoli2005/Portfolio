// Grand Gateway — ornate torana arch with two pillars and a multi-tiered gopuram top
export function Gateway({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh position={[-4, 4, 0]} castShadow>
        <boxGeometry args={[1.2, 8, 1.2]} />
        <meshStandardMaterial color="#6b4c2a" roughness={0.9} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[4, 4, 0]} castShadow>
        <boxGeometry args={[1.2, 8, 1.2]} />
        <meshStandardMaterial color="#6b4c2a" roughness={0.9} />
      </mesh>
      {/* Horizontal lintel */}
      <mesh position={[0, 8.5, 0]} castShadow>
        <boxGeometry args={[10, 1, 1.4]} />
        <meshStandardMaterial color="#8B5e3c" roughness={0.85} />
      </mesh>
      {/* Tier 1 of gopuram */}
      <mesh position={[0, 10, 0]} castShadow>
        <boxGeometry args={[7, 1.2, 1.4]} />
        <meshStandardMaterial color="#a0522d" roughness={0.8} />
      </mesh>
      {/* Tier 2 */}
      <mesh position={[0, 11.4, 0]} castShadow>
        <boxGeometry args={[5, 1.2, 1.2]} />
        <meshStandardMaterial color="#a0522d" roughness={0.8} />
      </mesh>
      {/* Tier 3 */}
      <mesh position={[0, 12.6, 0]} castShadow>
        <boxGeometry args={[3.5, 1, 1]} />
        <meshStandardMaterial color="#a0522d" roughness={0.8} />
      </mesh>
      {/* Spire top */}
      <mesh position={[0, 13.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.6, 1.6, 6]} />
        <meshStandardMaterial color="#d4a017" emissive="#8B6000" emissiveIntensity={0.4} roughness={0.5} />
      </mesh>
      {/* Gold finial */}
      <mesh position={[0, 14.7, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#b8860b" emissiveIntensity={0.6} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Decorative side pillars (smaller) */}
      {[-2.5, 2.5].map((x) => (
        <mesh key={x} position={[x, 9.5, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 2, 6]} />
          <meshStandardMaterial color="#d4a017" emissive="#7a5500" emissiveIntensity={0.3} roughness={0.6} />
        </mesh>
      ))}
      {/* Base platform */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[11, 0.4, 3]} />
        <meshStandardMaterial color="#5a3e28" roughness={0.95} />
      </mesh>
    </group>
  );
}
