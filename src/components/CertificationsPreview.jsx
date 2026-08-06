import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import CertificationCard from './CertificationCard';
import certifications from '../data/certifications.json';
import './CertificationsPreview.css';

export default function CertificationsPreview() {
  const headRef = useReveal();
  const preview = certifications.slice(0, 3);

  return (
    <section className="section certs" id="certifications">
      <div className="container">
        <div className="glass-panel certs__panel">
          <div ref={headRef} className="reveal section-head">
          <p className="eyebrow">Credentials</p>
          <h2 className="section-title">Proven, <em>certified</em> foundations</h2>
        </div>

        <div className="certs__grid">
          {preview.map((c, i) => (
            <CertItem key={c.id} cert={c} delay={i * 110} />
          ))}
        </div>

        <div className="projects__footer">
          <Link to="/certifications" className="btn-ghost">
            More Certifications <span className="arrow">→</span>
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
}

function CertItem({ cert, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal-flip" style={{ transitionDelay: `${delay}ms` }}>
      <CertificationCard cert={cert} />
    </div>
  );
}
