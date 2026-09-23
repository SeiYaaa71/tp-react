import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/client';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await apiFetch('/users?limit=0&select=username,image,firstName,lastName');
    return data.users;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchUserById = createAsyncThunk(
  'users/fetchOne',
  async (userId, { rejectWithValue }) => {
    try {
      return await apiFetch(`/users/${userId}`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    currentUser: null,
    currentStatus: 'idle',
    currentError: null,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.currentStatus = 'idle';
      state.currentError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Annuaire indisponible.';
      })
      
      .addCase(fetchUserById.pending, (state) => {
        state.currentStatus = 'loading';
        state.currentError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.currentError = action.payload || 'Utilisateur introuvable.';
      });
  },
});

export const { clearCurrentUser } = usersSlice.actions;

export default usersSlice.reducer;
