import { useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { BodyId } from '../../domain/types.js'
import {
  createPlanetTexture,
  createSaturnRingTexture,
} from '../../assets/textures.js'
import { optimizeTexture } from '../utils/textureOptimization.js'

const VARIANTS = ['ktx2', 'webp', 'png'] as const
type Variant = typeof VARIANTS[number]

async function tryLoadKTX2(url: string): Promise<THREE.Texture | null> {
  try {
    // Dynamic import pour ne pas forcer le bundle si non utilisé
    // @ts-ignore - import des exemples three.js
    const { KTX2Loader } = await import('three/examples/jsm/loaders/KTX2Loader')
    const renderer = (THREE as any).__lastRendererInstance as THREE.WebGLRenderer | undefined
    const ktx2 = new KTX2Loader()
    // Si vous avez un dossier de transcoders (basis), ajustez le chemin ici (public/)
    ktx2.setTranscoderPath('/basis/')
    if (renderer) {
      ktx2.detectSupport(renderer)
    }
    const texture = await ktx2.loadAsync(url)
    // KTX2Loader retourne normalement une CompressedTexture utilisable
    return texture as THREE.Texture
  } catch (err) {
    // Échec ou absence du loader -> fallback
    return null
  }
}

async function tryLoadImage(url: string): Promise<THREE.Texture | null> {
  try {
    const loader = new THREE.TextureLoader()
    const tex = await loader.loadAsync(url)
    return tex
  } catch {
    return null
  }
}

/**
 * Essaie de charger la meilleure variante disponible pour une ressource (ktx2 -> webp -> png).
 * Si aucun fichier externe n'est disponible, retourne null.
 */
async function loadBestVariant(basePath: string): Promise<THREE.Texture | null> {
  // Essayer KTX2 d'abord
  const ktxUrl = `${basePath}.ktx2`
  const ktxTex = await tryLoadKTX2(ktxUrl)
  if (ktxTex) return ktxTex

  // Ensuite webp/png
  for (const v of ['webp', 'png'] as Variant[]) {
    const url = `${basePath}.${v}`
    const tex = await tryLoadImage(url)
    if (tex) return tex
  }

  return null
}

export function usePlanetTexture(bodyId: BodyId) {
  // texture initiale (procédurale) pour éviter un "pop"
  const initial = useMemo(() => {
    const texture = createPlanetTexture(bodyId)
    return optimizeTexture(texture, { colorSpace: 'sRGB', generateMipmaps: true })
  }, [bodyId])

  const [texture, setTexture] = useState<THREE.Texture>(initial)

  useEffect(() => {
    let mounted = true
    const basePath = `/assets/textures/${bodyId}`

    ;(async () => {
      const external = await loadBestVariant(basePath)
      if (!mounted) return
      if (external) {
        // S'assurer des bons paramètres selon le type (albedo -> sRGB)
        const optimized = optimizeTexture(external, { colorSpace: 'sRGB', generateMipmaps: true })
        setTexture(optimized)
      }
    })()

    return () => {
      mounted = false
    }
  }, [bodyId])

  return texture
}

export function useSaturnRingTexture() {
  const initial = useMemo(() => {
    const texture = createSaturnRingTexture()
    // Anneaux utilisent souvent alpha -> sRGB convient
    return optimizeTexture(texture, { colorSpace: 'sRGB', generateMipmaps: true })
  }, [])

  const [texture, setTexture] = useState<THREE.Texture>(initial)

  useEffect(() => {
    let mounted = true
    const basePath = `/assets/textures/saturn_rings`

    ;(async () => {
      const external = await loadBestVariant(basePath)
      if (!mounted) return
      if (external) {
        const optimized = optimizeTexture(external, { colorSpace: 'sRGB', generateMipmaps: true })
        // Assurer que les textures d'anneaux sont transparentes côté material
        optimized.needsUpdate = true
        setTexture(optimized)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return texture
}

export function usePlanetNormalMap(bodyId: BodyId) {
  // Tentative de chargement d'une carte normale externe (ktx2/webp/png)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let mounted = true
    const basePath = `/assets/textures/${bodyId}_normal`

    ;(async () => {
      const external = await loadBestVariant(basePath)
      if (!mounted) return
      if (external) {
        // normals doivent être en linear encoding
        const optimized = optimizeTexture(external, { colorSpace: 'linear', generateMipmaps: true })
        setTexture(optimized)
      } else {
        setTexture(null)
      }
    })()

    return () => {
      mounted = false
    }
  }, [bodyId])

  return texture
}

export function usePlanetSpecularMap(bodyId: BodyId) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let mounted = true
    const basePath = `/assets/textures/${bodyId}_specular`

    ;(async () => {
      const external = await loadBestVariant(basePath)
      if (!mounted) return
      if (external) {
        const optimized = optimizeTexture(external, { colorSpace: 'linear', generateMipmaps: true })
        setTexture(optimized)
      } else {
        setTexture(null)
      }
    })()

    return () => {
      mounted = false
    }
  }, [bodyId])

  return texture
}
