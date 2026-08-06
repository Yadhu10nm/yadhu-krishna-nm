import { useState } from 'react';
import useReveal from '../hooks/useReveal';
import social from '../data/social.json';
import './Contact.css';

const CHANNELS = [
  { key: 'email', label: 'Email', value: social.email, href: `mailto:${social.email}` },
  { key: 'github', label: 'GitHub', value: 'Yadhu10nm', href: social.github },
  { key: 'linkedin', label: 'LinkedIn', value: 'Connect', href: social.linkedin },
  { key: 'instagram', label: 'Instagram', value: 'Follow', href: social.instagram },
];

export default function Contact() {
  const headRef = useReveal();
  const channelsRef = useReveal();
  const formRef = useReveal();
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Hello, I have seen your portfolio. %0A%0AMy name is ${encodeURIComponent(form.name)}.%0AEmail: ${encodeURIComponent(form.email)}.%0A%0AMessage:%0A${encodeURIComponent(form.message)}`;
    const url = `https://api.whatsapp.com/send?phone=918111835438&text=${text}`;
    setStatus('sent');
    window.location.href = url;
    setTimeout(() => setStatus('idle'), 3500);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="glass-panel contact__panel">
          <div ref={headRef} className="reveal section-head">
            <p className="eyebrow">Get In Touch</p>
            <h2 className="section-title">Let's build something <em>remarkable</em></h2>
            <p className="section-sub">
              Open to internships, collaborations, and interesting problems. Reach out through any channel below.
            </p>
          </div>

          <div className="contact__grid">
          <ul ref={channelsRef} className="reveal contact__channels">
            {CHANNELS.map((c, i) => (
              <li key={c.key} style={{ transitionDelay: `${i * 90}ms` }}>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <span className="contact__channel-label">{c.label}</span>
                  <span className="contact__channel-value">{c.value}</span>
                </a>
              </li>
            ))}
          </ul>

          <form ref={formRef} className="reveal contact__form glass-card" onSubmit={handleSubmit}>
            <div className="contact__field" style={{ transitionDelay: '80ms' }}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} />
            </div>
            <div className="contact__field" style={{ transitionDelay: '160ms' }}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="contact__field" style={{ transitionDelay: '240ms' }}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required value={form.message} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary contact__submit" style={{ transitionDelay: '320ms' }}>
              {status === 'sent' ? 'Message Sent ✓' : 'Send Message'}
            </button>
          </form>
        </div>
        </div>
      </div>
    </section>
  );
}
