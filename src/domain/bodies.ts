import { Body, BodyId, KeplerianElements } from './types.js'
import { SOLAR_MASS, DEG_TO_RAD, JULIAN_DAY_J2000 } from './constants.js'

export const BODIES: Record<BodyId, Body> = {
  sun: {
    id: 'sun',
    name: 'Soleil',
    radiusKm: 696340,
    massKg: SOLAR_MASS,
    color: '#FDB813',
    density: 1408,
    gravity: 274,
    escapeVelocity: 617.5,
    rotationPeriod: 609.12, // heures (~25,38 jours équatoriaux)
    temperature: { min: 5778, max: 15000000, mean: 5778 }, // K (surface ~5778, cœur ~15e6)
    discoveryYear: -3000,
    discoveredBy: 'Civilisations anciennes',
  },
  mercury: {
    id: 'mercury',
    name: 'Mercure',
    radiusKm: 2439.7,
    massKg: 3.3011e23,
    color: '#B87333',
    parent: 'sun',
    density: 5427,
    gravity: 3.7,
    escapeVelocity: 4.25,
    rotationPeriod: 1407.6, // heures (~58,6 jours)
    orbitalPeriod: 88, // jours
    temperature: { min: 100, max: 700, mean: 340 }, // K
    numberOfMoons: 0,
    discoveryYear: -3000,
    discoveredBy: 'Civilisations anciennes',
  },
  venus: {
    id: 'venus',
    name: 'Vénus',
    radiusKm: 6051.8,
    massKg: 4.8675e24,
    color: '#FFA500',
    parent: 'sun',
    hasAtmosphere: true,
    density: 5243,
    gravity: 8.87,
    escapeVelocity: 10.36,
    rotationPeriod: 5832.5, // heures (~243 jours, rétrograde)
    orbitalPeriod: 225, // jours
    temperature: { min: 737, max: 737, mean: 737 }, // K
    atmosphereComposition: ['CO₂ (96%)', 'N₂ (3.5%)', 'SO₂, H₂O'],
    numberOfMoons: 0,
    discoveryYear: -3000,
    discoveredBy: 'Civilisations anciennes',
  },
  earth: {
    id: 'earth',
    name: 'Terre',
    radiusKm: 6371,
    massKg: 5.9724e24,
    color: '#4169E1',
    parent: 'sun',
    hasAtmosphere: true,
    density: 5514,
    gravity: 9.8,
    escapeVelocity: 11.19,
    rotationPeriod: 24, // heures
    orbitalPeriod: 365.25, // jours
    temperature: { min: 184, max: 330, mean: 288 }, // K
    atmosphereComposition: ['N₂ (78%)', 'O₂ (21%)', 'Ar, CO₂'],
    numberOfMoons: 1,
    discoveryYear: -3000,
    discoveredBy: 'Civilisations anciennes',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    radiusKm: 3389.5,
    massKg: 6.4171e23,
    color: '#FF4500',
    parent: 'sun',
    hasAtmosphere: true,
    density: 3933,
    gravity: 3.71,
    escapeVelocity: 5.03,
    rotationPeriod: 24.6, // heures
    orbitalPeriod: 687, // jours
    temperature: { min: 130, max: 308, mean: 210 }, // K
    atmosphereComposition: ['CO₂ (95%)', 'N₂ (3%)', 'Ar (1.6%)'],
    numberOfMoons: 2,
    discoveryYear: -3000,
    discoveredBy: 'Civilisations anciennes',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    radiusKm: 69911,
    massKg: 1.8982e27,
    color: '#D2691E',
    parent: 'sun',
    hasAtmosphere: true,
    density: 1326,
    gravity: 24.79,
    escapeVelocity: 59.5,
    rotationPeriod: 9.9, // heures
    orbitalPeriod: 4333, // jours
    temperature: { min: 165, max: 165, mean: 165 }, // K
    atmosphereComposition: ['H₂ (89%)', 'He (10%)', 'CH₄, NH₃'],
    numberOfMoons: 95,
    discoveryYear: -3000,
    discoveredBy: 'Civilisations anciennes',
  },
  saturn: {
    id: 'saturn',
    name: 'Saturne',
    radiusKm: 58232,
    massKg: 5.6834e26,
    color: '#F4A460',
    parent: 'sun',
    hasAtmosphere: true,
    density: 687,
    gravity: 10.44,
    escapeVelocity: 35.5,
    rotationPeriod: 10.7, // heures
    orbitalPeriod: 10759, // jours
    temperature: { min: 134, max: 134, mean: 134 }, // K
    atmosphereComposition: ['H₂ (96%)', 'He (3%)', 'CH₄, NH₃'],
    numberOfMoons: 146,
    discoveryYear: -3000,
    discoveredBy: 'Civilisations anciennes',
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    radiusKm: 25362,
    massKg: 8.6810e25,
    color: '#40E0D0',
    parent: 'sun',
    hasAtmosphere: true,
    density: 1271,
    gravity: 8.69,
    escapeVelocity: 21.3,
    rotationPeriod: 17.2, // heures (rotation rétrograde)
    orbitalPeriod: 30687, // jours
    temperature: { min: 76, max: 76, mean: 76 }, // K
    atmosphereComposition: ['H₂ (83%)', 'He (15%)', 'CH₄ (2%)'],
    numberOfMoons: 28,
    discoveryYear: 1781,
    discoveredBy: 'William Herschel',
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    radiusKm: 24622,
    massKg: 1.0243e26,
    color: '#1E90FF',
    parent: 'sun',
    hasAtmosphere: true,
    density: 1638,
    gravity: 11.15,
    escapeVelocity: 23.5,
    rotationPeriod: 16.1, // heures
    orbitalPeriod: 60190, // jours
    temperature: { min: 72, max: 72, mean: 72 }, // K
    atmosphereComposition: ['H₂ (80%)', 'He (19%)', 'CH₄ (1%)'],
    numberOfMoons: 16,
    discoveryYear: 1846,
    discoveredBy: 'Le Verrier & Galle',
  },
}

