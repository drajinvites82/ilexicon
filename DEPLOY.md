# Running ilexicon.com (HostGator cPanel, over SSH)

Live since 16 October 2026 at https://ilexicon.com. The site is static: `npm run build` writes
`dist/`, including `.htaccess` (redirects, clean URLs, the 404 page, caching and security headers)
and `contact.php` (the contact form handler). The deploy script copies `dist/` to the server over SSH.

- Server: `gator4044.hostgator.com`, SSH port 2222, cPanel user `ilexicon`
- Live site: `~/public_html`
- SSH host alias `ilexicon-host` in `~/.ssh/config`, key `~/.ssh/ilexicon_hostgator`
  (`C:\Users\rajin\.ssh\ilexicon_hostgator`, no passphrase)
- Contact form: `/contact.php` emails ideas@ilexicon.com from `ilexicon.com <noreply@ilexicon.com>`

Run the npm scripts from PowerShell or Git Bash on this machine; they run under Git Bash, never WSL.

## Updating the site

1. Edit, then check locally: `npm run build && npm run check`, and `npm run preview` →
   http://localhost:4321.
2. Commit and push to `main`.
3. Optional, for bigger changes: publish to a preview first (see below).
4. `npm run deploy:prod`
5. Spot-check https://ilexicon.com (the checks below).

`deploy:prod` first backs up the whole of `public_html` to `~/backup-public_html-<date-time>.tgz`
and prints the name, then syncs `public_html` to `dist/` with rsync on the server: files are
overwritten in place and stale ones removed afterwards, so the site is never empty mid-deploy.
`cgi-bin`, `.well-known` (AutoSSL) and `.website_97699493` (dhiyaexports.in's document root, which
holds root-owned files) are left alone. Delete old backups from the home directory now and then.

## Preview (optional)

The preview subdomain was removed after launch. To bring it back for a review:

```
ssh ilexicon-host 'uapi SubDomain addsubdomain domain=new rootdomain=ilexicon.com dir=/home4/ilexicon/new.ilexicon.com'
npm run deploy:preview      # → https://new.ilexicon.com (sends X-Robots-Tag: noindex)
```

When done, remove it:

```
ssh ilexicon-host 'cpapi2 SubDomain delsubdomain domain=new.ilexicon.com && rm -rf ~/new.ilexicon.com'
```

## Checks (Git Bash)

```
for p in / /services /careers /about /contact; do curl -s -o /dev/null -w "%{http_code}  $p\n" "https://ilexicon.com$p"; done   # all 200
for p in index.html services.html analytics.html big.html bp.html digital.html application.html ecommerce.html cms.html iot.html aboutus.html contactus.html contactus career.html blog-comment.html; do
  printf "%-20s " "/$p"; curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" "https://ilexicon.com/$p"
done                                                                                # every row 301 → new path
curl -s -o /dev/null -w "%{http_code}\n" https://ilexicon.com/does-not-exist         # 404
curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" http://www.ilexicon.com/   # 301 → https://ilexicon.com/
curl -sI https://ilexicon.com/ | grep -i x-robots-tag                                 # nothing
```

Contact form: send one enquiry from https://ilexicon.com/contact and confirm it reaches
ideas@ilexicon.com. If mail lands in spam, fix it in cPanel → Email → Email Deliverability
(SPF/DKIM for ilexicon.com), not in code.

## Rollback

```
ssh ilexicon-host
ls -t backup-public_html-*.tgz        # newest first; if a deploy retried, use the oldest from that run
rm -rf public_html/* && tar xzf backup-public_html-<date-time>.tgz
```

`backup-public_html-2026-10-16-001700.tgz` is the old (pre-2026) site, kept as an archive.

## Things to know about this server

- **SSH throttling.** The server resets SSH connections that arrive close together. The deploy
  script does all remote work in one connection and retries up to five times, 30 seconds apart;
  if all five fail, wait a few minutes and run it again.
- **Bot challenge on PHP.** HostGator answers the first request to any PHP script with a 409 page
  that sets a `humans_NNNN` cookie. `src/scripts/contact.ts` reads that cookie from the 409, sets
  it and retries once. Asking HostGator to exempt `/contact.php` would make this unnecessary.
  When testing `contact.php` with curl, send the cookie: `-H "Cookie: humans_21909=1"`.
- **ModSecurity** rejects POSTs to static paths (406) and POSTs whose honeypot contains a URL.
  Real messages that mention web addresses get through.
- **PHP version:** ilexicon.com inherits the account default (ea-php83). `contact.php` needs 8.1+.

## Contact form rules

- The mailbox noreply@ilexicon.com must keep existing in cPanel; it is the From address.
- The five dropdown options in `src/components/ContactForm.astro` must match `INTERESTS` in
  `public/contact.php`; the server rejects anything else.

## Open items

- Search Console: verify `ilexicon.com`, submit `https://ilexicon.com/sitemap-index.xml`.
- Optional: ask HostGator to exempt `/contact.php` from the bot challenge.

## The deploy key

To revoke it: cPanel → Security → SSH Access → Manage SSH Keys → `claude-code-deploy` →
Deauthorize, then Delete. To make a new one, see `ssh-keygen` in Git Bash and import the `.pub` there.
