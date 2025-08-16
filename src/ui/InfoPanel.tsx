import { BODIES } from '../domain/bodies.js'
import { useSimulationStore } from '../state/simulation.js'

export function InfoPanel() {
  const { selectedBody } = useSimulationStore()
  
  if (!selectedBody) {
    return (
      <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-sm">
        <h2 className="text-lg font-bold mb-2">Système Solaire</h2>
        <p className="text-sm">Cliquez sur une planète pour voir ses informations détaillées</p>
      </div>
    )
  }
  
  const body = BODIES[selectedBody]
  
  const formatNumber = (num: number, unit: string) => {
    // Gérer les unités qui commencent déjà par 'k' (km, kg)
    const baseUnit = unit.startsWith('k') ? unit.slice(1) : unit
    const prefix = unit.startsWith('k') ? 'k' : ''
    
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)} G${baseUnit}`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)} M${baseUnit}`
    if (num >= 1e3 && !prefix) return `${(num / 1e3).toFixed(1)} k${baseUnit}`
    return `${num.toFixed(1)} ${unit}`
  }
  
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-sm max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: body.color }}></span>
        {body.name}
      </h2>
      
      {/* Caractéristiques physiques */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">CARACTÉRISTIQUES PHYSIQUES</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Rayon:</span>
            <span>{formatNumber(body.radiusKm, 'km')}</span>
          </div>
          <div className="flex justify-between">
            <span>Masse:</span>
            <span>{body.massKg.toExponential(2)} kg</span>
          </div>
          {body.density && (
            <div className="flex justify-between">
              <span>Densité:</span>
              <span>{formatNumber(body.density, 'kg/m³')}</span>
            </div>
          )}
          {body.gravity && (
            <div className="flex justify-between">
              <span>Gravité:</span>
              <span>{body.gravity.toFixed(1)} m/s²</span>
            </div>
          )}
          {body.escapeVelocity && (
            <div className="flex justify-between">
              <span>Vitesse d'évasion:</span>
              <span>{body.escapeVelocity.toFixed(1)} km/s</span>
            </div>
          )}
        </div>
      </div>

      {/* Rotation et orbite */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-green-300 mb-2">ROTATION & ORBITE</h3>
        <div className="space-y-1 text-xs">
          {body.rotationPeriod && (
            <div className="flex justify-between">
              <span>Période de rotation:</span>
              <span>{body.rotationPeriod < 48 ? `${body.rotationPeriod.toFixed(1)}h` : `${(body.rotationPeriod/24).toFixed(1)} jours`}</span>
            </div>
          )}
          {body.orbitalPeriod && (
            <div className="flex justify-between">
              <span>Période orbitale:</span>
              <span>{body.orbitalPeriod < 1000 ? `${body.orbitalPeriod} jours` : `${(body.orbitalPeriod/365.25).toFixed(1)} ans`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Température */}
      {body.temperature && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-orange-300 mb-2">TEMPÉRATURE</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Moyenne:</span>
              <span>{body.temperature.mean}K ({(body.temperature.mean - 273.15).toFixed(0)}°C)</span>
            </div>
            {body.temperature.min !== body.temperature.max && (
              <>
                <div className="flex justify-between">
                  <span>Minimum:</span>
                  <span>{body.temperature.min}K ({(body.temperature.min - 273.15).toFixed(0)}°C)</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum:</span>
                  <span>{body.temperature.max}K ({(body.temperature.max - 273.15).toFixed(0)}°C)</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Atmosphère */}
      {body.atmosphereComposition && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">ATMOSPHÈRE</h3>
          <div className="text-xs">
            {body.atmosphereComposition.map((component, index) => (
              <div key={index} className="mb-1">{component}</div>
            ))}
          </div>
        </div>
      )}

      {/* Satellites */}
      {body.numberOfMoons !== undefined && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">SATELLITES</h3>
          <div className="text-xs">
            {body.numberOfMoons === 0 ? 'Aucune lune' : 
             body.numberOfMoons === 1 ? '1 lune' : 
             `${body.numberOfMoons} lunes`}
          </div>
        </div>
      )}

      {/* Découverte */}
      {body.discoveredBy && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-yellow-300 mb-2">DÉCOUVERTE</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Année:</span>
              <span>{body.discoveryYear && body.discoveryYear > 0 ? body.discoveryYear : 'Antiquité'}</span>
            </div>
            <div className="flex justify-between">
              <span>Découvreur:</span>
              <span className="text-right max-w-32">{body.discoveredBy}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}