import { TimeController as ITimeController } from '../domain/types.js'
import { JULIAN_DAY_J2000 } from '../domain/constants.js'

export class TimeController implements ITimeController {
  nowJD: number = JULIAN_DAY_J2000
  speed: number = 1
  isPlaying: boolean = false

  pause(): void {
    this.isPlaying = false
  }

  play(): void {
    this.isPlaying = true
  }

  setSpeed(speed: number): void {
    this.speed = Math.max(0.1, Math.min(1000, speed))
  }

  setDate(jd: number): void {
    this.nowJD = jd
  }

  update(deltaTime: number): void {
    if (!this.isPlaying) return
    
    // Convert deltaTime (milliseconds) to days and apply speed multiplier
    // Increased scale for visible motion
    const deltaDays = (deltaTime / 1000) * this.speed * 0.1
    this.nowJD += deltaDays
  }
  
  getCurrentDate(): Date {
    return julianDayToDate(this.nowJD)
  }
}

export function dateToJulianDay(date: Date): number {
  return (date.getTime() / 86400000) + 2440587.5
}

export function julianDayToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000)
}