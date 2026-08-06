import useReveal from '../hooks/useReveal';
import profile from '../data/profile.json';
import './About.css';

function RevealItem({ as: Tag = 'div', className = '', children, delay = 0, variant = 'reveal' }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`${variant} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="glass-panel about__panel">
          <RevealItem className="section-head">
            <p className="eyebrow">About</p>
            <h2 className="section-title">The engineer <em>behind</em> the interface</h2>
          </RevealItem>

          <div className="about__grid">
          <RevealItem className="about__photos" delay={80} variant="reveal-left">
            {profile.photos.map((src, i) => (
              <div className="about__photo-frame" key={i}>
                <img src={src} alt="" onError={(e) => (e.currentTarget.style.opacity = 0)} />
              </div>
            ))}
          </RevealItem>

          <RevealItem className="about__bio" delay={160} variant="reveal-right">
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </RevealItem>
        </div>
        </div>
      </div>
    </section>
  );
}
