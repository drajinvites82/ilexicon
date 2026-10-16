# Deploying ilexicon.com (HostGator cPanel, over SSH)

The site is static. `npm run build` writes `dist/`, including `.htaccess` (redirects, clean URLs, the
404 page, caching and security headers). The deploy scripts copy `dist/` to the server over SSH.

- Server: `gator4044.hostgator.com`, SSH port 2222, cPanel user `ilexicon`
- Live site: `~/public_html` → https://ilexicon.com
- Preview: `~/new.ilexicon.com` → https://new.ilexicon.com (sends `X-Robots-Tag: noindex`)
- SSH host alias `ilexicon-host` in `~/.ssh/config`, key `~/.ssh/ilexicon_hostgator`

Run the scripts from PowerShell or Git Bash on this machine (they run under Git Bash, never WSL). The
server sometimes drops SSH connections when several arrive close together; the script does all
remote work in one connection and retries up to five times, 30 seconds apart.

## 1. Preview

```
npm run deploy:preview
```

Open https://new.ilexicon.com and check:

- every nav link, on desktop and at phone width
- `/services#team-augmentation` scrolls to that section
- `/nothing-here` shows the branded 404 page
- one real contact-form submission arrives at ideas@ilexicon.com with the subject
  `iLexicon enquiry: <selection>` (the first submission to the form asks you to confirm the address
  once). If the Formspree form has "Restrict to domain" on, allow `new.ilexicon.com` for this test.
- honeypot: DevTools → Console, run `document.getElementById('cf-gotcha').value = 'x'`, fill the form
  and send. The success box shows, the Network tab shows no request to formspree.io, nothing arrives.

## 2. Launch

```
npm run deploy:prod
```

It first backs up the whole of `public_html` to `~/backup-public_html-<date-time>.tgz` and prints the
name, then replaces the contents of `public_html` with `dist/`. Only `cgi-bin` and `.well-known`
(AutoSSL) are kept. The old site's pages and PHP scripts, and the empty `.website_97699493` folder
used by dhiyaexports.in, are removed; they remain in the backup.

## 3. After launch (Git Bash)

```
for p in index.html services.html analytics.html big.html bp.html digital.html application.html ecommerce.html cms.html iot.html aboutus.html contactus.html contactus career.html blog-comment.html; do
  printf "%-20s " "/$p"; curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" "https://ilexicon.com/$p"
done
curl -s -o /dev/null -w "%{http_code}\n" https://ilexicon.com/does-not-exist        # expect 404
curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" http://www.ilexicon.com/   # expect 301 → https://ilexicon.com/
curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" http://ilexicon.com/       # expect 301 → https://ilexicon.com/
curl -sI https://ilexicon.com/ | grep -i x-robots-tag                               # expect nothing
```

Every old URL must show `301` with its new path.

## 4. Then

1. Lighthouse (mobile) on https://ilexicon.com, /services, /careers, /about, /contact: all four
   categories ≥ 95.
2. cPanel → SSL/TLS Status: AutoSSL covers `ilexicon.com` and `www.ilexicon.com`.
3. Remove the preview: cPanel → Domains → delete `new.ilexicon.com`, then
   `ssh ilexicon-host 'rm -rf ~/new.ilexicon.com'`.
4. Search Console: verify `ilexicon.com`, submit `https://ilexicon.com/sitemap-index.xml`.

## Rollback

```
ssh ilexicon-host
ls -t backup-public_html-*.tgz        # if a deploy retried, use the oldest one from that run
rm -rf public_html && tar xzf backup-public_html-<date-time>.tgz
```

## Updating the site later

Edit, commit, push, then `npm run deploy:prod`.

## The deploy key

`~/.ssh/ilexicon_hostgator` on this machine (`C:\Users\rajin\.ssh\ilexicon_hostgator`), no
passphrase. To revoke it: cPanel → Security → SSH Access → Manage SSH Keys → `claude-code-deploy` →
Deauthorize, then Delete.
