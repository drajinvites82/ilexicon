# ilexicon.com

Static marketing site for iLexicon. Astro 7 (`output: 'static'`), Tailwind 4, self-hosted fonts, no client framework. The authoritative spec is `handoff/SPEC-v3.md`.

## Develop

```
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview
npm run check      # astro check (types)
```

## Where things live

- `src/content/site.ts` — name, office, phone, emails, contact form endpoint, © entity, privacy-link flag. One-line edits before launch.
- `src/content/jobs.ts` — the standing positions on `/careers` (step 4).
- `src/styles/tokens.css` — design tokens (spec Appendix A). Edit values here only.
- `src/layouts/Base.astro` — HTML shell: meta, skip link, Nav, Footer, scripts.
- `src/components/` — one file per component listed in spec §10.
- `src/scripts/` — the only client JS: `reveal.ts` (scroll reveal, nav rule, side index) and `nav.ts` (mobile sheet). `contact.ts` is added in step 5.
- `public/contact.php` — the contact form handler: validates and emails ideas@ilexicon.com from noreply@ilexicon.com.
- `public/.htaccess` — Apache config for the cPanel host: HTTPS and www → apex, the 301s from spec §2, clean URLs, the 404 page, caching and security headers.

## Deploy

HostGator cPanel shared hosting (Apache), deployed over SSH from this machine. `npm run deploy:preview` publishes to `https://new.ilexicon.com`; `npm run deploy:prod` backs up and replaces the live site. Step-by-step instructions and the post-launch checks are in [DEPLOY.md](DEPLOY.md).

## Quality gates (checked on the production build)

- Lighthouse mobile: 99–100 performance, 100 accessibility, 100 best practices, 100 SEO on every indexable page (the 404 is `noindex` by design).
- Shipped JS: about 1.7 KB inline per page, 3.1 KB on `/contact`. No external requests; the contact form posts to `/contact.php` on the same server.
- `dist/` is grepped for the banned strings in `handoff/README.md` before every release; keep it clean.
