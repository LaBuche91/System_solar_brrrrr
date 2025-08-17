# Solar System Simulator

Simulateur interactif du système solaire — rendu 3D via Three.js + React (react-three-fiber).  
But : projet privé, développé avec Vite et TypeScript.

## Aperçu
- Visualisation 3D des orbites et corps planétaires.
- Contrôles temporels pour accélérer / ralentir la simulation.
- Optimisations pour rendus instanciés et trails d'orbites.
- Structure modulaire : rendu, simulation, état, UI.

## Technologies
- TypeScript
- React 19
- Vite
- three.js
- @react-three/fiber, @react-three/drei
- Zustand (gestion d'état)
- Tailwind CSS
- Husky + lint-staged pour hooks Git

## Structure importante
- src/render — composants de rendu (Planet, SolarSystem, OrbitPath, matériaux, shaders)
- src/simulation — logique temporelle et orbitales (kepler, time)
- src/state — état global (simulation)
- src/ui — panneaux UI et contrôles
- src/assets, public/assets — textures et ressources (voir TEXTURES.md)
- .clinerules — workflows et notes internes

## Prérequis
- Node.js (version recommandée compatible avec les dépendances)
- npm

## Installation
```bash
# installer les dépendances
npm install
```

## Scripts utiles
```bash
# lancer le serveur de dev (vite)
npm run dev

# build de production (tsc + vite)
npm run build

# prévisualiser le build
npm run preview

# lint / format
npm run lint
npm run lint:fix
npm run format

# installer hooks git (husky)
npm run prepare
```

## Développement
1. Installer les dépendances avec `npm install`.
2. Lancer le mode dev : `npm run dev`.
3. Ouvrir l'URL indiquée par Vite (par défaut http://localhost:5173).

Pour contribuer : respecter la configuration ESLint/Prettier et les hooks Husky.

## Fichiers de référence
- TEXTURES.md — détails sur les textures et optimisation
- tsconfig.json, vite.config.ts — configuration TypeScript / Vite
- .prettierrc, eslint.config.js — conventions de style

## Notes pour l'éditeur
- Les composants de rendu utilisent des stratégies d'instancing et d'optimisation des textures.
- Voir `src/render/components` pour les implémentations d'orbites et trails.

## Licence
Projet marqué `private` dans package.json — vérifier la politique de publication avant toute redistribution.
