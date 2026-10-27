#!/usr/bin/env python3
"""Builds the QUBIK site into static pages.

python3 build.py            -> clean-URL site for Netlify (folder links like services/)
python3 build.py preview D  -> same pages with explicit index.html links, written to D
"""
import os, sys, html

PREVIEW = len(sys.argv) > 1 and sys.argv[1] == 'preview'
OUT = sys.argv[2] if PREVIEW else os.path.dirname(os.path.abspath(__file__))

SITE = 'QUBIK'
EMAIL = 'projects@qubik-ae.com'
CAREERS = 'careers@qubik-ae.com'
PHONE = '(312) 555-0148'

NAV = [('services', 'Services'), ('projects', 'Projects'), ('about', 'About'), ('careers', 'Careers')]

ICON_PTS = "1397.22 602.77 602.77 602.77 602.77 1397.22 1397.22 1397.22 1199.66 1199.66 1000 1199.66 800.34 1199.66 800.34 1093.61 800.34 800.35 1199.66 800.35 1199.66 1030.31 1397.22 1227.88 1397.22 602.77"
LOGO = ('<svg viewBox="602.77 602.77 794.45 794.45" aria-hidden="true"><polygon fill="currentColor" points="' + ICON_PTS + '"/></svg>')
FAVICON = ("data:image/svg+xml," +
           "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='400 400 1200 1200'%3E%3Crect x='400' y='400' width='1200' height='1200' fill='%230a0d11'/%3E"
           "%3Cpolygon fill='%23eef1f3' points='" + ICON_PTS + "'/%3E%3C/svg%3E")


def link(root, slug, frag=''):
    if slug == '':
        base = 'index.html' if PREVIEW else './'
        return (root + base if root else base) + frag
    return root + slug + ('/index.html' if PREVIEW else '/') + frag


def img(root, name, alt, eager=False):
    load = 'eager" fetchpriority="high' if eager else 'lazy'
    return f'<img src="{root}assets/images/{name}.jpg" alt="{html.escape(alt)}" loading="{load}" decoding="async">'


def head(root, title, desc):
    full = SITE if not title else f'{title} | {SITE}'
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{full}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="{html.escape(desc)}">
<meta name="theme-color" content="#0a0d11">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:type" content="website">
<meta property="og:image" content="{root}assets/images/hero-street.jpg">
<link rel="icon" href="{FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,200..600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="{root}assets/css/qubik.css?v=10">
</head>
<body>
'''


def header(root, slug):
    cur = ' aria-current="page"'
    links = ''.join(f'<a href="{link(root, s)}"{cur if s == slug else ""}>{n}</a>' for s, n in NAV)
    menu = ''.join(f'<a href="{link(root, s)}"><span class="m">{i:02d}</span><span class="up">{n}</span></a>'
                   for i, (s, n) in enumerate([('', 'Home')] + NAV + [('contact', 'Contact')], 1))
    return f'''<div class="cols" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<header class="hdr">
  <div class="wrap">
    <a class="logo" href="{link(root, '')}" aria-label="QUBIK home">{LOGO}<b>QUBIK</b></a>
    <nav class="links" aria-label="Main">{links}<a class="go" href="{link(root, 'contact')}">Start a project</a></nav>
    <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
  </div>
</header>
<div class="menu" id="menu">
  <nav class="wrap" aria-label="Menu">{menu}</nav>
  <aside>{img(root, 'cranes', 'Tower cranes against a teal sky')}<span class="m">{PHONE} &middot; {EMAIL}</span></aside>
</div>
<main id="main">
'''


def footer(root, cta=True):
    nav = ''.join(f'<li><a href="{link(root, s)}">{n}</a></li>' for s, n in NAV)
    go = f'''<a class="go-row" href="{link(root, 'contact')}"><div class="wrap"><span class="up">Discuss a project</span><span class="arrow" aria-hidden="true">&#8599;</span></div></a>
<div class="contact-strip">
  <div><span class="m cap">Phone</span><span>{PHONE}</span></div>
  <div><span class="m cap">Email</span><span>{EMAIL}</span></div>
  <div><span class="m cap">Chicago</span><span>Fulton Market</span></div>
  <div><span class="m cap">Denver</span><span>River North Art District</span></div>
</div>
''' if cta else ''
    return f'''{go}</main>
