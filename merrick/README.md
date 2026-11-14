# Merrick Roofing

Concept website by DSPTCH Design. One scrolling page for a Skokie, IL roofing company.

Static HTML, one stylesheet and a small vanilla JS file. No build step.

- `index.html`, `404.html`
- `css/style.css`, `js/main.js`, `images/`, `favicon.svg`, `logo.svg`, `logo-white.svg`

The icon is the supplied Merrick mark. The wordmark in the logo files and page header is typeset in Red Hat Display Black and outlined.

The brand color is the `--accent` variable at the top of `css/style.css`.

The phone number, address, email, reviews, projects and stats are placeholders. The estimate form runs only in the browser. It does not send, log or store anything.

Local preview: `python3 -m http.server 8080` from this folder, then open http://localhost:8080.

Deploy: Netlify, base and publish directory `merrick/` (see `netlify.toml`).
