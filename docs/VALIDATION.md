# Validation V1 — 2026-09-07

## Résultats obtenus

- Installation npm réussie, versions verrouillées.
- `npm run typecheck` : réussi, TypeScript strict.
- `npm test` : 8 tests réussis (Node + JSDOM et projection mathématique Three.js).
- `npm run build` : réussi. Vue 3D dans un module chargé à la demande ; bundle principal ≈198 kB et module 3D ≈887 kB avant gzip.
- Serveur de développement démarré avec succès.
- Image existante conservée et inspectée pour délimiter les tubes blancs.

## Tests automatisés

1. La sélection des membranes survit au démontage/remontage des renderers simulés dans les deux sens.
2. Le retour global vide la sélection et ferme le panneau dans les deux modes.
3–6. Les quatre états du snapshot source produisent le libellé français attendu dans le header.
7. Chaque lecture mock est isolée d’une mutation par un autre consommateur.
8. Les boîtes englobantes machine/membranes restent dans le champ des deux presets pour quatre rapports largeur/hauteur (0,75 ; 1 ; 1,6 ; 2,2).

## Vérification navigateur non effectuée

Le navigateur de validation refuse l’adresse interne de l’aperçu (`ERR_BLOCKED_BY_CLIENT`), bien que le serveur soit déclaré actif. Il s’agit d’une limite de l’environnement ; aucun test de rendu WebGL, clic géométrique, alignement SVG en situation réelle ou tactile n’est déclaré réussi.

À vérifier sur un PC puis une tablette, en paysage et portrait :

- Image et scène 3D visibles, correctement cadrées, sans erreur console.
- Survol et clic de chacun des quatre tubes blancs en 2.5D ; pas de sélection en cliquant la pompe ou le coffret.
- Sélection par clic direct sur les membranes 3D, animation vers le focus puis retour.
- Sélection conservée en changeant de renderer ; panneau lisible sans recouvrir la scène.
- Retour via le fond, les boutons et Échap ; navigation clavier et action tactile.
- Respect de la préférence de réduction des mouvements.
- Absence de défilement horizontal, notamment à 1024×768, 768×1024 et texte agrandi à 200 %.
- Internet coupé, serveur et réseau local actifs : rechargement puis ouverture initiale de la vue 3D.

## Limites

- La CI est importée avec les sources sur GitHub ; son résultat distant se consulte dans l’onglet Actions du dépôt. Les résultats ci-dessus décrivent la validation locale.
- Vite signale le poids du module 3D (>500 kB). La dépendance Three.js est chargée uniquement à l’ouverture de cette vue ; aucun seuil d’avertissement n’a été masqué.
- Pas de test sur GPU industriel ou tablette physique ; performances réelles à mesurer.
- Pas de cache PWA : une tablette doit rester connectée à son serveur local.
