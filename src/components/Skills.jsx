import useReveal from '../hooks/useReveal';
import useInView from '../hooks/useInView';
import skills from '../data/skills.json';
import './Skills.css';

function groupByCategory(list) {
  const map = new Map();
  list.forEach((s) => {
    if (!map.has(s.category)) map.set(s.category, []);
    map.get(s.category).push(s);
  });
  return Array.from(map.entries());
}

function SkillBar({ skill, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`skill-bar ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="skill-bar__head">
        <span className="skill-bar__name">{skill.name}</span>
        <span className="skill-bar__pct">{inView ? skill.proficiency : 0}%</span>
      </div>
      <div className="skill-bar__track">
        <div
          className="skill-bar__fill"
          style={{
            width: inView ? `${skill.proficiency}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function CategoryColumn({ category, items, columnDelay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal-scale skills__column" style={{ transitionDelay: `${columnDelay}ms` }}>
      <p className="skills__category">{category}</p>
      <div className="skills__bars">
        {items.map((s, i) => (
          <SkillBar key={s.name} skill={s} delay={i * 90} />
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const headRef = useReveal();
  const groups = groupByCategory(skills);

  return (
    <section className="section skills" id="skills">
      <div className="container">
        <div className="glass-panel skills__panel">
          <div ref={headRef} className="reveal section-head">
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-title">Tools of the <em>trade</em></h2>
            <p className="section-sub">
              A working toolkit spanning languages, interfaces, and the AI/ML systems underneath them.
            </p>
          </div>

          <div className="skills__grid">
            {groups.map(([category, items], i) => (
              <CategoryColumn key={category} category={category} items={items} columnDelay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
