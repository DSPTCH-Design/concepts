# ARLO Plumbing (before)

The "before" version of the ARLO Plumbing concept site, by DSPTCH Design. It is a deliberately dated small-business site for before/after demos in ads. The redesigned site is in `../arlo/`.

Same company details as the redesign: name, phone, address, email, services, service areas and reviews.

What makes it the "before":

- Fixed 960px layout with no mobile viewport, so phones show a shrunken desktop page
- Auto-rotating stock photo slider with generic captions
- "Welcome to Our Website!" headline over long justified paragraphs
- Phone number only in small print (top bar, footer, contact page) and not tap-to-call
- 24/7 emergency service buried mid-paragraph; office hours listed as Mon-Fri 8-5
- No call to action above the fold; the contact form has 14 fields, including fax
- Keyword-stuffed page titles and a 2014 copyright

Pages: `index.html`, `about.html`, `services.html`, `testimonials.html`, `contact.html`, `404.html`. Static HTML, one stylesheet and a small vanilla JS file. No build step. Pages carry `noindex`.

The contact form runs only in the browser. It does not send, log or store anything.

Local preview: `python3 -m http.server 8080` from this folder, then open http://localhost:8080.

Deploy: Netlify, base and publish directory `arlo-before/` (see `netlify.toml`).
