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

1. `npm run build`
2. Upload the contents of `dist/` to `public_html/` (including `.htaccess`, `robots.txt`, `sitemap.xml`, `api/contact.php`).
3. Edit `public_html/api/contact.php`: set `$RECIPIENT_EMAIL` to the verified company inbox.
4. Copy `.env.example` to `.env`, set `VITE_SITE_URL` to the live domain, and rebuild before final upload so canonical/OG URLs are correct.
5. Verify: direct route access, page refresh on a nested route, HTTPS, and submit a real test message through the contact form (the PHP endpoint cannot be tested locally — no PHP runtime in the dev environment).

## Content status

Project, client, and team data in `src/data/` are placeholders (bracketed, e.g. `[CLIENT NAME]`) per the PRD's content-governance rules. Replace with verified information before publishing. Imagery is a placeholder gradient/pattern treatment (`ImageReveal` component) — swap in real photography per PRD sec 26 image strategy.
