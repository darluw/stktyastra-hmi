# AI_CONTEXT — STKTYASTRA

## Produit
IHM locale/offline-first de supervision de machines d'osmose inverse.

## Contraintes validées
- Supervision uniquement ; read-only vis-à-vis du contrôle industriel.
- Desktop, écran industriel et tablette.
- Fonctionnement offline nécessaire.
- Machine générique fictive.
- Deux renderers développés en parallèle : image interactive 2.5D et vraie scène 3D contrôlée.
- Projet indépendant de RADAR.
- Compatibilité future avec InfluxDB via une couche backend/adaptateur ; jamais de dépendance InfluxDB directe dans le frontend.

## Scope actuel — V1 page 1
- Une seule page.
- Afficher uniquement l'état global de la machine.
- Seules les membranes sont interactives.
- Les vues 2.5D et 3D doivent partager exactement le même état applicatif.
- Pas encore de maintenance, consommables, historique, alarmes ou KPI process.

## Priorité actuelle
Valider la qualité de la page, le langage visuel, la sélection des membranes et le principe de caméra/focus avant d'élargir le périmètre.

## Repères techniques
- Stack du ZIP conservée : React Context (état partagé), TS strict, Vite, R3F/Three. Pas de Zustand/Drei ajouté sans besoin.
- Source mock injectable au Provider ; snapshot initial uniquement, aucun polling/API.
- Image : repère SVG 1672×941 partagé avec les quatre polygones membranes.
- 3D : composants dans views/three ; presets home/membranes ; rendu à la demande, réduction des mouvements respectée.
- Fonctionne avec serveur HTTP local + assets inclus. Pas de PWA autonome sur tablette hors réseau local.
- npm ci ; npm run typecheck ; npm test ; npm run build.
- Consulter docs/VALIDATION.md pour l’état des vérifications et les limites connues.