<footer class="ftr">
  <div class="grid">
    <div><a class="logo" href="{link(root, '')}" aria-label="QUBIK home">{LOGO}<b>QUBIK</b></a><p class="small">Architecture and engineering for commercial and industrial buildings.</p></div>
    <div><h4>Firm</h4><ul>{nav}<li><a href="{link(root, 'contact')}">Contact</a></li></ul></div>
    <div><h4>Talk to an engineer</h4><ul><li>{PHONE}</li><li>{EMAIL}</li><li class="mute">Mon to Fri, 7:30 to 5:30 CT</li></ul></div>
    <div><h4>Offices</h4><ul><li>Chicago, Illinois</li><li>Denver, Colorado</li></ul></div>
  </div>
  <div class="wrap base m"><span>&copy; 2026 QUBIK Architecture + Engineering</span><span>Site by <a href="https://dsptchdesign.com" target="_blank" rel="noopener">DSPTCH Design</a></span></div>
</footer>
<script src="{root}assets/js/qubik.js?v=10" defer></script>
</body>
</html>
'''


PERSP = ('<svg class="persp" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'
         '<line x1="0" y1="0" x2="52" y2="58"/><line x1="100" y1="0" x2="52" y2="58"/>'
         '<line x1="0" y1="100" x2="52" y2="58"/><line x1="100" y1="100" x2="52" y2="58"/>'
         '<line x1="52" y1="0" x2="52" y2="100"/></svg>')


def hero(root, image, alt, lede, note, cta, word, sub, short=True, clock='Chicago'):
    label, href, down = cta
    sub_html = '<br>'.join(sub)
    return f'''<section class="hero{' hero--short' if short else ''}">
  <div class="hero__img">{img(root, image, alt, eager=True)}</div>
  {PERSP}
  <div class="wrap hero__top">
    <h1 class="say hero__lede">{lede}</h1>
  </div>
  <div class="wrap hero__base">
    <div class="wm" aria-hidden="true">
      <span class="wm__word{'' if word == 'Qubik' else ' wm__word--page'}">{word}</span><span class="wm__rule"></span>
      <span class="wm__paren"><span class="wm__p">(</span><span class="wm__sub">{sub_html}</span><span class="wm__p">)</span></span>
    </div>
  </div>
</section>
'''


def stmt(dotlabel, say, aside, stats, note=''):
    st = ''.join(f'<div class="bstat rv"><div class="n"><b>{n}</b><sup>[{u}]</sup></div><span class="l">{l}</span></div>'
                 for n, u, l in stats)
    return f'''<section class="sec">
  <div class="wrap stmt">
    <div class="stmt__head"><span class="dotl rv">{dotlabel}</span><h2 class="say rv">{say}</h2></div>
    <div class="stmt__aside rv"><p>{aside}</p></div>
    {f'<div class="stmt__note rv">{note}</div>' if note else ''}
    <div class="bstats">{st}</div>
  </div>
