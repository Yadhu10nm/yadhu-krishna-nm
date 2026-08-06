import { useEffect } from 'react';
import useReveal from '../hooks/useReveal';
import CertificationCard from '../components/CertificationCard';
import certifications from '../data/certifications.json';
import './PageHeader.css';

function CertItem({ cert, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal-flip" style={{ transitionDelay: `${delay}ms` }}>
      <CertificationCard cert={cert} full />
    </div>
  );
}

export default function Certifications() {
  const headRef = useReveal();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="page">
      <section className="page-header">
        <div className="container">
          <div ref={headRef} className="reveal">
            <p className="eyebrow">Full Archive</p>
            <h1 className="page-header__title">All <em>Certifications</em></h1>
            <p className="section-sub">
              Verified credentials across machine learning, programming, and data tools.
            </p>
          </div>
        </div>
      </section>

      <section className="section page-grid-section">
        <div className="container">
          <div className="page-grid">
            {certifications.map((c, i) => (
              <CertItem key={c.id} cert={c} delay={(i % 3) * 110} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
