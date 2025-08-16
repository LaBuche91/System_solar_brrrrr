# Système de Textures des Planètes

## Vue d'ensemble

Le simulateur du système solaire utilise maintenant des **textures procédurales** réalistes pour chaque planète, créées dynamiquement en JavaScript. Le système inclut :

- **Textures procédurales** : Générées en temps réel pour chaque planète
- **Matériaux PBR** : Rendu physiquement réaliste avec émission et rugosité
- **Atmosphères** : Effets visuels pour les planètes avec atmosphère
- **Anneaux** : Anneaux de Saturne avec texture procédurale

## Fonctionnalités

### Textures par Planète

- **Soleil** : Gradient radial jaune-orange avec taches solaires subtiles
- **Mercure** : Surface cratérisée gris-brun avec zones claires et sombres
- **Vénus** : Atmosphère dense orange-jaune avec nuages tourbillonnants
- **Terre** : Océans bleus, continents verts avec nuages blancs
- **Mars** : Surface rouge-orange avec calottes polaires blanches
- **Jupiter** : Bandes horizontales caractéristiques avec Grande Tache Rouge
- **Saturne** : Atmosphère dorée avec bandes subtiles et anneaux
- **Uranus** : Couleur bleu-vert avec bandes verticales (rotation unique)
- **Neptune** : Bleu profond avec Grande Tache Sombre et nuages

### Effets Visuels

1. **Atmosphères** : Couches semi-transparentes avec couleurs spécifiques
2. **Rotation** : Rotation réaliste de chaque planète et des anneaux
3. **Éclairage** : Matériaux PBR avec émission, rugosité et métallicité
4. **Anneaux** : Anneaux de Saturne procéduraux avec transparence

### Avantages des Textures Procédurales

- **Pas de dépendances externes** : Aucun fichier image à télécharger
- **Performance** : Génération rapide et mise en cache automatique
- **Fiabilité** : Pas de problèmes de réseau ou de liens brisés
- **Personnalisation** : Facilement modifiables dans le code

## Architecture Technique

### Composants

- `PlanetMaterial.tsx` : Matériaux spécialisés par planète avec émission
- `Atmosphere.tsx` : Effets atmosphériques colorés
- `PlanetRings.tsx` : Anneaux procéduraux de Saturne
- `Planet.tsx` : Composant principal simplifié

### Générateurs de Textures

- `createPlanetTexture()` : Fonction principale de génération
- `createSunTexture()` : Soleil avec gradient radial et taches
- `createEarthTexture()` : Terre avec océans, continents et nuages
- `createJupiterTexture()` : Jupiter avec bandes et Grande Tache Rouge
- `createSaturnRingTexture()` : Anneaux concentriques transparents

### Optimisations

- **Canvas 2D** : Utilisation de l'API Canvas pour la génération
- **Mise en cache** : Hook `useMemo` pour éviter la régénération
- **Filtrage** : Anisotropie et mipmaps automatiques
- **Résolution** : Textures 512x512 pour un bon compromis qualité/performance

## Configuration des Matériaux

Chaque planète a des propriétés de matériau spécifiques :

```tsx
// Exemple pour la Terre
{
  map: texture,              // Texture procédurale
  roughness: 0.6,           // Surface moyennement rugueuse
  metalness: 0.1,           // Légèrement métallique (océans)
  emissive: '#002244',      // Émission bleue subtile
  emissiveIntensity: 0.1    // Intensité d'émission
}
```

## Utilisation

Les textures sont automatiquement générées et appliquées :

```tsx
// Les textures sont automatiquement créées
<Planet bodyId="earth" position={[0, 0, 0]} />
```

## Développement

Pour modifier une texture :

1. Éditer la fonction correspondante dans `src/assets/textures.ts`
2. Ajuster les propriétés du matériau dans `PlanetMaterial.tsx`
3. Les changements sont visibles immédiatement

### Exemple d'ajout de détails

```javascript
// Ajouter des cratères à Mercure
for (let i = 0; i < 40; i++) {
  const x = Math.random() * 512
  const y = Math.random() * 512
  const size = Math.random() * 18 + 4
  
  ctx.fillStyle = `rgba(140, 120, 100, ${Math.random() * 0.3 + 0.2})`
  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
  ctx.fill()
}
```