export const ORBITAL_ELEMENTS: Record<BodyId, KeplerianElements> = {
  sun: {
    a: 0,     // UA
    e: 0,     // excentricité (sans unité)
    i: 0,     // radians
    Ω: 0,     // radians
    ω: 0,     // radians
    M0: 0,    // radians (anomalie moyenne à l'époque J2000)
    epoch: JULIAN_DAY_J2000, // jour julien (2451545.0)
  },
  mercury: {
    a: 0.38709927,                     // UA
    e: 0.20563593,                     // excentricité
    i: 7.00497902 * DEG_TO_RAD,        // inclinaison en radians
    Ω: 48.33076593 * DEG_TO_RAD,       // longitude du nœud ascendant (rad)
    ω: 77.45779628 * DEG_TO_RAD,       // argument du périhélie (rad)
    M0: 252.25032350 * DEG_TO_RAD,     // anomalie moyenne à J2000 (rad)
    epoch: JULIAN_DAY_J2000,
  },
  venus: {
    a: 0.72333566, 
    e: 0.00677672,
    i: 3.39467605 * DEG_TO_RAD,
    Ω: 76.67984255 * DEG_TO_RAD,
    ω: 131.60246718 * DEG_TO_RAD,
    M0: 181.97909950 * DEG_TO_RAD,
    epoch: JULIAN_DAY_J2000,
  },
  earth: {
    a: 1.00000261,
    e: 0.01671123,
    i: -0.00001531 * DEG_TO_RAD,
    Ω: 0.0 * DEG_TO_RAD,
    ω: 102.93768193 * DEG_TO_RAD,
    M0: 100.46457166 * DEG_TO_RAD,
    epoch: JULIAN_DAY_J2000,
  },
  mars: {
    a: 1.52371034,
    e: 0.09339410,
    i: 1.84969142 * DEG_TO_RAD,
    Ω: 49.55953891 * DEG_TO_RAD,
    ω: -23.94362959 * DEG_TO_RAD,
    M0: -4.55343205 * DEG_TO_RAD,
    epoch: JULIAN_DAY_J2000,
  },
  jupiter: {
    a: 5.20288700,
    e: 0.04838624,
    i: 1.30439695 * DEG_TO_RAD,
    Ω: 100.47390909 * DEG_TO_RAD,
    ω: 14.72847983 * DEG_TO_RAD,
    M0: 34.39644051 * DEG_TO_RAD,
    epoch: JULIAN_DAY_J2000,
  },
  saturn: {
    a: 9.53667594,
    e: 0.05386179,
    i: 2.48599187 * DEG_TO_RAD,
    Ω: 113.66242448 * DEG_TO_RAD,
    ω: 92.59887831 * DEG_TO_RAD,
    M0: 49.95424423 * DEG_TO_RAD,
    epoch: JULIAN_DAY_J2000,
  },
  uranus: {
    a: 19.18916464,
    e: 0.04725744,
    i: 0.77263783 * DEG_TO_RAD,
    Ω: 74.01692503 * DEG_TO_RAD,
    ω: 96.99853200 * DEG_TO_RAD,
    M0: 142.23834050 * DEG_TO_RAD,
    epoch: JULIAN_DAY_J2000,
  },
  neptune: {
    a: 30.06992276,
    e: 0.00859048,
    i: 1.77004347 * DEG_TO_RAD,
    Ω: 131.78422574 * DEG_TO_RAD,
    ω: 44.96476227 * DEG_TO_RAD,
    M0: 256.22583450 * DEG_TO_RAD,
    epoch: JULIAN_DAY_J2000,
  },
}