// The Scriptorium — a pillared hall with a flat pavilion roof (mandapa style)
function Column({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color="#5a3e28" roughness={0.95} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 5.2, 8]} />
        <meshStandardMaterial color="#8B5e3c" roughness={0.85} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[0.65, 0.4, 0.65]} />
        <meshStandardMaterial color="#d4a017" emissive="#7a5500" emissiveIntensity={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Scriptorium({ position }: { position: [number, number, number] }) {
  const cols: [number, number][] = [
    [-5, -4], [-5, 0], [-5, 4],
    [5, -4],  [5, 0],  [5, 4],
    [0, -4],  [0, 4],
  ];

  return (
    <group position={position}>
      {/* Columns */}
      {cols.map(([x, z], i) => <Column key={i} x={x} z={z} />)}

      {/* Roof slab */}
      <mesh position={[0, 5.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[13, 0.5, 11]} />
        <meshStandardMaterial color="#7a3b1e" roughness={0.85} />
      </mesh>

      {/* Decorative edge frieze */}
      {[-6.1, 6.1].map((x) => (
        <mesh key={x} position={[x, 6.2, 0]}>
          <boxGeometry args={[0.4, 0.6, 11]} />
          <meshStandardMaterial color="#a0522d" roughness={0.8} />
        </mesh>
      ))}
      {[-5.1, 5.1].map((z) => (
        <mesh key={z} position={[0, 6.2, z]}>
          <boxGeometry args={[13, 0.6, 0.4]} />
          <meshStandardMaterial color="#a0522d" roughness={0.8} />
        </mesh>
      ))}

      {/* Central reading platform */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[6, 0.6, 5]} />
        <meshStandardMaterial color="#4a2e15" roughness={0.95} />
      </mesh>

      {/* Glowing scroll stand */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 2, 8]} />
        <meshStandardMaterial color="#d4a017" emissive="#8B0000" emissiveIntensity={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.8]} />
        <meshStandardMaterial color="#f0e6d3" emissive="#c09060" emissiveIntensity={0.5} roughness={0.6} />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[14, 0.1, 12]} />
        <meshStandardMaterial color="#3a2510" roughness={0.98} />
      </mesh>
    </group>
  );
}
