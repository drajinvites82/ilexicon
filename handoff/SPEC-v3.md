# ilexicon.com — Website Rebuild Spec v3 (Claude Code handoff)

Oct 11, 2026 · Rajkumar Duraisamy · **Status: final, ready to build.** This spec supersedes v2 (Oct 11) and v1 (Oct 10). The design system, components, tech stack and appendices are carried over from v2 unchanged except where §0 says otherwise.

**Visual reference:** the *ilexicon.com — Website Design* canvas (claude.ai) and the *iLexicon* design system. Where the canvas still shows "Book a call", the Chennai careers header, the India office block, or the About "fit" sections, this document wins.

## 0. What changed from v2

The site's job is now narrower: a credible, modern IT services site with standard pages, a contact form that lands in the founder's inbox, and a Careers page that supports the team-augmentation business. No scheduling, no boutique positioning, no location-led copy.

- **Primary conversion is the contact form.** There is no scheduling link and no "Book a call" / "30-minute call" copy anywhere. The nav CTA is **Contact us** → `/contact`. The CTA band on Home, Services and About points at `/contact`. `site.ts` drops `schedulingUrl`.
- **Careers is generic.** No location in the header, no "How we hire" section, no process steps. It lists six standing IT positions from `jobs.ts` and asks people to apply to careers@ilexicon.com. The `Job` model is simplified (§7).
- **About is rewritten** around a team of specialists, process analysis and automation, and team augmentation. "Who we're a fit for" and the "not the right fit" note are gone.
- **Service 04 is now "Team augmentation & dedicated teams"** (anchor `#team-augmentation`), covering individual contract resources and managed dedicated teams in one section.
- **No location positioning anywhere.** Chennai, India and "two time zones" leave every page. The only address and phone on the site are the US corporate office (Contact and Footer). There is no India office block, no +91 number, and no "Development center" label.
- **Home "Why iLexicon" band** is rewritten; "honest about fit" and "handful of projects a year" are removed. The hiring strip no longer says Chennai.
- **Contact** loses the scheduling button and the "call" framing; the select gains a "Team augmentation" option.
- Components: `ProcessStep` is now used on Home only. Nothing is added; nothing else is removed.

## 1. Brief & constraints

Rebuild ilexicon.com as a five-page static site. It presents iLexicon as an established IT services firm: software development, process automation, data and integration work, and team augmentation for US businesses. The site must read as current and professional to a US business contact or a candidate spending 30 seconds on it before writing in.

- **Audience:** (1) US business owners and IT/ops leads at companies of 20–500 people who need a custom build, an automation project, an integration, or contract resources on their team; (2) IT professionals looking for developer, consultant and specialist roles placed through iLexicon.
- **Primary conversion:** the contact form on `/contact`, which emails ideas@ilexicon.com. Careers conversion: email to careers@ilexicon.com.
- **In scope:** Home, Services, Careers, About, Contact, 404; the logo, favicon and OG image; the contact form, 301 redirects, SEO meta and sitemap; deploy to Cloudflare Pages.
- **Out of scope:** blog, news, team page, client logo wall, testimonials, case studies, application portal or ATS, any CMS, dark mode, per-service subpages, scheduling integrations, animation beyond the reveal (§3.9), and the privacy page (deferred).
- **Non-negotiables:**
  - The brand name is **iLexicon** (lowercase i, capital L).
  - No stock photos and no carousel.
  - No fabricated clients, metrics, testimonials or named past projects.
  - Nowhere on the site: "Book a call", "30-minute call", "boutique", "body shop", "Chennai", "India", "offshore", "onshore", "+91".
  - Lighthouse 95+ ×4 on mobile.
  - Less than 30 KB of JS.

## 2. Site map & redirects

| Page | URL | Nav label |
| --- | --- | --- |
| Home | `/` | (logo) |
| Services | `/services` (anchors `#ai-automation`, `#development`, `#data-integration`, `#team-augmentation`) | Services |
| Careers | `/careers` | Careers |
| About | `/about` | About |
| Contact | `/contact` | Contact |
| 404 | `/404` | — |

**301 redirects** (`public/_redirects`) — unchanged from v2:

```
/index.html          /                              301
/services.html       /services                      301
/analytics.html      /services#data-integration     301
/big.html            /services#data-integration     301
/bp.html             /services#data-integration     301
/digital.html        /services#data-integration     301
/application.html    /services#development          301
/ecommerce.html      /services#development          301
/cms.html            /services#development          301
/iot.html            /services#development          301
/aboutus.html        /about                         301
/contactus.html      /contact                       301
/contactus           /contact                       301
/career.html         /careers                       301
/blog-comment.html   /                              301
```

Any other old path falls through to the 404.

## 3. Design system

Typography-led, light, one accent. It should feel like a confident small consultancy, not a SaaS landing page.

### 3.1 Colour tokens

These are final; Appendix A has the full `tokens.css`.

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--bg` | `#FAFAF7` | Page background, nav, footer | — |
| `--surface` | `#FFFFFF` | Cards, Why band, hiring strip, roles band, form card | — |
| `--ink` | `#121417` | Headings, primary text, logo letters, current nav link, secondary-button border | 17.6:1 on bg |
| `--ink-2` | `#4A4F57` | Body text, ledes, inactive nav links, hero labels | 7.9:1 on bg |
| `--ink-3` | `#6B7079` | Eyebrows, captions, mono labels, dot grid, input borders. Never body text. | 4.76:1 on bg |
| `--line` | `#E6E4DE` | 1px borders and dividers | — |
| `--accent` | `#1F5EFF` | Primary button, links, logo dots and `o`, focus ring, hero nodes, CTA band | 4.89:1 on bg |
| `--accent-ink` | `#FFFFFF` | Text on accent | 5.12:1 on accent |
| `--accent-hover` | `#1A4FD9` | Primary button hover | 6.3:1 with white |

There is one accent and no gradients. Light theme only.

### 3.2 Typography

Self-host the fonts: `@fontsource-variable/instrument-sans`, `@fontsource-variable/inter` and `@fontsource/jetbrains-mono` (weight 400 only), all with `font-display: swap`.

| Style | Face | Desktop | Mobile (<768px) | Weight | Tracking |
| --- | --- | --- | --- | --- | --- |
| h1 | Instrument Sans | 56/64 | 36/40 | 600 | -0.02em |
| h2 | Instrument Sans | 36/44 | 28/36 | 600 | -0.02em |
| h3 | Instrument Sans | 22/28 | 22/28 | 500 | -0.01em |
| numeral | Instrument Sans | 96/96 | 96/96 | 600 | -0.02em |
| lede | Inter | 20/32 | 18/28 | 400 | — |
| body | Inter | 17 / 1.6 | 16 / 1.6 | 400 | — |
| body-strong | Inter | as body | as body | 500 | — |
| h4 (list titles) | Inter | 17/24 | 17/24 | 500 | — |
| button / nav link | Inter | 16/24 | 16/24 | 500 | — |
| small | Inter | 14/20 | 14/20 | 400 | — |
| eyebrow | JetBrains Mono | 12/16 | 12/16 | 400 | 0.08em, uppercase |

