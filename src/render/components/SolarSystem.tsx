import { useRef, useEffect, useMemo, createRef, RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Planet } from './Planet'
import { PlanetLabel } from './PlanetLabel'
import { OrbitPath } from './OrbitPath'
import { BodyId } from '../../domain/types.js'
import { SimpleEphemerisProvider } from '../../ephemeris/kepler.js'
import { TimeController } from '../../simulation/time.js'
import { scaleDistance } from '../../utils/math.js'
import { useSimulationStore } from '../../state/simulation.js'
import { useCameraFocus } from '../hooks/useCameraFocus.js'

export function SolarSystem() {
  const timeController = useRef(new TimeController())
  const ephemerisProvider = useRef(new SimpleEphemerisProvider())
  const { isPlaying, timeSpeed, showOrbits, showLabels, focusedBody, setSelectedBody, setFocusedBody } = useSimulationStore()
  const { focusOnBody, stopFollowing, updateCameraFollow } = useCameraFocus()
  
  const bodyIds: BodyId[] = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
  
  // Refs pour positionner les groupes sans re-render React
  const groupRefs = useMemo(() => {
    const m: Record<BodyId, RefObject<THREE.Group | null>> = {} as any
    bodyIds.forEach(id => {
      m[id] = createRef<THREE.Group | null>()
    })
    return m as Record<BodyId, RefObject<THREE.Group | null>>
  }, [])
  
  // Initialize time controller
  if (timeController.current.speed !== timeSpeed) {
    timeController.current.setSpeed(timeSpeed)
  }
  if (timeController.current.isPlaying !== isPlaying) {
    if (isPlaying) {
      timeController.current.play()
    } else {
      timeController.current.pause()
    }
  }
  
  // Get real orbital positions
  const getRealPosition = (bodyId: BodyId): [number, number, number] => {
    if (bodyId === 'sun') return [0, 0, 0]
    
    const state = ephemerisProvider.current.getState(bodyId, timeController.current.nowJD)
    return [
      scaleDistance(state.position.x),
      scaleDistance(state.position.z), // Y and Z swapped for Three.js
      scaleDistance(state.position.y),
    ]
  }

  // Handle camera focus when focusedBody changes
  useEffect(() => {
    if (focusedBody) {
      const position = getRealPosition(focusedBody)
      focusOnBody(focusedBody, position)
    } else {
      stopFollowing()
    }
  }, [focusedBody])
  
  useFrame((_, delta) => {
    if (isPlaying) {
      const oldJD = timeController.current.nowJD
      timeController.current.update(delta * 1000)
      
      // Debug: log time progression occasionally
      if (Math.floor(timeController.current.nowJD * 10) !== Math.floor(oldJD * 10)) {
        console.log('Date:', timeController.current.getCurrentDate().toDateString())
      }
      
      // Mise à jour impérative des positions des groupes pour éviter des re-renders React fréquents
      bodyIds.forEach((id) => {
        const ref = groupRefs[id]
        if (ref && ref.current) {
          const pos = getRealPosition(id)
          ref.current.position.set(pos[0], pos[1], pos[2])
        }
      })
    }

    // Suivi de la planète focalisée (sans redémarrer l'animation)
    if (focusedBody) {
      const position = getRealPosition(focusedBody)
      updateCameraFollow(focusedBody, position)
    }
  })
  
  const handleBackgroundClick = () => {
    setSelectedBody(null)
    setFocusedBody(null)
  }

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      
      {/* Background mesh for click detection */}
      <mesh onClick={handleBackgroundClick}>
        <sphereGeometry args={[2000, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <Stars
        radius={1000}
        depth={50}
        count={Math.round(2000 * (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1))}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.8} intensity={0.8} mipmapBlur levels={5} />
      </EffectComposer>
      
      {bodyIds.map(bodyId => {
        const position = getRealPosition(bodyId)
        return (
          <group key={bodyId}>
            {showOrbits && <OrbitPath bodyId={bodyId} />}
            <Planet
              bodyId={bodyId}
              position={position}
              groupRef={groupRefs[bodyId]}
            />
            {showLabels && (
              <PlanetLabel
                bodyId={bodyId}
                position={position}
              />
            )}
          </group>
        )
      })}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={500}
        target={[0, 0, 0]}
      />
    </>
  )
}
