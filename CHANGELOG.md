# 📝 Notes de mise à jour

## **1.5.7**

#### 🛠️ Corrections
- Modal de suspension d'intervention et de tâche désactivées pour les administrateurs
- Affichage de la raison de la suspension d'une intervention dans les détails de l'intervention
- Affichage de la raison de la suspension d'une tâche dans le titre du haut de page d'une tâche

---

## **1.5.5**

#### 🛠️ Corrections
- Ajout d'un nouveau type de bateau "Véhicule"
- Nouvel icon pour type Autre et type véhicule pour la carte
- Interventions suspendues affichées en dernier dans la liste

---

## **1.5.4**

#### 🛠️ Corrections
- Problème carte qui ne se charge pas correctement, fichier CSS importé directement depuis le fichier d'entrée. (A tester en prod)

---

## **1.5.3**

#### 🛠️ Corrections
- Fiche interventions, infos utiles

---

## **1.5.2**

#### 🛠️ Corrections
- Bug affichage tableau de bord

---

## **1.5.1**

#### 🛠️ Corrections
- Bug label intervention suspendue même lorsqu'il n'y a pas d'intervention
- Affichage total d'heures par techniciens sur la fiche d'intervention
- Plus de placeholders sur modification travaux effectués
- Responsive tableau de bord

---

## **1.5.0**

#### 🚀 Nouvelles fonctionnalités
- Édition du tableau de bord
- Génération d'une fiche d'intervention
- Modification des informations d'un utilisateur

#### 🛠️ Corrections
- Intervention suspendue au lieu de en cours dans la page bateau
- Suppression des placeholders dans le formulaire de travaux effectués
- Suppression du label Filtrer les interventions pour utilisateur
- Ancienne valeur de la tâche lors de la création d'une tâche remise à zéro
- Inversement titre inter et nom du bateau dans la modification de l'ordre des inters

---

## **1.4.0**

#### 🚀 Nouvelles fonctionnalités
- Organisation de l'ordre d'affichage des interventions
- Affichage modal contact depuis une intervention
- Nouveau type de bateau "Autre"
- Photo du bateau directement dans la carte
- Bouton pour appeler le contact sur la carte contact
- Ouvrir carte contact en cliquant dessus
- Ouvrir les tâches en cliquant sur la carte "Détails de l'intervention" dans interventions
- Ouvrir la page du bateau en cliquant sur la carte "Détails du bateau" dans interventions

#### 🛠️ Corrections
- Label position GPS, Panne ou place dans la carte suivant la donnée sur intervention
- Possibilité de créer un nouveau contact depuis le formulaire de modification d'un bateau
- Affichage des couleurs des priorités en permanence
- Photo des techniciens dans la fiche de travaux effectués
- Bug du cropper corrigé

---

## **1.3.6**

#### 🚀 Nouvelles fonctionnalités
- Affichage modal contact depuis bateau avec possibilité de mettre une note
- Filtrage + pagination dans la liste des interventions
  - Filtre par état de l'intervention
  - Tri par priorité ou date de création

#### 🛠️ Corrections
- Sécurité supplémentaire pour la suppression d'un utilisateur
- Label position GPS, Panne ou place dans la carte suivant la donnée sur bateau
- Tableau des heures : Première colonne et première ligne sticky et changement ordre des dates
- Afficher Dany dans la liste des utilisateurs
- Scroll automatiquement en haut sur la page d'intervention

---

## **1.3.5**

#### 🚀 Nouvelles fonctionnalités
- Nouvelle version du tableau des heures
- Export des heures au format xlsx (Excel/Tableur)

---

## **1.3.4**

#### 🚀 Nouvelles fonctionnalités
- Les bateaux peuvent désormais avoir une image de miniature

#### 🛠️ Corrections
- Affichage du nom du bateau et du titre de l'intervention dans les tâches
- Bouton retour dans la modal de suspension d'une tâche/intervention

---

## **1.3.3**

#### 🚀 Nouvelles fonctionnalités
- Possibilité de suspendre des interventions/tâches avec raison
- Affichage de la position du bateau dans la page d'intervention
- Possibilité de supprimer/modifier un travail effectué

