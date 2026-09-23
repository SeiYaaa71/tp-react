import { createSlice } from '@reduxjs/toolkit';

const loadFavorites = () => {
  try {
    const serializedState = localStorage.getItem('favorites');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const saveFavorites = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('favorites', serializedState);
  } catch (err) {
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFavorites(),
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const recipe = action.payload;
      const index = state.items.findIndex((item) => item.id === recipe.id);
      
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(recipe);
      }
      
      saveFavorites(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveFavorites(state.items);
    }
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
