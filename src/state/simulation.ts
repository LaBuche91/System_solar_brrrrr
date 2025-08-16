import { BodyId } from '../domain/types.js'
import { create } from 'zustand'

interface SimulationState {
  selectedBody: BodyId | null
  focusedBody: BodyId | null
  timeSpeed: number
  isPlaying: boolean
  showOrbits: boolean
  showLabels: boolean
  qualityLevel: 'low' | 'medium' | 'high'
  
  setSelectedBody: (bodyId: BodyId | null) => void
  setFocusedBody: (bodyId: BodyId | null) => void
  setTimeSpeed: (speed: number) => void
  setIsPlaying: (playing: boolean) => void
  setShowOrbits: (show: boolean) => void
  setShowLabels: (show: boolean) => void
  setQualityLevel: (level: 'low' | 'medium' | 'high') => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  selectedBody: null,
  focusedBody: null,
  timeSpeed: 10,
  isPlaying: true,
  showOrbits: true,
  showLabels: true,
  qualityLevel: 'medium',
  
  setSelectedBody: (bodyId) => set({ selectedBody: bodyId }),
  setFocusedBody: (bodyId) => set({ focusedBody: bodyId }),
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setShowOrbits: (show) => set({ showOrbits: show }),
  setShowLabels: (show) => set({ showLabels: show }),
  setQualityLevel: (level) => set({ qualityLevel: level }),
}))