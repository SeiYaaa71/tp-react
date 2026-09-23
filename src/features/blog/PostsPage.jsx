import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost, deletePost, clearPostsMutationError } from './postsSlice';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import PostCard from './components/PostCard';
import PostForm from './components/PostForm';
import './PostsPage.css';

export default function PostsPage() {
  const dispatch = useDispatch();
  const { items, status, error, mutationError } = useSelector((state) => state.posts);
  const { token, user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchPosts());
  }, [status, dispatch]);

  function handleCreate(formData) {
    dispatch(createPost({ ...formData, userId: user?.id }));
    setShowForm(false);
  }

  function handleDelete(postId) {
    if (window.confirm('Supprimer cet article ?')) {
      dispatch(deletePost(postId));
    }
  }

  return (
    <div className="container page">
      <div className="page-head blog-head">
        <div>
          <h1>Le blog</h1>
          <p>{items.length} article{items.length > 1 ? 's' : ''} publiés par la communauté.</p>
        </div>

        {token && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowForm((visible) => !visible)}
          >
            {showForm ? 'Annuler' : 'Publier un article'}
          </button>
        )}
      </div>

      {mutationError && (
        <p className="alert" role="alert">
          {mutationError}{' '}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => dispatch(clearPostsMutationError())}
          >
            OK
          </button>
        </p>
      )}

      {token && showForm && <PostForm onSubmit={handleCreate} />}

      {status === 'loading' && <Loading label="Chargement des articles..." />}
      {status === 'failed' && <ErrorState message={error} onRetry={() => dispatch(fetchPosts())} />}
      {status === 'succeeded' && items.length === 0 && (
        <EmptyState message="Aucun article publié pour le moment." />
      )}

      {items.length > 0 && (
        <ul className="grid blog-grid">
          {items.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canDelete={Boolean(token)}
              onDelete={() => handleDelete(post.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
