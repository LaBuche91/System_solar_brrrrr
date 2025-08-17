import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { BodyId } from '../../domain/types.js'
import { BODIES, ORBITAL_ELEMENTS } from '../../domain/bodies.js'
import { scaleDistance } from '../../utils/math.js'
import { useSimulationStore } from '../../state/simulation.js'

interface OrbitPathProps {
  bodyId: BodyId
  opacity?: number
}

export function OrbitPath({ bodyId, opacity = 0.3 }: OrbitPathProps) {
  const body = BODIES[bodyId]
  const elements = ORBITAL_ELEMENTS[bodyId]
  const qualityLevel = useSimulationStore(state => state.qualityLevel)
  
  // Ne pas afficher d'orbite pour le soleil
  if (bodyId === 'sun') return null
  
  const points = useMemo(() => {
    const base = qualityLevel === 'low' ? 64 : qualityLevel === 'medium' ? 128 : 256
    const numPoints = Math.max(32, Math.round(base * (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)))
    const points: THREE.Vector3[] = []
    
    // Éléments orbitaux
    const a = elements.a // Demi-grand axe en UA
    const e = elements.e // Excentricité
    const i = elements.i // Inclinaison
    const Ω = elements.Ω // Longitude du noeud ascendant
    const ω = elements.ω // Argument du périastre
    
    // Générer les points de l'ellipse
    for (let j = 0; j <= numPoints; j++) {
      const M = (j / numPoints) * 2 * Math.PI // Anomalie moyenne
      
      // Résoudre l'équation de Kepler pour obtenir l'anomalie excentrique
      let E = M
      for (let iter = 0; iter < 10; iter++) {
        E = M + e * Math.sin(E)
      }
      
      // Anomalie vraie
      const ν = 2 * Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
      )
      
      // Distance radiale
      const r = a * (1 - e * e) / (1 + e * Math.cos(ν))
      
      // Position dans le plan orbital
      const x_orbital = r * Math.cos(ν)
      const y_orbital = r * Math.sin(ν)
      
      // Matrices de rotation pour orientation 3D
      const cosΩ = Math.cos(Ω)
      const sinΩ = Math.sin(Ω)
      const cosω = Math.cos(ω)
      const sinω = Math.sin(ω)
      const cosi = Math.cos(i)
      const sini = Math.sin(i)
      
      // Transformation vers le système de coordonnées héliocentriques
      const x = (cosΩ * cosω - sinΩ * sinω * cosi) * x_orbital + 
                (-cosΩ * sinω - sinΩ * cosω * cosi) * y_orbital
      const y = (sinΩ * cosω + cosΩ * sinω * cosi) * x_orbital + 
                (-sinΩ * sinω + cosΩ * cosω * cosi) * y_orbital
      const z = sini * sinω * x_orbital + sini * cosω * y_orbital
      
      // Conversion en unités de rendu et ajustement pour Three.js (Y et Z échangés)
      const scaledX = scaleDistance(x * 149597870.7) // Conversion UA -> km -> unités de rendu
      const scaledY = scaleDistance(z * 149597870.7) // Z devient Y
      const scaledZ = scaleDistance(y * 149597870.7) // Y devient Z
      
      points.push(new THREE.Vector3(scaledX, scaledY, scaledZ))
    }
    
    return points
  }, [elements])
  
  return (
    <Line
      points={points}
      color={body.color}
      lineWidth={1}
      transparent
      opacity={opacity}
    />
  )
}
