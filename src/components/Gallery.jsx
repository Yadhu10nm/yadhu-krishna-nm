import useReveal from '../hooks/useReveal';
import gallery from '../data/gallery.json';
import './Gallery.css';

function GalleryItem({ item, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal-scale gallery__frame" style={{ transitionDelay: `${delay}ms` }}>
      <img src={item.src} alt={item.caption} loading="lazy" onError={(e) => (e.currentTarget.style.opacity = 0)} />
      <span className="gallery__caption">{item.caption}</span>
    </div>
  );
}

export default function Gallery() {
  const headRef = useReveal();
  return (
    <section className="section gallery" id="gallery">
      <div className="container">
        <div className="glass-panel gallery__panel">
          <div ref={headRef} className="reveal section-head">
          <p className="eyebrow">Gallery</p>
          <h2 className="section-title">Moments, <em>framed</em> in gold</h2>
        </div>

          <div className="gallery__grid">
          {gallery.map((g, i) => (
            <GalleryItem item={g} key={g.id} delay={(i % 3) * 90} />
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
