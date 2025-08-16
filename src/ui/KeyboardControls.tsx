import { useEffect } from 'react'
import { BodyId } from '../domain/types.js'
import { useSimulationStore } from '../state/simulation.js'

export function KeyboardControls() {
  const { setSelectedBody, setFocusedBody } = useSimulationStore()

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Éviter les conflits avec les champs de saisie
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = event.key.toLowerCase()
      let bodyId: BodyId | null = null

      switch (key) {
        case '0':
          // Vue générale
          setSelectedBody(null)
          setFocusedBody(null)
          return
        case '1':
          bodyId = 'mercury'
          break
        case '2':
          bodyId = 'venus'
          break
        case '3':
          bodyId = 'earth'
          break
        case '4':
          bodyId = 'mars'
          break
        case '5':
          bodyId = 'jupiter'
          break
        case '6':
          bodyId = 'saturn'
          break
        case '7':
          bodyId = 'uranus'
          break
        case '8':
          bodyId = 'neptune'
          break
        case 's':
          bodyId = 'sun'
          break
        default:
          return
      }

      if (bodyId) {
        setSelectedBody(bodyId)
        setFocusedBody(bodyId)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [setSelectedBody, setFocusedBody])

  return null // Ce composant n'affiche rien
}