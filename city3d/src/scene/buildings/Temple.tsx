// Central Temple — stepped shikhara (North Indian nagara style)
export function Temple({ position }: { position: [number, number, number] }) {
  const steps = [
    { w: 10, h: 1.0, y: 0.5 },
    { w: 8,  h: 1.0, y: 1.5 },
    { w: 6,  h: 1.0, y: 2.5 },
    { w: 4.5, h: 8,  y: 7.5 }, // sanctum tower
  ];

  return (
    <group position={position}>
      {/* Stepped base platform */}
      {steps.map((s, i) => (
        <mesh key={i} position={[0, s.y, 0]} castShadow receiveShadow>
          <boxGeometry args={[s.w, s.h, s.w]} />
          <meshStandardMaterial color={i === 3 ? '#7a3b1e' : '#8B5e3c'} roughness={0.85} />
        </mesh>
      ))}

      {/* Shikhara tiers (curvilinear tower layers) */}
      {[
        { y: 11.5, r: 1.8, h: 2.0 },
        { y: 13.2, r: 1.4, h: 1.8 },
        { y: 14.7, r: 1.0, h: 1.6 },
        { y: 16.0, r: 0.65, h: 1.4 },
        { y: 17.1, r: 0.4,  h: 1.2 },
      ].map((t, i) => (
        <mesh key={i} position={[0, t.y, 0]} castShadow>
          <cylinderGeometry args={[t.r * 0.7, t.r, t.h, 8]} />
          <meshStandardMaterial color="#8B5e3c" roughness={0.8} />
        </mesh>
      ))}

      {/* Amalaka (ribbed disc) at top */}
      <mesh position={[0, 18.0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.4, 12]} />
        <meshStandardMaterial color="#d4a017" emissive="#7a5500" emissiveIntensity={0.5} roughness={0.5} />
      </mesh>
      {/* Kalasha (pot finial) */}
      <mesh position={[0, 18.6, 0]}>
        <sphereGeometry args={[0.3, 10, 10]} />
        <meshStandardMaterial color="#ffd700" emissive="#b8860b" emissiveIntensity={0.7} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 4 corner shrines */}
      {[[-4, -4], [-4, 4], [4, -4], [4, 4]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#7a3b1e" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.8, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.6, 2.5, 6]} />
            <meshStandardMaterial color="#a0522d" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.2, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshStandardMaterial color="#ffd700" emissive="#b8860b" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Entrance steps */}
      {[0.3, 0.8, 1.3].map((y, i) => (
        <mesh key={i} position={[0, y, 5.5 - i * 0.5]} receiveShadow>
          <boxGeometry args={[3, 0.35, 1]} />
          <meshStandardMaterial color="#5a3e28" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}