#### 🛠️ Corrections
- L'utilisateur Clément Mistral n'apparaît plus dans la selection lors de l'ajout d'un travail effectué
- Lors de la création d'un bateau, le contact nouvellement créé est sélectionné automatiquement
- Routes Utilisateurs, contacts et fichiers limitées aux administrateurs
- Si toutes les tâches d'une intervention sont terminées, l'intervention est marquée comme terminée
- Nouveaux icons + remplacement de l'icon clé par l'icon du bateau

---

## **1.3.1**

#### 🚀 Nouvelles fonctionnalités
- Système de fichiers
  - Image de profil pour les utilisateurs
  - Médias liés aux bateaux
- Ajout des droits et des restrictions sur les actions et les routes, filtrage administrateur

#### 🛠️ Corrections
- Le bouton d'ajout d'un technicien lors du remplissage d'une fiche de travaux et désormais à droite
- Bouton désactivé plus esthétiques

---

## **1.2.4**

#### 🚀 Ajout mineur
- Affichage total des heures par intervention

#### 🛠️ Corrections
- Remplacer le status d'intervention "Terminée" par "Facturée"
- Affichage du nom complet d'un technicien sur une fiche de travaux
- Afficher uniquement Travaux effectués, materiel utilisé et heures sur fiche de travaux
- Disable les boutons lorsque l'on rentre une nouvelle fiche de travaux
- Suppression des placeholders lors du remplissage d'une nouvelle fiche d'intervention

---

## **1.2.3**

#### 🚀 Nouvelles fonctionnalités
- Possibilité de changer l'ordre des tâches/groupes
- Ajout des fiches de travaux

#### 🛠️ Corrections
- Quelques correctifs minim

---

## **1.1.1**

#### 🚀 Nouvelles fonctionnalités
- Ajout de la position d'un bateau en plaçant un point sur la carte
- Récupération de la position GPS de l'appareil

#### 🛠️ Corrections
- Le logo dans la barre de navigation est à présent bleu
- Image du marker GPS dans la carte

---

## **1.0.0**

### **Refonte majeure & nouveau pipeline de déploiement**
Cette version apporte une restructuration de l’application et introduit plusieurs fonctionnalités essentielles.  
Un nouveau flux CI/CD via **GitHub Actions** est désormais en place : chaque push sur `main` déclenche automatiquement la construction de l’image Docker correspondante.

#### 🛠️ Modification majeure
- Passage de PostgreSQL à MySQL

#### 🛠️ Modifications mineures
- L'icon des bateaux dans la liste change selon le type de bateau (Voilier ou autre)

#### 🚀 Nouvelles fonctionnalités
- Gestion complète des heures 
- Gestion complète des utilisateurs  
- Rôles & permissions  
- Gestion complète des interventions  
- Page dédiée aux notes de version (affichage du CHANGELOG)
- Modification complète d'un contact
- Bouton de retour en arrière
- Page de première connexion (s'affiche lorsqu'un utilisateur se connecte pour la première fois, ou que son mot de passe a été réinitialisé)

#### 🛠️ Corrections
- Correction d’un bug lors de la déconnexion

---

## **0.0.8**
### **Première version destinée à la production**
Version initiale mise en production, comprenant les fonctionnalités de base pour les contacts, bateaux et interventions.

#### 📇 Contacts
- Création d’un contact via une modal  
- Modification des coordonnées & suppression depuis une modal  
- Recherche avancée avec filtres : nom complet, entreprise, email, téléphone

#### 🛥️ Bateaux
- Création d’un bateau depuis sa page dédiée  
- Gestion complète d’un bateau  
- Recherche avec filtres : nom, type, constructeur, modèle, entreprise associée, contact associé  
- Suppression avec confirmation
- Affichage de la position du bateau sur une carte Leaflet basée sur la place du bateau

#### 🔧 Interventions
- Création d’une intervention depuis la page du bateau  
- Affichage détaillé d’une intervention depuis sa page dédiée
