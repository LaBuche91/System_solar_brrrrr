export type BodyId = 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune'

export interface Body {
  id: BodyId
  name: string
  radiusKm: number
  massKg: number
  albedo?: number
  hasAtmosphere?: boolean
  parent?: BodyId
  color: string
  // Propriétés physiques détaillées
  density?: number // kg/m³
  gravity?: number // m/s²
  escapeVelocity?: number // km/s
  rotationPeriod?: number // heures
  rotationDirection?: number
  orbitalPeriod?: number // jours
  temperature?: {
    min: number
    max: number
    mean: number
    surface?: number
    core?: number
  } // Kelvin
  atmosphereComposition?: string[]
  numberOfMoons?: number
  discoveryYear?: number
  discoveredBy?: string
}

export interface KeplerianElements {
  a: number // Semi-major axis (AU)
  e: number // Eccentricity
  i: number // Inclination (radians)
  Ω: number // Longitude of ascending node (radians)
  ω: number // Argument of periapsis (radians)
  M0: number // Mean anomaly at epoch (radians)
  epoch: number // Julian day number
}

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface StateVector {
  position: Vec3
  velocity?: Vec3
}

export interface EphemerisSample {
  jd: number
  position: Vec3
  velocity?: Vec3
}

export interface EphemerisProvider {
  getState(bodyId: BodyId, jd: number): StateVector
}

export interface TimeController {
  nowJD: number
  speed: number
  isPlaying: boolean
  pause(): void
  play(): void
  setSpeed(speed: number): void
  setDate(jd: number): void
  update(deltaTime: number): void
}
