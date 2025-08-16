import { useState } from 'react'
import { useSimulationStore } from '../state/simulation.js'

export function TimeControls() {
  const { 
    isPlaying, 
    timeSpeed, 
    showOrbits, 
    showLabels,
    setIsPlaying, 
    setTimeSpeed,
    setShowOrbits,
    setShowLabels
  } = useSimulationStore()
  const [speedInput, setSpeedInput] = useState(timeSpeed.toString())
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }
  
  const handleSpeedChange = (value: string) => {
    setSpeedInput(value)
    const speed = parseFloat(value)
    if (!isNaN(speed) && speed > 0) {
      setTimeSpeed(speed)
    }
  }
  
  const presetSpeeds = [0.1, 1, 10, 100, 365]
  
  return (
    <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg">
      <div className="flex items-center space-x-4 mb-3">
        <button
          onClick={handlePlayPause}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm">Vitesse:</label>
          <input
            type="number"
            value={speedInput}
            onChange={(e) => handleSpeedChange(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded w-20 text-sm"
            step="0.1"
            min="0.1"
          />
          <span className="text-xs text-gray-400">x</span>
        </div>
        
        <div className="flex space-x-1">
          {presetSpeeds.map(speed => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed.toString())}
              className={`px-2 py-1 rounded text-xs ${
                Math.abs(timeSpeed - speed) < 0.1
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
      
      {/* Contrôles d'affichage */}
      <div className="flex items-center space-x-4 text-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOrbits}
            onChange={(e) => setShowOrbits(e.target.checked)}
            className="rounded"
          />
          <span>Orbites</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
            className="rounded"
          />
          <span>Noms</span>
        </label>
      </div>
    </div>
  )
}