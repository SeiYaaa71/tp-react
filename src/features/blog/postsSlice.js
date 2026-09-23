import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/client';

export const fetchPosts = createAsyncThunk('posts/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await apiFetch('/posts?limit=0');
    return data.posts;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchPostById = createAsyncThunk(
  'posts/fetchOne',
  async (postId, { rejectWithValue }) => {
    try {
      return await apiFetch(`/posts/${postId}`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostAuthor = createAsyncThunk(
  'posts/fetchAuthor',
  async (userId, { rejectWithValue }) => {
    try {
      return await apiFetch(`/users/${userId}?select=firstName,lastName,username,image`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (formData, { dispatch, rejectWithValue }) => {
    const tempId = `temp-${nanoid()}`;

    dispatch(
      postAddedOptimistic({
        id: tempId,
        title: formData.title,
        body: formData.body,
        tags: formData.tags,
        userId: formData.userId,
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
      })
    );

    try {
      const created = await apiFetch('/posts/add', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          tags: formData.tags,
          userId: formData.userId,
        }),
      });
      return { tempId, post: created };
    } catch (error) {
      return rejectWithValue({ tempId, message: error.message });
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (postId, { dispatch, getState, rejectWithValue }) => {
    const removed = getState().posts.items.find((post) => post.id === postId);
    dispatch(postRemovedOptimistic(postId));

    try {
      await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
      return postId;
    } catch (error) {
      return rejectWithValue({ post: removed, message: error.message });
    }
  }
);

export const reactToPost = createAsyncThunk(
  'posts/react',
  async ({ postId, reaction }, { dispatch, getState, rejectWithValue }) => {
    const state = getState().posts;
    const post = state.items.find((item) => item.id === postId) || state.currentPost;
    if (!post) {
      return rejectWithValue({ postId, message: 'Article introuvable.' });
    }

    const previousReactions = post.reactions || { likes: 0, dislikes: 0 };
    const nextReactions = {
      likes: previousReactions.likes + (reaction === 'like' ? 1 : 0),
      dislikes: previousReactions.dislikes + (reaction === 'dislike' ? 1 : 0),
    };

    dispatch(postReactionsUpdatedOptimistic({ postId, reactions: nextReactions }));

    try {
      await apiFetch(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ reactions: nextReactions }),
      });
      return { postId, reactions: nextReactions };
    } catch (error) {
      return rejectWithValue({ postId, reactions: previousReactions, message: error.message });
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  currentPost: null,
  currentStatus: 'idle',
  currentError: null,
  currentAuthor: null,
  mutationError: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAddedOptimistic(state, action) {
      state.items.unshift(action.payload);
    },
    postRemovedOptimistic(state, action) {
      state.items = state.items.filter((post) => post.id !== action.payload);
    },
    postReactionsUpdatedOptimistic(state, action) {
      const { postId, reactions } = action.payload;
      const post = state.items.find((item) => item.id === postId);
      if (post) post.reactions = reactions;
      if (state.currentPost?.id === postId) state.currentPost.reactions = reactions;
    },
    clearPostsMutationError(state) {
      state.mutationError = null;
    },
    clearCurrentPost(state) {
      state.currentPost = null;
      state.currentStatus = 'idle';
      state.currentError = null;
      state.currentAuthor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Impossible de charger les articles.';
      })

      .addCase(fetchPostById.pending, (state) => {
        state.currentStatus = 'loading';
        state.currentError = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.currentError = action.payload || 'Article introuvable.';
      })

      .addCase(fetchPostAuthor.fulfilled, (state, action) => {
        state.currentAuthor = action.payload;
      })
      .addCase(fetchPostAuthor.rejected, (state) => {
        state.currentAuthor = null;
      })

      .addCase(createPost.fulfilled, (state, action) => {
        const { tempId, post } = action.payload;
        const index = state.items.findIndex((item) => item.id === tempId);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...post, id: post.id ?? tempId };
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        const { tempId, message } = action.payload || {};
        state.items = state.items.filter((post) => post.id !== tempId);
        state.mutationError = message || "La publication de l'article a échoué.";
      })

      .addCase(deletePost.rejected, (state, action) => {
        const { post, message } = action.payload || {};
        if (post) state.items.unshift(post);
        state.mutationError = message || "La suppression de l'article a échoué.";
      })

      .addCase(reactToPost.rejected, (state, action) => {
        const { postId, reactions, message } = action.payload || {};
        const post = state.items.find((item) => item.id === postId);
        if (post && reactions) post.reactions = reactions;
        if (state.currentPost?.id === postId && reactions) state.currentPost.reactions = reactions;
        state.mutationError = message || 'La réaction a échoué.';
      });
  },
});

export const {
  postAddedOptimistic,
  postRemovedOptimistic,
  postReactionsUpdatedOptimistic,
  clearPostsMutationError,
  clearCurrentPost,
} = postsSlice.actions;

export default postsSlice.reducer;
