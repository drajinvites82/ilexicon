# Claude Code prompt — retarget ilexicon.com to HostGator shared hosting, wire Formspree, deploy over SSH

**Before you paste:** nothing. Claude Code generates the SSH key itself and stops at step 7 to ask you to authorize it in cPanel. You will do that one thing in the browser (two minutes), then tell it to continue.

Paste everything below this line into Claude Code, opened in `C:\C\GitHub\ilexicon` (repo `drajinvites82/ilexicon`, branch `main`).

---

The site is built to the v3 spec and is currently wired for **Azure Static Web Apps** (`public/staticwebapp.config.json`, `.github/workflows/azure-static-web-apps.yml`, an Azure `DEPLOY.md`). Nothing was ever created in Azure. Hosting has changed: it lives on **HostGator cPanel shared hosting (Apache 2.4)**, server `gator4044.hostgator.com`, cPanel user `ilexicon`, document root `/home4/ilexicon/public_html`, where the old site is live today. DNS for `ilexicon.com` is already on HostGator's nameservers (`ns8087`/`ns8088.hostgator.com`), so launch is a file swap with no DNS change. SSH is on **port 2222**. You will deploy over SSH.

This machine is **Windows**. Run shell steps in **Git Bash** (`C:\Program Files\Git\bin\bash.exe`), not WSL: a bare `bash` from cmd/npm resolves to WSL's `C:\Windows\System32\bash.exe`, which has a different home directory and no access to the deploy key. `rsync` is not installed locally, so the deploy uses tar over SSH.

Make the changes below, in order. Do not touch design, layout or copy beyond what a step explicitly asks. Each numbered step ends with `npm run build` passing, `npm run check` passing, and a commit to `main` with a one-line message. Do not push until step 10. Stop and ask me only where a step says to.

## 1. Build output for Apache

In `astro.config.mjs`, add `build: { format: 'file' }` so pages emit as `dist/services.html`, `dist/about.html`, `dist/careers.html`, `dist/contact.html`, `dist/404.html`, with `dist/index.html` for home. The rest is already correct: `site: 'https://ilexicon.com'`, `output: 'static'`, `trailingSlash: 'never'`, and `@astrojs/sitemap` filtering out `/404`.

**Fix canonical URLs.** With `format: 'file'`, `Astro.url.pathname` includes `.html`, so `Base.astro` currently emits `<link rel="canonical" href="https://ilexicon.com/services.html">` and the same `og:url` (home becomes `/index.html`). Those URLs 301 under the new `.htaccess`. In `Base.astro`, strip a trailing `.html` and map `/index` to `/`, so canonicals and `og:url` are `https://ilexicon.com/`, `https://ilexicon.com/services` and so on. The sitemap already emits clean URLs; leave it alone.

Verify: `ls -A dist/` shows the six `.html` files at the root, `sitemap-index.xml`, `sitemap-0.xml`, `robots.txt`, `favicon.svg`, `logo.svg`, `og.png`, `apple-touch-icon.png`, `site.webmanifest`, and an `_astro/` folder with hashed CSS and fonts (the JS is inlined into the pages, so there may be no `.js` files there). Then run `grep -o 'rel="canonical" href="[^"]*"' dist/*.html`: no value may end in `.html`.

## 2. Remove everything Azure

- Delete `public/staticwebapp.config.json` and `.github/workflows/azure-static-web-apps.yml`. Without the latter, pushes to `main` no longer trigger a deploy that would fail for lack of a token.
- Remove Azure Static Web Apps references from `README.md`. `DEPLOY.md` is rewritten in step 10.
- Leave `handoff/` untouched; it is the original design package and spec, kept for reference.
- There is no Cloudflare beacon or `_redirects` in the repo; confirm that and move on.
- Check: `grep -rniE "cloudflare|staticwebapp|azurestaticapps|_redirects" src public README.md astro.config.mjs package.json` must return nothing. Mentions of "Azure" as a skill in `src/content/jobs.ts` and `services.ts` are copy; keep them.

