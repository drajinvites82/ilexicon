# Handoff: ilexicon.com rebuild

## What's in this package

| Path | What it is |
| --- | --- |
| `README.md` | This file: overview, build and deploy instructions |
| `SPEC-v3.md` | The authoritative spec: all copy, tokens, components, site map, redirects, SEO, logo SVG, favicon SVG, `jobs.ts` data |
| `CLAUDE_CODE_PROMPT.md` | Prompt to paste into Claude Code to start the build |
| `design/iLexicon Website.dc.html` + `design/support.js` | Interactive HTML design reference. Open the `.dc.html` in a browser; nav links switch between Home, Services, Careers, About, Contact and 404 |
| `azure/staticwebapp.config.json` | Routing, redirects and headers for Azure Static Web Apps |
| `azure/azure-static-web-apps.yml` | GitHub Actions workflow for Azure Static Web Apps |

## About the design files

The HTML in `design/` is a **design reference**, not production code. It shows intended layout, copy, states and interactions. The job is to **recreate it in Astro** per `SPEC-v3.md` §10, not to ship the HTML.

Where the design file and `SPEC-v3.md` disagree, the spec wins. Known differences in the reference: the wordmark is live text (spec §3.4 requires the outlined SVG logo in Appendix B); `--ink-3` is `#8A9099` (spec: `#6B7079`); the hero visual is a simplified dot grid (spec §3.8 has the exact geometry and labels); the Services side index has no active-state tracking; no scroll-reveal motion.

## Fidelity

**High-fidelity** for copy, structure, states and tone. Colors, type, spacing and components should be taken from `SPEC-v3.md` §3 (tokens in Appendix A), which is more precise than the reference.

## Screens

Six routes: `/`, `/services`, `/careers`, `/about`, `/contact`, `/404`. Section order, copy and layout for each are in spec §5–§8. All copy is final; do not rewrite it.

Key behaviors (spec §4, §8.2):
- Nav: sticky 64px; current link in `--ink`; compact primary **Contact us** → `/contact` on every page. Mobile sheet with focus trap, Esc to close.
- Services: anchors `#ai-automation`, `#development`, `#data-integration`, `#team-augmentation`; sticky side index with `aria-current` on desktop, static card on mobile.
- Careers: cards from `src/content/jobs.ts`; `Apply by email` → `mailto:careers@ilexicon.com?subject=Application: {title}`; dashed-border empty state when the array is empty; Home hiring strip renders only when `jobs.length > 0`.
- Contact form: Formspree POST, honeypot `website`, field errors with icon + text, send error with `role="alert"`, in-place success box with `role="status"` and focus moved to it.
- Motion: fade + 12px rise on first scroll into view, 400ms ease-out; disabled under `prefers-reduced-motion`.

## Banned strings

Grep the built output before shipping. None of these may appear: `Book a call`, `30-minute call`, `boutique`, `body shop`, `Chennai`, `India`, `offshore`, `onshore`, `+91`.

## Open items (Raj supplies)

Formspree form ID · legal entity name for the © line · confirm the Sioux Falls phone · Azure subscription and GitHub repo · review the six positions in `jobs.ts` · Privacy page copy (hide the footer link until it exists).

---

# Building with Claude Code

## Prerequisites

- Node 20+ and npm
- Git, and a GitHub account (repo `ilexicon-site`, private)
- Claude Code: `npm install -g @anthropic-ai/claude-code`
- An Azure subscription (Static Web Apps Free tier is enough)

## Steps

1. Create an empty folder and copy this package into it:
   ```
   mkdir ilexicon-site && cd ilexicon-site
   cp -r /path/to/design_handoff_ilexicon_site ./handoff
   git init
   ```
2. Start Claude Code in the folder:
   ```
   claude
   ```
