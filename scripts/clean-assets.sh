#!/usr/bin/env bash
#
# Remove hashed asset files on the server that the current build no longer uses.
#
#   ./scripts/clean-assets.sh              list what would be removed, ask, remove
#   ./scripts/clean-assets.sh --dry-run    list only
#
# Scope is deliberately narrow: only REMOTE_DIR/assets/ is ever touched. The web
# root itself and the sibling app folders (erp, klinik, ...) are never involved.
#
set -euo pipefail

cd "$(dirname "$0")/.."

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] || [ "${1:-}" = "-n" ] && DRY_RUN=1

die() { echo "error: $*" >&2; exit 1; }

[ -f deploy.config ] || die "deploy.config not found."
# shellcheck disable=SC1091
source ./deploy.config
[ "${DEPLOY_MODE:-}" = "ssh" ] || die "clean-assets requires DEPLOY_MODE=ssh."
: "${SSH_HOST:?}"; : "${SSH_USER:?}"; : "${REMOTE_DIR:?}"
SSH_PORT="${SSH_PORT:-65002}"

[ -d dist/assets ] || die "dist/assets missing — run npm run build first."

# Guard: an empty or malformed dist would make every remote asset look orphaned.
LOCAL_COUNT=$(find dist/assets -type f | wc -l | tr -d ' ')
[ "$LOCAL_COUNT" -gt 0 ] || die "dist/assets is empty — refusing to clean."

echo "==> local build has $LOCAL_COUNT assets"

REMOTE_ASSETS="$REMOTE_DIR/assets"
remote_list=$(ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "ls -1 '$REMOTE_ASSETS' 2>/dev/null" || true)
[ -n "$remote_list" ] || die "no assets found at $REMOTE_ASSETS"

orphans=""
while IFS= read -r f; do
  [ -n "$f" ] || continue
  [ -e "dist/assets/$f" ] || orphans="$orphans$f"$'\n'
done <<< "$remote_list"

orphans=$(printf '%s' "$orphans" | sed '/^$/d')

if [ -z "$orphans" ]; then
  echo "==> nothing to clean; server matches the build"
  exit 0
fi

echo "==> orphaned on server ($(printf '%s\n' "$orphans" | wc -l | tr -d ' ') files):"
printf '%s\n' "$orphans" | sed 's/^/    /'

if [ "$DRY_RUN" -eq 1 ]; then
  echo "==> dry run — nothing removed"
  exit 0
fi

echo
read -r -p "Delete these from $REMOTE_ASSETS? [y/N] " reply
[[ "$reply" =~ ^[Yy]$ ]] || { echo "aborted"; exit 1; }

printf '%s\n' "$orphans" \
  | ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" \
      "cd '$REMOTE_ASSETS' && xargs -d '\n' -r rm -f --"

echo "==> cleaned"