Body text has a maximum width of 65ch. Write eyebrow strings in sentence case in the source and let CSS uppercase them.

### 3.3 Spacing & layout

- The base grid is 8px. Tokens: `space-1` 8, `space-2` 16, `space-3` 24, `space-4` 32, `space-6` 48, `space-8` 64, `space-9` 72, `space-14` 112.
- The container has a max width of 1200px, with 24px side padding (16px below 768px). Use one breakpoint, `md` = 768px.
- Desktop grids use 12 columns with a 24px gap.
- Section padding is 112px on desktop and 72px on mobile. When two consecutive sections share a background, the second one drops its top padding.
- Radii: `radius-card` 12px (cards, form card); `radius-pill` 24px (48px buttons) and 20px (the 40px nav button); 8px for inputs and small boxes.
- No shadows anywhere.

### 3.4 Logo

The logo is an outlined SVG (Appendix B); never render it as live text.

- **Colours:** letters in `--ink`. The two i-dots, the three rising dots and the `o` are in `--accent`.
- **Sizes:** 32px tall in the nav, 40px in the footer, 96px on the OG image. Minimum 24px; below that, use the favicon.
- **Variants:**
  - Primary: as above.
  - Reversed: all white, only on `--accent`.
  - Favicon: an accent rounded square with a white `i` (Appendix C).
  - Generate a 180×180 `apple-touch-icon.png` from the favicon.
- **`Logo.astro`:** inline the paths and bind the fills to `var(--ink)` and `var(--accent)`. Wrap it in `<a href="/" aria-label="iLexicon home">` and give the SVG itself `aria-hidden="true"`.
- **Don'ts:** no ™, no orange, no recolouring, and don't redraw the dot arc.

### 3.5 Buttons

| Variant | Spec | Used for |
| --- | --- | --- |
| primary | 48px tall, 0 24px padding, radius 24, `--accent` bg → `--accent-hover`, white 16/500 | Contact us, Send, Go to the home page |
| secondary | same size, transparent, 1px `--ink` border, `--ink` text; hover bg `--surface` | Our services, Apply by email |
| inverse | white bg, `--accent` text | CTA band only |
| compact | 40px tall, 0 16px padding, radius 20 | Nav CTA only (primary styling) |

- **Rule:** at most one primary per section. The nav CTA is exempt and always shown.
- **Focus:** 2px solid `--accent` outline at a 2px offset, switching to white inside the CTA band.
- **Mobile:** page-level buttons go full width and stack, with a 16px gap.

### 3.6 Eyebrow

A mono uppercase label in `--ink-3`, placed 16px above every h2 and every page h1.

### 3.7 Cards

Cards use `--surface`, a 1px `--line` border and `radius-card` 12px. Padding is 32px on desktop and 24px on mobile, with a 16px internal gap. On hover, the border turns `--accent` (service cards only).

### 3.8 Imagery: HeroVisual

There are no photos and no image files. There is one drawn motif, rendered as inline SVG from `HeroVisual.astro` with props for size, pitch, nodes and labels:

- **Dot field:** circles with `r=1` in `--ink-3` on a 32px pitch. Opacity steps down by distance from a focal point: 1 within r₁, 0.55 within r₂, 0.25 beyond. These are discrete per-dot opacities, never a gradient.
- **Trail:** two small accent dots (r 2 and r 3), taken from the logo, lead into the nodes.
- **Nodes:** three filled `--accent` circles that grow in size. Each has a ring at r+8, stroke 1px, `--accent` at 35% opacity. The last node also has a ring at r+22 at 15% opacity.
- **Line:** one 1.5px `--accent` Catmull-Rom curve through the trail and the nodes, with round caps.
- **Labels:** `01 · DEFINE`, `02 · DESIGN`, `03 · DELIVER` in mono 12px (11px on mobile), `--ink-2`, letter-spacing 0.06em. Each sits on a chip: `--surface` fill, 1px `--line` stroke, 24px tall, radius 12, 12px side padding.

Geometry is in viewBox units. Snap the nodes to the dot grid.

| Use | Artboard | Grid origin | Trail (x,y,r) | Nodes (x,y,r) | Focus (x,y,r₁,r₂) |
| --- | --- | --- | --- | --- | --- |
| Home desktop | 488×528 | 24,16 | (56,496,2) (88,464,3) | (152,400,5) (280,304,8) (408,144,13) | 280,288,190,270 |
| Home mobile | 358×264 | 19,24 | (19,248,2) (51,216,3) | (115,184,4) (211,120,6) (307,56,10) | 200,120,130,190 |
| Page-header / 404 motif | 280×184, 24px pitch, no labels | 16,16 | (40,160,1.5) | (88,136,3) (160,88,5) (232,40,8) | 160,88,90,130 |

- **Label offsets from each node:** desktop chips sit at (+20,+34), (+24,+36) and, for the last node, end-anchored at (−36,−36). On mobile they sit at (+14,+30), (+16,+30) and (−24,−18).
- **Placement:** on desktop the hero visual fills the 5/12 column, aligned right. On mobile it sits under the buttons and bleeds to both screen edges.
- **Accessibility:** set `role="img"` with `aria-label="Small dots growing into three connected points: define, design, deliver"`. The motif version is `aria-hidden`.

### 3.9 Motion

On first scroll into view, elements fade in and rise 12px over 400ms with ease-out, using an IntersectionObserver in `scripts/reveal.ts` (about 15 lines).

- The same script adds `.scrolled` to the nav (1px bottom line) and sets the Services side index's `aria-current`.
- Under `prefers-reduced-motion`, show everything at once. Nothing else moves.

### 3.10 Accessibility

- One h1 per page and semantic landmarks.
- A skip link ("Skip to content") as the first focusable element.
- Visible accent focus rings.
- Form labels tied to their inputs, with errors linked through `aria-describedby`.
- Errors are shown with an icon and text, never colour alone.
- Every text pair is at least 4.5:1 (see §3.1). Input borders use `--ink-3`, which is 4.76:1.

## 4. Global components

### 4.1 Nav (all pages)

- **Desktop:** sticky, 64px tall, solid `--bg`. The Logo (32px) sits left; the links Services · Careers · About · Contact (16/500, 32px gap) sit centre-right; the compact primary **Contact us** sits far right and links to `/contact` (same tab). It is shown on every page, including `/contact`.
  - The current page's link is `--ink` with `aria-current="page"`; the others are `--ink-2`, turning `--ink` on hover.
  - After any scroll, the nav gets a 1px `--line` bottom border.
