# Marmiterie

Plateforme communautaire de recettes construite sur l'API publique [DummyJSON](https://dummyjson.com) :
catalogue de recettes, blog avec commentaires, favoris et espace membres.

## Installation

```bash
npm install
npm run dev
```

L'application démarre sur http://localhost:5173.

Compte de test DummyJSON : `emilys` / `emilyspass`.

## Stack

| Choix | Pourquoi |
| --- | --- |
| Vite + React 18 | Environnement vu en cours, démarrage rapide. |
| Redux Toolkit | État global demandé : session, favoris, posts, commentaires. `createAsyncThunk` gère les trois états d'un appel réseau (pending / fulfilled / rejected). |
| React Router v6 | Routage, routes protégées, capture des URL invalides. |
| CSS natif (variables) | Pas de librairie de style non vue en cours ; la charte tient dans `src/index.css`. |
| `fetch` | Pas d'axios : un helper maison de 20 lignes suffit (`src/api/client.js`). |

## Organisation du dépôt

```
src/
  api/client.js          helper fetch commun (URL de base, token, erreurs)
  app/store.js           configuration du store Redux
  components/            Header, composants d'état partagés
  routes/                AppRoutes (toutes les routes), ProtectedRoute
  features/
    auth/                authSlice, LoginPage, ProfilePage
    users/               usersSlice, UsersPage
  pages/                 NotFoundPage, Placeholder
  index.css              charte graphique (variables + classes communes)
```

Convention : une fonctionnalité = un dossier dans `features/`, contenant son slice,
ses pages et son CSS. Les styles globaux restent dans `index.css`.

## Répartition des tâches

| Lot | Responsable | Contenu |
| --- | --- | --- |
| Socle | À trois | Arborescence, store, helper fetch, squelette de routes, charte graphique |
| A - Authentification & membres | *(nom)* | Login, persistance de session, logout, `ProtectedRoute`, annuaire `/users`, profil `/profil` |
| C - Blog & commentaires | *(nom)* | Liste et détail des articles, ajout/suppression d'articles et de commentaires, mises à jour optimistes |
| B, D, E, F - Recettes, favoris, citation, habillage | *(nom)* | Catalogue et fiche recette, favoris, page `/favoris`, widget citation du jour, Header, 404, responsive |

## Notes techniques

**Persistance de session.** Le token et l'utilisateur sont écrits dans le `localStorage`
au moment du `login.fulfilled`. À chaque démarrage, `authSlice` relit ces deux clés dans
son `initialState` : l'utilisateur reste donc connecté après un rafraîchissement.
`logout` vide le store **et** le `localStorage`.

**Routes protégées.** `ProtectedRoute` lit `state.auth.token`. Sans token il rend
`<Navigate to="/login" replace />` en mémorisant la page demandée dans `state.from`,
ce qui permet de renvoyer l'utilisateur au bon endroit après connexion.

**Profil.** `/auth/login` ne renvoie qu'un utilisateur allégé ; le profil complet
(adresse, entreprise) vient de `/auth/me`, appelé avec le Bearer token.

**Mises à jour optimistes (blog).** DummyJSON ne persiste pas les écritures : on envoie
quand même la requête `POST`/`DELETE`, puis on met le store à jour localement pour que
l'interface reflète le changement sans rechargement.

## Scripts

- `npm run dev` - serveur de développement
- `npm run build` - build de production
- `npm run preview` - prévisualisation du build