</section>
'''

# ---------------------------------------------------------------- content

DISCIPLINES = [
    ('Architecture', 'A-series', 'lightbox', 'Two designers marking up plans on a light table',
     'Plans, envelopes and code strategy built around how the building gets used, then tested against how it gets built.'),
    ('Structural', 'S-series', 'steel-connection', 'Bolted steel moment connection seen through glass',
     'Steel, concrete, tilt-up and precast, sized for the loads you have today and the equipment you add later.'),
    ('MEP', 'M / E / P', 'schematic', 'Engineer marking up an electrical single-line diagram',
     'Mechanical, electrical and plumbing designed alongside the structure, not threaded through it afterward.'),
    ('Design-build', 'DB', 'plant', 'Engineer in a hard hat walking a process floor',
     'One contract from concept to closeout, with the engineers still on the job when the steel goes up.'),
]

STEPS = [
    ('Mass', 'Site, zoning, program and budget resolved into one block before design starts.', 'A plain block'),
    ('Frame', 'Grid, spans and structural system set early, so every later decision has something to stand on.', 'The block opened into a column grid and floor plates'),
    ('Systems', 'Mechanical, electrical and plumbing routed in the same model as the steel.', 'Service risers and mains routed through the frame'),
    ('Build', 'Permit sets, construction administration and closeout, with no hand-off between teams.', 'The finished building with its facade grid'),
]

FEATURED = [
    dict(name='Kinzie Yard', img='night-build', alt='Concrete frame of an eleven-story building lit at night beside rail tracks',
         city='Chicago, IL', sector='Mixed-use', size='286,000 sf', delivery='Design-build', status='In progress', year='2026',
         text='Eleven stories of office over ground-floor retail on a rail-side lot, framed in post-tensioned concrete to keep floor-to-floor heights low.'),
    dict(name='Northline Tower', img='tower', alt='Curved glass office tower under construction with a tower crane',
         city='Denver, CO', sector='Commercial office', size='612,000 sf', delivery='Design-bid-build', status='In progress', year='2027',
         text='A 38-story office tower on a steel core with outrigger trusses, engineered for a tight downtown site and a 30-month schedule.'),
    dict(name='Arden Works', img='arden', alt='Mid-rise tower in scaffolding at sunset with two tower cranes',
         city='Minneapolis, MN', sector='Mixed-use', size='194,000 sf', delivery='Design-build', status='Complete', year='2025',
         text='Two stacked volumes on a shared podium, with transfer girders carrying the upper block over a column-free event hall.'),
    dict(name='Lakeshore Exchange', img='skyline', alt='Tall glass tower catching late sun above a line of mid-rise buildings',
         city='Cleveland, OH', sector='Commercial office', size='318,000 sf', delivery='CM at risk', status='Complete', year='2025',
         text='A 46-story office tower anchoring a waterfront district, with a tuned mass damper and a curtain wall engineered for lake-effect wind.'),
]

INDEX = [
    ('Kinzie Yard', 'Chicago, IL', 'mixed', 'Mixed-use', 286000, 2026, 'In progress'),
    ('Northline Tower', 'Denver, CO', 'commercial', 'Commercial', 612000, 2027, 'In progress'),
    ('Plainfield Battery Assembly', 'Plainfield, IL', 'industrial', 'Industrial', 610000, 2026, 'In progress'),
    ('Quad Cities Data Hall 2', 'Davenport, IA', 'critical', 'Critical', 96000, 2026, 'In progress'),
    ('Arden Works', 'Minneapolis, MN', 'mixed', 'Mixed-use', 194000, 2025, 'Complete'),
    ('Lakeshore Exchange', 'Cleveland, OH', 'commercial', 'Commercial', 318000, 2025, 'Complete'),
    ('Joliet Cold Storage', 'Joliet, IL', 'logistics', 'Logistics', 380000, 2025, 'Complete'),
    ('Kane County Switchgear Building', 'Elburn, IL', 'critical', 'Critical', 24000, 2025, 'Complete'),
    ('Elk Grove Fulfillment Center', 'Elk Grove Village, IL', 'logistics', 'Logistics', 1040000, 2024, 'Complete'),
    ('Rockford Precision Machining', 'Rockford, IL', 'industrial', 'Industrial', 168000, 2024, 'Complete'),
    ('Calumet Fabrication Plant', 'Hammond, IN', 'industrial', 'Industrial', 455000, 2023, 'Complete'),
    ('Fox River Distribution', 'Aurora, IL', 'logistics', 'Logistics', 720000, 2023, 'Complete'),
    ('Union Hill Lofts and Retail', 'Kansas City, MO', 'mixed', 'Mixed-use', 142000, 2023, 'Complete'),
    ('Wabash Medical Office', 'Chicago, IL', 'commercial', 'Commercial', 88000, 2022, 'Complete'),
]

SECTORS = [
    ('Industrial + manufacturing', 186, 'Process plants, fabrication shops and assembly lines with cranes, pits and heavy floors.'),
    ('Distribution + logistics', 142, 'Cross-dock, cold storage and fulfillment, from 200,000 to over a million square feet.'),
    ('Commercial office', 118, 'Towers, mid-rise and suburban office, new and retrofit.'),
    ('Retail + hospitality', 79, 'Anchors, power centers and select-service hotels.'),
    ('Mixed-use', 74, 'Office, residential and retail stacked on shared podiums and transfer structures.'),
    ('Data + critical facilities', 41, 'Data halls, switchgear buildings and redundant power and cooling plants.'),
]

SERVICE_BLOCKS = [
    ('Architecture', 'A-series', 'sketch', 'Architect sketching a building section with a scale ruler',
     'We design the building around the operation inside it: truck courts, clear heights, process lines and people. Then we test every plan against how it will go together.',
     ['Site and massing studies', 'Building envelope', 'Code and life safety', 'Interior architecture', 'Tenant improvements', 'Permit documents']),
    ('Structural', 'S-series', 'steel-connection', 'Bolted steel moment connection seen through glass',
     'Long spans, heavy floors, crane rails and future mezzanines. We size structure for the building you need on opening day and the one you will want in ten years.',
     ['Steel and concrete framing', 'Tilt-up and precast', 'Foundations', 'Wind and seismic', 'Crane and equipment support', 'Existing-building assessment']),
    ('MEP', 'M / E / P', 'schematic', 'Engineer marking up an electrical single-line diagram',
     'Process cooling, redundant power and compressed air are part of the building from the start. Our MEP engineers sit next to the structural team from the first sketch.',
     ['HVAC and process cooling', 'Power and generators', 'Lighting and controls', 'Plumbing and fire protection', 'Energy modeling', 'Commissioning support']),
    ('Design-build', 'DB', 'plant', 'Engineer in a hard hat walking a process floor',
     'One contract, one schedule and one team accountable for both. We bring the trades in early, price as we draw and keep our engineers on site through closeout.',
     ['Single-contract delivery', 'Cost estimating', 'Schedule planning', 'Trade coordination', 'Construction administration', 'Closeout and as-builts']),
]

TEAM = [
    ('Owen Kessler', 'PE, SE', 'Principal, Structural', 'team-structural'),
    ('Maren Holt', 'AIA, NCARB', 'Principal, Architecture', 'team-architecture'),
    ('Luis Ferreira', 'PE, LEED AP', 'Principal, MEP', 'team-mep'),
    ('Thomas Brandt', 'DBIA', 'Director, Design-Build', 'team-designbuild'),
]

ROLES = [
    ('Structural Engineer II', 'Structural', 'Chicago', 'Full-time',
     'Design steel and concrete framing for industrial and logistics buildings, from schematic design through construction administration. PE preferred; EIT with three or more years considered.'),
    ('Senior Mechanical Engineer', 'MEP', 'Chicago', 'Full-time',
     'Lead HVAC and process-cooling design for manufacturing and critical facilities, and mentor two junior engineers. PE and eight or more years required.'),
    ('Electrical Designer', 'MEP', 'Chicago, hybrid', 'Full-time',
     'Lay out power distribution, lighting and controls in Revit, working directly with the engineer of record. Three or more years in building electrical design.'),
    ('Project Architect', 'Architecture', 'Denver', 'Full-time',
     'Run the architectural scope on commercial and mixed-use projects and coordinate the drawing set with our structural and MEP teams. Licensed architect, six or more years.'),
    ('BIM Coordinator', 'Design-build', 'Chicago', 'Full-time',
     'Keep the federated model clean, run clash detection weekly and get trade models into it before they become field problems.'),
    ('Construction Administrator', 'Design-build', 'Denver', 'Full-time',
     'Handle submittals, RFIs and site observation on active projects, with an engineer from the design team on every site visit.'),
]

PERKS = [
    ('Licensure covered', 'PE, SE and ARE exam fees, prep courses and paid study days.'),
    ('Site time from year one', 'Every engineer walks their own projects, starting with the first one.'),
    ('A mentor in your discipline', 'Paired with a licensed principal from your own discipline.'),
    ('Hybrid by project', 'In the office when the drawings need a table, at home when they don\'t.'),
    ('6% retirement match', 'Fully vested from your first day.'),
    ('Summer Fridays', 'Half days from Memorial Day to Labor Day.'),
]


def st(status):
    return f'<span class="st{" live" if status == "In progress" else ""}">{status}</span>'


def cube():
    return ('<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="rgba(196,210,224,.36)" stroke-width="1">'
            '<path d="M50 14 L84 32 L84 70 L50 88 L16 70 L16 32 Z"/><path d="M16 32 L50 50 L84 32 M50 50 L50 88"/>'
            '<path d="M50 14 L50 50" stroke-dasharray="3 4" stroke="rgba(196,210,224,.2)"/></g></svg>')


# ---------------------------------------------------------------- pages

def page_home(r):
    cols = ''.join(f'''<div class="xcol{' is-on' if i == 0 else ''}" tabindex="0">
      {img(r, im, alt)}<span class="xh" aria-hidden="true"></span>
      <div class="xcol__in">
        <div class="xcol__top"><span class="m cap">{code}</span><span class="m">{i+1:02d} / 04</span></div>
        <div class="xcol__body"><h3 class="up">{n}</h3><p>{d}</p></div>
      </div>
    </div>''' for i, (n, code, im, alt, d) in enumerate(DISCIPLINES))
    steps = ''.join(f'''<div class="step rv"><div class="row m"><span>{i+1:02d}</span><span class="cap">Step</span></div>
      <div class="iso" data-iso="{i+1}" aria-label="{alt}"></div><h3 class="up">{n}</h3><p>{d}</p></div>''' for i, (n, d, alt) in enumerate(STEPS))
    slides = ''.join(f'''<a class="slide" href="{link(r, 'projects', '#' + p['img'])}">
      <div class="slide__img">{img(r, p['img'], p['alt'], eager=True)}<span class="tag tl">{st(p['status'])}</span><span class="tag br">{p['size']}</span></div>
      <div class="slide__cap"><span class="m">[{i+1:02d}]</span><h3 class="up">{p['name']}</h3><span class="m mute meta">{p['city']} &middot; {p['sector']} &middot; {p['year']}</span></div>
    </a>''' for i, p in enumerate(FEATURED))
    return hero(r, 'hero-street', 'Downtown street canyon with tower cranes over buildings under construction',
                'Architecture and<br>engineering for<br>commercial and<br>industrial building',
                'Design and engineering of commercial and industrial buildings of any size, from site plan to certificate of occupancy.',
                ('Discuss a project', link(r, 'contact'), False), 'Qubik', ['Architecture +', 'Engineering'], short=False) + f'''