- **Mobile:** Logo, compact Contact us and a 40px hamburger (two 1.5px lines).
  - Opening it shows a full-height sheet below the bar: the links in Instrument Sans 22/28, each with 16px vertical padding and a 1px `--line` divider, then a full-width primary Contact us 24px below.
  - The icon becomes ×. Trap focus while open; Esc closes it; set `aria-expanded`.

### 4.2 Footer (all pages)

A 1px `--line` top rule, then 64px top and 32px bottom padding. Columns are 5/3/4 on desktop and a single column (40px gaps) on mobile. Text uses the `small` style.

- **Col 1:** the Logo (40px), *Ideas to action.* (Instrument Sans 500, 16/24, `--ink`), and *IT services, software delivery and team augmentation for US businesses since 2016.* (max 32ch, `--ink-2`).
- **Col 2:** Services · Careers · About · Contact.
- **Col 3:** one office block with a label (500, `--ink`), address, a `tel:` phone link and an `ideas@ilexicon.com` link (accent, underlined).
  - **Corporate office:** 3916 N Potsdam Ave, Sioux Falls, SD 57104 · +1 609 755 5394
- **Legal row:** 64px below the columns (40px on mobile), above a 1px rule: `© 2026 iLexicon LLC` · Privacy (`/privacy`). The entity name is still to be confirmed.

### 4.3 CTA band (Home, Services, About)

The band is the same on all three pages. It points at the contact form; there is no scheduling link anywhere on the site.

An `--accent` background, centred, with section padding.

- **H2** (white): **Have a project in mind?**
- **Lede** (white, 16px top and 32px bottom margin): Tell us what you’re trying to do. We’ll reply within two business days with an honest read on scope, timing and cost.
- **Button:** inverse **Contact us** → `/contact`.

### 4.4 PageHeader (Services, Careers, About)

- 112px top and 64px bottom padding on desktop; 56px and 48px on mobile.
- Grid 8/4. The left column holds the eyebrow, the h1 (max 16em) and the lede, with 24px gaps. The right column holds the 280×184 motif, bottom-aligned; hide it on mobile.

## 5. Home

Six sections plus the nav and footer. The copy is final.

**5.1 Hero.** Grid 7/5 with a 24px gap, vertically centred, `min-height: 80vh` and 64px vertical padding. On mobile it stacks, with 48px top and 72px bottom padding, and no min-height.

- Eyebrow: `IT services · software · team augmentation · since 2016`
- H1 (max 13.5em): **Software, automation and the people to deliver it.**
- Lede: iLexicon is an IT services firm of senior developers, consultants and specialists. We build and integrate software, automate the processes behind it, and place experienced engineers on your team when you need more hands.
- Buttons, 32px below the lede with a 16px gap: [Contact us] primary → `/contact` · [Our services] secondary → `/services`
- Visual: HeroVisual (desktop / mobile, §3.8). The labels stay `01 · DEFINE`, `02 · DESIGN`, `03 · DELIVER`.

**5.2 Services.** An eyebrow and h2, then 48px (32px on mobile) to a 2×2 grid of service cards (24px gap; one column with a 16px gap on mobile).

- Eyebrow: `What we do`. H2: **Four things, done properly.**
- **Card anatomy:** eyebrow `01`–`04`, h3, body (`--ink-2`), then **Learn more →** (accent, 16/500, underlined on hover). Make the whole card clickable with a stretched link.

| # | Title | Copy | Link |
| --- | --- | --- | --- |
| 01 | AI & workflow automation | Agents, document pipelines and LLM-driven workflows that take real work off your team’s plate — scoped to one process at a time, measured on hours saved. | `/services#ai-automation` |
| 02 | Custom web & application development | Web apps, portals, internal tools and integrations, built on mainstream stacks your own team can maintain after we leave. | `/services#development` |
| 03 | Data, integration & modernization | APIs, migrations, reporting layers and the unglamorous plumbing between the systems you already own. | `/services#data-integration` |
| 04 | Team augmentation & dedicated teams | Experienced developers, consultants and specialists who join your team on contract or as a managed group — scaled up or down as the work changes. | `/services#team-augmentation` |

**5.3 How we work.** No top padding (shares the background with 5.2). Three ProcessSteps in an `<ol>`: 3 columns with a 24px gap, stacking with a 40px gap on mobile.

- Eyebrow: `How we work`. H2: **Define. Design. Deliver.**
- **ProcessStep:** a numeral (`1`/`2`/`3`, 96px, accent at 20% opacity, `aria-hidden`) positioned at top-left, offset −4px. The h3 starts 48px down, overlapping the numeral; the body is 16px below.
  1. **Define** — We start by understanding the process, not the technology. A short discovery ends in a written scope, an estimate and an architecture note.
  2. **Design** — Working prototypes over slide decks. You see the real thing early and often.
  3. **Deliver** — Fixed scope, a monthly team, or people embedded in yours. Weekly demos, a single point of contact, code in your repositories from day one.

**5.4 Why iLexicon.** A full-width `--surface` band with 1px `--line` rules top and bottom, and three columns (64px gap; stacking with a 32px gap on mobile). Each column is a paragraph that opens with a body-strong lead phrase.

- Eyebrow: `Why iLexicon`. H2: **Experience you can put to work.**
- **Senior people.** Developers, consultants and specialists with years of delivery behind them. The person who scopes your project is the person who builds it.
- **Process first.** We analyze how the work actually flows before we automate or rebuild any of it, so the software fits the business and not the other way round.
- **Flexible engagement.** A fixed-scope project, a monthly team, or individual specialists on your payroll’s terms. Scale up when the work grows and down when it doesn’t.

**5.5 Hiring strip.** Render only when `jobs.length > 0`; otherwise output nothing. A `--surface` band with 32px vertical padding and a 1px `--line` bottom border, one row: eyebrow `Careers` · body-strong **We’re hiring.** followed by the first three role titles joined with " · " in `--ink-2`, then " and more" if there are more than three · **See open positions →** (accent) pushed to the far right. On mobile the row stacks.

**5.6 CTA band.** See §4.3.

## 6. Services (`/services`)

PageHeader:

- Eyebrow: `Services`
- H1: **Four service lines. One team.**
- Lede: Everything below is delivered by the same group of senior people — so an automation project can grow into a dedicated team, a build can hand off to maintenance, or a single specialist can turn into a whole squad, without a new vendor conversation.

**Body.** On desktop the grid is 3/9.

