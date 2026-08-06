import { useEffect, useRef, useState } from 'react';

/**
 * Like useReveal, but returns reactive state instead of just toggling a
 * class — needed when an animation depends on a JS-computed value (e.g.
 * an inline width percentage for a skill bar) rather than a fixed CSS
 * transition target.
 */
export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px', ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}
