# 🚤 CaptainConnect

App développé avec **AdonisJS**, **PostgreSQL** et **MinIO** pour la gestion des chantiers nautiques, des employés et du suivi des travaux.

---

## Versions

- Node `v24.11.0`

## ⚙️ Stack technique

- [AdonisJS 6](https://adonisjs.com/) - Framework Node.js (API REST)
- [Lucid ORM](https://docs.adonisjs.com/guides/database/introduction) - ORM pour PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) - Base de données relationnelle
- [MinIO](https://min.io/) - Stockage d’images (self-hosted S3)

---

## 📦 Installation

### 1. Installer les dépendances
```bash
pnpm install
```
### 2. Copier le `.env`
```bash
cp .env.example .env
```
### 3. Lancer les services
```bash
podman compose up -d
```
### 4. Lancer le projet
```bash
pnpm dev
```
### 5. Générer les clés VAPID
```bash
pnpx web-push generate-vapid-keys
```
### 6. Générer l'app key
```bash
node ace generate:key
```
## 🚀 Fonctionnalités principales
Gestion des chantiers (bateaux, deadlines, contacts, travaux demandés)

Enregistrement des heures et travaux réalisés

Upload et gestion des photos via MinIO