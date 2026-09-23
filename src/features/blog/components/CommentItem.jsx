export default function CommentItem({ comment, canDelete, onDelete }) {
  const authorLabel = comment.user?.username
    ? `@${comment.user.username}`
    : comment.user?.fullName || 'Utilisateur';

  return (
    <li className="comment-item">
      <div className="comment-item-head">
        <span className="comment-item-author">{authorLabel}</span>
        {comment.createdAt && <span className="comment-item-date">{comment.createdAt}</span>}
      </div>

      <p className="comment-item-body">{comment.body}</p>

      {canDelete && (
        <button type="button" className="btn btn-ghost comment-item-delete" onClick={onDelete}>
          Supprimer
        </button>
      )}
    </li>
  );
}
