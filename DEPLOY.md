# Deploying ilexicon.com to Azure Static Web Apps

The site builds to `dist/` with `npm run build`. Every push to `main` runs
`.github/workflows/azure-static-web-apps.yml`, which builds on Node 22 and uploads `dist/`
to Azure Static Web Apps (SWA). Pull requests against `main` get their own preview URL.

## 0. Before you deploy

Two one-line edits in `src/content/site.ts`:

| Field | Now | Set to |
| --- | --- | --- |
| `formspreeId` | `FORMSPREE_ID` | the ID from your Formspree form (the part after `https://formspree.io/f/`), with the form pointed at ideas@ilexicon.com |
| `legalEntity` | `iLexicon LLC` | the confirmed legal entity for the © line |

Optional: review the six positions in `src/content/jobs.ts`. Set the array to `[]` to show the
"No open positions" state and hide the Home hiring strip.

## 1. Get the code onto `main`

The build was committed on the branch `claude/ilexicon-website-build-k1zsb5` in
`drajinvites82/ilexicon`. Make that `main` either way:

- **GitHub UI:** open a pull request from that branch into `main` and merge it, or, if the repo
  has no `main` yet, go to Settings → Branches and set this branch as the default, then rename it
  to `main`.
- **Locally:**
  ```
  git clone https://github.com/drajinvites82/ilexicon.git && cd ilexicon
  git checkout claude/ilexicon-website-build-k1zsb5
  git checkout -B main
  git push -u origin main
  ```

## 2. Create the Static Web App

**Portal**

1. Azure Portal → Create a resource → **Static Web App** → Create.
2. Basics: your subscription; resource group **rg-ilexicon-web** (new); name **ilexicon-site**;
   plan type **Free**; region **Central US**.
3. Deployment details: source **Other**. (This keeps the workflow already in the repo. If you
   choose GitHub instead, Azure commits a second workflow file and a secret with a random suffix;
   delete that file and keep ours, or rename its secret to match.)
4. Review + create → Create.
5. Open the resource → **Overview** → copy the URL (`https://<random-name>.azurestaticapps.net`).
   This is the preview URL.
6. **Overview** → **Manage deployment token** → copy the token.

**CLI (equivalent)**

```
az login
az group create -n rg-ilexicon-web -l centralus
az staticwebapp create -n ilexicon-site -g rg-ilexicon-web -l centralus --sku Free
az staticwebapp show -n ilexicon-site -g rg-ilexicon-web --query defaultHostname -o tsv
az staticwebapp secrets list -n ilexicon-site -g rg-ilexicon-web --query properties.apiKey -o tsv
```

The last two commands print the preview hostname and the deployment token.

## 3. Add the deployment token to GitHub

GitHub → `drajinvites82/ilexicon` → **Settings** → **Secrets and variables** → **Actions** →
**New repository secret**:

- Name: `AZURE_STATIC_WEB_APPS_API_TOKEN` (exactly; the workflow reads this name)
- Secret: the deployment token from step 2

Then push to `main` (or re-run the workflow under **Actions**). The first run takes two to three
minutes. When it is green, the preview URL serves the site.

## 4. Post-deploy checklist

Set `H` to the preview URL first, and run the same list again against `https://ilexicon.com`
after DNS moves.

```
H=https://<random-name>.azurestaticapps.net
```

**Pages render**

```
for p in / /services /careers /about /contact; do curl -s -o /dev/null -w "%{http_code}  $p\n" "$H$p"; done
```
Expect `200` for all five.

**Every row of the spec §2 redirect table** (expect `HTTP/2 301` and the `location` shown)

