# Cahier des Charges Fonctionnel - Application Techniciens Matrix Fitness

## 1. Contexte et Objectifs
**Projet :** Matrix Tech Web
**Objectif Principal :** Simplifier et digitaliser le quotidien des techniciens de maintenance Matrix Fitness lors de leurs interventions sur site (salles de sport, hôtels, particuliers).
**Utilisateurs Cibles :** Techniciens itinérants, Responsables SAV (Back-office).

## 2. Fonctionnalités Clés (MVP - Minimum Viable Product)

### 2.1 Authentification et Sécurité Maximale
*   **Accès Sécurisé (Niveau Enterprise) :**
    *   **Politique de Mot de Passe Forte :** Complexité minimale requise (Majuscules, Chiffres, Spéciaux).
    *   **Protection Force Brute :** Rate Limiting sur l'API de login et blocage temporaire après 5 échecs.
    *   **Double Authentification (2FA) :** Code unique par email ou application (TOTP) pour les accès sensibles.
*   **Gestion de Session :**
    *   **JWT Sécurisés :** Stockage en Cookies HttpOnly + Secure (inaccessibles au JavaScript côté client).
    *   **Rotation des Tokens :** Access Token (court) + Refresh Token (long).
    *   **Audit Logs :** Historique complet des connexions (IP, User-Agent, Timestamp).
*   **Protection contre les Vulnérabilités Web (OWASP Top 10) :**
    *   **Anti-XSS (Cross-Site Scripting) :** Assainissement strict de toutes les entrées utilisateurs.
    *   **Anti-CSRF (Cross-Site Request Forgery) :** Tokens CSRF sur tous les formulaires et appels API.
    *   **Anti-Injection :** Utilisation de l'ORM Prisma qui échappe nativement les requêtes SQL/NoSQL.
    *   **En-têtes de Sécurité HTTP :** Configuration stricte (HSTS, Content-Security-Policy, X-Frame-Options) via Helmet.js.
*   **Conformité RGPD (France/Europe) :**
    *   **Droit à l'oubli / Rectification :** Procédures pour les données techniciens et clients.
    *   **Minimisation des données :** Collecte uniquement des données nécessaires à l'intervention.
    *   **Consentement :** Pour la géolocalisation (activable/désactivable par le technicien hors horaires).
*   **Protection Infrastructure :**
    *   **DDoS Mitigation :** Utilisation d'un WAF (Web Application Firewall) en amont (ex: Cloudflare).
    *   **Rate Limiting Global :** Limitation du nombre de requêtes par IP/minute pour éviter la surcharge.

### 2.2 Profil Technicien & Gestion des Ressources
*   **Identité & Contact :**
    *   **Infos Personnelles :** Nom, Prénom, Photo de profil.
    *   **Coordonnées Pro :** Numéro de téléphone, Email professionnel.
    *   **Logistique :** Adresse de départ (Domicile/Agence) pour le calcul des trajets.
*   **Compétences & Habilitations :**
    *   **Certifications :** Habilitations électriques, certifications modèles spécifiques.
    *   **Niveau d'expertise :** Junior, Senior, Expert (pour le routing des pannes complexes).
*   **Véhicule & Stock :**
    *   **Véhicule Assigné :** Modèle, Immatriculation, Kilométrage.
    *   **Inventaire Embarqué :** Suivi temps réel du stock "camion" (pièces détachées, consommables).
*   **Préférences & Disponibilité :**
    *   **Zone d'intervention :** Secteur géographique prioritaire.
    *   **Planning :** Gestion des horaires, astreintes et congés.

### 2.3 Tableau de Bord (Dashboard)
*   **Vue d'ensemble :** Planning du jour ("Ma journée").
*   **Notifications :** Nouvelles interventions, urgences, rappels de pièces.
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
*   **Signature Client :** Signature électronique directement sur l'écran (tablette/mobile).
*   **Envoi :** Email automatique au client et au siège.

### 2.6 Base de Connaissance & Équipements
*   **Recherche Équipement :** Scan de code-barres/QR Code ou recherche par Numéro de Série (S/N).
*   **Accès Documentation :** Manuels techniques, vues éclatées, guides de dépannage (PDFs).
*   **Historique Machine :** Voir les précédentes interventions sur cette machine spécifique.

### 2.7 Interface Responsable SAV (Back-Office / Admin)
*   **Gestion des Interventions :**
    *   **Création de Mission :** Formulaire complet (Client, Machine, Panne, Urgence).
    *   **Dispatch Intelligent :** Assignation manuelle ou semi-automatique (basée sur la proximité technicien et compétences).
    *   **Suivi en Temps Réel :** Vue globale "Map" de tous les techniciens et état des interventions.
*   **Gestion des Ressources :**
    *   **Techniciens :** Création de comptes, gestion des plannings/congés.
    *   **Base Clients & Machines :** CRUD (Create, Read, Update, Delete) complet.
    *   **Rapports & KPI :** Analyse des temps d'intervention, taux de résolution.

## 3. Fonctionnalités Avancées (V2)
*   **Mode Hors Ligne (Offline) :** Consultation et saisie possibles sans réseau (synchro dès retour connexion).
*   **Gestion de Stock Véhicule :** Décrémentation automatique des pièces, alertes seuil bas.
*   **Commande de Pièces :** Demande de pièces directement depuis l'app pour une intervention future.
*   **Messagerie :** Chat direct avec le support technique siège.

## 4. Exigences Techniques & UX
*   **Design System & UI :**
    *   **Framework CSS :** TailwindCSS.
    *   **Identité Visuelle :** Couleurs officielles Matrix Fitness (Noir Mat, Gris Argent "Iced Silver", Blanc, accents Rouge).
    *   **Typographie :** Polices modernes, lisibles et professionnelles (ex: Roboto, Inter ou Montserrat).
    *   **Responsive :** "Mobile First" absolu pour usage sur smartphone/tablette terrain.
*   **Stack Technique :**
    *   **Frontend :** Next.js (React 19).
    *   **Backend :** Node.js avec Express.
    *   **Base de Données :** MongoDB.
    *   **ORM :** Prisma (pour la communication type-safe avec la BDD).

## 5. Structure de l'Application (Sitemap)
*   `/login` : Page de connexion.
*   `/dashboard` : Accueil technicien.
*   `/interventions` : Liste des missions.
    *   `/interventions/[id]` : Détail et actions.
*   `/equipements` : Recherche et documentation.
*   `/profil` : Réglages et infos personnelles.

### 5.2 Espace Administrateur (SAV)
*   `/admin/dashboard` : Vue globale et KPI.
*   `/admin/planning` : Calendrier et Dispatch.
*   `/admin/techniciens` : Gestion des équipes.
*   `/admin/clients` : Base de données clients/machines.