## 3. Add `public/.htaccess`

Create `public/.htaccess` with exactly this content:

```apache
# iLexicon — Apache config for cPanel shared hosting. Shipped from public/ by the Astro build.

Options -Indexes -MultiViews
DirectoryIndex index.html
ErrorDocument 404 /404.html
AddType application/manifest+json .webmanifest

<IfModule mod_rewrite.c>
  RewriteEngine On

  # 0. Never redirect certificate validation (AutoSSL)
  RewriteRule ^\.well-known/ - [END]

  # 1. www → apex, then http → https on the same host (so new.ilexicon.com stays put)
  RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]
  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

  # 2. Old site → new URLs. NE keeps the #anchor in the target.
  RewriteCond %{THE_REQUEST} \s/index\.html[\s?] [NC]
  RewriteRule ^index\.html$                           /                            [R=301,L]
  RewriteRule ^(analytics|big|bp|digital)\.html$      /services#data-integration   [R=301,L,NE]
  RewriteRule ^(application|ecommerce|cms|iot)\.html$ /services#development        [R=301,L,NE]
  RewriteRule ^aboutus\.html$                         /about                       [R=301,L]
  RewriteRule ^contactus(\.html)?$                    /contact                     [R=301,L]
  RewriteRule ^career\.html$                          /careers                     [R=301,L]
  RewriteRule ^blog-comment\.html$                    /                            [R=301,L]

  # 3. /404 and /404.html requested directly → real 404 status with the branded page
  RewriteCond %{THE_REQUEST} \s/404(\.html)?[\s?] [NC]
  RewriteRule ^ - [R=404,L]

  # 4. Any other direct *.html request → its clean URL (covers services.html → /services)
  RewriteCond %{THE_REQUEST} \s/([^.\s?]+)\.html[\s?] [NC]
  RewriteRule ^ /%1 [R=301,L]

  # 5. Trailing slash → none (trailingSlash: 'never'), except real directories
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.+)/$ /$1 [R=301,L]

  # 6. Clean URL → file on disk (services → services.html). END stops .htaccess
  #    reprocessing, so the rewritten name never re-enters the redirect rules above.
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)$ $1.html [END]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json application/xml application/manifest+json image/svg+xml
</IfModule>

<IfModule mod_headers.c>
  # Caching: hashed assets under /_astro/ are immutable; HTML is always revalidated
  <If "%{REQUEST_URI} =~ m#^/_astro/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
  <ElseIf "%{REQUEST_URI} =~ m#(^/[^.]*|\.html)$#">
    Header set Cache-Control "no-cache"
  </ElseIf>
  <Else>
    Header set Cache-Control "public, max-age=3600"
  </Else>

  # Security headers (carried over from the Azure config), on every response including 301/404
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"

  # Keep the preview subdomain out of search results
  <If "%{HTTP_HOST} == 'new.ilexicon.com'">
    Header always set X-Robots-Tag "noindex, nofollow"
  </If>
</IfModule>
```

Do not add `RewriteBase`. The preview subdomain (step 9) uses the same file: rule 1 only sends `www.` hosts to the apex, and the http → https redirect keeps the host, so `new.ilexicon.com` is never redirected to the live site.

Verify after build: `dist/.htaccess` exists and `cmp public/.htaccess dist/.htaccess` reports no difference. (A trial build confirmed that Astro copies the dotfile from `public/`; add a `postbuild` copy only if that turns out to be false.)

## 4. Wire the contact form to Formspree

Most of this is already built (`ContactForm.astro`, `src/scripts/contact.ts`). Change only what differs:

- `src/content/site.ts`: `formspreeId: 'mdeaylaw'`. The endpoint is `https://formspree.io/f/mdeaylaw`. The `<form>` already has `action={endpoint} method="POST"`, the field names `name`, `email`, `company`, `interest` (the five visible labels as option values) and `message`, and a hidden `_subject`. Confirm these and leave them as they are.
- **Rename the honeypot from `website` to `_gotcha`** (input `id="cf-gotcha"`, `name="_gotcha"`). Formspree only filters on `_gotcha`, which matters for the no-JS fallback. Keep it visually off-screen (not `display:none`), with `tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"` and no `required`. Update the comment in `ContactForm.astro` and the honeypot check in `contact.ts` to match. Keep the current client behaviour: a filled honeypot shows success and sends nothing.
- `contact.ts` already validates, sets `_subject` to `iLexicon enquiry: {interest}`, POSTs with `Accept: application/json`, and shows the success and `role="alert"` error states with values preserved. Add only this: while the request is in flight, disable Send and set its label to "Sending…", then restore "Send" and re-enable it on error.
- **Do not POST to Formspree during development.** It counts against the 50/month quota and emails me. Verify the request shape by stubbing `fetch` or logging the `FormData` entries, then remove the stub.

## 5. Entity and footer

- `src/content/site.ts`: `legalEntity: 'Lexicon IT Ltd'`. The footer already renders `© {year} {site.legalEntity}`, with the year from `new Date()` at build time. Remove the "placeholder" wording from the comments in `site.ts`.
- The Privacy link is already hidden (`privacy.show: false`) and there is no `/privacy` page. Leave it.
- JSON-LD `Organization` in `src/pages/index.astro`: add `legalName: site.legalEntity`. `name` (iLexicon), `url`, `email`, `telephone`, `PostalAddress` (Sioux Falls) and `foundingDate` (2016) are already there.

## 6. Checks on `dist/`

Run these in Git Bash and fix anything they catch:

```bash
npm run build && npm run check
ls -la dist/.htaccess dist/index.html dist/services.html dist/careers.html dist/about.html dist/contact.html dist/404.html
grep -rilE "cloudflare|_redirects|staticwebapp" dist/ ; echo "(must be empty)"
grep -rilE "book a call|30-minute|boutique|body shop|chennai|india|offshore|onshore|\+91" dist/*.html ; echo "(must be empty)"
grep -rohiE "[a-z]?lexicon[^<\"]{0,12}" dist/*.html | grep -vi "^ilexicon" | sort | uniq -c ; echo "(must show only 'Lexicon IT Ltd' — © line and legalName)"
grep -rl "mdeaylaw" dist/*.html ; echo "(must list contact.html only)"
grep -rl 'name="website"' dist/*.html ; echo "(must be empty — honeypot is _gotcha)"
grep -o 'rel="canonical" href="[^"]*"' dist/*.html ; echo "(no .html in any value)"
for f in dist/*.html; do printf "%-22s %6s bytes inline JS\n" "$f" "$(grep -o '<script[^>]*>[^<]*</script>' "$f" | grep -v ld+json | wc -c)"; done
cat dist/_astro/*.js 2>/dev/null | wc -c ; echo "(external JS bytes; total JS must stay under 30 KB)"
```

## 7. SSH key — then STOP and wait for me

Generate a deploy key on this machine in Git Bash. The private key never enters the repo.

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/ilexicon_hostgator -C "claude-code-deploy" -N ""
cat ~/.ssh/ilexicon_hostgator.pub
```

`~/.ssh/config` already exists and has other hosts. **Append** this block without touching the existing entries:

```
Host ilexicon-host
  HostName gator4044.hostgator.com
  Port 2222
  User ilexicon
  IdentityFile ~/.ssh/ilexicon_hostgator
  IdentitiesOnly yes