<section class="sec">
  <div class="wrap">
    <div class="bento">
      <div class="cell b-head dots">
        <span class="tick rv">Four disciplines, one roof</span>
        <h2 class="say rv">Structure, systems and skin. <span class="dim">Engineered as one.</span></h2>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap">
          <p class="small rv">Architecture, structural, MEP and design-build in one firm, on one model, with one set of drawings.</p>
          <a class="bx bx--dark rv" href="{link(r, 'services')}">Our services</a>
        </div>
      </div>
      <div class="cell b-side">
        <a class="b-cta amb" href="{link(r, 'contact')}"><span class="t">Start a project</span><span class="lb" aria-hidden="true"></span></a>
        <div class="b-facts drk">
          <div class="fact"><b><i></i>22+</b><span>Years in practice</span></div>
          <div class="fact"><b><i></i>640+</b><span>Buildings delivered</span></div>
          <p class="small">Chicago and Denver offices, working across 14 states.</p>
        </div>
      </div>
      <div class="cell b-img">{img(r, 'blocks', 'Stacked rectangular tower volumes clad in vertical fins against a teal sky')}<span class="xh" aria-hidden="true"></span><span class="tag tr">Every building starts as a block</span></div>
      <div class="bar">
        <div><b>18.4M<sup>[sf]</sup></b><span class="tick">Square feet engineered</span></div>
        <div><b>04<sup>[in house]</sup></b><span class="tick">Disciplines</span></div>
        <div><b>23<sup>[active]</sup></b><span class="tick">Projects on site</span></div>
        <a class="amb" href="{link(r, 'projects')}"><span class="t">See the work</span><span class="lb" aria-hidden="true"></span></a>
      </div>
    </div>
  </div>
