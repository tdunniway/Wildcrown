export function PrototypeBadge({ status }) {
  return <span className={`wc-badge wc-badge--${status}`}>{status}</span>;
}

export function PrototypeCard({ prototype, href }) {
  return (
    <article className="wc-prototype-card">
      <a className="wc-prototype-card__preview" href={href}>
        {prototype.previewImage ? (
          <img src={prototype.previewImage} alt="" />
        ) : (
          <span>{prototype.name.slice(0, 1)}</span>
        )}
      </a>
      <div className="wc-prototype-card__body">
        <div className="wc-prototype-card__heading">
          <h2>{prototype.name}</h2>
          <PrototypeBadge status={prototype.status} />
        </div>
        <p>{prototype.description}</p>
        <a className="wc-button" href={href}>
          Open prototype
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
