# ADR-001 — Deux renderers, un seul état applicatif

## Statut
Accepté pour la V1.

## Contexte
Le projet doit explorer simultanément une représentation image 2.5D interactive et une vraie scène 3D, sans créer deux applications ni dupliquer la logique métier.

## Décision
Les deux représentations sont des renderers interchangeables de la même page et consomment le même état `MachineUiState`.

Le domaine expose des identifiants métier (`membranes`) et ne connaît pas Three.js, les coordonnées d'un hotspot ou la structure du modèle 3D.

## Conséquences
- Une interaction dans l'un ou l'autre renderer déclenche la même action métier.
- Les futures sources de données pourront alimenter l'UI indépendamment du renderer choisi.
- Le renderer 3D peut évoluer vers GLB/GLTF sans modifier le modèle métier.
- Le masque du renderer image reste spécifique à l'asset visuel.

## Précisions V1 (2026-09-07)
- Le Context React fourni est conservé pour éviter une migration sans bénéfice métier immédiat. Zustand/Drei ne sont pas nécessaires aux interactions actuelles.
- Le renderer image utilise un repère SVG commun à l’image et à ses zones : le letterboxing ne décale plus les cibles.
- Les presets de caméra et les géométries restent exclusivement dans le renderer 3D. Le rendu à la demande évite une boucle GPU permanente au repos.
- Le panneau occupe une colonne dédiée sur grand écran et une ligne sous la scène sur tablette, pour ne pas masquer la machine.
