import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/client';

export const fetchQuotes = createAsyncThunk('quotes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await apiFetch('/quotes?limit=0');
    return data.quotes;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const quotesSlice = createSlice({
  name: 'quotes',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Erreur lors du chargement des citations.';
      });
  },
});

export default quotesSlice.reducer;
