# Objectif

Créer une application web interactive qui simule le Système solaire (échelles, orbites, vitesses, textures, éclairage, collisions optionnelles), avec une architecture scalable et un code maintenable.

---

## 1) Cibles & périmètre fonctionnel

### MVP

- Affichage 3D temps réel du Soleil + 8 planètes (option : Lune).
- Caméra orbitale + zoom fluide.
- Échelle relative configurable (taille/distances compressées).
- Temps contrôlable (pause, accélérer/ralentir, aller à une date).
- Éclairage PBR simple (une source principale — le Soleil), ombres douces.
- UI minimaliste : panneau d’info, sélecteur de corps célestes.

### V1 étendue

- Trajectoires orbitales (traces), inclinaisons, excentricités.
- Textures haute résolution + normal/roughness (optimisées).
- Éphémérides « assez justes » (approximations VSOP87 ou pré-calculs).
- Lune, anneaux de Saturne/UrAnus, principaux satellites de Jupiter.
- Mode « visite guidée » (storytelling), bookmarks de caméras.
- Mesures/Unités : AU, km, jours, années.

### Plus tard (Nice-to-have)

- Physique N-corps approximative pour petits objets (cannon-es ou moteur custom simplifié).
- Post-processing (bloom, vignette, tonemapping avancé).
- PWA + offline assets.
- Import de kernels SPICE / données réelles (si besoin scientifique).
- VR (WebXR) et contrôles manette.

---

## 2) Stack technique recommandée

### Rendering & 3D

- **Three.js** (moteur WebGL) — coeur du rendu.
- **React + React Three Fiber (R3F)** pour une composition déclarative des scènes.
- **@react-three/drei** pour les helpers (OrbitControls, Html, Trail, etc.).
- **postprocessing** (vanruesc) pour les effets si activés.
- **cannon-es** (optionnel) + **@react-three/cannon** pour interactions physiques simples.

### Langage, build & qualité

- **TypeScript** partout (domain, sim, UI, shaders d’interface typés via consts).
- **Vite** pour le bundling/dev server.
- **ESLint** (Airbnb/Typescript), **Prettier**, **Stylelint** (si CSS hors Tailwind).
- **Husky + lint-staged + commitlint** pour un flux Git propre (Conventional Commits).

### UI & état

- **TailwindCSS** pour un design système léger et cohérent.
- **Zustand** (ou Jotai) pour l’état global simple (timeScale, selection, settings).
- **React Router** pour les modes (exploration, visite guidée, labo).

### Tests & DX

- **Vitest** (unit/integration), **Testing Library** (React), **Playwright** (e2e).
- **Storybook** pour UI + scènes 3D isolées (Canvas decorators R3F).
- **MSW** (si API simulées) pour tests déterministes.

### Observabilité & perfs

- **Sentry** (erreurs), **Web Vitals** (perf), **Stats.js** (rendu dev seulement).
- **Bundle analyzer** (vite-plugin-visualizer).

### Déploiement

- **Vercel/Netlify** (static hosting CDN).
- **CI/CD** GitHub Actions : lint + tests + build + preview/production.

---

## 3) Architecture logicielle (clean, scalable)

### Principes

- **Séparation claire** : Domaine (astronomie), Simulation (mécanique/éphémérides), Rendu (Three/R3F), UI (React/Tailwind), Infrastructure (assets, loaders).
- **Données immuables** pour les constantes (masses, rayons, périodes…), **unités explicites** (type-safe) pour éviter les confusions.
- **Time-stepping déterministe** (fixed dt pour la simulation, interpolation côté rendu).
- **Injection de dépendances** là où nécessaire (services de data/clock).
- **API interne stable** (interfaces pour Bodies, Orbits, Integrators, EphemerisProvider).

### Modules

- `domain/` : types & constantes (AU, G, masses, radii, orbital elements).
- `ephemeris/` : providers (\*VSOP87 approx, \*precomputed JSON, \*SPICE adapter plus tard).
- `simulation/` : calcul des positions/orientations, intégrateurs (Kepler, RK4, Verlet), time-control.
- `render/` : composants R3F (SolarSystem, Planet, OrbitPath, SunLight, Skybox, Rings, Labels).
- `ui/` : panneaux, overlays Html, contrôle du temps, paramètres.
- `state/` : stores Zustand (time, selection, settings, bookmarks).
- `assets/` : textures, HDRI, glTF (si modèles), manifests.
- `utils/` : conversions unités (km↔AU, rad↔deg), easing, memoization.
- `config/` : flags (quality presets), perf budgets, routes, i18n.

### Exemple d’arborescence

```text
src/
  domain/
  ephemeris/
  simulation/
  render/
    components/
    materials/
    shaders/
  ui/
  state/
  assets/
  utils/
  config/
  app/
    router.tsx
    App.tsx
```

---

## 4) Modèle de données & types clés (TypeScript)

