import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container page">
      <h1>Cette page n'est pas au menu</h1>
      <p>
        L'adresse demandée n'existe pas ou la ressource a été retirée. Repartez du catalogue
        pour retrouver les recettes.
      </p>
      <Link to="/" className="btn btn-primary">
        Voir les recettes
      </Link>
    </div>
  );
}
