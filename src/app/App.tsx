import { Canvas } from '@react-three/fiber'
import { SolarSystem } from '../render/components/SolarSystem'
import { InfoPanel } from '../ui/InfoPanel'
import { TimeControls } from '../ui/TimeControls'
import { BodySelector } from '../ui/BodySelector'

function App() {
  return (
    <div className="w-screen h-screen bg-black relative">
      <Canvas
        camera={{ position: [0, 50, 100], fov: 60 }}
        gl={{ logarithmicDepthBuffer: true }}
      >
        <SolarSystem />
      </Canvas>
      
      <InfoPanel />
      <TimeControls />
      <BodySelector />
    </div>
  )
}

export default App