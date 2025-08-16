import { BodyId } from '../domain/types.js'
import { BODIES } from '../domain/bodies.js'
import { useSimulationStore } from '../state/simulation.js'

export function BodySelector() {
  const { selectedBody, focusedBody, setSelectedBody, setFocusedBody } = useSimulationStore()
  
  const bodyIds: BodyId[] = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
  
  const handleBodyClick = (bodyId: BodyId) => {
    setSelectedBody(bodyId)
    setFocusedBody(bodyId)
  }

  const handleGeneralView = () => {
    setSelectedBody(null)
    setFocusedBody(null)
  }
  
  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg">
      <h3 className="text-sm font-bold mb-2">Corps célestes</h3>
      <div className="space-y-1">
        <button
          onClick={handleGeneralView}
          className={`block w-full text-left px-2 py-1 rounded text-sm ${
            !selectedBody && !focusedBody
              ? 'bg-blue-600'
              : 'hover:bg-gray-700'
          }`}
        >
          <span className="inline-block w-3 h-3 rounded-full mr-2 bg-gray-400" />
          Vue générale
        </button>
        
        {bodyIds.map(bodyId => {
          const body = BODIES[bodyId]
          const isSelected = selectedBody === bodyId
          const isFocused = focusedBody === bodyId
          
          return (
            <button
              key={bodyId}
              onClick={() => handleBodyClick(bodyId)}
              className={`block w-full text-left px-2 py-1 rounded text-sm ${
                isSelected || isFocused
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: body.color }}
              />
              {body.name}
              {isFocused && <span className="ml-2 text-xs">📹</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}