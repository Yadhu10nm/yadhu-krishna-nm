import social from '../data/social.json';
import profile from '../data/profile.json';
import useReveal from '../hooks/useReveal';
import './Footer.css';

const ICONS = [
  { key: 'github', label: 'GH', href: social.github },
  { key: 'linkedin', label: 'IN', href: social.linkedin },
  { key: 'instagram', label: 'IG', href: social.instagram },
  { key: 'email', label: '@', href: `mailto:${social.email}` },
];

export default function Footer() {
  const ref = useReveal();
  return (
    <footer ref={ref} className="footer reveal">
      <div className="container footer__inner">
        <p className="footer__mark">{profile.name}</p>

        <ul className="footer__icons">
          {ICONS.map((i, idx) => (
            <li key={i.key} style={{ transitionDelay: `${idx * 80}ms` }}>
              <a href={i.href} target="_blank" rel="noreferrer" aria-label={i.key}>
                {i.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="footer__copy">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
