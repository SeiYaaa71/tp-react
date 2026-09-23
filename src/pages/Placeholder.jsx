export default function Placeholder({ title, owner }) {
  return (
    <div className="container page">
      <h1>{title}</h1>
      <p>Page en cours de développement - lot {owner}.</p>
    </div>
  );
}
