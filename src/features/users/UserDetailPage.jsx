import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, clearCurrentUser } from './usersSlice';
import { Loading, ErrorState } from '../../components/States';
import './UserDetailPage.css';

export default function UserDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { currentUser, currentStatus, currentError } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [id, dispatch]);

  if (currentStatus === 'loading' || currentStatus === 'idle') {
    return (
      <div className="container page">
        <Loading label="Chargement du profil..." />
      </div>
    );
  }

  if (currentStatus === 'failed') {
    return (
      <div className="container page">
        <ErrorState message={currentError} onRetry={() => dispatch(fetchUserById(id))} />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/users" className="btn btn-ghost">Retour à l'annuaire</Link>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="container page user-detail-page">
      <div className="user-detail-header">
        <Link to="/users" className="btn btn-ghost">&larr; Retour</Link>
      </div>

      <div className="user-profile-card">
        <div className="user-profile-avatar">
          <img src={currentUser.image} alt={currentUser.username} />
        </div>
        
        <div className="user-profile-info">
          <h1>{currentUser.firstName} {currentUser.lastName}</h1>
          <p className="username">@{currentUser.username}</p>
          
          <div className="user-details-grid">
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{currentUser.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Téléphone</span>
              <span className="detail-value">{currentUser.phone}</span>
            </div>
            {currentUser.company && (
              <div className="detail-item">
                <span className="detail-label">Entreprise</span>
                <span className="detail-value">{currentUser.company.name} ({currentUser.company.department})</span>
              </div>
            )}
            {currentUser.address && (
              <div className="detail-item">
                <span className="detail-label">Lieu</span>
                <span className="detail-value">{currentUser.address.city}, {currentUser.address.country}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Rôle</span>
              <span className="detail-value" style={{ textTransform: 'capitalize' }}>{currentUser.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
