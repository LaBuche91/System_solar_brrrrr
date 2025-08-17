import { Canvas } from '@react-three/fiber'
import { SolarSystem } from '../render/components/SolarSystem'
import { InfoPanel } from '../ui/InfoPanel'
import { TimeControls } from '../ui/TimeControls'
import { BodySelector } from '../ui/BodySelector'
import { KeyboardControls } from '../ui/KeyboardControls'
import { HelpPanel } from '../ui/HelpPanel'

function App() {
  return (
    <div className="w-screen h-screen bg-black relative">
      <Canvas
        camera={{ position: [0, 50, 100], fov: 60, far: 10000 }}
        gl={{ logarithmicDepthBuffer: true }}
      >
        <SolarSystem />
      </Canvas>
      
      <InfoPanel />
      <TimeControls />
      <BodySelector />
      <KeyboardControls />
      <HelpPanel />
    </div>
  )
}

export default App
