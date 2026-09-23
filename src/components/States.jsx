
export function Loading({ label = 'Chargement...' }) {
  return (
    <p className="state" role="status">
      {label}
    </p>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state">
      <p className="alert" role="alert">
        {message}
      </p>
      {onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, children }) {
  return (
    <div className="state">
      <p>{message}</p>
      {children}
    </div>
  );
}
