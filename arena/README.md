# ARENA

Concept website by DSPTCH Design for ARENA, a physician-led men's health and longevity clinic.

Static HTML, one shared stylesheet and a small vanilla JS file. No build step.

- `index.html`, `programs/`, `method/`, `experience/`, `about/`, `get-started/`, `404.html`
- `assets/css/styles.css`, `assets/js/main.js`, `assets/images/`

Photography is color-graded to a single look (muted color, lifted blacks, fine grain). Physician names, credentials, licensed states and pricing are placeholders.

The intro-call form runs only in the browser. It does not send, log or store anything.

Local preview: `python3 -m http.server 8080` from this folder, then open http://localhost:8080 (root-relative paths need a server, not file://).

Deploy: Netlify, base and publish directory `arena/` (see `netlify.toml`).
