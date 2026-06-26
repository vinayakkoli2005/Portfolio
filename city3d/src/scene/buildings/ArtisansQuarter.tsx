// Artisans' Quarter — market stalls and workshop buildings with sloped roofs
function Stall({ x, z, rot = 0 }: { x: number; z: number; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {/* Walls */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3.5, 3, 2.5]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.9} />
      </mesh>
      {/* Sloped roof (two panels) */}
      <mesh position={[0.6, 3.2, 0]} rotation={[0, 0, -0.45]} castShadow>
        <boxGeometry args={[2.2, 0.18, 2.8]} />
        <meshStandardMaterial color="#5a2e0a" roughness={0.95} />
      </mesh>
      <mesh position={[-0.6, 3.2, 0]} rotation={[0, 0, 0.45]} castShadow>
        <boxGeometry args={[2.2, 0.18, 2.8]} />
        <meshStandardMaterial color="#5a2e0a" roughness={0.95} />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 2.2, 1.6]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[3.6, 0.12, 1.8]} />
        <meshStandardMaterial color="#8B0000" roughness={0.8} />
      </mesh>
      {/* Support post */}
      <mesh position={[0, 1, 2.0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 2, 6]} />
        <meshStandardMaterial color="#5a3e28" roughness={0.95} />
      </mesh>
    </group>
  );
}

export function ArtisansQuarter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Central well */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1, 1.1, 1.2, 12]} />
        <meshStandardMaterial color="#5a3e28" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.2, 12]} />
        <meshStandardMaterial color="#3a2510" roughness={0.95} />
      </mesh>

      {/* Market stalls arranged around centre */}
      <Stall x={-5} z={0}   rot={0} />
      <Stall x={5}  z={0}   rot={Math.PI} />
      <Stall x={0}  z={-5}  rot={Math.PI * 0.5} />
      <Stall x={0}  z={5}   rot={-Math.PI * 0.5} />
      <Stall x={-5} z={-5}  rot={Math.PI * 0.25} />
      <Stall x={5}  z={5}   rot={Math.PI * 1.25} />

      {/* Cobblestone ground patch */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[8, 8, 0.1, 16]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.98} />
      </mesh>
    </group>
  );
}
