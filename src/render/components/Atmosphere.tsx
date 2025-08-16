import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { BodyId } from '../../domain/types.js'
import { BODIES } from '../../domain/bodies.js'

interface AtmosphereProps {
  bodyId: BodyId
  radius: number
}

export function Atmosphere({ bodyId, radius }: AtmosphereProps) {
  const body = BODIES[bodyId]
  
  if (!body.hasAtmosphere) {
    return null
  }
  
  const getAtmosphereColor = () => {
    switch (bodyId) {
      case 'earth':
        return '#87CEEB' // Bleu ciel
      case 'venus':
        return '#FFA500' // Orange dense
      case 'mars':
        return '#CD853F' // Brun-rouge
      case 'jupiter':
        return '#D2691E' // Brun-orange
      case 'saturn':
        return '#F4A460' // Beige-doré
      case 'uranus':
        return '#40E0D0' // Turquoise
      case 'neptune':
        return '#1E90FF' // Bleu profond
      default:
        return '#FFFFFF'
    }
  }
  
  const getAtmosphereOpacity = () => {
    switch (bodyId) {
      case 'earth':
        return 0.15
      case 'venus':
        return 0.3 // Atmosphère très dense
      case 'mars':
        return 0.05 // Atmosphère fine
      case 'jupiter':
      case 'saturn':
      case 'uranus':
      case 'neptune':
        return 0.2 // Géantes gazeuses
      default:
        return 0.1
    }
  }
  
  return (
    <Sphere args={[radius * 1.05, 32, 32]}>
      <meshBasicMaterial
        color={getAtmosphereColor()}
        transparent
        opacity={getAtmosphereOpacity()}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  )
}