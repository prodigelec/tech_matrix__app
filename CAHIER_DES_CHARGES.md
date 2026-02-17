# Cahier des Charges Technique - Matrix Tech Web

> **Application de Gestion des Interventions Techniques**  
> Matrix Fitness France - Version 1.0  
> Dernière mise à jour : 17 février 2026

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Architecture Système](#2-architecture-système)
3. [Authentification & Sécurité](#3-authentification--sécurité)
4. [Modules Fonctionnels](#4-modules-fonctionnels)
5. [Modèle de Données](#5-modèle-de-données)
6. [Design System](#6-design-system)
7. [Roadmap & Évolutions](#7-roadmap--évolutions)

---

## 1. Vue d'Ensemble

### 1.1 Contexte du Projet

**Nom du Projet :** Matrix Tech Web  
**Client :** Matrix Fitness France  
**Secteur :** Maintenance d'équipements de fitness professionnels

### 1.2 Objectifs Stratégiques

L'application Matrix Tech Web vise à **digitaliser et optimiser** le processus complet de gestion des interventions techniques, de la création d'une mission jusqu'à la signature du rapport client.

**Bénéfices attendus :**
- ⚡ Réduction de 40% du temps administratif des techniciens
- 📊 Traçabilité complète de toutes les interventions
- 🔒 Sécurité renforcée des données sensibles
- 📱 Accessibilité terrain via mobile/tablette
- 📈 Analyse des performances et KPIs en temps réel

### 1.3 Utilisateurs Cibles

| Rôle | Profil | Besoins Principaux |
|------|--------|-------------------|
| **Technicien Itinérant** | Professionnel terrain, mobile | Accès rapide aux interventions, documentation technique, rapport digital |
| **Administrateur SAV** | Responsable back-office, sédentaire | Dispatch des missions, suivi temps réel, gestion des ressources, analytics |
| **Support Technique** | Assistance niveau 2 | Consultation historique, support techniciens |

---

## 2. Architecture Système

### 2.1 Stack Technologique

#### **Frontend & Backend**
- **Framework :** Next.js 16.1.6 (App Router, React Server Components)
- **Langage :** TypeScript 5+
- **Runtime :** Node.js (Edge Runtime pour middleware)

#### **Base de Données**
- **SGBD :** MongoDB (Cloud Atlas)
- **ORM :** Prisma 5.22.0
- **Schéma :** 6 modèles principaux (User, Client, Machine, Intervention, Report, AuditLog)

#### **Authentification & Sécurité**
- **JWT :** jose (HS256, 24h expiration)
- **Hashing :** bcryptjs (10 rounds)
- **Cookies :** HttpOnly, Secure (production), SameSite=Lax
- **Validation :** Joi 18.0.2 (schémas centralisés)

#### **UI & Styling**
- **CSS Framework :** TailwindCSS 4
- **Composants :** Radix UI, Material-UI 6.4.4
- **Icônes :** Lucide React, React Icons
- **Animations :** Framer Motion (prévu)

#### **Outils de Développement**
- **Linter :** ESLint 9 + Prettier 3.8.1
- **Formatage :** Prettier + prettier-plugin-tailwindcss
- **Git Hooks :** Husky (prévu)

### 2.2 Architecture Applicative

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   /login     │  │ /admin/login │  │  /dashboard  │  │
│  │ (Technicien) │  │    (Admin)   │  │  /admin      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              MIDDLEWARE (Edge Runtime)                   │
│  • Vérification JWT                                      │
│  • Protection routes (/admin/*, /dashboard/*)           │
│  • Redirections selon rôle                              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS SERVER (App Router)                 │
│  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ Server Actions  │  │   API Routes (futur)        │  │
│  │ • auth.ts       │  │   • /api/interventions      │  │
│  │ • admin-auth.ts │  │   • /api/reports            │  │
│  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  PRISMA ORM LAYER                        │
│  • Modèles TypeScript                                    │
│  • Requêtes type-safe                                    │
│  • Migrations automatiques                               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              MONGODB (Cloud Atlas)                       │
│  Collections: users, clients, machines,                  │
│              interventions, reports, auditlogs          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Authentification & Sécurité

### 3.1 Système d'Authentification Dual

L'application dispose de **deux points d'entrée distincts** pour renforcer la sécurité :

#### **🔧 Espace Technicien** (`/login`)
- **URL :** `/login`
- **Titre :** "Espace Technicien Matrix"
- **Rôles acceptés :** `TECHNICIAN`, `SUPPORT`
- **Redirection :** `/dashboard`
- **Rate Limiting :** 5 tentatives / 15 minutes
- **Logs :** `TECH_LOGIN_SUCCESS`, `TECH_LOGIN_FAILED`, `TECH_LOGIN_BLOCKED`

#### **🛡️ Espace Administrateur** (`/admin/login`)
- **URL :** `/admin/login`
- **Titre :** "Administration Matrix Tech"
- **Rôles acceptés :** `ADMIN` uniquement
- **Redirection :** `/admin`
- **Rate Limiting :** **3 tentatives / 15 minutes** (plus strict)
- **Logs :** `ADMIN_LOGIN_SUCCESS`, `ADMIN_LOGIN_FAILED`, `ADMIN_LOGIN_BLOCKED`
- **Validation supplémentaire :** Vérification explicite du rôle `ADMIN`

### 3.2 Politique de Sécurité

#### **Gestion des Comptes**
- ❌ **Aucune inscription publique** : Pas de formulaire d'inscription accessible
- 🔐 **Création Admin Initial :** Via seed Prisma (`npm run seed`)
  - Email : `admin@matrix-tech.fr`
  - Password : `Admin@Matrix2024!` (à changer immédiatement)
- 👥 **Création de comptes :** Uniquement par les administrateurs via le back-office

#### **Protection des Données**
- **Mots de passe :** Hachés avec bcrypt (10 rounds, salt automatique)
- **Sessions :** JWT signé (HS256), stocké en cookie HttpOnly
- **Durée de session :** 24 heures (renouvellement automatique sur activité)
- **CSRF Protection :** SameSite=Lax sur les cookies
- **XSS Protection :** Cookies HttpOnly (inaccessibles au JavaScript client)

#### **Audit & Traçabilité**
Toutes les actions sensibles sont enregistrées dans `AuditLog` :
- Connexions réussies/échouées (admin et technicien séparés)
- Blocages rate limiting
- Modifications de comptes utilisateurs
- Création/suppression de ressources critiques

**Données tracées :**
- `userId` : ID de l'utilisateur concerné
- `action` : Type d'action (ex: `ADMIN_LOGIN_SUCCESS`)
- `details` : Détails contextuels
- `ipAddress` : IP de la requête
- `userAgent` : Navigateur/OS utilisé
- `createdAt` : Timestamp précis

### 3.3 Protection des Routes (Middleware)

```typescript
// Règles de protection
/login              → Public (techniciens)
/admin/login        → Public (admins)
/dashboard/*        → Authentification requise (tous rôles)
/admin/*            → Authentification + rôle ADMIN requis
```

**Redirections automatiques :**
- Admin connecté accède à `/login` → Redirigé vers `/admin`
- Technicien connecté accède à `/admin/login` → Redirigé vers `/dashboard`
- Non authentifié accède à `/admin` → Redirigé vers `/admin/login`
- Non authentifié accède à `/dashboard` → Redirigé vers `/login`

---

## 4. Modules Fonctionnels

### 4.1 Module Technicien (Dashboard)

#### **4.1.1 Tableau de Bord**
- **Vue "Ma Journée" :**
  - Liste des interventions du jour
  - Carte interactive avec géolocalisation des sites
  - Statut en temps réel (À faire, En cours, Terminé)
  - Temps de trajet estimé (intégration Google Maps API - prévu)

- **Notifications Push :**
  - Nouvelles interventions assignées
  - Interventions urgentes (priorité CRITICAL/HIGH)
  - Messages du back-office

- **Statistiques Personnelles :**
  - Interventions réalisées (jour/semaine/mois)
  - Taux de résolution au premier passage
  - Temps moyen d'intervention
  - Pièces détachées utilisées

#### **4.1.2 Gestion des Interventions**

**Liste des Interventions :**
- Filtres avancés :
  - Par date (aujourd'hui, cette semaine, ce mois)
  - Par statut (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELED)
  - Par priorité (LOW, MEDIUM, HIGH, CRITICAL)
  - Par type d'équipement
- Tri : Date, priorité, distance
- Vue liste ou vue carte

**Détail d'une Intervention :**
```
┌─────────────────────────────────────┐
│ Intervention #INT-2024-001          │
├─────────────────────────────────────┤
│ 📍 CLIENT                            │
│   • Nom : Fitness Park Paris 12     │
│   • Adresse : 123 Av. Daumesnil     │
│   • Contact : Marc Directeur        │
│   • Tél : +33 1 23 45 67 89         │
│                                      │
│ 🔧 ÉQUIPEMENT                        │
│   • Modèle : Treadmill T7xi         │
│   • S/N : TMX-2024-001              │
│   • Installé le : 15/01/2023        │
│   • Garantie : Expirée              │
│                                      │
│ 📋 PROBLÈME SIGNALÉ                  │
│   "Tapis ne démarre plus.           │
│    Erreur E12 affichée."            │
│                                      │
│ 📚 HISTORIQUE (3 interventions)     │
│   • 12/2023 : Remplacement moteur   │
│   • 06/2023 : Calibrage vitesse     │
│   • 01/2023 : Installation          │
└─────────────────────────────────────┘
```

**Workflow d'Intervention :**
1. **Départ** : Bouton "Je pars" (enregistre heure de départ)
2. **Arrivée** : Bouton "Je suis arrivé" (début chrono intervention)
3. **Diagnostic** :
   - Check-list prédéfinie selon type d'équipement
   - Ajout de notes libres
   - Prise de photos (avant réparation)
4. **Réparation** :
   - Sélection des pièces détachées utilisées (autocomplete)
   - Quantités
   - Temps passé (auto-calculé)
5. **Finalisation** :
   - Photos après réparation
   - Statut final : ✅ Résolu / ⏳ À suivre (pièce à commander)
6. **Signature Client** : Signature électronique sur écran tactile
7. **Envoi Rapport** : Email automatique (client + siège)

#### **4.1.3 Base de Connaissance**

**Recherche d'Équipement :**
- Scan code-barres/QR Code (caméra mobile)
- Recherche par numéro de série
- Recherche par modèle

**Documentation Technique :**
- Manuels d'utilisation (PDF)
- Vues éclatées (images haute résolution)
- Guides de dépannage pas-à-pas
- Vidéos tutoriels (YouTube embed - prévu)

**Historique Machine :**
- Liste de toutes les interventions passées
- Pièces remplacées
- Techniciens intervenus
- Temps de réparation

#### **4.1.4 Profil Technicien**

**Informations Personnelles :**
- Photo de profil
- Nom, Prénom
- Email professionnel
- Téléphone
- Adresse

**Compétences & Certifications :**
- Habilitations électriques (B1, B2, BR, etc.)
- Certifications modèles spécifiques
- Niveau d'expertise : Junior / Senior / Expert
- Formations suivies

**Véhicule & Équipement :**
- Immatriculation véhicule
- Stock de pièces détachées embarquées (prévu)

### 4.2 Module Administrateur (Back-Office)

#### **4.2.1 Dashboard Admin**

**Vue d'Ensemble :**
- Nombre total d'interventions (aujourd'hui, cette semaine, ce mois)
- Interventions en cours (carte en temps réel)
- Techniciens actifs / disponibles
- Alertes urgentes

**KPIs & Analytics :**
- Taux de résolution au premier passage
- Temps moyen d'intervention par type d'équipement
- Satisfaction client (prévu)
- Pièces détachées les plus utilisées
- Performance par technicien

#### **4.2.2 Gestion des Interventions**

**Création de Mission :**
```
Formulaire complet :
├─ Client (sélection ou création)
├─ Machine (sélection ou création)
├─ Description du problème
├─ Priorité (LOW, MEDIUM, HIGH, CRITICAL)
├─ Date/heure souhaitée
└─ Assignation technicien (manuelle ou auto)
```

**Dispatch Intelligent (prévu) :**
- Assignation automatique selon :
  - Proximité géographique
  - Compétences requises
  - Disponibilité
  - Charge de travail

**Suivi en Temps Réel :**
- Carte interactive avec position des techniciens (GPS - prévu)
- Statut de chaque intervention
- Temps écoulé
- Alertes si dépassement temps estimé

#### **4.2.3 Gestion des Utilisateurs**

**CRUD Complet :**
- Création de comptes (Technicien, Admin, Support)
- Modification des informations
- Désactivation/Réactivation de comptes
- Suppression (soft delete)

**Validation Stricte :**
- Email unique
- Username unique
- Mot de passe fort (min 8 caractères, majuscule, minuscule, chiffre, caractère spécial)

#### **4.2.4 Gestion Clients & Machines**

**Base Clients :**
- CRUD complet
- Types : Gym, Hôtel, Particulier, Entreprise
- Coordonnées complètes
- Historique interventions

**Base Machines :**
- CRUD complet
- Numéro de série unique
- Modèle, type
- Date d'installation
- Fin de garantie
- Association client

#### **4.2.5 Rapports & Exports**

**Rapports Disponibles :**
- Rapport mensuel d'activité
- Rapport par technicien
- Rapport par client
- Rapport pièces détachées

**Formats d'Export :**
- PDF (impression)
- Excel (analyse)
- CSV (import tiers)

---

## 5. Modèle de Données

### 5.1 Schéma Prisma

```prisma
// Énumérations
enum Role { ADMIN, TECHNICIAN, SUPPORT }
enum InterventionStatus { PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELED }
enum Priority { LOW, MEDIUM, HIGH, CRITICAL }

// Modèles
model User {
  id           String   @id @default(uuid()) @map("_id")
  email        String   @unique
  username     String   @unique
  passwordHash String
  firstName    String
  lastName     String
  role         Role     @default(TECHNICIAN)
  phone        String?
  avatarUrl    String?
  isActive     Boolean  @default(true)
  
  // Technicien spécifique
  address      String?
  skills       String[]
  vehicleId    String?
  
  interventions Intervention[] @relation("TechnicianInterventions")
  reports       Report[]
  auditLogs     AuditLog[]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Client {
  id           String   @id @default(uuid()) @map("_id")
  name         String
  type         String   // Gym, Hotel, Particulier
  address      String
  city         String
  zipCode      String
  contactName  String?
  contactPhone String?
  contactEmail String?
  
  machines      Machine[]
  interventions Intervention[]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Machine {
  id           String    @id @default(uuid()) @map("_id")
  serialNumber String    @unique
  model        String
  type         String
  installDate  DateTime?
  warrantyEnd  DateTime?
  
  clientId     String
  client       Client    @relation(fields: [clientId], references: [id])
  
  interventions Intervention[]
  
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Intervention {
  id          String             @id @default(uuid()) @map("_id")
  ticketId    String             @unique // INT-2024-001
  status      InterventionStatus @default(PENDING)
  priority    Priority           @default(MEDIUM)
  description String
  scheduledAt DateTime?
  startedAt   DateTime?
  endedAt     DateTime?
  
  clientId    String
  client      Client   @relation(fields: [clientId], references: [id])
  
  machineId   String?
  machine     Machine? @relation(fields: [machineId], references: [id])
  
  technicianId String?
  technician   User?   @relation("TechnicianInterventions", fields: [technicianId], references: [id])
  
  report Report?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Report {
  id          String   @id @default(uuid()) @map("_id")
  content     String
  partsUsed   String[]
  photos      String[]
  clientSignature String?
  technicianSignature String?
  
  interventionId String       @unique
  intervention   Intervention @relation(fields: [interventionId], references: [id])
  
  technicianId String
  technician   User   @relation(fields: [technicianId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AuditLog {
  id        String   @id @default(uuid()) @map("_id")
  action    String   // ADMIN_LOGIN_SUCCESS, TECH_LOGIN_FAILED, etc.
  details   String?
  ipAddress String?
  userAgent String?
  
  userId    String?
  user      User?   @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
}
```

### 5.2 Relations

```
User (1) ──────< (N) Intervention
User (1) ──────< (N) Report
User (1) ──────< (N) AuditLog

Client (1) ────< (N) Machine
Client (1) ────< (N) Intervention

Machine (1) ───< (N) Intervention

Intervention (1) ── (1) Report
```

---

## 6. Design System

### 6.1 Thème "Matrix Dark"

#### **Palette de Couleurs**

```css
/* Couleurs Principales */
--color-matrix-black: #000000;      /* Fond principal */
--color-matrix-dark: #111827;       /* Cartes, modales */
--color-matrix-input-bg: #1f2937;   /* Inputs */

/* Accents */
--color-matrix-red: #dc2626;        /* Boutons primaires, alertes */
--color-matrix-red-hover: #b91c1c;  /* Hover state */

/* Bordures */
--color-matrix-border: #374151;     /* Bordures générales */
--color-matrix-border-card: #1f2937;/* Bordures cartes */

/* Technicien */
--color-tech-green: #10b981;        /* Badge technicien */

/* Admin */
--color-admin-red: #dc2626;         /* Badge admin */
```

#### **Typographie**

```css
/* Police Principale */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Hiérarchie */
h1: 2.25rem (36px) - font-extrabold
h2: 1.875rem (30px) - font-bold
h3: 1.5rem (24px) - font-semibold
body: 0.875rem (14px) - font-normal
small: 0.75rem (12px) - font-normal
```

#### **Composants Réutilisables**

```css
/* Carte Matrix */
.matrix-card {
  background: var(--color-matrix-dark);
  border: 1px solid var(--color-matrix-border-card);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

/* Input Matrix */
.matrix-input {
  background: var(--color-matrix-input-bg);
  border: 1px solid var(--color-matrix-border);
  color: white;
  border-radius: 0.375rem;
  transition: all 0.2s;
}
.matrix-input:focus {
  border-color: var(--color-matrix-red);
  ring: 2px var(--color-matrix-red);
}

/* Bouton Primaire */
.matrix-btn-primary {
  background: var(--color-matrix-red);
  color: white;
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}
.matrix-btn-primary:hover {
  background: var(--color-matrix-red-hover);
}
```

### 6.2 Responsive Design

**Breakpoints :**
- Mobile : < 640px
- Tablet : 640px - 1024px
- Desktop : > 1024px

**Stratégie Mobile-First :**
- Navigation mobile : Bottom tab bar (techniciens)
- Navigation desktop : Sidebar (admins)
- Formulaires : 1 colonne mobile, 2 colonnes desktop
- Tableaux : Scroll horizontal mobile, fixe desktop

---

## 7. Roadmap & Évolutions

### 7.1 Phase 1 - MVP (En cours)
- ✅ Authentification dual (admin/technicien)
- ✅ Modèle de données complet
- ✅ Middleware de sécurité
- ✅ Design system Matrix Dark
- 🔄 Dashboard technicien (en cours)
- 🔄 Dashboard admin (en cours)

### 7.2 Phase 2 - Fonctionnalités Core (Q1 2026)
- 📅 Gestion complète des interventions
- 📝 Rapports digitaux avec signature
- 📸 Upload et stockage photos (Cloudinary/AWS S3)
- 📧 Envoi emails automatiques (Resend/SendGrid)
- 🗺️ Géolocalisation et cartes (Google Maps API)

### 7.3 Phase 3 - Optimisations (Q2 2026)
- 🤖 Dispatch automatique intelligent
- 📊 Analytics avancés et KPIs
- 📱 PWA (Progressive Web App)
- 🔔 Notifications push (Firebase Cloud Messaging)
- 🌐 Mode hors-ligne (Service Workers)

### 7.4 Phase 4 - Évolutions Avancées (Q3-Q4 2026)
- 🔐 2FA pour administrateurs (TOTP)
- 📦 Gestion stock pièces détachées
- 💳 Facturation intégrée
- 🤝 API publique pour intégrations tierces
- 🧠 IA prédictive (prévision pannes)

---

## 📞 Contacts & Support

**Chef de Projet :** [À définir]  
**Développeur Lead :** [À définir]  
**Support Technique :** support@matrix-tech.fr

---

**Document rédigé le :** 17 février 2026  
**Version :** 1.0  
**Statut :** ✅ Validé
