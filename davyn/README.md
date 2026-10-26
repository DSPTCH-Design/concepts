# DAVYN Dental Studio

Concept website by DSPTCH Design.

Static HTML, one shared stylesheet and a small vanilla JS file. No build step.

- `index.html`, `treatments/`, `experience/`, `studio/`, `consultation/`, `404.html`
- `assets/css/styles.css`, `assets/js/main.js`, `assets/images/`

The header wordmark is typeset placeholder text (`.wordmark` in the header, `.ft__word` in the footer) until the final DAVYN logo is supplied.

The consultation form runs only in the browser. It does not send, log or store anything.

Local preview: `python3 -m http.server 8080` from this folder, then open http://localhost:8080 (root-relative paths need a server, not file://).

Deploy: Netlify, base and publish directory `davyn/` (see `netlify.toml`).
