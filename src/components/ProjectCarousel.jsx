import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import ProjectCard from './ProjectCard';
import projects from '../data/projects.json';
import './ProjectCarousel.css';

function useVisibleCount() {
  const [visible, setVisible] = useState(3);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setVisible(w <= 640 ? 1 : w <= 960 ? 2 : 3);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return visible;
}

export default function ProjectCarousel() {
  const [index, setIndex] = useState(0);
  const headRef = useReveal();
  const visible = useVisibleCount();
  const maxIndex = Math.max(0, projects.length - visible);
  const timerRef = useRef(null);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [maxIndex]);

  const go = (dir) => {
    clearInterval(timerRef.current);
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return maxIndex;
      if (next > maxIndex) return 0;
      return next;
    });
  };

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="glass-panel projects__panel">
          <div ref={headRef} className="reveal projects__head">
            <div>
              <p className="eyebrow">Selected Work</p>
              <h2 className="section-title">Projects emerging from <em>the void</em></h2>
            </div>
            <div className="projects__controls">
              <button aria-label="Previous projects" onClick={() => go(-1)}>←</button>
              <button aria-label="Next projects" onClick={() => go(1)}>→</button>
            </div>
          </div>

          <div className="projects__viewport">
          <div
            className="projects__track"
            style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
          >
            {projects.map((p, i) => (
              <div className="projects__slide" key={p.id} style={{ flexBasis: `${100 / visible}%` }}>
                <ProjectCard project={p} delay={(i % visible) * 100} />
              </div>
            ))}
          </div>
        </div>

          <div className="projects__footer">
            <Link to="/projects" className="btn-ghost">
              More Projects <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
