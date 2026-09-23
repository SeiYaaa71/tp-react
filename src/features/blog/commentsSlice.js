import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/client';

export const fetchComments = createAsyncThunk(
  'comments/fetchForPost',
  async (postId, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`/comments/post/${postId}?limit=0`);
      return { postId, comments: data.comments };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/create',
  async ({ postId, body, userId, username }, { dispatch, rejectWithValue }) => {
    const tempId = `temp-${nanoid()}`;

    dispatch(
      commentAddedOptimistic({
        postId,
        comment: { id: tempId, postId, body, user: { id: userId, username } },
      })
    );

    try {
      const created = await apiFetch('/comments/add', {
        method: 'POST',
        body: JSON.stringify({ body, postId, userId }),
      });
      return { postId, tempId, comment: created };
    } catch (error) {
      return rejectWithValue({ postId, tempId, message: error.message });
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async ({ postId, commentId }, { dispatch, getState, rejectWithValue }) => {
    const removed = (getState().comments.byPostId[postId] || []).find((c) => c.id === commentId);
    dispatch(commentRemovedOptimistic({ postId, commentId }));

    try {
      await apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue({ postId, comment: removed, message: error.message });
    }
  }
);

const initialState = {
  byPostId: {},
  status: {},
  error: {},
  mutationError: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    commentAddedOptimistic(state, action) {
      const { postId, comment } = action.payload;
      if (!state.byPostId[postId]) state.byPostId[postId] = [];
      state.byPostId[postId].unshift(comment);
    },
    commentRemovedOptimistic(state, action) {
      const { postId, commentId } = action.payload;
      state.byPostId[postId] = (state.byPostId[postId] || []).filter((c) => c.id !== commentId);
    },
    clearCommentsMutationError(state) {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        state.status[action.meta.arg] = 'loading';
        state.error[action.meta.arg] = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.status[postId] = 'succeeded';
        state.byPostId[postId] = comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status[action.meta.arg] = 'failed';
        state.error[action.meta.arg] = action.payload || 'Commentaires indisponibles.';
      })

      .addCase(createComment.fulfilled, (state, action) => {
        const { postId, tempId, comment } = action.payload;
        const list = state.byPostId[postId] || [];
        const index = list.findIndex((c) => c.id === tempId);
        if (index !== -1) {
          list[index] = {
            ...list[index],
            ...comment,
            id: comment.id ?? tempId,
            user: comment.user?.username ? comment.user : list[index].user,
          };
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        const { postId, tempId, message } = action.payload || {};
        if (postId != null && state.byPostId[postId]) {
          state.byPostId[postId] = state.byPostId[postId].filter((c) => c.id !== tempId);
        }
        state.mutationError = message || "L'ajout du commentaire a échoué.";
      })

      .addCase(deleteComment.rejected, (state, action) => {
        const { postId, comment, message } = action.payload || {};
        if (postId != null && comment) {
          if (!state.byPostId[postId]) state.byPostId[postId] = [];
          state.byPostId[postId].unshift(comment);
        }
        state.mutationError = message || 'La suppression du commentaire a échoué.';
      });
  },
});

export const { commentAddedOptimistic, commentRemovedOptimistic, clearCommentsMutationError } =
  commentsSlice.actions;

export default commentsSlice.reducer;
