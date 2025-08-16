import { useMemo } from 'react'
import { BodyId } from '../../domain/types.js'
import {
  createPlanetTexture,
  createSaturnRingTexture,
} from '../../assets/textures.js'
import { optimizeTexture } from '../utils/textureOptimization.js'

export function usePlanetTexture(bodyId: BodyId) {
  return useMemo(() => {
    const texture = createPlanetTexture(bodyId)
    return optimizeTexture(texture)
  }, [bodyId])
}

export function useSaturnRingTexture() {
  return useMemo(() => {
    const texture = createSaturnRingTexture()
    return optimizeTexture(texture)
  }, [])
}

export function usePlanetNormalMap(_bodyId: BodyId) {
  // Pour l'instant, pas de cartes normales procédurales
  // Peut être ajouté plus tard si nécessaire
  return null
}

export function usePlanetSpecularMap(_bodyId: BodyId) {
  // Pour l'instant, pas de cartes spéculaires procédurales
  // Peut être ajouté plus tard si nécessaire
  return null
}
