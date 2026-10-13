---
name: fde-demo
description: Préparer une démo client de 3 minutes sans slides et le passage de relais — URL live, constat clé et preuve, chiffre vérifié, insight en une phrase chiffrée, question du lundi. À utiliser avant toute restitution, comité ou point sponsor.
---

# Démo et adoption

1. Vérifier : tests et build passent, l'URL charge (< 3 s), `VERIFY.md` concorde sur les chiffres clés.
2. Écrire le script (3 min, sans slides) :
   1. L'URL, en direct.
   2. Le constat principal (ex. la contrainte) et **comment on le sait**.
   3. Un chiffre vérifié et **comment** il a été vérifié.
   4. **L'insight** que le sponsor ne connaît pas : une phrase, un nombre, une source.
   5. **La question** à poser au sponsor lundi.
3. Anticiper 3 objections probables (d'après les interviews) et la donnée qui y répond.
4. Avant mise en production : **mémo d'échec du déploiement naïf** (ce qui casse, qui réagit, sous quel délai).
5. Passage de relais seulement quand existent monitoring, runbook et propriétaire interne formé, et que la nouvelle routine tient sans nous. Prévoir le champion interne, les changements d'équipe et la formation au poste ; mesurer l'adoption en décisions prises avec l'outil et motifs d'override, pas en connexions.
6. Ajouter une ligne datée à `log.md`.
