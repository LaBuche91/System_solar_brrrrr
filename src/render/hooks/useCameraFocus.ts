import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BodyId } from '../../domain/types.js'
import { BODIES } from '../../domain/bodies.js'
import { scaleRadius } from '../../utils/math.js'
import { lerp } from '../../utils/math.js'

interface CameraFocusState {
  isAnimating: boolean
  isFollowing: boolean
  followingBodyId: BodyId | null
  targetPosition: THREE.Vector3
  targetLookAt: THREE.Vector3
  startPosition: THREE.Vector3
  startLookAt: THREE.Vector3
  animationProgress: number
  animationDuration?: number
}

export function useCameraFocus() {
  const { camera, controls } = useThree() as { camera: THREE.Camera, controls: any }
  const animationState = useRef<CameraFocusState>({
    isAnimating: false,
    isFollowing: false,
    followingBodyId: null,
    targetPosition: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
    startPosition: new THREE.Vector3(),
    startLookAt: new THREE.Vector3(),
    animationProgress: 0
  })

  const focusOnBody = (bodyId: BodyId | null, bodyPosition: [number, number, number]) => {
    const state = animationState.current

    if (!bodyId) {
      // Retour à la vue générale
      state.isFollowing = false
      state.followingBodyId = null
      focusOnPosition([0, 50, 100], [0, 0, 0])
      return
    }

    // Si on suit déjà ce corps et qu'on n'est pas en train d'animer, juste mettre à jour la position
    if (state.isFollowing && state.followingBodyId === bodyId && !state.isAnimating) {
      updateFollowPosition(bodyId, bodyPosition)
      return
    }

    // Si on est déjà en train d'animer vers ce corps, ne pas redémarrer
    if (state.isAnimating && state.followingBodyId === bodyId) {
      return
    }

    // Nouvelle focalisation
    state.followingBodyId = bodyId
    const body = BODIES[bodyId]
    const radius = scaleRadius(body.radiusKm, bodyId === 'sun' ? 5 : 200)
    
    // Calculer la position optimale de la caméra
    const cameraPosition = calculateOptimalCameraPosition(bodyId, bodyPosition, radius)
    
    focusOnPosition(cameraPosition, bodyPosition)
  }

  const calculateOptimalCameraPosition = (
    bodyId: BodyId, 
    bodyPosition: [number, number, number], 
    radius: number
  ): [number, number, number] => {
    const sunPosition = new THREE.Vector3(0, 0, 0)
    const planetPosition = new THREE.Vector3(bodyPosition[0], bodyPosition[1], bodyPosition[2])
    
    // Distance de base selon la taille de la planète
    let baseDistance: number
    
    switch (bodyId) {
      case 'sun':
        baseDistance = Math.max(radius * 4, 35)
        break
      case 'jupiter':
        // Jupiter est grosse et loin, besoin de plus de recul
        baseDistance = Math.max(radius * 8, 50)
        break
      case 'saturn':
        // Saturne avec ses anneaux nécessite une vue plus large
        baseDistance = Math.max(radius * 10, 45)
        break
      case 'uranus':
      case 'neptune':
        // Planètes lointaines, énormément de recul
        baseDistance = Math.max(radius * 50, 80)
        break
      case 'mars':
        // Mars est petite, beaucoup plus de recul
        baseDistance = Math.max(radius * 35, 30)
        break
      default:
        // Mercure, Vénus, Terre
        baseDistance = Math.max(radius * 18, 18)
    }

    if (bodyId === 'sun') {
      // Pour le soleil, position simple
      return [baseDistance * 0.7, baseDistance * 0.5, baseDistance * 0.7]
    }

    // Vecteur du soleil vers la planète
    const sunToPlanet = new THREE.Vector3().subVectors(planetPosition, sunPosition)
    
    // Calculer un angle perpendiculaire pour éviter l'occlusion par le soleil
    // On utilise un angle de 45° par rapport à la ligne soleil-planète
    const perpendicular1 = new THREE.Vector3()
    const perpendicular2 = new THREE.Vector3()
    
    // Créer deux vecteurs perpendiculaires au vecteur soleil-planète
    if (Math.abs(sunToPlanet.y) < 0.9) {
      perpendicular1.set(0, 1, 0)
    } else {
      perpendicular1.set(1, 0, 0)
    }
    
    perpendicular2.crossVectors(sunToPlanet, perpendicular1).normalize()
    perpendicular1.crossVectors(perpendicular2, sunToPlanet).normalize()
    
    // Position de la caméra : planète + offset dans une direction qui évite le soleil
    const offset = new THREE.Vector3()
    
    // Mélange des directions pour une vue intéressante
    offset.addScaledVector(perpendicular1, baseDistance * 0.6) // Côté
    offset.addScaledVector(perpendicular2, baseDistance * 0.4) // Haut/bas
    offset.addScaledVector(sunToPlanet.normalize(), baseDistance * 0.3) // Légèrement vers l'extérieur
    
    let cameraPos = new THREE.Vector3().addVectors(planetPosition, offset)
    
    // Vérifier si le soleil obstrue la vue et ajuster si nécessaire
    if (isViewObstructedBySun(cameraPos, planetPosition, sunPosition)) {
      // Repositionner la caméra de l'autre côté
      offset.set(0, 0, 0) // Reset offset
      offset.addScaledVector(perpendicular1, baseDistance * 0.8) // Plus de côté
      offset.addScaledVector(perpendicular2, baseDistance * 0.6) // Plus haut/bas
      offset.addScaledVector(sunToPlanet.normalize(), baseDistance * 0.2) // Légèrement vers l'extérieur
      cameraPos = new THREE.Vector3().addVectors(planetPosition, offset)
    }
    

    
    return [cameraPos.x, cameraPos.y, cameraPos.z]
  }

  const isViewObstructedBySun = (
    cameraPos: THREE.Vector3, 
    planetPos: THREE.Vector3, 
    sunPos: THREE.Vector3
  ): boolean => {
    // Vecteur de la caméra vers la planète
    const cameraToTarget = new THREE.Vector3().subVectors(planetPos, cameraPos)
    const distanceToTarget = cameraToTarget.length()
    
    // Point le plus proche du soleil sur la ligne caméra-planète
    const cameraToSun = new THREE.Vector3().subVectors(sunPos, cameraPos)
    const projection = cameraToSun.dot(cameraToTarget.normalize())
    
    // Si la projection est négative ou au-delà de la cible, pas d'obstruction
    if (projection < 0 || projection > distanceToTarget) {
      return false
    }
    
    // Point projeté sur la ligne
    const projectedPoint = new THREE.Vector3()
      .copy(cameraPos)
      .addScaledVector(cameraToTarget.normalize(), projection)
    
    // Distance du soleil au point projeté
    const distanceToLine = sunPos.distanceTo(projectedPoint)
    
    // Rayon du soleil dans l'espace de rendu (avec une marge)
    const sunRadius = scaleRadius(696340, 5) * 1.5 // Marge de sécurité
    
    return distanceToLine < sunRadius
  }

  const updateFollowPosition = (bodyId: BodyId, bodyPosition: [number, number, number]) => {
    const state = animationState.current
    if (!state.isFollowing || !controls) return

    // Maintenir la distance relative à la planète
    const offset = new THREE.Vector3()
    offset.copy(camera.position).sub(controls.target)
    
    // Vérifier si la distance est appropriée pour cette planète
    const body = BODIES[bodyId]
    const radius = scaleRadius(body.radiusKm, bodyId === 'sun' ? 5 : 200)
    const currentDistance = offset.length()
    
    let minDistance: number
    switch (bodyId) {
      case 'sun':
        minDistance = Math.max(radius * 4, 35)
        break
      case 'jupiter':
        minDistance = Math.max(radius * 8, 50)
        break
      case 'saturn':
        minDistance = Math.max(radius * 10, 45)
        break
      case 'uranus':
      case 'neptune':
        minDistance = Math.max(radius * 50, 80)
        break
      case 'mars':
        minDistance = Math.max(radius * 35, 30)
        break
      default:
        minDistance = Math.max(radius * 18, 18)
    }
    
    // Si on est trop près, ajuster la distance
    if (currentDistance < minDistance) {
      offset.normalize().multiplyScalar(minDistance)
    }
    
    // Nouvelle position de la planète
    const newTarget = new THREE.Vector3(bodyPosition[0], bodyPosition[1], bodyPosition[2])
    
    // Mettre à jour la cible et la position de la caméra
    controls.target.copy(newTarget)
    camera.position.copy(newTarget).add(offset)
    controls.update()
  }

  const focusOnPosition = (
    targetPos: [number, number, number], 
    lookAtPos: [number, number, number]
  ) => {
    const state = animationState.current
    
    // Sauvegarder la position actuelle
    state.startPosition.copy(camera.position)
    state.startLookAt.copy(controls?.target || new THREE.Vector3(0, 0, 0))
    
    // Définir la cible
    state.targetPosition.set(targetPos[0], targetPos[1], targetPos[2])
    state.targetLookAt.set(lookAtPos[0], lookAtPos[1], lookAtPos[2])
    
    // Durée d'animation fixe et raisonnable
    const animationDuration = 2.5
    
    // Stocker la durée pour l'animation
    state.animationProgress = 0
    state.animationDuration = animationDuration
    
    // Démarrer l'animation
    state.isAnimating = true
  }

  useFrame((_, delta) => {
    const state = animationState.current
    
    if (state.isAnimating) {
      // Animation en cours
      const animationDuration = state.animationDuration || 2.5
      state.animationProgress += delta / animationDuration

      if (state.animationProgress >= 1) {
        // Animation terminée
        state.animationProgress = 1
        state.isAnimating = false
        state.isFollowing = true // Commencer le suivi après l'animation
      }

      // Fonction d'easing améliorée (ease-in-out)
      let t = state.animationProgress
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

      // Interpoler la position de la caméra
      camera.position.x = lerp(state.startPosition.x, state.targetPosition.x, t)
      camera.position.y = lerp(state.startPosition.y, state.targetPosition.y, t)
      camera.position.z = lerp(state.startPosition.z, state.targetPosition.z, t)

      // Interpoler le point de vue
      if (controls) {
        controls.target.x = lerp(state.startLookAt.x, state.targetLookAt.x, t)
        controls.target.y = lerp(state.startLookAt.y, state.targetLookAt.y, t)
        controls.target.z = lerp(state.startLookAt.z, state.targetLookAt.z, t)
        controls.update()
      }
    }
  })

  // Fonction séparée pour le suivi en temps réel
  const updateCameraFollow = (bodyId: BodyId, bodyPosition: [number, number, number]) => {
    const state = animationState.current
    if (state.isAnimating || !state.isFollowing || state.followingBodyId !== bodyId) return
    
    updateFollowPosition(bodyId, bodyPosition)
  }

  const stopFollowing = () => {
    const state = animationState.current
    state.isFollowing = false
    state.followingBodyId = null
  }

  return { focusOnBody, stopFollowing, updateCameraFollow }
}