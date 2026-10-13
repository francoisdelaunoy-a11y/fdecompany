---
name: fde-impact
description: Relier les problèmes constatés à leur impact financier — chaîne MECE constat → cause → impact en €, hypothèses explicites et sourcées. À utiliser pour chiffrer un gain, construire un business case, ou prioriser des problèmes.
---

# Problèmes et impact

Pour chaque problème :

| Champ | Contenu |
|---|---|
| Constat | Le fait mesuré, avec le chiffre et sa source (KPI calculé ou document) |
| Cause racine | L'hypothèse de cause, avec les preuves (données, interviews) et le niveau de confiance |
| Mécanisme | Comment la cause dégrade le résultat (tonnes perdues, heures, pénalités, clients perdus) |
| Impact annuel | Formule explicite, chaque hypothèse nommée et sourcée (P&L, prix, marge, coûts horaires) |
| Fourchette | Bas / central / haut ; dire ce qui ferait basculer |
| Qui peut le confirmer | Personne et question précise |

Règles :
- Arbre MECE : les impacts ne se recouvrent pas (pas de double comptage entre rebut, capacité perdue et heures sup).
- Raisonner en marge sur coûts variables pour les volumes perdus, en coût complet seulement si la capacité est réellement libérée.
- Rapprocher le total du P&L du site : un gain supérieur à ce que le P&L permet est faux.
- Toute hypothèse non validée par le client est marquée « à valider ».
