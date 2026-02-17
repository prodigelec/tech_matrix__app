# 🔐 Système d'Authentification Matrix Tech Web

## 📍 URLs de Connexion

Le système dispose de **deux pages de login distinctes** pour une meilleure séparation des rôles :

### 👨‍🔧 **Techniciens** : `/login`
- **URL** : `http://localhost:3000/login`
- **Titre** : "Espace Technicien Matrix"
- **Description** : Gestion des interventions techniques
- **Badge** : 🔧 Authentification Technicien (vert)
- **Redirection après login** : `/dashboard`

**Compte de test :**
- Email : `tech@matrix-tech.fr`
- Mot de passe : `Tech@Matrix2024!`

---

### 👨‍💼 **Administrateurs** : `/admin/login`
- **URL** : `http://localhost:3000/admin/login`
- **Titre** : "Administration Matrix Tech"
- **Description** : Accès réservé aux administrateurs système
- **Badge** : 🛡️ Authentification Administrateur (rouge)
- **Redirection après login** : `/admin`

**Compte de test :**
- Email : `admin@matrix-tech.fr`
- Mot de passe : `Admin@Matrix2024!`

---

## 🔒 Sécurité Renforcée

### Différences de Sécurité par Rôle

| Fonctionnalité | Techniciens (`/login`) | Administrateurs (`/admin/login`) |
|----------------|------------------------|----------------------------------|
| **Rate Limiting** | 5 tentatives / 15 min | **3 tentatives / 15 min** ⚡ |
| **Logs d'Audit** | `TECH_LOGIN_*` | `ADMIN_LOGIN_*` |
| **Validation Rôle** | Accepte tous les rôles | **Vérifie ADMIN uniquement** 🔐 |
| **Messages d'erreur** | Génériques | Plus stricts |

### Logs d'Audit Spécifiques

**Techniciens :**
- `TECH_LOGIN_SUCCESS` : Connexion réussie
- `TECH_LOGIN_FAILED` : Échec de connexion
- `TECH_LOGIN_BLOCKED` : Blocage rate limit

**Administrateurs :**
- `ADMIN_LOGIN_SUCCESS` : Connexion admin réussie
- `ADMIN_LOGIN_FAILED` : Échec de connexion admin
- `ADMIN_LOGIN_BLOCKED` : Blocage rate limit admin

---

## 🛡️ Protection des Routes (Middleware)

### Routes Protégées

```
/login              → Accessible sans authentification (techniciens)
/admin/login        → Accessible sans authentification (admins)
/dashboard/*        → Requiert authentification (tous rôles)
/admin/*            → Requiert authentification + rôle ADMIN
```

### Redirections Automatiques

| Situation | Action |
|-----------|--------|
| Admin accède à `/login` | → Redirigé vers `/admin` |
| Technicien accède à `/admin/login` | → Redirigé vers `/dashboard` |
| Utilisateur non connecté accède à `/admin` | → Redirigé vers `/admin/login` |
| Utilisateur non connecté accède à `/dashboard` | → Redirigé vers `/login` |
| Admin déjà connecté accède à `/admin/login` | → Redirigé vers `/admin` |

---

## 🎨 Différences Visuelles

### Page Technicien (`/login`)
- **Couleur d'accent** : Vert (`bg-green-500`)
- **Icône** : 🔧 Wrench
- **Badge** : "Accès Terrain"
- **Bouton** : "Accéder à mon espace"

### Page Admin (`/admin/login`)
- **Couleur d'accent** : Rouge Matrix (`text-matrix-red`)
- **Icône** : 🛡️ Shield
- **Badge** : "Espace Sécurisé"
- **Bouton** : "Accéder à l'administration"
- **Avertissement** : "Toutes les connexions sont enregistrées et surveillées"

---

## 🚀 Utilisation

### Pour les Techniciens
1. Aller sur `http://localhost:3000/login`
2. Se connecter avec les identifiants technicien
3. Accès automatique au dashboard

### Pour les Administrateurs
1. Aller sur `http://localhost:3000/admin/login`
2. Se connecter avec les identifiants admin
3. Accès automatique à l'interface d'administration

### Page d'Accueil (`/`)
La page d'accueil redirige automatiquement :
- Utilisateurs connectés → Leur espace respectif (`/admin` ou `/dashboard`)
- Utilisateurs non connectés → `/login`

---

## 📝 Notes Importantes

1. **URL Admin Non Documentée** : L'URL `/admin/login` n'est pas affichée publiquement pour plus de sécurité
2. **Validation Stricte** : La page `/admin/login` vérifie que l'utilisateur a bien le rôle `ADMIN`
3. **Logs Séparés** : Les tentatives de connexion admin et technicien sont tracées séparément
4. **Rate Limiting Différencié** : Les admins ont un rate limiting plus strict (3 vs 5 tentatives)

---

## 🔧 Développement

Pour tester les deux pages :

```bash
# Démarrer le serveur
npm run dev

# Techniciens
http://localhost:3000/login

# Administrateurs
http://localhost:3000/admin/login
```
