import CommentItem from './CommentItem';

export default function CommentList({ comments, canDelete, onDelete }) {
  if (comments.length === 0) return null;

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          canDelete={canDelete}
          onDelete={() => onDelete(comment.id)}
        />
      ))}
    </ul>
  );
}
