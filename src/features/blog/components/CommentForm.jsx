import { useState } from 'react';

export default function CommentForm({ onSubmit }) {
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    if (!body.trim()) {
      setError('Le commentaire ne peut pas être vide.');
      return;
    }

    onSubmit(body.trim());
    setBody('');
    setError(null);
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      <div className="field">
        <label htmlFor="comment-body">Ajouter un commentaire</label>
        <textarea
          id="comment-body"
          rows={3}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Commenter
      </button>
    </form>
  );
}
