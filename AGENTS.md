# STKTYASTRA

Lire README.md et AI_CONTEXT.md, puis uniquement les fichiers pertinents pour la tâche. Consulter docs/VALIDATION.md pour les vérifications encore ouvertes.

- Périmètre : une seule page de supervision, deux renderers, membranes uniquement. Aucun contrôle machine, backend ou autre module métier sans demande.
- Conserver le domaine indépendant des coordonnées SVG/Three.js et l’état commun aux deux vues.
- Assets locaux, fonctionnement sans Internet avec serveur HTTP local.
- Modifier le minimum utile ; ne pas réimprimer les fichiers dans le chat.
- Valider avec npm run typecheck, npm test et npm run build ; signaler les tests impossibles sans les déclarer réussis.
- Maintenir AI_CONTEXT.md compact ; décisions majeures dans docs/architecture.
