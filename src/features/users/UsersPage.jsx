import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './usersSlice';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import './UsersPage.css';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.users);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const visibleUsers = items.filter((user) =>
    user.username.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="container page">
      <div className="page-head users-head">
        <div>
          <h1>Les membres</h1>
          <p>{items.length} cuisiniers inscrits sur la plateforme.</p>
        </div>
        <input
          type="search"
          className="users-search"
          placeholder="Chercher un pseudo"
          aria-label="Chercher un membre"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {status === 'loading' && <Loading label="Chargement des membres..." />}
      {status === 'failed' && (
        <ErrorState message={error} onRetry={() => dispatch(fetchUsers())} />
      )}

      {status === 'succeeded' && visibleUsers.length === 0 && (
        <EmptyState message={`Aucun membre ne correspond à "${search}".`} />
      )}

      {visibleUsers.length > 0 && (
        <ul className="grid users-grid">
          {visibleUsers.map((user) => (
            <li key={user.id}>
              <Link to={`/users/${user.id}`} className="card user-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <img src={user.image} alt="" loading="lazy" />
                <div className="card-body">
                  <h3>{user.username}</h3>
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
