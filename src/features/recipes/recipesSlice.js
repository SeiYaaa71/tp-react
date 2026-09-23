import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/client';

export const fetchRecipes = createAsyncThunk('recipes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await apiFetch('/recipes?limit=0');
    return data.recipes;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchOne',
  async (recipeId, { rejectWithValue }) => {
    try {
      return await apiFetch(`/recipes/${recipeId}`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    currentRecipe: null,
    currentStatus: 'idle',
    currentError: null,
  },
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
      state.currentStatus = 'idle';
      state.currentError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Erreur lors du chargement des recettes.';
      })
      
      .addCase(fetchRecipeById.pending, (state) => {
        state.currentStatus = 'loading';
        state.currentError = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.currentError = action.payload || 'Recette introuvable.';
      });
  },
});

export const { clearCurrentRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;
