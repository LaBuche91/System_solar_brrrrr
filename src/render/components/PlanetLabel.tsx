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
      occlude
      style={{
        color: body.color,
        fontSize: '12px',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px black',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {body.name}
    </Html>
  )
}