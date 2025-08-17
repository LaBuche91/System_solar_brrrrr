import { useRef, type RefObject } from 'react'
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
import { PlanetLabel } from './PlanetLabel.js'

interface PlanetProps {
  bodyId: BodyId
  position: [number, number, number]
  groupRef?: RefObject<THREE.Group | null>
  showLabel?: boolean
}

export function Planet({ bodyId, position, groupRef, showLabel }: PlanetProps) {
  const internalGroupRef = useRef<THREE.Group | null>(null)
  const usedGroupRef = (groupRef ?? internalGroupRef) as RefObject<THREE.Group | null>
  const meshRef = useRef<THREE.Mesh>(null!)
  const body = BODIES[bodyId]
  const { selectedBody, setSelectedBody, setFocusedBody } = useSimulationStore()
  
  const radius = scaleRadius(body.radiusKm, bodyId === 'sun' ? 5 : 200)
  const isSelected = selectedBody === bodyId
  const qualityLevel = useSimulationStore(state => state.qualityLevel)
  const segments = qualityLevel === 'low' ? 16 : qualityLevel === 'medium' ? 32 : 64
  
  const timeSpeed = useSimulationStore(state => state.timeSpeed)
  const isPlaying = useSimulationStore(state => state.isPlaying)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    if (!isPlaying) return

    const periodHours = body.rotationPeriod ?? 24
    const direction = body.rotationDirection ?? 1

    // Convert real seconds (delta) to rotation fraction:
    // simulatedSecondsPerRealSecond = timeSpeed * 8640  (because TimeController uses speed * 0.1 days/sec -> 0.1*86400 = 8640)
    // fraction of rotation per real second = simulatedSecondsPerRealSecond / (periodHours * 3600)
    // radians this frame = 2π * deltaSeconds * fraction
    const increment = (Math.PI * 2) * delta * timeSpeed * 2.4 / periodHours

    meshRef.current.rotation.y += direction * increment
  })
  
  const handleClick = (event: any) => {
    event.stopPropagation()
    setSelectedBody(bodyId)
    setFocusedBody(bodyId)
  }
  
  return (
    <group ref={usedGroupRef} position={position}>
      <Sphere
        ref={meshRef}
        args={[radius, segments, segments]}
        onClick={handleClick}
      >
        <PlanetMaterial bodyId={bodyId} />
      </Sphere>
      
      <Atmosphere bodyId={bodyId} radius={radius} />
      <PlanetRings bodyId={bodyId} radius={radius} />
      
      {showLabel && (
        <PlanetLabel bodyId={bodyId} position={[0, radius, 0]} />
      )}
      
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
