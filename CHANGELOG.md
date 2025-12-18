# 📝 Notes de mise à jour

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
