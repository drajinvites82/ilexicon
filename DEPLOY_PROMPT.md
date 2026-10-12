# Prompt for the local Claude Code session (VS Code)

Paste everything below the line into Claude Code, opened in an empty folder on your laptop.
Before you start, have these ready: your Formspree form ID, the confirmed legal entity name,
and be able to sign in to GitHub (`gh auth login`) and Azure (`az login`) when prompted.

---

You are finishing the deployment of the ilexicon.com website. The site is already built and
committed; your job is to get it live on Azure Static Web Apps and verify it. Work step by step,
show me the output of each verification, and stop and ask me whenever a step needs something
only I can provide (a login, a secret value, a DNS change at the registrar). Never invent values.

## 0. Tools

Check that these are installed and report versions: `git`, `node` (must be 22.12 or newer),
`npm`, `gh` (GitHub CLI), `az` (Azure CLI). If any is missing, tell me the install command for
my OS and wait. Then run `gh auth status` and `az account show`; if either is not signed in,
run `gh auth login` / `az login` and wait for me to complete the browser login.

## 1. Get the code

First make `main` the default branch of `drajinvites82/ilexicon`:
`gh repo edit drajinvites82/ilexicon --default-branch main`, then confirm with
`gh repo view drajinvites82/ilexicon --json defaultBranchRef`. (The branch
`claude/ilexicon-website-build-k1zsb5` holds the same commits and can be deleted afterwards.)
Clone `https://github.com/drajinvites82/ilexicon.git` into the current folder (or `git pull`
if it is already here), check out `main`, and confirm `git log --oneline` shows the commit
"Add the local deployment prompt" or newer.
Read `README.md`, `DEPLOY.md` and `src/content/site.ts` fully before doing anything else.
`DEPLOY.md` is the authoritative runbook for everything below.

## 2. Build locally and show me the site

Run `npm ci`, then `npm run build` and `npm run check`. Both must finish with no errors.
Start `npm run preview` and give me the local URL so I can click through all six pages
(`/`, `/services`, `/careers`, `/about`, `/contact`, `/404`) on desktop and at a phone width.
Wait for my go-ahead before continuing.

## 3. Launch values

Ask me for two values and edit `src/content/site.ts`:
- `formspreeId`: replace `FORMSPREE_ID` with the ID I give you (the part after
  `https://formspree.io/f/`). Do not change anything else about the form.
- `legalEntity`: confirm or replace `iLexicon LLC`.
Also ask whether I want to change any of the six positions in `src/content/jobs.ts`.
Rebuild, grep `dist/` for the banned strings listed in `handoff/README.md` (none may appear),
then commit with the message "Set Formspree ID and legal entity" and push to `main`.
Do not push until I confirm the two values.

## 4. Create the Azure Static Web App

Follow `DEPLOY.md` section 2, CLI route, with my signed-in subscription:
- resource group `rg-ilexicon-web` in `centralus`
- Static Web App `ilexicon-site`, SKU `Free`, no deployment source linked (we use our own
  GitHub Actions workflow, already in `.github/workflows/azure-static-web-apps.yml`)
Print the default hostname (`<name>.azurestaticapps.net`). Fetch the deployment token with
`az staticwebapp secrets list ... --query properties.apiKey -o tsv` and store it directly as
the GitHub repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` on `drajinvites82/ilexicon`
using `gh secret set`. Never print the token in the terminal, never write it to a file, and
never commit it. Confirm the secret exists with `gh secret list`.

## 5. First deployment

Trigger the workflow: either the push from step 3 already did, or run
`gh workflow run "Azure Static Web Apps" --ref main`. Watch it with `gh run watch` and
show me the result. If it fails, read the logs with `gh run view --log-failed`, fix the
cause in the repo, commit, push, and watch again until it is green. Do not disable or skip
any step of the workflow.

## 6. Verify the preview

Set `H` to the azurestaticapps.net URL and run every command in `DEPLOY.md` section 4:
all five pages return 200, every row of the redirect table returns 301 with the exact
location shown, unknown paths return 404 with the branded page, `/services/` redirects to
`/services`, the security headers are present, the manifest has the right content type,
sitemap and robots are served. Show me the output as a table of path → status → location,
and flag any row that differs from the expected value. Then run the form test from the same
section with me: I will submit the form in my browser and confirm the email arrived at
ideas@ilexicon.com; you check that the honeypot and offline cases behave as described.
Finally run Lighthouse in mobile mode against the preview URL for `/`, `/services`,
`/careers`, `/about` and `/contact` (`npx lighthouse <url> --preset=perf` is not enough; use
the default mobile run with all four categories) and report the four scores per page.
Anything under 95 on an indexable page is yours to fix.

## 7. Custom domain

Walk me through `DEPLOY.md` section 5 one record at a time: give me the exact DNS records to
add at my registrar for `www.ilexicon.com` (CNAME) and the apex `ilexicon.com` (TXT, then
ALIAS/ANAME or Azure DNS alias), wait while I add each one, then run the Azure validation
with `az staticwebapp hostname set` and poll `az staticwebapp hostname show` until the
status is Ready. Set `ilexicon.com` as the default domain. When both show Ready and HTTPS
works, rerun the section 4 checklist with `H=https://ilexicon.com` and confirm that
`https://www.ilexicon.com/` 301s to the apex.

## 8. Hand-off

Give me a final summary: the live URL, the preview URL, the resource group and app name,
the exact git commit that is deployed, the Lighthouse scores, and a short list of anything
left open (for example Search Console verification and sitemap submission, and cancelling
the old hosting once DNS has propagated). Do not create any additional Azure resources,
do not add analytics or any third-party script, and do not change copy on the site.
