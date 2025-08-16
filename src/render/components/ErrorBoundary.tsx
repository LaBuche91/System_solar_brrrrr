import React from 'react'
import { LoadingPlanet } from './LoadingPlanet.js'
import { BodyId } from '../../domain/types.js'

interface TextureErrorBoundaryState {
  hasError: boolean
}

interface TextureErrorBoundaryProps {
  children: React.ReactNode
  bodyId: BodyId
  radius: number
  onClick?: () => void
}

export class TextureErrorBoundary extends React.Component<
  TextureErrorBoundaryProps,
  TextureErrorBoundaryState
> {
  constructor(props: TextureErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): TextureErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error(`Erreur de texture pour ${this.props.bodyId}:`, error)
  }

  render() {
    if (this.state.hasError) {
      console.warn(`Erreur de chargement de texture pour ${this.props.bodyId}, utilisation du fallback`)
      
      return (
        <LoadingPlanet 
          bodyId={this.props.bodyId} 
          radius={this.props.radius} 
          onClick={() => {
            this.props.onClick?.()
            this.setState({ hasError: false })
          }}
        />
      )
    }

    return this.props.children
  }
}