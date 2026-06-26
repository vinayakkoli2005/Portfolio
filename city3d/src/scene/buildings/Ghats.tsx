// The Ghats — wide stepped stone platform descending toward a river
export function Ghats({ position }: { position: [number, number, number] }) {
  const steps = 7;

  return (
    <group position={position}>
      {/* Stepped tiers descending in Z */}
      {Array.from({ length: steps }, (_, i) => (
        <mesh key={i} position={[0, -i * 0.35, -i * 2]} receiveShadow castShadow>
          <boxGeometry args={[24, 0.4, 2.2]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#5a3e28' : '#4a3220'}
            roughness={0.97}
          />
        </mesh>
      ))}

      {/* Water surface (emissive teal) */}
      <mesh position={[0, -steps * 0.35 - 0.15, -steps * 2 - 3]}>
        <boxGeometry args={[30, 0.1, 8]} />
        <meshStandardMaterial
          color="#0a2a3a"
          emissive="#004466"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Side shrine pillars (left) */}
      {[-10, -10].map((x, i) => (
        <group key={i} position={[x, 0, -i * 6]}>
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 6, 8]} />
            <meshStandardMaterial color="#7a5a3a" roughness={0.85} />
          </mesh>
          <mesh position={[0, 6.4, 0]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color="#d4a017" emissive="#7a5500" emissiveIntensity={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Side shrine pillars (right) */}
      {[10, 10].map((x, i) => (
        <group key={i} position={[x, 0, -i * 6]}>
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 6, 8]} />
            <meshStandardMaterial color="#7a5a3a" roughness={0.85} />
          </mesh>
          <mesh position={[0, 6.4, 0]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color="#d4a017" emissive="#7a5500" emissiveIntensity={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Diya lamps along top step */}
      {[-8, -4, 0, 4, 8].map((x) => (
        <group key={x} position={[x, 0.55, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.2, 0.2, 8]} />
            <meshStandardMaterial color="#c8a060" roughness={0.7} />
          </mesh>
          <pointLight position={[0, 0.3, 0]} color="#ff8c00" intensity={0.6} distance={4} />
        </group>
      ))}
    </group>
  );
}
