import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { BodyId } from '../../domain/types.js'
import { BODIES } from '../../domain/bodies.js'

interface LoadingPlanetProps {
  bodyId: BodyId
  radius: number
  onClick?: () => void
}

export function LoadingPlanet({ bodyId, radius, onClick }: LoadingPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const body = BODIES[bodyId]
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      // Effet de pulsation pendant le chargement
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <Sphere
      ref={meshRef}
      args={[radius, 16, 16]}
      onClick={onClick}
    >
      <meshStandardMaterial
        color={body.color}
        emissive={bodyId === 'sun' ? body.color : '#000000'}
        emissiveIntensity={bodyId === 'sun' ? 0.3 : 0.1}
        roughness={0.8}
        metalness={0.1}
        wireframe={true}
        opacity={0.7}
        transparent
      />
    </Sphere>
  )
}