- `BodyId = 'sun'|'mercury'|...`
- `Body` : `{ id: BodyId; name: string; radiusKm: number; massKg: number; albedo?: number; hasAtmosphere?: boolean; parent?: BodyId; }`
- `KeplerianElements` : `{ a: number; e: number; i: rad; Ω: rad; ω: rad; M0: rad; epoch: JD }`
- `EphemerisSample` : `{ jd: number; position: Vec3; velocity?: Vec3 }`
- `EphemerisProvider` : interface `getState(bodyId, jd): StateVector`
- `TimeController` : `nowJD`, `speed`, `pause()`, `setSpeed()`, `setDate()`

---

## 5) Simulation & précision

- **Échelles** : utiliser unités SI en interne; exposer AU/km côté UI; normaliser pour le rendu (ex. 1 unit = 1e6 km) + **logarithmicDepthBuffer** pour gérer le z-fighting à grande échelle.
- **Pas de temps** : fixed `dt` (ex. 60 s simulées) et `accumulator` (pattern fixed-update) pour stabilité; clamp sur grands speed multipliers.
- **Orbites** : calcul via éléments képleriens + anomalies (E, ν) → positions en 3D par matrices d’orientation.
- **Éphémérides** :
  - Option A (rapide) : tables échantillonnées/approximations (VSOP87 lite) + interpolation.
  - Option B (fidèle) : import de coefficients ou précomputation offline → JSON/wasm.
  - Option C (scientifique) : adapter SPICE (kerns) plus tard.
- **Rotations** : vitesses de rotation journalières + inclinaison des axes.

---

## 6) Rendu & assets

- **Matériaux** : StandardMaterial/Physical + maps (albedo, normal, roughness).
- **Textures** : niveaux de détail (mipmaps), compresser (BasisU/KTX2), découpe 4k/8k selon device.
- **Anneaux** : géométrie custom (alpha falloff), shader simple.
- **Trails/Orbits** : `drei`/`Line` + instancing pour performance.
- **Éclairage** : point light intense au Soleil + emissive/bloom (optionnel).
- **UI overlay** : `Html` (drei) pour labels dynamiques (occlusion optional).

---

## 7) Performance & budgets

- 60 FPS sur desktop milieu de gamme ; fallback 30 FPS mobile.
- Budget draw calls < 200; géométries instanciées quand possible.
- Texture memory < 300–600 MB (selon device); profils qualité.
- Frustum culling, LOD (planètes éloignées = billboards/sprites).
- `useFrame` parcimonieux; mémoriser sélectivement (`useMemo`, `useCallback`).

---

## 8) Accessibilité & UX

- Contrôles clavier (tab, raccourcis temps/caméra), focus visible.
- Contraste UI, tailles adaptatives, préférences « reduced motion ».
- Tooltips/aides contextuelles; localisation (i18n) FR/EN.

---

## 9) Qualité, tests, sécurité

- **Tests unitaires** : calculs képleriens, conversions unités, time-step.
- **Tests d’intégration** : synchro UI↔simulation, sélection de corps.
- **e2e** : scénarios de visite guidée, navigation, performances baseline.
- **Sécurité** : CSP stricte, pas d’éval dynamique; verrou des versions npm; audit.
- **Documentation** : README, ADR (Architecture Decision Records), commentaires TSDoc.

---

## 10) CI/CD & conventions

- Pipelines : `lint → test → build → preview → prod`.
- Conventional Commits + versioning semantique; changelog auto (semantic-release).
- Review obligatoire (PR) + checklists (perf, a11y, DX, tests).

---

## 11) Roadmap indicative (phases)

1. **Conception (1–2 j)** : choix précis des éphémérides, unités, budgets; ADR init.
2. **Bootstrap (1 j)** : Vite + React + R3F + TS + Tailwind + ESLint/Prettier + Husky.
3. **Domaine/Simulation (3–5 j)** : modèles, conversions, intégrateurs, time controller.
4. **Rendu de base (3–4 j)** : Soleil/planètes, caméras, matériaux low-res.
5. **UI & contrôles (2–3 j)** : panneau info, sélecteur, time controls.
6. **Précision & textures (3–5 j)** : VSOP lite, LOD, anneaux, lunes majeures.
7. **Polish & perfs (2–4 j)** : post-processing optionnel, optimisations.
8. **Tests/Docs/CI (continu)** : seuils de couverture, Storybook, déploiement.

---

## 12) Critères d’acceptation (qualité & normes)

- 95% des modules domain/simulation couverts en tests; e2e critique verts.
- Lint 0 erreur; formatage automatisé; PR validées.
- 60 FPS desktop sur scène « max » (qualité medium) ; pas de GC spikes visibles.
- Accessibilité AA pour l’UI.
- ADR à jour; README avec instructions run/build/test.

---

## 13) Évolutions prévues

- Mode VR (WebXR) et panoramas HDRI.
- Systèmes d’autres étoiles (paramétrable), exoplanètes fictives.
- Import de trajectoires de sondes (Voyager, Cassini) si données disponibles.

---

## 14) Notes pratiques

- Gérer la **double précision** : WebGL utilise des floats 32 bits ; normaliser les coordonnées (origine près de la caméra, relative positioning) pour éviter les artefacts à grande échelle.
- Toujours isoler le **temps de la simulation** du temps de rendu (pattern `fixedUpdate` + `render(dt)`).
- Proposer des **presets** (Low/Med/High) et un **auto** basé sur des métriques runtime.

