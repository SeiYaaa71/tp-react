import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from './authSlice';
import { Loading, ErrorState } from '../../components/States';
import './ProfilePage.css';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, profileStatus, profileError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(fetchProfile());
    }
  }, [profileStatus, dispatch]);

  if (profileStatus === 'loading' && !user) return <Loading label="Chargement du profil..." />;
  if (profileStatus === 'failed') {
    return <ErrorState message={profileError} onRetry={() => dispatch(fetchProfile())} />;
  }
  if (!user) return null;

  return (
    <div className="container page">
      <header className="profile-head">
        <img className="profile-avatar" src={user.image} alt="" />
        <div>
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <p className="profile-username">@{user.username}</p>
          {user.company?.title && <span className="tag">{user.company.title}</span>}
        </div>
      </header>

      <div className="profile-columns">
        <section className="card card-body">
          <h2>Coordonnées</h2>
          <dl className="profile-list">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </dd>
            <dt>Téléphone</dt>
            <dd>{user.phone}</dd>
            <dt>Adresse</dt>
            <dd>
              {user.address?.address}
              <br />
              {user.address?.postalCode} {user.address?.city}
              {user.address?.country ? `, ${user.address.country}` : ''}
            </dd>
          </dl>
        </section>

        <section className="card card-body">
          <h2>Entreprise</h2>
          <dl className="profile-list">
            <dt>Société</dt>
            <dd>{user.company?.name}</dd>
            <dt>Département</dt>
            <dd>{user.company?.department}</dd>
            <dt>Poste</dt>
            <dd>{user.company?.title}</dd>
          </dl>
        </section>

        <section className="card card-body">
          <h2>Informations personnelles</h2>
          <dl className="profile-list">
            <dt>Âge</dt>
            <dd>{user.age} ans</dd>
            <dt>Date de naissance</dt>
            <dd>{user.birthDate}</dd>
            <dt>Université</dt>
            <dd>{user.university}</dd>
          </dl>
        </section>
      </div>
    </div>
  );
}
