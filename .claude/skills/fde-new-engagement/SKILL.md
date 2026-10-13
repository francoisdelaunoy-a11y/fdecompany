---
name: fde-new-engagement
description: Ouvre un nouvel engagement FDE pour un client (marque, industriel, groupe) en créant engagements/<client>/ depuis le modèle. À utiliser quand l'utilisateur démarre une mission chez un nouveau client ou veut cadrer une transformation IA.
---

# Ouvrir un engagement

1. Appliquer `/fde-basics` (doctrine) et `fde/PLAYBOOK.md`.
2. Recueillir, en **une seule question groupée** (AskUserQuestion ou liste), ce qui manque parmi :
   client et secteur, sponsor et son rôle, **la décision qui fait bouger la marge** (planifier, acheter, lancer, chiffrer) et son ordre de grandeur en €, propriétaire côté client avec mandat de décision, date d'arrêt, périmètre figé et nommé (site phare, lignes, marques, période), contrôleur de gestion pour la baseline, date de démo, langue des livrables, contraintes de confidentialité, sources de données disponibles.
   Si la décision ne peut pas être chiffrée en €, le dire : c'est un motif de refus ou de recadrage.
   Ne rien inventer : laisser `{{...}}` pour ce qui reste inconnu et le lister comme question ouverte.
3. Créer `engagements/<client-en-kebab-case>/` en copiant `fde/templates/engagement/` puis remplir les `{{...}}` connus.
4. Ajouter à `log.md` de l'engagement : `- AAAA-MM-JJ : engagement ouvert, sponsor X, question « … ».`
5. Restituer : l'arborescence créée, les questions ouvertes (avec destinataire), et la prochaine étape (`/fde-discovery`).

Ne jamais copier de données, chiffres ou documents d'un autre engagement.
