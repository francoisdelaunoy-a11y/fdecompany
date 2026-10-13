---
name: fde-data-profile
description: Profiler un jeu de données client avant tout calcul et écrire DATA_NOTES.md avec les anomalies et les questions à trancher. À utiliser dès qu'un nouveau fichier de données (CSV, export ERP/MES, Excel) arrive dans un engagement.
---

# Profil des données

Commencer par un **recensement** : quelles données sont dans les systèmes (ERP, MES…), dans des tableurs, dans les têtes (souvent ~40 %). Pour chaque champ, le système propriétaire. Ne pas faire confiance aux données de référence ERP (gammes, cadences standard, délais) sans vérification terrain. Accès progressif : extraits en lecture, puis API, puis réécriture validée et tracée.

Écrire un script reproductible et idempotent (clés métier stables, contrôles à chaque étape) (dans l'engagement, pas dans le scratch) qui produit pour chaque fichier :

1. Nombre de lignes, colonnes, types ; période couverte.
2. Lignes par période et par entité (jour × équipe, jour × machine, semaine × magasin…) ; **combinaisons manquantes** du calendrier attendu.
3. Min / max / médiane / nulls par colonne ; valeurs hors plage physique (négatifs, > capacité, > durée du poste).
4. **Doublons exacts** et quasi-doublons sur la clé métier.
5. Dénominateurs nuls (temps planifié = 0, quantité = 0).
6. Valeurs d'une **autre unité** probable (kg vs t, h vs min, € vs k€) : ordre de grandeur ×1000 ou ×60.
7. Incohérences entre colonnes (somme des temps ≠ temps planifié, rebut > production).
8. Cohérence avec les chiffres cités en interview ou dans les documents financiers.

Écrire `DATA_NOTES.md` : une ligne par anomalie avec **constat chiffré, lignes concernées, options de traitement, impact de chaque option sur les KPI, décision proposée, statut (à valider / validé par X le JJ/MM)**.

Puis **s'arrêter et demander** à l'équipe comment traiter chaque anomalie (AskUserQuestion, une question par anomalie significative). Pour ce qui relève de la réalité du site, formuler la question au client. Aucun nettoyage silencieux.