```

Print the public key and tell me to do this in cPanel, then **stop**:

> In cPanel → Security → **SSH Access** → **Manage SSH Keys** → **Import Key**. Name: `claude-code-deploy`. Paste the public key into the *Public Key* box (leave the private key box empty). Save. Back on Manage SSH Keys, click **Manage** next to the new key → **Authorize**. Then tell me "key authorized".

When I say it's authorized, run in Git Bash:

```bash
ssh ilexicon-host 'echo ok && pwd && which tar && ls -la public_html'
```

If it connects, show me the `public_html` listing. If it contains any folder that is not part of the old ilexicon.com site (for example an addon domain's document root), **stop and ask me** before step 8; the deploy clears this directory. If the connection fails with "connection refused" or times out, tell me (HostGator may need to enable SSH on the account; their live chat does it in minutes) and wait.

## 8. Deploy script

Create `scripts/deploy.sh` (bash, `set -euo pipefail`) with two targets:

- `preview` → remote dir `new.ilexicon.com` (relative to the home dir, i.e. `/home4/ilexicon/new.ilexicon.com`)
- `prod` → remote dir `public_html`

Behaviour (tar over SSH; there is no local rsync):

1. `npm run build`.
2. Fail if `dist/.htaccess` or `dist/index.html` is missing.
3. For `prod` only: `ssh ilexicon-host 'tar czf ~/backup-public_html-$(date +%F-%H%M).tgz public_html'` and print the backup filename. Keep this; it's the rollback.
4. Upload to a staging dir: `ssh ilexicon-host 'rm -rf ~/.deploy-staging && mkdir -p ~/.deploy-staging'`, then `tar czf - -C dist . | ssh ilexicon-host 'tar xzf - -C ~/.deploy-staging'`.
5. Swap in one SSH call, so the site is half-replaced for only a moment: `mkdir -p <dir> && find <dir> -mindepth 1 -maxdepth 1 ! -name cgi-bin ! -name .well-known -exec rm -rf {} + && cp -a ~/.deploy-staging/. <dir>/ && rm -rf ~/.deploy-staging`. The two exclusions keep cPanel's `cgi-bin` and the `.well-known` folder AutoSSL uses for certificate renewal.
6. Then `ssh ilexicon-host 'ls -la <dir>/.htaccess <dir>/index.html'` to prove the dotfile landed.

npm scripts must run the script with **Git Bash**, not WSL. Use `"deploy:preview": "\"C:/Program Files/Git/bin/bash.exe\" scripts/deploy.sh preview"` and `"deploy:prod": "\"C:/Program Files/Git/bin/bash.exe\" scripts/deploy.sh prod"`, or ask me if you prefer setting npm's `script-shell` in my user `.npmrc` instead (not the repo's). Have the script print `uname -s` first and abort unless it starts with `MINGW`, so it can never run under WSL by accident. `dist/` is already in `.gitignore`. Commit.

**Do not run `deploy:prod` in this session.** Preview only. I run prod myself after I've reviewed the preview.

## 9. Preview subdomain — ask me once, then deploy

Tell me to do this in cPanel, then wait:

> cPanel → Domains → **Create a New Domain**. Domain: `new.ilexicon.com`. Untick "Share document root"; set the document root to `/home4/ilexicon/new.ilexicon.com` (outside `public_html`, so the old site's `.htaccess` can't interfere). Submit. Then cPanel → Security → **SSL/TLS Status** → **Run AutoSSL**, and tell me "subdomain ready".

DNS is on HostGator's nameservers, so cPanel creates the `new` record itself. When I confirm, check `nslookup new.ilexicon.com` resolves, run `npm run deploy:preview`, then verify:

```bash
for u in / /services /careers /about /contact /services/ /about.html /404 /does-not-exist /aboutus.html /analytics.html; do
  printf "%-18s " "$u"; curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "https://new.ilexicon.com$u"
