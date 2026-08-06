import useReveal from '../hooks/useReveal';
import './ProjectCard.css';

export default function ProjectCard({ project, delay = 0, emerge = true, variant }) {
  const revealRef = useReveal();
  const revealClass = variant || (emerge ? 'reveal-emerge' : 'reveal');
  return (
    <article
      ref={revealRef}
      className={`project-card glass-card ${revealClass}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="project-card__media">
        {project.previewType === 'video' ? (
          <iframe
            src={project.preview}
            title={project.title}
            allow="autoplay"
            loading="lazy"
            frameBorder="0"
          />
        ) : (
          <img src={project.preview} alt={project.title} loading="lazy" />
        )}
        <div className="project-card__media-glow" />
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.shortDescription}</p>

        <ul className="project-card__tech">
          {project.technologies.slice(0, 4).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="project-card__actions">
          <a href={project.github} target="_blank" rel="noreferrer" className="project-card__link">
            GitHub ↗
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="project-card__link">
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
