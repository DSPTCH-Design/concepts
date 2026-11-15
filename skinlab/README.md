# Skin LAB

Concept website by DSPTCH Design. One scrolling page for a medical aesthetics clinic in Birmingham, MI.

Static HTML, one stylesheet and a small vanilla JS file. No build step.

- `index.html`, `404.html`
- `assets/css/style.css`, `assets/js/main.js`, `assets/img/`, `assets/fonts/`, `assets/logo/`

The wordmark in `assets/logo/` is outlined: "Skin" in Newsreader, "LAB" in IBM Plex Mono Medium. The logo icon has not been added yet; there is a slot for it in the header.

Fonts are self-hosted: Newsreader (headlines), Instrument Sans (text) and IBM Plex Mono (labels and prices, with a plain zero).

The palette is the set of variables at the top of `assets/css/style.css`: plum, sage and their tints.

The phone number, address, email, prices, reviews and medical director are placeholders. The before/after pairs are simulated from single photos. The booking form runs only in the browser. It does not send, log or store anything.

Local preview: `python3 -m http.server 8080` from this folder, then open http://localhost:8080.

Deploy: Netlify, base and publish directory `skinlab/` (see `netlify.toml`).
