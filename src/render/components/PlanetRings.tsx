import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BodyId } from '../../domain/types.js'
import { useSaturnRingTexture } from '../hooks/useTextures.js'

interface PlanetRingsProps {
  bodyId: BodyId
  radius: number
}

export function PlanetRings({ bodyId, radius }: PlanetRingsProps) {
  const ringRef = useRef<THREE.Mesh>(null!)
  const ringTexture = useSaturnRingTexture()
  
  // Seule Saturne a des anneaux visibles dans notre simulation
  if (bodyId !== 'saturn') {
    return null
  }
  
  const innerRadius = radius * 1.2
  const outerRadius = radius * 2.2
  
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.001
    }
  })

  const shader = useMemo(() => {
    const vertex = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `

    const fragment = `
      precision mediump float;
      uniform sampler2D map;
      uniform float innerFade;
      uniform float outerFade;
      uniform float opacity;
      varying vec2 vUv;
      void main() {
        // uv centré
        vec2 c = vUv - vec2(0.5);
        float dist = length(c);
        // alpha falloff radial
        float alpha = 1.0 - smoothstep(innerFade, outerFade, dist);
        vec4 tex = texture2D(map, vUv);
        tex.a *= alpha * opacity;
        if (tex.a < 0.01) discard;
        gl_FragColor = tex;
      }
    `

    const uniforms = {
      map: { value: ringTexture ?? new THREE.Texture() },
      innerFade: { value: 0.18 }, // ajuster pour correspondre au mapping UV du ringGeometry
      outerFade: { value: 0.48 },
      opacity: { value: 0.9 },
    }

    return { vertex, fragment, uniforms }
  }, [ringTexture])

  // Si pas de texture externe ou shader indisponible, fallback sur meshBasicMaterial
  const useShader = !!shader && !!ringTexture

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      {useShader ? (
        // @ts-ignore - r3f accepte shaderMaterial props dynamiques
        <shaderMaterial
          uniforms={shader.uniforms}
          vertexShader={shader.vertex}
          fragmentShader={shader.fragment}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      ) : (
        <meshBasicMaterial
          map={ringTexture}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          alphaTest={0.1}
        />
      )}
    </mesh>
  )
}
