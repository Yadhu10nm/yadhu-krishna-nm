import * as THREE from 'three';

const SNIPPETS = [
  '</>', '{ }', '01', '10', 'AI', 'ML', '=>', 'git', 'npm i', 'const',
  'async', '[ ]', '01001', '#!/', '<div>', 'GPU', 'py', 'js', '( )', '!==',
];

function snippetTexture(text) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.font = '600 34px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(255,215,0,0.9)';
  ctx.shadowBlur = 14;
  ctx.fillStyle = 'rgba(255,215,0,0.95)';
  ctx.fillText(text, size / 2, size / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Sprites bearing small code fragments / binary glyphs, drifting slowly
 * through the scene — the "coding theme" layer. Sparse and low-opacity
 * so it reads as ambient texture rather than clutter.
 */
export function createCodeSprites({ count = 22, spread = 30 } = {}) {
  const group = new THREE.Group();
  const sprites = [];

  for (let i = 0; i < count; i++) {
    const text = SNIPPETS[i % SNIPPETS.length];
    const tex = snippetTexture(text);
    const material = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0.22 + Math.random() * 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(material);
    const scale = 1.1 + Math.random() * 1.3;
    sprite.scale.set(scale, scale, 1);

    sprite.position.set(
      (Math.random() - 0.5) * spread * 2,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 2
    );

    group.add(sprite);
    sprites.push({
      sprite,
      tex,
      driftSpeed: 0.15 + Math.random() * 0.25,
      baseY: sprite.position.y,
      phase: Math.random() * Math.PI * 2,
    });
  }

  return {
    object3D: group,
    update(delta, elapsed) {
      sprites.forEach((s) => {
        s.sprite.position.y = s.baseY + Math.sin(elapsed * s.driftSpeed + s.phase) * 1.6;
        s.sprite.material.rotation += delta * 0.05;
      });
    },
    dispose() {
      sprites.forEach((s) => {
        s.tex.dispose();
        s.sprite.material.dispose();
      });
    },
  };
}
