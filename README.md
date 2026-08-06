# Black Hole Portfolio

A premium, black-and-gold portfolio site built with React, Vite, React Router, and Three.js.
A persistent WebGL "mini galaxy" — starfield, a spiral galaxy, an orbiting black hole with an
accretion disk, a few drifting planets, and floating code-snippet sprites for a coding theme —
sits fixed behind every page, with glassmorphism cards, scroll-triggered reveals, and a
horizontal project carousel on top.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

Requires Node.js 18+.

## Folder structure

```
src/
  data/                  ← ALL editable content lives here as JSON
    profile.json         ← name, title, tagline, bio, photo/resume paths
    skills.json           ← skills grouped by category with a proficiency % each (used by the Skills section)
    projects.json         ← every project (used on home + /projects)
    certifications.json   ← every certificate (used on home + /certifications)
    gallery.json          ← gallery grid images + captions
    social.json           ← email / github / linkedin / instagram / phone

  three/                 ← WebGL scene, plain three.js (no React renderer needed)
    createGalaxyScene.js    orchestrator: renderer/camera/lights/animation loop
    createStarfield.js      two-layer starfield (points)
    createGalaxy.js         spiral galaxy particle generator
    createBlackHole.js      core sphere + glow sprite + accretion disk rings
    createPlanets.js        a few orbiting planets (one wireframe, one ringed)
    createCodeSprites.js    floating code-snippet / binary sprites (the coding theme)

  components/            ← reusable UI pieces (one .jsx + one .css each)
    GalaxyBackground.jsx   fixed full-viewport canvas mounting the three.js scene
    Navbar.jsx / Footer.jsx
    Hero.jsx / About.jsx
    ProjectCard.jsx / ProjectCarousel.jsx
    Skills.jsx              grouped, animated proficiency bars — sits after Projects
    CertificationCard.jsx / CertificationsPreview.jsx
    Gallery.jsx / Contact.jsx

  hooks/
    useReveal.js           IntersectionObserver hook — toggles an 'is-visible' class
    useInView.js            same idea but returns reactive [ref, inView] state,
                             used where an animation needs a JS-computed value
                             (e.g. the Skills section's bar-fill percentage)

  pages/
    Home.jsx               composes Hero → About → Projects → Skills → Certifications → Gallery → Contact
    Projects.jsx            full project grid, routed at /projects
    Certifications.jsx      full certification grid, routed at /certifications

  styles/
    variables.css           color / type / spacing / motion tokens
    animations.css          shared @keyframes

public/
  assets/                 ← static images, resume PDF — referenced as "/assets/..." in JSON
```

**To edit content, you never need to touch component code** — just edit the JSON files in
`src/data/`. Add a new project by adding an object to `projects.json`; it will automatically
appear in the homepage carousel and the `/projects` page.

## Plugging in real content

- **Photos**: replace the placeholder SVGs in `public/assets/` with real images (jpg/png/webp),
  keeping the same filenames, or update the paths in the JSON files to match your new filenames.
- **Resume**: drop your PDF at `public/assets/resume.pdf` (already linked from the Download
  Resume button via `profile.json`).
- **Project previews from Google Drive**: share the file as "Anyone with the link", grab the
  file ID from the share URL, then:
  - **Images** → `previewType: "image"`, `preview: "https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000"`
  - **Videos** → `previewType: "video"`, `preview: "https://drive.google.com/file/d/FILE_ID/preview"`
    (rendered as an embedded iframe player — Drive doesn't allow direct `<video src>` playback).
- **Contact form**: `Contact.jsx` currently simulates a submission. Wire the `handleSubmit`
  function up to a service like Formspree, EmailJS, or your own API endpoint.
- **Social links / email**: edit `src/data/social.json`.

## The galaxy background

`GalaxyBackground.jsx` mounts once in `App.jsx`, outside the router, as a `position: fixed`
canvas behind everything (`z-index: -1`). Because it's viewport-fixed rather than page-fixed, the
same scene stays visible behind every section as you scroll and on every route.

- **Starfield** — two point layers at different radii/sizes for parallax depth.
- **Spiral galaxy** — a classic logarithmic-arm particle system, gold at the core fading to a
  cool edge color, tilted and pushed back so it reads as a distant backdrop object.
- **Black hole** — an opaque core sphere (it actually occludes stars behind it), a soft additive
  glow sprite, and two layered accretion-disk rings with a radial gradient texture.
- **Planets** — a handful of small spheres on independent slow orbits; a couple carry a thin gold
  wireframe shell or a ring, for a bit of "engineered" texture.
- **Coding theme** — `createCodeSprites.js` renders canvas textures of short code fragments
  (`</>`, `const`, `01001`, `async`, `git`, etc.) in JetBrains Mono onto sprites that drift and
  rotate slowly through the scene at low opacity — ambient texture, not clutter.

Performance/accessibility notes:
- Particle counts and sprite counts scale down under 760px viewport width.
- Renderer pixel ratio is capped (1.5–2x) and the scene pauses via
  `document.visibilitychange` when the tab isn't active.
- `prefers-reduced-motion: reduce` renders a single static frame instead of looping.
- If WebGL isn't available, the canvas fails silently and the page falls back to the plain black
  background — nothing else on the site depends on it.

To adjust the mix (e.g. fewer planets, no code sprites, different palette), edit
`src/three/createGalaxyScene.js` — each layer is a small independent module you can add, remove,
or tune in isolation.

## Design system

- **Palette**: void black (`#000000`), charcoal/graphite surfaces, champagne gold (`#d4af37`) for
  structure and borders, pure gold (`#ffd700`) reserved for glow and particle accents, soft white
  text, muted grays for secondary copy.
- **Type**: Cormorant Garamond (display/serif headings), Manrope (body), JetBrains Mono (labels,
  eyebrows, technical/utility text).
- **Motion**: `useReveal` fades + blurs sections in on scroll; the projects carousel uses an
  "emerge from the void" scale+blur entrance; everything respects `prefers-reduced-motion`.

## Deploying

`npm run build` outputs a static `dist/` folder — deploy it to Vercel, Netlify, GitHub Pages, or
any static host. Since this uses `react-router-dom` with client-side routing, configure your host
to redirect all paths to `index.html` (a `_redirects` or `vercel.json` rewrite rule).