```
curl -sI "$H/index.html"        | grep -iE '^(HTTP|location)'   # location: /
curl -sI "$H/services.html"     | grep -iE '^(HTTP|location)'   # location: /services
curl -sI "$H/analytics.html"    | grep -iE '^(HTTP|location)'   # location: /services#data-integration
curl -sI "$H/big.html"          | grep -iE '^(HTTP|location)'   # location: /services#data-integration
curl -sI "$H/bp.html"           | grep -iE '^(HTTP|location)'   # location: /services#data-integration
curl -sI "$H/digital.html"      | grep -iE '^(HTTP|location)'   # location: /services#data-integration
curl -sI "$H/application.html"  | grep -iE '^(HTTP|location)'   # location: /services#development
curl -sI "$H/ecommerce.html"    | grep -iE '^(HTTP|location)'   # location: /services#development
curl -sI "$H/cms.html"          | grep -iE '^(HTTP|location)'   # location: /services#development
curl -sI "$H/iot.html"          | grep -iE '^(HTTP|location)'   # location: /services#development
curl -sI "$H/aboutus.html"      | grep -iE '^(HTTP|location)'   # location: /about
curl -sI "$H/contactus.html"    | grep -iE '^(HTTP|location)'   # location: /contact
curl -sI "$H/contactus"         | grep -iE '^(HTTP|location)'   # location: /contact
curl -sI "$H/career.html"       | grep -iE '^(HTTP|location)'   # location: /careers
curl -sI "$H/blog-comment.html" | grep -iE '^(HTTP|location)'   # location: /
```

**Fallbacks and headers**

```
curl -sI "$H/anything-old.html" | grep -iE '^HTTP'               # 404, and the body is the branded 404 page
curl -s  "$H/anything-old.html" | grep -c "didn’t make the move" # 1
curl -sI "$H/404"               | grep -iE '^HTTP'               # 404
curl -sI "$H/services/"         | grep -iE '^(HTTP|location)'    # 301 → /services (trailingSlash: never)
curl -sI "$H/"                  | grep -iE 'x-frame-options|x-content-type|referrer-policy|permissions-policy'
curl -sI "$H/site.webmanifest"  | grep -i content-type           # application/manifest+json
curl -s  "$H/sitemap-index.xml" && curl -s "$H/robots.txt"
```

**Form test** (after `formspreeId` is set and deployed)

1. Open `$H/contact`. Submit the empty form: four errors appear and focus lands on Name.
2. Type `name@company` as the email and submit: only the email error shows.
3. Fill everything in and send: the "Thanks" box replaces the form and the note arrives at
   ideas@ilexicon.com with the subject `iLexicon enquiry: <your selection>`. The first
   submission to a new Formspree form asks you to confirm the destination email once.
4. Honeypot: open DevTools → Console, run
   `document.getElementById('cf-website').value = 'x'`, fill the form and send. The success
   box shows but the Network tab shows no request to formspree.io, and nothing arrives.
5. Reload, fill the form, and in DevTools → Network set "Offline", then send: the alert
   "Something went wrong sending your note…" appears and the fields keep their values.

**Share preview**

Paste `$H/` into a social preview debugger (LinkedIn Post Inspector or opengraph.xyz) and
confirm the 1200×630 image, title and description.

## 5. Custom domain: www.ilexicon.com and the apex

In the Static Web App → **Custom domains**.

1. **Add** → *Custom domain on other DNS* → `www.ilexicon.com` → **CNAME** validation. At the
   registrar add `CNAME  www  →  <random-name>.azurestaticapps.net`. Click Validate; it can
   take a few minutes after DNS propagates.
2. **Add** → `ilexicon.com` (the apex) → **TXT** validation. Add the TXT record Azure shows
   (`@` → the value given). Validate. Then point the apex at the app:
   - If the registrar supports ALIAS / ANAME records: `ALIAS  @  →  <random-name>.azurestaticapps.net`.
   - Otherwise move the zone to **Azure DNS** and add an alias **A** record for `@` targeting
     the Static Web App resource.
3. In **Custom domains**, select `ilexicon.com` → **Set default**. Azure then redirects
   `www.ilexicon.com` (and the azurestaticapps.net host) to the apex with a 301. If you prefer
   `www` as canonical, set that one as default instead and change `site.url` in
   `src/content/site.ts` so the canonical and sitemap URLs match.
4. Certificates are issued automatically. When the status shows **Ready** for both, run the
   checklist in section 4 again with `H=https://ilexicon.com`, plus:
   ```
   curl -sI https://www.ilexicon.com/ | grep -iE '^(HTTP|location)'   # 301 → https://ilexicon.com/
   ```
5. Search Console: verify `ilexicon.com`, submit `https://ilexicon.com/sitemap-index.xml`, and
   request removal of the old URLs that now 301.
6. Cancel the old hosting once DNS has fully propagated.

Note: `public/staticwebapp.config.json` already lists both hostnames under
`forwardingGateway.allowedForwardedHosts`, which SWA requires once custom domains are in use.
