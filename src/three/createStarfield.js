import * as THREE from 'three';

/**
 * A large sphere of tiny points standing in for background stars.
 * Two layers (near/far) give subtle parallax depth.
 */
export function createStarfield() {
  const group = new THREE.Group();

  const layers = [
    { count: 2600, radius: 60, size: 0.16, opacity: 0.85 },
    { count: 1800, radius: 110, size: 0.1, opacity: 0.5 },
  ];

  layers.forEach(({ count, radius, size, opacity }) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const gold = new THREE.Color('#ffd700');
    const white = new THREE.Color('#f5f3ee');

    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + Math.random() * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mix = Math.random();
      const c = white.clone().lerp(gold, mix < 0.15 ? Math.random() * 0.6 : 0);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);
  });

  return {
    object3D: group,
    update(delta) {
      group.rotation.y += delta * 0.006;
      group.rotation.x += delta * 0.001;
    },
    dispose() {
      group.children.forEach((p) => {
        p.geometry.dispose();
        p.material.dispose();
      });
    },
  };
}
