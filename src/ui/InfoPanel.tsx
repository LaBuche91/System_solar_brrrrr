import { BODIES } from '../domain/bodies.js'
import { useSimulationStore } from '../state/simulation.js'

export function InfoPanel() {
  const { selectedBody } = useSimulationStore()
  
  if (!selectedBody) {
    return (
      <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-xs">
        <h2 className="text-lg font-bold mb-2">Système Solaire</h2>
        <p className="text-sm">Cliquez sur une planète pour voir ses informations</p>
      </div>
    )
  }
  
  const body = BODIES[selectedBody]
  
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-xs">
      <h2 className="text-lg font-bold mb-2" style={{ color: body.color }}>
        {body.name}
      </h2>
      <div className="space-y-1 text-sm">
        <p><span className="font-semibold">Rayon:</span> {body.radiusKm.toLocaleString()} km</p>
        <p><span className="font-semibold">Masse:</span> {body.massKg.toExponential(2)} kg</p>
        {body.hasAtmosphere && (
          <p className="text-blue-300">✓ Possède une atmosphère</p>
        )}
      </div>
    </div>
  )
}