- **Left column (SideIndex):** `position: sticky; top: 96px`. An eyebrow `On this page`, then an `<ol>` of four links. Each link has a mono number (`--ink-3`) and a label (15/24, 500, `--ink-2`). The active item gets `aria-current="location"`, an `--ink` label and an accent number.
- **Mobile:** the SideIndex becomes a static `--surface` card under the header, with 1px dividers between items and 24px below it.

**Right column.** Four `<section id>`s (each with `scroll-margin-top: 96px`), separated by 64px of padding, a 1px `--line` rule and 64px of margin (48/48 on mobile). Each section contains: an eyebrow (`01`–`04`); the h2; a paragraph; an h4 list title; a list with 6px accent dot bullets; a closing line above a 1px dashed `--line` rule in the form `<strong>Stack:</strong> …` (or `<strong>Good for:</strong> …` in section 04).

#### `#ai-automation` — AI & workflow automation

Most businesses don’t need an AI strategy. They need one repetitive, document-heavy process to stop eating their team’s week. We map the process first, then build LLM-driven workflows — invoice and email triage, document extraction, approval routing, assistants over your own data — one process at a time, with a human in the loop until the numbers say otherwise.

**Typical engagements**
- Process analysis: where the hours go, what can be automated, and what should stay manual
- Automating an inbox: classify, extract, route and draft replies for a shared mailbox
- Document pipelines: contracts, invoices, forms → structured data → your system of record
- Internal assistants grounded in your SOPs, tickets or knowledge base
- Evaluation and guardrails for an AI feature a vendor already sold you

**Stack:** Anthropic and OpenAI APIs, Python, Node, Postgres, vector search where it earns its place.

#### `#development` — Custom web & application development

Web applications, customer and partner portals, internal tools and the integrations between them. We build on mainstream stacks deliberately, so your own team — or any competent vendor — can take the code over later. No proprietary frameworks, no lock-in.

**Typical engagements**
- A customer or vendor portal replacing email-and-spreadsheet workflows
- Internal operations tools: dashboards, approvals, scheduling, inventory
- Modernizing a legacy PHP, .NET or jQuery application without a big-bang rewrite
- Mobile-responsive front ends over existing back ends

**Stack:** React, Next.js, Node, Python/Django, .NET, Postgres, MySQL; AWS and Azure.

#### `#data-integration` — Data, integration & modernization

The unglamorous work that makes everything else possible: getting systems to talk to each other, moving data out of places it shouldn’t be, and building the reporting layer people actually open.

**Typical engagements**
- REST and webhook integrations between CRM, ERP, accounting and line-of-business systems
- Data migrations with reconciliation reports, not just “it ran”
- Reporting and dashboards (Power BI, Metabase, custom) over a cleaned-up data model
- E-commerce platform integrations: orders, inventory, fulfilment, payments

**Stack:** SQL, Python, dbt, Airflow or cron where cron is enough, Power BI, Metabase.

#### `#team-augmentation` — Team augmentation & dedicated teams

When the work is clear but the people aren’t there, we supply them. Individual developers, consultants and specialists who join your team on contract — on-site, hybrid or remote — or a named, managed group working as an extension of your team on a monthly engagement. You interview the people; we handle the sourcing, the contracts and the continuity.

**How it works**
- You define the role or the team; we propose named people and you interview them
- Monthly billing per person, with notice terms you can live with
- A single iLexicon lead owns communication, priorities and quality
- Your tools, your repositories, your standards

**Good for:** filling a specific skill gap (SAP, database, cloud, data, QA), sustained product work, maintenance of systems we or others built, and backlogs that never make it to the top of an in-house team’s list.

The page ends with the CTA band (§4.3).

## 7. Careers (`/careers`)

The page is deliberately plain: a header, a grid of standing positions, and one way to apply. No location in the header, no hiring-process section, no form, no ATS.

PageHeader:

- Eyebrow: `Careers`
- H1: **Work with iLexicon.**
- Lede: We hire developers, consultants and specialists for our own projects and for client engagements — full-time and contract, on-site and remote. The positions below are the ones we hire for most often. To apply, email careers@ilexicon.com with the role title in the subject and your CV attached.

**Open positions.** A `--surface` band with no top padding (it follows the header directly). Eyebrow `Positions`, H2 **Open positions**, then a 2-column grid of JobCards (one column on mobile, 24px gap). Under the grid, 32px down, one `small` line in `--ink-2`: *Don’t see your role? We also hire for adjacent skills. Send a CV to careers@ilexicon.com and tell us what you do.*

**JobCard** (card styling per §3.7, rendered from `src/content/jobs.ts`):

- the title as h3;
- a meta line in eyebrow style: `{location} · {type} · {experience}`;
- the skills joined with ", " in `--ink`;
- the summary in `--ink-2`, at most two sentences;
- a **secondary** button **Apply by email** → `mailto:careers@ilexicon.com?subject=Application: {title}` (URL-encoded).
- Cards never name a client, a client's industry, or a city.

**Empty state** (when `jobs` is empty): the same card, with a dashed `--line` border.

- H3: **No open positions right now.**
- Text: We hire throughout the year. Send a CV to careers@ilexicon.com with the kind of work you want to do, and we’ll reach out when something fits.

