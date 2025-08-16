import * as THREE from 'three'

export function optimizeTexture(texture: THREE.Texture): THREE.Texture {
  // Configuration pour de meilleures performances
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = Math.min(16, THREE.WebGLRenderer.prototype.capabilities?.getMaxAnisotropy?.() || 16)
  
  // Filtrage pour une meilleure qualité
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  
  // Génération automatique des mipmaps
  texture.generateMipmaps = true
  
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