</section>
''' + stmt('More about QUBIK',
           'Most buildings are designed by one firm and engineered by three. <span class="dim">We do it at one table.</span>',
           'The people who calculate the building also draw it, and they stay with it until the certificate of occupancy is on the wall.',
           [('86', 'people', 'Engineers and architects'), ('02', 'offices', 'Chicago and Denver'),
            ('01', 'model', 'Per project, shared by every discipline'), ('00', 'hand-offs', 'From first sketch to closeout')],
           f'<a class="bx bx--amb" href="{link(r, "about")}">About the firm</a>') + f'''
<section class="sec" style="padding-bottom:0">
  <div class="wrap"><div class="shead"><h2 class="up t-l rv">Disciplines</h2><span class="count rv">( 04 )</span></div></div>
  <div class="xcols">{cols}</div>
</section>

<section class="sec panel-sec dots">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">From block<br>to building</h2><span class="tick rv">How a project moves</span></div>
    <div class="proc">{steps}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">Selected work</h2>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="rail-nav"><button type="button" data-rail="-1" aria-label="Previous project">&larr;</button><button type="button" data-rail="1" aria-label="Next project">&rarr;</button></div><a class="bx bx--amb" href="{link(r, 'projects')}">All projects</a></div>
    </div>
    <div class="rail">{slides}</div>
  </div>
</section>
'''


def page_services(r):
    cards = ''.join(f'''<article class="dcard">
      <div class="dcard__img">{img(r, im, alt)}<span class="xh" aria-hidden="true"></span><span class="tag">{code}</span></div>
      <div class="dcard__body">
        <div class="row"><h3 class="up t-m">{n}</h3><span class="m mute">{i+1:02d} / 04</span></div>
        <p>{lead}</p>
        <ul class="caps">{''.join(f'<li>{c}</li>' for c in caps)}</ul>
      </div>
    </article>''' for i, (n, code, im, alt, lead, caps) in enumerate(SERVICE_BLOCKS))
    rows = ''.join(f'''<div class="srow rv"><span class="m">{i+1:02d}</span><h3 class="up">{n}</h3><p>{d}</p><span class="cnt">{c}<sup>[bldg]</sup></span></div>'''
                   for i, (n, c, d) in enumerate(SECTORS))
    return hero(r, 'cranes', 'Four tower cranes crossing against a teal sky',
                'Four disciplines,<br>one drawing set',
                'Architecture, structural, MEP and design-build under one roof, on one model, for commercial and industrial buildings.',
                ('See disciplines', '#disciplines', True), 'Services', ['Architecture', '+ Engineering']) + stmt(
        'How we staff a project',
        'Most clients come to us for one discipline. <span class="dim">They stay for all four.</span>',
        'Coordination is where schedules are won or lost. When the architect, the structural engineer and the MEP engineer share a room and a model, the drawings agree before they reach the field.',
        [('04', 'disciplines', 'In house, on every project'), ('06', 'sectors', 'Commercial and industrial'),
         ('640', 'bldg', 'Delivered since 2004'), ('01', 'set', 'Coordinated drawing set')]) + f'''
