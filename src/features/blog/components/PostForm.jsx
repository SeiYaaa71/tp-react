import { useState } from 'react';

export default function PostForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [formError, setFormError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      setFormError('Le titre et le contenu sont obligatoires.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSubmit({ title: title.trim(), body: body.trim(), tags });

    setTitle('');
    setBody('');
    setTagsInput('');
    setFormError(null);
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <h2>Publier un article</h2>

      {formError && (
        <p className="alert" role="alert">
          {formError}
        </p>
      )}

      <div className="field">
        <label htmlFor="post-title">Titre</label>
        <input
          id="post-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="post-body">Contenu</label>
        <textarea
          id="post-body"
          rows={5}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="post-tags">Tags (séparés par une virgule)</label>
        <input
          id="post-tags"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="recette, astuce, cuisine"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Publier
      </button>
    </form>
  );
}
