import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/client';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

const initialState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: readStoredUser(),
  status: 'idle',
  error: null,
  profileStatus: 'idle',
  profileError: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      return await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, expiresInMins: 60 }),
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetch('/auth/me');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.profileStatus = 'idle';
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken, token, ...user } = action.payload;
        state.status = 'succeeded';
        state.token = accessToken || token;
        state.user = user;
        localStorage.setItem(TOKEN_KEY, state.token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Connexion impossible.';
      })
      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = 'loading';
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded';
        state.user = action.payload;
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.profileError = action.payload || 'Profil indisponible.';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
