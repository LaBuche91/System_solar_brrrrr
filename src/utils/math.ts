export function kmToRenderUnits(km: number): number {
  return km / 1e6 // 1 render unit = 1 million km
}

export function auToRenderUnits(au: number): number {
  return (au * 149597870.7) / 1e6
}

export function scaleRadius(radiusKm: number, scaleFactor: number = 100): number {
  const minSize = 0.5 // Taille minimale pour garantir la visibilité
  const scaled = kmToRenderUnits(radiusKm) * scaleFactor
  return Math.max(minSize, scaled)
}

export function scaleDistance(distanceKm: number, scaleFactor: number = 0.1): number {
  return kmToRenderUnits(distanceKm) * scaleFactor
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}