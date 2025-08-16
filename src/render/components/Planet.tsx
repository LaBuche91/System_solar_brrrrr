import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { BodyId } from '../../domain/types.js'
import { BODIES } from '../../domain/bodies.js'
import { scaleRadius } from '../../utils/math.js'
import { useSimulationStore } from '../../state/simulation.js'
import { PlanetMaterial } from '../materials/PlanetMaterial.js'
import { Atmosphere } from './Atmosphere.js'
import { PlanetRings } from './PlanetRings.js'

interface PlanetProps {
  bodyId: BodyId
  position: [number, number, number]
}

export function Planet({ bodyId, position }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const body = BODIES[bodyId]
  const { selectedBody, setSelectedBody, setFocusedBody } = useSimulationStore()
  
  const radius = scaleRadius(body.radiusKm, bodyId === 'sun' ? 5 : 200)
  const isSelected = selectedBody === bodyId
  
  // Update position
  if (groupRef.current) {
    groupRef.current.position.set(position[0], position[1], position[2])
  }
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })
  
  const handleClick = (event: any) => {
    event.stopPropagation()
    setSelectedBody(bodyId)
    setFocusedBody(bodyId)
  }
  
  return (
    <group ref={groupRef} position={position}>
      <Sphere
        ref={meshRef}
        args={[radius, 64, 64]}
        onClick={handleClick}
      >
        <PlanetMaterial bodyId={bodyId} />
      </Sphere>
      
      <Atmosphere bodyId={bodyId} radius={radius} />
      <PlanetRings bodyId={bodyId} radius={radius} />
      
      {isSelected && (
        <Sphere args={[radius * 1.2, 16, 16]}>
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  )
}