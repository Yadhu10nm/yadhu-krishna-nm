import * as THREE from 'three';

/**
 * Classic spiral-galaxy particle generator: points distributed along
 * logarithmic arms, colored from a warm gold core to a cool pale edge.
 */
export function createGalaxy({
  count = 5200,
  radius = 34,
  branches = 4,
  spin = 1.1,
  randomness = 0.4,
  randomnessPower = 3,
  insideColor = '#ffd700',
  outsideColor = '#2a2440',
} = {}) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const colorInside = new THREE.Color(insideColor);
  const colorOutside = new THREE.Color(outsideColor);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 1.5) * radius;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    const spinAngle = r * spin;

    const randX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
    const randY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * 0.3;
    const randZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

    positions[i3] = Math.cos(branchAngle + spinAngle) * r + randX;
    positions[i3 + 1] = randY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randZ;

    const mixed = colorInside.clone().lerp(colorOutside, r / radius);
    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;

    scales[i] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.18,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);

  return {
    object3D: points,
    update(delta) {
      points.rotation.y += delta * 0.03;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
