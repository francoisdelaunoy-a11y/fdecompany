---
name: fde-discovery
description: Phase de découverte FDE — préparer un guide d'interview, synthétiser des notes d'interview au format du bundle, cartographier les acteurs et construire l'arbre d'hypothèses. À utiliser pour toute interview, verbatim, compte rendu terrain ou carte des parties prenantes.
---

# Découverte

## Préparer une interview
- Partir de la question métier et des hypothèses ouvertes de l'engagement.
- 6 à 10 questions ouvertes, factuelles (« la dernière fois que… », « montrez-moi »), une demande de donnée ou de document par interview.
- Adapter au rôle : direction (enjeux, €, arbitrages), encadrement (process, indicateurs), terrain (irritants, contournements, gemba).

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
- Arbre d'hypothèses MECE à partir de la question métier ; pour chaque feuille : qui l'affirme, quelle donnée la confirmerait ou l'infirmerait.
- Lister les contradictions entre interviews : ce sont souvent les meilleures pistes.
- Ajouter une ligne datée à `log.md`.