<section class="sec" id="disciplines" style="padding-top:0">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">Disciplines</h2><span class="count rv">( 04 )</span></div>
    <div class="dgrid">{cards}</div>
  </div>
</section>

<section class="sec panel-sec dots">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">Where we work</h2><span class="tick rv">Buildings delivered by sector</span></div>
    <div class="slist">{rows}</div>
  </div>
</section>
'''


def page_projects(r):
    cards = ''.join(f'''<article class="pcard rv" id="{p['img']}">
      {img(r, p['img'], p['alt'])}<span class="xh" aria-hidden="true"></span>
      <div class="pcard__in">
        <div class="pcard__top"><span class="tag" style="position:static">{st(p['status'])}</span><span class="m">[{i+1:02d}]</span></div>
        <div class="pcard__body">
          <h2 class="up t-m">{p['name']}</h2>
          <p>{p['text']}</p>
          <dl class="specs">
            <div><dt>Location</dt><dd>{p['city']}</dd></div>
            <div><dt>Sector</dt><dd>{p['sector']}</dd></div>
            <div><dt>Size</dt><dd>{p['size']}</dd></div>
            <div><dt>Delivery</dt><dd>{p['delivery']}</dd></div>
          </dl>
        </div>
      </div>
    </article>''' for i, p in enumerate(FEATURED))
    counts = {}
    for row in INDEX:
        counts[row[2]] = counts.get(row[2], 0) + 1
    labels = [('all', 'All'), ('industrial', 'Industrial'), ('logistics', 'Logistics'), ('commercial', 'Commercial'),
              ('mixed', 'Mixed-use'), ('critical', 'Critical')]
    filters = ''.join(
        f'<button class="bx filter" type="button" data-filter="{k}" data-n="{len(INDEX) if k == "all" else counts.get(k, 0):02d}" aria-pressed="{"true" if k == "all" else "false"}">{l}</button>'
        for k, l in labels)
    trs = ''.join(f'''<tr data-sector="{s}"><td>{n}</td><td>{c}</td><td>{sl}</td><td class="num">{sz:,}</td><td class="num">{y}</td><td>{st(stt)}</td></tr>'''
                  for n, c, s, sl, sz, y, stt in INDEX)
    return hero(r, 'night-wide', 'Building frame lit at night beside a rail line',
                'Built,<br>not rendered',
                'Selected work across the Midwest and the Mountain West, every project engineered in house.',
                ('Project index', '#index', True), 'Projects', ['Selected work', '2022 to 2027']) + f'''
<section class="sec">
  <div class="wrap">
    <div class="bento">
      <div class="bar" style="border-top:0">
        <div><b>640+<sup>[bldg]</sup></b><span class="tick">Buildings delivered</span></div>
        <div><b>23<sup>[active]</sup></b><span class="tick">On site right now</span></div>
        <div><b>14<sup>[states]</sup></b><span class="tick">Where we have built</span></div>
        <a class="amb" href="{link(r, 'contact')}"><span class="t">Start a project</span><span class="lb" aria-hidden="true"></span></a>
      </div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">Featured</h2><span class="count rv">( 04 )</span></div>
    <div class="pgrid">{cards}</div>
  </div>
</section>

<section class="sec panel-sec dots" id="index">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">Project index</h2><div class="filters" role="group" aria-label="Filter by sector">{filters}</div></div>
    <div class="table-wrap">
      <table class="ptable">
        <thead><tr><th>Project</th><th>Location</th><th>Sector</th><th class="num">Size (sf)</th><th class="num">Year</th><th>Status</th></tr></thead>
        <tbody>{trs}</tbody>
      </table>
    </div>
  </div>
