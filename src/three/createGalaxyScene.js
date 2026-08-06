import * as THREE from 'three';
import { createStarfield } from './createStarfield';
import { createGalaxy } from './createGalaxy';
import { createBlackHole } from './createBlackHole';
import { createPlanets } from './createPlanets';
import { createCodeSprites } from './createCodeSprites';

/**
 * Builds and drives the persistent WebGL "mini galaxy" background:
 * starfield + spiral galaxy + a central black hole + orbiting planets
 * + drifting code-snippet sprites. Returns { start, stop, dispose }
 * for lifecycle management from React.
 */
export function createGalaxyScene(canvas) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.innerWidth < 760;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, 3, 26);
  camera.lookAt(0, 0, 0);

  const layers = [
    createStarfield(),
    createGalaxy({ count: isSmall ? 2600 : 5200 }),
    createBlackHole({ position: new THREE.Vector3(0, -1.5, 0), coreRadius: 3.4 }),
    createPlanets(),
    createCodeSprites({ count: isSmall ? 10 : 22 }),
  ];

  layers.forEach((l) => scene.add(l.object3D));

  // Push the galaxy plane back/tilted so it reads as a distinct backdrop layer
  layers[1].object3D.rotation.x = 0.5;
  layers[1].object3D.position.set(-6, -4, -30);

  // --- Mouse / pointer parallax ---
  const pointer = { x: 0, y: 0 };
  const targetPointer = { x: 0, y: 0 };
  function onPointerMove(e) {
    targetPointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    targetPointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
  window.addEventListener('pointermove', onPointerMove);

  // --- Resize ---
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let rafId = null;
  let running = false;

  function frame() {
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime();

    if (!reducedMotion) {
      layers.forEach((l) => l.update && l.update(delta, elapsed));

      pointer.x += (targetPointer.x - pointer.x) * 0.03;
      pointer.y += (targetPointer.y - pointer.y) * 0.03;
      camera.position.x = pointer.x * 2.2;
      camera.position.y = 3 - pointer.y * 1.2;
      camera.lookAt(0, -0.5, 0);
    }

    renderer.render(scene, camera);
    if (running) rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      frame();
      if (reducedMotion) renderer.render(scene, camera);
    },
    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    },
    dispose() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      layers.forEach((l) => l.dispose && l.dispose());
      renderer.dispose();
    },
  };
}
