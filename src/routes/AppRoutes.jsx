import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../features/auth/LoginPage';
import ProfilePage from '../features/auth/ProfilePage';
import UsersPage from '../features/users/UsersPage';
import UserDetailPage from '../features/users/UserDetailPage';
import PostsPage from '../features/blog/PostsPage';
import PostDetailPage from '../features/blog/PostDetailPage';

import NotFoundPage from '../pages/NotFoundPage';
import RecipesPage from '../features/recipes/RecipesPage';
import RecipeDetailPage from '../features/recipes/RecipeDetailPage';
import FavoritesPage from '../features/favorites/FavoritesPage';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RecipesPage />} />
      <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      <Route
        path="/favoris"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />

      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
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