**Bottom line.** No CTA band. End with a plain section (72px padding) holding one lede in `--ink`: Looking to add people to your team rather than join one? [See Team augmentation.](/services#team-augmentation)

**`jobs.ts`** — simplified from v2. No `engagement` field (every role may be either), no `postedOn` (these are standing positions, not dated postings; a date would go stale and read as a dead listing).

```ts
export type Job = {
  id: string;                          // slug
  title: string;
  location: string;                    // "United States · on-site or remote"
  type: 'Full-time' | 'Contract' | 'Contract-to-hire';
  experience: string;                  // "5+ years"
  skills: string[];
  summary: string;                     // ≤ 2 sentences, no client, no city
};

export const jobs: Job[] = [
  {
    id: 'full-stack-developer',
    title: 'Full-Stack Developer',
    location: 'United States · on-site or remote',
    type: 'Contract',
    experience: '4+ years',
    skills: ['React', 'Node or .NET', 'REST APIs', 'SQL', 'Git'],
    summary: 'Builds and maintains web applications and internal tools on mainstream stacks. Comfortable owning a feature end to end, from database to UI.',
  },
  {
    id: 'sap-consultant',
    title: 'SAP Consultant',
    location: 'United States · on-site or remote',
    type: 'Contract',
    experience: '6+ years',
    skills: ['SAP S/4HANA', 'FI/CO or MM/SD', 'ABAP exposure', 'Integration', 'Requirements gathering'],
    summary: 'Functional consultant for implementation, rollout and support engagements. Works with business stakeholders to configure, test and document SAP processes.',
  },
  {
    id: 'database-architect',
    title: 'Database Architect',
    location: 'United States · on-site or remote',
    type: 'Contract-to-hire',
    experience: '8+ years',
    skills: ['SQL Server or PostgreSQL', 'Data modeling', 'Performance tuning', 'Migrations', 'Azure or AWS'],
    summary: 'Designs and tunes relational databases for line-of-business and reporting workloads. Leads schema design, migrations and performance work.',
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    location: 'United States · remote',
    type: 'Contract',
    experience: '5+ years',
    skills: ['AWS or Azure', 'Terraform', 'CI/CD', 'Docker', 'Monitoring'],
    summary: 'Owns infrastructure, pipelines and environments for application teams. Automates deployments and keeps production boring.',
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    location: 'United States · on-site or remote',
    type: 'Contract',
    experience: '4+ years',
    skills: ['Python', 'SQL', 'dbt or Airflow', 'Power BI', 'Data warehousing'],
    summary: 'Builds pipelines, data models and reporting layers over operational systems. Turns scattered data into dashboards people open.',
  },
  {
    id: 'qa-automation-engineer',
    title: 'QA Automation Engineer',
    location: 'United States · remote',
    type: 'Contract',
    experience: '3+ years',
    skills: ['Playwright or Selenium', 'API testing', 'Test planning', 'CI integration', 'JavaScript or Python'],
    summary: 'Designs and automates test coverage for web applications and integrations. Works alongside developers from the first sprint, not after it.',
  },
];
```

Raj can edit titles, skills and experience in this file before launch; the page needs no other change.

## 8. About & Contact

### 8.1 About (`/about`)

PageHeader:

- Eyebrow: `About`
- H1: **A team of specialists, ten years in.**
- Lede: iLexicon was founded in 2016 to deliver software and IT projects for US businesses with senior people, clear scope and no layers between you and the engineers doing the work.

**Body.** A single column (max 65ch, left-aligned in the container, no top padding) with three sections, 72px apart (56px on mobile). Each section has an eyebrow (`01`/`02`/`03`), an h2 and its content.

**01 · Who we are**

We’re a team of IT development engineers, consultants and specialists — developers, SAP and ERP consultants, database and cloud architects, data and QA engineers — who have spent years delivering for businesses in e-commerce, professional services, distribution, publishing and corporate back-office operations.

We are process experts first. Before we automate or rebuild anything, we analyze how the work actually flows, where the hours and errors go, and what the business needs the system to do. Then we build the smallest thing that fixes it.

**02 · What we do for you**

A list with accent dot bullets, each item opening with a body-strong lead:

- **Analyze and improve your process.** We map the workflow, find the repetitive and error-prone steps, and recommend what to automate, what to integrate and what to leave alone.
- **Build and integrate software.** Custom web applications, portals, internal tools, data pipelines and the integrations between the systems you already own.
- **Automate with AI where it earns its place.** Document pipelines, inbox triage, approval routing and assistants over your own data — one process at a time, measured on hours saved.
- **Augment your team.** Strong, experienced resources — individual specialists or a managed group — who join your team on contract and work to your standards, your tools and your priorities.

**03 · How an engagement runs**

A numbered list: each row is a 40px column holding the numeral (Instrument Sans 22/28, 600, accent) beside a body paragraph that opens with a body-strong lead, separated by 1px `--line` rules.

1. **Tell us what you need.** Send a note through the contact page. We reply within two business days with questions and an honest first read.
2. **Discovery.** A short engagement — usually one to two weeks — ending in a written scope, an estimate with assumptions spelled out, and an architecture note you can take elsewhere. For team augmentation, this is where we agree roles and propose named people.
3. **Delivery.** Fixed scope, monthly team, or people embedded in yours. Weekly demos or reporting, one point of contact, your repositories and tools from the first day.
4. **After.** Maintenance on a light retainer, an ongoing team, or a clean handover to your own people. All three are normal.

The page ends with the CTA band (§4.3). There is no "Who we're a fit for" section and no "not the right fit" note.

### 8.2 Contact (`/contact`)

The page is the form. No scheduling link, no "call" framing.

- **Desktop:** grid 6/5 with a 64px gap, and 112px section padding.
- **Mobile:** the columns stack — form first, then the left column — with 56px top and 72px bottom padding and a 48px gap. (Form first on mobile because it is the conversion; on desktop the left column keeps the header.)

**Left column** (24px gaps):

- Eyebrow `Contact`
- H1: **Tell us what you need.**
- Lede: Whether it’s a project, a process you want automated, or people you need on your team, send a note. It goes straight to the founder’s inbox and gets a reply within two business days.
- A `small` line in `--ink-2`: *Looking for a role? See [Careers](/careers) or email careers@ilexicon.com.*
- **Office block:** a 1px rule with 32px above, an eyebrow `Office`, then one block: the label `Corporate office`; the address 3916 N Potsdam Ave, Sioux Falls, SD 57104; the phone +1 609 755 5394 as a `tel:` link; `ideas@ilexicon.com`. No country eyebrow, no second column.

**Right column: ContactForm card.** A `--surface` card with 40px padding (24px on mobile), 24px gaps, and the title **Send a note** as an h2 set in h3 style.

| Field | Element | Required | Notes |
| --- | --- | --- | --- |
| Name | `input[type=text]` autocomplete=name | yes | |
| Work email | `input[type=email]` autocomplete=email | yes | Client-side format check only |
| Company | `input[type=text]` autocomplete=organization | no | The label shows "(optional)" in `--ink-2` |
| What are you looking for? | `select` | yes | Placeholder option "Choose one" (disabled); then AI & automation · Custom development · Data & integration · Team augmentation · Not sure yet |
| Tell us a little about it | `textarea` rows=4, min-height 128px | yes | Placeholder: "What’s the problem, roughly what size, and when does it need to be done?" |
| website | hidden honeypot | — | Positioned off-screen, `tabindex=-1`, `aria-hidden`; must be empty |

- **Field styling:** the label sits above the input (15/24, 500, `--ink`) with an 8px gap. Inputs have a `--bg` fill, a 1px `--ink-3` border, radius 8, 12px/16px padding and 16/24 text. The select has a 16px chevron positioned 16px from the right. Focus adds a 2px accent outline.
- **Submit:** a primary **Send** button (full width on mobile).
- **Note** (small, `--ink-2`): We don’t share your details with anyone and don’t add you to a list.
- **Field error:** a 2px `--ink` border, plus a message under the field (14/20, 500, `--ink`) with a 20px round "!" icon, linked with `aria-describedby` and with `aria-invalid` set. Email error copy: **Enter a full email address, like name@company.com.** For the other required fields: **This field is required.**
- **Send error:** the same message style under the button, with `role="alert"`: **Something went wrong sending your note. Your message is still here — please try again.** Keep all the form data.
- **Success:** replace the form body in place (keep the title) with a `--bg` box (1px `--line`, radius 8, 24px padding) holding a 12px accent dot and **Thanks — we’ll reply within two business days.** Give it `role="status"` and move focus to it.
- **Handling:** `fetch` POST to Formspree with the honeypot; Formspree emails the submission to `ideas@ilexicon.com`, with the select value as the subject prefix (`_subject` field: `iLexicon enquiry: {selection}`). No reCAPTCHA, no backend. Formspree's free tier (50 submissions/month) is enough for this site; Web3Forms is the fallback if it isn't.

### 8.3 404 (`/404`)

- Grid 8/4. The right column holds the motif (hidden on mobile).
- Padding is 112px top and 160px bottom (56/72 on mobile).
- The nav shows no current link.

- Eyebrow: `404 · Page not found`
- H1: **This page didn’t make the move.**
- Lede: We rebuilt ilexicon.com in 2026 and retired a lot of old pages. What you were looking for is most likely on one of these:
- **Link list** (max 640px wide, 1px `--line` rules): each row is a 120px label (17/24, 500, `--ink`), a description (`--ink-2`) and an accent → on the right. The label turns accent on hover. On mobile the description wraps under the label.
  - **Services** — What we do and how we work → `/services`
  - **Careers** — Open positions → `/careers`
  - **About** — Who we are and how we work → `/about`
  - **Contact** — Send us a note → `/contact`
- Button, 8px below the list: [Go to the home page] primary → `/`
- **Meta:** title `Page not found — iLexicon`, plus `<meta name="robots" content="noindex">`.

## 9. SEO & meta

| Page | Title | Description |
| --- | --- | --- |
| Home | iLexicon — Software, automation & team augmentation | IT services firm since 2016. Custom development, AI and workflow automation, data integration, and experienced developers and consultants to augment your team. |
| Services | Services — iLexicon | AI & workflow automation, custom web and application development, data integration, and team augmentation for US businesses. |
| Careers | Careers — iLexicon | Developer, SAP, database, cloud, data and QA positions with iLexicon and our clients. Full-time and contract. Apply by email. |
| About | About — iLexicon | A team of senior developers, consultants and specialists. Process experts first: we analyze, automate, build and augment. Since 2016. |
| Contact | Contact — iLexicon | Send a note about a project, a process to automate, or people you need on your team. Reply within two business days. |
| 404 | Page not found — iLexicon | (none; noindex) |

- **OG image:** 1200×630 static PNG with a `--bg` background, the Logo at 96px tall placed bottom-left at 80px insets, *Ideas to action.* below it in `--ink-2` at 28px, and the motif from §3.8 enlarged to about 480px wide in the top-right. Set `og:type` to website and `twitter:card` to `summary_large_image`.
- **JSON-LD:** one `Organization` block on Home with name, url, email `ideas@ilexicon.com`, telephone `+1 609 755 5394`, one `address` (Sioux Falls, SD) and `foundingDate` 2016. No ratings. Do not add `JobPosting` schema for the careers cards — they are standing positions, and Google requires dates and a validity window for job schema.
- **Other:** sitemap via `@astrojs/sitemap` (exclude `/404`), `robots.txt`, and Cloudflare Web Analytics only.
- The old TCS-derived description must not survive anywhere.

## 10. Tech stack, repo & build order

Astro 5 (`output: 'static'`), Tailwind 4 (tokens via `@theme` in `src/styles/tokens.css`, Appendix A), no client framework, Formspree, and Cloudflare Pages from `main`. JS shipped must stay under 30 KB: the reveal script, the nav sheet toggle and the form submit only.

```
ilexicon-site/
  public/
    _redirects  favicon.svg  apple-touch-icon.png  og.png  site.webmanifest  robots.txt
  src/
    styles/tokens.css                # Appendix A
    layouts/Base.astro               # html shell, meta, skip link, Nav, Footer, reveal script
    components/
      Logo.astro  Nav.astro  Footer.astro  Button.astro  Eyebrow.astro
      PageHeader.astro  HeroVisual.astro  ServiceCard.astro  ProcessStep.astro
      HiringStrip.astro  CtaBand.astro  SideIndex.astro  ServiceSection.astro
      JobCard.astro  ContactForm.astro  OfficeBlock.astro  NotFoundLinks.astro
    content/
      services.ts  jobs.ts  site.ts   # site.ts: name, office (US), phone, emails (ideas@, careers@), formspreeId
    pages/
      index.astro  services.astro  careers.astro  about.astro  contact.astro  404.astro
    scripts/reveal.ts  scripts/nav.ts  scripts/contact.ts
  astro.config.mjs  package.json  README.md
```

**Build order.** Each step ends with `npm run dev` running and a commit.

1. Scaffold Astro and Tailwind; add `tokens.css`, the fonts, `site.ts`, `Logo.astro` (Appendix B), the favicon, and `Base.astro` with Nav and Footer. Connect Cloudflare Pages and confirm the preview URL.
2. Build Home with all sections, including `HeroVisual.astro` (§3.8 table). Check the hiring strip with `jobs` empty and with the six roles in §7.
3. Build Services, with the SideIndex and anchors.
4. Build Careers, with JobCard, the six roles from §7 and the empty state.
5. Build About, Contact (Formspree test endpoint; default, error and success states; honeypot) and 404.
6. Add meta, the OG image, JSON-LD, the sitemap, `robots.txt` and `_redirects`.
7. Do a Lighthouse pass (mobile, at least 95 on all four categories), a reduced-motion check and a keyboard-only pass of the nav sheet and the form.

**Definition of done:**

- Every route renders on the preview URL.
- The form delivers to `ideas@ilexicon.com`.
- Every old URL in §2 redirects.
- Lighthouse scores at least 95 on all four categories on mobile.
- No console errors.
- JS under 30 KB.
- No external requests except Formspree on submit and the Cloudflare beacon.


## 11. Open items (Raj supplies)

- [ ] Formspree form ID, pointed at ideas@ilexicon.com (and confirm careers@ilexicon.com is a live mailbox)
- [ ] Legal entity name for the © line
- [ ] Whether the Sioux Falls phone number still rings
- [ ] GitHub repo, Cloudflare account and registrar login
- [ ] Review the six positions in §7 — edit titles, skills or experience in `jobs.ts`, or trim the list
- [ ] Privacy page copy (deferred). Until it exists, hide the footer Privacy link.

Removed from the list: scheduling URL (no longer used); first open roles (now supplied in §7).

## 12. Decisions log

Decisions 1–14 from 11 Oct (v2) stand. Added in v3:

| # | Decision | Why |
| --- | --- | --- |
| 15 | No scheduling link. The contact form is the only conversion; nav CTA is **Contact us**. | Raj, 11 Oct. Also removes one external dependency and one open item. |
| 16 | Careers is location-free and process-free: six standing positions, apply by email. | Supports the team-augmentation business; a dated "How we hire" would be wrong for roles placed with clients. |
| 17 | Positions are standing, not dated: no `postedOn`, no `JobPosting` schema. | A listing with a stale date reads as dead; a listing with no date reads as "we hire for this". |
| 18 | Service 04 is "Team augmentation & dedicated teams" (`#team-augmentation`). | One section covers individual contract resources and managed teams; the site makes no location claims. |
| 19 | About has no "fit" / "not a fit" copy. | Raj, 11 Oct. The site's job is to look like a current, capable IT services firm, not to screen clients. |
| 20 | Only the US corporate office appears on the site (Contact and Footer). No India address, phone or label anywhere. | Raj, 11 Oct. The site makes no location claims. |
| 21 | "Book a call", "30-minute call", "boutique", "body shop", "Chennai", "India", "offshore", "onshore" and "+91" are banned strings; check with `grep` before the Lighthouse pass. | Easy to miss one in a component. |

## Appendix A — `src/styles/tokens.css`

```css
/* iLexicon tokens — mirrors the design system's tokens.json. Edit values here only. */
@import "tailwindcss";
@import "@fontsource-variable/instrument-sans";
@import "@fontsource-variable/inter";
@import "@fontsource/jetbrains-mono/400.css";

:root {
  --bg: #FAFAF7;
  --surface: #FFFFFF;
  --ink: #121417;
  --ink-2: #4A4F57;
  --ink-3: #6B7079;
  --line: #E6E4DE;
  --accent: #1F5EFF;
  --accent-ink: #FFFFFF;
  --accent-hover: #1A4FD9;
}

@theme {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-line: var(--line);
  --color-accent: var(--accent);
  --color-accent-ink: var(--accent-ink);
  --color-accent-hover: var(--accent-hover);

  --font-display: "Instrument Sans Variable", system-ui, sans-serif;
  --font-body: "Inter Variable", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --breakpoint-md: 48rem;           /* 768px — the only breakpoint */
  --container-site: 1200px;

  --radius-card: 12px;
  --radius-pill: 24px;
  --radius-pill-compact: 20px;
  --radius-input: 8px;

  /* spacing uses Tailwind's 4px scale; stay on 8px multiples: 2,4,6,8,12,16,18,28 → 8,16,24,32,48,64,72,112 */
}

html { background: var(--bg); color: var(--ink-2); font: 400 17px/1.6 var(--font-body); -webkit-font-smoothing: antialiased; }
@media (max-width: 767.98px) { html { font-size: 16px; } }

.h1 { font: 600 56px/64px var(--font-display); letter-spacing: -0.02em; color: var(--ink); }
.h2 { font: 600 36px/44px var(--font-display); letter-spacing: -0.02em; color: var(--ink); }
.h3 { font: 500 22px/28px var(--font-display); letter-spacing: -0.01em; color: var(--ink); }
.lede { font-size: 20px; line-height: 32px; color: var(--ink-2); max-width: 65ch; }
.eyebrow { font: 400 12px/16px var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); }
.small { font-size: 14px; line-height: 20px; }
@media (max-width: 767.98px) {
  .h1 { font-size: 36px; line-height: 40px; }
  .h2 { font-size: 28px; line-height: 36px; }
  .lede { font-size: 18px; line-height: 28px; }
}

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* reveal (scripts/reveal.ts adds .is-in) */
[data-reveal] { opacity: 0; transform: translateY(12px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
[data-reveal].is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { [data-reveal] { opacity: 1; transform: none; transition: none; } }
```

## Appendix B — Logo (`src/components/Logo.astro`)

Outlined from Instrument Sans 600 with −0.02em tracking and kerning. This is the exact geometry used in the design system frames; keep the paths as they are.

```astro
---
interface Props { height?: number; class?: string }
const { height = 32, class: cls = '' } = Astro.props;
---
<svg class={cls} viewBox="-20.0 -1050.7 3928.0 1080.7" height={height} width={Math.round(height * 3.6347)} aria-hidden="true" focusable="false">
  <path fill="var(--ink)" d="M67 0V-510H193V0Z M302.0 0V-720H432.0V-103H786.0V0Z M1105.0 10Q1024.0 10 963.5 -24.0Q903.0 -58 869.5 -118.0Q836.0 -178 836.0 -256.0Q836.0 -334 869.5 -393.5Q903.0 -453 963.0 -486.5Q1023.0 -520 1103.0 -520Q1179.0 -520 1235.0 -488.5Q1291.0 -457 1322.0 -400.0Q1353.0 -343 1353.0 -267Q1353.0 -253 1352.0 -241.0Q1351.0 -229 1349.0 -217H964.0Q971.0 -162 1000.0 -129Q1037.0 -85 1106.0 -85Q1146.0 -85 1176.0 -100.0Q1206.0 -115 1220.0 -146H1339.0Q1314.0 -74 1254.5 -32.0Q1195.0 10 1105.0 10Z M966.0 -305H1225.0Q1220.0 -359 1193.0 -389Q1160.0 -425 1101.0 -425Q1037.0 -425 1000.0 -381Q975.0 -352 966.0 -305Z M1777.0 0 1655.0 -178 1526.0 0H1387.0L1592.0 -265L1408.0 -510H1551.0L1661.0 -350L1773.0 -510H1913.0L1724.0 -262L1920.0 0Z M1994.0 0V-510H2120.0V0Z M2455.0 10Q2378.0 10 2319.5 -24.0Q2261.0 -58 2227.5 -118.5Q2194.0 -179 2194.0 -256Q2194.0 -333 2227.5 -392.5Q2261.0 -452 2319.5 -486.0Q2378.0 -520 2455.0 -520Q2518.0 -520 2569.0 -496.5Q2620.0 -473 2653.0 -430.5Q2686.0 -388 2695.0 -332H2574.0Q2563.0 -373 2532.0 -396.0Q2501.0 -419 2457.0 -419Q2416.0 -419 2386.5 -399.0Q2357.0 -379 2341.0 -342.0Q2325.0 -305 2325.0 -256Q2325.0 -206 2341.0 -169.0Q2357.0 -132 2387.0 -111.5Q2417.0 -91 2457.0 -91Q2501.0 -91 2532.0 -114.0Q2563.0 -137 2574.0 -178H2695.0Q2686.0 -122 2652.5 -79.5Q2619.0 -37 2568.5 -13.5Q2518.0 10 2455.0 10Z M3343.0 0V-510H3466.0V-416Q3491.0 -459 3532.0 -487Q3582.0 -520 3652.0 -520Q3735.0 -520 3781.5 -473.0Q3828.0 -426 3828.0 -348V0H3701.0V-322Q3701.0 -369 3677.0 -393.0Q3653.0 -417 3607.0 -417Q3567.0 -417 3535.5 -399.0Q3504.0 -381 3486.5 -349.0Q3469.0 -317 3469.0 -275V0Z"/>
  <path fill="var(--accent)" d="M2998.0 10Q2917.0 10 2855.5 -24.0Q2794.0 -58 2760.0 -118.5Q2726.0 -179 2726.0 -257Q2726.0 -335 2760.0 -394.0Q2794.0 -453 2855.5 -486.5Q2917.0 -520 2998.0 -520Q3080.0 -520 3141.0 -486.5Q3202.0 -453 3236.0 -394.0Q3270.0 -335 3270.0 -257Q3270.0 -179 3235.5 -118.5Q3201.0 -58 3140.0 -24.0Q3079.0 10 2998.0 10Z M2998.0 -91Q3038.0 -91 3070.0 -111.5Q3102.0 -132 3120.0 -169.5Q3138.0 -207 3138.0 -258Q3138.0 -333 3098.5 -376.0Q3059.0 -419 2998.0 -419Q2937.0 -419 2897.0 -376.0Q2857.0 -333 2857.0 -258Q2857.0 -207 2875.5 -169.5Q2894.0 -132 2925.5 -111.5Q2957.0 -91 2998.0 -91Z"/>
  <g fill="var(--accent)"><circle cx="129.5" cy="-663.5" r="68.5"/><circle cx="2056.5" cy="-663.5" r="68.5"/><circle cx="2245.8" cy="-913.6" r="68.5"/><circle cx="2559.1" cy="-934.8" r="95.9"/><circle cx="3008.9" cy="-766.6" r="140.4"/></g>
</svg>
```

The standalone file `public/logo.svg` (primary colours, for the OG image and email signatures):

```svg
<svg xmlns="http://www.w3.org/2000/svg" class="" viewBox="-20.0 -1050.7 3928.0 1080.7" role="img" aria-label="iLexicon"><title>iLexicon</title><path fill="#121417" d="M67 0V-510H193V0Z M302.0 0V-720H432.0V-103H786.0V0Z M1105.0 10Q1024.0 10 963.5 -24.0Q903.0 -58 869.5 -118.0Q836.0 -178 836.0 -256.0Q836.0 -334 869.5 -393.5Q903.0 -453 963.0 -486.5Q1023.0 -520 1103.0 -520Q1179.0 -520 1235.0 -488.5Q1291.0 -457 1322.0 -400.0Q1353.0 -343 1353.0 -267Q1353.0 -253 1352.0 -241.0Q1351.0 -229 1349.0 -217H964.0Q971.0 -162 1000.0 -129Q1037.0 -85 1106.0 -85Q1146.0 -85 1176.0 -100.0Q1206.0 -115 1220.0 -146H1339.0Q1314.0 -74 1254.5 -32.0Q1195.0 10 1105.0 10Z M966.0 -305H1225.0Q1220.0 -359 1193.0 -389Q1160.0 -425 1101.0 -425Q1037.0 -425 1000.0 -381Q975.0 -352 966.0 -305Z M1777.0 0 1655.0 -178 1526.0 0H1387.0L1592.0 -265L1408.0 -510H1551.0L1661.0 -350L1773.0 -510H1913.0L1724.0 -262L1920.0 0Z M1994.0 0V-510H2120.0V0Z M2455.0 10Q2378.0 10 2319.5 -24.0Q2261.0 -58 2227.5 -118.5Q2194.0 -179 2194.0 -256Q2194.0 -333 2227.5 -392.5Q2261.0 -452 2319.5 -486.0Q2378.0 -520 2455.0 -520Q2518.0 -520 2569.0 -496.5Q2620.0 -473 2653.0 -430.5Q2686.0 -388 2695.0 -332H2574.0Q2563.0 -373 2532.0 -396.0Q2501.0 -419 2457.0 -419Q2416.0 -419 2386.5 -399.0Q2357.0 -379 2341.0 -342.0Q2325.0 -305 2325.0 -256Q2325.0 -206 2341.0 -169.0Q2357.0 -132 2387.0 -111.5Q2417.0 -91 2457.0 -91Q2501.0 -91 2532.0 -114.0Q2563.0 -137 2574.0 -178H2695.0Q2686.0 -122 2652.5 -79.5Q2619.0 -37 2568.5 -13.5Q2518.0 10 2455.0 10Z M3343.0 0V-510H3466.0V-416Q3491.0 -459 3532.0 -487Q3582.0 -520 3652.0 -520Q3735.0 -520 3781.5 -473.0Q3828.0 -426 3828.0 -348V0H3701.0V-322Q3701.0 -369 3677.0 -393.0Q3653.0 -417 3607.0 -417Q3567.0 -417 3535.5 -399.0Q3504.0 -381 3486.5 -349.0Q3469.0 -317 3469.0 -275V0Z"/><path fill="#1f5eff" d="M2998.0 10Q2917.0 10 2855.5 -24.0Q2794.0 -58 2760.0 -118.5Q2726.0 -179 2726.0 -257Q2726.0 -335 2760.0 -394.0Q2794.0 -453 2855.5 -486.5Q2917.0 -520 2998.0 -520Q3080.0 -520 3141.0 -486.5Q3202.0 -453 3236.0 -394.0Q3270.0 -335 3270.0 -257Q3270.0 -179 3235.5 -118.5Q3201.0 -58 3140.0 -24.0Q3079.0 10 2998.0 10Z M2998.0 -91Q3038.0 -91 3070.0 -111.5Q3102.0 -132 3120.0 -169.5Q3138.0 -207 3138.0 -258Q3138.0 -333 3098.5 -376.0Q3059.0 -419 2998.0 -419Q2937.0 -419 2897.0 -376.0Q2857.0 -333 2857.0 -258Q2857.0 -207 2875.5 -169.5Q2894.0 -132 2925.5 -111.5Q2957.0 -91 2998.0 -91Z"/><g fill="#1f5eff"><circle cx="129.5" cy="-663.5" r="68.5"/><circle cx="2056.5" cy="-663.5" r="68.5"/><circle cx="2245.8" cy="-913.6" r="68.5"/><circle cx="2559.1" cy="-934.8" r="95.9"/><circle cx="3008.9" cy="-766.6" r="140.4"/></g></svg>
```

## Appendix C — `public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>iLexicon</title><rect width="48" height="48" rx="12" fill="#1f5eff"/><circle cx="24" cy="13" r="4.5" fill="#fff"/><rect x="20" y="20" width="8" height="18" rx="1" fill="#fff"/></svg>
```
