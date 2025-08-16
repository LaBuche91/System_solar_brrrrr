import { Html } from '@react-three/drei'
import { BodyId } from '../../domain/types.js'
import { BODIES } from '../../domain/bodies.js'

interface PlanetLabelProps {
  bodyId: BodyId
  position: [number, number, number]
}

export function PlanetLabel({ bodyId, position }: PlanetLabelProps) {
  const body = BODIES[bodyId]
  
  if (bodyId === 'sun') return null // Pas de label pour le soleil
  
  return (
    <Html
      position={[position[0], position[1] + 3, position[2]]}
      center
      style={{
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px black',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '2px 6px',
        borderRadius: '3px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {body.name}
    </Html>
  )
}