import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchPostById,
  fetchPostAuthor,
  deletePost,
  reactToPost,
  clearCurrentPost,
  clearPostsMutationError,
} from './postsSlice';
import { fetchComments, createComment, deleteComment, clearCommentsMutationError } from './commentsSlice';
import { Loading, ErrorState } from '../../components/States';
import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';
import './PostDetailPage.css';

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPost, currentStatus, currentError, currentAuthor, mutationError } = useSelector(
    (state) => state.posts
  );
  const { token, user } = useSelector((state) => state.auth);
  const commentsStatus = useSelector((state) => state.comments.status[postId]);
  const commentsError = useSelector((state) => state.comments.error[postId]);
  const comments = useSelector((state) => state.comments.byPostId[postId] || []);
  const commentsMutationError = useSelector((state) => state.comments.mutationError);

  useEffect(() => {
    if (!Number.isNaN(postId)) {
      dispatch(fetchPostById(postId));
      dispatch(fetchComments(postId));
    }
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [postId, dispatch]);

  useEffect(() => {
    if (currentPost?.userId) {
      dispatch(fetchPostAuthor(currentPost.userId));
    }
  }, [currentPost?.userId, dispatch]);

  function handleDeletePost() {
    if (window.confirm('Supprimer cet article ?')) {
      dispatch(deletePost(postId));
      navigate('/posts');
    }
  }

  function handleReact(reaction) {
    dispatch(reactToPost({ postId, reaction }));
  }

  function handleAddComment(body) {
    dispatch(createComment({ postId, body, userId: user?.id, username: user?.username }));
  }

  function handleDeleteComment(commentId) {
    if (window.confirm('Supprimer ce commentaire ?')) {
      dispatch(deleteComment({ postId, commentId }));
    }
  }

  if (Number.isNaN(postId)) {
    return <ErrorState message="Identifiant d'article invalide." />;
  }

  if (currentStatus === 'loading' && !currentPost) {
    return <Loading label="Chargement de l'article..." />;
  }

  if (currentStatus === 'failed') {
    return <ErrorState message={currentError} onRetry={() => dispatch(fetchPostById(postId))} />;
  }

  if (!currentPost) return null;

  const likes = currentPost.reactions?.likes ?? 0;
  const dislikes = currentPost.reactions?.dislikes ?? 0;

  return (
    <div className="container page post-detail">
      <Link to="/posts" className="btn btn-ghost post-detail-back">
        Retour au blog
      </Link>

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

      <article>
        {currentPost.tags?.length > 0 && (
          <div className="post-detail-tags">
            {currentPost.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1>{currentPost.title}</h1>

        <p className="post-detail-meta">
          {currentAuthor ? `Par @${currentAuthor.username}` : `Auteur nº${currentPost.userId}`}
          {' - '}
          {currentPost.views ?? 0} vues
        </p>

        <p className="post-detail-body">{currentPost.body}</p>

        <div className="post-detail-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => handleReact('like')}
            disabled={!token}
            title={token ? 'Aimer cet article' : 'Connecte-toi pour réagir'}
          >
            J'aime ({likes})
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => handleReact('dislike')}
            disabled={!token}
            title={token ? 'Ne pas aimer cet article' : 'Connecte-toi pour réagir'}
          >
            Je n'aime pas ({dislikes})
          </button>

          {token && (
            <button
              type="button"
              className="btn btn-ghost post-detail-delete"
              onClick={handleDeletePost}
            >
              Supprimer l'article
            </button>
          )}
        </div>
      </article>

      <section className="post-comments">
        <h2>Commentaires ({comments.length})</h2>

        {commentsMutationError && (
          <p className="alert" role="alert">
            {commentsMutationError}{' '}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => dispatch(clearCommentsMutationError())}
            >
              OK
            </button>
          </p>
        )}

        {token ? (
          <CommentForm onSubmit={handleAddComment} />
        ) : (
          <p className="post-comments-hint">
            <Link to="/login">Connecte-toi</Link> pour laisser un commentaire.
          </p>
        )}

        {commentsStatus === 'loading' && <Loading label="Chargement des commentaires..." />}
        {commentsStatus === 'failed' && (
          <ErrorState message={commentsError} onRetry={() => dispatch(fetchComments(postId))} />
        )}
        {commentsStatus === 'succeeded' && comments.length === 0 && (
          <p className="post-comments-empty">
            Aucun commentaire pour le moment. Soyez le premier à réagir.
          </p>
        )}

        <CommentList comments={comments} canDelete={Boolean(token)} onDelete={handleDeleteComment} />
      </section>
    </div>
  );
}
