#!/usr/bin/env bash
#
# Deploy dist/ to Hostinger.
#
#   ./scripts/deploy.sh              build, show what would change, ask, upload
#   ./scripts/deploy.sh --dry-run    build + show the diff only, never upload
#   ./scripts/deploy.sh --no-build   upload the existing dist/ as-is
#   ./scripts/deploy.sh -y           skip the confirmation prompt
#
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT=$(pwd)

DRY_RUN=0
BUILD=1
ASSUME_YES=0
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY_RUN=1 ;;
    --no-build)   BUILD=0 ;;
    -y|--yes)     ASSUME_YES=1 ;;
    -h|--help)    sed -n '3,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

die() { echo "error: $*" >&2; exit 1; }

# --- config -----------------------------------------------------------------
[ -f deploy.config ] || die "deploy.config not found. Copy deploy.config.example to deploy.config and fill it in."
# shellcheck disable=SC1091
source ./deploy.config

: "${DEPLOY_MODE:?set DEPLOY_MODE in deploy.config}"
: "${REMOTE_DIR:?set REMOTE_DIR in deploy.config}"
KEEP="${KEEP:-}"
# 0 = never remove anything on the server (safe default; use when REMOTE_DIR is
# shared with other apps). 1 = remove server files that are no longer in dist/.
DELETE_STALE="${DELETE_STALE:-0}"

case "$REMOTE_DIR" in
  /|/home|/home/|"") die "REMOTE_DIR=$REMOTE_DIR is unsafe. Point it at the site's public_html." ;;
esac
case "$REMOTE_DIR" in
  */public_html|*/public_html/) ;;
  *) echo "warning: REMOTE_DIR ($REMOTE_DIR) does not end in public_html." >&2 ;;
esac

# --- build ------------------------------------------------------------------
if [ "$BUILD" -eq 1 ]; then
  echo "==> building"
  npm run build
fi

[ -f dist/index.html ] || die "dist/index.html missing — build did not produce a site."
[ -f dist/.htaccess ]  || die "dist/.htaccess missing — SPA routes would 404. Check public/.htaccess."
[ -f dist/api/contact.php ] || echo "warning: dist/api/contact.php missing — contact form will not work." >&2

if grep -rqs "example\.com" dist/sitemap.xml dist/robots.txt; then
  die "dist still contains example.com placeholders. Fix the source files and rebuild."
fi

# --- upload -----------------------------------------------------------------
if [ "$DRY_RUN" -eq 1 ]; then
  echo "==> DRY RUN — nothing will be uploaded"
elif [ "$ASSUME_YES" -eq 0 ]; then
  echo
  echo "About to sync dist/ -> $DEPLOY_MODE:$REMOTE_DIR"
  if [ "$DELETE_STALE" -eq 1 ]; then
    echo "DELETE_STALE=1 — server files not present in dist/ WILL BE DELETED (protected: ${KEEP:-none})."
  else
    echo "DELETE_STALE=0 — nothing on the server is deleted; files are only added/overwritten."
  fi
  read -r -p "Continue? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { echo "aborted"; exit 1; }
fi

case "$DEPLOY_MODE" in
  ssh)
    : "${SSH_HOST:?set SSH_HOST}"; : "${SSH_USER:?set SSH_USER}"
    SSH_PORT="${SSH_PORT:-65002}"
    command -v rsync >/dev/null || die "rsync not found"

    RSYNC_ARGS=(-az --human-readable --itemize-changes
                --exclude='.DS_Store' --exclude='*.map')
    [ "$DELETE_STALE" -eq 1 ] && RSYNC_ARGS+=(--delete)
    for pat in $KEEP; do RSYNC_ARGS+=(--filter="protect $pat"); done
    [ "$DRY_RUN" -eq 1 ] && RSYNC_ARGS+=(--dry-run)

    echo "==> rsync -> $SSH_USER@$SSH_HOST:$REMOTE_DIR"
    rsync "${RSYNC_ARGS[@]}" -e "ssh -p $SSH_PORT" \
      "$ROOT/dist/" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"
    ;;

  ftp)
    : "${FTP_HOST:?set FTP_HOST}"; : "${FTP_USER:?set FTP_USER}"; : "${FTP_PASS:?set FTP_PASS}"
    command -v lftp >/dev/null || die "lftp not found. Install it: brew install lftp"

    MIRROR_ARGS="--reverse --verbose --parallel=4 --exclude-glob .DS_Store --exclude-glob *.map"
    [ "$DELETE_STALE" -eq 1 ] && MIRROR_ARGS="$MIRROR_ARGS --delete"
    for pat in $KEEP; do MIRROR_ARGS="$MIRROR_ARGS --exclude-glob $pat"; done
    [ "$DRY_RUN" -eq 1 ] && MIRROR_ARGS="$MIRROR_ARGS --dry-run"

    echo "==> lftp -> $FTP_USER@$FTP_HOST:$REMOTE_DIR"
    lftp -c "
      set ftp:ssl-force true;
      set ftp:ssl-protect-data true;
      set net:max-retries 2;
      set cmd:fail-exit true;
      open -u '$FTP_USER','$FTP_PASS' '$FTP_HOST';
      mirror $MIRROR_ARGS '$ROOT/dist/' '$REMOTE_DIR';
    "
    ;;

  *) die "DEPLOY_MODE must be 'ssh' or 'ftp' (got: $DEPLOY_MODE)" ;;
esac

if [ "$DRY_RUN" -eq 1 ]; then
  echo "==> dry run finished — nothing changed on the server"
else
  echo "==> deployed. Check https://www.aftech.co.id and hard-reload (Cmd+Shift+R)."
fi
