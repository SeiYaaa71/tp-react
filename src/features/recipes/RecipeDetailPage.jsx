import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeById, clearCurrentRecipe } from './recipesSlice';
import { toggleFavorite } from '../favorites/favoritesSlice';
import './RecipeDetailPage.css';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { currentRecipe, currentStatus, currentError } = useSelector((state) => state.recipes);
  const token = useSelector((state) => state.auth.token);
  const favoriteItems = useSelector((state) => state.favorites.items);
  
  const isFavorite = favoriteItems.some(item => item.id === parseInt(id));

  useEffect(() => {
    dispatch(fetchRecipeById(id));
    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [id, dispatch]);

  const handleToggleFavorite = () => {
    if (currentRecipe) {
      dispatch(toggleFavorite(currentRecipe));
    }
  };

  if (currentStatus === 'loading') {
    return <div className="container py-xl loading">Chargement de la recette...</div>;
  }

  if (currentStatus === 'failed') {
    return (
      <div className="container py-xl">
        <div className="alert alert-error">{currentError}</div>
        <Link to="/" className="btn btn-ghost mt-4">Retour au catalogue</Link>
      </div>
    );
  }

  if (!currentRecipe) return null;

  return (
    <div className="container py-xl">
      <div className="recipe-detail">
        <div className="recipe-detail-header">
          <Link to="/" className="btn btn-ghost">&larr; Retour</Link>
          {token && (
            <button 
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? '⭐ Retirer des favoris' : '☆ Ajouter aux favoris'}
            </button>
          )}
        </div>

        <img src={currentRecipe.image} alt={currentRecipe.name} className="recipe-detail-image" />
        
        <div className="recipe-detail-content">
          <h1>{currentRecipe.name}</h1>
          <div className="recipe-meta-large">
            <span>⏱ Préparation : {currentRecipe.prepTimeMinutes} min</span>
            <span>🍳 Cuisson : {currentRecipe.cookTimeMinutes} min</span>
            <span>🍽️ Portions : {currentRecipe.servings}</span>
            <span>⭐ {currentRecipe.rating} ({currentRecipe.reviewCount} avis)</span>
          </div>

          <div className="recipe-sections">
            <div className="recipe-section">
              <h2>Ingrédients</h2>
              <ul>
                {currentRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="recipe-section">
              <h2>Instructions</h2>
              <ol>
                {currentRecipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
