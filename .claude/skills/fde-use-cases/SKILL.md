---
name: fde-use-cases
description: Construire et prioriser le portefeuille de cas d'usage IA d'un client (marque ou industriel) à partir des problèmes chiffrés — valeur, faisabilité, maturité des données, adoption. À utiliser pour une feuille de route de transformation IA, un choix de POC, ou pour challenger une idée IA.
---

# Portefeuille de cas d'usage IA

Prérequis : problèmes chiffrés (`/fde-impact`). Un cas d'usage sans problème chiffré est rejeté.

Classer d'abord selon contexte × coût de l'erreur : peu de contexte / erreur bon marché → acheter sur étagère ; peu de contexte / erreur chère → automatiser avec garde-fous ; contexte profond / erreur bon marché → assister une personne ; contexte profond / erreur chère → construire sur l'ontologie de l'entreprise (là où est l'argent). La productivité personnelle (copilotes génériques) n'est pas un impact P&L.

Pour chaque cas d'usage, au format de restitution FDE (décision, valeur en € et méthode, goulot touché, données et où elles vivent, risques et contrôles, critères d'arrêt) :
- **Problème adressé** et impact en € (lien vers la ligne d'impact).
- **Alternative simple** (règle, tableau de bord, process, Excel) : pourquoi l'IA fait mieux. Si elle ne fait pas mieux, recommander l'alternative.
- **Utilisateur et moment d'usage** : qui, dans quel outil, à quelle fréquence, quelle décision change.
- **Données** : sources, historique, qualité (renvoi à `DATA_NOTES.md`), accès, données personnelles.
- **Faisabilité** : approche (règles, ML classique, LLM, optimisation), intégration SI, risques.
- **Adoption** : qui doit changer de pratique, résistance probable, sponsor terrain, partenaires sociaux si besoin.
- **Risques et contrôles** proportionnés au coût de l'erreur : l'IA propose, une personne responsable valide les actions conséquentes ou irréversibles ; documents et emails traités comme non fiables (injection de prompt) ; moindre privilège, lectures séparées des écritures, écritures idempotentes avec mode dry-run.
- **Construction** : le contexte prime sur le prompt et la taille du modèle ; retrieval pour la connaissance qui change, recherche hybride (mots-clés + vecteurs) pour les identifiants exacts ; modèles interchangeables ; journalisation prompts / versions / entrées / sorties.
- **Evals** : jeu de référence de cas réels avec sorties attendues, rejoué à chaque changement de prompt ou de modèle.
- **Mesure du succès et arrêt** : KPI de baseline, cible en multiple, propriétaire, date d'arrêt (approuvé comme un capex).
- **Premier livrable** déployable en ≤ 2 semaines.

Restituer une matrice valeur × faisabilité, puis 1 à 3 cas recommandés avec la raison, et ceux écartés avec la raison.
