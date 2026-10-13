# Playbook FDE — méthode commune à tous les engagements

Ce fichier s'applique à **chaque** client (marque, industriel, groupe). Il décline en étapes la doctrine `/fde-basics` (FDE School), qui prime en cas de désaccord. Les règles propres à un client vivent dans le `CLAUDE.md` de son engagement ; en cas de conflit, la règle client l'emporte, sauf sur la confidentialité et la traçabilité.

## Posture

- On part du **P&L** : la décision qui fait bouger la marge, chiffrée en € avant toute ligne de code. On refuse la plupart des cas d'usage ; on vise des multiples, pas des pourcentages. Une solution IA n'est proposée que si elle bat une solution simple (règle, tableur, process).
- Un gain n'existe qu'**une fois signé par la finance** : baseline écrite avec le contrôleur dès la semaine 1, arbre levier → effet physique → ligne du P&L.
- On raisonne depuis **le goulot** : une heure gagnée ailleurs est un mirage.
- On travaille **chez le client, sur ses données réelles, avec ses gens**. Ce que disent les interviews est une hypothèse tant que les données ne l'ont pas confirmé, et inversement.
- On livre **petit, tôt et en production**, sur un site phare, puis on étend. L'ERP reste le système de référence : couche fine d'agents et d'apps qui lisent et réécrivent les décisions, pas de migration big-bang.
- On mène **le changement**, pas seulement le build : les experts co-auteurs, les overrides étudiés, l'adoption mesurée en décisions prises avec l'outil.
- On écrit pour être relu par le client : chaque chiffre, chaque affirmation sur une personne doit pouvoir lui être montré.
- Quand on ne sait pas, on le dit et on formule **la question précise** à poser, et à qui.

## Boucle d'un engagement

| Étape | Livrable | Skill |
|---|---|---|
| 0. Cadrage | `engagements/<client>/` créé, sponsor, décision chiffrée en €, propriétaire, date d'arrêt, périmètre figé | `/fde-new-engagement` |
| 1. Découverte | Interviews (dernier cas réel, opérateurs inclus), règles implicites, carte des acteurs, arbre d'hypothèses | `/fde-discovery` |
| 2. Données | Recensement (systèmes / tableurs / têtes), `DATA_NOTES.md` : profil, anomalies, questions | `/fde-data-profile` |
| 3. Baseline | Module KPI testé, baseline signée par le contrôleur, vérification indépendante (`VERIFY.md`) | `/fde-kpi` |
| 4. Goulot, problèmes et gains | Contrainte prouvée, arbre des gains vers le P&L, bas / central / haut, triangulé | `/fde-impact` |
| 5. Cas d'usage IA | Décision, € , goulot, données, risques et contrôles, critères d'arrêt | `/fde-use-cases` |
| 6. Démo, mise en production, relais | Démo 3 min, mémo d'échec du déploiement naïf, runbook, propriétaire interne formé | `/fde-demo` |

On ne saute pas d'étape : pas de cas d'usage IA sans baseline chiffrée, pas de baseline sans profil des données.

## Règles non négociables

1. **Confidentialité entre clients.** Ne jamais lire, citer, réutiliser ou comparer les données, chiffres, noms ou documents d'un client dans le travail d'un autre. Les benchmarks ne viennent que de sources publiques, citées. Pas de nom de client ni de donnée confidentielle dans un outil sans protection contractuelle des données ; pas de secret ni d'identifiant de production dans le code.
2. **Traçabilité.** Chaque chiffre est calculé en code depuis la source brute, ou renvoie au document source (fichier et section). Aucun chiffre tapé à la main dans une interface ou un livrable.
3. **Données d'abord profilées.** Avant tout calcul : volumes par période et par entité, plages de valeurs, doublons exacts, trous de calendrier, dénominateurs nuls, unités suspectes. Chaque anomalie est écrite dans `DATA_NOTES.md` et **soumise à l'équipe** avant d'être traitée ; jamais de nettoyage silencieux.
4. **Ratios agrégés par sommes**, jamais par moyenne de ratios. Unités affichées sur chaque nombre (t, %, min, €, j).
5. **Vérification indépendante.** Les trois chiffres clés sont recalculés par une autre méthode (autre personne, autre outil) et consignés dans `VERIFY.md`. On ne présente qu'une fois d'accord, ou en sachant expliquer l'écart.
6. **Tests et build avant de dire « fini ».** Les calculs de KPI sont dans un seul module couvert par des tests unitaires.
7. **Respect des personnes.** Les interviews sont résumées, relues par la personne, sans jugement nominatif. Rien sur une personne qu'on ne lui montrerait pas. Les données personnelles restent chez le client.
8. **Simplicité.** Une page, pas de login, pas de base de données tant que le besoin n'est pas prouvé. On préfère lire les fichiers au build.
9. **Journal.** Toute décision, hypothèse ou réponse du client ajoute une ligne datée à `log.md` de l'engagement.
10. **Pas de surprise.** Une mauvaise nouvelle va au sponsor tout de suite, avec sa cause et un plan de rattrapage.
11. **Jamais de chiffre client inventé.** Une hypothèse est marquée comme telle, avec la façon de la vérifier.
12. **Examens FDE School à livre fermé** : ne jamais aider à répondre à une question d'examen en cours.

## Comment Claude doit travailler

- Répondre dans la langue de l'interlocuteur ; les livrables client dans la langue du client.
- Commencer par la recommandation, puis le raisonnement, en mots simples, chiffres ronds et calcul montré. Si une demande contredit la doctrine, le dire et proposer la façon FDE.
- Avant d'agir sur un engagement, lire son `CLAUDE.md`, son `index.md`, son `log.md` et `DATA_NOTES.md` s'il existe.
- Distinguer explicitement dans chaque réponse : **fait** (source citée), **hypothèse** (à vérifier, avec la question), **recommandation**.
- Poser les questions bloquantes tôt, regroupées, chacune avec sa raison et son destinataire (« à demander au directeur de site : … »).
- Terminer chaque livraison par : ce qui a été fait, ce qui a été vérifié et comment, ce qui reste ouvert.
