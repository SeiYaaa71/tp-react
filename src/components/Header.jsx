import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  function handleLogout() {
    dispatch(logout());
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="wordmark">
          Marmiterie
        </Link>

        <nav className="site-nav">
          <NavLink to="/">Recettes</NavLink>
          <NavLink to="/posts">Blog</NavLink>
          <NavLink to="/users">Membres</NavLink>

          {token ? (
            <>
              <NavLink to="/favoris">Mes favoris</NavLink>
              <NavLink to="/profil">Mon profil</NavLink>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-ghost">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