3. Paste the contents of `CLAUDE_CODE_PROMPT.md` as your first message. It tells Claude Code to read `handoff/SPEC-v3.md` and `handoff/design/`, and to follow the build order in spec §10 one step at a time, committing after each.
4. After each step Claude Code will run `npm run dev`. Open the URL it prints (usually `http://localhost:4321`) and compare against the design reference. Give feedback in plain language; it will fix and re-run.
5. When step 7 (Lighthouse, reduced-motion, keyboard pass) is done, push to GitHub:
   ```
   gh repo create ilexicon-site --private --source=. --push
   ```
   (or create the repo on github.com and `git remote add origin … && git push -u origin main`).

Useful Claude Code prompts during the build:
- "Grep the dist folder for the banned strings in handoff/README.md and fix any hits."
- "Run a Lighthouse audit on mobile and fix anything under 95."
- "Compare /careers to handoff/design and list the differences."

---

# Deploying to Azure

The spec targets Cloudflare Pages. On Azure the equivalent is **Azure Static Web Apps**: free tier, global CDN, free SSL, custom domains, deploy from GitHub. Two files change:

1. **Redirects**: Azure does not read `public/_redirects`. Use `azure/staticwebapp.config.json` instead (copy it to `public/staticwebapp.config.json` in the Astro project; Astro copies `public/` to `dist/` as-is). It contains every 301 from spec §2, the `/404` fallback, and security headers.
2. **Deploy workflow**: `azure/azure-static-web-apps.yml` goes to `.github/workflows/`.

Tell Claude Code: "We're deploying to Azure Static Web Apps instead of Cloudflare Pages. Use handoff/azure/staticwebapp.config.json instead of _redirects, and add handoff/azure/azure-static-web-apps.yml to .github/workflows. Remove the Cloudflare Web Analytics beacon." (Spec §9 allows no other third-party analytics; leave analytics out or use Azure's built-in metrics.)

## Create the Static Web App

Portal route:
1. Azure Portal → Create a resource → **Static Web App**.
2. Subscription, resource group (e.g. `rg-ilexicon-web`), name `ilexicon-site`, plan **Free**, region closest to Sioux Falls (Central US).
3. Deployment source **GitHub** → sign in → pick `ilexicon-site`, branch `main`.
4. Build presets: **Astro**. App location `/`, API location empty, Output location `dist`.
5. Review + create. Azure commits a workflow file to the repo; replace its contents with `azure/azure-static-web-apps.yml` if they differ (keep the secret name Azure generated, or add `AZURE_STATIC_WEB_APPS_API_TOKEN` yourself under repo Settings → Secrets → Actions, value from the Static Web App's **Manage deployment token**).

CLI route (equivalent):
```
az login
az group create -n rg-ilexicon-web -l centralus
az staticwebapp create -n ilexicon-site -g rg-ilexicon-web \
  --source https://github.com/<you>/ilexicon-site --branch main \
  --app-location "/" --output-location "dist" --login-with-github
```

Each push to `main` builds and deploys. Pull requests get their own preview URL.

## Custom domain

1. Static Web App → **Custom domains** → Add → `www.ilexicon.com` → add the CNAME it shows at your registrar (`www` → `<app>.azurestaticapps.net`). Validate.
2. Add the apex `ilexicon.com` → choose **TXT validation**, add the TXT record, then an ALIAS/ANAME record (or move DNS to Azure DNS and use an alias A record). Validate.
3. Set one as default and let the other redirect; the config file already forwards `www` → apex (edit the `www.ilexicon.com` route if you prefer the reverse).
4. Confirm HTTPS is live (automatic certificate), then check every row of the §2 redirect table with `curl -I https://ilexicon.com/aboutus.html` etc.

## Launch day (from spec §11, adapted)

- Final copy review on the Azure preview URL, phone and desktop
- Form test: submit, confirm delivery to ideas@ilexicon.com, confirm honeypot blocks a filled `website` field
- Every redirect checked with `curl -I`
- Search Console: verify, submit `sitemap-index.xml`, request removal of dead old URLs
- Cancel the old hosting once DNS has fully propagated
