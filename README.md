# ilexicon.com

Static marketing site for iLexicon, live at https://ilexicon.com since 16 October 2026. Astro 7
(`output: 'static'`, `build.format: 'file'`), Tailwind 4, self-hosted fonts, no client framework.
Hosted on HostGator cPanel shared hosting (Apache), deployed over SSH.

## Develop

```
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview    # serves dist/
npm run check      # astro check (types)
```

## Deploy

`npm run deploy:prod` backs up the live site and syncs `dist/` to it. How to update, check, roll
back, and what to know about the server: [DEPLOY.md](DEPLOY.md).

## Where things live

- `src/content/site.ts` — name, office, phone, emails, founding year, © entity, contact form endpoint, privacy-link flag.
- `src/content/jobs.ts` — the standing positions on `/careers`. An empty array shows "No open positions" and hides the Home hiring strip.
- `src/content/services.ts` — the four services (Home cards and `/services` sections).
- `src/styles/tokens.css` — design tokens, including `--logo-orange`. Edit values here only.
- `src/layouts/Base.astro` — HTML shell: meta, canonical, Open Graph, skip link, Nav, Footer, scripts.
- `src/components/` — one file per component. `Logo.astro` draws the nav/footer logo inline; `public/logo.svg` is a copy for structured data.
- `src/scripts/` — the only client JS: `reveal.ts` (scroll reveal, nav rule, side index), `nav.ts` (mobile sheet), `contact.ts` (form validation and submit).
- `public/contact.php` — the contact form handler: validates and emails ideas@ilexicon.com from noreply@ilexicon.com.
- `public/.htaccess` — Apache config: HTTPS and www → apex, old-site 301s, clean URLs, the 404 page, caching and security headers.
- `scripts/deploy.sh` — the deploy script behind `deploy:preview` and `deploy:prod`.
- `handoff/` — the original design package and spec (`SPEC-v3.md`). Copy, layout and tokens still follow it; its hosting (Cloudflare/Azure) and form (Formspree) sections were superseded by HostGator and `contact.php`.

## Quality gates

- Lighthouse mobile at launch: 96–100 performance, 100 accessibility, 100 best practices, 100 SEO on every indexable page (the 404 is `noindex` by design).
- Shipped JS: about 1.7 KB inline per page, 3.4 KB on `/contact`. No external requests.
- Grep `dist/` for the banned strings in `handoff/README.md` before a release; keep it clean.
