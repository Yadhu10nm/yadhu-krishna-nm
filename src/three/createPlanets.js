import * as THREE from 'three';

const PLANET_DEFS = [
  { radius: 0.9, color: '#d4af37', orbitRadius: 16, orbitSpeed: 0.055, tilt: 0.3, wire: true },
  { radius: 1.4, color: '#8a712a', orbitRadius: 24, orbitSpeed: 0.03, tilt: -0.15, ring: true },
  { radius: 0.55, color: '#f5f3ee', orbitRadius: 11, orbitSpeed: 0.09, tilt: 0.5, wire: true },
  { radius: 1.1, color: '#4a4a4d', orbitRadius: 30, orbitSpeed: 0.021, tilt: 0.1 },
];

/**
 * A handful of small planets on slow independent orbits around the scene
 * origin. Each is a low-poly sphere with a faint emissive tint; a couple
 * carry a thin wireframe shell for a subtle "engineered" / technical
 * read consistent with the coding theme.
 */
export function createPlanets() {
  const group = new THREE.Group();
  const bodies = [];

  PLANET_DEFS.forEach((def, i) => {
    const orbit = new THREE.Group();
    orbit.rotation.x = def.tilt;
    orbit.rotation.y = Math.random() * Math.PI * 2;

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(def.radius, 24, 24),
      new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.color,
        emissiveIntensity: 0.12,
        roughness: 0.55,
        metalness: 0.35,
      })
    );
    mesh.position.set(def.orbitRadius, 0, 0);
    orbit.add(mesh);

    if (def.wire) {
      const wire = new THREE.Mesh(
        new THREE.SphereGeometry(def.radius * 1.14, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true, transparent: true, opacity: 0.28 })
      );
      mesh.add(wire);
    }

    if (def.ring) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(def.radius * 1.5, def.radius * 2.1, 48),
        new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
      );
      ring.rotation.x = Math.PI / 2.2;
      mesh.add(ring);
    }

    orbit.add(mesh);
    group.add(orbit);
    bodies.push({ orbit, mesh, speed: def.orbitSpeed, spin: 0.15 + Math.random() * 0.2 });
  });

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const point = new THREE.PointLight(0xffd700, 1.4, 90);
  point.position.set(0, 8, 12);
  group.add(ambient, point);

  return {
    object3D: group,
    update(delta) {
      bodies.forEach((b) => {
        b.orbit.rotation.y += delta * b.speed;
        b.mesh.rotation.y += delta * b.spin;
      });
    },
    dispose() {
      bodies.forEach((b) => {
        b.mesh.geometry.dispose();
        b.mesh.material.dispose();
        b.mesh.children.forEach((c) => {
          c.geometry.dispose();
          c.material.dispose();
        });
      });
    },
  };
}
