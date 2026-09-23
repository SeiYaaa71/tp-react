import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function reactionsCount(reactions) {
  if (!reactions) return 0;
  if (typeof reactions === 'number') return reactions;
  return (reactions.likes || 0) + (reactions.dislikes || 0);
}

function excerpt(text, length = 140) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length).trim()}...` : text;
}

export default function PostCard({ post, canDelete, onDelete }) {
  const author = useSelector((state) =>
    (state.users.items || []).find((user) => user.id === post.userId)
  );

  return (
    <li className="card post-card">
      <div className="card-body">
        {post.tags?.length > 0 && (
          <div className="post-card-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h3>

        <p className="post-card-excerpt">{excerpt(post.body)}</p>

        <div className="post-card-meta">
          <span>{author ? `@${author.username}` : `Auteur nº${post.userId}`}</span>
          <span>{reactionsCount(post.reactions)} reactions</span>
          <span>{post.views ?? 0} vues</span>
        </div>

        <div className="post-card-actions">
          <Link to={`/posts/${post.id}`} className="btn btn-ghost">
            Lire l'article
          </Link>
          {canDelete && (
            <button type="button" className="btn btn-ghost post-card-delete" onClick={onDelete}>
              Supprimer
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
