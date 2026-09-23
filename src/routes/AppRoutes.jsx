import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../features/auth/LoginPage';
import ProfilePage from '../features/auth/ProfilePage';
import UsersPage from '../features/users/UsersPage';
import PostsPage from '../features/blog/PostsPage';
import PostDetailPage from '../features/blog/PostDetailPage';

import NotFoundPage from '../pages/NotFoundPage';
import Placeholder from '../pages/Placeholder';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="Catalogue de recettes" owner="Dev 3" />} />
      <Route path="/recipes/:id" element={<Placeholder title="Fiche recette" owner="Dev 3" />} />
      <Route
        path="/favoris"
        element={
          <ProtectedRoute>
            <Placeholder title="Mes favoris" owner="Dev 3" />
          </ProtectedRoute>
        }
      />

      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route
        path="/profil"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
