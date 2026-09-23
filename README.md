# TP React - Marmiterie

Projet de plateforme communautaire de recettes s'appuyant sur l'API [DummyJSON](https://dummyjson.com).

## Instructions d'installation

1. Installer les dépendances :
```bash
npm install
```
2. Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.
*Identifiants de test (fournis par DummyJSON) : `emilys` / `emilyspass`*

## Choix techniques

- **Vite + React 18** : Pour un environnement de développement rapide et moderne.
- **Redux Toolkit** : Gestion de l'état global (session utilisateur, favoris, articles). Utilisation de `createAsyncThunk` pour la gestion asynchrone des appels réseau.
- **React Router v6** : Pour le routage de l'application, incluant des routes protégées (ex: profil, favoris).
- **CSS natif** : Utilisation de variables CSS (`index.css`) pour une charte graphique cohérente sans dépendance externe.
- **Fetch API** : Un helper personnalisé (`client.js`) gère les requêtes HTTP (injection du token, gestion des erreurs).

## Répartition des tâches

- **Étudiant 1** : Authentification (Login, Persistance) & Espace Membre (Annuaire, Profil protégé).
- **Étudiant 2** : Espace Blog (Listing, Fiche détaillée) & CRUD avec mises à jour optimistes Redux.
- **Étudiant 3** : Catalogue de Recettes (Listing, Détails), Gestion des Favoris (Redux & LocalStorage), et Widget "Citation du Jour".
- **En commun** : Configuration du store, routage de base, Header et CSS global.
