import { useEffect } from 'react';
import useReveal from '../hooks/useReveal';
import ProjectCard from '../components/ProjectCard';
import projects from '../data/projects.json';
import './PageHeader.css';

export default function Projects() {
  const headRef = useReveal();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="page">
      <section className="page-header">
        <div className="container">
          <div ref={headRef} className="reveal">
            <p className="eyebrow">Full Archive</p>
            <h1 className="page-header__title">All <em>Projects</em></h1>
            <p className="section-sub">
              Every system I've built, from AI companions to production mobile apps — engineered end to end.
            </p>
          </div>
        </div>
      </section>

      <section className="section page-grid-section">
        <div className="container">
          <div className="page-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} variant="reveal-scale" delay={(i % 3) * 110} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
