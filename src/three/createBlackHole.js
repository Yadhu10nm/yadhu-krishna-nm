import * as THREE from 'three';

function radialGlowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,215,0,0.9)');
  grad.addColorStop(0.35, 'rgba(255,215,0,0.35)');
  grad.addColorStop(1, 'rgba(255,215,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function diskGradientTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.12, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,235,150,0.95)');
  grad.addColorStop(0.35, 'rgba(255,215,0,0.55)');
  grad.addColorStop(0.7, 'rgba(212,175,55,0.18)');
  grad.addColorStop(1, 'rgba(212,175,55,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * A minimal black hole: an opaque core sphere (occludes stars behind it),
 * a flattened, tilted accretion-disk ring using an additive gradient
 * texture, and a soft glow sprite for bloom-like ambience without
 * post-processing.
 */
export function createBlackHole({ position = new THREE.Vector3(0, 0, 0), coreRadius = 3.4 } = {}) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Core void
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(coreRadius, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  group.add(core);

  // Glow sprite behind/around the core
  const glowTex = radialGlowTexture();
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  glow.scale.set(coreRadius * 5.2, coreRadius * 5.2, 1);
  group.add(glow);

  // Accretion disk — a flattened ring plane with radial gradient, tilted
  const diskTex = diskGradientTexture();
  const diskGeo = new THREE.RingGeometry(coreRadius * 1.15, coreRadius * 2.9, 96);
  // Map UVs radially so the gradient reads correctly on the ring
  const pos = diskGeo.attributes.position;
  const uv = diskGeo.attributes.uv;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const dist = v3.length() / (coreRadius * 2.9);
    const angle = Math.atan2(v3.y, v3.x);
    uv.setXY(i, 0.5 + Math.cos(angle) * dist * 0.5, 0.5 + Math.sin(angle) * dist * 0.5);
  }

  const diskMat = new THREE.MeshBasicMaterial({
    map: diskTex,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const disk = new THREE.Mesh(diskGeo, diskMat);
  disk.rotation.x = Math.PI / 2.4;
  group.add(disk);

  // A second, slightly offset thin ring for extra dimensionality
  const disk2 = disk.clone();
  disk2.rotation.z = Math.PI / 6;
  disk2.scale.setScalar(0.78);
  group.add(disk2);

  return {
    object3D: group,
    update(delta) {
      disk.rotation.z += delta * 0.14;
      disk2.rotation.z -= delta * 0.1;
      const s = 1 + Math.sin(Date.now() * 0.0006) * 0.04;
      glow.scale.set(coreRadius * 5.2 * s, coreRadius * 5.2 * s, 1);
    },
    dispose() {
      core.geometry.dispose();
      core.material.dispose();
      glowTex.dispose();
      glow.material.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      diskTex.dispose();
    },
  };
}
