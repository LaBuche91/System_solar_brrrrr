import { useMemo } from 'react'
import * as THREE from 'three'

type StarfieldProps = {
  count?: number
  radius?: number
  size?: number
}

export function Starfield({ count = 5000, radius = 4000, size = 1.2 }: StarfieldProps) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // distribute points on a sphere shell with a little radius variance
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = radius * (0.85 + 0.3 * Math.random())
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [count, radius])

  const sprite = useMemo(() => {
    const sizePx = 64
    const canvas = document.createElement('canvas')
    canvas.width = sizePx
    canvas.height = sizePx
    const ctx = canvas.getContext('2d')!
    const grd = ctx.createRadialGradient(
      sizePx / 2,
      sizePx / 2,
      0,
      sizePx / 2,
      sizePx / 2,
      sizePx / 2,
    )
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.6, 'rgba(255,255,255,0.6)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, sizePx, sizePx)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  }, [])

  return (
    <points frustumCulled={false} renderOrder={-1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        color={new THREE.Color(0xffffff)}
        size={Math.max(0.6, size)}
        sizeAttenuation={true}
        depthWrite={false}
        depthTest={true}
        transparent={true}
        opacity={0.75}
        alphaTest={0.02}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
