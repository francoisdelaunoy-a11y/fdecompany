---
name: fde-discovery
description: Phase de découverte FDE — préparer un guide d'interview, synthétiser des notes d'interview au format du bundle, cartographier les acteurs et construire l'arbre d'hypothèses. À utiliser pour toute interview, verbatim, compte rendu terrain ou carte des parties prenantes.
---

# Découverte

## Préparer une interview
- Partir de la question métier et des hypothèses ouvertes de l'engagement.
- 6 à 10 questions ouvertes sur **le dernier cas réel** (« racontez-moi comment vous avez construit le planning d'hier »), pas sur le process théorique ; une demande de donnée ou de document par interview.
- Interviewer les opérateurs, pas seulement les managers. Chercher les contournements, tableurs, exceptions et overrides : ce sont les **algorithmes cachés** (règles des meilleurs experts, rarement écrites).
- Adapter au rôle : direction (enjeux, €, arbitrages), encadrement (process, indicateurs), terrain (irritants, gemba). Repérer les peurs derrière les résistances (statut, expertise, emploi, blâme).

## Synthétiser une interview
Un fichier par personne, `interviews/NN-prenom-role-site.md`, avec ce frontmatter :

```yaml
---
type: interview
title: <Prénom>, <rôle>
description: <une phrase : ce qui compte pour cette personne>
tags: [interview, <site>, <fonction>]
interviewee: <Prénom>
role: <rôle>
site: <site>
date: AAAA-MM-JJ
interviewer: <équipe>
sources: [<enregistrement / documents cités>]
status: draft   # passe à active une fois relu par la personne
---
```

Puis deux sections : `## Ce qu'il/elle a dit` (verbatims courts, entre guillemets, chiffres tels quels) et `## Nos notes` (recoupements avec les données ou d'autres interviews, contradictions, questions de suivi). Aucun jugement sur la personne.

## Consolider
- Tableau des acteurs : rôle, ce qu'il veut, ce qu'il craint, influence sur la décision.
- Transformer chaque plainte en énoncé testable : métrique, périmètre, baseline.
- Arbre d'hypothèses MECE à partir de la décision métier ; pour chaque feuille : qui l'affirme, quelle donnée la confirmerait ou l'infirmerait.
- Esquisse d'ontologie : objets (produits, machines, recettes, commandes…), relations, **règles et contraintes au niveau du type** (cadences, familles autorisées, matrice de changement, purges) vs état de l'instance, actions permises, système propriétaire de chaque donnée.
- Lister les contradictions entre interviews : ce sont souvent les meilleures pistes.
- Ajouter une ligne datée à `log.md`.
