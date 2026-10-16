#!/usr/bin/env bash
# Deploy dist/ to HostGator over SSH (host alias "ilexicon-host" in ~/.ssh/config).
#   preview → ~/new.ilexicon.com    prod → ~/public_html (backed up to ~/backup-public_html-<date>.tgz first)
# The server throttles SSH connections, so everything remote happens in one connection, retried.
set -euo pipefail

target="${1:-}"
case "$target" in
  preview) dir="new.ilexicon.com" ;;
  prod) dir="public_html" ;;
  *) echo "usage: deploy.sh preview|prod" >&2; exit 2 ;;
esac

# Git Bash only: WSL's bash has a different home and no deploy key.
case "$(uname -s)" in
  MINGW*|MSYS*|Darwin|Linux) ;;
  *) echo "Unsupported shell: $(uname -s)" >&2; exit 1 ;;
esac
if grep -qi microsoft /proc/version 2>/dev/null; then
  echo "Run this from Git Bash, not WSL (npm run deploy:$target)." >&2; exit 1
fi

cd "$(dirname "$0")/.."
npm run build
for f in dist/.htaccess dist/index.html dist/404.html; do
  [ -f "$f" ] || { echo "Missing $f; refusing to deploy." >&2; exit 1; }
done

bundle="$(mktemp -t ilexicon-dist.XXXXXX)"
trap 'rm -f "$bundle"' EXIT
tar czf "$bundle" -C dist .

# Runs on the server, reading the bundle from stdin.
remote=$(cat <<EOF
set -euo pipefail
cd ~
[ -d "$dir" ] || { echo "Remote dir ~/$dir does not exist" >&2; exit 1; }
if [ "$target" = prod ]; then
  backup="backup-public_html-\$(date +%F-%H%M%S).tgz"
  tar czf "\$backup" public_html
  echo "Backup: ~/\$backup (\$(du -h "\$backup" | cut -f1))"
fi
rm -rf .deploy-staging && mkdir .deploy-staging
tar xzf - -C .deploy-staging
# Overwrite in place, then remove stale files: the site is never empty mid-deploy. Keep cPanel's
# cgi-bin, AutoSSL's .well-known, and dhiyaexports.in's docroot (it holds root-owned files).
rsync -a --delete --exclude=/cgi-bin --exclude=/.well-known --exclude=/.website_97699493 \
  .deploy-staging/ "$dir"/
rm -rf .deploy-staging
ls -la "$dir"/.htaccess "$dir"/index.html
echo "Deployed to ~/$dir"
EOF
)

for attempt in 1 2 3 4 5; do
  set +e
  ssh -o BatchMode=yes -o ConnectTimeout=20 ilexicon-host "$remote" < "$bundle" 2> >(grep -v perl5 >&2)
  status=$?
  set -e
  [ "$status" -eq 0 ] && exit 0
  # 255 = the SSH connection itself failed (throttled); anything else is a remote error.
  [ "$status" -ne 255 ] && { echo "Remote step failed (exit $status)." >&2; exit "$status"; }
  echo "SSH connection failed (attempt $attempt); retrying in 30s…" >&2
  sleep 30
done
echo "Could not connect after 5 attempts." >&2
exit 1
