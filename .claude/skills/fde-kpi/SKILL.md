---
name: fde-kpi
description: Construire la baseline chiffrée d'un engagement — module KPI unique testé, agrégation par sommes, unités partout, vérification indépendante dans VERIFY.md. À utiliser pour calculer TRS/OEE, OTIF, rebut, changements de série, coûts, ou tout indicateur affiché au client.
---

# Baseline KPI

1. Prérequis : `DATA_NOTES.md` existe et les anomalies bloquantes sont tranchées. Sinon lancer `/fde-data-profile`.
2. Définitions écrites dans le `CLAUDE.md` de l'engagement (formule, unité, agrégation, source). Par défaut :
   - disponibilité = Σ temps de marche / Σ temps planifié
   - performance = Σ production / Σ (temps de marche × cadence idéale)
   - qualité = Σ (production − rebut) / Σ production
   - TRS = disponibilité × performance × qualité
   Toujours des **ratios de sommes**, jamais des moyennes de ratios.
3. Un seul module de calcul, fonctions pures, appliquant les décisions de `DATA_NOTES.md` de façon explicite et nommée.
4. Tests unitaires (≥ 3) : cas parfait, cas limite (dénominateur nul), cas qui piège la moyenne de ratios, cas d'anomalie traitée.
5. Unités sur chaque nombre affiché (t, %, min, €, j). Aucun chiffre en dur dans l'interface.
6. Vérification indépendante : recalculer les 3 chiffres clés par une autre méthode (script séparé ou tableur, sans réutiliser le module) et remplir `VERIFY.md` (valeur, méthode, filtres, écart et explication).
7. Lancer les tests et le build avant d'annoncer le résultat.
