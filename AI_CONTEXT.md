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
Interactions V1 validées par l’utilisateur sur son PC. Conserver l’affichage actuel ; établir les flows OPC UA avant les tests sur matériel cible.

## Repères techniques
- Stack du ZIP conservée : React Context (état partagé), TS strict, Vite, R3F/Three. Pas de Zustand/Drei ajouté sans besoin.
- Source mock injectable au Provider ; snapshot initial uniquement, aucun polling/API.
- Image : repère SVG 1672×941 partagé avec les quatre polygones membranes.
- 3D : composants dans views/three ; presets home/membranes ; rendu à la demande, réduction des mouvements respectée.
- Fonctionne avec serveur HTTP local + assets inclus. Pas de PWA autonome sur tablette hors réseau local.
- npm ci ; npm run typecheck ; npm test ; npm run build.
- Consulter docs/VALIDATION.md pour l’état des vérifications et les limites connues.

## Collecte autorisée (2026-09-08)
- Source retenue : serveur OPC UA Ewon, login User/Password. TCP via eCatcher validé par l’utilisateur ; session et lecture encore à vérifier.
- Instance Node-RED native locale dans services/node-red, port 1881 sur loopback, données privées .runtime ignorées par Git. Aucun partage avec RADAR.
- Installation : npm ci --prefix services/node-red ; lancement : npm run start --prefix services/node-red. Sous PowerShell utiliser npm.cmd.
- Diagnostic manuel en lecture seule ; ni mapping métier ni connexion frontend ajoutés. Guide : docs/NODE_RED.md.
