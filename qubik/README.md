# QUBIK

Six-page static site for QUBIK, an architecture and engineering firm for commercial and industrial buildings.

- Plain HTML, CSS and JS. No build step on Netlify.
- Pages live at clean URLs: `/services/`, `/projects/`, `/about/`, `/careers/`, `/contact/`, plus `404.html`.
- `assets/css/qubik.css` holds the design system (slate field, crane-amber accent, square corners, Archivo + IBM Plex Mono).
- `assets/js/qubik.js` handles the header and menu, wordmark fitting, reveals, the discipline columns, the work rail, the project filter, the contact form and the isometric block-to-building drawings.
- `build.py` regenerates every page from one source so the header, footer and copy stay consistent. Run `python3 build.py` after editing copy. Pages are generated, so edit `build.py` rather than the HTML files.

Site by DSPTCH Design.