done
curl -s https://new.ilexicon.com/does-not-exist | grep -c "didn’t make the move"   # 1
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://new.ilexicon.com/services   # 301 → https://new.ilexicon.com/services
curl -sI -H "Accept-Encoding: gzip" https://new.ilexicon.com/ | grep -iE "content-encoding|cache-control|x-frame|referrer|permissions|nosniff|x-robots"
curl -sI https://new.ilexicon.com/site.webmanifest | grep -i content-type          # application/manifest+json
curl -sI "https://new.ilexicon.com/_astro/$(ssh ilexicon-host 'ls new.ilexicon.com/_astro | head -1')" | grep -i cache-control
curl -s https://new.ilexicon.com/sitemap-index.xml | head -c 300; echo; curl -s https://new.ilexicon.com/robots.txt
```

Expected: `/`, `/services`, `/careers`, `/about`, `/contact` → 200; `/services/` → 301 to `/services`; `/about.html` → 301 to `/about`; `/404` and `/does-not-exist` → 404 with the branded page; `/aboutus.html` → 301 `/about`; `/analytics.html` → 301 `/services#data-integration`; HTML with `content-encoding: gzip` and `cache-control: no-cache`; all four security headers plus `x-robots-tag: noindex`; `_astro` assets with `max-age=31536000, immutable`. Show me the results as a table of path → status → location, and flag any row that differs. If AutoSSL hasn't issued a certificate yet, HTTPS fails and http redirects to it, so wait a few minutes and rerun AutoSSL rather than testing over http.

Fix anything that fails and redeploy until all checks pass. Then run Lighthouse (mobile, all four categories) against the preview for `/`, `/services`, `/careers`, `/about`, `/contact` and report the scores. Ignore the SEO penalty caused by the preview's `noindex` header. Anything else under 95 is yours to fix; slow server response time on shared hosting is not, so just report it.

## 10. `DEPLOY.md`, then push

Rewrite `DEPLOY.md` at the repo root, for me:

1. **Preview:** `npm run deploy:preview` → open `https://new.ilexicon.com`. Check every nav link, that `/services#team-augmentation` scrolls to the section, that `/nothing-here` shows the 404 page, and send one real contact-form submission and confirm it arrives at ideas@ilexicon.com with the subject `iLexicon enquiry: <selection>` (the first submission to the form asks you to confirm the address once). If the Formspree form has "Restrict to domain" turned on, allow `new.ilexicon.com` for this test. Honeypot test: in DevTools → Console run `document.getElementById('cf-gotcha').value = 'x'`, fill and send. The success box shows, the Network tab shows no request to formspree.io, and nothing arrives.
2. **Launch:** `npm run deploy:prod`. It backs up the old `public_html` to a `.tgz` in the home directory first, then replaces the site.
3. **After launch, run from Git Bash:**
   ```
   for p in index.html services.html analytics.html big.html bp.html digital.html application.html ecommerce.html cms.html iot.html aboutus.html contactus.html contactus career.html blog-comment.html; do
     printf "%-20s " "/$p"; curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" "https://ilexicon.com/$p"
   done
   curl -s -o /dev/null -w "%{http_code}\n" https://ilexicon.com/does-not-exist        # expect 404
   curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" http://www.ilexicon.com/   # expect 301 → https://ilexicon.com/
   curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" http://ilexicon.com/       # expect 301 → https://ilexicon.com/
   ```
   Every row must show `301` with the new path.
4. Run Lighthouse (mobile) against `https://ilexicon.com`; all four categories ≥ 95.
5. cPanel → SSL/TLS Status: confirm AutoSSL covers `ilexicon.com` and `www.ilexicon.com`.
6. Delete the `new.ilexicon.com` subdomain in cPanel → Domains, and its folder `~/new.ilexicon.com`.
7. Search Console: verify `ilexicon.com`, submit `https://ilexicon.com/sitemap-index.xml`.
8. **Rollback:** `ssh ilexicon-host`, then `rm -rf public_html && tar xzf backup-public_html-<date>.tgz`.
9. **Updating the site later:** edit, commit, push, `npm run deploy:prod`.
10. **Key:** the deploy key is `~/.ssh/ilexicon_hostgator` on this machine. To revoke it: cPanel → SSH Access → Manage SSH Keys → Deauthorize/Delete.

Also update the Deploy section of `README.md` to point at `DEPLOY.md` and the two npm scripts. Commit `DEPLOY.md`, then `git push origin main` and delete the old remote branch `claude/ilexicon-website-build-k1zsb5`.

When everything above is done, print the step 6 check output, the step 9 curl table and the Lighthouse scores, and stop.
