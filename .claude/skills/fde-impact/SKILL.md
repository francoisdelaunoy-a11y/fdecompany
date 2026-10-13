---
name: fde-impact
description: Relier les problèmes constatés à leur impact financier — chaîne MECE constat → cause → impact en €, hypothèses explicites et sourcées. À utiliser pour chiffrer un gain, construire un business case, ou prioriser des problèmes.
---

# Problèmes et impact

D'abord **le goulot** : identifier la contrainte avec des preuves (charge, file d'attente, TRS), car seule une heure gagnée au goulot vaut de l'argent. Loi de Little : délai = en-cours ÷ débit ; lancer plus de travail dans un atelier saturé rend les commandes plus tardives. Exploiter, subordonner, puis seulement élever.

Puis l'**arbre des gains** : levier opérationnel → effet physique → ligne du P&L. Pas de branche vers une ligne du P&L, pas de gain.

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
- Capacité libérée : à la marge sur coûts variables **seulement si le volume supplémentaire se vend** (plafonné par le carnet de commandes) ; sinon au coût variable évité, ou via une décision structurelle de la direction.
- Compter honnêtement : récurrent vs ponctuel, brut vs net du coût de mise en œuvre, run-rate vs réalisé. Une baisse de stock est un gain de trésorerie ponctuel, récurrent seulement pour le coût de portage.
- Trianguler : reconstruire le chiffre par une seconde méthode indépendante ; écart ≤ 20-30 % on présente, au-delà on cherche l'erreur. Payback = coût ponctuel ÷ run-rate mensuel net, montée en charge incluse.
- Rapprocher le total du P&L du site : un gain supérieur à ce que le P&L permet est faux.
- Le logiciel libère de la capacité ; seules des décisions la transforment en argent : nommer le propriétaire côté client.
- Toute hypothèse non validée par le client est marquée « à valider ».
