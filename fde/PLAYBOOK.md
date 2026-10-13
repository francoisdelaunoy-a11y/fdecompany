# Playbook FDE — méthode commune à tous les engagements

Ce fichier s'applique à **chaque** client (marque, industriel, groupe). Les règles propres à un client vivent dans le `CLAUDE.md` de son engagement et complètent ce playbook ; en cas de conflit, la règle client l'emporte, sauf sur la confidentialité et la traçabilité.

## Posture

- On part du **problème métier et de son coût**, jamais de la technologie. Une solution IA n'est proposée que si elle bat une solution simple (règle, tableur, process) sur le même problème.
- On travaille **chez le client, sur ses données réelles, avec ses gens**. Ce que disent les interviews est une hypothèse tant que les données ne l'ont pas confirmé, et inversement.
- On livre **petit, tôt et en production** : un outil utilisé lundi vaut mieux qu'une maquette parfaite vendredi.
- On écrit pour être relu par le client : chaque chiffre, chaque affirmation sur une personne doit pouvoir lui être montré.
- Quand on ne sait pas, on le dit et on formule **la question précise** à poser, et à qui.

## Boucle d'un engagement

| Étape | Livrable | Skill |
|---|---|---|
| 0. Cadrage | `engagements/<client>/` créé, sponsor, question métier, périmètre, date de démo | `/fde-new-engagement` |
| 1. Découverte | Interviews synthétisées, carte des acteurs, arbre d'hypothèses | `/fde-discovery` |
| 2. Données | `DATA_NOTES.md` : profil, anomalies, questions au client | `/fde-data-profile` |
| 3. Baseline | Module KPI testé + vérification indépendante (`VERIFY.md`) | `/fde-kpi` |
| 4. Problèmes et impact | Chaîne constat → cause → impact en €, hypothèses explicites | `/fde-impact` |
| 5. Cas d'usage IA | Portefeuille priorisé valeur × faisabilité × maturité des données | `/fde-use-cases` |
| 6. Démo et adoption | Démo 3 min, l'insight, la question du lundi, plan de passage de relais | `/fde-demo` |

On ne saute pas d'étape : pas de cas d'usage IA sans baseline chiffrée, pas de baseline sans profil des données.

## Règles non négociables

1. **Confidentialité entre clients.** Ne jamais lire, citer, réutiliser ou comparer les données, chiffres, noms ou documents d'un client dans le travail d'un autre. Les benchmarks ne viennent que de sources publiques, citées.
2. **Traçabilité.** Chaque chiffre est calculé en code depuis la source brute, ou renvoie au document source (fichier et section). Aucun chiffre tapé à la main dans une interface ou un livrable.
3. **Données d'abord profilées.** Avant tout calcul : volumes par période et par entité, plages de valeurs, doublons exacts, trous de calendrier, dénominateurs nuls, unités suspectes. Chaque anomalie est écrite dans `DATA_NOTES.md` et **soumise à l'équipe** avant d'être traitée ; jamais de nettoyage silencieux.
4. **Ratios agrégés par sommes**, jamais par moyenne de ratios. Unités affichées sur chaque nombre (t, %, min, €, j).
5. **Vérification indépendante.** Les trois chiffres clés sont recalculés par une autre méthode (autre personne, autre outil) et consignés dans `VERIFY.md`. On ne présente qu'une fois d'accord, ou en sachant expliquer l'écart.
6. **Tests et build avant de dire « fini ».** Les calculs de KPI sont dans un seul module couvert par des tests unitaires.
7. **Respect des personnes.** Les interviews sont résumées, relues par la personne, sans jugement nominatif. Rien sur une personne qu'on ne lui montrerait pas. Les données personnelles restent chez le client.
8. **Simplicité.** Une page, pas de login, pas de base de données tant que le besoin n'est pas prouvé. On préfère lire les fichiers au build.
9. **Journal.** Toute décision, hypothèse ou réponse du client ajoute une ligne datée à `log.md` de l'engagement.

## Comment Claude doit travailler

- Répondre dans la langue de l'interlocuteur ; les livrables client dans la langue du client.
- Avant d'agir sur un engagement, lire son `CLAUDE.md`, son `index.md`, son `log.md` et `DATA_NOTES.md` s'il existe.
- Distinguer explicitement dans chaque réponse : **fait** (source citée), **hypothèse** (à vérifier, avec la question), **recommandation**.
- Poser les questions bloquantes tôt, regroupées, chacune avec sa raison et son destinataire (« à demander au directeur de site : … »).
- Terminer chaque livraison par : ce qui a été fait, ce qui a été vérifié et comment, ce qui reste ouvert.
