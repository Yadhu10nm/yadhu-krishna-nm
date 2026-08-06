import './CertificationCard.css';

export default function CertificationCard({ cert, full = false }) {
  return (
    <div className="cert-card glass-card">
      <div className="cert-card__image">
        <img src={cert.image} alt={cert.title} loading="lazy" />
      </div>
      <div className="cert-card__body">
        <h3 className="cert-card__title">{cert.title}</h3>
        <p className="cert-card__org">{cert.organization}</p>
        <p className="cert-card__date">{cert.date}</p>
        {full && cert.description && <p className="cert-card__desc">{cert.description}</p>}
        {full && cert.credentialUrl && (
          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="cert-card__link">
            View Credential ↗
          </a>
        )}
      </div>
    </div>
  );
}
