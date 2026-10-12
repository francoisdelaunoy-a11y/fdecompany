# Data notes (Pair A)

Profil des fichiers sources et traitement appliqué dans `index.html` (bloc `kpi-lib`, testé par `tests/kpi.test.js`).
Chaque traitement est un choix provisoire à confirmer avec l'équipe et le site.

## extrusion_shift_log.csv — 1 890 lignes brutes, 1 883 après nettoyage

| Anomalie | Constat | Traitement | Question pour le site |
|---|---|---|---|
| Doublons exacts | 7 lignes répétées à l'identique : 11 mars, équipe A, M01 à M07 | Supprimées (garder une occurrence) | Double import du shift A du 11 mars ? |
| Unité kg au lieu de t | M06, équipe B, 22, 23 et 24 janv. : output_t = 12 750 / 8 750 / 10 750 (max physique ≈ 18 t par shift à 2,3 t/h), scrap_t idem | Divisés par 1 000 (seuil : output_t > 100). Après correction, le total extrusion (21 922,9 t) recoupe `stage_daily` (21 923,4 t) | Qui saisit M06 en équipe B, et le formulaire a-t-il changé ces jours-là ? |
| Shift manquant | Aucune ligne pour le 17 févr., équipe C (7 machines) | Laissé tel quel ; `stage_daily` montre 6 720 min planifiées ce jour-là (= 2 shifts), donc shift non planifié | Arrêt planifié la nuit du 17 févr. ? |
| planned_min = 0 | M03, 1er mars, équipes A, B et C (run, output à 0) | Conservé ; sans effet sur les sommes ; divisions protégées (null au lieu de NaN) | M03 arrêtée pour maintenance le 1er mars ? `stage_daily` montre 8 640 min ce jour-là, cohérent |
| Arrêts > planifié | M03, 31 mars, équipe C : 409 + 42 + 33 = 484 min pour 480 planifiées, run_min = 0 | Conservé tel quel | Le changement de 409 min a-t-il débordé sur le shift suivant ? |
| ideal_rate_tph | 2,3 t/h pour les 7 lignes, sans variation | Utilisé tel quel | Les 7 lignes ont-elles vraiment la même cadence nominale, quel que soit le produit ? |

Aucune valeur manquante, aucune valeur négative.

## stage_daily.csv — 270 lignes (90 jours × 3 étapes)

Aucun doublon, aucune valeur manquante. planned_min = 10 080 (7 unités × 24 h) sauf le 17 févr. (6 720) et le 1er mars (8 640), cohérents avec le journal d'extrusion.

## Choix de calcul

- Tous les ratios sont agrégés par sommes (jamais de moyenne de ratios).
- Goulot = étape dont les minutes affamée + bloquée sont les plus faibles : l'amont s'y bloque (mélange bloqué 11,7 %), l'aval y est affamé (conditionnement affamé 16,5 %).
- Semaines du lundi au dimanche ; la première (29 déc., 4 jours) et la dernière (30 mars, 2 jours) sont partielles et signalées comme telles.
