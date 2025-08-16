import { BodyId } from '../../domain/types.js'
import { usePlanetTexture, usePlanetNormalMap, usePlanetSpecularMap } from '../hooks/useTextures.js'

interface PlanetMaterialProps {
  bodyId: BodyId
}

export function PlanetMaterial({ bodyId }: PlanetMaterialProps) {
  const texture = usePlanetTexture(bodyId)
  const normalMap = usePlanetNormalMap(bodyId)
  const specularMap = usePlanetSpecularMap(bodyId)
  
  // Configuration spécifique selon le type de planète
  const getMaterialProps = () => {
    switch (bodyId) {
      case 'sun':
        return {
          map: texture,
          emissive: '#FFAA00',
          emissiveIntensity: 1.2,
          emissiveMap: texture,
          roughness: 1,
          metalness: 0,
        }
      
      case 'earth':
        return {
          map: texture,
          normalMap,
          specularMap,
          roughness: 0.4,
          metalness: 0.1,
          emissive: '#004488',
          emissiveIntensity: 0.2,
        }
      
      case 'mars':
        return {
          map: texture,
          normalMap,
          roughness: 0.6,
          metalness: 0.05,
          emissive: '#663300',
          emissiveIntensity: 0.15,
        }
      
      case 'venus':
        return {
          map: texture,
          roughness: 0.2,
          metalness: 0.1,
          emissive: '#FFAA44',
          emissiveIntensity: 0.2,
        }
      
      case 'jupiter':
        return {
          map: texture,
          roughness: 0.3,
          metalness: 0.1,
          emissive: '#AA6600',
          emissiveIntensity: 0.1,
        }
      
      case 'saturn':
        return {
          map: texture,
          roughness: 0.3,
          metalness: 0.1,
          emissive: '#CCAA66',
          emissiveIntensity: 0.08,
        }
      
      case 'uranus':
        return {
          map: texture,
          roughness: 0.4,
          metalness: 0.2,
          emissive: '#226688',
          emissiveIntensity: 0.1,
        }
      
      case 'neptune':
        return {
          map: texture,
          roughness: 0.4,
          metalness: 0.2,
          emissive: '#003366',
          emissiveIntensity: 0.1,
        }
      
      case 'mercury':
        return {
          map: texture,
          roughness: 0.7,
          metalness: 0.1,
          emissive: '#888866',
          emissiveIntensity: 0.1,
        }
      
      default:
        return {
          map: texture,
          roughness: 0.7,
          metalness: 0.1,
        }
    }
  }
  
  const materialProps = getMaterialProps()
  
  return (
    <meshStandardMaterial
      {...materialProps}
      transparent={false}
    />
  )
}