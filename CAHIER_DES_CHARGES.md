# Cahier des Charges Fonctionnel - Application Techniciens Matrix Fitness

## 1. Contexte et Objectifs
**Projet :** Matrix Tech Web
**Objectif Principal :** Simplifier et digitaliser le quotidien des techniciens de maintenance Matrix Fitness lors de leurs interventions sur site (salles de sport, hôtels, particuliers).
**Utilisateurs Cibles :** Techniciens itinérants, Responsables SAV (Back-office).

## 2. Fonctionnalités Clés (MVP - Minimum Viable Product)

### 2.1 Authentification et Sécurité (Implémenté)
*   **Accès Restreint :**
    *   **Login Uniquement :** Aucune inscription publique possible (ni technicien, ni admin).
    *   **Création Admin Initial :** Le premier compte administrateur est créé directement en base de données (Seed) avec un mot de passe temporaire à changer immédiatement.
    *   **Gestion des Comptes :** Seuls les administrateurs connectés peuvent créer d'autres comptes (Techniciens ou nouveaux Admins) via le Back-Office.
    *   **Sécurité Renforcée :** Mots de passe hachés (Bcrypt), JWT (HS256) stockés en cookies HttpOnly (inaccessibles au JS client), Protection CSRF.
    *   **Protection Brute-Force :** Rate Limiting sur les tentatives de connexion (AuditLog).
    *   **Validation Strictes :** Utilisation de Joi pour valider toutes les entrées (Email, Password fort, etc.).
    *   **Middleware de Protection :** Sécurisation automatique des routes `/admin` et `/dashboard`.

### 2.2 Profil Technicien & Gestion des Ressources
*   **Identité & Contact :**
    *   **Infos Personnelles :** Nom, Prénom, Photo de profil, Rôle (Admin/Technicien).
    *   **Coordonnées Pro :** Numéro de téléphone, Email professionnel.
*   **Compétences & Habilitations :**
    *   **Certifications :** Habilitations électriques, certifications modèles spécifiques.
    *   **Niveau d'expertise :** Junior, Senior, Expert.

### 2.3 Tableau de Bord (Dashboard)
*   **Vue d'ensemble :** Planning du jour ("Ma journée").
*   **Notifications :** Nouvelles interventions, urgences.
*   **Statistiques rapides :** Interventions réalisées vs prévues.

### 2.4 Gestion des Interventions
*   **Liste des interventions :**
    *   Filtrage par date, statut (A faire, En cours, Terminé), urgence.
    *   Vue carte (géolocalisation des clients).
*   **Détail d'une intervention :**
    *   Infos client (Adresse, Contact, Horaires).
    *   Infos équipement (Modèle, Numéro de série, Historique pannes).
    *   Description du problème signalé.
*   **Workflow d'intervention :**
    *   Bouton "Départ" (trajet) / "Arrivée" (début intervention).
    *   Check-list de diagnostic.
    *   Ajout de pièces détachées utilisées.
    *   Prise de photos (avant/après).
    *   Clôture : Résolu / À suivre (pièce à commander).

### 2.5 Rapport d'Intervention Digital
*   **Génération automatique :** Résumé des actions, temps passé, pièces.
*   **Signature Client :** Signature électronique sur écran.
*   **Envoi :** Email automatique au client et au siège.

### 2.6 Base de Connaissance & Équipements
*   **Recherche Équipement :** Scan de code-barres/QR Code ou recherche par Numéro de Série (S/N).
*   **Accès Documentation :** Manuels techniques, vues éclatées, guides de dépannage (PDFs).
*   **Historique Machine :** Voir les précédentes interventions.

### 2.7 Interface Responsable SAV (Back-Office / Admin)
*   **Gestion des Interventions :**
    *   **Création de Mission :** Formulaire complet (Client, Machine, Panne, Urgence).
    *   **Dispatch :** Assignation manuelle ou semi-automatique.
    *   **Suivi en Temps Réel :** Vue globale des techniciens et interventions.
*   **Gestion des Ressources (Admin) :**
    *   **Gestion des Utilisateurs :** Création, modification et suppression des comptes Techniciens.
    *   **Base Clients & Machines :** CRUD complet.
    *   **Rapports & KPI :** Analyse des temps d'intervention, taux de résolution.

## 3. Architecture Technique (Mise à jour)
*   **Frontend & Backend :** Next.js 15+ (App Router, Server Actions).
*   **Base de Données :** MongoDB (via Prisma ORM).
*   **Authentification :** JWT Custom (jose), Cookies HttpOnly, Bcrypt.
*   **Validation :** Joi (Schémas centralisés).
*   **Styling :** TailwindCSS avec variables CSS globales (Thème Matrix Dark).
*   **Sécurité :** Middleware Edge pour protection des routes, AuditLogs en base de données.

## 4. Design System & UI
*   **Thème "Matrix Dark" :**
    *   **Fond :** Noir (#000000) et Gris Sombre (#111827).
    *   **Accents :** Rouge Matrix (#DC2626).
    *   **Typographie :** Inter (Google Fonts), Blanc sur fond sombre.
    *   **Composants :** Cartes sombres avec bordures subtiles, Inputs contrastés.
