# Matrix Tech Web 🔧

> **Application de Gestion des Interventions Techniques**  
> Matrix Fitness France - Version 1.0

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Description

Matrix Tech Web est une **application web professionnelle** conçue pour digitaliser et optimiser la gestion des interventions techniques de maintenance pour Matrix Fitness France.

### 🎯 Objectifs

- ⚡ Réduire de 40% le temps administratif des techniciens
- 📊 Assurer une traçabilité complète des interventions
- 🔒 Garantir la sécurité des données sensibles
- 📱 Offrir un accès terrain via mobile/tablette
- 📈 Fournir des analytics en temps réel

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **npm** ou **yarn**
- **MongoDB** (Cloud Atlas ou local)
- **Git**

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/votre-org/matrix-tech-web.git
cd matrix-tech-web

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Générer le client Prisma
npx prisma generate

# 5. Initialiser la base de données (seed)
npx prisma db push
npm run seed

# 6. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🔐 Authentification

L'application dispose de **deux points d'entrée** distincts :

### 👨‍🔧 Espace Technicien
- **URL** : [http://localhost:3000/login](http://localhost:3000/login)
- **Compte de test** :
  - Email : `tech@matrix-tech.fr`
  - Mot de passe : `Tech@Matrix2024!`

### 👨‍💼 Espace Administrateur
- **URL** : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Compte de test** :
  - Email : `admin@matrix-tech.fr`
  - Mot de passe : `Admin@Matrix2024!`

> ⚠️ **Important** : Changez ces mots de passe en production !

📚 **Documentation complète** : [AUTHENTICATION.md](./AUTHENTICATION.md)

---

## 🏗️ Architecture

### Stack Technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **Langage** | TypeScript | 5+ |
| **Base de données** | MongoDB | Cloud Atlas |
| **ORM** | Prisma | 5.22.0 |
| **Authentification** | JWT (jose) + bcryptjs | - |
| **UI Framework** | TailwindCSS | 4 |
| **Composants** | Radix UI, Material-UI | - |
| **Validation** | Joi | 18.0.2 |

### Structure du Projet

```
matrix-tech-web/
├── prisma/
│   ├── schema.prisma          # Modèle de données
│   └── seed.ts                # Données initiales
├── src/
│   ├── app/
│   │   ├── (private)/         # Routes protégées
│   │   │   ├── admin/         # Interface admin
│   │   │   └── dashboard/     # Interface technicien
│   │   ├── actions/           # Server Actions
│   │   │   ├── auth.ts        # Auth techniciens
│   │   │   └── admin-auth.ts  # Auth admins
│   │   ├── admin/
│   │   │   └── login/         # Login admin
│   │   ├── login/             # Login technicien
│   │   ├── globals.css        # Styles globaux
│   │   └── layout.tsx         # Layout racine
│   ├── components/            # Composants réutilisables
│   ├── lib/
│   │   ├── auth.ts            # Utilitaires auth
│   │   ├── auth-core.ts       # JWT core
│   │   └── db.ts              # Client Prisma
│   ├── validations/           # Schémas Joi
│   └── middleware.ts          # Protection routes
├── public/                    # Assets statiques
├── CAHIER_DES_CHARGES.md      # Spécifications complètes
├── AUTHENTICATION.md          # Doc authentification
└── README.md                  # Ce fichier
```

---

## 📚 Documentation

- 📖 [**Cahier des Charges**](./CAHIER_DES_CHARGES.md) - Spécifications techniques complètes
- 🔐 [**Authentification**](./AUTHENTICATION.md) - Système de login dual
- 🎨 **Design System** - Thème Matrix Dark (voir `globals.css`)
- 🗄️ **Modèle de Données** - Schéma Prisma (voir `prisma/schema.prisma`)

---

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev          # Démarrer le serveur de développement

# Production
npm run build        # Compiler pour la production
npm run start        # Démarrer le serveur de production

# Base de données
npx prisma generate  # Générer le client Prisma
npx prisma db push   # Synchroniser le schéma avec la DB
npx prisma studio    # Interface graphique Prisma
npm run seed         # Peupler la DB avec des données de test

# Code Quality
npm run lint         # Linter ESLint
npx prettier --write . # Formater le code
```

---

## 🔒 Sécurité

### Fonctionnalités de Sécurité

- ✅ **JWT HttpOnly** : Cookies inaccessibles au JavaScript client
- ✅ **Bcrypt** : Hachage des mots de passe (10 rounds)
- ✅ **Rate Limiting** : Protection contre le brute-force
  - Techniciens : 5 tentatives / 15 min
  - Admins : 3 tentatives / 15 min
- ✅ **CSRF Protection** : SameSite=Lax
- ✅ **Audit Logs** : Traçabilité complète des actions
- ✅ **Validation stricte** : Joi pour toutes les entrées
- ✅ **Middleware Edge** : Protection des routes sensibles

### Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
# Base de données
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/matrix-tech"

# JWT Secret (générer une clé forte en production)
JWT_SECRET="votre_secret_jwt_ultra_securise_changez_moi"

# Environnement
NODE_ENV="development"
```

> ⚠️ **Ne jamais commiter le fichier `.env` !**

---

## 🗺️ Roadmap

### ✅ Phase 1 - MVP (En cours)
- [x] Authentification dual (admin/technicien)
- [x] Modèle de données complet
- [x] Middleware de sécurité
- [x] Design system Matrix Dark
- [ ] Dashboard technicien
- [ ] Dashboard admin

### 📅 Phase 2 - Core Features (Q1 2026)
- [ ] Gestion complète des interventions
- [ ] Rapports digitaux avec signature
- [ ] Upload photos (Cloudinary/S3)
- [ ] Emails automatiques
- [ ] Géolocalisation (Google Maps)

### 🚀 Phase 3 - Optimisations (Q2 2026)
- [ ] Dispatch automatique intelligent
- [ ] Analytics avancés
- [ ] PWA (mode hors-ligne)
- [ ] Notifications push

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. **Fork** le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

### Standards de Code

- **Linter** : ESLint + Prettier
- **Commits** : Messages clairs et descriptifs
- **Types** : TypeScript strict mode
- **Tests** : À venir (Jest + React Testing Library)

---

## 📞 Support

- **Email** : support@matrix-tech.fr
- **Documentation** : [CAHIER_DES_CHARGES.md](./CAHIER_DES_CHARGES.md)
- **Issues** : [GitHub Issues](https://github.com/votre-org/matrix-tech-web/issues)

---

## 📄 Licence

© 2026 Matrix Fitness France. Tous droits réservés.

Ce projet est propriétaire et confidentiel.

---

## 🙏 Remerciements

- **Next.js Team** pour le framework exceptionnel
- **Prisma Team** pour l'ORM type-safe
- **Vercel** pour l'hébergement et les outils de développement

---

**Développé avec ❤️ pour Matrix Fitness France**
