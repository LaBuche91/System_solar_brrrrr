import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
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
  const [, forceUpdate] = useState({})
  const { focusOnBody, stopFollowing, updateCameraFollow } = useCameraFocus()
  
  const bodyIds: BodyId[] = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
  
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
      
      // Force re-render to update positions
      forceUpdate({})
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
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {bodyIds.map(bodyId => {
        const position = getRealPosition(bodyId)
        return (
          <group key={bodyId}>
            {showOrbits && <OrbitPath bodyId={bodyId} />}
            <Planet
              bodyId={bodyId}
              position={position}
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