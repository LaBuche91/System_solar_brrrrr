import * as THREE from 'three'

export type OptimizeOptions = {
  colorSpace?: 'sRGB' | 'linear'
  generateMipmaps?: boolean
  anisotropy?: number
}

/**
 * Optimise une THREE.Texture pour le rendu :
 * - wrap en RepeatWrapping (utile pour procédural / tiling)
 * - anisotropy (si disponible)
 * - filtres (mipmaps quand possible)
 * - encoding par défaut en sRGB (pour albedo)
 *
 * NOTE: la fonction accepte des options afin de pouvoir réutiliser
 *       pour des normal maps (colorSpace = 'linear') sans casser l'API existante.
 */
export function optimizeTexture(texture: THREE.Texture, options?: OptimizeOptions): THREE.Texture {
  const opts: Required<OptimizeOptions> = {
    colorSpace: options?.colorSpace ?? 'sRGB',
    generateMipmaps: options?.generateMipmaps ?? true,
    anisotropy: options?.anisotropy ?? -1,
  }

  // Wrapping
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  // Anisotropy: essayer de détecter la valeur max, fallback raisonnable
  let detectedMaxAniso = 16
  try {
    // Certains builds exposent un helper sur le prototype — garder un fallback propre
    const getMaxAniso =
      // @ts-ignore - accès défensif
      THREE.WebGLRenderer?.prototype?.capabilities?.getMaxAnisotropy ??
      // alternative defensive check
      (THREE as any).capabilities?.getMaxAnisotropy
    if (typeof getMaxAniso === 'function') {
      detectedMaxAniso = getMaxAniso()
    }
  } catch {
    detectedMaxAniso = 16
  }
  const targetAniso = opts.anisotropy > 0 ? Math.min(opts.anisotropy, detectedMaxAniso) : detectedMaxAniso
  texture.anisotropy = Math.min(targetAniso, 16)

  // Compressed textures may already contain mipmaps; détecter si possible
  const isCompressed = !!((texture as any).isCompressedTexture || (texture as any).isCompressed)

  // Filtrage
  if (isCompressed) {
    texture.minFilter =
      texture.mipmaps && (texture.mipmaps as any).length > 0
        ? THREE.LinearMipmapLinearFilter
        : THREE.LinearFilter
  } else {
    texture.minFilter = opts.generateMipmaps ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter
  }
  texture.magFilter = THREE.LinearFilter

  // Mipmaps
  texture.generateMipmaps = !!opts.generateMipmaps

  // Encoding: sRGB pour albedo par défaut, linear pour normal/specular maps si nécessaire
  texture.encoding = opts.colorSpace === 'sRGB' ? THREE.sRGBEncoding : THREE.LinearEncoding

  // S'assurer que Three.js ré-upload la texture
  texture.needsUpdate = true

  return texture
}

export function createFallbackTexture(color: string): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256

  const context = canvas.getContext('2d')!
  context.fillStyle = color
  context.fillRect(0, 0, 256, 256)

  // Ajouter un motif simple pour différencier du matériau de base
  context.fillStyle = 'rgba(255, 255, 255, 0.1)'
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        context.fillRect(i * 32, j * 32, 32, 32)
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  return optimizeTexture(texture)
}
