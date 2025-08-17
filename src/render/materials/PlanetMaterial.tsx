import { useMemo } from 'react'
import * as THREE from 'three'
import { BodyId } from '../../domain/types.js'
import { usePlanetTexture, usePlanetNormalMap, usePlanetSpecularMap } from '../hooks/useTextures.js'

interface PlanetMaterialProps {
  bodyId: BodyId
}

export function PlanetMaterial({ bodyId }: PlanetMaterialProps) {
  const texture = usePlanetTexture(bodyId)
  const normalMap = usePlanetNormalMap(bodyId)
  const specularMap = usePlanetSpecularMap(bodyId)

  const materialProps = useMemo(() => {
    // Valeurs par défaut raisonnables
    const base = {
      map: texture,
      normalMap: normalMap ?? undefined,
      roughnessMap: specularMap ?? undefined,
      metalnessMap: undefined,
      roughness: 0.7,
      metalness: 0.0,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
      emissiveMap: undefined,
    }

    switch (bodyId) {
      case 'sun':
        return {
          ...base,
          emissive: new THREE.Color(0xffaa00),
          emissiveIntensity: 2.0,
          emissiveMap: texture,
          roughness: 1.0,
          metalness: 0.0,
        }

      case 'earth':
        return {
          ...base,
          roughness: 0.4,
          metalness: 0.05,
          emissive: new THREE.Color(0x004488),
          emissiveIntensity: 0.15,
        }

      case 'mars':
        return {
          ...base,
          roughness: 0.6,
          metalness: 0.02,
          emissive: new THREE.Color(0x663300),
          emissiveIntensity: 0.1,
        }

      case 'venus':
        return {
          ...base,
          roughness: 0.3,
          metalness: 0.0,
          emissive: new THREE.Color(0xffaa44),
          emissiveIntensity: 0.12,
        }

      case 'jupiter':
        return {
          ...base,
          roughness: 0.35,
          metalness: 0.0,
          emissive: new THREE.Color(0xaa6600),
          emissiveIntensity: 0.08,
        }

      case 'saturn':
        return {
          ...base,
          roughness: 0.35,
          metalness: 0.0,
          emissive: new THREE.Color(0xccaa66),
          emissiveIntensity: 0.06,
        }

      case 'uranus':
        return {
          ...base,
          roughness: 0.45,
          metalness: 0.02,
          emissive: new THREE.Color(0x226688),
          emissiveIntensity: 0.06,
        }

      case 'neptune':
        return {
          ...base,
          roughness: 0.45,
          metalness: 0.02,
          emissive: new THREE.Color(0x003366),
          emissiveIntensity: 0.06,
        }

      case 'mercury':
        return {
          ...base,
          roughness: 0.75,
          metalness: 0.05,
          emissive: new THREE.Color(0x888866),
          emissiveIntensity: 0.04,
        }

      default:
        return base
    }
  }, [bodyId, texture, normalMap, specularMap])

  return (
    <meshPhysicalMaterial
      {...materialProps}
      // Assurer la bonne écriture des textures (Three gère encoding via optimizeTexture)
      clearcoat={0}
      clearcoatRoughness={1}
      reflectivity={0.5}
      transparent={false}
    />
  )
}
