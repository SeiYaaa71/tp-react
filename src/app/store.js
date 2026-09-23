import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import postsReducer from '../features/blog/postsSlice';
import commentsReducer from '../features/blog/commentsSlice';
import recipesReducer from '../features/recipes/recipesSlice';
import quotesReducer from '../features/quotes/quotesSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
    recipes: recipesReducer,
    quotes: quotesReducer,
    favorites: favoritesReducer,
  },
});
