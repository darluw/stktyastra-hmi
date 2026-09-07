# STKTYASTRA — IHM d’osmose inverse

Première page de supervision locale d’une machine générique fictive. Les données affichées sont **simulées**. Aucun contrôle de machine, backend, appel InfluxDB ou service cloud au fonctionnement.

## Périmètre V1

- Vue oblique d’un container ouvert : image interactive 2.5D et scène 3D simplifiée.
- Sélection des membranes commune aux deux vues ; panneau « État : Normal ».
- État machine dans le header : En fonctionnement, À l’arrêt, Attention, Alarme.
- Cadrages 3D contrôlés `home` / `membranes`, retour via le fond, le bouton ou Échap.
- Actions accessibles au clavier et boutons de 44 px minimum pour le tactile.

## Installation et lancement

Node.js 24 recommandé (minimum 22.12). Depuis le dossier du projet :

```bash
npm ci
npm run dev
```

L’installation des dépendances nécessite un accès réseau. Pour préparer la version à exploiter :

```bash
npm run build
npm run preview -- --port 8080
```

Ouvrir `http://localhost:8080` sur le PC. Depuis une tablette sur le même réseau local, utiliser l’adresse IP du PC et le port 8080, en autorisant ce port dans son pare-feu. Internet n’est ensuite pas nécessaire ; le serveur local et le réseau local doivent rester disponibles pour les autres appareils.

Le dossier `dist/` est autonome et peut être servi par un serveur HTTP statique déjà installé sur le PC industriel. Exemple si Python est présent :

```bash
python -m http.server 8080 --directory dist
```

Ne pas ouvrir `index.html` par double-clic : l’application utilise des modules JavaScript. Cette V1 n’est pas une PWA avec cache de tablette déconnectée du serveur local. La connexion Internet peut être absente ; une tablette doit encore accéder à son serveur local. Tous les assets, y compris le module 3D chargé à la demande, sont fournis dans `dist/`.

## Interactions

Cliquer sur un des quatre tubes blancs, ou sur **Membranes**, ouvre le panneau. La touche Entrée ou Espace active aussi la zone 2.5D focalisée au clavier. La bascule **2.5D / 3D** conserve la sélection. **Vue globale**, **Retour à la vue globale**, Échap ou un clic hors membranes la réinitialisent. Aucun état de machine ne peut être commandé depuis cette interface.

## Architecture

React 19, TypeScript strict, Vite, Three.js et React Three Fiber ; versions reproductibles dans `package-lock.json`.

Le Context React existant est conservé : il suffit à cette V1. Zustand et Drei restent des possibilités futures, sans ajout de dépendance tant qu’un besoin concret ne le justifie pas.

- `src/domain/machine.ts` : types et libellés métier, indépendants de Three.js.
- `src/state/MachineContext.tsx` : source du snapshot et état partagé des vues.
- `src/data/machineSource.ts` : contrat minimal de lecture, implémentation mock actuelle.
- `src/views/ImageMachineView.tsx` : image et polygones interactifs dans le même repère SVG.
- `src/views/ThreeMachineView.tsx` : rendu 3D et repli en cas d’échec d’initialisation.
- `src/views/three/` : sous-ensembles géométriques et cadrages visuels séparés.
- `src/components/` : header, panneau et sélecteur.

Le `MachineProvider` lit le snapshot une fois au montage ; il ne constitue pas encore un abonnement temps réel. Un futur adaptateur API fera évoluer cette lecture sans exposer Three.js au domaine.

## Vérifications

```bash
npm run typecheck
npm test
npm run build
```

Les tests couvrent la sélection à travers le remplacement d’un renderer, le retour global, les quatre états français, l’isolation des snapshots et le cadrage mathématique desktop/tablette. Ils ne remplacent pas des tests navigateur WebGL ni des essais sur tablette physique.

La CI GitHub exécute ces commandes à chaque push et pull request. Elle ne publie pas de site et ne commande aucun équipement. Voir `docs/VALIDATION.md` pour les limites de la validation actuelle.

## GitHub

Dépôt : [darluw/stktyastra-hmi](https://github.com/darluw/stktyastra-hmi), public.

Les sources, assets, tests et la CI sont versionnés. `dist/` et `node_modules/` sont exclus du suivi Git ; le build est reproductible via `npm ci` puis `npm run build`.

GitHub héberge les sources et la CI. L’exécution industrielle reste locale ; GitHub Pages n’est pas activé.

## Limites et suite

Le modèle 3D est schématique. L’image de référence est conservée ; ses polygones doivent être recalibrés si elle change. L’identifiant métier `membranes` est indépendant des objets du modèle pour permettre une future substitution GLB.

Priorité suivante : valider l’aspect et les clics dans les deux vues sur PC et tablette réels, avant toute deuxième page ou intégration métier.
