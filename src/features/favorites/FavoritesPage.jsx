import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const { items } = useSelector((state) => state.favorites);

  return (
    <div className="container py-xl">
      <header className="page-header">
        <h1>Mes favoris</h1>
        <p className="subtitle">Retrouvez ici toutes vos recettes sauvegardées.</p>
      </header>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Vous n'avez pas encore de recettes en favoris.</p>
          <Link to="/" className="btn btn-primary">Découvrir des recettes</Link>
        </div>
      ) : (
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
