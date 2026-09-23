import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from './recipesSlice';
import { Link } from 'react-router-dom';
import QuoteWidget from '../quotes/QuoteWidget';
import './RecipesPage.css';

export default function RecipesPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRecipes());
    }
  }, [status, dispatch]);

  return (
    <div className="container py-xl">
      <header className="page-header">
        <h1>Catalogue de recettes</h1>
        <p className="subtitle">Découvrez notre sélection de recettes savoureuses.</p>
      </header>

      <QuoteWidget />

      {status === 'loading' && <div className="loading">Chargement des recettes...</div>}
      {status === 'failed' && <div className="alert alert-error">{error}</div>}
      
      {status === 'succeeded' && (
        <div className="recipes-grid">
          {items.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image-wrapper">
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
              </div>
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.name}</h3>
                <div className="recipe-meta">
                  <span className="meta-item">⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                  <span className="meta-item">⭐ {recipe.rating}</span>
                </div>
                <Link to={`/recipes/${recipe.id}`} className="btn btn-primary btn-block">
                  Voir la recette
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
