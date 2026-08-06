import { useEffect, useRef } from 'react';
import { createGalaxyScene } from '../three/createGalaxyScene';
import './GalaxyBackground.css';

/**
 * Fixed, full-viewport WebGL backdrop mounted once at the app root.
 * Sits behind all page content (z-index below everything) so every
 * section shares the same persistent "mini galaxy" scenery.
 */
export default function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let sceneHandle;
    let cancelled = false;

    // WebGL init can be relatively heavy; defer one tick so first paint
    // (nav, hero text) isn't blocked by scene construction.
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        sceneHandle = createGalaxyScene(canvasRef.current);
        sceneHandle.start();
      } catch (err) {
        // WebGL unavailable — fall back silently to the plain dark background.
        console.warn('Galaxy background unavailable:', err);
      }
    });

    const onVisibility = () => {
      if (!sceneHandle) return;
      if (document.hidden) sceneHandle.stop();
      else sceneHandle.start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      document.removeEventListener('visibilitychange', onVisibility);
      sceneHandle && sceneHandle.dispose();
    };
  }, []);

  return (
    <div className="galaxy-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="galaxy-bg__canvas" />
      <div className="galaxy-bg__vignette" />
    </div>
  );
}
