import * as THREE from 'three'

// Générateur de textures procédurales pour les planètes
export function createPlanetTexture(planetId: string): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  switch (planetId) {
    case 'sun':
      return createSunTexture(ctx, canvas)
    case 'mercury':
      return createMercuryTexture(ctx, canvas)
    case 'venus':
      return createVenusTexture(ctx, canvas)
    case 'earth':
      return createEarthTexture(ctx, canvas)
    case 'mars':
      return createMarsTexture(ctx, canvas)
    case 'jupiter':
      return createJupiterTexture(ctx, canvas)
    case 'saturn':
      return createSaturnTexture(ctx, canvas)
    case 'uranus':
      return createUranusTexture(ctx, canvas)
    case 'neptune':
      return createNeptuneTexture(ctx, canvas)
    default:
      return createDefaultTexture(ctx, canvas)
  }
}

function createSunTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Gradient radial orange-jaune brillant
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  gradient.addColorStop(0, '#FFFFCC')
  gradient.addColorStop(0.3, '#FFDD44')
  gradient.addColorStop(0.7, '#FFAA22')
  gradient.addColorStop(1, '#FF8800')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  // Ajouter des taches solaires plus subtiles
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const size = Math.random() * 25 + 8

    ctx.fillStyle = `rgba(255, 150, 50, ${Math.random() * 0.2 + 0.1})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

function createMercuryTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Base beige très claire
  ctx.fillStyle = '#E6D4B7'
  ctx.fillRect(0, 0, 512, 512)

  // Cratères subtils et clairs
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const size = Math.random() * 15 + 3

    ctx.fillStyle = `rgba(200, 180, 160, ${Math.random() * 0.2 + 0.1})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // Zones très claires pour contraste
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const size = Math.random() * 12 + 4

    ctx.fillStyle = `rgba(255, 240, 220, ${Math.random() * 0.3 + 0.2})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

function createVenusTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Base orange-jaune plus brillante
  const gradient = ctx.createLinearGradient(0, 0, 512, 512)
  gradient.addColorStop(0, '#FFCC66')
  gradient.addColorStop(0.5, '#FFAA44')
  gradient.addColorStop(1, '#FF9955')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  // Nuages tourbillonnants plus visibles
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512

    ctx.fillStyle = `rgba(255, 255, 220, ${Math.random() * 0.3 + 0.2})`
    ctx.beginPath()
    ctx.ellipse(
      x,
      y,
      Math.random() * 35 + 15,
      Math.random() * 8 + 4,
      Math.random() * Math.PI,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

function createEarthTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Océans bleus très brillants
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, 512, 512)

  // Continents verts très clairs
  const continents = [
    { x: 100, y: 150, w: 120, h: 80 }, // Amérique du Nord
    { x: 80, y: 250, w: 60, h: 100 }, // Amérique du Sud
    { x: 250, y: 120, w: 100, h: 120 }, // Europe/Afrique
    { x: 350, y: 180, w: 80, h: 60 }, // Asie
    { x: 400, y: 350, w: 70, h: 50 }, // Australie
  ]

  continents.forEach((continent) => {
    ctx.fillStyle = '#90EE90'
    ctx.fillRect(continent.x, continent.y, continent.w, continent.h)

    // Détails des continents en brun clair
    ctx.fillStyle = '#F4A460'
    for (let i = 0; i < 6; i++) {
      const x = continent.x + Math.random() * continent.w
      const y = continent.y + Math.random() * continent.h
      ctx.fillRect(x, y, Math.random() * 6 + 2, Math.random() * 6 + 2)
    }
  })

  // Nuages blancs très visibles
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.4})`
    ctx.beginPath()
    ctx.arc(x, y, Math.random() * 10 + 3, 0, Math.PI * 2)
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

function createMarsTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Base rouge-orange très claire
  ctx.fillStyle = '#FF8C69'
  ctx.fillRect(0, 0, 512, 512)

  // Régions légèrement plus sombres
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const size = Math.random() * 40 + 12

    ctx.fillStyle = `rgba(220, 140, 100, ${Math.random() * 0.2 + 0.1})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // Zones très claires pour contraste
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const size = Math.random() * 25 + 8

    ctx.fillStyle = `rgba(255, 200, 180, ${Math.random() * 0.3 + 0.2})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // Calottes polaires très visibles
  ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'
  ctx.beginPath()
  ctx.arc(256, 50, 32, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(256, 462, 27, 0, Math.PI * 2)
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

function createJupiterTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Bandes horizontales plus claires
  const bands = ['#E6A85C', '#DEB887', '#F5DEB3', '#F0E68C', '#E6A85C']
  const bandHeight = 512 / bands.length

  bands.forEach((color, index) => {
    ctx.fillStyle = color
    ctx.fillRect(0, index * bandHeight, 512, bandHeight)
  })

  // Grande tache rouge plus visible
  ctx.fillStyle = '#DC143C'
  ctx.beginPath()
  ctx.ellipse(350, 300, 40, 25, 0, 0, Math.PI * 2)
  ctx.fill()

  // Tourbillons dans les bandes plus visibles
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`
    ctx.beginPath()
    ctx.ellipse(
      x,
      y,
      Math.random() * 18 + 8,
      Math.random() * 4 + 2,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

function createSaturnTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Bandes plus claires et dorées
  const gradient = ctx.createLinearGradient(0, 0, 0, 512)
  gradient.addColorStop(0, '#F5DEB3')
  gradient.addColorStop(0.3, '#F0E68C')
  gradient.addColorStop(0.7, '#DDD8A0')
  gradient.addColorStop(1, '#F5DEB3')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  // Bandes horizontales plus visibles
  for (let y = 0; y < 512; y += 35) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.1})`
    ctx.fillRect(0, y, 512, Math.random() * 18 + 8)
  }

  return new THREE.CanvasTexture(canvas)
}

function createUranusTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Bleu-vert plus clair
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  gradient.addColorStop(0, '#87CEEB')
  gradient.addColorStop(0.7, '#40E0D0')
  gradient.addColorStop(1, '#20B2AA')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  // Bandes verticales plus visibles
  for (let x = 0; x < 512; x += 28) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`
    ctx.fillRect(x, 0, Math.random() * 12 + 4, 512)
  }

  return new THREE.CanvasTexture(canvas)
}

function createNeptuneTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  // Bleu plus clair et vibrant
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  gradient.addColorStop(0, '#4169E1')
  gradient.addColorStop(0.5, '#1E90FF')
  gradient.addColorStop(1, '#0066CC')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  // Grande tache sombre plus visible
  ctx.fillStyle = 'rgba(30, 60, 120, 0.7)'
  ctx.beginPath()
  ctx.ellipse(200, 200, 35, 22, 0, 0, Math.PI * 2)
  ctx.fill()

  // Nuages blancs plus visibles
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`
    ctx.beginPath()
    ctx.arc(x, y, Math.random() * 8 + 2, 0, Math.PI * 2)
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

function createDefaultTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): THREE.Texture {
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 512)
  return new THREE.CanvasTexture(canvas)
}

// Texture des anneaux de Saturne
export function createSaturnRingTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Fond transparent
  ctx.clearRect(0, 0, 512, 512)

  // Anneaux concentriques
  const centerX = 256
  const centerY = 256

  for (let radius = 50; radius < 250; radius += 10) {
    const opacity = Math.random() * 0.3 + 0.2
    const width = Math.random() * 8 + 2

    ctx.strokeStyle = `rgba(200, 180, 140, ${opacity})`
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  return new THREE.CanvasTexture(canvas)
}
