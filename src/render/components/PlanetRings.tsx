import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BodyId } from '../../domain/types.js'
import { useSaturnRingTexture } from '../hooks/useTextures.js'

interface PlanetRingsProps {
  bodyId: BodyId
  radius: number
}

export function PlanetRings({ bodyId, radius }: PlanetRingsProps) {
  const ringRef = useRef<THREE.Mesh>(null!)
  const ringTexture = useSaturnRingTexture()
  
  // Seule Saturne a des anneaux visibles dans notre simulation
  if (bodyId !== 'saturn') {
    return null
  }
  
  const innerRadius = radius * 1.2
  const outerRadius = radius * 2.2
  
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.001
    }
  })
  
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        alphaTest={0.1}
      />
    </mesh>
  )
}