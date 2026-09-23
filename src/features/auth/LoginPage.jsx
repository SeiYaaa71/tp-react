import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, clearAuthError } from './authSlice';
import './LoginPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, status, error } = useSelector((state) => state.auth);

  const redirectTo = location.state?.from || '/profil';

  useEffect(() => {
    if (token) {
      navigate(redirectTo, { replace: true });
    }
  }, [token, redirectTo, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(login(form));
  }

  const isLoading = status === 'loading';
  const isIncomplete = !form.username.trim() || !form.password.trim();

  return (
    <div className="login">
      <section className="login-intro">
        <h1>Rejoignez la table.</h1>
        <p>
          Enregistrez vos recettes préférées, publiez vos billets et suivez ce que cuisine
          la communauté.
        </p>
      </section>

      <section className="login-form-panel">
        <h2>Connexion</h2>

        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading || isIncomplete}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="login-hint">
          Compte de test DummyJSON : <strong>emilys</strong> / <strong>emilyspass</strong>
        </p>
      </section>
    </div>
  );
}
