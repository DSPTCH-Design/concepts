# APEX Plumbing

Concept website by DSPTCH Design.

Static HTML, one stylesheet and a small vanilla JS file. No build step.

- `index.html`, `404.html`
- `css/style.css`, `js/main.js`, `images/`, `favicon.svg`

The brand color is the `--accent` variable at the top of `css/style.css`. `images/hero-alt.jpg` is the alternate hero photo.

The phone number, address, email, reviews and stats are placeholders. The estimate form runs only in the browser. It does not send, log or store anything.

Local preview: `python3 -m http.server 8080` from this folder, then open http://localhost:8080.

Deploy: Netlify, base and publish directory `apex/` (see `netlify.toml`).
