import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import postsReducer from '../features/blog/postsSlice';
import commentsReducer from '../features/blog/commentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
});
