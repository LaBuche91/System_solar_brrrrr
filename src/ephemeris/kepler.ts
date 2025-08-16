import { BodyId, StateVector, Vec3, KeplerianElements } from '../domain/types.js'
import { ORBITAL_ELEMENTS } from '../domain/bodies.js'
import { AU_TO_KM } from '../domain/constants.js'

export function solveKepler(M: number, e: number): number {
  let E = M
  for (let i = 0; i < 10; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
    E -= dE
    if (Math.abs(dE) < 1e-8) break
  }
  return E
}

export function keplerianToCartesian(elements: KeplerianElements, jd: number): Vec3 {
  const { a, e, i, Ω, ω, M0, epoch } = elements
  
  // Mean motion (rad/day)
  const n = Math.sqrt(1 / (a * a * a)) * 2 * Math.PI / 365.25
  
  // Mean anomaly at current time
  const M = M0 + n * (jd - epoch)
  
  // Eccentric anomaly
  const E = solveKepler(M, e)
  
  // True anomaly
  const ν = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  )
  
  // Distance
  const r = a * (1 - e * Math.cos(E))
  
  // Position in orbital plane
  const x_orb = r * Math.cos(ν)
  const y_orb = r * Math.sin(ν)
  
  // Rotation matrices
  const cosΩ = Math.cos(Ω)
  const sinΩ = Math.sin(Ω)
  const cosi = Math.cos(i)
  const sini = Math.sin(i)
  const cosω = Math.cos(ω)
  const sinω = Math.sin(ω)
  
  // Transform to heliocentric coordinates
  const x = (cosΩ * cosω - sinΩ * sinω * cosi) * x_orb + (-cosΩ * sinω - sinΩ * cosω * cosi) * y_orb
  const y = (sinΩ * cosω + cosΩ * sinω * cosi) * x_orb + (-sinΩ * sinω + cosΩ * cosω * cosi) * y_orb
  const z = (sinω * sini) * x_orb + (cosω * sini) * y_orb
  
  return {
    x: x * AU_TO_KM,
    y: y * AU_TO_KM,
    z: z * AU_TO_KM,
  }
}

export class SimpleEphemerisProvider {
  getState(bodyId: BodyId, jd: number): StateVector {
    if (bodyId === 'sun') {
      return { position: { x: 0, y: 0, z: 0 } }
    }
    
    const elements = ORBITAL_ELEMENTS[bodyId]
    const position = keplerianToCartesian(elements, jd)
    
    return { position }
  }
}