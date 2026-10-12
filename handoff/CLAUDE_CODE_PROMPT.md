Build the ilexicon.com website in this folder.

Read these first, fully, before writing any code:
1. handoff/SPEC-v3.md — the authoritative spec. All copy is final; use it verbatim. Tokens are in Appendix A, the logo SVG in Appendix B, the favicon in Appendix C, the six job records in §7.
2. handoff/README.md — package notes, banned strings, and the Azure deployment changes.
3. handoff/design/iLexicon Website.dc.html — the interactive design reference. Open it in a browser (it needs support.js alongside it) and click through all six pages so you know what the result should look like. Where it disagrees with the spec, the spec wins.

Stack: Astro 5 (`output: 'static'`), Tailwind 4 with tokens via `@theme` in `src/styles/tokens.css`, self-hosted fonts via @fontsource, no client framework, Formspree for the form. Repo layout is in spec §10.

Deployment target is Azure Static Web Apps, not Cloudflare Pages:
- Copy handoff/azure/staticwebapp.config.json to public/staticwebapp.config.json. Do not create public/_redirects.
- Copy handoff/azure/azure-static-web-apps.yml to .github/workflows/.
- Do not add any analytics script.

Follow the build order in spec §10 exactly, one step at a time. After each step: make sure `npm run dev` runs with no console errors, show me what to check in the browser, then commit with a clear message and stop so I can review before the next step.

Constraints to enforce throughout:
- One h1 per page, semantic landmarks, skip link, visible focus rings, 4.5:1 contrast.
- JS shipped to the browser under 30 KB total.
- Before step 7, grep dist/ for every banned string in handoff/README.md and fix any hit.
- Never invent clients, metrics, testimonials, or locations.

Start with step 1.
