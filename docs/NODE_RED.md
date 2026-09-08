# Node-RED indépendant — STKTYASTRA

Cette instance appartient au projet : installation npm locale, port 1881, répertoire utilisateur et credentials dédiés. Elle n’utilise ni l’instance ni les flows de RADAR. L’IHM reste identique et affiche encore les valeurs simulées.

## Installation Windows

Dans PowerShell, depuis le dossier `stktyastra-hmi` :

```powershell
git pull --ff-only
npm.cmd ci --prefix services/node-red
npm.cmd run start --prefix services/node-red
```

Ouvrir http://127.0.0.1:1881 . Laisser ce terminal ouvert. Ctrl+C arrête uniquement cette instance. Aucune installation globale de Node-RED n’est requise. Node.js 24 convient ; les versions de Node-RED et de la palette OPC UA sont verrouillées dans le sous-projet.

L’IHM se lance séparément, dans un autre terminal, comme auparavant :

```powershell
npm.cmd run preview -- --port 8080
```

Le choix natif Windows permet d’effectuer le prochain test depuis le même PC que le test TCP via eCatcher. La session OPC UA et les certificats restent à valider ; un port TCP accessible ne suffit pas à confirmer la lecture des tags.

## Isolation et sauvegarde

| Élément | Emplacement |
|---|---|
| Dépendances dédiées | `services/node-red/node_modules/` |
| Configuration versionnée | `services/node-red/settings.cjs` |
| Flows de départ versionnés | `services/node-red/flows/` |
| Flows actifs | `services/node-red/.runtime/flows.json` |
| Credentials chiffrés | `services/node-red/.runtime/flows_cred.json` |
| Clé de chiffrement locale | `services/node-red/.runtime/credential-secret` |
| Autres données locales | `services/node-red/.runtime/` |

Au premier démarrage, le script initialise les flows et une clé aléatoire. Les démarrages suivants ne les écrasent pas, même après un `git pull`. Le répertoire `.runtime/` est ignoré par Git. Sauvegarder ce répertoire complet, instance arrêtée, dans un emplacement privé : il contient la clé permettant de déchiffrer les identifiants.

L’éditeur écoute uniquement sur `127.0.0.1`. Il est destiné à l’administration depuis ce PC ; il n’est pas exposé au réseau. Ne pas changer l’adresse d’écoute pour un déploiement distant sans prévoir l’authentification. Aucun mot de passe Ewon n’est à écrire dans le dépôt ou le chat.

Si le port 1881 est occupé, arrêter la tentative puis relancer dans ce terminal avec un autre port libre :

```powershell
$env:STKTYASTRA_NODE_RED_PORT = "1882"
npm.cmd run start --prefix services/node-red
```

## Préparer le test Ewon

1. Connecter eCatcher si l’Ewon est distant.
2. Ouvrir les réglages OPC UA de l’Ewon et relever le port, les politiques de sécurité et les groupes de tags publiés.
3. Utiliser le type de login **User/Password** déjà retenu. Le compte, son mot de passe et la confiance des certificats se configurent localement.
4. Importer le fichier `services/node-red/flows/opcua-diagnostic.json` depuis le menu Import de Node-RED.
5. Dans le client, ouvrir la configuration Endpoint : remplacer `0.0.0.0` par l’adresse Ewon et renseigner les credentials localement. Le modèle propose `Basic256Sha256 / SignAndEncrypt` : vérifier leur disponibilité sur l’Ewon avant de les retenir.
6. L’onglet est désactivé à l’import. Après configuration, l’activer dans ses propriétés et Déployer. Le client ouvre une session au déploiement ; aucune lecture périodique ne démarre.
7. Cliquer « Lire la date du serveur » pour tester la session, puis « Parcourir Objects / EwonTags ». Pour un premier tag, dupliquer l’inject de lecture et remplacer son topic par le NodeId effectivement retourné.
8. Le bouton « Fermer la session » termine la connexion ; un redéploiement du client permet de la rouvrir.

La version retenue de `node-red-contrib-opcua` accepte automatiquement les certificats serveurs inconnus. `SignAndEncrypt` ne constitue donc pas, à lui seul, une validation stricte de l’identité du serveur dans ce diagnostic. Le magasin PKI est isolé dans `.runtime/` via les chemins de configuration du processus enfant. Une politique de confiance explicite devra être établie avant l’exploitation industrielle. Ne pas désactiver le chiffrement pour contourner une erreur. HMS indique qu’en mode User/Password, le compte Ewon doit disposer du droit `FORCE OUTPUT` pour accéder aux tags OPC UA ; ce droit est plus large que la lecture. Le flow fourni ne comporte aucune opération d’écriture, mais ce n’est pas une restriction de droits côté serveur. Faire confirmer les droits du compte approprié avant de les modifier.

Le diagnostic doit d’abord parcourir les tags publiés, puis lire un NodeId réel. Les NodeId ne sont pas déduits du nom d’un tag. Le mapping vers l’état de la machine et l’API de l’IHM seront définis après une première lecture validée. Aucun polling ni abonnement métier automatique n’est prévu à cette étape.

## Mettre à jour

Arrêter cette instance avec Ctrl+C, puis :

```powershell
git pull --ff-only
npm.cmd ci --prefix services/node-red
npm.cmd run start --prefix services/node-red
```

Les nouveaux flows du dossier versionné `flows/` se réimportent explicitement. Cela protège les modifications effectuées localement dans l’éditeur. La palette installée est figée par le lockfile ; l’installation de modules depuis l’éditeur est désactivée pour éviter une dérive locale non reproductible.

## Hors Internet et étapes suivantes

Internet est nécessaire à l’installation initiale des paquets. Après installation, cette instance et ses ressources sont locales. Un accès distant à l’Ewon via eCatcher exige néanmoins le réseau et le VPN ; sur site, une connexion LAN directe pourra être utilisée.

Le démarrage automatique sur le PC IoT, les essais sur le matériel cible et le raccordement effectif de l’IHM ne sont pas inclus dans cette étape. La priorité est d’établir les flows OPC UA en lecture seule, en gardant l’affichage actuel.

## Références

- [Configuration Node-RED : userDir, uiHost, uiPort, nodesDir](https://nodered.org/docs/user-guide/runtime/configuration)
- [Palette node-red-contrib-opcua](https://flows.nodered.org/node/node-red-contrib-opcua)
- [Publication OPC UA et droits des utilisateurs Ewon](https://support.hms-networks.com/hc/en-us/articles/9347134020626-Publish-Tags-through-the-Ewon-OPCUA-Server)