</section>
'''


def page_about(r):
    team = ''.join(f'''<div class="mem rv"><div class="mem__ph">{img(r, ph, n + ', ' + role)}</div>
      <div class="mem__b"><h3 class="up">{n}</h3><span class="m mute">{cred}</span><span class="m">{role}</span></div></div>''' for n, cred, role, ph in TEAM)
    return hero(r, 'lightbox', 'Two designers marking up floor plans on a light table',
                'Engineers<br>first',
                'An architecture and engineering firm of 86 people in Chicago and Denver. We engineer every building we design.',
                ('Leadership', '#team', True), 'About', ['Est. 2004', 'Chicago + Denver']) + stmt(
        'Where we started',
        'We started in 2004 as four engineers tired of fixing drawings other people made.',
        'Twenty-two years and 640 buildings later, the rule hasn\'t changed. The people who calculate the building also draw it, and they stay with it through construction.',
        [('22', 'yrs', 'In practice'), ('86', 'people', 'Engineers and architects'),
         ('640', 'bldg', 'Delivered across 14 states'), ('02', 'offices', 'Chicago and Denver')]) + f'''
<div class="wide-shot rv">{img(r, 'plant', 'Engineer in a hard hat reviewing a process floor with a tablet')}<span class="xh" aria-hidden="true"></span><span class="tag bl">Calumet Fabrication Plant, Hammond, IN</span><span class="tag tr">Site walk, week 38</span></div>

<section class="sec panel-sec dots">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">How we work</h2><span class="tick rv">Three rules</span></div>
    <div class="tri">
      <div class="rv"><div class="big">1<sup>[room]</sup></div><h3 class="up t-s">One table</h3><p>Architects and engineers start every project together, in the same room, on the same model. Nobody inherits a drawing they didn't help make.</p></div>
      <div class="rv"><div class="big">1<sup>[model]</sup></div><h3 class="up t-s">Draw it once</h3><p>Structure, systems and skin live in one model from schematic design on, so clashes get resolved on screen instead of on site.</p></div>
      <div class="rv"><div class="big">0<sup>[hand-offs]</sup></div><h3 class="up t-s">Stay on site</h3><p>The engineer who sized the beam is the one who walks the job. Questions get answered by the person who knows the answer.</p></div>
    </div>
  </div>
</section>

<section class="sec" id="team">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">Leadership</h2><a class="bx bx--amb rv" href="{link(r, 'careers')}">Join the team</a></div>
    <div class="team">{team}</div>
  </div>
</section>
'''


def page_careers(r):
    perks = ''.join(f'<div class="perk rv"><span class="tick">{i+1:02d}</span><h3 class="up">{a}</h3><p>{b}</p></div>' for i, (a, b) in enumerate(PERKS))
    roles = ''.join(f'''<details class="role">
      <summary><span class="m mute">{i+1:02d}</span><h3 class="up">{t}</h3><span class="m hide-s">{d}</span><span class="m hide-s">{loc} &middot; {ty}</span><span class="pm" aria-hidden="true"></span></summary>
      <div class="role__body"><span></span><p>{desc}</p><div class="ap"><span class="m mute cap">To apply</span><span class="m">Send a resume and two drawing sets you worked on to</span><span style="color:var(--white);user-select:all">{CAREERS}</span></div></div>
    </details>''' for i, (t, d, loc, ty, desc) in enumerate(ROLES))
    return hero(r, 'review', 'Two engineers in hard hats reviewing a drawing pinned to a wall',
                'Build the<br>hard part',
                'Engineers and architects who want to see their drawings stand up. Site time in year one and a licensed mentor in your discipline.',
                ('Open roles', '#roles', True), 'Careers', [f'{len(ROLES)} open roles', 'Chicago + Denver']) + f'''
<section class="sec">
  <div class="wrap">
    <div class="bento">
      <div class="cell b-head dots">
        <span class="tick rv">Why engineers join</span>
        <h2 class="say rv">Your name on the stamp. <span class="dim">From your first project.</span></h2>
        <p class="small rv">Most junior engineers spend years checking someone else's work. Here you own a scope on your first project, walk it during construction and sit for your license with the firm behind you.</p>
      </div>
      <div class="cell b-side">
        <a class="b-cta amb" href="#roles"><span class="t">See open roles</span><span class="lb" aria-hidden="true"></span></a>
        <div class="b-facts drk">
          <div class="fact"><b><i></i>Year one</b><span>On site, on your own project</span></div>
          <div class="fact"><b><i></i>PE / SE / ARE</b><span>Exam fees and study days covered</span></div>
          <p class="small">Offices in Chicago and Denver.</p>
        </div>
      </div>
      <div class="cell b-img">{img(r, 'facade', 'Office tower facade with bands of warm light')}<span class="xh" aria-hidden="true"></span><span class="tag tr">Chicago studio, Fulton Market</span></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">What you get</h2><span class="count rv">( 06 )</span></div>
    <div class="perks">{perks}</div>
  </div>
