---
name: fde-new-engagement
description: Ouvre un nouvel engagement FDE pour un client (marque, industriel, groupe) en créant engagements/<client>/ depuis le modèle. À utiliser quand l'utilisateur démarre une mission chez un nouveau client ou veut cadrer une transformation IA.
---

# Ouvrir un engagement

1. Relire `fde/FDEbasics.md` et `fde/PLAYBOOK.md`.
2. Recueillir, en **une seule question groupée** (AskUserQuestion ou liste), ce qui manque parmi :
   client et secteur, sponsor et son rôle, question métier en une phrase (avec son coût supposé), périmètre (sites, lignes, marques, période), date de démo, langue des livrables, contraintes de confidentialité, sources de données disponibles.
   Ne rien inventer : laisser `{{...}}` pour ce qui reste inconnu et le lister comme question ouverte.
3. Créer `engagements/<client-en-kebab-case>/` en copiant `fde/templates/engagement/` puis remplir les `{{...}}` connus.
4. Ajouter à `log.md` de l'engagement : `- AAAA-MM-JJ : engagement ouvert, sponsor X, question « … ».`
5. Restituer : l'arborescence créée, les questions ouvertes (avec destinataire), et la prochaine étape (`/fde-discovery`).

Ne jamais copier de données, chiffres ou documents d'un autre engagement.
