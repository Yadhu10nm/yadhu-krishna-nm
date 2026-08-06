import profile from '../data/profile.json';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__vignette" />

      <div className="container">
        <div className="hero__content">
          <div className="hero__photo-wrap">
            <div className="hero__photo-ring" />
            <img
              src={profile.photo}
              alt={profile.name}
              className="hero__photo"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <p className="eyebrow hero__eyebrow">{profile.location}</p>
          <h1 className="hero__name">{profile.name}</h1>
          <p className="hero__title">{profile.title}</p>
          <p className="hero__tagline">{profile.tagline}</p>

          <div className="hero__actions">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-outline">Contact Me</a>
            <a href={profile.resumeUrl} className="btn btn-outline" download>Download Resume</a>
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <span /> Scroll
      </div>
    </section>
  );
}
