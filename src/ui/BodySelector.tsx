import { BodyId } from '../domain/types.js'
import { BODIES } from '../domain/bodies.js'
import { useSimulationStore } from '../state/simulation.js'

export function BodySelector() {
  const { selectedBody, setSelectedBody } = useSimulationStore()
  
  const bodyIds: BodyId[] = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
  
  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg">
      <h3 className="text-sm font-bold mb-2">Corps célestes</h3>
      <div className="space-y-1">
        {bodyIds.map(bodyId => {
          const body = BODIES[bodyId]
          const isSelected = selectedBody === bodyId
          
          return (
            <button
              key={bodyId}
              onClick={() => setSelectedBody(bodyId)}
              className={`block w-full text-left px-2 py-1 rounded text-sm ${
                isSelected
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: body.color }}
              />
              {body.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}