</section>

<section class="sec" id="roles" style="padding-top:0">
  <div class="wrap">
    <div class="shead"><h2 class="up t-l rv">Open roles</h2><span class="count rv">( {len(ROLES):02d} )</span></div>
    <div class="roles">{roles}</div>
  </div>
</section>
'''


def page_contact(r):
    return hero(r, 'blocks', 'Stacked rectangular tower volumes against a teal sky',
                'Bring us<br>the block',
                'Tell us about the site, the program and the schedule. An engineer will call you within one business day.',
                ('Project form', '#form', True), 'Contact', ['Chicago', 'Denver']) + f'''
<section class="sec" id="form">
  <div class="wrap">
    <div class="cbento">
      <form class="cform dots" novalidate>
        <div class="head"><span class="tick">Project details</span><h2 class="say">Tell us what you are building.</h2></div>
        <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="f-type">Project type</label><select id="f-type" name="type"><option>New building</option><option>Expansion</option><option>Renovation or tenant improvement</option><option>Existing-building assessment</option></select></div>
        <div class="field"><label for="f-sector">Sector</label><select id="f-sector" name="sector"><option>Industrial and manufacturing</option><option>Distribution and logistics</option><option>Commercial office</option><option>Retail and hospitality</option><option>Mixed-use</option><option>Data and critical facilities</option></select></div>
        <div class="field"><label for="f-size">Approximate size (sf)</label><input id="f-size" name="size" inputmode="numeric" placeholder="250,000"></div>
        <div class="field"><label for="f-start">Target start</label><select id="f-start" name="start"><option>Within 6 months</option><option>6 to 12 months</option><option>12 months or more</option><option>Not sure yet</option></select></div>
        <div class="field field--full"><label for="f-msg">About the project</label><textarea id="f-msg" name="message" placeholder="Site, program, schedule, and which disciplines you need."></textarea></div>
        <div class="send"><button class="bx bx--dark" type="submit">Send project details</button></div>
        <p class="done" role="status" hidden></p>
      </form>
      <div class="cside">
        <div class="b-cta amb"><span class="t">{PHONE}</span><span class="lb" aria-hidden="true"></span></div>
        <dl>
          <div><dt>Email</dt><dd style="user-select:all">{EMAIL}</dd></div>
          <div><dt>Chicago</dt><dd>Fulton Market</dd></div>
          <div><dt>Denver</dt><dd>River North Art District</dd></div>
          <div><dt>Hours</dt><dd>Mon to Fri, 7:30 to 5:30 CT</dd></div>
          <div><dt>Response</dt><dd>Within one business day</dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>
'''


def page_404(r):
    return hero(r, 'hero-street', 'Downtown street canyon with tower cranes',
                'Off the<br>grid',
                'This page is not in the drawing set. It may have moved, or the link may be wrong.',
                ('Back to the home page', link(r, ''), False), '404', ['Page not', 'found'])


DESCS = {
    '': 'QUBIK is an architecture and engineering firm in Chicago and Denver designing commercial and industrial buildings. Architecture, structural, MEP and design-build under one roof.',
    'services': 'Architecture, structural engineering, MEP engineering and design-build for industrial, logistics, commercial and mixed-use buildings.',
    'projects': 'Selected QUBIK projects and a full index of industrial, logistics, commercial, mixed-use and critical-facility work.',
    'about': 'QUBIK has engineered 640 buildings since 2004. One team draws and calculates every building, and stays with it through construction.',
    'careers': 'Open engineering and architecture roles at QUBIK in Chicago and Denver. Site time from year one and a licensed mentor in your discipline.',
    'contact': 'Start a project with QUBIK. An engineer will call you back within one business day.',
}

BUILD = [('', '', page_home), ('services', 'Services', page_services), ('projects', 'Projects', page_projects),
         ('about', 'About', page_about), ('careers', 'Careers', page_careers), ('contact', 'Contact', page_contact)]


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


for slug, title, fn in BUILD:
    root = '' if slug == '' else '../'
    doc = head(root, title, DESCS[slug]) + header(root, slug) + fn(root) + footer(root, cta=slug != 'contact')
    write(os.path.join(OUT, slug, 'index.html') if slug else os.path.join(OUT, 'index.html'), doc)

nf = head('/', 'Page not found', 'Page not found.') + header('/', '404') + page_404('/') + footer('/', cta=False)
if PREVIEW:
    nf = nf.replace('="/', '="')
write(os.path.join(OUT, '404.html'), nf)
print('built', OUT)
