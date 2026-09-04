# Aftech Corporate Website

PT Aftech Daya Solusindo company profile — React + Vite + TypeScript + Tailwind CSS + Framer Motion, built per `AFTECH-CORPORATE-WEBSITE-PRD.md`.

## Development

```bash
npm install
npm run dev
```

## Build & verify

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

Build output goes to `dist/`.

## Deploy (Hostinger)

Live at https://aftech.co.id. Two routes to production, both landing in
`/home/u532067520/domains/aftech.co.id/public_html`.

**Automatic** — every push to `main` runs `.github/workflows/deploy.yml`: build,
sanity-check `dist/`, rsync over SSH, then smoke-test the live URLs. Credentials
come from repo secrets (`HOSTINGER_HOST`, `_PORT`, `_USER`, `_REMOTE_DIR`,
`_SSH_KEY`); the `VITE_*` build values come from repo variables.

**Manual** — from a machine with `deploy.config` filled in (see
`deploy.config.example`):

```bash
npm run deploy:dry    # preview the file list, upload nothing
npm run deploy        # build, verify, upload
```

Afterwards, purge the CDN cache in hPanel (Dashboard → Cache → Hapus cache);
that step is not automated.

### The web root is shared

`public_html` also hosts `adminklinik`, `budget`, `eptms`, `erp`, `klinik`, `mk`
and `smart`. Two consequences:

- Deploys never delete. `DELETE_STALE=0` in `deploy.config`, and the workflow
  runs rsync without `--delete`, so a stray local deletion can never take a
  sibling app down. Stale hashed assets are pruned deliberately with
  `npm run clean:assets` (scoped to `assets/`, nothing else).
- `public/.htaccess` excludes those paths from the SPA rewrite, so their URLs
  reach their own front controllers instead of `index.html`.

Both the workflow's smoke test and any manual check should confirm those sibling
paths still return 200.

### After a content or config change

`$RECIPIENT_EMAIL` in `public/api/contact.php` is the contact-form inbox.
`VITE_SITE_URL` in `.env` drives canonical and OG URLs — the build fails the
sanity check if `example.com` placeholders survive into `dist/`.

The PHP endpoint cannot be exercised locally (no PHP runtime in the dev
environment), so submit a real test message after deploying and check the
recipient's spam folder — `mail()` from shared hosting is frequently filtered.

## Content status

Project, client, and team data in `src/data/` are placeholders (bracketed, e.g. `[CLIENT NAME]`) per the PRD's content-governance rules. Replace with verified information before publishing. Imagery is a placeholder gradient/pattern treatment (`ImageReveal` component) — swap in real photography per PRD sec 26 image strategy.
