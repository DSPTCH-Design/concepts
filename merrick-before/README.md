# Merrick Roofing (before)

The "before" version of the Merrick Roofing concept site, by DSPTCH Design. It is a deliberately dated small-business site for before/after demos in ads. The redesigned site is in `../merrick/`.

Same company details as the redesign: name, phone, address, email, services, service areas and reviews.

What makes it the "before":

- Fixed 980px desktop layout with a left sidebar, textured background and gradient bars
- Rotating stock banner with a generic "Quality Roofing You Can Trust" caption
- "Welcome to Merrick Roofing" over long justified paragraphs
- Phone number only in the footer and on the contact page, and not tap-to-call
- 24-hour storm service buried mid-paragraph; office hours listed as Mon-Fri 8-5
- No call to action above the fold; the contact form has 16 fields, including fax
- Keyword-stuffed page titles, "Latest News" from 2015 and a 2015 copyright

Unlike `arlo-before/`, this one has a mobile view, and it is a poor one:

- The menu becomes a two-column block of small links that fills the top of the screen
- The banner shrinks to a strip and its caption box covers most of the photo
- The sidebar (services, areas, estimate box) stacks above the welcome text
- Floated photos keep their desktop width, leaving a thin column of justified text
- The three tiles stay side by side, and the contact form runs off the screen

Pages: `index.html`, `about.html`, `services.html`, `gallery.html`, `testimonials.html`, `contact.html`, `404.html`. Static HTML, one stylesheet and a small vanilla JS file. No build step. Pages carry `noindex`.

The contact form runs only in the browser. It does not send, log or store anything.

Local preview: `python3 -m http.server 8080` from this folder, then open http://localhost:8080.

Deploy: Netlify, base and publish directory `merrick-before/` (see `netlify.toml`).
